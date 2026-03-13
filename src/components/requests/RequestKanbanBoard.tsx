import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, type DragEndEvent, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { RequestKanbanCard } from './RequestKanbanCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Request, RequestStatus } from '@/types/request';
import { useUpdateRequestStatus } from '@/hooks/useRequests';
import { toast } from '@/hooks/use-toast';

const columns: { status: RequestStatus; label: string; color: string }[] = [
  { status: 'PENDING', label: 'Pendente', color: 'bg-warning' },
  { status: 'IN_PROGRESS', label: 'Em Andamento', color: 'bg-info' },
  { status: 'DONE', label: 'Concluída', color: 'bg-success' },
  { status: 'REJECTED', label: 'Rejeitada', color: 'bg-destructive' },
];

function KanbanColumn({ status, label, color, requests, onCardClick }: { status: string; label: string; color: string; requests: Request[]; onCardClick: (r: Request) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-h-[400px] rounded-lg border border-border bg-surface-0 transition-colors ${isOver ? 'bg-surface-1' : ''}`}
    >
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <Badge variant="outline" className="text-xs">{requests.length}</Badge>
      </div>
      <div className="p-2 space-y-2 flex-1">
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
}

export function RequestKanbanBoard({ requests, onCardClick }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const updateStatus = useUpdateRequestStatus();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const activeRequest = activeId ? requests.find((r) => r.id === activeId) : null;

  const handleDragStart = (e: DragStartEvent) => { setActiveId(e.active.id as string); };

  const handleDragEnd = async (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const request = requests.find((r) => r.id === active.id);
    if (!request) return;

    // Check if dropped on a column
    const targetStatus = columns.find((c) => c.status === over.id)?.status;
    if (targetStatus && targetStatus !== request.status) {
      await updateStatus.mutateAsync({ id: request.id, status: targetStatus, changedBy: 'Admin Wave' });
      toast({ title: `Status alterado para ${columns.find((c) => c.status === targetStatus)?.label}` });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => (
          <KanbanColumn
            key={col.status}
            {...col}
            requests={requests.filter((r) => r.status === col.status)}
            onCardClick={onCardClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeRequest && (
          <Card className="p-3 border-border shadow-elevated w-64">
            <p className="text-sm font-medium text-foreground">{activeRequest.title}</p>
          </Card>
        )}
      </DragOverlay>
    </DndContext>
  );
}
