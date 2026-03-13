export interface MetaAuthStatus {
  connected: boolean;
  userName?: string;
  tokenExpiresAt?: string;
  lastSyncAt?: string;
}

export interface MetaAccountSummary {
  id: string;
  accountId: string;
  name: string;
  status: string;
  currency: string;
  timezone: string;
  balance: number;
  spendCap?: number;
  lastSyncAt: string;
  internalAccountId: string;
}

export interface MetaInsight {
  campaignId: string;
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  reach: number;
  cpm?: number;
  cpc?: number;
  ctr?: number;
  purchases?: number;
  revenue?: number;
  roas?: number;
}

export type MetaAlertType = 'account_disabled' | 'campaign_paused' | 'page_restricted';

export interface MetaAlert {
  id: string;
  type: MetaAlertType;
  accountId: string;
  accountName: string;
  assetName?: string;
  description: string;
  createdAt: string;
}
