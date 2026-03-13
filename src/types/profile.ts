export type ProfileStatus = 'ACTIVE' | 'DISABLED' | 'BLOCKED';

export interface Profile {
  id: string;
  name: string;
  email: string;
  password: string;
  profileLink?: string;
  supplierId?: string;
  supplierName?: string;
  managerId?: string;
  managerName?: string;
  auxiliarId?: string;
  auxiliarName?: string;
  proxy?: string;
  status: ProfileStatus;
  receivedAt?: string;
  deactivatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileCheckpoint {
  id: string;
  profileId: string;
  reason: string;
  facebookReason?: string;
  attachments: string[];
  date: string;
  createdAt: string;
}

export interface WarmingAction {
  id: string;
  action: string;
  date: string;
  completed: boolean;
}

export interface ProfileAnnotation {
  id: string;
  profileId: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export interface ProfileComment {
  id: string;
  profileId: string;
  text: string;
  authorName: string;
  createdAt: string;
}

export interface ProfileFilters {
  search?: string;
  status?: string;
  supplierId?: string;
  managerId?: string;
}

export interface ProfilePagination {
  page: number;
  pageSize: number;
}
