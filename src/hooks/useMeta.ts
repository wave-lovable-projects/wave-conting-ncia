import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import {
  getMetaAuthStatus,
  setMetaAuthStatus,
  mockMetaAccounts,
  mockMetaCampaigns,
  mockInsightsMap,
  mockMetaAlerts,
} from '@/data/mock-meta';
import type { MetaCampaignFilters, MetaCampaignStatus } from '@/types/meta';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export function useMetaAuthStatus() {
  return useQuery({
    queryKey: ['meta', 'auth'],
    queryFn: async () => {
      await delay();
      return getMetaAuthStatus();
    },
  });
}

export function useConnectMeta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await delay(1500);
      setMetaAuthStatus({
        connected: true,
        userName: 'Carlos Silva',
        tokenExpiresAt: '2026-06-15T23:59:59Z',
        lastSyncAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meta'] });
      toast({ title: 'Conectado com sucesso', description: 'Sua conta Meta foi vinculada.' });
    },
    onError: () => {
      toast({ title: 'Erro ao conectar', description: 'Não foi possível completar a autenticação.', variant: 'destructive' });
    },
  });
}

export function useDisconnectMeta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await delay(800);
      setMetaAuthStatus({ connected: false });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meta'] });
      toast({ title: 'Desconectado', description: 'A conexão com a Meta foi removida.' });
    },
  });
}

export function useSyncMetaAccounts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await delay(2000);
      const auth = getMetaAuthStatus();
      setMetaAuthStatus({ ...auth, lastSyncAt: new Date().toISOString() });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meta'] });
      toast({ title: 'Sincronização concluída', description: 'Os dados foram atualizados.' });
    },
    onError: () => {
      toast({ title: 'Erro na sincronização', description: 'Tente novamente em alguns instantes.', variant: 'destructive' });
    },
  });
}

export function useMetaAccounts() {
  return useQuery({
    queryKey: ['meta', 'accounts'],
    queryFn: async () => {
      await delay();
      return [...mockMetaAccounts];
    },
  });
}

export function useMetaCampaigns(filters: MetaCampaignFilters) {
  return useQuery({
    queryKey: ['meta', 'campaigns', filters],
    queryFn: async () => {
      await delay();
      let list = [...mockMetaCampaigns];
      if (filters.accountId) {
        const ids = filters.accountId.split(',');
        list = list.filter((c) => ids.includes(c.adAccountId));
      }
      if (filters.status) list = list.filter((c) => c.status === filters.status);
      if (filters.search) {
        const s = filters.search.toLowerCase();
        list = list.filter((c) => c.name.toLowerCase().includes(s) || c.accountName.toLowerCase().includes(s));
      }
      return list;
    },
  });
}

export function useMetaInsights(campaignId: string | null, from?: string, to?: string) {
  return useQuery({
    queryKey: ['meta', 'insights', campaignId, from, to],
    queryFn: async () => {
      await delay();
      if (!campaignId) return [];
      let insights = mockInsightsMap[campaignId] || [];
      if (from) insights = insights.filter((i) => i.date >= from);
      if (to) insights = insights.filter((i) => i.date <= to);
      return insights.sort((a, b) => a.date.localeCompare(b.date));
    },
    enabled: !!campaignId,
  });
}

export function useMetaAlerts() {
  return useQuery({
    queryKey: ['meta', 'alerts'],
    queryFn: async () => {
      await delay();
      return [...mockMetaAlerts];
    },
  });
}

export function usePauseCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: string) => {
      await delay(800);
      const c = mockMetaCampaigns.find((x) => x.id === campaignId);
      if (c) (c as any).status = 'PAUSED' as MetaCampaignStatus;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meta', 'campaigns'] });
      toast({ title: 'Campanha pausada', description: 'A campanha foi pausada com sucesso.' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Não foi possível pausar a campanha.', variant: 'destructive' });
    },
  });
}

export function useActivateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: string) => {
      await delay(800);
      const c = mockMetaCampaigns.find((x) => x.id === campaignId);
      if (c) (c as any).status = 'ACTIVE' as MetaCampaignStatus;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meta', 'campaigns'] });
      toast({ title: 'Campanha ativada', description: 'A campanha foi reativada com sucesso.' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Não foi possível ativar a campanha.', variant: 'destructive' });
    },
  });
}

export function useTodayMetrics() {
  return useQuery({
    queryKey: ['meta', 'today-metrics'],
    queryFn: async () => {
      await delay();
      const today = '2026-03-13';
      let totalSpend = 0, totalImpressions = 0, totalClicks = 0, totalRevenue = 0, totalCampaigns = 0;
      Object.values(mockInsightsMap).forEach((insights) => {
        const todayInsight = insights.find((i) => i.date === today);
        if (todayInsight) {
          totalSpend += todayInsight.spend;
          totalImpressions += todayInsight.impressions;
          totalClicks += todayInsight.clicks;
          totalRevenue += todayInsight.revenue || 0;
          totalCampaigns++;
        }
      });
      return {
        spend: Math.round(totalSpend * 100) / 100,
        impressions: totalImpressions,
        clicks: totalClicks,
        roas: totalSpend > 0 ? Math.round((totalRevenue / totalSpend) * 100) / 100 : 0,
      };
    },
  });
}

export function useSpendByAccount() {
  return useQuery({
    queryKey: ['meta', 'spend-by-account'],
    queryFn: async () => {
      await delay();
      const days = 7;
      const now = new Date('2026-03-13');
      const dates: string[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
      }

      return dates.map((date) => {
        const row: Record<string, any> = { date };
        mockMetaAccounts.forEach((acc) => {
          const campaignIds = mockMetaCampaigns.filter((c) => c.adAccountId === acc.id).map((c) => c.id);
          let spend = 0;
          campaignIds.forEach((cid) => {
            const insight = (mockInsightsMap[cid] || []).find((i) => i.date === date);
            if (insight) spend += insight.spend;
          });
          row[acc.name] = Math.round(spend * 100) / 100;
        });
        return row;
      });
    },
  });
}
