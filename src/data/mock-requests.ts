import type { Request } from '@/types/request';

let mockRequests: Request[] = [
  {
    id: 'req1', title: 'Solicitar 5 contas de anúncio nicho Saúde', description: 'Precisamos de 5 contas novas para a campanha de saúde do squad Alpha',
    assetType: 'CONTA_ANUNCIO', priority: 'HIGH', status: 'PENDENTE', quantity: 5, quantityDelivered: 0, linkedAssetIds: [],
    requesterId: 'u2', requesterName: 'Carlos Silva', dueDate: '2025-03-20T00:00:00Z',
    attachments: [], createdAt: '2025-03-10T10:00:00Z', updatedAt: '2025-03-10T10:00:00Z', statusHistory: [], comments: [],
    specifications: { nicho: 'Saúde', moeda: 'BRL', proxy: 'BR Residencial' },
  },
  {
    id: 'req2', title: 'BM nova para squad Beta', description: 'Squad Beta precisa de uma BM exclusiva para isolar campanhas',
    assetType: 'BUSINESS_MANAGER', priority: 'MEDIUM', status: 'APROVADA', quantity: 1, quantityDelivered: 0, linkedAssetIds: [],
    requesterId: 'u3', requesterName: 'Ana Oliveira', dueDate: '2025-03-18T00:00:00Z',
    attachments: [], createdAt: '2025-03-08T10:00:00Z', updatedAt: '2025-03-12T10:00:00Z',
    statusHistory: [{ id: 'sh1', fromStatus: 'PENDENTE', toStatus: 'APROVADA', changedBy: 'Admin Wave', changedAt: '2025-03-12T10:00:00Z' }],
    comments: [{ id: 'rc1', requestId: 'req2', authorId: 'u1', authorName: 'Admin Wave', text: 'Aprovada. Vou solicitar ao fornecedor.', attachments: [], createdAt: '2025-03-12T14:00:00Z' }],
    specifications: { limite_diario: '$250' },
  },
  {
    id: 'req3', title: '10 perfis para aquecimento squad Alpha', description: 'Perfis para iniciar aquecimento no squad Alpha',
    assetType: 'PERFIL', priority: 'HIGH', status: 'SOLICITADA_FORNECEDOR', quantity: 10, quantityDelivered: 0, linkedAssetIds: [],
    requesterId: 'u4', requesterName: 'Rafael Santos',
    supplierId: 's1', supplierName: 'ProfileStore BR', supplierOrderId: 'PS-2025-0342', supplierOrderDate: '2025-03-07T10:00:00Z', supplierExpectedDate: '2025-03-12T00:00:00Z', supplierCost: 350,
    attachments: [], createdAt: '2025-03-05T10:00:00Z', updatedAt: '2025-03-07T10:00:00Z',
    statusHistory: [
      { id: 'sh2', fromStatus: 'PENDENTE', toStatus: 'APROVADA', changedBy: 'Admin Wave', changedAt: '2025-03-06T10:00:00Z' },
      { id: 'sh3', fromStatus: 'APROVADA', toStatus: 'SOLICITADA_FORNECEDOR', changedBy: 'Admin Wave', changedAt: '2025-03-07T10:00:00Z' },
    ],
    comments: [], specifications: { tipo_perfil: 'Aged 2y+', proxy: 'BR Residencial' },
  },
  {
    id: 'req4', title: 'Recarga de saldo $500 squad Alpha', description: 'Conta principal do squad Alpha precisa de recarga',
    assetType: 'SALDO', priority: 'URGENT', status: 'PENDENTE', quantity: 1, quantityDelivered: 0, linkedAssetIds: [],
    requesterId: 'u2', requesterName: 'Carlos Silva', dueDate: '2025-03-14T00:00:00Z',
    attachments: [], createdAt: '2025-03-12T10:00:00Z', updatedAt: '2025-03-12T10:00:00Z', statusHistory: [], comments: [],
    specifications: { valor: '$500', conta_id: '1234567890' },
  },
  {
    id: 'req5', title: '3 contas de anúncio recebidas do fornecedor', description: 'Contas chegaram e precisam entrar em aquecimento',
    assetType: 'CONTA_ANUNCIO', priority: 'HIGH', status: 'RECEBIDA', quantity: 3, quantityDelivered: 0, linkedAssetIds: [],
    requesterId: 'u3', requesterName: 'Ana Oliveira',
    supplierId: 's2', supplierName: 'AdAccounts Pro', supplierOrderId: 'AAP-0087', supplierOrderDate: '2025-03-03T10:00:00Z', supplierExpectedDate: '2025-03-10T00:00:00Z', supplierReceivedDate: '2025-03-09T14:00:00Z', supplierCost: 180,
    attachments: [], createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-03-09T14:00:00Z',
    statusHistory: [
      { id: 'sh4', fromStatus: 'PENDENTE', toStatus: 'APROVADA', changedBy: 'Admin Wave', changedAt: '2025-03-02T10:00:00Z' },
      { id: 'sh5', fromStatus: 'APROVADA', toStatus: 'SOLICITADA_FORNECEDOR', changedBy: 'Admin Wave', changedAt: '2025-03-03T10:00:00Z' },
      { id: 'sh6', fromStatus: 'SOLICITADA_FORNECEDOR', toStatus: 'RECEBIDA', changedBy: 'Admin Wave', changedAt: '2025-03-09T14:00:00Z' },
    ],
    comments: [], specifications: { nicho: 'Finanças', moeda: 'USD' },
  },
  {
    id: 'req6', title: '5 perfis em aquecimento', description: 'Perfis recebidos do fornecedor, agora em fase de aquecimento',
    assetType: 'PERFIL', priority: 'MEDIUM', status: 'EM_AQUECIMENTO', quantity: 5, quantityDelivered: 0, linkedAssetIds: [],
    requesterId: 'u5', requesterName: 'Juliana Costa',
    supplierId: 's1', supplierName: 'ProfileStore BR', supplierOrderId: 'PS-2025-0310', supplierOrderDate: '2025-02-25T10:00:00Z', supplierReceivedDate: '2025-03-02T10:00:00Z', supplierCost: 175,
    warmingStartDate: '2025-03-03T08:00:00Z', warmingEndDate: '2025-03-10T08:00:00Z',
    attachments: [], createdAt: '2025-02-23T10:00:00Z', updatedAt: '2025-03-03T08:00:00Z',
    statusHistory: [
      { id: 'sh7', fromStatus: 'PENDENTE', toStatus: 'APROVADA', changedBy: 'Admin Wave', changedAt: '2025-02-24T10:00:00Z' },
      { id: 'sh8', fromStatus: 'APROVADA', toStatus: 'SOLICITADA_FORNECEDOR', changedBy: 'Admin Wave', changedAt: '2025-02-25T10:00:00Z' },
      { id: 'sh9', fromStatus: 'SOLICITADA_FORNECEDOR', toStatus: 'RECEBIDA', changedBy: 'Admin Wave', changedAt: '2025-03-02T10:00:00Z' },
      { id: 'sh10', fromStatus: 'RECEBIDA', toStatus: 'EM_AQUECIMENTO', changedBy: 'Admin Wave', changedAt: '2025-03-03T08:00:00Z' },
    ],
    comments: [], specifications: { tipo_perfil: 'Novo', proxy: 'US Datacenter' },
  },
  {
    id: 'req7', title: '2 BMs prontas para entrega', description: 'BMs já passaram pela fase de aquecimento e estão prontas',
    assetType: 'BUSINESS_MANAGER', priority: 'LOW', status: 'PRONTA', quantity: 2, quantityDelivered: 0, linkedAssetIds: ['bm-101', 'bm-102'],
    requesterId: 'u4', requesterName: 'Rafael Santos',
    supplierId: 's3', supplierName: 'BMFactory', supplierOrderId: 'BMF-445', supplierCost: 240,
    warmingStartDate: '2025-02-28T08:00:00Z', warmingEndDate: '2025-03-08T08:00:00Z',
    attachments: [], createdAt: '2025-02-20T10:00:00Z', updatedAt: '2025-03-08T08:00:00Z',
    statusHistory: [
      { id: 'sh11', fromStatus: 'PENDENTE', toStatus: 'APROVADA', changedBy: 'Admin Wave', changedAt: '2025-02-21T10:00:00Z' },
      { id: 'sh12', fromStatus: 'APROVADA', toStatus: 'SOLICITADA_FORNECEDOR', changedBy: 'Admin Wave', changedAt: '2025-02-22T10:00:00Z' },
      { id: 'sh13', fromStatus: 'SOLICITADA_FORNECEDOR', toStatus: 'RECEBIDA', changedBy: 'Admin Wave', changedAt: '2025-02-27T10:00:00Z' },
      { id: 'sh14', fromStatus: 'RECEBIDA', toStatus: 'EM_AQUECIMENTO', changedBy: 'Admin Wave', changedAt: '2025-02-28T08:00:00Z' },
      { id: 'sh15', fromStatus: 'EM_AQUECIMENTO', toStatus: 'PRONTA', changedBy: 'Admin Wave', changedAt: '2025-03-08T08:00:00Z' },
    ],
    comments: [], specifications: { limite_diario: '$500' },
  },
  {
    id: 'req8', title: '8 contas entregues ao squad Gamma', description: 'Contas de anúncio entregues e operacionais',
    assetType: 'CONTA_ANUNCIO', priority: 'HIGH', status: 'ENTREGUE', quantity: 8, quantityDelivered: 8, linkedAssetIds: ['ca-201', 'ca-202', 'ca-203', 'ca-204', 'ca-205', 'ca-206', 'ca-207', 'ca-208'],
    requesterId: 'u2', requesterName: 'Carlos Silva',
    supplierId: 's2', supplierName: 'AdAccounts Pro', supplierOrderId: 'AAP-0072', supplierCost: 480,
    warmingStartDate: '2025-02-15T08:00:00Z', warmingEndDate: '2025-02-25T08:00:00Z',
    deliveredAt: '2025-02-26T10:00:00Z',
    attachments: [], createdAt: '2025-02-05T10:00:00Z', updatedAt: '2025-02-26T10:00:00Z',
    statusHistory: [
      { id: 'sh16', fromStatus: 'PENDENTE', toStatus: 'APROVADA', changedBy: 'Admin Wave', changedAt: '2025-02-06T10:00:00Z' },
      { id: 'sh17', fromStatus: 'APROVADA', toStatus: 'SOLICITADA_FORNECEDOR', changedBy: 'Admin Wave', changedAt: '2025-02-07T10:00:00Z' },
      { id: 'sh18', fromStatus: 'SOLICITADA_FORNECEDOR', toStatus: 'RECEBIDA', changedBy: 'Admin Wave', changedAt: '2025-02-14T10:00:00Z' },
      { id: 'sh19', fromStatus: 'RECEBIDA', toStatus: 'EM_AQUECIMENTO', changedBy: 'Admin Wave', changedAt: '2025-02-15T08:00:00Z' },
      { id: 'sh20', fromStatus: 'EM_AQUECIMENTO', toStatus: 'PRONTA', changedBy: 'Admin Wave', changedAt: '2025-02-25T08:00:00Z' },
      { id: 'sh21', fromStatus: 'PRONTA', toStatus: 'ENTREGUE', changedBy: 'Admin Wave', changedAt: '2025-02-26T10:00:00Z' },
    ],
    comments: [], specifications: { nicho: 'E-commerce', moeda: 'BRL', proxy: 'BR Residencial' },
  },
  {
    id: 'req9', title: 'Recarga de saldo concluída', description: 'Saldo adicionado na conta do squad Beta',
    assetType: 'SALDO', priority: 'URGENT', status: 'ENTREGUE', quantity: 1, quantityDelivered: 1, linkedAssetIds: [],
    requesterId: 'u3', requesterName: 'Ana Oliveira',
    deliveredAt: '2025-03-07T18:00:00Z',
    attachments: [], createdAt: '2025-03-07T10:00:00Z', updatedAt: '2025-03-07T18:00:00Z',
    statusHistory: [
      { id: 'sh22', fromStatus: 'PENDENTE', toStatus: 'APROVADA', changedBy: 'Admin Wave', changedAt: '2025-03-07T11:00:00Z' },
      { id: 'sh23', fromStatus: 'APROVADA', toStatus: 'ENTREGUE', changedBy: 'Admin Wave', changedAt: '2025-03-07T18:00:00Z' },
    ],
    comments: [], specifications: { valor: '$1000', conta_id: '9876543210' },
  },
  {
    id: 'req10', title: 'Pixel para LP produto Z', description: 'Pixel precisa ser criado e configurado para nova landing page',
    assetType: 'PAGINA', priority: 'MEDIUM', status: 'APROVADA', quantity: 1, quantityDelivered: 0, linkedAssetIds: [],
    requesterId: 'u5', requesterName: 'Juliana Costa', dueDate: '2025-03-16T00:00:00Z',
    attachments: [], createdAt: '2025-03-10T10:00:00Z', updatedAt: '2025-03-13T10:00:00Z',
    statusHistory: [{ id: 'sh24', fromStatus: 'PENDENTE', toStatus: 'APROVADA', changedBy: 'Admin Wave', changedAt: '2025-03-13T10:00:00Z' }],
    comments: [], specifications: { dominio: 'produtoz.com', tipo_evento: 'Purchase + Lead' },
  },
  {
    id: 'req11', title: '3 páginas para campanha Verão', description: 'Páginas do Facebook necessárias para nova campanha',
    assetType: 'PAGINA', priority: 'LOW', status: 'ENTREGUE', quantity: 3, quantityDelivered: 3, linkedAssetIds: ['pg-301', 'pg-302', 'pg-303'],
    requesterId: 'u6', requesterName: 'Mariana Lima',
    deliveredAt: '2025-03-04T10:00:00Z',
    attachments: [], createdAt: '2025-03-02T10:00:00Z', updatedAt: '2025-03-04T10:00:00Z',
    statusHistory: [
      { id: 'sh25', fromStatus: 'PENDENTE', toStatus: 'APROVADA', changedBy: 'Admin Wave', changedAt: '2025-03-03T10:00:00Z' },
      { id: 'sh26', fromStatus: 'APROVADA', toStatus: 'ENTREGUE', changedBy: 'Admin Wave', changedAt: '2025-03-04T10:00:00Z' },
    ],
    comments: [], specifications: { nicho: 'Beleza', nome_pagina: 'Beleza Natural BR' },
  },
  {
    id: 'req12', title: 'Substituir 3 contas bloqueadas urgente', description: 'Contas foram bloqueadas e precisamos de substitutas com urgência',
    assetType: 'CONTA_ANUNCIO', priority: 'URGENT', status: 'SOLICITADA_FORNECEDOR', quantity: 3, quantityDelivered: 0, linkedAssetIds: [],
    requesterId: 'u2', requesterName: 'Carlos Silva', dueDate: '2025-03-15T00:00:00Z',
    supplierId: 's2', supplierName: 'AdAccounts Pro', supplierOrderId: 'AAP-0095', supplierOrderDate: '2025-03-13T14:00:00Z', supplierExpectedDate: '2025-03-15T00:00:00Z', supplierCost: 180,
    attachments: [], createdAt: '2025-03-13T10:00:00Z', updatedAt: '2025-03-13T14:00:00Z',
    statusHistory: [
      { id: 'sh27', fromStatus: 'PENDENTE', toStatus: 'APROVADA', changedBy: 'Admin Wave', changedAt: '2025-03-13T12:00:00Z' },
      { id: 'sh28', fromStatus: 'APROVADA', toStatus: 'SOLICITADA_FORNECEDOR', changedBy: 'Admin Wave', changedAt: '2025-03-13T14:00:00Z' },
    ],
    comments: [], specifications: { nicho: 'Finanças', moeda: 'USD', motivo: 'Bloqueio por policy' },
  },
  {
    id: 'req13', title: 'Solicitação de perfis rejeitada', description: 'Sem orçamento disponível para perfis neste mês',
    assetType: 'PERFIL', priority: 'MEDIUM', status: 'REJEITADA', quantity: 10, quantityDelivered: 0, linkedAssetIds: [],
    requesterId: 'u5', requesterName: 'Juliana Costa',
    attachments: [], createdAt: '2025-03-04T10:00:00Z', updatedAt: '2025-03-09T10:00:00Z',
    statusHistory: [{ id: 'sh29', fromStatus: 'PENDENTE', toStatus: 'REJEITADA', changedBy: 'Admin Wave', changedAt: '2025-03-09T10:00:00Z' }],
    comments: [{ id: 'rc2', requestId: 'req13', authorId: 'u1', authorName: 'Admin Wave', text: 'Orçamento do mês já atingiu o limite. Reabrir em abril.', attachments: [], createdAt: '2025-03-09T10:00:00Z' }],
  },
  {
    id: 'req14', title: 'Pedido misto: contas + perfis + BM', description: 'Kit completo para novo gestor que está entrando na operação',
    assetType: 'CONTA_ANUNCIO', priority: 'HIGH', status: 'RECEBIDA', quantity: 6, quantityDelivered: 0, linkedAssetIds: [],
    requesterId: 'u4', requesterName: 'Rafael Santos',
    supplierId: 's2', supplierName: 'AdAccounts Pro', supplierOrderId: 'AAP-0090', supplierOrderDate: '2025-03-05T10:00:00Z', supplierReceivedDate: '2025-03-11T10:00:00Z', supplierCost: 520,
    attachments: [], createdAt: '2025-03-03T10:00:00Z', updatedAt: '2025-03-11T10:00:00Z',
    statusHistory: [
      { id: 'sh30', fromStatus: 'PENDENTE', toStatus: 'APROVADA', changedBy: 'Admin Wave', changedAt: '2025-03-04T10:00:00Z' },
      { id: 'sh31', fromStatus: 'APROVADA', toStatus: 'SOLICITADA_FORNECEDOR', changedBy: 'Admin Wave', changedAt: '2025-03-05T10:00:00Z' },
      { id: 'sh32', fromStatus: 'SOLICITADA_FORNECEDOR', toStatus: 'RECEBIDA', changedBy: 'Admin Wave', changedAt: '2025-03-11T10:00:00Z' },
    ],
    comments: [], specifications: { descricao: '2 contas + 3 perfis + 1 BM', nicho: 'Educação' },
  },
  {
    id: 'req15', title: 'Campanha cancelada - devolver contas', description: 'Cliente cancelou a campanha, contas não são mais necessárias',
    assetType: 'CONTA_ANUNCIO', priority: 'LOW', status: 'CANCELADA', quantity: 4, quantityDelivered: 0, linkedAssetIds: [],
    requesterId: 'u6', requesterName: 'Mariana Lima',
    attachments: [], createdAt: '2025-03-06T10:00:00Z', updatedAt: '2025-03-08T10:00:00Z',
    statusHistory: [
      { id: 'sh33', fromStatus: 'PENDENTE', toStatus: 'APROVADA', changedBy: 'Admin Wave', changedAt: '2025-03-07T10:00:00Z' },
      { id: 'sh34', fromStatus: 'APROVADA', toStatus: 'CANCELADA', changedBy: 'Mariana Lima', changedAt: '2025-03-08T10:00:00Z' },
    ],
    comments: [{ id: 'rc3', requestId: 'req15', authorId: 'u6', authorName: 'Mariana Lima', text: 'Cliente desistiu do projeto. Cancelar solicitação.', attachments: [], createdAt: '2025-03-08T10:00:00Z' }],
  },
  {
    id: 'req16', title: '2 pixels para domínios novos', description: 'Pixels para os novos domínios da campanha de e-commerce',
    assetType: 'PERFIL', priority: 'MEDIUM', status: 'EM_AQUECIMENTO', quantity: 2, quantityDelivered: 0, linkedAssetIds: [],
    requesterId: 'u2', requesterName: 'Carlos Silva',
    warmingStartDate: '2025-03-10T08:00:00Z', warmingEndDate: '2025-03-17T08:00:00Z',
    attachments: [], createdAt: '2025-03-08T10:00:00Z', updatedAt: '2025-03-10T08:00:00Z',
    statusHistory: [
      { id: 'sh35', fromStatus: 'PENDENTE', toStatus: 'APROVADA', changedBy: 'Admin Wave', changedAt: '2025-03-09T10:00:00Z' },
      { id: 'sh36', fromStatus: 'APROVADA', toStatus: 'EM_AQUECIMENTO', changedBy: 'Admin Wave', changedAt: '2025-03-10T08:00:00Z' },
    ],
    comments: [], specifications: { dominio_1: 'loja-abc.com', dominio_2: 'loja-xyz.com' },
  },
];

export const getMockRequests = () => [...mockRequests];
export const setMockRequests = (r: Request[]) => { mockRequests = r; };

// --- Templates ---

import type { RequestTemplate } from '@/types/request';

let mockTemplates: RequestTemplate[] = [
  {
    id: 'tpl1', name: '5 Contas Ecommerce BRL Cartão', description: 'Contas para campanhas de e-commerce no Brasil',
    assetType: 'CONTA_ANUNCIO', quantity: 5, priority: 'HIGH',
    specifications: { nicho: 'E-commerce', moeda: 'BRL', pagamento: 'Cartão' },
    createdByName: 'Admin Wave', createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'tpl2', name: '3 Perfis Aquecidos com Proxy', description: 'Perfis com proxy residencial BR já aquecidos',
    assetType: 'PERFIL', quantity: 3, priority: 'MEDIUM',
    specifications: { proxy: 'BR Residencial', aquecimento: 'Totalmente aquecido' },
    createdByName: 'Admin Wave', createdAt: '2025-02-05T10:00:00Z',
  },
  {
    id: 'tpl3', name: '1 BM para Anúncios', description: 'Business Manager padrão para veiculação de anúncios',
    assetType: 'BUSINESS_MANAGER', quantity: 1, priority: 'MEDIUM',
    specifications: { funcao: 'Anúncios' },
    createdByName: 'Admin Wave', createdAt: '2025-02-10T10:00:00Z',
  },
  {
    id: 'tpl4', name: '10 Contas Infoprodutos USD', description: 'Contas para nichos de infoprodutos em dólar',
    assetType: 'CONTA_ANUNCIO', quantity: 10, priority: 'HIGH',
    specifications: { nicho: 'Infoprodutos', moeda: 'USD', pagamento: 'Agência' },
    createdByName: 'Carlos Silva', createdAt: '2025-02-15T10:00:00Z',
  },
  {
    id: 'tpl5', name: '2 Páginas com Histórico', description: 'Páginas com histórico de publicações para campanhas',
    assetType: 'PAGINA', quantity: 2, priority: 'LOW',
    specifications: { nicho: 'Beleza', comHistorico: 'Sim' },
    createdByName: 'Ana Oliveira', createdAt: '2025-02-20T10:00:00Z',
  },
  {
    id: 'tpl6', name: 'Recarga de Saldo R$ 500', description: 'Recarga padrão de R$ 500 em BRL',
    assetType: 'SALDO', quantity: 1, priority: 'URGENT',
    specifications: { valor: '500', moeda: 'BRL' },
    createdByName: 'Admin Wave', createdAt: '2025-02-25T10:00:00Z',
  },
];

export const getMockRequestTemplates = () => [...mockTemplates];
export const setMockRequestTemplates = (t: RequestTemplate[]) => { mockTemplates = t; };
