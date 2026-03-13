import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import type { Request } from '@/types/request';
import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const typeLabels: Record<string, string> = {
  BM: 'BM', ACCOUNT: 'Conta', PROFILE: 'Perfil', BALANCE: 'Saldo', OTHER: 'Outro',
};

const priorityBorderColor: Record<string, string> = {
  LOW: 'border-l-muted-foreground',
  MEDIUM: 'border-l-info',
  HIGH: 'border-l-caution',
  URGENT: 'border-l-destructive',
};

interface Props {
  request: Request;
  onClick: (r: Request) => void;
}

export function RequestKanbanCard({ request, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: request.id,
    data: { request },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 border-border border-l-[3px] ${priorityBorderColor[request.priority]} cursor-grab hover:bg-card-hover transition-colors`}
      onClick={() => onClick(request)}
    >
      <h4 className="text-sm font-medium text-foreground mb-2 line-clamp-2">{request.title}</h4>
      <div className="flex items-center gap-1.5 mb-2">
        <Badge variant="outline" className="text-[10px] bg-surface-2 border-border text-muted-foreground">{typeLabels[request.type]}</Badge>
        <PriorityBadge priority={request.priority} />
      </div>
      <div className="text-xs text-muted-foreground space-y-0.5">
        <p>{request.requesterName}</p>
        {request.assigneeName && <p className="text-foreground/70">→ {request.assigneeName}</p>}
        {request.dueDate && <p>{format(new Date(request.dueDate), 'dd/MM')}</p>}
      </div>
    </Card>
  );
}
