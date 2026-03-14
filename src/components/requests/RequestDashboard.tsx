import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Request, RequestFilters, RequestStatus } from '@/types/request';
import { REQUEST_STATUS_LABELS } from '@/types/request';
import {
  ClipboardList, Clock, CheckCircle, PackageCheck, Truck,
  AlertTriangle, Timer, Building2,
} from 'lucide-react';
import { differenceInDays, differenceInHours } from 'date-fns';

interface RequestDashboardProps {
  requests: Request[];
  onFilterChange: (f: Partial<RequestFilters>) => void;
}

const PIPELINE_STATUSES: RequestStatus[] = [
  'PENDENTE', 'APROVADA', 'SOLICITADA_FORNECEDOR', 'RECEBIDA',
  'EM_AQUECIMENTO', 'PRONTA', 'ENTREGUE',
];

const PIPELINE_COLORS: Record<string, string> = {
  PENDENTE: 'bg-warning',
  APROVADA: 'bg-info',
  SOLICITADA_FORNECEDOR: 'bg-accent-purple',
  RECEBIDA: 'bg-info/80',
  EM_AQUECIMENTO: 'bg-caution',
  PRONTA: 'bg-success/60',
  ENTREGUE: 'bg-success',
};

const IN_PROGRESS_STATUSES: RequestStatus[] = [
  'APROVADA', 'SOLICITADA_FORNECEDOR', 'RECEBIDA', 'EM_AQUECIMENTO',
];

function getDaysInStage(r: Request): number {
  const last = r.statusHistory.length > 0
    ? r.statusHistory[r.statusHistory.length - 1].changedAt
    : r.createdAt;
  return differenceInDays(new Date(), new Date(last));
}

function formatDays(d: number): string {
  if (d >= 7) return `${Math.floor(d / 7)}sem`;
  return `${d}d`;
}

// ── Stats Cards ──────────────────────────────────────────────
function StatsCards({ requests, onFilterChange }: RequestDashboardProps) {
  const now = new Date();
  const pending = requests.filter((r) => r.status === 'PENDENTE').length;
  const inProgress = requests.filter((r) => IN_PROGRESS_STATUSES.includes(r.status)).length;
  const ready = requests.filter((r) => r.status === 'PRONTA').length;
  const deliveredThisMonth = requests.filter(
    (r) =>
      r.status === 'ENTREGUE' &&
      r.deliveredAt &&
      new Date(r.deliveredAt).getMonth() === now.getMonth() &&
      new Date(r.deliveredAt).getFullYear() === now.getFullYear()
  ).length;

  const cards = [
    { label: 'Total', value: requests.length, icon: ClipboardList, filter: {} as Partial<RequestFilters> },
    { label: 'Pendentes', value: pending, icon: Clock, filter: { status: 'PENDENTE' } },
    { label: 'Em Andamento', value: inProgress, icon: Timer, filter: { status: IN_PROGRESS_STATUSES.join(',') } },
    { label: 'Prontas', value: ready, icon: CheckCircle, filter: { status: 'PRONTA' } },
    { label: 'Entregues (mês)', value: deliveredThisMonth, icon: Truck, filter: { status: 'ENTREGUE' } },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card
            key={c.label}
            className="p-4 cursor-pointer transition-all hover:bg-card-hover border border-border"
            onClick={() => onFilterChange(c.filter)}
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

// ── Pipeline Bar ─────────────────────────────────────────────
function PipelineBar({ requests }: { requests: Request[] }) {
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    PIPELINE_STATUSES.forEach((s) => { map[s] = 0; });
    requests.forEach((r) => {
      if (map[r.status] !== undefined) map[r.status]++;
    });
    return map;
  }, [requests]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Pipeline Resumido</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex h-8 rounded-md overflow-hidden">
            {PIPELINE_STATUSES.map((s) => {
              const count = counts[s];
              if (count === 0) return null;
              const pct = (count / total) * 100;
              return (
                <Tooltip key={s}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(PIPELINE_COLORS[s], 'flex items-center justify-center text-xs font-semibold text-white min-w-[28px] transition-all')}
                      style={{ width: `${pct}%` }}
                    >
                      {count}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{REQUEST_STATUS_LABELS[s]}: {count} ({pct.toFixed(0)}%)</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
        <div className="flex flex-wrap gap-3 mt-3">
          {PIPELINE_STATUSES.map((s) => {
            const count = counts[s];
            if (count === 0) return null;
            return (
              <div key={s} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className={cn('h-2.5 w-2.5 rounded-full', PIPELINE_COLORS[s])} />
                {REQUEST_STATUS_LABELS[s]}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Delay Alerts ─────────────────────────────────────────────
function DelayAlerts({ requests }: { requests: Request[] }) {
  const alerts = useMemo(() => {
    const terminal: RequestStatus[] = ['ENTREGUE', 'REJEITADA', 'CANCELADA'];
    return requests
      .filter((r) => !terminal.includes(r.status))
      .map((r) => ({ ...r, daysStuck: getDaysInStage(r) }))
      .filter((r) => r.daysStuck > 3)
      .sort((a, b) => b.daysStuck - a.daysStuck)
      .slice(0, 5);
  }, [requests]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          Alertas de Atraso
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma solicitação atrasada.</p>
        ) : (
          <div className="space-y-3">
            {alerts.map((r) => (
              <div key={r.id} className="flex items-start gap-2">
                <AlertTriangle
                  className={cn(
                    'h-4 w-4 mt-0.5 shrink-0',
                    r.daysStuck > 7 ? 'text-destructive' : 'text-warning'
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={r.status} className="text-[10px]" />
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        r.daysStuck > 7 ? 'text-destructive' : 'text-warning'
                      )}
                    >
                      {formatDays(r.daysStuck)}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {r.requesterName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── SLA Metrics ──────────────────────────────────────────────
function SLAMetrics({ requests }: { requests: Request[] }) {
  const { avgTotalDays, stageAvgs, maxStageAvg } = useMemo(() => {
    const delivered = requests.filter((r) => r.status === 'ENTREGUE' && r.deliveredAt);

    // Average total lead time
    let totalHours = 0;
    delivered.forEach((r) => {
      totalHours += differenceInHours(new Date(r.deliveredAt!), new Date(r.createdAt));
    });
    const avgTotal = delivered.length > 0 ? totalHours / delivered.length / 24 : 0;

    // Per-stage averages
    const stageHoursMap: Record<string, number[]> = {};
    PIPELINE_STATUSES.forEach((s) => { stageHoursMap[s] = []; });

    delivered.forEach((r) => {
      const history = r.statusHistory;
      for (let i = 0; i < history.length; i++) {
        const from = i === 0 ? r.createdAt : history[i - 1].changedAt;
        const to = history[i].changedAt;
        const stage = i === 0 ? 'PENDENTE' : history[i - 1].toStatus;
        if (stageHoursMap[stage]) {
          stageHoursMap[stage].push(differenceInHours(new Date(to), new Date(from)));
        }
      }
    });

    const avgs: { stage: RequestStatus; avgDays: number }[] = [];
    let maxAvg = 0;
    PIPELINE_STATUSES.filter((s) => s !== 'ENTREGUE').forEach((s) => {
      const arr = stageHoursMap[s];
      const avg = arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length / 24 : 0;
      if (avg > maxAvg) maxAvg = avg;
      avgs.push({ stage: s, avgDays: avg });
    });

    return { avgTotalDays: avgTotal, stageAvgs: avgs, maxStageAvg: maxAvg };
  }, [requests]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Timer className="h-4 w-4 text-info" />
          Métricas de Tempo (SLA)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-4">
          <p className="text-xs text-muted-foreground">Tempo médio total</p>
          <p className="text-2xl font-bold text-foreground">
            {avgTotalDays > 0 ? `${avgTotalDays.toFixed(1)}d` : '—'}
          </p>
        </div>
        <p className="text-xs text-muted-foreground mb-2">Tempo médio por etapa</p>
        <div className="space-y-2">
          {stageAvgs.map(({ stage, avgDays }) => (
            <div key={stage} className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-24 truncate">
                {REQUEST_STATUS_LABELS[stage]}
              </span>
              <div className="flex-1 h-3 bg-surface-2 rounded-full overflow-hidden">
                <div
                  className={cn(PIPELINE_COLORS[stage], 'h-full rounded-full transition-all')}
                  style={{ width: maxStageAvg > 0 ? `${(avgDays / maxStageAvg) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-[10px] font-medium text-foreground w-8 text-right">
                {avgDays > 0 ? `${avgDays.toFixed(1)}d` : '—'}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Supplier Summary ─────────────────────────────────────────
function SupplierSummary({ requests }: { requests: Request[] }) {
  const suppliers = useMemo(() => {
    const map: Record<string, {
      name: string;
      active: number;
      deliveryDays: number[];
      onTime: number;
      total: number;
    }> = {};

    requests.forEach((r) => {
      if (!r.supplierId || !r.supplierName) return;
      if (!map[r.supplierId]) {
        map[r.supplierId] = { name: r.supplierName, active: 0, deliveryDays: [], onTime: 0, total: 0 };
      }
      const s = map[r.supplierId];
      const terminal: RequestStatus[] = ['ENTREGUE', 'REJEITADA', 'CANCELADA'];
      if (!terminal.includes(r.status)) s.active++;

      if (r.supplierOrderDate && r.supplierReceivedDate) {
        s.deliveryDays.push(differenceInDays(new Date(r.supplierReceivedDate), new Date(r.supplierOrderDate)));
        s.total++;
        if (r.supplierExpectedDate && new Date(r.supplierReceivedDate) <= new Date(r.supplierExpectedDate)) {
          s.onTime++;
        }
      }
    });

    return Object.values(map);
  }, [requests]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Building2 className="h-4 w-4 text-accent-purple" />
          Por Fornecedor
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {suppliers.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem dados de fornecedores.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="text-left pb-2 font-medium">Fornecedor</th>
                  <th className="text-center pb-2 font-medium">Ativos</th>
                  <th className="text-center pb-2 font-medium">Tempo Méd.</th>
                  <th className="text-center pb-2 font-medium">No Prazo</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => {
                  const avgDelivery = s.deliveryDays.length > 0
                    ? (s.deliveryDays.reduce((a, b) => a + b, 0) / s.deliveryDays.length).toFixed(1)
                    : '—';
                  const onTimeRate = s.total > 0
                    ? `${Math.round((s.onTime / s.total) * 100)}%`
                    : '—';
                  return (
                    <tr key={s.name} className="border-b border-border/50">
                      <td className="py-2 font-medium text-foreground">{s.name}</td>
                      <td className="py-2 text-center text-foreground">{s.active}</td>
                      <td className="py-2 text-center text-foreground">{avgDelivery !== '—' ? `${avgDelivery}d` : '—'}</td>
                      <td className={cn('py-2 text-center font-semibold', onTimeRate !== '—' && parseInt(onTimeRate) >= 80 ? 'text-success' : onTimeRate !== '—' ? 'text-warning' : 'text-muted-foreground')}>
                        {onTimeRate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Main Dashboard ───────────────────────────────────────────
export function RequestDashboard({ requests, onFilterChange }: RequestDashboardProps) {
  return (
    <div className="space-y-4">
      <StatsCards requests={requests} onFilterChange={onFilterChange} />
      <PipelineBar requests={requests} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DelayAlerts requests={requests} />
        <SLAMetrics requests={requests} />
        <SupplierSummary requests={requests} />
      </div>
    </div>
  );
}
