import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AdAccount, AdAccountFilters, AdAccountPagination } from '@/types/ad-account';
import { getMockAdAccounts, getMockHistory, setMockAdAccounts } from '@/data/mock-ad-accounts';
import { matchesFilter } from '@/lib/utils';

function applyFilters(accounts: AdAccount[], filters: AdAccountFilters) {
  return accounts.filter((a) => {
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!a.name.toLowerCase().includes(s) && !a.accountId.includes(s)) return false;
    }
    if (!matchesFilter(a.accountStatus, filters.accountStatus)) return false;
    if (!matchesFilter(a.usageStatus, filters.usageStatus)) return false;
    if (filters.balanceRemoved === 'true' && !a.balanceRemoved) return false;
    if (!matchesFilter(a.managerId, filters.managerId)) return false;
    if (!matchesFilter(a.niche, filters.niche)) return false;
    if (!matchesFilter(a.supplierId, filters.supplierId)) return false;
    if (!matchesFilter(a.paymentType, filters.paymentType)) return false;
    return true;
  });
}

export function useAdAccounts(filters: AdAccountFilters, pagination: AdAccountPagination) {
  return useQuery({
    queryKey: ['ad-accounts', filters, pagination],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      const all = getMockAdAccounts();
      const filtered = applyFilters(all, filters);
      const start = (pagination.page - 1) * pagination.pageSize;
      const items = filtered.slice(start, start + pagination.pageSize);
      return { items, total: filtered.length, totalPages: Math.ceil(filtered.length / pagination.pageSize) || 1 };
    },
  });
}

export function useAdAccountStats() {
  return useQuery({
    queryKey: ['ad-accounts-stats'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 100));
      const all = getMockAdAccounts();
      return {
        total: all.length,
        active: all.filter((a) => a.accountStatus === 'ACTIVE').length,
        disabled: all.filter((a) => a.accountStatus === 'DISABLED').length,
        rollback: all.filter((a) => a.accountStatus === 'ROLLBACK').length,
        inUse: all.filter((a) => a.usageStatus === 'IN_USE').length,
        balanceRemoved: all.filter((a) => a.balanceRemoved).length,
      };
    },
  });
}

export function useAdAccount(id: string | null) {
  return useQuery({
    queryKey: ['ad-account', id],
    enabled: !!id,
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 100));
      return getMockAdAccounts().find((a) => a.id === id) ?? null;
    },
  });
}

export function useCreateAdAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<AdAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
      await new Promise((r) => setTimeout(r, 300));
      const all = getMockAdAccounts();
      const newAcc: AdAccount = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setMockAdAccounts([newAcc, ...all]);
      return newAcc;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ad-accounts'] }); qc.invalidateQueries({ queryKey: ['ad-accounts-stats'] }); },
  });
}

export function useUpdateAdAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<AdAccount> & { id: string }) => {
      await new Promise((r) => setTimeout(r, 300));
      const all = getMockAdAccounts();
      const idx = all.findIndex((a) => a.id === id);
      if (idx >= 0) { all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() }; setMockAdAccounts(all); }
      return all[idx];
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ad-accounts'] }); qc.invalidateQueries({ queryKey: ['ad-accounts-stats'] }); },
  });
}

export function useDeleteAdAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 300));
      setMockAdAccounts(getMockAdAccounts().filter((a) => a.id !== id));
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ad-accounts'] }); qc.invalidateQueries({ queryKey: ['ad-accounts-stats'] }); },
  });
}

export function useBulkUpdateAdAccounts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, data }: { ids: string[]; data: Partial<AdAccount> }) => {
      await new Promise((r) => setTimeout(r, 400));
      const all = getMockAdAccounts();
      const updated = all.map((a) => ids.includes(a.id) ? { ...a, ...data, updatedAt: new Date().toISOString() } : a);
      setMockAdAccounts(updated);
      return updated.filter((a) => ids.includes(a.id));
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ad-accounts'] }); qc.invalidateQueries({ queryKey: ['ad-accounts-stats'] }); },
  });
}

export function useAdAccountHistory(accountId: string | null, field?: string) {
  return useQuery({
    queryKey: ['ad-account-history', accountId, field],
    enabled: !!accountId,
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 150));
      return getMockHistory(accountId!, field);
    },
  });
}
