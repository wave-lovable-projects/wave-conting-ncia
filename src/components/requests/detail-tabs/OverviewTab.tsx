import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { Separator } from '@/components/ui/separator';
import { useUpdateRequest, useUpdateRequestStatus } from '@/hooks/useRequests';
import { useUIStore } from '@/store/ui.store';
import { getMockUsers } from '@/data/mock-users';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Check, Clock, Package, Send, Truck, Flame, Gift, CreditCard,
  UserCircle, Globe, LayoutGrid, Target, DollarSign, Layers,
} from 'lucide-react';
import {
  REQUEST_STATUS_LABELS, REQUEST_TYPE_LABELS, REQUEST_STATUSES,
} from '@/types/request';
import type { Request, RequestStatus, RequestType } from '@/types/request';
import { cn } from '@/lib/utils';
import type { RequestPermissions } from '@/hooks/useRequestPermissions';

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

const PIPELINE: RequestStatus[] = [
  'PENDENTE', 'APROVADA', 'SOLICITADA_FORNECEDOR', 'RECEBIDA',
  'EM_AQUECIMENTO', 'PRONTA', 'ENTREGUE',
];

const STEP_ICONS: Record<string, React.ElementType> = {
  PENDENTE: Clock,
  APROVADA: Check,
  SOLICITADA_FORNECEDOR: Truck,
  RECEBIDA: Package,
  EM_AQUECIMENTO: Flame,
  PRONTA: Gift,
  ENTREGUE: Send,
};

const STEP_COLORS: Record<string, string> = {
  PENDENTE: 'bg-warning text-warning-foreground',
  APROVADA: 'bg-info text-info-foreground',
  SOLICITADA_FORNECEDOR: 'bg-accent-purple text-accent-purple-foreground',
  RECEBIDA: 'bg-info text-info-foreground',
  EM_AQUECIMENTO: 'bg-caution text-caution-foreground',
  PRONTA: 'bg-success/70 text-success-foreground',
  ENTREGUE: 'bg-success text-success-foreground',
};

const TYPE_ICONS: Record<RequestType, React.ElementType> = {
  CONTA_ANUNCIO: CreditCard,
  BUSINESS_MANAGER: LayoutGrid,
  PERFIL: UserCircle,
  PAGINA: Globe,
  PIXEL: Target,
  SALDO: DollarSign,
  MISTO: Layers,
};

interface Props { request: Request; permissions?: RequestPermissions }

export function OverviewTab({ request, permissions }: Props) {
  const updateStatus = useUpdateRequestStatus();
  const updateRequest = useUpdateRequest();
  const user = useUIStore((s) => s.user);
  const managers = getMockUsers().filter((u) => u.role === 'ADMIN' || u.role === 'GESTOR');
  const currentIdx = PIPELINE.indexOf(request.status);
  const validNext = VALID_TRANSITIONS[request.status] ?? [];
  const TypeIcon = TYPE_ICONS[request.assetType] ?? Layers;

  const isAdmin = permissions?.isAdmin !== false;
  const showPipeline = isAdmin ? PIPELINE : GESTOR_PIPELINE;
  const currentPipelineIdx = isAdmin ? currentIdx : getGestorIndex(request.status);

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatus.mutateAsync({ id: request.id, status: status as RequestStatus, changedBy: user?.name ?? 'Sistema' });
      toast({ title: 'Status atualizado' });
    } catch {
      toast({ title: 'Erro ao atualizar status', variant: 'destructive' });
    }
  };

  const handleAssignee = async (userId: string) => {
    const u = managers.find((m) => m.id === userId);
    try {
      await updateRequest.mutateAsync({ id: request.id, assigneeId: userId, assigneeName: u?.name });
      toast({ title: 'Responsável atualizado' });
    } catch {
      toast({ title: 'Erro ao atribuir responsável', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-5">
      {/* Pipeline progress */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {PIPELINE.map((s, i) => {
          const Icon = STEP_ICONS[s];
          const isActive = s === request.status;
          const isPast = currentIdx >= 0 && i < currentIdx;
          const isFuture = currentIdx >= 0 && i > currentIdx;
          return (
            <div key={s} className="flex items-center gap-1 flex-shrink-0">
              <div
                className={cn(
                  'flex items-center justify-center rounded-full w-7 h-7 transition-colors',
                  isActive && STEP_COLORS[s],
                  isPast && 'bg-success/30 text-success',
                  isFuture && 'bg-surface-2 text-muted-foreground',
                )}
                title={REQUEST_STATUS_LABELS[s]}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              {i < PIPELINE.length - 1 && (
                <div className={cn('w-4 h-0.5 rounded', isPast ? 'bg-success/50' : 'bg-surface-3')} />
              )}
            </div>
          );
        })}
      </div>

      {/* Info grid */}
      <div className="space-y-3">
        <InfoRow label="Tipo">
          <Badge variant="outline" className="text-xs bg-surface-2 border-border text-muted-foreground gap-1">
            <TypeIcon className="h-3 w-3" />
            {REQUEST_TYPE_LABELS[request.assetType]}
          </Badge>
        </InfoRow>
        <InfoRow label="Prioridade"><PriorityBadge priority={request.priority} /></InfoRow>
        <InfoRow label="Quantidade">
          <span className="text-sm text-foreground">{request.quantityDelivered}/{request.quantity}</span>
        </InfoRow>
        <InfoRow label="Solicitante">
          <span className="text-sm text-foreground">{request.requesterName}</span>
        </InfoRow>
        <InfoRow label="Responsável">
          <Select value={request.assigneeId ?? ''} onValueChange={handleAssignee} disabled={updateRequest.isPending}>
            <SelectTrigger className="w-48 h-8"><SelectValue placeholder="Selecionar..." /></SelectTrigger>
            <SelectContent>
              {managers.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </InfoRow>

        {/* Status select with valid transitions */}
        {validNext.length > 0 && (
          <InfoRow label="Mudar Status">
            <Select onValueChange={handleStatusChange} disabled={updateStatus.isPending}>
              <SelectTrigger className="w-48 h-8"><SelectValue placeholder={REQUEST_STATUS_LABELS[request.status]} /></SelectTrigger>
              <SelectContent>
                {validNext.map((s) => (
                  <SelectItem key={s} value={s}>{REQUEST_STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </InfoRow>
        )}

        {request.dueDate && (
          <InfoRow label="Previsão">
            <span className="text-sm text-foreground">{format(new Date(request.dueDate), 'dd/MM/yyyy')}</span>
          </InfoRow>
        )}
        <InfoRow label="Criado em">
          <span className="text-sm text-foreground">{format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm')}</span>
        </InfoRow>
        {request.deliveredAt && (
          <InfoRow label="Entregue em">
            <span className="text-sm text-foreground">{format(new Date(request.deliveredAt), 'dd/MM/yyyy HH:mm')}</span>
          </InfoRow>
        )}
      </div>

      {/* Description */}
      <Separator />
      <div>
        <span className="text-sm font-medium text-foreground">Descrição</span>
        <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
      </div>

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
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
