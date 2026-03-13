import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { UnifiedFilter } from '@/components/shared/UnifiedFilter';
import type { FilterCategory } from '@/components/shared/UnifiedFilter';
import type { PageFilters } from '@/types/page';
import { getMockBMs } from '@/data/mock-business-managers';

const mockSuppliers = [
  { id: 's1', name: 'Fornecedor Alpha' },
  { id: 's2', name: 'Fornecedor Beta' },
  { id: 's3', name: 'Fornecedor Gamma' },
];

interface PageFiltersBarProps {
  filters: PageFilters;
  searchValue: string;
  onSearchChange: (v: string) => void;
  onFilterChange: (f: Partial<PageFilters>) => void;
  onClear: () => void;
}

const FILTER_KEYS = ['status', 'supplierId', 'bmId'] as const;

export function PageFiltersBar({ filters, searchValue, onSearchChange, onFilterChange, onClear }: PageFiltersBarProps) {
  const bms = getMockBMs();

  const categories: FilterCategory[] = useMemo(() => [
    { key: 'status', label: 'Status', options: [
      { value: 'ACTIVE', label: 'Ativa' },
      { value: 'DISABLED', label: 'Desativada' },
      { value: 'BLOCKED', label: 'Bloqueada' },
    ]},
    { key: 'supplierId', label: 'Fornecedor', options: mockSuppliers.map((s) => ({ value: s.id, label: s.name })) },
    { key: 'bmId', label: 'BM Vinculada', options: bms.map((b) => ({ value: b.id, label: b.name })) },
  ], [bms]);

  const values = useMemo(() => {
    const v: Record<string, string[]> = {};
    for (const key of FILTER_KEYS) {
      const val = filters[key];
      if (val) v[key] = val.split(',');
    }
    return v;
  }, [filters]);

  const handleChange = (vals: Record<string, string[]>) => {
    const partial: Partial<PageFilters> = {};
    for (const key of FILTER_KEYS) {
      partial[key] = vals[key]?.length ? vals[key].join(',') : undefined;
    }
    onFilterChange(partial);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou Page ID…" value={searchValue} onChange={(e) => onSearchChange(e.target.value)} className="pl-9" />
      </div>
      <UnifiedFilter categories={categories} values={values} onChange={handleChange} />
    </div>
  );
}
