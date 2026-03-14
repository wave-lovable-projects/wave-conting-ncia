import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useAddRequestComment } from '@/hooks/useRequests';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ArrowRight, MessageSquare, Send, Loader2 } from 'lucide-react';
import type { Request } from '@/types/request';

interface Props { request: Request }

type TimelineEntry = {
  type: 'status' | 'comment';
  date: string;
  id: string;
  // status
  fromStatus?: string;
  toStatus?: string;
  changedBy?: string;
  // comment
  authorName?: string;
  text?: string;
};

export function HistoryTab({ request }: Props) {
  const addComment = useAddRequestComment();
  const [newComment, setNewComment] = useState('');

  // Merge status changes and comments into unified timeline
  const entries: TimelineEntry[] = [
    ...request.statusHistory.map((sh) => ({
      type: 'status' as const,
      date: sh.changedAt,
      id: sh.id,
      fromStatus: sh.fromStatus,
      toStatus: sh.toStatus,
      changedBy: sh.changedBy,
    })),
    ...request.comments.map((c) => ({
      type: 'comment' as const,
      date: c.createdAt,
      id: c.id,
      authorName: c.authorName,
      text: c.text,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment.mutateAsync({ requestId: request.id, text: newComment });
      setNewComment('');
      toast({ title: 'Comentário adicionado' });
    } catch {
      toast({ title: 'Erro ao adicionar comentário', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      {/* New comment input */}
      <div className="flex gap-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Adicionar comentário..."
          rows={2}
          className="flex-1"
        />
        <Button
          size="icon"
          onClick={handleAddComment}
          disabled={addComment.isPending || !newComment.trim()}
        >
          {addComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>

      {/* Timeline */}
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Nenhum registro ainda</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-surface-1 rounded-lg p-3">
              {entry.type === 'status' ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs">
                    <ArrowRight className="h-3.5 w-3.5 text-info" />
                    <StatusBadge status={entry.fromStatus!} />
                    <span className="text-muted-foreground">→</span>
                    <StatusBadge status={entry.toStatus!} />
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{entry.changedBy}</p>
                    <p>{format(new Date(entry.date), 'dd/MM/yyyy HH:mm')}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium text-foreground">{entry.authorName}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{format(new Date(entry.date), 'dd/MM/yyyy HH:mm')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-5">{entry.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
