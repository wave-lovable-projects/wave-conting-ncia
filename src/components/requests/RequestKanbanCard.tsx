import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
  AlertTriangle,
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

const TERMINAL_STATUSES = ['ENTREGUE', 'REJEITADA', 'CANCELADA'];

function getDaysInStage(request: Request): number {
  const lastChange = request.statusHistory.length > 0
    ? request.statusHistory[request.statusHistory.length - 1].changedAt
    : request.createdAt;
  return differenceInDays(new Date(), new Date(lastChange));
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
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
  const isUrgent = request.priority === 'URGENT';
  const isStale = daysInStage > 5 && !TERMINAL_STATUSES.includes(request.status);

  if (compact) {
    return (
      <Card
        className={`p-2.5 border-border border-l-[3px] ${priorityBorderColor[request.priority]} cursor-pointer hover:bg-card-hover transition-colors`}
        onClick={() => onClick(request)}
      >
        <div className="flex items-center gap-1">
          {isUrgent && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <AlertTriangle className="h-3 w-3 text-destructive shrink-0" />
              </TooltipTrigger>
              <TooltipContent>Prioridade urgente</TooltipContent>
            </Tooltip>
          )}
          <p className="text-xs font-medium text-foreground line-clamp-1">{request.title}</p>
          {isStale && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Clock className="h-3 w-3 text-warning shrink-0" />
              </TooltipTrigger>
              <TooltipContent>Parada há {daysInStage} dias nesta etapa</TooltipContent>
            </Tooltip>
          )}
        </div>
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
      className={`p-4 border-border border-l-[3px] ${priorityBorderColor[request.priority]} cursor-grab hover:bg-card-hover transition-colors`}
      onClick={() => onClick(request)}
    >
      <div className="flex items-start justify-between gap-1.5 mb-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {isUrgent && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
              </TooltipTrigger>
              <TooltipContent>Prioridade urgente</TooltipContent>
            </Tooltip>
          )}
          <h4 className="text-sm font-medium text-foreground line-clamp-2">{request.title}</h4>
        </div>
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          {isStale && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Clock className="h-3.5 w-3.5 text-warning" />
              </TooltipTrigger>
              <TooltipContent>Parada há {daysInStage} dias nesta etapa</TooltipContent>
            </Tooltip>
          )}
          {showTimeWarning && !isStale && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Clock className={`h-3.5 w-3.5 ${isDanger ? 'text-destructive' : 'text-warning'}`} />
              </TooltipTrigger>
              <TooltipContent>{daysInStage} dias nesta etapa</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {request.description && (
        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{request.description}</p>
      )}

      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        <Badge variant="outline" className="text-[10px] bg-surface-2 border-border text-muted-foreground gap-0.5 px-1.5">
          <Icon className="h-3 w-3" />
          {REQUEST_TYPE_LABELS[request.assetType]}
        </Badge>
        <PriorityBadge priority={request.priority} className="text-[10px]" />
      </div>

      <p className="text-xs text-muted-foreground mb-2">
        Qtd: {request.quantity} {assetTypeUnit[request.assetType]}
      </p>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground space-y-0.5 min-w-0 flex-1">
          {request.supplierName && (
            <p className="text-foreground/70 truncate">→ {request.supplierName}</p>
          )}
          {request.dueDate && (
            <p className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {format(new Date(request.dueDate), 'dd/MM')}
            </p>
          )}
        </div>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="h-6 w-6 rounded-full bg-surface-2 flex items-center justify-center text-[10px] font-medium text-muted-foreground shrink-0">
              {getInitials(request.requesterName)}
            </div>
          </TooltipTrigger>
          <TooltipContent>{request.requesterName}</TooltipContent>
        </Tooltip>
      </div>
    </Card>
  );
}
