import type { MetaAuthStatus, MetaAccountSummary, MetaInsight, MetaAlert } from '@/types/meta';

let mockAuthStatus: MetaAuthStatus = {
  connected: true,
  userName: 'Carlos Silva',
  tokenExpiresAt: '2026-04-15T23:59:59Z',
  lastSyncAt: '2026-03-13T10:30:00Z',
};

export const getMetaAuthStatus = () => ({ ...mockAuthStatus });
export const setMetaAuthStatus = (s: MetaAuthStatus) => { mockAuthStatus = s; };

export const mockMetaAccounts: MetaAccountSummary[] = [
  { id: 'ma1', accountId: 'act_1234567890', name: 'Ecommerce Principal', status: 'ACTIVE', currency: 'BRL', timezone: 'America/Sao_Paulo', balance: 4520.50, spendCap: 50000, lastSyncAt: '2026-03-13T10:30:00Z', internalAccountId: '1' },
  { id: 'ma2', accountId: 'act_2345678901', name: 'Infoprodutos BR', status: 'ACTIVE', currency: 'BRL', timezone: 'America/Sao_Paulo', balance: 12300.00, lastSyncAt: '2026-03-13T10:28:00Z', internalAccountId: '2' },
  { id: 'ma3', accountId: 'act_3456789012', name: 'Saúde & Bem-Estar', status: 'DISABLED', currency: 'BRL', timezone: 'America/Sao_Paulo', balance: 0, lastSyncAt: '2026-03-13T10:25:00Z', internalAccountId: '3' },
  { id: 'ma4', accountId: 'act_4567890123', name: 'Finanças Digital', status: 'ACTIVE', currency: 'USD', timezone: 'America/New_York', balance: 8750.25, spendCap: 100000, lastSyncAt: '2026-03-13T10:32:00Z', internalAccountId: '4' },
];

// Campaign IDs used internally for insights generation
const campaignAccountMap: { id: string; adAccountId: string }[] = [
  { id: 'mc1', adAccountId: 'ma1' },
  { id: 'mc2', adAccountId: 'ma1' },
  { id: 'mc3', adAccountId: 'ma1' },
  { id: 'mc4', adAccountId: 'ma2' },
  { id: 'mc5', adAccountId: 'ma2' },
  { id: 'mc6', adAccountId: 'ma2' },
  { id: 'mc7', adAccountId: 'ma3' },
  { id: 'mc8', adAccountId: 'ma4' },
  { id: 'mc9', adAccountId: 'ma4' },
  { id: 'mc10', adAccountId: 'ma4' },
];

function generateInsights(campaignId: string, days: number): MetaInsight[] {
  const insights: MetaInsight[] = [];
  const now = new Date('2026-03-13');
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const spend = Math.round((Math.random() * 400 + 100) * 100) / 100;
    const impressions = Math.floor(Math.random() * 50000 + 5000);
    const clicks = Math.floor(impressions * (Math.random() * 0.04 + 0.01));
    const reach = Math.floor(impressions * (Math.random() * 0.3 + 0.6));
    const purchases = Math.floor(Math.random() * 20);
    const revenue = Math.round(purchases * (Math.random() * 150 + 50) * 100) / 100;
    insights.push({
      campaignId,
      date: date.toISOString().split('T')[0],
      spend,
      impressions,
      clicks,
      reach,
      cpm: Math.round((spend / impressions) * 1000 * 100) / 100,
      cpc: clicks > 0 ? Math.round((spend / clicks) * 100) / 100 : undefined,
      ctr: Math.round((clicks / impressions) * 100 * 100) / 100,
      purchases,
      revenue,
      roas: spend > 0 ? Math.round((revenue / spend) * 100) / 100 : undefined,
    });
  }
  return insights;
}

export const mockInsightsMap: Record<string, MetaInsight[]> = {};
campaignAccountMap.forEach((c) => {
  mockInsightsMap[c.id] = generateInsights(c.id, 30);
});

export { campaignAccountMap };

export const mockMetaAlerts: MetaAlert[] = [
  { id: 'al1', type: 'account_disabled', accountId: 'ma3', accountName: 'Saúde & Bem-Estar', description: 'Conta de anúncio desativada por violação de política.', createdAt: '2026-03-12T14:30:00Z' },
  { id: 'al2', type: 'campaign_paused', accountId: 'ma1', accountName: 'Ecommerce Principal', assetName: 'Prospecting LAL', description: 'Campanha pausada automaticamente — orçamento lifetime atingido.', createdAt: '2026-03-11T09:15:00Z' },
  { id: 'al3', type: 'page_restricted', accountId: 'ma2', accountName: 'Infoprodutos BR', assetName: 'Página Curso X', description: 'Página restrita para publicação de anúncios.', createdAt: '2026-03-10T16:45:00Z' },
  { id: 'al4', type: 'campaign_paused', accountId: 'ma4', accountName: 'Finanças Digital', assetName: 'Retargeting Website', description: 'Campanha pausada pelo gestor.', createdAt: '2026-03-09T11:00:00Z' },
  { id: 'al5', type: 'account_disabled', accountId: 'ma3', accountName: 'Saúde & Bem-Estar', description: 'Tentativa de reativação negada — revisão pendente.', createdAt: '2026-03-08T08:20:00Z' },
  { id: 'al6', type: 'page_restricted', accountId: 'ma1', accountName: 'Ecommerce Principal', assetName: 'Página Loja Virtual', description: 'Restrição parcial removida após revisão.', createdAt: '2026-03-07T13:50:00Z' },
];
