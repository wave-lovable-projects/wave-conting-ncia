import type { Pixel } from '@/types/pixel';

let mockPixels: Pixel[] = [
  { id: 'px-1', name: 'Pixel Principal', pixelId: '300400500601', bmId: 'bm-1', bmName: 'BM Principal Ads', supplierId: 's1', supplierName: 'Fornecedor Alpha', status: 'ACTIVE', domain: 'lojapremium.com', receivedAt: '2024-06-01', createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-11-01T10:00:00Z' },
  { id: 'px-2', name: 'Pixel Backup 01', pixelId: '300400500602', bmId: 'bm-2', bmName: 'BM Backup 01', supplierId: 's1', supplierName: 'Fornecedor Alpha', status: 'ACTIVE', domain: 'lojapremium.com', receivedAt: '2024-06-05', createdAt: '2024-06-05T10:00:00Z', updatedAt: '2024-10-20T10:00:00Z' },
  { id: 'px-3', name: 'Pixel Produto X', pixelId: '300400500603', bmId: 'bm-3', bmName: 'BM Pixels Central', supplierId: 's2', supplierName: 'Fornecedor Beta', status: 'ACTIVE', domain: 'produtox.com.br', receivedAt: '2024-07-01', createdAt: '2024-07-01T10:00:00Z', updatedAt: '2024-11-05T10:00:00Z' },
  { id: 'px-4', name: 'Pixel Bloqueado Antigo', pixelId: '300400500604', bmId: 'bm-5', bmName: 'BM Misto Geral', supplierId: 's3', supplierName: 'Fornecedor Gamma', status: 'BLOCKED', domain: 'ofertasdiarias.com', receivedAt: '2024-04-01', blockedAt: '2024-09-15', createdAt: '2024-04-01T10:00:00Z', updatedAt: '2024-09-15T10:00:00Z' },
  { id: 'px-5', name: 'Pixel E-commerce', pixelId: '300400500605', bmId: 'bm-6', bmName: 'BM Ads Escala', supplierId: 's2', supplierName: 'Fornecedor Beta', status: 'ACTIVE', domain: 'ecomplus.com', receivedAt: '2024-08-01', createdAt: '2024-08-01T10:00:00Z', updatedAt: '2024-11-10T10:00:00Z' },
  { id: 'px-6', name: 'Pixel Funil', pixelId: '300400500606', bmId: 'bm-8', bmName: 'BM Pixel Teste', supplierId: 's1', supplierName: 'Fornecedor Alpha', status: 'DISABLED', domain: 'funilvenda.com', receivedAt: '2024-05-15', notes: 'Desativado após troca de domínio', createdAt: '2024-05-15T10:00:00Z', updatedAt: '2024-08-20T10:00:00Z' },
  { id: 'px-7', name: 'Pixel Social Ads', pixelId: '300400500607', bmId: 'bm-10', bmName: 'BM Páginas Social', supplierId: 's3', supplierName: 'Fornecedor Gamma', status: 'ACTIVE', domain: 'socialads.com.br', receivedAt: '2024-09-01', createdAt: '2024-09-01T10:00:00Z', updatedAt: '2024-11-15T10:00:00Z' },
  { id: 'px-8', name: 'Pixel Landing Page', pixelId: '300400500608', bmId: 'bm-11', bmName: 'BM Misto Backup', supplierId: 's2', supplierName: 'Fornecedor Beta', status: 'ACTIVE', domain: 'landingconverter.com', receivedAt: '2024-10-01', createdAt: '2024-10-01T10:00:00Z', updatedAt: '2024-11-18T10:00:00Z' },
  { id: 'px-9', name: 'Pixel Teste AB', pixelId: '300400500609', supplierId: 's1', supplierName: 'Fornecedor Alpha', status: 'DISABLED', receivedAt: '2024-10-15', notes: 'Usado temporariamente para testes', createdAt: '2024-10-15T10:00:00Z', updatedAt: '2024-11-01T10:00:00Z' },
  { id: 'px-10', name: 'Pixel Remarketing', pixelId: '300400500610', bmId: 'bm-1', bmName: 'BM Principal Ads', supplierId: 's3', supplierName: 'Fornecedor Gamma', status: 'ACTIVE', domain: 'remarketing.lojapremium.com', receivedAt: '2024-11-01', createdAt: '2024-11-01T10:00:00Z', updatedAt: '2024-11-20T10:00:00Z' },
];

export function getMockPixels() { return mockPixels; }
export function setMockPixels(p: Pixel[]) { mockPixels = p; }
