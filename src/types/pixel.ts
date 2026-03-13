export type PixelStatus = 'ACTIVE' | 'DISABLED' | 'BLOCKED';

export interface Pixel {
  id: string;
  name: string;
  pixelId: string;
  bmId?: string;
  bmName?: string;
  supplierId?: string;
  supplierName?: string;
  status: PixelStatus;
  domain?: string;
  receivedAt?: string;
  blockedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PixelFilters {
  search?: string;
  status?: string;
  supplierId?: string;
  bmId?: string;
}

export interface PixelPagination {
  page: number;
  pageSize: number;
}
