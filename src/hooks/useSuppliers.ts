import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Supplier, Complaint, SupplierFilters, ComplaintFilters, ComplaintComment } from '@/types/supplier';
import { getMockSuppliers, setMockSuppliers, getMockComplaints, setMockComplaints } from '@/data/mock-suppliers';

function applySupplierFilters(suppliers: Supplier[], filters: SupplierFilters) {
  return suppliers.filter((s) => {
    if (filters.search && !s.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.status && s.status !== filters.status) return false;
    return true;
  });
}

function applyComplaintFilters(complaints: Complaint[], filters: ComplaintFilters) {
  return complaints.filter((c) => {
    if (filters.supplierId && c.supplierId !== filters.supplierId) return false;
    if (filters.status && c.status !== filters.status) return false;
    if (filters.priority && c.priority !== filters.priority) return false;
    return true;
  });
}

export function useSuppliers(filters: SupplierFilters = {}) {
  return useQuery({
    queryKey: ['suppliers', filters],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return applySupplierFilters(getMockSuppliers(), filters);
    },
  });
}

export function useSupplier(id: string | null) {
  return useQuery({
    queryKey: ['supplier', id],
    enabled: !!id,
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 100));
      return getMockSuppliers().find((s) => s.id === id) ?? null;
    },
  });
}

export function useSupplierStats() {
  return useQuery({
    queryKey: ['supplier-stats'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 100));
      return getMockSuppliers();
    },
  });
}

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
      await new Promise((r) => setTimeout(r, 300));
      const all = getMockSuppliers();
      const newS: Supplier = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setMockSuppliers([newS, ...all]);
      return newS;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['suppliers'] }); qc.invalidateQueries({ queryKey: ['supplier-stats'] }); },
  });
}

export function useUpdateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Supplier> & { id: string }) => {
      await new Promise((r) => setTimeout(r, 300));
      const all = getMockSuppliers();
      const idx = all.findIndex((s) => s.id === id);
      if (idx >= 0) { all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() }; setMockSuppliers(all); }
      return all[idx];
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['suppliers'] }); qc.invalidateQueries({ queryKey: ['supplier-stats'] }); },
  });
}

export function useDeleteSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 300));
      setMockSuppliers(getMockSuppliers().filter((s) => s.id !== id));
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['suppliers'] }); qc.invalidateQueries({ queryKey: ['supplier-stats'] }); },
  });
}

export function useComplaints(filters: ComplaintFilters = {}) {
  return useQuery({
    queryKey: ['complaints', filters],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return applyComplaintFilters(getMockComplaints(), filters);
    },
  });
}

export function useComplaint(id: string | null) {
  return useQuery({
    queryKey: ['complaint', id],
    enabled: !!id,
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 100));
      return getMockComplaints().find((c) => c.id === id) ?? null;
    },
  });
}

export function useCreateComplaint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
      await new Promise((r) => setTimeout(r, 300));
      const all = getMockComplaints();
      const newC: Complaint = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), comments: [] };
      setMockComplaints([newC, ...all]);
      return newC;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['complaints'] }); },
  });
}

export function useUpdateComplaintStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await new Promise((r) => setTimeout(r, 300));
      const all = getMockComplaints();
      const idx = all.findIndex((c) => c.id === id);
      if (idx >= 0) { all[idx] = { ...all[idx], status: status as any, updatedAt: new Date().toISOString() }; setMockComplaints(all); }
      return all[idx];
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['complaints'] }); qc.invalidateQueries({ queryKey: ['complaint'] }); },
  });
}

export function useAddComplaintComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ complaintId, text }: { complaintId: string; text: string }) => {
      await new Promise((r) => setTimeout(r, 300));
      const all = getMockComplaints();
      const idx = all.findIndex((c) => c.id === complaintId);
      if (idx >= 0) {
        const comment: ComplaintComment = { id: crypto.randomUUID(), complaintId, authorId: 'u1', authorName: 'Admin Wave', text, attachments: [], createdAt: new Date().toISOString() };
        all[idx].comments.push(comment);
        setMockComplaints(all);
        return comment;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['complaints'] }); qc.invalidateQueries({ queryKey: ['complaint'] }); },
  });
}
