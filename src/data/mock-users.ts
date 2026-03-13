import type { User } from '@/types/user';

let mockUsers: User[] = [
  { id: 'u1', name: 'Admin Wave', email: 'admin@wave.com', role: 'ADMIN', squadId: undefined, isActive: true, createdAt: '2025-01-01T10:00:00Z' },
  { id: 'u7', name: 'Fernanda Souza', email: 'fernanda@wave.com', role: 'ADMIN', squadId: undefined, isActive: true, createdAt: '2025-01-05T10:00:00Z' },
  { id: 'u2', name: 'Carlos Silva', email: 'carlos@wave.com', role: 'GESTOR', squadId: 'sq1', squadName: 'Squad Alpha', isActive: true, createdAt: '2025-01-10T10:00:00Z' },
  { id: 'u3', name: 'Ana Oliveira', email: 'ana@wave.com', role: 'GESTOR', squadId: 'sq2', squadName: 'Squad Beta', isActive: true, createdAt: '2025-01-12T10:00:00Z' },
  { id: 'u8', name: 'Pedro Mendes', email: 'pedro@wave.com', role: 'GESTOR', squadId: 'sq3', squadName: 'Squad Gamma', isActive: false, createdAt: '2025-01-15T10:00:00Z' },
  { id: 'u4', name: 'Rafael Santos', email: 'rafael@wave.com', role: 'AUXILIAR', squadId: 'sq1', squadName: 'Squad Alpha', managerId: 'u2', managerName: 'Carlos Silva', isActive: true, createdAt: '2025-01-20T10:00:00Z' },
  { id: 'u5', name: 'Juliana Costa', email: 'juliana@wave.com', role: 'AUXILIAR', squadId: 'sq2', squadName: 'Squad Beta', managerId: 'u3', managerName: 'Ana Oliveira', isActive: true, createdAt: '2025-01-22T10:00:00Z' },
  { id: 'u6', name: 'Mariana Lima', email: 'mariana@wave.com', role: 'AUXILIAR', squadId: 'sq1', squadName: 'Squad Alpha', managerId: 'u2', managerName: 'Carlos Silva', isActive: true, createdAt: '2025-01-25T10:00:00Z' },
  { id: 'u9', name: 'Lucas Ferreira', email: 'lucas@wave.com', role: 'AUXILIAR', squadId: 'sq3', squadName: 'Squad Gamma', managerId: 'u8', managerName: 'Pedro Mendes', isActive: false, createdAt: '2025-02-01T10:00:00Z' },
  { id: 'u10', name: 'Beatriz Almeida', email: 'beatriz@wave.com', role: 'AUXILIAR', squadId: 'sq2', squadName: 'Squad Beta', managerId: 'u3', managerName: 'Ana Oliveira', isActive: true, createdAt: '2025-02-05T10:00:00Z' },
];

export const getMockUsers = () => [...mockUsers];
export const setMockUsers = (u: User[]) => { mockUsers = u; };

export const mockSquads = [
  { id: 'sq1', name: 'Squad Alpha' },
  { id: 'sq2', name: 'Squad Beta' },
  { id: 'sq3', name: 'Squad Gamma' },
];
