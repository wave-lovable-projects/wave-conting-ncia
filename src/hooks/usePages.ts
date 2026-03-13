import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMockPages, setMockPages } from '@/data/mock-pages';
import type { FacebookPage, PageFilters, PagePagination } from '@/types/page';

function filterAndPaginate(filters: PageFilters, pagination: PagePagination) {
  let items = getMockPages();
  if (filters.search) {
    const s = filters.search.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(s) || i.pageId.includes(s));
  }
  if (filters.status) items = items.filter(i => i.status === filters.status);
  if (filters.supplierId) items = items.filter(i => i.supplierId === filters.supplierId);
  if (filters.bmId) items = items.filter(i => i.bmId === filters.bmId);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize));
  const start = (pagination.page - 1) * pagination.pageSize;
  return { items: items.slice(start, start + pagination.pageSize), total, totalPages };
}

export function usePages(filters: PageFilters, pagination: PagePagination) {
  return useQuery({
    queryKey: ['pages', filters, pagination],
    queryFn: () => Promise.resolve(filterAndPaginate(filters, pagination)),
  });
}

export function usePageStats() {
  return useQuery({
    queryKey: ['pages', 'stats'],
    queryFn: () => {
      const all = getMockPages();
      return Promise.resolve({
        total: all.length,
        active: all.filter(p => p.status === 'ACTIVE').length,
        disabled: all.filter(p => p.status === 'DISABLED').length,
        blocked: all.filter(p => p.status === 'BLOCKED').length,
      });
    },
  });
}

export function useCreatePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<FacebookPage, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const p: FacebookPage = { ...data, id: `pg-${Date.now()}`, createdAt: now, updatedAt: now };
      setMockPages([p, ...getMockPages()]);
      return Promise.resolve(p);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pages'] }); },
  });
}

export function useUpdatePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<FacebookPage> & { id: string }) => {
      setMockPages(getMockPages().map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p));
      return Promise.resolve(getMockPages().find(p => p.id === id)!);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pages'] }); },
  });
}

export function useDeletePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      setMockPages(getMockPages().filter(p => p.id !== id));
      return Promise.resolve();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pages'] }); },
  });
}
