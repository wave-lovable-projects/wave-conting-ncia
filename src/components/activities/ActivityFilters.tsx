import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { UnifiedFilter } from '@/components/shared/UnifiedFilter';
import type { FilterCategory } from '@/components/shared/UnifiedFilter';
import { ENTITY_TYPE_LABELS } from '@/types/activity';
import type { ActivityFilters } from '@/types/activity';
import { getMockUsers } from '@/data/mock-users';
import { Search, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ActivityFiltersBarProps {
  filters: ActivityFilters;
  onChange: (filters: ActivityFilters) => void;
}

export function ActivityFiltersBar({ filters, onChange }: ActivityFiltersBarProps) {
  const users = getMockUsers();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

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

  const handleStartDate = (d: Date | undefined) => {
    setStartDate(d);
    onChange({ ...filters, startDate: d ? format(d, 'yyyy-MM-dd') : undefined });
  };

  const handleEndDate = (d: Date | undefined) => {
    setEndDate(d);
    onChange({ ...filters, endDate: d ? format(d, 'yyyy-MM-dd') : undefined });
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

      <UnifiedFilter categories={categories} values={values} onChange={handleFilterChange} />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={cn('gap-1', !startDate && 'text-muted-foreground')}>
            <CalendarIcon className="h-3.5 w-3.5" />
            {startDate ? format(startDate, 'dd/MM/yyyy') : 'Início'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={startDate} onSelect={handleStartDate} className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={cn('gap-1', !endDate && 'text-muted-foreground')}>
            <CalendarIcon className="h-3.5 w-3.5" />
            {endDate ? format(endDate, 'dd/MM/yyyy') : 'Fim'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={endDate} onSelect={handleEndDate} className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>
    </div>
  );
}
