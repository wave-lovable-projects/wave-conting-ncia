import { Card } from '@/components/ui/card';
import { useAdAccountStats } from '@/hooks/useAdAccounts';
import type { AdAccountFilters } from '@/types/ad-account';
import { CreditCard, CheckCircle, XCircle, RotateCcw, Play, Flame, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  filters: AdAccountFilters;
  onFilterChange: (f: Partial<AdAccountFilters>) => void;
}

export function StatsCards({ filters, onFilterChange }: StatsCardsProps) {
  const { data } = useAdAccountStats();
  if (!data) return null;

  const cards = [
    { label: 'Total', value: data.total, icon: CreditCard, filterKey: null, filterValue: null },
    { label: 'Aquecendo', value: data.warming, icon: Flame, filterKey: 'accountStatus', filterValue: 'WARMING' },
    { label: 'Ativas', value: data.active, icon: CheckCircle, filterKey: 'accountStatus', filterValue: 'ACTIVE' },
    { label: 'Anunciando', value: data.advertising, icon: Megaphone, filterKey: 'accountStatus', filterValue: 'ADVERTISING' },
    { label: 'Desabilitadas', value: data.disabled, icon: XCircle, filterKey: 'accountStatus', filterValue: 'DISABLED' },
    { label: 'Rollback', value: data.rollback, icon: RotateCcw, filterKey: 'accountStatus', filterValue: 'ROLLBACK' },
    { label: 'Em Uso', value: data.inUse, icon: Play, filterKey: 'usageStatus', filterValue: 'IN_USE' },
  ] as const;

  const isActive = (key: string | null, val: string | null) => {
    if (!key) return false;
    return (filters as Record<string, string | undefined>)[key] === val;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        const active = isActive(c.filterKey, c.filterValue);
        return (
          <Card
            key={c.label}
            className={cn(
              'p-4 cursor-pointer transition-all hover:bg-card-hover border',
              active ? 'border-primary bg-card-hover' : 'border-border'
            )}
            onClick={() => {
              if (!c.filterKey) {
                onFilterChange({ accountStatus: undefined, usageStatus: undefined });
              } else if (active) {
                onFilterChange({ [c.filterKey]: undefined });
              } else {
                onFilterChange({ accountStatus: undefined, usageStatus: undefined, [c.filterKey]: c.filterValue });
              }
            }}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-surface-2 p-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{c.value}</p>
                <p className="text-xs text-muted-foreground">{c.label}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
