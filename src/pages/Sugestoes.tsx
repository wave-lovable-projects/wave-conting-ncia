import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UnifiedFilter } from '@/components/shared/UnifiedFilter';
import type { FilterCategory } from '@/components/shared/UnifiedFilter';
import { useSuggestions } from '@/hooks/useSuggestions';
import { SuggestionCard } from '@/components/suggestions/SuggestionCard';
import { SuggestionDetailSheet } from '@/components/suggestions/SuggestionDetailSheet';
import { SUGGESTION_STATUS_LABELS } from '@/types/suggestion';
import type { Suggestion, SuggestionFilters } from '@/types/suggestion';

const statusCategories: FilterCategory[] = [
  {
    key: 'status',
    label: 'Status',
    options: Object.entries(SUGGESTION_STATUS_LABELS).map(([k, v]) => ({ value: k, label: v })),
  },
];

export default function Sugestoes() {
  const [filters, setFilters] = useState<SuggestionFilters>({ sortBy: 'recent' });
  const [selected, setSelected] = useState<Suggestion | null>(null);
  const { data: suggestions } = useSuggestions(filters);

  const filterValues = useMemo(() => {
    const v: Record<string, string[]> = {};
    if (filters.status) v.status = filters.status.split(',');
    return v;
  }, [filters]);

  const handleFilterChange = (vals: Record<string, string[]>) => {
    setFilters((f) => ({ ...f, status: vals.status?.length ? vals.status.join(',') : undefined }));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Sugestões" description="Ideias e melhorias propostas pela equipe" />

      <div className="flex items-center gap-3 flex-wrap">
        <UnifiedFilter categories={statusCategories} values={filterValues} onChange={handleFilterChange} />

        <Select value={filters.sortBy || 'recent'} onValueChange={(v) => setFilters((f) => ({ ...f, sortBy: v as SuggestionFilters['sortBy'] }))}>
          <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Ordenar por" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais recentes</SelectItem>
            <SelectItem value="votes">Mais votadas</SelectItem>
            <SelectItem value="comments">Mais comentadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(suggestions || []).map((s) => (
          <SuggestionCard key={s.id} suggestion={s} onClick={() => setSelected(s)} />
        ))}
      </div>

      {(suggestions || []).length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">Nenhuma sugestão encontrada.</p>
      )}

      <SuggestionDetailSheet suggestion={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
