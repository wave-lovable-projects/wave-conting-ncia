import { useMemo } from 'react';
import type { RequestStatus } from '@/types/request';
import { REQUEST_STATUS_LABELS } from '@/types/request';
import type { UserRole } from '@/store/ui.store';

export interface RequestPermissions {
  canChangeStatus: boolean;
  canViewSupplierInfo: boolean;
  canViewAllRequests: boolean;
  canLinkAssets: boolean;
  canAssign: boolean;
  canCancelOwn: boolean;
  visiblePipelineStatuses: RequestStatus[];
  simplifiedStatusLabel: (s: RequestStatus) => string;
  pageTitle: string;
  isAdmin: boolean;
}

const SIMPLIFIED_LABELS: Record<RequestStatus, string> = {
  PENDENTE: 'Meu Pedido',
  APROVADA: 'Em Preparação',
  SOLICITADA_FORNECEDOR: 'Em Preparação',
  RECEBIDA: 'Em Preparação',
  EM_AQUECIMENTO: 'Em Preparação',
  PRONTA: 'Pronto',
  ENTREGUE: 'Entregue',
  REJEITADA: 'Rejeitada',
  CANCELADA: 'Cancelada',
};

const ADMIN_PIPELINE: RequestStatus[] = [
  'PENDENTE', 'APROVADA', 'SOLICITADA_FORNECEDOR', 'RECEBIDA',
  'EM_AQUECIMENTO', 'PRONTA', 'ENTREGUE',
];

const GESTOR_PIPELINE: RequestStatus[] = [
  'PENDENTE', 'PRONTA', 'ENTREGUE',
];

export function useRequestPermissions(role?: UserRole, _userId?: string): RequestPermissions {
  return useMemo(() => {
    const isAdmin = role === 'ADMIN';

    return {
      isAdmin,
      canChangeStatus: isAdmin,
      canViewSupplierInfo: isAdmin,
      canViewAllRequests: isAdmin,
      canLinkAssets: isAdmin,
      canAssign: isAdmin,
      canCancelOwn: !isAdmin,
      visiblePipelineStatuses: isAdmin ? ADMIN_PIPELINE : GESTOR_PIPELINE,
      simplifiedStatusLabel: (s: RequestStatus) =>
        isAdmin ? REQUEST_STATUS_LABELS[s] : SIMPLIFIED_LABELS[s],
      pageTitle: isAdmin ? 'Gestão de Solicitações' : 'Minhas Solicitações',
    };
  }, [role]);
}

/** Kanban columns config for GESTOR simplified view */
export const GESTOR_KANBAN_COLUMNS: { status: string; label: string; color: string; groupedStatuses: RequestStatus[] }[] = [
  { status: 'PENDENTE', label: 'Meu Pedido', color: 'bg-warning', groupedStatuses: ['PENDENTE'] },
  { status: 'EM_PREPARACAO', label: 'Em Preparação', color: 'bg-info', groupedStatuses: ['APROVADA', 'SOLICITADA_FORNECEDOR', 'RECEBIDA', 'EM_AQUECIMENTO'] },
  { status: 'PRONTA', label: 'Pronto', color: 'bg-success', groupedStatuses: ['PRONTA'] },
  { status: 'ENTREGUE', label: 'Entregue', color: 'bg-success', groupedStatuses: ['ENTREGUE'] },
];
