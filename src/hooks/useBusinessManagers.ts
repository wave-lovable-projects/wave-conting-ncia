import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMockBMs, setMockBMs } from '@/data/mock-business-managers';
import type { BusinessManager, BMFilters, BMPagination } from '@/types/business-manager';
import { matchesFilter } from '@/lib/utils';

function filterAndPaginate(filters: BMFilters, pagination: BMPagination) {
  let items = getMockBMs();
  if (filters.search) {
    const s = filters.search.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(s) || i.bmId.includes(s));
  }
  if (!matchesFilter(undefined, undefined)) { /* type guard */ }
  items = items.filter(i => matchesFilter(i.status, filters.status) && matchesFilter(i.supplierId, filters.supplierId));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize));
  const start = (pagination.page - 1) * pagination.pageSize;
  return { items: items.slice(start, start + pagination.pageSize), total, totalPages };
}

export function useBMs(filters: BMFilters, pagination: BMPagination) {
  return useQuery({
    queryKey: ['business-managers', filters, pagination],
    queryFn: () => Promise.resolve(filterAndPaginate(filters, pagination)),
  });
}

export function useBMStats() {
  return useQuery({
    queryKey: ['business-managers', 'stats'],
    queryFn: () => {
      const all = getMockBMs();
      return Promise.resolve({
        total: all.length,
        active: all.filter(b => b.status === 'ACTIVE').length,
        disabled: all.filter(b => b.status === 'DISABLED').length,
        blocked: all.filter(b => b.status === 'BLOCKED').length,
      });
    },
  });
}

export function useCreateBM() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<BusinessManager, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const bm: BusinessManager = { ...data, id: `bm-${Date.now()}`, createdAt: now, updatedAt: now };
      setMockBMs([bm, ...getMockBMs()]);
      return Promise.resolve(bm);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['business-managers'] }); },
  });
}

export function useUpdateBM() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<BusinessManager> & { id: string }) => {
      setMockBMs(getMockBMs().map(b => b.id === id ? { ...b, ...data, updatedAt: new Date().toISOString() } : b));
      return Promise.resolve(getMockBMs().find(b => b.id === id)!);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['business-managers'] }); },
  });
}

export function useDeleteBM() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      setMockBMs(getMockBMs().filter(b => b.id !== id));
      return Promise.resolve();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['business-managers'] }); },
  });
}
