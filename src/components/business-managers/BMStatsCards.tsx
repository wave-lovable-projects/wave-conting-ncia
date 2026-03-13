import { Card } from '@/components/ui/card';
import { useBMStats } from '@/hooks/useBusinessManagers';
import type { BMFilters } from '@/types/business-manager';
import { Building2, CheckCircle, XCircle, ShieldX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BMStatsCardsProps {
  filters: BMFilters;
  onFilterChange: (f: Partial<BMFilters>) => void;
}

export function BMStatsCards({ filters, onFilterChange }: BMStatsCardsProps) {
  const { data } = useBMStats();
  if (!data) return null;

  const cards = [
    { label: 'Total', value: data.total, icon: Building2, filterValue: null },
    { label: 'Ativas', value: data.active, icon: CheckCircle, filterValue: 'ACTIVE' },
    { label: 'Desativadas', value: data.disabled, icon: XCircle, filterValue: 'DISABLED' },
    { label: 'Bloqueadas', value: data.blocked, icon: ShieldX, filterValue: 'BLOCKED' },
  ] as const;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        const active = c.filterValue && filters.status === c.filterValue;
        return (
          <Card
            key={c.label}
            className={cn('p-4 cursor-pointer transition-all hover:bg-card-hover border', active ? 'border-primary bg-card-hover' : 'border-border')}
            onClick={() => {
              if (!c.filterValue) onFilterChange({ status: undefined });
              else if (active) onFilterChange({ status: undefined });
              else onFilterChange({ status: c.filterValue });
            }}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-surface-2 p-2"><Icon className="h-4 w-4 text-muted-foreground" /></div>
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
