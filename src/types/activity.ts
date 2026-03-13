export type ActivityAction = 'created' | 'updated' | 'deleted' | 'imported';

export const ACTION_LABELS: Record<ActivityAction, string> = {
  created: 'Criou',
  updated: 'Editou',
  deleted: 'Excluiu',
  imported: 'Importou',
};

export const ENTITY_TYPE_LABELS: Record<string, string> = {
  AD_ACCOUNT: 'Conta de Anúncio',
  BUSINESS_MANAGER: 'Business Manager',
  PROFILE: 'Perfil',
  PAGE: 'Página',
  PIXEL: 'Pixel',
  SUPPLIER: 'Fornecedor',
  REQUEST: 'Solicitação',
  USER: 'Usuário',
};

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: ActivityAction;
  entityType: string;
  entityId: string;
  entityName?: string;
  details?: Record<string, any>;
  createdAt: string;
}

export interface ActivityFilters {
  search?: string;
  entityTypes?: string[];
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ActivityPagination {
  page: number;
  pageSize: number;
}
