import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import type { Request, RequestType } from '@/types/request';
import { REQUEST_TYPE_LABELS } from '@/types/request';
import { format, differenceInDays } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CreditCard,
  UserCircle,
  Globe,
  LayoutGrid,
  Target,
  DollarSign,
  Layers,
  Clock,
  CalendarDays,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const priorityBorderColor: Record<string, string> = {
  LOW: 'border-l-muted-foreground',
  MEDIUM: 'border-l-info',
  HIGH: 'border-l-caution',
  URGENT: 'border-l-destructive',
};

const assetTypeIcon: Record<RequestType, LucideIcon> = {
  CONTA_ANUNCIO: CreditCard,
  BUSINESS_MANAGER: LayoutGrid,
  PERFIL: UserCircle,
  PAGINA: Globe,
  PIXEL: Target,
  SALDO: DollarSign,
  MISTO: Layers,
};

const assetTypeUnit: Record<RequestType, string> = {
  CONTA_ANUNCIO: 'contas',
  BUSINESS_MANAGER: 'BMs',
  PERFIL: 'perfis',
  PAGINA: 'páginas',
  PIXEL: 'pixels',
  SALDO: 'recargas',
  MISTO: 'itens',
};

function getDaysInStage(request: Request): number {
  const lastChange = request.statusHistory.length > 0
    ? request.statusHistory[request.statusHistory.length - 1].changedAt
    : request.createdAt;
  return differenceInDays(new Date(), new Date(lastChange));
}

interface Props {
  request: Request;
  onClick: (r: Request) => void;
  compact?: boolean;
}

export function RequestKanbanCard({ request, onClick, compact = false }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: request.id,
    data: { request },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = assetTypeIcon[request.assetType];
  const daysInStage = getDaysInStage(request);
  const showTimeWarning = daysInStage > 3;
  const isDanger = daysInStage > 7;

  if (compact) {
    return (
      <Card
        className={`p-2 border-border border-l-[3px] ${priorityBorderColor[request.priority]} cursor-pointer hover:bg-card-hover transition-colors`}
        onClick={() => onClick(request)}
      >
        <p className="text-xs font-medium text-foreground line-clamp-1">{request.title}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <Badge variant="outline" className="text-[10px] bg-surface-2 border-border text-muted-foreground gap-0.5 px-1.5">
            <Icon className="h-3 w-3" />
            {REQUEST_TYPE_LABELS[request.assetType]}
          </Badge>
          <PriorityBadge priority={request.priority} className="text-[10px]" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 border-border border-l-[3px] ${priorityBorderColor[request.priority]} cursor-grab hover:bg-card-hover transition-colors`}
      onClick={() => onClick(request)}
    >
      <div className="flex items-start justify-between gap-1 mb-1.5">
        <h4 className="text-sm font-medium text-foreground line-clamp-2 flex-1">{request.title}</h4>
        {showTimeWarning && (
          <Clock className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${isDanger ? 'text-destructive' : 'text-warning'}`} />
        )}
      </div>

      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <Badge variant="outline" className="text-[10px] bg-surface-2 border-border text-muted-foreground gap-0.5 px-1.5">
          <Icon className="h-3 w-3" />
          {REQUEST_TYPE_LABELS[request.assetType]}
        </Badge>
        <PriorityBadge priority={request.priority} className="text-[10px]" />
      </div>

      <p className="text-xs text-muted-foreground mb-1.5">
        Qtd: {request.quantity} {assetTypeUnit[request.assetType]}
      </p>

      <div className="text-xs text-muted-foreground space-y-0.5">
        <p>{request.requesterName}</p>
        {request.supplierName && (
          <p className="text-foreground/70">→ {request.supplierName}</p>
        )}
        {request.dueDate && (
          <p className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {format(new Date(request.dueDate), 'dd/MM')}
          </p>
        )}
      </div>
    </Card>
  );
}
