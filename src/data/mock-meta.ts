import type { MetaAuthStatus, MetaAccountSummary, MetaCampaign, MetaInsight, MetaAlert } from '@/types/meta';

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

export const mockMetaCampaigns: MetaCampaign[] = [
  { id: 'mc1', metaId: '23851234567890', adAccountId: 'ma1', accountName: 'Ecommerce Principal', name: 'Black Friday - Conversões', status: 'ACTIVE', objective: 'CONVERSIONS', budget: 500, budgetType: 'DAILY', startTime: '2026-03-01T00:00:00Z', lastSyncAt: '2026-03-13T10:30:00Z' },
  { id: 'mc2', metaId: '23851234567891', adAccountId: 'ma1', accountName: 'Ecommerce Principal', name: 'Remarketing Carrinho', status: 'ACTIVE', objective: 'CONVERSIONS', budget: 200, budgetType: 'DAILY', startTime: '2026-02-15T00:00:00Z', lastSyncAt: '2026-03-13T10:30:00Z' },
  { id: 'mc3', metaId: '23851234567892', adAccountId: 'ma1', accountName: 'Ecommerce Principal', name: 'Prospecting LAL', status: 'PAUSED', objective: 'REACH', budget: 1500, budgetType: 'LIFETIME', startTime: '2026-01-10T00:00:00Z', stopTime: '2026-02-28T23:59:59Z', lastSyncAt: '2026-03-13T10:30:00Z' },
  { id: 'mc4', metaId: '23851234567893', adAccountId: 'ma2', accountName: 'Infoprodutos BR', name: 'Lançamento Curso X', status: 'ACTIVE', objective: 'CONVERSIONS', budget: 1000, budgetType: 'DAILY', startTime: '2026-03-05T00:00:00Z', lastSyncAt: '2026-03-13T10:28:00Z' },
  { id: 'mc5', metaId: '23851234567894', adAccountId: 'ma2', accountName: 'Infoprodutos BR', name: 'Webinar Tráfego', status: 'ACTIVE', objective: 'TRAFFIC', budget: 300, budgetType: 'DAILY', startTime: '2026-03-08T00:00:00Z', lastSyncAt: '2026-03-13T10:28:00Z' },
  { id: 'mc6', metaId: '23851234567895', adAccountId: 'ma2', accountName: 'Infoprodutos BR', name: 'Branding Institucional', status: 'ARCHIVED', objective: 'BRAND_AWARENESS', budget: 5000, budgetType: 'LIFETIME', startTime: '2025-12-01T00:00:00Z', stopTime: '2026-01-31T23:59:59Z', lastSyncAt: '2026-03-13T10:28:00Z' },
  { id: 'mc7', metaId: '23851234567896', adAccountId: 'ma3', accountName: 'Saúde & Bem-Estar', name: 'Suplementos Verão', status: 'DELETED', objective: 'CONVERSIONS', budget: 400, budgetType: 'DAILY', startTime: '2026-01-05T00:00:00Z', stopTime: '2026-02-15T23:59:59Z', lastSyncAt: '2026-03-13T10:25:00Z' },
  { id: 'mc8', metaId: '23851234567897', adAccountId: 'ma4', accountName: 'Finanças Digital', name: 'App Install - iOS', status: 'ACTIVE', objective: 'APP_INSTALLS', budget: 800, budgetType: 'DAILY', startTime: '2026-03-01T00:00:00Z', lastSyncAt: '2026-03-13T10:32:00Z' },
  { id: 'mc9', metaId: '23851234567898', adAccountId: 'ma4', accountName: 'Finanças Digital', name: 'Retargeting Website', status: 'PAUSED', objective: 'CONVERSIONS', budget: 250, budgetType: 'DAILY', startTime: '2026-02-20T00:00:00Z', lastSyncAt: '2026-03-13T10:32:00Z' },
  { id: 'mc10', metaId: '23851234567899', adAccountId: 'ma4', accountName: 'Finanças Digital', name: 'Lead Gen - Consultoria', status: 'ACTIVE', objective: 'LEAD_GENERATION', budget: 600, budgetType: 'DAILY', startTime: '2026-03-10T00:00:00Z', lastSyncAt: '2026-03-13T10:32:00Z' },
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
mockMetaCampaigns.forEach((c) => {
  mockInsightsMap[c.id] = generateInsights(c.id, 30);
});

export const mockMetaAlerts: MetaAlert[] = [
  { id: 'al1', type: 'account_disabled', accountId: 'ma3', accountName: 'Saúde & Bem-Estar', description: 'Conta de anúncio desativada por violação de política.', createdAt: '2026-03-12T14:30:00Z' },
  { id: 'al2', type: 'campaign_paused', accountId: 'ma1', accountName: 'Ecommerce Principal', assetName: 'Prospecting LAL', description: 'Campanha pausada automaticamente — orçamento lifetime atingido.', createdAt: '2026-03-11T09:15:00Z' },
  { id: 'al3', type: 'page_restricted', accountId: 'ma2', accountName: 'Infoprodutos BR', assetName: 'Página Curso X', description: 'Página restrita para publicação de anúncios.', createdAt: '2026-03-10T16:45:00Z' },
  { id: 'al4', type: 'campaign_paused', accountId: 'ma4', accountName: 'Finanças Digital', assetName: 'Retargeting Website', description: 'Campanha pausada pelo gestor.', createdAt: '2026-03-09T11:00:00Z' },
  { id: 'al5', type: 'account_disabled', accountId: 'ma3', accountName: 'Saúde & Bem-Estar', description: 'Tentativa de reativação negada — revisão pendente.', createdAt: '2026-03-08T08:20:00Z' },
  { id: 'al6', type: 'page_restricted', accountId: 'ma1', accountName: 'Ecommerce Principal', assetName: 'Página Loja Virtual', description: 'Restrição parcial removida após revisão.', createdAt: '2026-03-07T13:50:00Z' },
];
