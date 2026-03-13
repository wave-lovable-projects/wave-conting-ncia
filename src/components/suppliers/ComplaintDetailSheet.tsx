import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Separator } from '@/components/ui/separator';
import { useComplaint, useUpdateComplaintStatus, useAddComplaintComment } from '@/hooks/useSuppliers';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Send, MessageSquare } from 'lucide-react';

interface Props {
  complaintId: string | null;
  onClose: () => void;
}

export function ComplaintDetailSheet({ complaintId, onClose }: Props) {
  const { data: complaint } = useComplaint(complaintId);
  const updateStatus = useUpdateComplaintStatus();
  const addComment = useAddComplaintComment();
  const [newComment, setNewComment] = useState('');

  if (!complaint) return null;

  const handleStatusChange = async (status: string) => {
    await updateStatus.mutateAsync({ id: complaint.id, status });
    toast({ title: 'Status atualizado' });
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await addComment.mutateAsync({ complaintId: complaint.id, text: newComment });
    setNewComment('');
    toast({ title: 'Comentário adicionado' });
  };

  return (
    <Sheet open={!!complaintId} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalhes da Reclamação</SheetTitle>
        </SheetHeader>
        <div className="space-y-5 mt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Fornecedor</span>
              <span className="text-sm text-foreground font-medium">{complaint.supplierName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tipo do Ativo</span>
              <span className="text-sm text-foreground">{complaint.assetType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Prioridade</span>
              <PriorityBadge priority={complaint.priority} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Select value={complaint.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40 h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Aberta</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                  <SelectItem value="RESOLVED">Resolvida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {complaint.assigneeName && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Responsável</span>
                <span className="text-sm text-foreground">{complaint.assigneeName}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Data</span>
              <span className="text-sm text-foreground">{format(new Date(complaint.createdAt), 'dd/MM/yyyy HH:mm')}</span>
            </div>
          </div>

          <Separator />

          <div>
            <span className="text-sm font-medium text-foreground">Descrição</span>
            <p className="text-sm text-muted-foreground mt-1">{complaint.description}</p>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Comentários ({complaint.comments.length})</span>
            </div>

            <div className="space-y-3 mb-4">
              {complaint.comments.map((c) => (
                <div key={c.id} className="bg-surface-1 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{c.authorName}</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(c.createdAt), 'dd/MM HH:mm')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{c.text}</p>
                </div>
              ))}
              {complaint.comments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum comentário ainda</p>
              )}
            </div>

            <div className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicionar comentário..."
                rows={2}
                className="flex-1"
              />
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
