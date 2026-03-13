import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMockIncidents, setMockIncidents, getMockDiagnosticLinks, setMockDiagnosticLinks, getMockDiagnosticNodes } from '@/data/mock-diagnostics';
import type { Incident, DiagnosticLink, IncidentFilters, GraphFilters } from '@/types/diagnostic';
import { toast } from 'sonner';

export function useIncidents(filters: IncidentFilters) {
  return useQuery({
    queryKey: ['incidents', filters],
    queryFn: () => {
      let data = getMockIncidents();
      if (filters.assetType) data = data.filter(i => i.assetType === filters.assetType);
      if (filters.restrictionType) data = data.filter(i => i.restrictionType === filters.restrictionType);
      if (filters.startDate) data = data.filter(i => i.date >= filters.startDate!);
      if (filters.endDate) data = data.filter(i => i.date <= filters.endDate!);
      return data.sort((a, b) => b.date.localeCompare(a.date));
    },
  });
}

export function useCreateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Incident, 'id' | 'createdAt'>) => {
      const incidents = getMockIncidents();
      const newItem: Incident = { ...data, id: `inc-${Date.now()}`, createdAt: new Date().toISOString() };
      setMockIncidents([newItem, ...incidents]);
      return Promise.resolve(newItem);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['incidents'] }); toast.success('Incidente registrado com sucesso'); },
    onError: () => toast.error('Erro ao registrar incidente'),
  });
}

export function useDeleteIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      setMockIncidents(getMockIncidents().filter(i => i.id !== id));
      return Promise.resolve();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['incidents'] }); toast.success('Incidente removido'); },
    onError: () => toast.error('Erro ao remover incidente'),
  });
}

export function useDiagnosticLinks() {
  return useQuery({ queryKey: ['diagnostic-links'], queryFn: getMockDiagnosticLinks });
}

export function useCreateDiagnosticLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<DiagnosticLink, 'id' | 'createdAt'>) => {
      const links = getMockDiagnosticLinks();
      const newItem: DiagnosticLink = { ...data, id: `dl-${Date.now()}`, createdAt: new Date().toISOString() };
      setMockDiagnosticLinks([...links, newItem]);
      return Promise.resolve(newItem);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['diagnostic-links'] }); qc.invalidateQueries({ queryKey: ['connection-graph'] }); toast.success('Conexão criada com sucesso'); },
    onError: () => toast.error('Erro ao criar conexão'),
  });
}

export function useDeleteDiagnosticLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      setMockDiagnosticLinks(getMockDiagnosticLinks().filter(l => l.id !== id));
      return Promise.resolve();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['diagnostic-links'] }); qc.invalidateQueries({ queryKey: ['connection-graph'] }); toast.success('Conexão removida'); },
    onError: () => toast.error('Erro ao remover conexão'),
  });
}

export function useConnectionGraph(filters: GraphFilters) {
  return useQuery({
    queryKey: ['connection-graph', filters],
    queryFn: () => {
      let nodes = getMockDiagnosticNodes();
      const links = getMockDiagnosticLinks();
      if (filters.assetType) nodes = nodes.filter(n => n.type === filters.assetType);

      const nodeIds = new Set(nodes.map(n => n.id));
      const filteredLinks = links.filter(l => nodeIds.has(l.sourceId) || nodeIds.has(l.targetId));

      // Add nodes referenced by edges but not in filtered set
      filteredLinks.forEach(l => {
        if (!nodeIds.has(l.sourceId)) {
          const allNodes = getMockDiagnosticNodes();
          const missing = allNodes.find(n => n.id === l.sourceId);
          if (missing) { nodes.push(missing); nodeIds.add(missing.id); }
        }
        if (!nodeIds.has(l.targetId)) {
          const allNodes = getMockDiagnosticNodes();
          const missing = allNodes.find(n => n.id === l.targetId);
          if (missing) { nodes.push(missing); nodeIds.add(missing.id); }
        }
      });

      return { nodes, links: filteredLinks };
    },
  });
}
