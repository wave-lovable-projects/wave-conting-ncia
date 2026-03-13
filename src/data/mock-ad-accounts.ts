import type { AdAccount, AdAccountHistory, ManagerOption, SupplierOption } from '@/types/ad-account';

export const mockManagers: ManagerOption[] = [
  { id: 'm1', name: 'Carlos Silva' },
  { id: 'm2', name: 'Ana Oliveira' },
  { id: 'm3', name: 'Rafael Santos' },
  { id: 'm4', name: 'Juliana Costa' },
];

export const mockSuppliers: SupplierOption[] = [
  { id: 's1', name: 'DigitalAds BR' },
  { id: 's2', name: 'MediaConnect' },
  { id: 's3', name: 'AdsPower Pro' },
  { id: 's4', name: 'Social Reach' },
];

export const mockNiches = ['Ecommerce', 'Infoprodutos', 'Saúde', 'Finanças', 'Educação', 'Beleza', 'Pet', 'Tecnologia'];

export const mockSquads = [
  { id: 'sq1', name: 'Squad Alpha' },
  { id: 'sq2', name: 'Squad Beta' },
  { id: 'sq3', name: 'Squad Gamma' },
];

let mockAdAccounts: AdAccount[] = [
  { id: '1', name: 'Conta Ecomm 01', accountId: '1234567890', supplierId: 's1', supplierName: 'DigitalAds BR', bmId: 'bm1', bmName: 'BM Principal', niche: 'Ecommerce', product: 'Loja Virtual X', vsl: 'https://vsl.com/1', managerId: 'm1', managerName: 'Carlos Silva', accountStatus: 'ACTIVE', bmStatus: 'ACTIVE', balanceRemoved: false, paymentType: 'CREDIT', bank: 'Nubank', cardLast4: '4532', usageStatus: 'IN_USE', createdAt: '2025-01-15T10:00:00Z', updatedAt: '2025-03-01T14:00:00Z' },
  { id: '2', name: 'Conta Info 02', accountId: '2345678901', supplierId: 's2', supplierName: 'MediaConnect', bmId: 'bm2', bmName: 'BM Secundária', niche: 'Infoprodutos', product: 'Curso ABC', managerId: 'm1', managerName: 'Carlos Silva', accountStatus: 'ACTIVE', bmStatus: 'ACTIVE', balanceRemoved: false, paymentType: 'CREDIT', bank: 'Inter', cardLast4: '7821', usageStatus: 'IN_USE', createdAt: '2025-01-20T10:00:00Z', updatedAt: '2025-02-28T10:00:00Z' },
  { id: '3', name: 'Conta Saúde 03', accountId: '3456789012', supplierId: 's1', supplierName: 'DigitalAds BR', bmId: 'bm1', bmName: 'BM Principal', niche: 'Saúde', product: 'Suplemento Y', managerId: 'm2', managerName: 'Ana Oliveira', accountStatus: 'DISABLED', bmStatus: 'DISABLED', balanceRemoved: true, paymentType: 'DEBIT', bank: 'Bradesco', cardLast4: '1234', usageStatus: 'STANDBY', createdAt: '2025-02-01T10:00:00Z', updatedAt: '2025-03-05T10:00:00Z' },
  { id: '4', name: 'Conta Fin 04', accountId: '4567890123', supplierId: 's3', supplierName: 'AdsPower Pro', niche: 'Finanças', product: 'App Investimentos', managerId: 'm2', managerName: 'Ana Oliveira', accountStatus: 'ACTIVE', bmStatus: 'ACTIVE', balanceRemoved: false, paymentType: 'PIX', usageStatus: 'IN_USE', createdAt: '2025-02-10T10:00:00Z', updatedAt: '2025-03-08T10:00:00Z' },
  { id: '5', name: 'Conta Edu 05', accountId: '5678901234', supplierId: 's2', supplierName: 'MediaConnect', bmId: 'bm3', bmName: 'BM Edu', niche: 'Educação', product: 'Plataforma EAD', managerId: 'm3', managerName: 'Rafael Santos', accountStatus: 'ROLLBACK', bmStatus: 'BLOCKED', balanceRemoved: false, paymentType: 'BOLETO', usageStatus: 'STANDBY', createdAt: '2025-02-15T10:00:00Z', updatedAt: '2025-03-10T10:00:00Z' },
  { id: '6', name: 'Conta Beleza 06', accountId: '6789012345', supplierId: 's4', supplierName: 'Social Reach', bmId: 'bm2', bmName: 'BM Secundária', niche: 'Beleza', product: 'Cosméticos Z', managerId: 'm3', managerName: 'Rafael Santos', accountStatus: 'ACTIVE', bmStatus: 'ACTIVE', balanceRemoved: false, paymentType: 'CREDIT', bank: 'Itaú', cardLast4: '9876', usageStatus: 'IN_USE', createdAt: '2025-01-05T10:00:00Z', updatedAt: '2025-03-02T10:00:00Z' },
  { id: '7', name: 'Conta Pet 07', accountId: '7890123456', supplierId: 's1', supplierName: 'DigitalAds BR', niche: 'Pet', product: 'Ração Premium', managerId: 'm4', managerName: 'Juliana Costa', accountStatus: 'DISABLED', bmStatus: 'DISABLED', balanceRemoved: true, paymentType: 'CREDIT', bank: 'C6', cardLast4: '5555', usageStatus: 'RETIRED', createdAt: '2024-11-10T10:00:00Z', updatedAt: '2025-02-20T10:00:00Z' },
  { id: '8', name: 'Conta Tech 08', accountId: '8901234567', supplierId: 's3', supplierName: 'AdsPower Pro', bmId: 'bm1', bmName: 'BM Principal', niche: 'Tecnologia', product: 'SaaS Tool', managerId: 'm4', managerName: 'Juliana Costa', accountStatus: 'ACTIVE', bmStatus: 'ACTIVE', balanceRemoved: false, paymentType: 'PIX', usageStatus: 'IN_USE', createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-03-12T10:00:00Z' },
  { id: '9', name: 'Conta Ecomm 09', accountId: '9012345678', supplierId: 's4', supplierName: 'Social Reach', bmId: 'bm3', bmName: 'BM Edu', niche: 'Ecommerce', product: 'Dropshipping W', managerId: 'm1', managerName: 'Carlos Silva', accountStatus: 'ACTIVE', balanceRemoved: false, paymentType: 'CREDIT', bank: 'Nubank', cardLast4: '3333', usageStatus: 'IN_USE', createdAt: '2025-02-20T10:00:00Z', updatedAt: '2025-03-11T10:00:00Z' },
  { id: '10', name: 'Conta Info 10', accountId: '0123456789', supplierId: 's2', supplierName: 'MediaConnect', niche: 'Infoprodutos', product: 'Mentoria VIP', managerId: 'm2', managerName: 'Ana Oliveira', accountStatus: 'ROLLBACK', bmStatus: 'ACTIVE', balanceRemoved: false, paymentType: 'BOLETO', usageStatus: 'STANDBY', createdAt: '2025-01-25T10:00:00Z', updatedAt: '2025-03-09T10:00:00Z' },
  { id: '11', name: 'Conta Saúde 11', accountId: '1122334455', supplierId: 's1', supplierName: 'DigitalAds BR', bmId: 'bm2', bmName: 'BM Secundária', niche: 'Saúde', product: 'Clínica Online', managerId: 'm3', managerName: 'Rafael Santos', accountStatus: 'ACTIVE', bmStatus: 'ACTIVE', balanceRemoved: false, paymentType: 'CREDIT', bank: 'Santander', cardLast4: '7777', usageStatus: 'IN_USE', createdAt: '2025-03-05T10:00:00Z', updatedAt: '2025-03-12T10:00:00Z' },
  { id: '12', name: 'Conta Fin 12', accountId: '2233445566', supplierId: 's3', supplierName: 'AdsPower Pro', niche: 'Finanças', product: 'Carteira Digital', managerId: 'm1', managerName: 'Carlos Silva', accountStatus: 'DISABLED', bmStatus: 'BLOCKED', balanceRemoved: true, paymentType: 'DEBIT', bank: 'BB', cardLast4: '1111', usageStatus: 'RETIRED', createdAt: '2024-12-01T10:00:00Z', updatedAt: '2025-03-01T10:00:00Z' },
  { id: '13', name: 'Conta Edu 13', accountId: '3344556677', supplierId: 's4', supplierName: 'Social Reach', bmId: 'bm1', bmName: 'BM Principal', niche: 'Educação', product: 'Escola Online', managerId: 'm4', managerName: 'Juliana Costa', accountStatus: 'ACTIVE', bmStatus: 'ACTIVE', balanceRemoved: false, paymentType: 'PIX', usageStatus: 'IN_USE', createdAt: '2025-02-28T10:00:00Z', updatedAt: '2025-03-12T10:00:00Z' },
  { id: '14', name: 'Conta Beleza 14', accountId: '4455667788', supplierId: 's2', supplierName: 'MediaConnect', niche: 'Beleza', product: 'Skincare Line', managerId: 'm2', managerName: 'Ana Oliveira', accountStatus: 'ACTIVE', bmStatus: 'ACTIVE', balanceRemoved: false, paymentType: 'CREDIT', bank: 'Inter', cardLast4: '2222', usageStatus: 'STANDBY', createdAt: '2025-03-08T10:00:00Z', updatedAt: '2025-03-12T10:00:00Z' },
  { id: '15', name: 'Conta Tech 15', accountId: '5566778899', supplierId: 's1', supplierName: 'DigitalAds BR', bmId: 'bm3', bmName: 'BM Edu', niche: 'Tecnologia', product: 'App Mobile', managerId: 'm3', managerName: 'Rafael Santos', accountStatus: 'DISABLED', balanceRemoved: false, paymentType: 'CREDIT', bank: 'Nubank', cardLast4: '8888', usageStatus: 'STANDBY', createdAt: '2025-01-10T10:00:00Z', updatedAt: '2025-02-15T10:00:00Z' },
  { id: '16', name: 'Conta Pet 16', accountId: '6677889900', supplierId: 's3', supplierName: 'AdsPower Pro', bmId: 'bm2', bmName: 'BM Secundária', niche: 'Pet', product: 'Pet Shop Online', managerId: 'm4', managerName: 'Juliana Costa', accountStatus: 'ACTIVE', bmStatus: 'ACTIVE', balanceRemoved: false, paymentType: 'BOLETO', usageStatus: 'IN_USE', createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-03-12T10:00:00Z' },
  { id: '17', name: 'Conta Ecomm 17', accountId: '7788990011', supplierId: 's4', supplierName: 'Social Reach', niche: 'Ecommerce', product: 'Marketplace', managerId: 'm1', managerName: 'Carlos Silva', accountStatus: 'ROLLBACK', bmStatus: 'DISABLED', balanceRemoved: false, paymentType: 'CREDIT', bank: 'Itaú', cardLast4: '4444', usageStatus: 'STANDBY', createdAt: '2025-02-05T10:00:00Z', updatedAt: '2025-03-10T10:00:00Z' },
  { id: '18', name: 'Conta Info 18', accountId: '8899001122', supplierId: 's1', supplierName: 'DigitalAds BR', bmId: 'bm1', bmName: 'BM Principal', niche: 'Infoprodutos', product: 'Ebook Premium', managerId: 'm2', managerName: 'Ana Oliveira', accountStatus: 'ACTIVE', bmStatus: 'ACTIVE', balanceRemoved: false, paymentType: 'PIX', usageStatus: 'IN_USE', createdAt: '2025-03-10T10:00:00Z', updatedAt: '2025-03-12T10:00:00Z' },
  { id: '19', name: 'Conta Saúde 19', accountId: '9900112233', supplierId: 's2', supplierName: 'MediaConnect', bmId: 'bm2', bmName: 'BM Secundária', niche: 'Saúde', product: 'Telemedicina', managerId: 'm3', managerName: 'Rafael Santos', accountStatus: 'ACTIVE', bmStatus: 'ACTIVE', balanceRemoved: false, paymentType: 'CREDIT', bank: 'Bradesco', cardLast4: '6666', usageStatus: 'IN_USE', createdAt: '2025-03-11T10:00:00Z', updatedAt: '2025-03-12T10:00:00Z' },
  { id: '20', name: 'Conta Fin 20', accountId: '0011223344', supplierId: 's3', supplierName: 'AdsPower Pro', niche: 'Finanças', product: 'Consultoria', managerId: 'm4', managerName: 'Juliana Costa', accountStatus: 'DISABLED', bmStatus: 'BLOCKED', balanceRemoved: true, paymentType: 'DEBIT', bank: 'Caixa', cardLast4: '9999', usageStatus: 'RETIRED', createdAt: '2024-10-01T10:00:00Z', updatedAt: '2025-01-15T10:00:00Z' },
];

export const mockHistory: AdAccountHistory[] = [
  { id: 'h1', field: 'accountStatus', oldValue: 'ACTIVE', newValue: 'DISABLED', changedByName: 'Carlos Silva', createdAt: '2025-03-05T14:30:00Z' },
  { id: 'h2', field: 'accountStatus', oldValue: 'DISABLED', newValue: 'ROLLBACK', changedByName: 'Ana Oliveira', createdAt: '2025-03-06T09:15:00Z' },
  { id: 'h3', field: 'bmStatus', oldValue: 'ACTIVE', newValue: 'BLOCKED', changedByName: 'Rafael Santos', createdAt: '2025-03-07T16:45:00Z' },
  { id: 'h4', field: 'accountStatus', oldValue: 'ROLLBACK', newValue: 'ACTIVE', changedByName: 'Juliana Costa', createdAt: '2025-03-08T11:00:00Z' },
  { id: 'h5', field: 'usageStatus', oldValue: 'IN_USE', newValue: 'STANDBY', changedByName: 'Carlos Silva', createdAt: '2025-03-09T08:20:00Z' },
  { id: 'h6', field: 'bmStatus', oldValue: 'BLOCKED', newValue: 'ACTIVE', changedByName: 'Ana Oliveira', createdAt: '2025-03-10T13:00:00Z' },
];

export function getMockAdAccounts() { return [...mockAdAccounts]; }

export function setMockAdAccounts(accounts: AdAccount[]) { mockAdAccounts = accounts; }

export function getMockHistory(_accountId: string, field?: string) {
  if (field) return mockHistory.filter(h => h.field === field);
  return mockHistory;
}
