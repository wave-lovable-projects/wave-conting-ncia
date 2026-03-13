import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { UnifiedFilter } from '@/components/shared/UnifiedFilter';
import type { FilterCategory } from '@/components/shared/UnifiedFilter';
import type { AdAccountFilters as Filters } from '@/types/ad-account';
import { mockManagers, mockSuppliers, mockNiches, mockSquads } from '@/data/mock-ad-accounts';

interface Props {
  filters: Filters;
  searchValue: string;
  onSearchChange: (v: string) => void;
  onFilterChange: (f: Partial<Filters>) => void;
  onClear: () => void;
}

const FILTER_KEYS = ['accountStatus', 'managerId', 'supplierId', 'niche', 'squadId', 'paymentType'] as const;

const categories: FilterCategory[] = [
  { key: 'accountStatus', label: 'Status', options: [
    { value: 'ACTIVE', label: 'Ativa' },
    { value: 'DISABLED', label: 'Desativada' },
    { value: 'ROLLBACK', label: 'Rollback' },
  ]},
  { key: 'managerId', label: 'Gestor', options: mockManagers.map((m) => ({ value: m.id, label: m.name })) },
  { key: 'supplierId', label: 'Fornecedor', options: mockSuppliers.map((s) => ({ value: s.id, label: s.name })) },
  { key: 'niche', label: 'Nicho', options: mockNiches.map((n) => ({ value: n, label: n })) },
  { key: 'squadId', label: 'Squad', options: mockSquads.map((s) => ({ value: s.id, label: s.name })) },
  { key: 'paymentType', label: 'Pagamento', options: [
    { value: 'CREDIT', label: 'Crédito' },
    { value: 'DEBIT', label: 'Débito' },
    { value: 'BOLETO', label: 'Boleto' },
    { value: 'PIX', label: 'Pix' },
  ]},
];

export function AdAccountFilters({ searchValue, onSearchChange, filters, onFilterChange, onClear }: Props) {
  const values = useMemo(() => {
    const v: Record<string, string[]> = {};
    for (const key of FILTER_KEYS) {
      const val = filters[key];
      if (val) v[key] = val.split(',');
    }
    return v;
  }, [filters]);

  const handleChange = (vals: Record<string, string[]>) => {
    const partial: Partial<Filters> = {};
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
          placeholder="Buscar por nome ou ID..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 w-64"
        />
      </div>
      <UnifiedFilter categories={categories} values={values} onChange={handleChange} />
    </div>
  );
}
