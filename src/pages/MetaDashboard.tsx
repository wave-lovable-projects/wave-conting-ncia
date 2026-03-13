import { PageHeader } from '@/components/shared/PageHeader';
import { MetaConnectionStatus } from '@/components/meta/MetaConnectionStatus';
import { MetaAccountCards } from '@/components/meta/MetaAccountCards';
import { MetaAlerts } from '@/components/meta/MetaAlerts';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useTodayMetrics, useSpendByAccount, useMetaAuthStatus } from '@/hooks/useMeta';
import { mockMetaAccounts } from '@/data/mock-meta';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

const ACCOUNT_COLORS = [
  'hsl(var(--info))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--accent-purple))',
];

export default function MetaDashboard() {
  const { data: auth } = useMetaAuthStatus();
  const { data: metrics, isLoading: metricsLoading } = useTodayMetrics();
  const { data: spendData, isLoading: spendLoading } = useSpendByAccount();

  const chartConfig = Object.fromEntries(
    mockMetaAccounts.map((acc, i) => [
      acc.name,
      { label: acc.name, color: ACCOUNT_COLORS[i % ACCOUNT_COLORS.length] },
    ])
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard Meta" description="Visão geral da integração com a Meta Marketing API" />

      {/* Section 1: Connection Status */}
      <MetaConnectionStatus />

      {auth?.connected && (
        <>
          {/* Section 2: Synced Accounts */}
          <MetaAccountCards />

          {/* Section 3: Alerts */}
          <MetaAlerts />

          {/* Section 4: Today's Metrics */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Métricas de Hoje</h2>
            {metricsLoading ? (
              <LoadingSpinner className="py-8" />
            ) : metrics ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Gasto Total', value: `R$ ${metrics.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` },
                    { label: 'Impressões', value: metrics.impressions.toLocaleString('pt-BR') },
                    { label: 'Cliques', value: metrics.clicks.toLocaleString('pt-BR') },
                    { label: 'ROAS Médio', value: metrics.roas.toFixed(2) },
                  ].map((m) => (
                    <Card key={m.label}>
                      <CardContent className="py-4">
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                        <p className="text-2xl font-bold text-foreground">{m.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Spend by account chart */}
                {spendLoading ? (
                  <LoadingSpinner className="py-8" />
                ) : spendData?.length ? (
                  <Card>
                    <CardContent className="py-4">
                      <h3 className="text-sm font-semibold text-foreground mb-3">Gasto por Conta (Últimos 7 dias)</h3>
                      <ChartContainer config={chartConfig} className="h-[280px] w-full">
                        <LineChart data={spendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(d) => format(new Date(d + 'T00:00:00'), 'dd/MM')}
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={11}
                          />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          {mockMetaAccounts.map((acc, i) => (
                            <Line
                              key={acc.id}
                              type="monotone"
                              dataKey={acc.name}
                              stroke={ACCOUNT_COLORS[i % ACCOUNT_COLORS.length]}
                              strokeWidth={2}
                              dot={false}
                            />
                          ))}
                        </LineChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
