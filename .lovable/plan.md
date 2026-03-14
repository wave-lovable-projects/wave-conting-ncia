

# Atualizar RequestTable, RequestFilters e StatusBadge

## Arquivos editados (3)

### 1. `src/components/shared/StatusBadge.tsx`
- Atualizar cores dos status do pipeline de solicitações para corresponder ao requisito:
  - PENDENTE: amarelo (warning)
  - APROVADA: azul claro (info)
  - SOLICITADA_FORNECEDOR: roxo (accent-purple)
  - RECEBIDA: azul (info mais forte)
  - EM_AQUECIMENTO: laranja (caution)
  - PRONTA: verde claro (success/10)
  - ENTREGUE: verde forte (success/20)
  - REJEITADA: vermelho (destructive)
  - CANCELADA: cinza com line-through

### 2. `src/components/requests/RequestTable.tsx`
Reescrita completa:
- **12 colunas**: Título, Tipo (com ícone do KanbanCard), Qtd Solicitada, Qtd Entregue (X/Y, verde se completa), Prioridade, Status, Solicitante, Responsável, Fornecedor, Data Desejada, Tempo na Etapa, Criado em
- **Tempo na Etapa**: calcular dias desde último statusHistory entry (ou createdAt). Mostrar "Xd" ou "Xsem". Amarelo > 5 dias, vermelho > 10 dias
- **Sorting**: estado local `sortKey` + `sortDir`, clique no header alterna. Ordenação em todas as colunas principais
- **Row actions dropdown**: Ver Detalhes, Avançar Status (usa próximo status válido do mapa de transições), Copiar ID, Cancelar
- Props adicionais: `onAdvanceStatus`, `onCancel` (chamados pelo parent Solicitacoes.tsx)

### 3. `src/components/requests/RequestFilters.tsx`
- Adicionar categorias ao UnifiedFilter:
  - Fornecedor (opções de `getMockSuppliers`)
  - Responsável (opções de `getMockUsers` filtrado por ADMIN/GESTOR)
- Expandir `FILTER_KEYS` para incluir `supplierId`, `assigneeId`
- Adicionar date range picker para data de criação (2 Popovers com Calendar: "De" e "Até")
- Adicionar `dateFrom` e `dateTo` ao `RequestFilters` type

### 4. `src/types/request.ts`
- Adicionar `dateFrom?: string` e `dateTo?: string` ao `RequestFilters` interface

### 5. `src/hooks/useRequests.ts`
- Adicionar filtro por `dateFrom`/`dateTo` no `applyFilters`

### 6. `src/pages/Solicitacoes.tsx`
- Passar novos callbacks `onAdvanceStatus` e `onCancel` para RequestTable usando `useUpdateRequestStatus`

