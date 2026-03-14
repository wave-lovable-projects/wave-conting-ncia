import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMockProfiles, setMockProfiles, getMockCheckpoints, setMockCheckpoints, getMockWarmingActions, setMockWarmingActions, getMockAnnotations, setMockAnnotations, getMockComments, setMockComments } from '@/data/mock-profiles';
import type { Profile, ProfileCheckpoint, WarmingAction, ProfileAnnotation, ProfileComment, ProfileFilters, ProfilePagination } from '@/types/profile';
import { matchesFilter } from '@/lib/utils';

function filterAndPaginate(filters: ProfileFilters, pagination: ProfilePagination) {
  let items = getMockProfiles();
  if (filters.search) {
    const s = filters.search.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(s) || i.email.toLowerCase().includes(s));
  }
  items = items.filter(i => matchesFilter(i.status, filters.status) && matchesFilter(i.supplierId, filters.supplierId) && matchesFilter(i.managerId, filters.managerId));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize));
  const start = (pagination.page - 1) * pagination.pageSize;
  return { items: items.slice(start, start + pagination.pageSize), total, totalPages };
}

export function useProfiles(filters: ProfileFilters, pagination: ProfilePagination) {
  return useQuery({
    queryKey: ['profiles', filters, pagination],
    queryFn: () => Promise.resolve(filterAndPaginate(filters, pagination)),
  });
}

export function useProfileStats() {
  return useQuery({
    queryKey: ['profiles', 'stats'],
    queryFn: () => {
      const all = getMockProfiles();
      return Promise.resolve({
        total: all.length,
        active: all.filter(p => p.status === 'ACTIVE').length,
        disabled: all.filter(p => p.status === 'DISABLED').length,
        blocked: all.filter(p => p.status === 'BLOCKED').length,
      });
    },
  });
}

export function useCreateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const p: Profile = { ...data, id: `pf-${Date.now()}`, createdAt: now, updatedAt: now };
      setMockProfiles([p, ...getMockProfiles()]);
      return Promise.resolve(p);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profiles'] }); },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Profile> & { id: string }) => {
      setMockProfiles(getMockProfiles().map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p));
      return Promise.resolve(getMockProfiles().find(p => p.id === id)!);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profiles'] }); },
  });
}

export function useBulkUpdateProfiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, data }: { ids: string[]; data: Partial<Profile> }) => {
      const idSet = new Set(ids);
      setMockProfiles(getMockProfiles().map(p => idSet.has(p.id) ? { ...p, ...data, updatedAt: new Date().toISOString() } : p));
      return Promise.resolve();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profiles'] }); },
  });
}

export function useDeleteProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      setMockProfiles(getMockProfiles().filter(p => p.id !== id));
      return Promise.resolve();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profiles'] }); },
  });
}

export function useProfileCheckpoints(profileId: string) {
  return useQuery({
    queryKey: ['profiles', profileId, 'checkpoints'],
    queryFn: () => Promise.resolve(getMockCheckpoints().filter(c => c.profileId === profileId)),
  });
}

export function useCreateCheckpoint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ProfileCheckpoint, 'id' | 'createdAt'>) => {
      const cp: ProfileCheckpoint = { ...data, id: `ck-${Date.now()}`, createdAt: new Date().toISOString() };
      setMockCheckpoints([...getMockCheckpoints(), cp]);
      return Promise.resolve(cp);
    },
    onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ['profiles', v.profileId, 'checkpoints'] }); },
  });
}

export function useProfileWarming(profileId: string) {
  return useQuery({
    queryKey: ['profiles', profileId, 'warming'],
    queryFn: () => Promise.resolve(getMockWarmingActions()),
    enabled: !!profileId,
  });
}

export function useCompleteWarmingAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ actionId, completed }: { actionId: string; completed: boolean; profileId: string }) => {
      setMockWarmingActions(getMockWarmingActions().map(a => a.id === actionId ? { ...a, completed } : a));
      return Promise.resolve();
    },
    onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ['profiles', v.profileId, 'warming'] }); },
  });
}

export function useProfileAnnotations(profileId: string) {
  return useQuery({
    queryKey: ['profiles', profileId, 'annotations'],
    queryFn: () => Promise.resolve(getMockAnnotations().filter(a => a.profileId === profileId)),
    enabled: !!profileId,
  });
}

export function useCreateAnnotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ProfileAnnotation, 'id' | 'createdAt'>) => {
      const a: ProfileAnnotation = { ...data, id: `an-${Date.now()}`, createdAt: new Date().toISOString() };
      setMockAnnotations([a, ...getMockAnnotations()]);
      return Promise.resolve(a);
    },
    onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ['profiles', v.profileId, 'annotations'] }); },
  });
}

export function useProfileComments(profileId: string) {
  return useQuery({
    queryKey: ['profiles', profileId, 'comments'],
    queryFn: () => Promise.resolve(getMockComments().filter(c => c.profileId === profileId)),
    enabled: !!profileId,
  });
}

export function useCreateComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ProfileComment, 'id' | 'createdAt'>) => {
      const c: ProfileComment = { ...data, id: `cm-${Date.now()}`, createdAt: new Date().toISOString() };
      setMockComments([...getMockComments(), c]);
      return Promise.resolve(c);
    },
    onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ['profiles', v.profileId, 'comments'] }); },
  });
}
