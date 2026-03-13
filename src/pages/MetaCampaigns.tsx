import { useState } from 'react';
import { ExternalLink, MoreHorizontal, Pause, Play, BarChart3, RefreshCw, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { CampaignFiltersBar } from '@/components/meta/CampaignFilters';
import { CampaignInsightsSheet } from '@/components/meta/CampaignInsightsSheet';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMetaCampaigns, usePauseCampaign, useActivateCampaign, useSyncMetaAccounts } from '@/hooks/useMeta';
import { mockInsightsMap } from '@/data/mock-meta';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { MetaCampaign, MetaCampaignFilters } from '@/types/meta';

const BUDGET_TYPE_LABELS: Record<string, string> = {
  DAILY: 'Diário',
  LIFETIME: 'Vitalício',
};

export default function MetaCampaigns() {
  const [filters, setFilters] = useState<MetaCampaignFilters>({});
  const { data: campaigns, isLoading } = useMetaCampaigns(filters);
  const pauseMutation = usePauseCampaign();
  const activateMutation = useActivateCampaign();
  const syncMutation = useSyncMetaAccounts();

  const [confirmAction, setConfirmAction] = useState<{ type: 'pause' | 'activate'; campaign: MetaCampaign } | null>(null);
  const [insightsCampaign, setInsightsCampaign] = useState<MetaCampaign | null>(null);

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'pause') {
      pauseMutation.mutate(confirmAction.campaign.id);
    } else {
      activateMutation.mutate(confirmAction.campaign.id);
    }
    setConfirmAction(null);
  };

  const getTodaySpend = (campaignId: string) => {
    const insights = mockInsightsMap[campaignId];
    const today = insights?.find((i) => i.date === '2026-03-13');
    return today?.spend;
  };

  const getTodayRoas = (campaignId: string) => {
    const insights = mockInsightsMap[campaignId];
    const today = insights?.find((i) => i.date === '2026-03-13');
    return today?.roas;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campanhas"
        description="Gerencie e monitore suas campanhas Meta Ads"
        actions={
          <Button variant="outline" size="sm" onClick={() => syncMutation.mutate()} disabled={syncMutation.isPending} className="gap-2">
            {syncMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Sincronizar
          </Button>
        }
      />

      <CampaignFiltersBar filters={filters} onChange={setFilters} />

      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : (
        <div className="rounded-lg border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Conta</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead>Orçamento</TableHead>
                <TableHead>Período</TableHead>
                <TableHead className="text-right">Spend Hoje</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
                <TableHead>Última Sync</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-12">
                    Nenhuma campanha encontrada.
                  </TableCell>
                </TableRow>
              )}
              {campaigns?.map((c) => {
                const spend = getTodaySpend(c.id);
                const roas = getTodayRoas(c.id);
                return (
                  <TableRow key={c.id} className="group/row">
                    <TableCell className={cn('font-medium', c.status === 'DELETED' && 'line-through text-muted-foreground')}>
                      <div className="flex items-center gap-1">
                        <span>{c.name}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/row:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {c.status === 'ACTIVE' && (
                              <DropdownMenuItem onClick={() => setConfirmAction({ type: 'pause', campaign: c })}>
                                <Pause className="h-4 w-4 mr-2" /> Pausar
                              </DropdownMenuItem>
                            )}
                            {c.status === 'PAUSED' && (
                              <DropdownMenuItem onClick={() => setConfirmAction({ type: 'activate', campaign: c })}>
                                <Play className="h-4 w-4 mr-2" /> Ativar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => setInsightsCampaign(c)}>
                              <BarChart3 className="h-4 w-4 mr-2" /> Ver Insights
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(`https://business.facebook.com/adsmanager/manage/campaigns?act=${c.metaId}`, '_blank')}>
                              <ExternalLink className="h-4 w-4 mr-2" /> Ver no Facebook
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.accountName}</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.objective || '—'}</TableCell>
                    <TableCell className="text-sm">
                      {c.budget ? (
                        <span>R$ {c.budget.toLocaleString('pt-BR')} <span className="text-muted-foreground text-xs">({BUDGET_TYPE_LABELS[c.budgetType || ''] || c.budgetType})</span></span>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.startTime ? format(new Date(c.startTime), 'dd/MM/yy', { locale: ptBR }) : '—'}
                      {c.stopTime ? ` – ${format(new Date(c.stopTime), 'dd/MM/yy', { locale: ptBR })}` : ''}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {spend !== undefined ? `R$ ${spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {roas !== undefined ? roas.toFixed(2) : '—'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(c.lastSyncAt), 'dd/MM HH:mm', { locale: ptBR })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.type === 'pause' ? 'Pausar Campanha' : 'Ativar Campanha'}
        description={
          confirmAction?.type === 'pause'
            ? `Tem certeza que deseja pausar a campanha "${confirmAction.campaign.name}"?`
            : `Tem certeza que deseja reativar a campanha "${confirmAction?.campaign.name}"?`
        }
        confirmLabel={confirmAction?.type === 'pause' ? 'Pausar' : 'Ativar'}
        variant={confirmAction?.type === 'pause' ? 'danger' : 'default'}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />

      <CampaignInsightsSheet
        campaign={insightsCampaign}
        open={!!insightsCampaign}
        onClose={() => setInsightsCampaign(null)}
      />
    </div>
  );
}
