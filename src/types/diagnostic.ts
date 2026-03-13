export type AssetType = 'AD_ACCOUNT' | 'BUSINESS_MANAGER' | 'PROFILE' | 'PAGE' | 'PIXEL';

export type RestrictionType = 'CONTA_DESATIVADA' | 'BM_BLOQUEADA' | 'PERFIL_DESATIVADO' | 'RESTRICAO_ANUNCIO' | 'AVISO' | 'OUTRO';

export const RESTRICTION_TYPE_LABELS: Record<RestrictionType, string> = {
  CONTA_DESATIVADA: 'Conta Desativada',
  BM_BLOQUEADA: 'BM Bloqueada',
  PERFIL_DESATIVADO: 'Perfil Desativado',
  RESTRICAO_ANUNCIO: 'Restrição de Anúncio',
  AVISO: 'Aviso',
  OUTRO: 'Outro',
};

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  AD_ACCOUNT: 'Conta de Anúncio',
  BUSINESS_MANAGER: 'Business Manager',
  PROFILE: 'Perfil',
  PAGE: 'Página',
  PIXEL: 'Pixel',
};

export interface Incident {
  id: string;
  date: string;
  assetType: AssetType;
  assetId: string;
  assetName: string;
  restrictionType: RestrictionType;
  facebookReason?: string;
  suspectedCause?: string;
  linkedElements: string[];
  notes?: string;
  createdByName: string;
  createdAt: string;
}

export interface DiagnosticLink {
  id: string;
  sourceType: string;
  sourceId: string;
  sourceName: string;
  targetType: string;
  targetId: string;
  targetName: string;
  relationship: string;
  createdAt: string;
}

export interface DiagnosticNode {
  id: string;
  type: AssetType;
  name: string;
  status: string;
}

export interface IncidentFilters {
  assetType?: string;
  restrictionType?: string;
  startDate?: string;
  endDate?: string;
}

export interface GraphFilters {
  assetType?: string;
  managerId?: string;
}
