

# Reestruturação do Módulo de Solicitações

## Escopo

Reescrever os 3 arquivos core (`types/request.ts`, `data/mock-requests.ts`, `hooks/useRequests.ts`) e atualizar os 5 componentes consumidores para refletir o novo pipeline de contingência.

## 1. Tipos (`src/types/request.ts`)

- **RequestStatus**: `PENDENTE | APROVADA | SOLICITADA_FORNECEDOR | RECEBIDA | EM_AQUECIMENTO | PRONTA | ENTREGUE | REJEITADA | CANCELADA`
- **RequestType**: `CONTA_ANUNCIO | BUSINESS_MANAGER | PERFIL | PAGINA | PIXEL | SALDO | MISTO`
- **RequestPriority**: mantém `LOW | MEDIUM | HIGH | URGENT`
- **Interface Request**: renomear `type` → `assetType`, adicionar todos os novos campos (quantity, quantityDelivered, linkedAssetIds, supplier*, warming*, deliveredAt, specifications)
- **RequestFilters**: adicionar `supplierId` como filtro opcional

## 2. Mock Data (`src/data/mock-requests.ts`)

15+ solicitações distribuídas entre os 9 status, com dados realistas de contingência (fornecedores, custos, datas de aquecimento, IDs de ativos vinculados, specifications com nicho/moeda/proxy).

## 3. Hook (`src/hooks/useRequests.ts`)

- Atualizar `applyFilters` para funcionar com `assetType` em vez de `type`
- Adicionar filtro por `supplierId`
- `useCreateRequest` ajustar Omit para novos campos default (quantityDelivered: 0, linkedAssetIds: [])
- Demais mutations mantêm a mesma estrutura

## 4. StatusBadge (`src/components/shared/StatusBadge.tsx`)

Adicionar entradas para os novos status: `APROVADA`, `SOLICITADA_FORNECEDOR`, `RECEBIDA`, `EM_AQUECIMENTO`, `PRONTA`, `ENTREGUE`, `CANCELADA`. Remover `IN_PROGRESS` e `DONE` (não mais usados por requests, mas mantidos se outros módulos usarem).

## 5. Componentes de Request (5 arquivos)

### RequestFilters.tsx
- Atualizar opções de tipo (7 novos valores com labels PT-BR)
- Atualizar opções de status (9 novos valores)

### RequestTable.tsx
- `typeLabels` → novos valores
- Adicionar colunas: Qtd, Fornecedor
- Remover coluna Responsável (substituída por fornecedor no contexto)

### RequestKanbanBoard.tsx
- 9 colunas no kanban (com scroll horizontal, grid adaptativo)
- Cores distintas por status

### RequestKanbanCard.tsx
- `typeLabels` → novos valores
- Mostrar quantidade no card

### RequestDialog.tsx
- Atualizar Select de tipo com novos valores
- Adicionar campo quantidade (Input number)
- Adicionar campo specifications como key-value simples

### RequestDetailSheet.tsx
- `typeLabels` → novos valores
- Atualizar Select de status com novos valores
- Mostrar seção de fornecedor (nome, custo, datas)
- Mostrar seção de aquecimento (datas)
- Mostrar linkedAssetIds e quantidade entregue

## Arquivos editados (8 total)

1. `src/types/request.ts`
2. `src/data/mock-requests.ts`
3. `src/hooks/useRequests.ts`
4. `src/components/shared/StatusBadge.tsx`
5. `src/components/requests/RequestFilters.tsx`
6. `src/components/requests/RequestTable.tsx`
7. `src/components/requests/RequestKanbanBoard.tsx`
8. `src/components/requests/RequestKanbanCard.tsx`
9. `src/components/requests/RequestDialog.tsx`
10. `src/components/requests/RequestDetailSheet.tsx`

