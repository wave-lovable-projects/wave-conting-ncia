import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { User, UserFilters } from '@/types/user';
import { getMockUsers, setMockUsers } from '@/data/mock-users';

function applyFilters(users: User[], filters: UserFilters) {
  return users.filter((u) => {
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!u.name.toLowerCase().includes(s) && !u.email.toLowerCase().includes(s)) return false;
    }
    if (filters.role && u.role !== filters.role) return false;
    if (filters.squadId && u.squadId !== filters.squadId) return false;
    if (filters.isActive !== undefined && filters.isActive !== '') {
      if (filters.isActive === 'true' && !u.isActive) return false;
      if (filters.isActive === 'false' && u.isActive) return false;
    }
    return true;
  });
}

export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return applyFilters(getMockUsers(), filters);
    },
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<User, 'id' | 'createdAt'> & { password?: string }) => {
      await new Promise((r) => setTimeout(r, 300));
      const all = getMockUsers();
      const newU: User = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      setMockUsers([newU, ...all]);
      return newU;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<User> & { id: string }) => {
      await new Promise((r) => setTimeout(r, 300));
      const all = getMockUsers();
      const idx = all.findIndex((u) => u.id === id);
      if (idx >= 0) { all[idx] = { ...all[idx], ...data }; setMockUsers(all); }
      return all[idx];
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 300));
      setMockUsers(getMockUsers().filter((u) => u.id !== id));
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); },
  });
}

export function useToggleUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 300));
      const all = getMockUsers();
      const idx = all.findIndex((u) => u.id === id);
      if (idx >= 0) { all[idx] = { ...all[idx], isActive: !all[idx].isActive }; setMockUsers(all); }
      return all[idx];
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async ({ id, password }: { id: string; password: string }) => {
      await new Promise((r) => setTimeout(r, 300));
      return { success: true };
    },
  });
}
