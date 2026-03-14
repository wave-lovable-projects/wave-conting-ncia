import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useRequest, useUpdateRequestStatus } from '@/hooks/useRequests';
import { useUIStore } from '@/store/ui.store';
import { useRequestPermissions } from '@/hooks/useRequestPermissions';
import { toast } from '@/hooks/use-toast';
import { Loader2, Eye, Truck, Package, Flame, Clock } from 'lucide-react';
import type { RequestStatus } from '@/types/request';
import { REQUEST_STATUSES } from '@/types/request';
import { OverviewTab } from './detail-tabs/OverviewTab';
import { SupplierTab } from './detail-tabs/SupplierTab';
import { LinkedAssetsTab } from './detail-tabs/LinkedAssetsTab';
import { WarmingTab } from './detail-tabs/WarmingTab';
import { HistoryTab } from './detail-tabs/HistoryTab';

interface Props {
  requestId: string | null;
  onClose: () => void;
}

const STATUS_ACTION: Record<string, { label: string; next: RequestStatus; variant: 'default' | 'destructive' }[]> = {
  PENDENTE: [
    { label: 'Aprovar Solicitação', next: 'APROVADA', variant: 'default' },
    { label: 'Rejeitar', next: 'REJEITADA', variant: 'destructive' },
  ],
  APROVADA: [{ label: 'Registrar Pedido ao Fornecedor', next: 'SOLICITADA_FORNECEDOR', variant: 'default' }],
  SOLICITADA_FORNECEDOR: [{ label: 'Marcar como Recebida', next: 'RECEBIDA', variant: 'default' }],
  RECEBIDA: [{ label: 'Iniciar Aquecimento', next: 'EM_AQUECIMENTO', variant: 'default' }],
  EM_AQUECIMENTO: [{ label: 'Marcar como Pronta', next: 'PRONTA', variant: 'default' }],
  PRONTA: [{ label: 'Entregar ao Gestor', next: 'ENTREGUE', variant: 'default' }],
};

const WARMING_INDEX = REQUEST_STATUSES.indexOf('EM_AQUECIMENTO');

export function RequestDetailSheet({ requestId, onClose }: Props) {
  const { data: request } = useRequest(requestId);
  const updateStatus = useUpdateRequestStatus();
  const user = useUIStore((s) => s.user);
  const permissions = useRequestPermissions(user?.role, user?.id);
  const [activeTab, setActiveTab] = useState('overview');

  if (!request) return null;

  const currentIndex = REQUEST_STATUSES.indexOf(request.status);
  const showWarmingTab = currentIndex >= WARMING_INDEX;

  const handleAction = async (next: RequestStatus) => {
    try {
      await updateStatus.mutateAsync({
        id: request.id,
        status: next,
        changedBy: user?.name ?? 'Sistema',
      });
      toast({ title: 'Status atualizado com sucesso' });
    } catch {
      toast({ title: 'Não foi possível atualizar o status', variant: 'destructive' });
    }
  };

  // For ADMIN: show defined actions. For GESTOR: only allow canceling own PENDENTE
  const actions = permissions.canChangeStatus
    ? (STATUS_ACTION[request.status] ?? [])
    : (permissions.canCancelOwn && request.status === 'PENDENTE' && request.requesterId === user?.id)
      ? [{ label: 'Cancelar Solicitação', next: 'CANCELADA' as RequestStatus, variant: 'destructive' as const }]
      : [];

  return (
    <Sheet open={!!requestId} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle className="text-left text-lg">{request.title}</SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-6 w-auto justify-start bg-surface-1 overflow-x-auto">
            <TabsTrigger value="overview" className="gap-1.5 text-xs"><Eye className="h-3.5 w-3.5" />Visão Geral</TabsTrigger>
            <TabsTrigger value="supplier" className="gap-1.5 text-xs"><Truck className="h-3.5 w-3.5" />Fornecedor</TabsTrigger>
            <TabsTrigger value="assets" className="gap-1.5 text-xs"><Package className="h-3.5 w-3.5" />Ativos</TabsTrigger>
            {showWarmingTab && (
              <TabsTrigger value="warming" className="gap-1.5 text-xs"><Flame className="h-3.5 w-3.5" />Aquecimento</TabsTrigger>
            )}
            <TabsTrigger value="history" className="gap-1.5 text-xs"><Clock className="h-3.5 w-3.5" />Histórico</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab request={request} />
            </TabsContent>
            <TabsContent value="supplier" className="mt-0">
              <SupplierTab request={request} />
            </TabsContent>
            <TabsContent value="assets" className="mt-0">
              <LinkedAssetsTab request={request} />
            </TabsContent>
            {showWarmingTab && (
              <TabsContent value="warming" className="mt-0">
                <WarmingTab request={request} />
              </TabsContent>
            )}
            <TabsContent value="history" className="mt-0">
              <HistoryTab request={request} />
            </TabsContent>
          </div>
        </Tabs>

        {actions.length > 0 && (
          <SheetFooter className="px-6 py-4 border-t border-border gap-2 flex-row justify-end">
            {actions.map((a) => (
              <Button
                key={a.next}
                variant={a.variant === 'destructive' ? 'outline' : 'default'}
                className={a.variant === 'destructive' ? 'border-destructive text-destructive hover:bg-destructive/10' : 'bg-success text-success-foreground hover:bg-success/90'}
                onClick={() => handleAction(a.next)}
                disabled={updateStatus.isPending}
              >
                {updateStatus.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {a.label}
              </Button>
            ))}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
