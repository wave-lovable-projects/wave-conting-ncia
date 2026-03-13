import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMockPixels, setMockPixels } from '@/data/mock-pixels';
import type { Pixel, PixelFilters, PixelPagination } from '@/types/pixel';

function filterAndPaginate(filters: PixelFilters, pagination: PixelPagination) {
  let items = getMockPixels();
  if (filters.search) {
    const s = filters.search.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(s) || i.pixelId.includes(s));
  }
  if (filters.status) items = items.filter(i => i.status === filters.status);
  if (filters.supplierId) items = items.filter(i => i.supplierId === filters.supplierId);
  if (filters.bmId) items = items.filter(i => i.bmId === filters.bmId);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize));
  const start = (pagination.page - 1) * pagination.pageSize;
  return { items: items.slice(start, start + pagination.pageSize), total, totalPages };
}

export function usePixels(filters: PixelFilters, pagination: PixelPagination) {
  return useQuery({
    queryKey: ['pixels', filters, pagination],
    queryFn: () => Promise.resolve(filterAndPaginate(filters, pagination)),
  });
}

export function usePixelStats() {
  return useQuery({
    queryKey: ['pixels', 'stats'],
    queryFn: () => {
      const all = getMockPixels();
      return Promise.resolve({
        total: all.length,
        active: all.filter(p => p.status === 'ACTIVE').length,
        disabled: all.filter(p => p.status === 'DISABLED').length,
        blocked: all.filter(p => p.status === 'BLOCKED').length,
      });
    },
  });
}

export function useCreatePixel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Pixel, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const p: Pixel = { ...data, id: `px-${Date.now()}`, createdAt: now, updatedAt: now };
      setMockPixels([p, ...getMockPixels()]);
      return Promise.resolve(p);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pixels'] }); },
  });
}

export function useUpdatePixel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Pixel> & { id: string }) => {
      setMockPixels(getMockPixels().map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p));
      return Promise.resolve(getMockPixels().find(p => p.id === id)!);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pixels'] }); },
  });
}

export function useDeletePixel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      setMockPixels(getMockPixels().filter(p => p.id !== id));
      return Promise.resolve();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pixels'] }); },
  });
}

export function useBulkDeletePixels() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => {
      const idSet = new Set(ids);
      setMockPixels(getMockPixels().filter(p => !idSet.has(p.id)));
      return Promise.resolve();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pixels'] }); },
  });
}
