import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { AdAccountFilters as Filters } from '@/types/ad-account';
import { mockManagers, mockSuppliers, mockNiches, mockSquads } from '@/data/mock-ad-accounts';

interface Props {
  filters: Filters;
  searchValue: string;
  onSearchChange: (v: string) => void;
  onFilterChange: (f: Partial<Filters>) => void;
  onClear: () => void;
}

const paymentTypes = [
  { value: 'CREDIT', label: 'Crédito' },
  { value: 'DEBIT', label: 'Débito' },
  { value: 'BOLETO', label: 'Boleto' },
  { value: 'PIX', label: 'Pix' },
];

const statusOptions = [
  { value: 'ACTIVE', label: 'Ativa' },
  { value: 'DISABLED', label: 'Desativada' },
  { value: 'ROLLBACK', label: 'Rollback' },
];

export function AdAccountFilters({ searchValue, onSearchChange, filters, onFilterChange, onClear }: Props) {
  const hasFilters = Object.values(filters).some(Boolean) || searchValue;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Buscar por nome ou ID..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-64"
      />
      <Select value={filters.managerId || '__all__'} onValueChange={(v) => onFilterChange({ managerId: v === '__all__' ? undefined : v })}>
        <SelectTrigger className="w-44"><SelectValue placeholder="Gestor" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Todos gestores</SelectItem>
          {mockManagers.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.accountStatus || '__all__'} onValueChange={(v) => onFilterChange({ accountStatus: v === '__all__' ? undefined : v })}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Todos status</SelectItem>
          {statusOptions.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.niche || '__all__'} onValueChange={(v) => onFilterChange({ niche: v === '__all__' ? undefined : v })}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Nicho" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Todos nichos</SelectItem>
          {mockNiches.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.squadId || '__all__'} onValueChange={(v) => onFilterChange({ squadId: v === '__all__' ? undefined : v })}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Squad" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Todos squads</SelectItem>
          {mockSquads.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.supplierId || '__all__'} onValueChange={(v) => onFilterChange({ supplierId: v === '__all__' ? undefined : v })}>
        <SelectTrigger className="w-44"><SelectValue placeholder="Fornecedor" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Todos fornecedores</SelectItem>
          {mockSuppliers.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.paymentType || '__all__'} onValueChange={(v) => onFilterChange({ paymentType: v === '__all__' ? undefined : v })}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Pagamento" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Todos tipos</SelectItem>
          {paymentTypes.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
          <X className="h-4 w-4 mr-1" /> Limpar
        </Button>
      )}
    </div>
  );
}
