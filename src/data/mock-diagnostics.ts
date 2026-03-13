import type { Incident, DiagnosticLink, DiagnosticNode } from '@/types/diagnostic';

let mockIncidents: Incident[] = [
  { id: 'inc-1', date: '2025-03-10', assetType: 'AD_ACCOUNT', assetId: '3', assetName: 'Conta Saúde 03', restrictionType: 'CONTA_DESATIVADA', facebookReason: 'Violação de política de publicidade', suspectedCause: 'Criativo com claims de saúde', linkedElements: ['bm-1', 'pf-1'], notes: 'Conta desativada após revisão automática', createdByName: 'Carlos Silva', createdAt: '2025-03-10T14:00:00Z' },
  { id: 'inc-2', date: '2025-03-09', assetType: 'BUSINESS_MANAGER', assetId: 'bm-5', assetName: 'BM Misto Geral', restrictionType: 'BM_BLOQUEADA', facebookReason: 'Atividade incomum detectada', suspectedCause: 'Múltiplas contas desativadas vinculadas', linkedElements: ['3', 'px-4'], createdByName: 'Ana Oliveira', createdAt: '2025-03-09T10:00:00Z' },
  { id: 'inc-3', date: '2025-03-08', assetType: 'PROFILE', assetId: 'pf-5', assetName: 'Perfil Bloqueado 05', restrictionType: 'PERFIL_DESATIVADO', facebookReason: 'Verificação de identidade falhou', linkedElements: ['bm-3'], createdByName: 'Rafael Santos', createdAt: '2025-03-08T16:00:00Z' },
  { id: 'inc-4', date: '2025-03-07', assetType: 'AD_ACCOUNT', assetId: '5', assetName: 'Conta Edu 05', restrictionType: 'RESTRICAO_ANUNCIO', facebookReason: 'Anúncio rejeitado por conteúdo enganoso', suspectedCause: 'Copy agressiva demais', linkedElements: ['bm-3', 'pf-2'], createdByName: 'Juliana Costa', createdAt: '2025-03-07T09:00:00Z' },
  { id: 'inc-5', date: '2025-03-06', assetType: 'PIXEL', assetId: 'px-4', assetName: 'Pixel Bloqueado Antigo', restrictionType: 'AVISO', facebookReason: 'Domínio não verificado', linkedElements: ['bm-5'], createdByName: 'Carlos Silva', createdAt: '2025-03-06T11:00:00Z' },
  { id: 'inc-6', date: '2025-03-05', assetType: 'PAGE', assetId: 'pg-5', assetName: 'Página Bloqueada Teste', restrictionType: 'OUTRO', facebookReason: 'Conteúdo removido por denúncia', suspectedCause: 'Post com imagem inadequada', linkedElements: ['bm-5', 'pf-4'], createdByName: 'Ana Oliveira', createdAt: '2025-03-05T14:30:00Z' },
  { id: 'inc-7', date: '2025-03-04', assetType: 'AD_ACCOUNT', assetId: '7', assetName: 'Conta Pet 07', restrictionType: 'CONTA_DESATIVADA', suspectedCause: 'Conta inativa por muito tempo', linkedElements: [], createdByName: 'Rafael Santos', createdAt: '2025-03-04T08:00:00Z' },
  { id: 'inc-8', date: '2025-03-03', assetType: 'BUSINESS_MANAGER', assetId: 'bm-9', assetName: 'BM Bloqueada Antiga', restrictionType: 'BM_BLOQUEADA', facebookReason: 'Pagamento pendente', suspectedCause: 'Cartão expirado', linkedElements: ['12'], createdByName: 'Juliana Costa', createdAt: '2025-03-03T15:00:00Z' },
  { id: 'inc-9', date: '2025-03-02', assetType: 'PROFILE', assetId: 'pf-3', assetName: 'Perfil Reserva 03', restrictionType: 'PERFIL_DESATIVADO', facebookReason: 'Conta desativada por inatividade', linkedElements: ['bm-1'], createdByName: 'Carlos Silva', createdAt: '2025-03-02T10:00:00Z' },
  { id: 'inc-10', date: '2025-03-01', assetType: 'AD_ACCOUNT', assetId: '12', assetName: 'Conta Fin 12', restrictionType: 'CONTA_DESATIVADA', facebookReason: 'Violação repetida de políticas', suspectedCause: 'Reincidência de criativos rejeitados', linkedElements: ['bm-9', 'pf-5'], createdByName: 'Ana Oliveira', createdAt: '2025-03-01T12:00:00Z' },
];

let mockLinks: DiagnosticLink[] = [
  { id: 'dl-1', sourceType: 'AD_ACCOUNT', sourceId: '1', sourceName: 'Conta Ecomm 01', targetType: 'BUSINESS_MANAGER', targetId: 'bm-1', targetName: 'BM Principal Ads', relationship: 'vinculada a', createdAt: '2025-01-15T10:00:00Z' },
  { id: 'dl-2', sourceType: 'AD_ACCOUNT', sourceId: '3', sourceName: 'Conta Saúde 03', targetType: 'BUSINESS_MANAGER', targetId: 'bm-1', targetName: 'BM Principal Ads', relationship: 'vinculada a', createdAt: '2025-02-01T10:00:00Z' },
  { id: 'dl-3', sourceType: 'PROFILE', sourceId: 'pf-1', sourceName: 'Perfil Admin 01', targetType: 'BUSINESS_MANAGER', targetId: 'bm-1', targetName: 'BM Principal Ads', relationship: 'administra', createdAt: '2025-01-15T10:00:00Z' },
  { id: 'dl-4', sourceType: 'PIXEL', sourceId: 'px-1', sourceName: 'Pixel Principal', targetType: 'AD_ACCOUNT', targetId: '1', targetName: 'Conta Ecomm 01', relationship: 'rastreia', createdAt: '2025-01-15T10:00:00Z' },
  { id: 'dl-5', sourceType: 'PAGE', sourceId: 'pg-1', sourceName: 'Página Loja Premium', targetType: 'AD_ACCOUNT', targetId: '1', targetName: 'Conta Ecomm 01', relationship: 'publica anúncios de', createdAt: '2025-01-15T10:00:00Z' },
  { id: 'dl-6', sourceType: 'AD_ACCOUNT', sourceId: '5', sourceName: 'Conta Edu 05', targetType: 'BUSINESS_MANAGER', targetId: 'bm-3', targetName: 'BM Pixels Central', relationship: 'vinculada a', createdAt: '2025-02-15T10:00:00Z' },
  { id: 'dl-7', sourceType: 'PROFILE', sourceId: 'pf-2', sourceName: 'Perfil Ads 02', targetType: 'AD_ACCOUNT', targetId: '5', targetName: 'Conta Edu 05', relationship: 'opera', createdAt: '2025-02-15T10:00:00Z' },
  { id: 'dl-8', sourceType: 'PIXEL', sourceId: 'px-4', sourceName: 'Pixel Bloqueado Antigo', targetType: 'BUSINESS_MANAGER', targetId: 'bm-5', targetName: 'BM Misto Geral', relationship: 'pertence a', createdAt: '2025-04-01T10:00:00Z' },
  { id: 'dl-9', sourceType: 'AD_ACCOUNT', sourceId: '12', sourceName: 'Conta Fin 12', targetType: 'BUSINESS_MANAGER', targetId: 'bm-9', targetName: 'BM Bloqueada Antiga', relationship: 'vinculada a', createdAt: '2024-12-01T10:00:00Z' },
  { id: 'dl-10', sourceType: 'PROFILE', sourceId: 'pf-5', sourceName: 'Perfil Bloqueado 05', targetType: 'AD_ACCOUNT', targetId: '12', targetName: 'Conta Fin 12', relationship: 'operava', createdAt: '2024-12-01T10:00:00Z' },
  { id: 'dl-11', sourceType: 'PAGE', sourceId: 'pg-5', sourceName: 'Página Bloqueada Teste', targetType: 'BUSINESS_MANAGER', targetId: 'bm-5', targetName: 'BM Misto Geral', relationship: 'pertence a', createdAt: '2024-04-01T10:00:00Z' },
  { id: 'dl-12', sourceType: 'PROFILE', sourceId: 'pf-4', sourceName: 'Perfil Escala 04', targetType: 'PAGE', targetId: 'pg-5', targetName: 'Página Bloqueada Teste', relationship: 'gerencia', createdAt: '2024-05-01T10:00:00Z' },
];

const mockNodes: DiagnosticNode[] = [
  { id: '1', type: 'AD_ACCOUNT', name: 'Conta Ecomm 01', status: 'ACTIVE' },
  { id: '3', type: 'AD_ACCOUNT', name: 'Conta Saúde 03', status: 'DISABLED' },
  { id: '5', type: 'AD_ACCOUNT', name: 'Conta Edu 05', status: 'ROLLBACK' },
  { id: '7', type: 'AD_ACCOUNT', name: 'Conta Pet 07', status: 'DISABLED' },
  { id: '12', type: 'AD_ACCOUNT', name: 'Conta Fin 12', status: 'DISABLED' },
  { id: 'bm-1', type: 'BUSINESS_MANAGER', name: 'BM Principal Ads', status: 'ACTIVE' },
  { id: 'bm-3', type: 'BUSINESS_MANAGER', name: 'BM Pixels Central', status: 'ACTIVE' },
  { id: 'bm-5', type: 'BUSINESS_MANAGER', name: 'BM Misto Geral', status: 'BLOCKED' },
  { id: 'bm-9', type: 'BUSINESS_MANAGER', name: 'BM Bloqueada Antiga', status: 'BLOCKED' },
  { id: 'pf-1', type: 'PROFILE', name: 'Perfil Admin 01', status: 'ACTIVE' },
  { id: 'pf-2', type: 'PROFILE', name: 'Perfil Ads 02', status: 'ACTIVE' },
  { id: 'pf-3', type: 'PROFILE', name: 'Perfil Reserva 03', status: 'DISABLED' },
  { id: 'pf-4', type: 'PROFILE', name: 'Perfil Escala 04', status: 'ACTIVE' },
  { id: 'pf-5', type: 'PROFILE', name: 'Perfil Bloqueado 05', status: 'BLOCKED' },
  { id: 'pg-1', type: 'PAGE', name: 'Página Loja Premium', status: 'ACTIVE' },
  { id: 'pg-5', type: 'PAGE', name: 'Página Bloqueada Teste', status: 'BLOCKED' },
  { id: 'px-1', type: 'PIXEL', name: 'Pixel Principal', status: 'ACTIVE' },
  { id: 'px-4', type: 'PIXEL', name: 'Pixel Bloqueado Antigo', status: 'BLOCKED' },
];

export function getMockIncidents() { return [...mockIncidents]; }
export function setMockIncidents(i: Incident[]) { mockIncidents = i; }
export function getMockDiagnosticLinks() { return [...mockLinks]; }
export function setMockDiagnosticLinks(l: DiagnosticLink[]) { mockLinks = l; }
export function getMockDiagnosticNodes() { return [...mockNodes]; }
