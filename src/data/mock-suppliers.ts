import type { Supplier, Complaint } from '@/types/supplier';

let mockSuppliers: Supplier[] = [
  { id: 'sup1', name: 'DigitalAds BR', types: ['CONTAS', 'BMS'], status: 'ACTIVE', createdAt: '2025-01-10T10:00:00Z', updatedAt: '2025-03-01T10:00:00Z', totalAccounts: 12, totalProfiles: 0, totalBMs: 4, totalPages: 0, totalPixels: 0 },
  { id: 'sup2', name: 'MediaConnect', types: ['CONTAS', 'PERFIS', 'PAGINAS'], status: 'ACTIVE', createdAt: '2025-01-15T10:00:00Z', updatedAt: '2025-02-28T10:00:00Z', totalAccounts: 8, totalProfiles: 15, totalBMs: 0, totalPages: 6, totalPixels: 0 },
  { id: 'sup3', name: 'AdsPower Pro', types: ['CONTAS', 'PERFIS', 'PIXELS'], status: 'ACTIVE', createdAt: '2025-02-01T10:00:00Z', updatedAt: '2025-03-05T10:00:00Z', totalAccounts: 20, totalProfiles: 10, totalBMs: 0, totalPages: 0, totalPixels: 8 },
  { id: 'sup4', name: 'Social Reach', types: ['PERFIS', 'PAGINAS'], status: 'INACTIVE', createdAt: '2025-02-10T10:00:00Z', updatedAt: '2025-03-08T10:00:00Z', totalAccounts: 0, totalProfiles: 5, totalBMs: 0, totalPages: 3, totalPixels: 0 },
  { id: 'sup5', name: 'Cloud Accounts', types: ['CONTAS', 'BMS', 'PIXELS'], status: 'ACTIVE', createdAt: '2025-02-20T10:00:00Z', updatedAt: '2025-03-10T10:00:00Z', totalAccounts: 15, totalProfiles: 0, totalBMs: 6, totalPages: 0, totalPixels: 12 },
  { id: 'sup6', name: 'NetAds Solutions', types: ['CONTAS', 'PERFIS', 'BMS', 'PAGINAS', 'PIXELS'], status: 'ACTIVE', createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-03-12T10:00:00Z', totalAccounts: 25, totalProfiles: 18, totalBMs: 3, totalPages: 10, totalPixels: 5 },
];

let mockComplaints: Complaint[] = [
  { id: 'comp1', supplierId: 'sup1', supplierName: 'DigitalAds BR', assetType: 'CONTAS', description: 'Contas entregues com BMs já bloqueadas', priority: 'HIGH', status: 'OPEN', assigneeId: 'm1', assigneeName: 'Carlos Silva', attachments: [], createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-03-01T10:00:00Z', comments: [{ id: 'cc1', complaintId: 'comp1', authorId: 'm1', authorName: 'Carlos Silva', text: 'Já entrei em contato com o fornecedor.', attachments: [], createdAt: '2025-03-02T10:00:00Z' }] },
  { id: 'comp2', supplierId: 'sup2', supplierName: 'MediaConnect', assetType: 'PERFIS', description: 'Perfis com verificação incompleta, não passam no checkpoint', priority: 'URGENT', status: 'IN_PROGRESS', assigneeId: 'm2', assigneeName: 'Ana Oliveira', attachments: [], createdAt: '2025-03-03T10:00:00Z', updatedAt: '2025-03-05T10:00:00Z', comments: [] },
  { id: 'comp3', supplierId: 'sup3', supplierName: 'AdsPower Pro', assetType: 'PIXELS', description: 'Pixels configurados com domínio errado', priority: 'MEDIUM', status: 'RESOLVED', attachments: [], createdAt: '2025-02-20T10:00:00Z', updatedAt: '2025-03-01T10:00:00Z', comments: [{ id: 'cc2', complaintId: 'comp3', authorId: 'm3', authorName: 'Rafael Santos', text: 'Resolvido. Fornecedor corrigiu o domínio.', attachments: [], createdAt: '2025-03-01T10:00:00Z' }] },
  { id: 'comp4', supplierId: 'sup1', supplierName: 'DigitalAds BR', assetType: 'BMS', description: 'BMs com limite de gastos muito baixo', priority: 'LOW', status: 'OPEN', attachments: [], createdAt: '2025-03-05T10:00:00Z', updatedAt: '2025-03-05T10:00:00Z', comments: [] },
  { id: 'comp5', supplierId: 'sup5', supplierName: 'Cloud Accounts', assetType: 'CONTAS', description: 'Atraso na entrega de 10 contas', priority: 'HIGH', status: 'IN_PROGRESS', assigneeId: 'm1', assigneeName: 'Carlos Silva', attachments: [], createdAt: '2025-03-07T10:00:00Z', updatedAt: '2025-03-09T10:00:00Z', comments: [] },
  { id: 'comp6', supplierId: 'sup6', supplierName: 'NetAds Solutions', assetType: 'PAGINAS', description: 'Páginas entregues sem histórico de publicações', priority: 'MEDIUM', status: 'OPEN', attachments: [], createdAt: '2025-03-10T10:00:00Z', updatedAt: '2025-03-10T10:00:00Z', comments: [] },
  { id: 'comp7', supplierId: 'sup2', supplierName: 'MediaConnect', assetType: 'CONTAS', description: 'Contas bloqueadas em menos de 24h de uso', priority: 'URGENT', status: 'OPEN', assigneeId: 'm2', assigneeName: 'Ana Oliveira', attachments: [], createdAt: '2025-03-11T10:00:00Z', updatedAt: '2025-03-11T10:00:00Z', comments: [] },
  { id: 'comp8', supplierId: 'sup4', supplierName: 'Social Reach', assetType: 'PERFIS', description: 'Perfis com fotos de banco de imagem, detectados facilmente', priority: 'LOW', status: 'RESOLVED', attachments: [], createdAt: '2025-02-15T10:00:00Z', updatedAt: '2025-02-25T10:00:00Z', comments: [] },
];

export const getMockSuppliers = () => [...mockSuppliers];
export const setMockSuppliers = (s: Supplier[]) => { mockSuppliers = s; };
export const getMockComplaints = () => [...mockComplaints];
export const setMockComplaints = (c: Complaint[]) => { mockComplaints = c; };
