import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Separator } from '@/components/ui/separator';
import { useRequest, useUpdateRequestStatus, useAddRequestComment } from '@/hooks/useRequests';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Send, MessageSquare, Clock } from 'lucide-react';
import type { RequestStatus } from '@/types/request';

const typeLabels: Record<string, string> = {
  BM: 'BM', ACCOUNT: 'Conta', PROFILE: 'Perfil', BALANCE: 'Saldo', OTHER: 'Outro',
};

interface Props {
  requestId: string | null;
  onClose: () => void;
}

export function RequestDetailSheet({ requestId, onClose }: Props) {
  const { data: request } = useRequest(requestId);
  const updateStatus = useUpdateRequestStatus();
  const addComment = useAddRequestComment();
  const [newComment, setNewComment] = useState('');

  if (!request) return null;

  const handleStatusChange = async (status: string) => {
    await updateStatus.mutateAsync({ id: request.id, status: status as RequestStatus, changedBy: 'Admin Wave' });
    toast({ title: 'Status atualizado' });
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await addComment.mutateAsync({ requestId: request.id, text: newComment });
    setNewComment('');
    toast({ title: 'Comentário adicionado' });
  };

  return (
    <Sheet open={!!requestId} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">{request.title}</SheetTitle>
        </SheetHeader>
        <div className="space-y-5 mt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tipo</span>
              <Badge variant="outline" className="text-xs bg-surface-2 border-border text-muted-foreground">{typeLabels[request.type]}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Prioridade</span>
              <PriorityBadge priority={request.priority} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Select value={request.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40 h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                  <SelectItem value="DONE">Concluída</SelectItem>
                  <SelectItem value="REJECTED">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Solicitante</span>
              <span className="text-sm text-foreground">{request.requesterName}</span>
            </div>
            {request.assigneeName && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Responsável</span>
                <span className="text-sm text-foreground">{request.assigneeName}</span>
              </div>
            )}
            {request.dueDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Previsão</span>
                <span className="text-sm text-foreground">{format(new Date(request.dueDate), 'dd/MM/yyyy')}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Criado em</span>
              <span className="text-sm text-foreground">{format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm')}</span>
            </div>
          </div>

          <Separator />
          <div>
            <span className="text-sm font-medium text-foreground">Descrição</span>
            <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
          </div>

          {request.statusHistory.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Histórico de Status</span>
                </div>
                <div className="space-y-2">
                  {request.statusHistory.map((sh) => (
                    <div key={sh.id} className="flex items-center justify-between text-xs bg-surface-1 rounded-lg p-2">
                      <div className="flex items-center gap-1">
                        <StatusBadge status={sh.fromStatus} />
                        <span className="text-muted-foreground">→</span>
                        <StatusBadge status={sh.toStatus} />
                      </div>
                      <div className="text-right text-muted-foreground">
                        <p>{sh.changedBy}</p>
                        <p>{format(new Date(sh.changedAt), 'dd/MM HH:mm')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Comentários ({request.comments.length})</span>
            </div>
            <div className="space-y-3 mb-4">
              {request.comments.map((c) => (
                <div key={c.id} className="bg-surface-1 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{c.authorName}</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(c.createdAt), 'dd/MM HH:mm')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{c.text}</p>
                </div>
              ))}
              {request.comments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum comentário ainda</p>
              )}
            </div>
            <div className="flex gap-2">
              <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Adicionar comentário..." rows={2} className="flex-1" />
              <Button size="icon" onClick={handleAddComment} disabled={addComment.isPending || !newComment.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
