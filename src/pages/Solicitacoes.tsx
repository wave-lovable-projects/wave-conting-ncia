import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { RequestFiltersBar } from '@/components/requests/RequestFilters';
import { RequestTable } from '@/components/requests/RequestTable';
import { RequestKanbanBoard } from '@/components/requests/RequestKanbanBoard';
import { RequestDialog } from '@/components/requests/RequestDialog';
import { RequestDetailSheet } from '@/components/requests/RequestDetailSheet';
import { useRequests, useUpdateRequestStatus } from '@/hooks/useRequests';
import { useUIStore } from '@/store/ui.store';
import type { RequestFilters, Request, RequestStatus } from '@/types/request';
import { Plus, List, Columns3 } from 'lucide-react';
import { toast } from 'sonner';

const VALID_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  PENDENTE: ['APROVADA', 'REJEITADA'],
  APROVADA: ['SOLICITADA_FORNECEDOR', 'REJEITADA', 'CANCELADA'],
  SOLICITADA_FORNECEDOR: ['RECEBIDA', 'CANCELADA'],
  RECEBIDA: ['EM_AQUECIMENTO', 'CANCELADA'],
  EM_AQUECIMENTO: ['PRONTA', 'CANCELADA'],
  PRONTA: ['ENTREGUE', 'CANCELADA'],
  ENTREGUE: [],
  REJEITADA: [],
  CANCELADA: [],
};

export default function Solicitacoes() {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [filters, setFilters] = useState<RequestFilters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const { data: requests } = useRequests(filters);
  const updateStatus = useUpdateRequestStatus();
  const user = useUIStore((s) => s.user);

  const handleAdvanceStatus = (r: Request) => {
    const nextStatuses = VALID_TRANSITIONS[r.status] ?? [];
    const next = nextStatuses.find((s) => s !== 'REJEITADA' && s !== 'CANCELADA');
    if (!next) return;
    updateStatus.mutate(
      { id: r.id, status: next, changedBy: user?.name ?? 'Sistema' },
      {
        onSuccess: () => toast.success('Status atualizado com sucesso'),
        onError: () => toast.error('Erro ao atualizar status'),
      }
    );
  };

  const handleCancel = (r: Request) => {
    updateStatus.mutate(
      { id: r.id, status: 'CANCELADA', changedBy: user?.name ?? 'Sistema' },
      {
        onSuccess: () => toast.success('Solicitação cancelada'),
        onError: () => toast.error('Erro ao cancelar solicitação'),
      }
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Solicitações"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border overflow-hidden">
              <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                className="rounded-none gap-1.5"
              >
                <List className="h-4 w-4" /> Lista
              </Button>
              <Button
                variant={view === 'kanban' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('kanban')}
                className="rounded-none gap-1.5"
              >
                <Columns3 className="h-4 w-4" /> Kanban
              </Button>
            </div>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Nova Solicitação
            </Button>
          </div>
        }
      />

      <RequestFiltersBar filters={filters} onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))} />

      {view === 'list' ? (
        <RequestTable
          requests={requests ?? []}
          onView={(r) => setSelectedRequestId(r.id)}
          onAdvanceStatus={handleAdvanceStatus}
          onCancel={handleCancel}
        />
      ) : (
        <RequestKanbanBoard requests={requests ?? []} onCardClick={(r) => setSelectedRequestId(r.id)} />
      )}

      <RequestDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <RequestDetailSheet requestId={selectedRequestId} onClose={() => setSelectedRequestId(null)} />
    </div>
  );
}
