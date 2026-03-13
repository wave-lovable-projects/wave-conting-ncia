import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import type { PixelFilters } from '@/types/pixel';
import { getMockBMs } from '@/data/mock-business-managers';

const mockSuppliers = [
  { id: 's1', name: 'Fornecedor Alpha' },
  { id: 's2', name: 'Fornecedor Beta' },
  { id: 's3', name: 'Fornecedor Gamma' },
];

interface PixelFiltersBarProps {
  filters: PixelFilters;
  searchValue: string;
  onSearchChange: (v: string) => void;
  onFilterChange: (f: Partial<PixelFilters>) => void;
  onClear: () => void;
}

export function PixelFiltersBar({ filters, searchValue, onSearchChange, onFilterChange, onClear }: PixelFiltersBarProps) {
  const bms = getMockBMs();
  const hasFilters = filters.status || filters.supplierId || filters.bmId || searchValue;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou Pixel ID…" value={searchValue} onChange={e => onSearchChange(e.target.value)} className="pl-9" />
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
      <Select value={filters.bmId || 'ALL'} onValueChange={v => onFilterChange({ bmId: v === 'ALL' ? undefined : v })}>
        <SelectTrigger className="w-[200px]"><SelectValue placeholder="BM Vinculada" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todas</SelectItem>
          {bms.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
        </SelectContent>
      </Select>
      {hasFilters && <Button variant="ghost" size="sm" onClick={onClear}><X className="h-4 w-4 mr-1" /> Limpar</Button>}
    </div>
  );
}
