import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { UnifiedFilter } from '@/components/shared/UnifiedFilter';
import type { FilterCategory } from '@/components/shared/UnifiedFilter';
import type { RequestFilters } from '@/types/request';
import { REQUEST_STATUS_LABELS, REQUEST_TYPE_LABELS, REQUEST_STATUSES, REQUEST_TYPES } from '@/types/request';
import { getMockSuppliers } from '@/data/mock-suppliers';
import { getMockUsers } from '@/data/mock-users';

interface Props {
  filters: RequestFilters;
  onFilterChange: (f: Partial<RequestFilters>) => void;
}

const FILTER_KEYS = ['assetType', 'status', 'priority', 'supplierId', 'assigneeId'] as const;

export function RequestFiltersBar({ filters, onFilterChange }: Props) {
  const categories: FilterCategory[] = useMemo(() => {
    const suppliers = getMockSuppliers();
    const users = getMockUsers().filter((u) => u.role === 'ADMIN' || u.role === 'GESTOR');
    return [
      { key: 'assetType', label: 'Tipo', options: REQUEST_TYPES.map((t) => ({ value: t, label: REQUEST_TYPE_LABELS[t] })) },
      { key: 'status', label: 'Status', options: REQUEST_STATUSES.map((s) => ({ value: s, label: REQUEST_STATUS_LABELS[s] })) },
      { key: 'priority', label: 'Prioridade', options: [
        { value: 'LOW', label: 'Baixa' },
        { value: 'MEDIUM', label: 'Média' },
        { value: 'HIGH', label: 'Alta' },
        { value: 'URGENT', label: 'Urgente' },
      ]},
      { key: 'supplierId', label: 'Fornecedor', options: suppliers.map((s) => ({ value: s.id, label: s.name })) },
      { key: 'assigneeId', label: 'Responsável', options: users.map((u) => ({ value: u.id, label: u.name })) },
    ];
  }, []);

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

  const dateRange = useMemo(() => ({
    from: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
    to: filters.dateTo ? new Date(filters.dateTo) : undefined,
  }), [filters.dateFrom, filters.dateTo]);

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    onFilterChange({
      dateFrom: range.from ? range.from.toISOString() : undefined,
      dateTo: range.to ? range.to.toISOString() : undefined,
    });
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

      <UnifiedFilter
        categories={categories}
        values={values}
        onChange={handleChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />
    </div>
  );
}
