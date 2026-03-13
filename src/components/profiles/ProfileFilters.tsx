import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { UnifiedFilter } from '@/components/shared/UnifiedFilter';
import type { FilterCategory } from '@/components/shared/UnifiedFilter';
import type { ProfileFilters } from '@/types/profile';

const mockSuppliers = [
  { id: 's1', name: 'Fornecedor Alpha' },
  { id: 's2', name: 'Fornecedor Beta' },
  { id: 's3', name: 'Fornecedor Gamma' },
];
const mockManagers = [
  { id: 'u1', name: 'João Silva' },
  { id: 'u2', name: 'Maria Souza' },
  { id: 'u3', name: 'Carlos Lima' },
];

interface ProfileFiltersBarProps {
  filters: ProfileFilters;
  searchValue: string;
  onSearchChange: (v: string) => void;
  onFilterChange: (f: Partial<ProfileFilters>) => void;
  onClear: () => void;
}

const FILTER_KEYS = ['status', 'supplierId', 'managerId'] as const;

const categories: FilterCategory[] = [
  { key: 'status', label: 'Status', options: [
    { value: 'ACTIVE', label: 'Ativo' },
    { value: 'DISABLED', label: 'Desativado' },
    { value: 'BLOCKED', label: 'Bloqueado' },
  ]},
  { key: 'supplierId', label: 'Fornecedor', options: mockSuppliers.map((s) => ({ value: s.id, label: s.name })) },
  { key: 'managerId', label: 'Gestor', options: mockManagers.map((m) => ({ value: m.id, label: m.name })) },
];

export function ProfileFiltersBar({ filters, searchValue, onSearchChange, onFilterChange, onClear }: ProfileFiltersBarProps) {
  const values = useMemo(() => {
    const v: Record<string, string[]> = {};
    for (const key of FILTER_KEYS) {
      const val = filters[key];
      if (val) v[key] = val.split(',');
    }
    return v;
  }, [filters]);

  const handleChange = (vals: Record<string, string[]>) => {
    const partial: Partial<ProfileFilters> = {};
    for (const key of FILTER_KEYS) {
      partial[key] = vals[key]?.length ? vals[key].join(',') : undefined;
    }
    onFilterChange(partial);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou email…" value={searchValue} onChange={(e) => onSearchChange(e.target.value)} className="pl-9" />
      </div>
      <UnifiedFilter categories={categories} values={values} onChange={handleChange} />
    </div>
  );
}
