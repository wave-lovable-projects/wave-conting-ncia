export type BMStatus = 'ACTIVE' | 'DISABLED' | 'BLOCKED';

export interface BusinessManager {
  id: string;
  name: string;
  bmId: string;
  function: string;
  status: BMStatus;
  supplierId?: string;
  supplierName?: string;
  receivedAt?: string;
  blockedAt?: string;
  gestores: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface BMFilters {
  search?: string;
  status?: string;
  supplierId?: string;
}

export interface BMPagination {
  page: number;
  pageSize: number;
}
