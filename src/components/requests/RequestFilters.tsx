import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { UnifiedFilter } from '@/components/shared/UnifiedFilter';
import type { FilterCategory } from '@/components/shared/UnifiedFilter';
import type { RequestFilters } from '@/types/request';

interface Props {
  filters: RequestFilters;
  onFilterChange: (f: Partial<RequestFilters>) => void;
}

const FILTER_KEYS = ['type', 'status', 'priority'] as const;

const categories: FilterCategory[] = [
  { key: 'type', label: 'Tipo', options: [
    { value: 'BM', label: 'BM' },
    { value: 'ACCOUNT', label: 'Conta' },
    { value: 'PROFILE', label: 'Perfil' },
    { value: 'BALANCE', label: 'Saldo' },
    { value: 'OTHER', label: 'Outro' },
  ]},
  { key: 'status', label: 'Status', options: [
    { value: 'PENDING', label: 'Pendente' },
    { value: 'IN_PROGRESS', label: 'Em Andamento' },
    { value: 'DONE', label: 'Concluída' },
    { value: 'REJECTED', label: 'Rejeitada' },
  ]},
  { key: 'priority', label: 'Prioridade', options: [
    { value: 'LOW', label: 'Baixa' },
    { value: 'MEDIUM', label: 'Média' },
    { value: 'HIGH', label: 'Alta' },
    { value: 'URGENT', label: 'Urgente' },
  ]},
];

export function RequestFiltersBar({ filters, onFilterChange }: Props) {
  const values = useMemo(() => {
    const v: Record<string, string[]> = {};
    for (const key of FILTER_KEYS) {
      const val = filters[key];
      if (val) v[key] = val.split(',');
    }
    return v;
  }, [filters]);

  const handleChange = (vals: Record<string, string[]>) => {
    const partial: Partial<RequestFilters> = {};
    for (const key of FILTER_KEYS) {
      partial[key] = vals[key]?.length ? vals[key].join(',') : undefined;
    }
    onFilterChange(partial);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar solicitação..."
          value={filters.search ?? ''}
          onChange={(e) => onFilterChange({ search: e.target.value || undefined })}
          className="pl-9 w-64"
        />
      </div>
      <UnifiedFilter categories={categories} values={values} onChange={handleChange} />
    </div>
  );
}
