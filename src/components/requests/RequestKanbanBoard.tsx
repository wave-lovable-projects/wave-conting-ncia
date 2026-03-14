import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { RequestKanbanCard } from './RequestKanbanCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { Request, RequestStatus } from '@/types/request';
import { REQUEST_STATUS_LABELS, REQUEST_TYPE_LABELS } from '@/types/request';
import { useUpdateRequestStatus } from '@/hooks/useRequests';
import { useUIStore } from '@/store/ui.store';
import { toast } from '@/hooks/use-toast';
import { ChevronDown, CreditCard, LayoutGrid, UserCircle, Globe, Target, DollarSign, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { RequestPermissions } from '@/hooks/useRequestPermissions';
import { GESTOR_KANBAN_COLUMNS } from '@/hooks/useRequestPermissions';

const assetTypeIcon: Record<string, LucideIcon> = {
  CONTA_ANUNCIO: CreditCard,
  BUSINESS_MANAGER: LayoutGrid,
  PERFIL: UserCircle,
  PAGINA: Globe,
  PIXEL: Target,
  SALDO: DollarSign,
  MISTO: Layers,
};

const pipelineColumns: { status: RequestStatus; label: string; color: string }[] = [
  { status: 'PENDENTE', label: REQUEST_STATUS_LABELS.PENDENTE, color: 'bg-warning' },
  { status: 'APROVADA', label: REQUEST_STATUS_LABELS.APROVADA, color: 'bg-info' },
  { status: 'SOLICITADA_FORNECEDOR', label: REQUEST_STATUS_LABELS.SOLICITADA_FORNECEDOR, color: 'bg-accent-purple' },
  { status: 'RECEBIDA', label: REQUEST_STATUS_LABELS.RECEBIDA, color: 'bg-info' },
  { status: 'EM_AQUECIMENTO', label: REQUEST_STATUS_LABELS.EM_AQUECIMENTO, color: 'bg-caution' },
  { status: 'PRONTA', label: REQUEST_STATUS_LABELS.PRONTA, color: 'bg-success' },
  { status: 'ENTREGUE', label: REQUEST_STATUS_LABELS.ENTREGUE, color: 'bg-success' },
];

function KanbanColumn({
  status,
  label,
  color,
  requests,
  onCardClick,
}: {
  status: string;
  label: string;
  color: string;
  requests: Request[];
  onCardClick: (r: Request) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const totalAssets = requests.reduce((acc, r) => acc + r.quantity, 0);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-h-[400px] min-w-[180px] w-[180px] lg:flex-1 rounded-lg border border-border bg-surface-0 transition-colors shrink-0 ${isOver ? 'bg-surface-1 ring-1 ring-primary/30' : ''}`}
    >
      <div className="p-2.5 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <span className="text-xs font-medium text-foreground truncate">{label}</span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {requests.length} solic. · {totalAssets} ativos
        </span>
      </div>
      <div className="p-1.5 space-y-1.5 flex-1 overflow-y-auto">
        <SortableContext items={requests.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          {requests.map((r) => (
            <RequestKanbanCard key={r.id} request={r} onClick={onCardClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

interface Props {
  requests: Request[];
  onCardClick: (r: Request) => void;
  permissions?: RequestPermissions;
}

export function RequestKanbanBoard({ requests, onCardClick, permissions }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [closedOpen, setClosedOpen] = useState(false);
  const updateStatus = useUpdateRequestStatus();
  const user = useUIStore((s) => s.user);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const activeRequest = activeId ? requests.find((r) => r.id === activeId) : null;
  const closedRequests = requests.filter((r) => r.status === 'REJEITADA' || r.status === 'CANCELADA');

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const request = requests.find((r) => r.id === active.id);
    if (!request) return;

    const targetStatus = pipelineColumns.find((c) => c.status === over.id)?.status;
    if (targetStatus && targetStatus !== request.status) {
      try {
        await updateStatus.mutateAsync({
          id: request.id,
          status: targetStatus,
          changedBy: user?.name ?? 'Sistema',
        });
        toast({ title: `Status alterado para ${REQUEST_STATUS_LABELS[targetStatus]}` });
      } catch {
        toast({ title: 'Erro ao alterar status', variant: 'destructive' });
      }
    }
  };

  const ActiveIcon = activeRequest ? assetTypeIcon[activeRequest.assetType] : null;

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-4">
            {pipelineColumns.map((col) => (
              <KanbanColumn
                key={col.status}
                {...col}
                requests={requests.filter((r) => r.status === col.status)}
                onCardClick={onCardClick}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <DragOverlay>
          {activeRequest && (
            <Card className="p-3 border-border shadow-elevated w-52">
              <p className="text-sm font-medium text-foreground line-clamp-1">{activeRequest.title}</p>
              {ActiveIcon && (
                <Badge variant="outline" className="text-[10px] mt-1.5 bg-surface-2 border-border text-muted-foreground gap-0.5">
                  <ActiveIcon className="h-3 w-3" />
                  {REQUEST_TYPE_LABELS[activeRequest.assetType]}
                </Badge>
              )}
            </Card>
          )}
        </DragOverlay>
      </DndContext>

      {closedRequests.length > 0 && (
        <Collapsible open={closedOpen} onOpenChange={setClosedOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full">
            <ChevronDown className={`h-4 w-4 transition-transform ${closedOpen ? 'rotate-0' : '-rotate-90'}`} />
            Encerradas
            <Badge variant="outline" className="text-[10px]">{closedRequests.length}</Badge>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {closedRequests.map((r) => (
                <RequestKanbanCard key={r.id} request={r} onClick={onCardClick} compact />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
