import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import type { Request } from '@/types/request';
import { REQUEST_TYPE_LABELS } from '@/types/request';
import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <Badge variant="outline" className="text-[10px] bg-surface-2 border-border text-muted-foreground">{REQUEST_TYPE_LABELS[request.assetType]}</Badge>
        <PriorityBadge priority={request.priority} />
        <Badge variant="outline" className="text-[10px] bg-surface-2 border-border text-muted-foreground">{request.quantityDelivered}/{request.quantity}</Badge>
      </div>
      <div className="text-xs text-muted-foreground space-y-0.5">
        <p>{request.requesterName}</p>
        {request.supplierName && <p className="text-foreground/70">→ {request.supplierName}</p>}
        {request.dueDate && <p>{format(new Date(request.dueDate), 'dd/MM')}</p>}
      </div>
    </Card>
  );
}
