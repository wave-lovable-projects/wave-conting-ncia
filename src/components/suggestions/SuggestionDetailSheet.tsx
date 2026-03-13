import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThumbsUp, ThumbsDown, Send, Loader2 } from 'lucide-react';
import { useVoteSuggestion, useSuggestionComments, useCreateSuggestionComment, useUpdateSuggestionStatus } from '@/hooks/useSuggestions';
import { useUIStore } from '@/store/ui.store';
import { SUGGESTION_STATUS_LABELS } from '@/types/suggestion';
import type { Suggestion, SuggestionStatus } from '@/types/suggestion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SuggestionDetailSheetProps {
  suggestion: Suggestion | null;
  onClose: () => void;
}

export function SuggestionDetailSheet({ suggestion, onClose }: SuggestionDetailSheetProps) {
  const user = useUIStore(s => s.user);
  const isAdmin = user?.role === 'ADMIN';
  const [commentText, setCommentText] = useState('');

  const vote = useVoteSuggestion();
  const updateStatus = useUpdateSuggestionStatus();
  const { data: comments } = useSuggestionComments(suggestion?.id || '');
  const createComment = useCreateSuggestionComment();

  if (!suggestion) return null;

  const handleComment = () => {
    if (!commentText.trim() || !user) return;
    createComment.mutate({
      suggestionId: suggestion.id,
      text: commentText.trim(),
      authorId: user.id,
      authorName: user.name,
    }, { onSuccess: () => setCommentText('') });
  };

  return (
    <Sheet open={!!suggestion} onOpenChange={v => { if (!v) onClose(); }}>
      <SheetContent className="w-[450px] sm:w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg pr-6">{suggestion.title}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-6">
          {/* Status */}
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <Select
                value={suggestion.status}
                onValueChange={v => updateStatus.mutate({ id: suggestion.id, status: v as SuggestionStatus })}
              >
                <SelectTrigger className="h-8 w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(SUGGESTION_STATUS_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <StatusBadge status={suggestion.status} />
            )}
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Descrição</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestion.description}</p>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm">
            {suggestion.page && (
              <div>
                <span className="text-muted-foreground">Página: </span>
                <Badge variant="outline" className="text-xs">{suggestion.page}</Badge>
              </div>
            )}
            {suggestion.specificItem && (
              <div>
                <span className="text-muted-foreground">Item: </span>
                <span className="text-foreground">{suggestion.specificItem}</span>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Autor: </span>
              <span className="text-foreground">{suggestion.authorName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Data: </span>
              <span className="text-foreground">{format(new Date(suggestion.createdAt), 'dd/MM/yyyy HH:mm')}</span>
            </div>
          </div>

          {/* Votes */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className={cn('gap-1', suggestion.userVote === 1 && 'text-success border-success/30 bg-success/10')}
              onClick={() => vote.mutate({ id: suggestion.id, vote: 1 })}
            >
              <ThumbsUp className="h-4 w-4" /> {suggestion.upvotes}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn('gap-1', suggestion.userVote === -1 && 'text-destructive border-destructive/30 bg-destructive/10')}
              onClick={() => vote.mutate({ id: suggestion.id, vote: -1 })}
            >
              <ThumbsDown className="h-4 w-4" /> {suggestion.downvotes}
            </Button>
          </div>

          {/* Comments */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Comentários ({comments?.length || 0})</p>
            <div className="space-y-3 mb-4">
              {(comments || []).map(c => (
                <div key={c.id} className="flex gap-2">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="text-[10px] bg-surface-3">
                      {c.authorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">{c.authorName}</span>
                      <span className="text-[10px] text-muted-foreground">{format(new Date(c.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Escreva um comentário..."
                rows={2}
                className="text-sm"
              />
              <Button size="icon" className="shrink-0" onClick={handleComment} disabled={!commentText.trim() || createComment.isPending}>
                {createComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
