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
import { Send, MessageSquare, Clock, Package, Truck, Flame, Loader2 } from 'lucide-react';
import { REQUEST_STATUS_LABELS, REQUEST_STATUSES, REQUEST_TYPE_LABELS } from '@/types/request';
import type { RequestStatus } from '@/types/request';

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
    try {
      await updateStatus.mutateAsync({ id: request.id, status: status as RequestStatus, changedBy: 'Admin Wave' });
      toast({ title: 'Status atualizado' });
    } catch {
      toast({ title: 'Erro ao atualizar status', variant: 'destructive' });
    }
  };

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
    <Sheet open={!!requestId} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">{request.title}</SheetTitle>
        </SheetHeader>
        <div className="space-y-5 mt-4">
          {/* Basic info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tipo</span>
              <Badge variant="outline" className="text-xs bg-surface-2 border-border text-muted-foreground">{REQUEST_TYPE_LABELS[request.assetType]}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Prioridade</span>
              <PriorityBadge priority={request.priority} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Select value={request.status} onValueChange={handleStatusChange} disabled={updateStatus.isPending}>
                <SelectTrigger className="w-48 h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REQUEST_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{REQUEST_STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Quantidade</span>
              <span className="text-sm text-foreground">{request.quantityDelivered}/{request.quantity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Solicitante</span>
              <span className="text-sm text-foreground">{request.requesterName}</span>
            </div>
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
            {request.deliveredAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Entregue em</span>
                <span className="text-sm text-foreground">{format(new Date(request.deliveredAt), 'dd/MM/yyyy HH:mm')}</span>
              </div>
            )}
          </div>

          <Separator />
          <div>
            <span className="text-sm font-medium text-foreground">Descrição</span>
            <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
          </div>

          {/* Supplier section */}
          {request.supplierName && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Fornecedor</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Nome</span><span className="text-foreground">{request.supplierName}</span></div>
                  {request.supplierOrderId && <div className="flex justify-between"><span className="text-muted-foreground">Pedido</span><span className="text-foreground">{request.supplierOrderId}</span></div>}
                  {request.supplierCost != null && <div className="flex justify-between"><span className="text-muted-foreground">Custo</span><span className="text-foreground">R$ {request.supplierCost.toFixed(2)}</span></div>}
                  {request.supplierOrderDate && <div className="flex justify-between"><span className="text-muted-foreground">Data do Pedido</span><span className="text-foreground">{format(new Date(request.supplierOrderDate), 'dd/MM/yyyy')}</span></div>}
                  {request.supplierExpectedDate && <div className="flex justify-between"><span className="text-muted-foreground">Previsão Fornecedor</span><span className="text-foreground">{format(new Date(request.supplierExpectedDate), 'dd/MM/yyyy')}</span></div>}
                  {request.supplierReceivedDate && <div className="flex justify-between"><span className="text-muted-foreground">Recebido em</span><span className="text-foreground">{format(new Date(request.supplierReceivedDate), 'dd/MM/yyyy')}</span></div>}
                </div>
              </div>
            </>
          )}

          {/* Warming section */}
          {(request.warmingStartDate || request.warmingEndDate) && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Aquecimento</span>
                </div>
                <div className="space-y-2 text-sm">
                  {request.warmingStartDate && <div className="flex justify-between"><span className="text-muted-foreground">Início</span><span className="text-foreground">{format(new Date(request.warmingStartDate), 'dd/MM/yyyy')}</span></div>}
                  {request.warmingEndDate && <div className="flex justify-between"><span className="text-muted-foreground">Fim</span><span className="text-foreground">{format(new Date(request.warmingEndDate), 'dd/MM/yyyy')}</span></div>}
                </div>
              </div>
            </>
          )}

          {/* Linked assets */}
          {request.linkedAssetIds.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Ativos Vinculados ({request.linkedAssetIds.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {request.linkedAssetIds.map((id) => (
                    <Badge key={id} variant="outline" className="text-xs bg-surface-2 border-border text-muted-foreground">{id}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Specifications */}
          {request.specifications && Object.keys(request.specifications).length > 0 && (
            <>
              <Separator />
              <div>
                <span className="text-sm font-medium text-foreground">Especificações</span>
                <div className="space-y-1.5 mt-2">
                  {Object.entries(request.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-foreground">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Status history */}
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

          {/* Comments */}
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
                {addComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
