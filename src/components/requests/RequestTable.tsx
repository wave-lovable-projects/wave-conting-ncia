import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, ArrowRight, Copy, XCircle, ArrowUpDown, CreditCard, UserCircle, Globe, LayoutGrid, Target, DollarSign, Layers, AlertTriangle } from 'lucide-react';
import type { Request, RequestType, RequestStatus } from '@/types/request';
import { REQUEST_TYPE_LABELS } from '@/types/request';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { RequestPermissions } from '@/hooks/useRequestPermissions';

const assetTypeIcon: Record<RequestType, LucideIcon> = {
  CONTA_ANUNCIO: CreditCard,
  BUSINESS_MANAGER: LayoutGrid,
  PERFIL: UserCircle,
  PAGINA: Globe,
  PIXEL: Target,
  SALDO: DollarSign,
  MISTO: Layers,
};

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

const NEXT_STATUS_LABEL: Partial<Record<RequestStatus, string>> = {
  PENDENTE: 'Aprovar',
  APROVADA: 'Solicitar Fornecedor',
  SOLICITADA_FORNECEDOR: 'Marcar Recebida',
  RECEBIDA: 'Iniciar Aquecimento',
  EM_AQUECIMENTO: 'Marcar Pronta',
  PRONTA: 'Entregar',
};

const TERMINAL_STATUSES: RequestStatus[] = ['ENTREGUE', 'REJEITADA', 'CANCELADA'];

type SortKey = 'title' | 'assetType' | 'quantity' | 'delivered' | 'priority' | 'status' | 'requesterName' | 'assigneeName' | 'supplierName' | 'dueDate' | 'daysInStage' | 'createdAt';

const PRIORITY_ORDER: Record<string, number> = { LOW: 0, MEDIUM: 1, HIGH: 2, URGENT: 3 };

function getDaysInStage(r: Request): number {
  const lastChange = r.statusHistory.length > 0
    ? r.statusHistory[r.statusHistory.length - 1].changedAt
    : r.createdAt;
  return differenceInDays(new Date(), new Date(lastChange));
}

function formatDaysInStage(days: number): string {
  if (days >= 7) return `${Math.floor(days / 7)}sem`;
  return `${days}d`;
}

interface Props {
  requests: Request[];
  onView: (r: Request) => void;
  onAdvanceStatus?: (r: Request) => void;
  onCancel?: (r: Request) => void;
  hideSupplierColumn?: boolean;
  hideAdvanceAction?: boolean;
  permissions?: RequestPermissions;
}

export function RequestTable({ requests, onView, onAdvanceStatus, onCancel, hideSupplierColumn, hideAdvanceAction, permissions }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = useMemo(() => {
    const arr = [...requests];
    const dir = sortDir === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'title': cmp = a.title.localeCompare(b.title); break;
        case 'assetType': cmp = a.assetType.localeCompare(b.assetType); break;
        case 'quantity': cmp = a.quantity - b.quantity; break;
        case 'delivered': cmp = a.quantityDelivered - b.quantityDelivered; break;
        case 'priority': cmp = (PRIORITY_ORDER[a.priority] ?? 0) - (PRIORITY_ORDER[b.priority] ?? 0); break;
        case 'status': cmp = a.status.localeCompare(b.status); break;
        case 'requesterName': cmp = a.requesterName.localeCompare(b.requesterName); break;
        case 'assigneeName': cmp = (a.assigneeName ?? '').localeCompare(b.assigneeName ?? ''); break;
        case 'supplierName': cmp = (a.supplierName ?? '').localeCompare(b.supplierName ?? ''); break;
        case 'dueDate': cmp = (a.dueDate ?? '').localeCompare(b.dueDate ?? ''); break;
        case 'daysInStage': cmp = getDaysInStage(a) - getDaysInStage(b); break;
        case 'createdAt': cmp = a.createdAt.localeCompare(b.createdAt); break;
      }
      return cmp * dir;
    });
    return arr;
  }, [requests, sortKey, sortDir]);

  const SortHeader = ({ label, colKey }: { label: string; colKey: SortKey }) => (
    <TableHead
      className="text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
      onClick={() => toggleSort(colKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={cn('h-3 w-3', sortKey === colKey ? 'text-foreground' : 'text-muted-foreground/40')} />
      </div>
    </TableHead>
  );

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-1 hover:bg-surface-1">
            <SortHeader label="Título" colKey="title" />
            <SortHeader label="Tipo" colKey="assetType" />
            <SortHeader label="Qtd" colKey="quantity" />
            <SortHeader label="Entregue" colKey="delivered" />
            <SortHeader label="Prioridade" colKey="priority" />
            <SortHeader label="Status" colKey="status" />
            <SortHeader label="Solicitante" colKey="requesterName" />
            <SortHeader label="Responsável" colKey="assigneeName" />
            {!hideSupplierColumn && <SortHeader label="Fornecedor" colKey="supplierName" />}
            <SortHeader label="Data Desejada" colKey="dueDate" />
            <SortHeader label="Tempo na Etapa" colKey="daysInStage" />
            <SortHeader label="Criado em" colKey="createdAt" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((r) => {
            const Icon = assetTypeIcon[r.assetType];
            const days = getDaysInStage(r);
            const isComplete = r.quantityDelivered >= r.quantity;
            const nextStatuses = VALID_TRANSITIONS[r.status] ?? [];
            const canAdvance = !hideAdvanceAction && nextStatuses.length > 0 && nextStatuses[0] !== 'REJEITADA' && nextStatuses[0] !== 'CANCELADA';
            const canCancelThis = permissions?.canCancelOwn
              ? r.status === 'PENDENTE'
              : nextStatuses.includes('CANCELADA');
            const isStale = days > 5 && !TERMINAL_STATUSES.includes(r.status);
            const isUrgent = r.priority === 'URGENT';

            return (
              <TableRow key={r.id} className="hover:bg-surface-1/50 group/row">
                <TableCell className="text-foreground font-medium">
                  <div className="flex items-center gap-1">
                    <button onClick={() => onView(r)} className="hover:underline text-left">{r.title}</button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/row:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => onView(r)} className="gap-2">
                          <Eye className="h-4 w-4" /> Ver Detalhes
                        </DropdownMenuItem>
                        {canAdvance && (
                          <DropdownMenuItem onClick={() => onAdvanceStatus?.(r)} className="gap-2">
                            <ArrowRight className="h-4 w-4" /> {NEXT_STATUS_LABEL[r.status] ?? 'Avançar Status'}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => { navigator.clipboard.writeText(r.id); toast.success('ID copiado!'); }}
                          className="gap-2"
                        >
                          <Copy className="h-4 w-4" /> Copiar ID
                        </DropdownMenuItem>
                        {canCancelThis && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onCancel?.(r)} className="gap-2 text-destructive focus:text-destructive">
                              <XCircle className="h-4 w-4" /> Cancelar
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs bg-surface-2 border-border text-muted-foreground gap-1">
                    <Icon className="h-3 w-3" />
                    {REQUEST_TYPE_LABELS[r.assetType]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{r.quantity}</TableCell>
                <TableCell className={cn('text-sm font-medium', isComplete ? 'text-success' : 'text-muted-foreground')}>
                  {r.quantityDelivered}/{r.quantity}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {isUrgent && <AlertTriangle className="h-3.5 w-3.5 text-destructive animate-pulse" />}
                    <PriorityBadge priority={r.priority} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={r.status} />
                    {isStale && <span className="text-xs" title={`Parada há ${days} dias`}>⏰</span>}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{r.requesterName}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{r.assigneeName ?? '—'}</TableCell>
                {!hideSupplierColumn && <TableCell className="text-muted-foreground text-sm">{r.supplierName ?? '—'}</TableCell>}
                <TableCell className="text-muted-foreground text-sm">{r.dueDate ? format(new Date(r.dueDate), 'dd/MM/yyyy') : '—'}</TableCell>
                <TableCell className={cn('text-sm font-medium', days > 10 ? 'text-destructive' : days > 5 ? 'text-warning' : 'text-muted-foreground')}>
                  {formatDaysInStage(days)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{format(new Date(r.createdAt), 'dd/MM/yyyy')}</TableCell>
              </TableRow>
            );
          })}
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={12} className="text-center text-muted-foreground py-8">Nenhuma solicitação encontrada</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
