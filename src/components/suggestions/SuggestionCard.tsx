import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateSuggestionStatus, useVoteSuggestion } from '@/hooks/useSuggestions';
import { useUIStore } from '@/store/ui.store';
import { SUGGESTION_STATUS_LABELS } from '@/types/suggestion';
import type { Suggestion, SuggestionStatus } from '@/types/suggestion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SuggestionCardProps {
  suggestion: Suggestion;
  onClick: () => void;
}

const STATUS_MAP: Record<SuggestionStatus, string> = {
  PENDING: 'PENDING',
  ANALYZING: 'ANALYZING',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  REJECTED: 'REJECTED',
};

export function SuggestionCard({ suggestion, onClick }: SuggestionCardProps) {
  const user = useUIStore(s => s.user);
  const isAdmin = user?.role === 'ADMIN';
  const vote = useVoteSuggestion();
  const updateStatus = useUpdateSuggestionStatus();

  return (
    <Card className="bg-card hover:bg-card-hover transition-colors cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-medium text-foreground line-clamp-1">{suggestion.title}</CardTitle>
          {isAdmin ? (
            <div onClick={e => e.stopPropagation()}>
              <Select
                value={suggestion.status}
                onValueChange={v => updateStatus.mutate({ id: suggestion.id, status: v as SuggestionStatus })}
              >
                <SelectTrigger className="h-7 w-[130px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUGGESTION_STATUS_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <StatusBadge status={STATUS_MAP[suggestion.status]} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{suggestion.description}</p>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {suggestion.page && (
            <Badge variant="outline" className="text-[10px]">{suggestion.page}</Badge>
          )}
          <span className="text-[10px] text-muted-foreground">por {suggestion.authorName}</span>
          <span className="text-[10px] text-muted-foreground">• {format(new Date(suggestion.createdAt), 'dd/MM/yyyy')}</span>
        </div>

        <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className={cn('h-7 gap-1 text-xs', suggestion.userVote === 1 && 'text-success bg-success/10')}
            onClick={() => vote.mutate({ id: suggestion.id, vote: 1 })}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {suggestion.upvotes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn('h-7 gap-1 text-xs', suggestion.userVote === -1 && 'text-destructive bg-destructive/10')}
            onClick={() => vote.mutate({ id: suggestion.id, vote: -1 })}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            {suggestion.downvotes}
          </Button>
          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <MessageSquare className="h-3.5 w-3.5" />
            {suggestion.commentsCount}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
