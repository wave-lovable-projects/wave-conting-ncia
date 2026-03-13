import type { BusinessManager } from '@/types/business-manager';

let mockBMs: BusinessManager[] = [
  { id: 'bm-1', name: 'BM Principal Ads', bmId: '100200300401', function: 'Anúncios', status: 'ACTIVE', supplierId: 's1', supplierName: 'Fornecedor Alpha', receivedAt: '2024-06-01', gestores: [{ id: 'u1', name: 'João Silva' }, { id: 'u2', name: 'Maria Souza' }], createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-11-01T10:00:00Z' },
  { id: 'bm-2', name: 'BM Backup 01', bmId: '100200300402', function: 'Backup', status: 'ACTIVE', supplierId: 's1', supplierName: 'Fornecedor Alpha', receivedAt: '2024-06-10', gestores: [{ id: 'u1', name: 'João Silva' }], createdAt: '2024-06-10T10:00:00Z', updatedAt: '2024-11-01T10:00:00Z' },
  { id: 'bm-3', name: 'BM Pixels Central', bmId: '100200300403', function: 'Pixels', status: 'ACTIVE', supplierId: 's2', supplierName: 'Fornecedor Beta', receivedAt: '2024-07-01', gestores: [{ id: 'u2', name: 'Maria Souza' }], createdAt: '2024-07-01T10:00:00Z', updatedAt: '2024-10-15T10:00:00Z' },
  { id: 'bm-4', name: 'BM Páginas Loja', bmId: '100200300404', function: 'Páginas', status: 'DISABLED', supplierId: 's2', supplierName: 'Fornecedor Beta', receivedAt: '2024-05-15', gestores: [{ id: 'u3', name: 'Carlos Lima' }], createdAt: '2024-05-15T10:00:00Z', updatedAt: '2024-09-01T10:00:00Z' },
  { id: 'bm-5', name: 'BM Misto Geral', bmId: '100200300405', function: 'Misto', status: 'BLOCKED', supplierId: 's3', supplierName: 'Fornecedor Gamma', receivedAt: '2024-04-01', blockedAt: '2024-10-20', gestores: [{ id: 'u1', name: 'João Silva' }, { id: 'u3', name: 'Carlos Lima' }], createdAt: '2024-04-01T10:00:00Z', updatedAt: '2024-10-20T10:00:00Z' },
  { id: 'bm-6', name: 'BM Ads Escala', bmId: '100200300406', function: 'Anúncios', status: 'ACTIVE', supplierId: 's1', supplierName: 'Fornecedor Alpha', receivedAt: '2024-08-01', gestores: [{ id: 'u2', name: 'Maria Souza' }], createdAt: '2024-08-01T10:00:00Z', updatedAt: '2024-11-05T10:00:00Z' },
  { id: 'bm-7', name: 'BM Reserva', bmId: '100200300407', function: 'Backup', status: 'DISABLED', supplierId: 's3', supplierName: 'Fornecedor Gamma', receivedAt: '2024-03-15', gestores: [], createdAt: '2024-03-15T10:00:00Z', updatedAt: '2024-08-01T10:00:00Z' },
  { id: 'bm-8', name: 'BM Pixel Teste', bmId: '100200300408', function: 'Pixels', status: 'ACTIVE', supplierId: 's2', supplierName: 'Fornecedor Beta', receivedAt: '2024-09-01', gestores: [{ id: 'u1', name: 'João Silva' }], createdAt: '2024-09-01T10:00:00Z', updatedAt: '2024-11-10T10:00:00Z' },
  { id: 'bm-9', name: 'BM Bloqueada Antiga', bmId: '100200300409', function: 'Anúncios', status: 'BLOCKED', supplierId: 's1', supplierName: 'Fornecedor Alpha', receivedAt: '2024-02-01', blockedAt: '2024-07-15', gestores: [{ id: 'u3', name: 'Carlos Lima' }], createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-07-15T10:00:00Z' },
  { id: 'bm-10', name: 'BM Páginas Social', bmId: '100200300410', function: 'Páginas', status: 'ACTIVE', supplierId: 's3', supplierName: 'Fornecedor Gamma', receivedAt: '2024-10-01', gestores: [{ id: 'u2', name: 'Maria Souza' }, { id: 'u3', name: 'Carlos Lima' }], createdAt: '2024-10-01T10:00:00Z', updatedAt: '2024-11-12T10:00:00Z' },
  { id: 'bm-11', name: 'BM Misto Backup', bmId: '100200300411', function: 'Misto', status: 'ACTIVE', supplierId: 's2', supplierName: 'Fornecedor Beta', receivedAt: '2024-10-15', gestores: [{ id: 'u1', name: 'João Silva' }], createdAt: '2024-10-15T10:00:00Z', updatedAt: '2024-11-15T10:00:00Z' },
  { id: 'bm-12', name: 'BM Desativada Recente', bmId: '100200300412', function: 'Anúncios', status: 'DISABLED', supplierId: 's1', supplierName: 'Fornecedor Alpha', receivedAt: '2024-09-20', gestores: [{ id: 'u2', name: 'Maria Souza' }], createdAt: '2024-09-20T10:00:00Z', updatedAt: '2024-11-18T10:00:00Z' },
];

export const bmFunctions = ['Anúncios', 'Backup', 'Pixels', 'Páginas', 'Misto'];

export function getMockBMs() { return mockBMs; }
export function setMockBMs(bms: BusinessManager[]) { mockBMs = bms; }
