export type UserRole = 'ADMIN' | 'GESTOR' | 'AUXILIAR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  squadId?: string;
  squadName?: string;
  managerId?: string;
  managerName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  squadId?: string;
  isActive?: string;
}
