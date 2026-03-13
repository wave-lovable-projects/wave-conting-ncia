import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useMetaAccounts } from '@/hooks/useMeta';
import type { MetaCampaignFilters } from '@/types/meta';

const CAMPAIGN_STATUSES = [
  { value: 'ACTIVE', label: 'Ativa' },
  { value: 'PAUSED', label: 'Pausada' },
  { value: 'ARCHIVED', label: 'Arquivada' },
  { value: 'DELETED', label: 'Excluída' },
] as const;

interface Props {
  filters: MetaCampaignFilters;
  onChange: (f: MetaCampaignFilters) => void;
}

export function CampaignFiltersBar({ filters, onChange }: Props) {
  const { data: accounts } = useMetaAccounts();

  const hasFilters = filters.accountId || filters.status || filters.search;

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

      <Select
        value={filters.accountId || 'all'}
        onValueChange={(v) => onChange({ ...filters, accountId: v === 'all' ? '' : v })}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Todas as contas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as contas</SelectItem>
          {accounts?.map((acc) => (
            <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status || 'all'}
        onValueChange={(v) => onChange({ ...filters, status: v === 'all' ? '' : v as any })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {CAMPAIGN_STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => onChange({})}>
          <X className="h-4 w-4 mr-1" /> Limpar
        </Button>
      )}
    </div>
  );
}
