

# Redesenhar RequestKanbanBoard + RequestKanbanCard

## Arquivos editados (2)

### 1. `src/components/requests/RequestKanbanCard.tsx`
- Adicionar ícone por tipo de ativo (CreditCard, UserCircle, Globe, LayoutGrid, Target, DollarSign, Layers) no badge de tipo
- Linha "Qtd: X tipo" (ex: "Qtd: 5 contas")
- Indicador de tempo na etapa: calcular dias desde último `statusHistory` entry (ou `createdAt`). Clock amarelo > 3 dias, vermelho > 7 dias
- Manter: borda esquerda por prioridade, título truncado 2 linhas, PriorityBadge, solicitante, fornecedor, data de entrega
- Versão compacta (`compact?: boolean`) para cards na seção "Encerradas" — layout mais reduzido

### 2. `src/components/requests/RequestKanbanBoard.tsx`
- **Pipeline columns**: apenas 7 status principais (sem REJEITADA/CANCELADA)
- Cores: Pendente (amarelo/warning), Aprovada (azul claro/info), Solicitada (roxo/accent-purple), Recebida (azul/info), Aquecimento (laranja/caution), Pronta (verde claro/success), Entregue (verde/success)
- **Contadores**: badge com "X solic. · Y ativos" (soma de `quantity`)
- **Colunas**: min-w-[180px], scroll horizontal mobile, lg+ todas visíveis
- **Seção "Encerradas"**: `Collapsible` abaixo do kanban com cards de REJEITADA + CANCELADA em grid compacto
- **DnD**: manter funcional, usar `useUIStore` para `changedBy` em vez de hardcoded "Admin Wave"
- **DragOverlay**: card mais rico mostrando título + tipo

