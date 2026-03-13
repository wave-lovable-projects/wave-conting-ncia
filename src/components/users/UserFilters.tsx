import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { UnifiedFilter } from '@/components/shared/UnifiedFilter';
import type { FilterCategory } from '@/components/shared/UnifiedFilter';
import type { UserFilters } from '@/types/user';
import { mockSquads } from '@/data/mock-users';

interface Props {
  filters: UserFilters;
  onFilterChange: (f: Partial<UserFilters>) => void;
}

const FILTER_KEYS = ['role', 'squadId', 'isActive'] as const;

const categories: FilterCategory[] = [
  { key: 'role', label: 'Role', options: [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'GESTOR', label: 'Gestor' },
    { value: 'AUXILIAR', label: 'Auxiliar' },
  ]},
  { key: 'squadId', label: 'Squad', options: mockSquads.map((s) => ({ value: s.id, label: s.name })) },
  { key: 'isActive', label: 'Status', options: [
    { value: 'true', label: 'Ativo' },
    { value: 'false', label: 'Inativo' },
  ]},
];

export function UserFiltersBar({ filters, onFilterChange }: Props) {
  const values = useMemo(() => {
    const v: Record<string, string[]> = {};
    for (const key of FILTER_KEYS) {
      const val = filters[key];
      if (val) v[key] = val.split(',');
    }
    return v;
  }, [filters]);

  const handleChange = (vals: Record<string, string[]>) => {
    const partial: Partial<UserFilters> = {};
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
          placeholder="Buscar por nome ou email..."
          value={filters.search ?? ''}
          onChange={(e) => onFilterChange({ search: e.target.value || undefined })}
          className="pl-9 w-64"
        />
      </div>
      <UnifiedFilter categories={categories} values={values} onChange={handleChange} />
    </div>
  );
}
