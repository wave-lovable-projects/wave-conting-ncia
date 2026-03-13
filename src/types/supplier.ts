export type SupplierAssetType = 'CONTAS' | 'PERFIS' | 'BMS' | 'PAGINAS' | 'PIXELS';
export type SupplierStatus = 'ACTIVE' | 'INACTIVE';
export type ComplaintStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Supplier {
  id: string;
  name: string;
  types: SupplierAssetType[];
  status: SupplierStatus;
  createdAt: string;
  updatedAt: string;
  totalAccounts?: number;
  totalProfiles?: number;
  totalBMs?: number;
  totalPages?: number;
  totalPixels?: number;
}

export interface ComplaintComment {
  id: string;
  complaintId: string;
  authorId: string;
  authorName: string;
  text: string;
  attachments: string[];
  createdAt: string;
}

export interface Complaint {
  id: string;
  supplierId: string;
  supplierName?: string;
  assetType: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assigneeId?: string;
  assigneeName?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  comments: ComplaintComment[];
}

export interface SupplierFilters {
  search?: string;
  status?: string;
}

export interface ComplaintFilters {
  supplierId?: string;
  status?: string;
  priority?: string;
}
