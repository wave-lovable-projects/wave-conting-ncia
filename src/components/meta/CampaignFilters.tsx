import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { UnifiedFilter } from '@/components/shared/UnifiedFilter';
import type { FilterCategory } from '@/components/shared/UnifiedFilter';
import { useMetaAccounts } from '@/hooks/useMeta';
import type { MetaCampaignFilters } from '@/types/meta';

interface Props {
  filters: MetaCampaignFilters;
  onChange: (f: MetaCampaignFilters) => void;
}

const CAMPAIGN_STATUSES = [
  { value: 'ACTIVE', label: 'Ativa' },
  { value: 'PAUSED', label: 'Pausada' },
  { value: 'ARCHIVED', label: 'Arquivada' },
  { value: 'DELETED', label: 'Excluída' },
];

export function CampaignFiltersBar({ filters, onChange }: Props) {
  const { data: accounts } = useMetaAccounts();

  const categories: FilterCategory[] = useMemo(() => [
    { key: 'accountId', label: 'Conta', options: (accounts || []).map((acc) => ({ value: acc.id, label: acc.name })) },
    { key: 'status', label: 'Status', options: CAMPAIGN_STATUSES },
  ], [accounts]);

  const values = useMemo(() => {
    const v: Record<string, string[]> = {};
    if (filters.accountId) v.accountId = filters.accountId.split(',');
    if (filters.status) v.status = [filters.status];
    return v;
  }, [filters]);

  const handleChange = (vals: Record<string, string[]>) => {
    onChange({
      ...filters,
      accountId: vals.accountId?.length ? vals.accountId.join(',') : '',
      status: vals.status?.[0] as any || '',
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar campanha..."
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-9"
        />
      </div>
      <UnifiedFilter categories={categories} values={values} onChange={handleChange} />
    </div>
  );
}
