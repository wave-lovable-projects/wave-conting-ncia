export type PageStatus = 'ACTIVE' | 'DISABLED' | 'BLOCKED';

export interface FacebookPage {
  id: string;
  name: string;
  pageId: string;
  bmId?: string;
  bmName?: string;
  originBmId?: string;
  supplierId?: string;
  supplierName?: string;
  status: PageStatus;
  receivedAt?: string;
  blockedAt?: string;
  usedAt?: string;
  managerId?: string;
  managerName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageFilters {
  search?: string;
  status?: string;
  supplierId?: string;
  bmId?: string;
}

export interface PagePagination {
  page: number;
  pageSize: number;
}
