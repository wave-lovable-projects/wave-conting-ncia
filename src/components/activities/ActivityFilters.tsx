import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ENTITY_TYPE_LABELS } from '@/types/activity';
import type { ActivityFilters } from '@/types/activity';
import { getMockUsers } from '@/data/mock-users';
import { Search, CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ActivityFiltersBarProps {
  filters: ActivityFilters;
  onChange: (filters: ActivityFilters) => void;
}

export function ActivityFiltersBar({ filters, onChange }: ActivityFiltersBarProps) {
  const users = getMockUsers();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleStartDate = (d: Date | undefined) => {
    setStartDate(d);
    onChange({ ...filters, startDate: d ? format(d, 'yyyy-MM-dd') : undefined });
  };

  const handleEndDate = (d: Date | undefined) => {
    setEndDate(d);
    onChange({ ...filters, endDate: d ? format(d, 'yyyy-MM-dd') : undefined });
  };

  const clearAll = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onChange({});
  };

  const hasFilters = filters.search || filters.entityTypes?.length || filters.userId || filters.startDate || filters.endDate;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar..."
          value={filters.search || ''}
          onChange={e => onChange({ ...filters, search: e.target.value || undefined })}
          className="pl-9 h-9 w-[200px]"
        />
      </div>

      <Select value={filters.entityTypes?.[0] || 'ALL'} onValueChange={v => onChange({ ...filters, entityTypes: v === 'ALL' ? undefined : [v] })}>
        <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Tipo de entidade" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todas as entidades</SelectItem>
          {Object.entries(ENTITY_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.userId || 'ALL'} onValueChange={v => onChange({ ...filters, userId: v === 'ALL' ? undefined : v })}>
        <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Usuário" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos os usuários</SelectItem>
          {users.map(u => (
            <SelectItem key={u.id} value={u.id}>
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-[8px] bg-surface-3">{u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
                </Avatar>
                {u.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1 text-muted-foreground">
          <X className="h-3.5 w-3.5" /> Limpar
        </Button>
      )}
    </div>
  );
}
