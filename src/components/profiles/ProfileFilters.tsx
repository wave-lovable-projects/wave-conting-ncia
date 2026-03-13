import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
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

export function ProfileFiltersBar({ filters, searchValue, onSearchChange, onFilterChange, onClear }: ProfileFiltersBarProps) {
  const hasFilters = filters.status || filters.supplierId || filters.managerId || searchValue;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou email…" value={searchValue} onChange={e => onSearchChange(e.target.value)} className="pl-9" />
      </div>
      <Select value={filters.status || 'ALL'} onValueChange={v => onFilterChange({ status: v === 'ALL' ? undefined : v })}>
        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="ACTIVE">Ativo</SelectItem>
          <SelectItem value="DISABLED">Desativado</SelectItem>
          <SelectItem value="BLOCKED">Bloqueado</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.supplierId || 'ALL'} onValueChange={v => onFilterChange({ supplierId: v === 'ALL' ? undefined : v })}>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Fornecedor" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          {mockSuppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.managerId || 'ALL'} onValueChange={v => onFilterChange({ managerId: v === 'ALL' ? undefined : v })}>
        <SelectTrigger className="w-[170px]"><SelectValue placeholder="Gestor" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          {mockManagers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}><X className="h-4 w-4 mr-1" /> Limpar</Button>
      )}
    </div>
  );
}
