export const REQUEST_STATUSES = [
  'PENDENTE',
  'APROVADA',
  'SOLICITADA_FORNECEDOR',
  'RECEBIDA',
  'EM_AQUECIMENTO',
  'PRONTA',
  'ENTREGUE',
  'REJEITADA',
  'CANCELADA',
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  PENDENTE: 'Pendente',
  APROVADA: 'Aprovada',
  SOLICITADA_FORNECEDOR: 'Solicitada ao Fornecedor',
  RECEBIDA: 'Recebida',
  EM_AQUECIMENTO: 'Em Aquecimento',
  PRONTA: 'Pronta',
  ENTREGUE: 'Entregue',
  REJEITADA: 'Rejeitada',
  CANCELADA: 'Cancelada',
};

export const REQUEST_TYPES = [
  'CONTA_ANUNCIO',
  'BUSINESS_MANAGER',
  'PERFIL',
  'PAGINA',
  'PIXEL',
  'SALDO',
  'MISTO',
] as const;

export type RequestType = (typeof REQUEST_TYPES)[number];

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  CONTA_ANUNCIO: 'Conta de Anúncio',
  BUSINESS_MANAGER: 'Business Manager',
  PERFIL: 'Perfil',
  PAGINA: 'Página',
  PIXEL: 'Pixel',
  SALDO: 'Saldo (Recarga)',
  MISTO: 'Misto',
};

export type RequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface RequestStatusChange {
  id: string;
  fromStatus: RequestStatus;
  toStatus: RequestStatus;
  changedBy: string;
  changedAt: string;
}

export interface RequestComment {
  id: string;
  requestId: string;
  authorId: string;
  authorName: string;
  text: string;
  attachments: string[];
  createdAt: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  assetType: RequestType;
  priority: RequestPriority;
  status: RequestStatus;
  quantity: number;
  quantityDelivered: number;
  linkedAssetIds: string[];
  requesterId: string;
  requesterName: string;
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  statusHistory: RequestStatusChange[];
  comments: RequestComment[];
  // Supplier fields
  supplierOrderId?: string;
  supplierId?: string;
  supplierName?: string;
  supplierOrderDate?: string;
  supplierExpectedDate?: string;
  supplierReceivedDate?: string;
  supplierCost?: number;
  // Warming fields
  warmingStartDate?: string;
  warmingEndDate?: string;
  // Delivery
  deliveredAt?: string;
  // Specifications
  specifications?: Record<string, string>;
}

export interface RequestFilters {
  search?: string;
  assetType?: string;
  status?: string;
  priority?: string;
  requesterId?: string;
  assigneeId?: string;
  supplierId?: string;
}
