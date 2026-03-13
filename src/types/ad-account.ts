export type AccountStatus = 'WARMING' | 'ACTIVE' | 'ADVERTISING' | 'DISABLED' | 'ROLLBACK';
export type BmStatus = 'ACTIVE' | 'DISABLED';
export type UsageStatus = 'IN_USE' | 'STANDBY' | 'RETIRED';
export type PaymentType = 'CARD' | 'AGENCY';
export type Currency = 'USD' | 'BRL';

export interface AdAccount {
  id: string;
  name: string;
  accountId: string;
  accessLink?: string;
  supplierId?: string;
  supplierName?: string;
  bmId?: string;
  bmName?: string;
  niche?: string;
  product?: string;
  vsl?: string;
  managerId?: string;
  managerName?: string;
  accountStatus: AccountStatus;
  bmStatus?: BmStatus;
  balance: number;
  currency: Currency;
  paymentType?: PaymentType;
  cardLast4?: string;
  usageStatus: UsageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdAccountHistory {
  id: string;
  field: string;
  oldValue?: string;
  newValue?: string;
  changedByName: string;
  createdAt: string;
}

export interface AdAccountFilters {
  managerId?: string;
  accountStatus?: string;
  niche?: string;
  squadId?: string;
  supplierId?: string;
  paymentType?: string;
  search?: string;
  usageStatus?: string;
}

export interface AdAccountPagination {
  page: number;
  pageSize: number;
}

export interface ManagerOption {
  id: string;
  name: string;
}

export interface SupplierOption {
  id: string;
  name: string;
}
