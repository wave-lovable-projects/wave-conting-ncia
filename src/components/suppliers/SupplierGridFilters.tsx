import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { UnifiedFilter } from '@/components/shared/UnifiedFilter';
import type { FilterCategory } from '@/components/shared/UnifiedFilter';
import type { SupplierFilters } from '@/types/supplier';

interface SupplierGridProps {
  filters: SupplierFilters;
  onFilterChange: (f: Partial<SupplierFilters>) => void;
  onAdd: () => void;
}

const categories: FilterCategory[] = [
  { key: 'status', label: 'Status', options: [
    { value: 'ACTIVE', label: 'Ativo' },
    { value: 'INACTIVE', label: 'Inativo' },
  ]},
];

export function SupplierGridFilters({ filters, onFilterChange, onAdd }: SupplierGridProps) {
  const values = useMemo(() => {
    const v: Record<string, string[]> = {};
    if (filters.status) v.status = filters.status.split(',');
    return v;
  }, [filters]);

  const handleChange = (vals: Record<string, string[]>) => {
    onFilterChange({ status: vals.status?.length ? vals.status.join(',') : undefined });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar fornecedor..."
          value={filters.search ?? ''}
          onChange={(e) => onFilterChange({ search: e.target.value || undefined })}
          className="pl-9 w-64"
        />
      </div>
      <UnifiedFilter categories={categories} values={values} onChange={handleChange} />
      <div className="ml-auto">
        <Button onClick={onAdd} className="gap-2"><Plus className="h-4 w-4" /> Novo Fornecedor</Button>
      </div>
    </div>
  );
}
