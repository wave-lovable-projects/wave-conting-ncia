

# Criar RequestDashboard

## Arquivo criado (1)

**`src/components/requests/RequestDashboard.tsx`**

Componente único com todas as seções. Recebe `requests: Request[]` e `onFilterChange: (f: Partial<RequestFilters>) => void`.

### Seções internas:

**1. Stats Cards (linha topo)** — grid 2→3→5 cols
- Total, Pendentes, Em andamento (APROVADA+SOLICITADA_FORNECEDOR+RECEBIDA+EM_AQUECIMENTO), Prontas, Entregues este mês
- Cada card clicável → chama `onFilterChange({ status: ... })`
- Pattern idêntico ao StatsCards de ad-accounts

**2. Pipeline Resumido** — card full-width
- Barra horizontal com `flex` e larguras proporcionais por status (7 segmentos)
- Cor de cada segmento = cor do status (do StatusBadge). Número dentro de cada segmento
- `Tooltip` no hover com label + quantidade

**3. Alertas de Atraso** — card
- Calcular dias na etapa (último statusHistory entry ou createdAt)
- Filtrar requests com > 3 dias, ordenar desc, top 5
- Lista com: título truncado, etapa, "Xd", solicitante. Clock amarelo > 3d, vermelho > 7d
- Link "Ver todas" (noop por agora)

**4. Métricas de Tempo (SLA)** — card
- Filtrar requests ENTREGUE. Para cada, calcular tempo total (createdAt → deliveredAt)
- Tempo médio total formatado em dias
- Para cada etapa do pipeline, calcular tempo médio entre transições do statusHistory
- Mini barra horizontal por etapa (div com width proporcional + label)

**5. Por Fornecedor** — card
- Agrupar requests com supplierId. Para cada fornecedor:
  - Pedidos ativos (status != ENTREGUE/REJEITADA/CANCELADA)
  - Tempo médio de entrega (supplierOrderDate → supplierReceivedDate)
  - Taxa no prazo (supplierReceivedDate <= supplierExpectedDate)
- Mini tabela (4 cols)

### Layout grid:
```
[Stats cards - full width, 5 cols]
[Pipeline resumido - full width]
[Alertas de Atraso | Métricas SLA | Por Fornecedor] — md:2 lg:3 cols
```

## Arquivo editado (1)

**`src/pages/Solicitacoes.tsx`**
- Import `RequestDashboard` + `Collapsible`
- State `dashboardOpen` (default true)
- Botão "Dashboard"/"Ocultar" no PageHeader actions
- `Collapsible` wrapping `<RequestDashboard>` acima dos filtros
- Passar **todas** as requests sem filtro (`useRequests({})`) para o dashboard, e requests filtradas para a tabela/kanban

## Cálculos-chave:

```typescript
// Tempo médio por etapa (para requests entregues)
// Percorrer statusHistory, calcular diff entre cada transição consecutiva
// Agrupar por toStatus, calcular média

// Entregues este mês
const now = new Date();
const thisMonth = requests.filter(r => r.status === 'ENTREGUE' && r.deliveredAt && 
  new Date(r.deliveredAt).getMonth() === now.getMonth() && 
  new Date(r.deliveredAt).getFullYear() === now.getFullYear());
```

