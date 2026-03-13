import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { ComplaintFilters } from '@/types/supplier';
import { useSuppliers } from '@/hooks/useSuppliers';

interface Props {
  filters: ComplaintFilters;
  onFilterChange: (f: Partial<ComplaintFilters>) => void;
  onAdd: () => void;
}

export function ComplaintFiltersBar({ filters, onFilterChange, onAdd }: Props) {
  const { data: suppliers } = useSuppliers();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={filters.supplierId ?? 'ALL'} onValueChange={(v) => onFilterChange({ supplierId: v === 'ALL' ? undefined : v })}>
        <SelectTrigger className="w-48"><SelectValue placeholder="Fornecedor" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos Fornecedores</SelectItem>
          {suppliers?.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.status ?? 'ALL'} onValueChange={(v) => onFilterChange({ status: v === 'ALL' ? undefined : v })}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="OPEN">Aberta</SelectItem>
          <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
          <SelectItem value="RESOLVED">Resolvida</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.priority ?? 'ALL'} onValueChange={(v) => onFilterChange({ priority: v === 'ALL' ? undefined : v })}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Prioridade" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todas</SelectItem>
          <SelectItem value="LOW">Baixa</SelectItem>
          <SelectItem value="MEDIUM">Média</SelectItem>
          <SelectItem value="HIGH">Alta</SelectItem>
          <SelectItem value="URGENT">Urgente</SelectItem>
        </SelectContent>
      </Select>
      <div className="ml-auto">
        <Button onClick={onAdd} className="gap-2"><Plus className="h-4 w-4" /> Nova Reclamação</Button>
      </div>
    </div>
  );
}
