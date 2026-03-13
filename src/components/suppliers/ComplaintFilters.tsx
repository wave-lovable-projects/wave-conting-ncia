import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UnifiedFilter } from '@/components/shared/UnifiedFilter';
import type { FilterCategory } from '@/components/shared/UnifiedFilter';
import type { ComplaintFilters } from '@/types/supplier';
import { useSuppliers } from '@/hooks/useSuppliers';

interface Props {
  filters: ComplaintFilters;
  onFilterChange: (f: Partial<ComplaintFilters>) => void;
  onAdd: () => void;
}

const FILTER_KEYS = ['supplierId', 'status', 'priority'] as const;

export function ComplaintFiltersBar({ filters, onFilterChange, onAdd }: Props) {
  const { data: suppliers } = useSuppliers();

  const categories: FilterCategory[] = useMemo(() => [
    { key: 'supplierId', label: 'Fornecedor', options: (suppliers || []).map((s) => ({ value: s.id, label: s.name })) },
    { key: 'status', label: 'Status', options: [
      { value: 'OPEN', label: 'Aberta' },
      { value: 'IN_PROGRESS', label: 'Em Andamento' },
      { value: 'RESOLVED', label: 'Resolvida' },
    ]},
    { key: 'priority', label: 'Prioridade', options: [
      { value: 'LOW', label: 'Baixa' },
      { value: 'MEDIUM', label: 'Média' },
      { value: 'HIGH', label: 'Alta' },
      { value: 'URGENT', label: 'Urgente' },
    ]},
  ], [suppliers]);

  const values = useMemo(() => {
    const v: Record<string, string[]> = {};
    for (const key of FILTER_KEYS) {
      const val = filters[key];
      if (val) v[key] = val.split(',');
    }
    return v;
  }, [filters]);

  const handleChange = (vals: Record<string, string[]>) => {
    const partial: Partial<ComplaintFilters> = {};
    for (const key of FILTER_KEYS) {
      partial[key] = vals[key]?.length ? vals[key].join(',') : undefined;
    }
    onFilterChange(partial);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <UnifiedFilter categories={categories} values={values} onChange={handleChange} />
      <div className="ml-auto">
        <Button onClick={onAdd} className="gap-2"><Plus className="h-4 w-4" /> Nova Reclamação</Button>
      </div>
    </div>
  );
}
