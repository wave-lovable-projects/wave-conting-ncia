import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { UnifiedFilter } from '@/components/shared/UnifiedFilter';
import type { FilterCategory } from '@/components/shared/UnifiedFilter';
import { ENTITY_TYPE_LABELS } from '@/types/activity';
import type { ActivityFilters } from '@/types/activity';
import { getMockUsers } from '@/data/mock-users';
import { Search } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityFiltersBarProps {
  filters: ActivityFilters;
  onChange: (filters: ActivityFilters) => void;
}

export function ActivityFiltersBar({ filters, onChange }: ActivityFiltersBarProps) {
  const users = getMockUsers();

  const categories: FilterCategory[] = useMemo(() => [
    { key: 'entityTypes', label: 'Tipo de Entidade', options: Object.entries(ENTITY_TYPE_LABELS).map(([k, v]) => ({ value: k, label: v })) },
    { key: 'userId', label: 'Usuário', options: users.map((u) => ({ value: u.id, label: u.name })) },
  ], [users]);

  const values = useMemo(() => {
    const v: Record<string, string[]> = {};
    if (filters.entityTypes?.length) v.entityTypes = filters.entityTypes;
    if (filters.userId) v.userId = filters.userId.split(',');
    return v;
  }, [filters]);

  const handleFilterChange = (vals: Record<string, string[]>) => {
    onChange({
      ...filters,
      entityTypes: vals.entityTypes?.length ? vals.entityTypes : undefined,
      userId: vals.userId?.length ? vals.userId.join(',') : undefined,
    });
  };

  const dateRange = useMemo(() => ({
    from: filters.startDate ? new Date(filters.startDate) : undefined,
    to: filters.endDate ? new Date(filters.endDate) : undefined,
  }), [filters.startDate, filters.endDate]);

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    onChange({
      ...filters,
      startDate: range.from ? format(range.from, 'yyyy-MM-dd') : undefined,
      endDate: range.to ? format(range.to, 'yyyy-MM-dd') : undefined,
    });
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar..."
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
          className="pl-9 h-9 w-[200px]"
        />
      </div>

      <UnifiedFilter
        categories={categories}
        values={values}
        onChange={handleFilterChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />
    </div>
  );
}
