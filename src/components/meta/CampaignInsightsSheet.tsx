import { useState, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useMetaInsights } from '@/hooks/useMeta';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer } from 'recharts';
import type { MetaCampaign } from '@/types/meta';
import type { DateRange } from 'react-day-picker';

interface Props {
  campaign: MetaCampaign | null;
  open: boolean;
  onClose: () => void;
}

export function CampaignInsightsSheet({ campaign, open, onClose }: Props) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date('2026-03-13'), 7),
    to: new Date('2026-03-13'),
  });

  const from = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined;
  const to = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined;

  const { data: insights, isLoading } = useMetaInsights(campaign?.id || null, from, to);

  const totals = useMemo(() => {
    if (!insights?.length) return null;
    const t = insights.reduce(
      (acc, i) => ({
        spend: acc.spend + i.spend,
        impressions: acc.impressions + i.impressions,
        clicks: acc.clicks + i.clicks,
        purchases: acc.purchases + (i.purchases || 0),
        revenue: acc.revenue + (i.revenue || 0),
      }),
      { spend: 0, impressions: 0, clicks: 0, purchases: 0, revenue: 0 }
    );
    return {
      ...t,
      ctr: t.impressions > 0 ? (t.clicks / t.impressions) * 100 : 0,
      cpc: t.clicks > 0 ? t.spend / t.clicks : 0,
      cpm: t.impressions > 0 ? (t.spend / t.impressions) * 1000 : 0,
      roas: t.spend > 0 ? t.revenue / t.spend : 0,
    };
  }, [insights]);

  const chartConfig = {
    spend: { label: 'Gasto', color: 'hsl(var(--info))' },
    impressions: { label: 'Impressões', color: 'hsl(var(--info))' },
    clicks: { label: 'Cliques', color: 'hsl(var(--success))' },
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {campaign?.name}
            {campaign && <StatusBadge status={campaign.status} />}
          </SheetTitle>
          <SheetDescription>{campaign?.accountName}</SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-6">
          {/* Date range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateRange?.from
                  ? `${format(dateRange.from, 'dd/MM', { locale: ptBR })} – ${dateRange.to ? format(dateRange.to, 'dd/MM', { locale: ptBR }) : '...'}`
                  : 'Selecionar período'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {isLoading && <LoadingSpinner className="py-8" />}

          {totals && (
            <>
              {/* Metrics cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Gasto Total', value: `R$ ${totals.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` },
                  { label: 'Impressões', value: totals.impressions.toLocaleString('pt-BR') },
                  { label: 'Cliques', value: totals.clicks.toLocaleString('pt-BR') },
                  { label: 'CTR', value: `${totals.ctr.toFixed(2)}%` },
                  { label: 'CPC', value: `R$ ${totals.cpc.toFixed(2)}` },
                  { label: 'CPM', value: `R$ ${totals.cpm.toFixed(2)}` },
                  { label: 'ROAS', value: totals.roas.toFixed(2) },
                  { label: 'Compras', value: totals.purchases.toLocaleString('pt-BR') },
                  { label: 'Receita', value: `R$ ${totals.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` },
                ].map((m) => (
                  <Card key={m.label}>
                    <CardContent className="py-3 px-4">
                      <p className="text-xs text-muted-foreground">{m.label}</p>
                      <p className="text-lg font-bold text-foreground">{m.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Spend line chart */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Gasto Diário</h3>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                  <LineChart data={insights}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tickFormatter={(d) => format(new Date(d + 'T00:00:00'), 'dd/MM')} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="spend" stroke="hsl(var(--info))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </div>

              {/* Impressions vs Clicks bar chart */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Impressões vs Cliques</h3>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                  <BarChart data={insights}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tickFormatter={(d) => format(new Date(d + 'T00:00:00'), 'dd/MM')} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="impressions" fill="hsl(var(--info))" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="clicks" fill="hsl(var(--success))" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
