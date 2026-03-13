import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Request, RequestFilters, RequestComment, RequestStatusChange, RequestStatus } from '@/types/request';
import { getMockRequests, setMockRequests } from '@/data/mock-requests';

function applyFilters(requests: Request[], filters: RequestFilters) {
  return requests.filter((r) => {
    if (filters.search && !r.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.type && r.type !== filters.type) return false;
    if (filters.status && r.status !== filters.status) return false;
    if (filters.priority && r.priority !== filters.priority) return false;
    if (filters.requesterId && r.requesterId !== filters.requesterId) return false;
    if (filters.assigneeId && r.assigneeId !== filters.assigneeId) return false;
    return true;
  });
}

export function useRequests(filters: RequestFilters = {}) {
  return useQuery({
    queryKey: ['requests', filters],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return applyFilters(getMockRequests(), filters);
    },
  });
}

export function useRequest(id: string | null) {
  return useQuery({
    queryKey: ['request', id],
    enabled: !!id,
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 100));
      return getMockRequests().find((r) => r.id === id) ?? null;
    },
  });
}

export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Request, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory' | 'comments'>) => {
      await new Promise((r) => setTimeout(r, 300));
      const all = getMockRequests();
      const newR: Request = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), statusHistory: [], comments: [] };
      setMockRequests([newR, ...all]);
      return newR;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['requests'] }); },
  });
}

export function useUpdateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Request> & { id: string }) => {
      await new Promise((r) => setTimeout(r, 300));
      const all = getMockRequests();
      const idx = all.findIndex((r) => r.id === id);
      if (idx >= 0) { all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() }; setMockRequests(all); }
      return all[idx];
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['requests'] }); },
  });
}

export function useUpdateRequestStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, changedBy }: { id: string; status: RequestStatus; changedBy: string }) => {
      await new Promise((r) => setTimeout(r, 300));
      const all = getMockRequests();
      const idx = all.findIndex((r) => r.id === id);
      if (idx >= 0) {
        const change: RequestStatusChange = { id: crypto.randomUUID(), fromStatus: all[idx].status, toStatus: status, changedBy, changedAt: new Date().toISOString() };
        all[idx] = { ...all[idx], status, updatedAt: new Date().toISOString(), statusHistory: [...all[idx].statusHistory, change] };
        setMockRequests(all);
      }
      return all[idx];
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['requests'] }); qc.invalidateQueries({ queryKey: ['request'] }); },
  });
}

export function useAddRequestComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ requestId, text }: { requestId: string; text: string }) => {
      await new Promise((r) => setTimeout(r, 300));
      const all = getMockRequests();
      const idx = all.findIndex((r) => r.id === requestId);
      if (idx >= 0) {
        const comment: RequestComment = { id: crypto.randomUUID(), requestId, authorId: 'u1', authorName: 'Admin Wave', text, attachments: [], createdAt: new Date().toISOString() };
        all[idx].comments.push(comment);
        setMockRequests(all);
        return comment;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['requests'] }); qc.invalidateQueries({ queryKey: ['request'] }); },
  });
}
