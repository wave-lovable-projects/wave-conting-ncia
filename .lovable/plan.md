

# Melhorar Sistema de Notificações

## Arquivos editados (4)

### 1. `src/components/layout/NotificationBell.tsx`
Substituir mock notifications por notificações contextuais do pipeline (7 itens):
- "Solicitação aprovada" (unread)
- "Pedido ao fornecedor realizado" (unread)
- "Ativos recebidos — aguardando aquecimento" (unread)
- "Solicitação pronta para entrega" (unread)
- "Solicitação entregue — X contas vinculadas" (read)
- "Solicitação rejeitada — motivo" (read)
- "ALERTA: parada há 7 dias em 'Em Aquecimento'" (unread, com ícone de alerta)

Adicionar campo `type` à interface Notification (`'info' | 'success' | 'warning' | 'error'`) para ícones visuais diferenciados. Mostrar ícone colorido por tipo na lista.

### 2. `src/components/layout/AppSidebar.tsx`
- Remover badge hardcoded `badge: 3` de Solicitações
- Importar `getMockRequests` de `mock-requests`
- Computar badge dinamicamente no `AppSidebar`:
  - ADMIN: contar requests com status `PENDENTE`
  - GESTOR: contar requests com status `PRONTA`
- Passar badge computado para o item de Solicitações

### 3. `src/components/requests/RequestTable.tsx`
- Na coluna de prioridade: se `priority === 'URGENT'`, adicionar classe `animate-pulse` ao ícone de alerta (usar `AlertTriangle` pulsante ao lado do PriorityBadge)
- Na coluna de status: se `getDaysInStage(r) > 5` e status não é terminal (ENTREGUE/REJEITADA/CANCELADA), adicionar badge `⏰` ao lado do StatusBadge

### 4. `src/components/requests/RequestKanbanCard.tsx`
- Se `priority === 'URGENT'`, adicionar ícone `AlertTriangle` com `animate-pulse text-destructive`
- Se `getDaysInStage > 5` e status não terminal, mostrar mini badge `⏰`

### 5. `src/pages/Solicitacoes.tsx`
- No `handleAdvanceStatus`, atualizar o toast com mensagem contextual por status:
  - PENDENTE→APROVADA: "Solicitação aprovada — próximo passo: solicitar ao fornecedor"
  - APROVADA→SOLICITADA_FORNECEDOR: "Pedido enviado ao fornecedor — acompanhe o prazo de entrega"
  - SOLICITADA_FORNECEDOR→RECEBIDA: "Ativos recebidos — inicie o aquecimento"
  - RECEBIDA→EM_AQUECIMENTO: "Aquecimento iniciado — monitore o progresso"
  - EM_AQUECIMENTO→PRONTA: "Ativos prontos — entregue ao solicitante"
  - PRONTA→ENTREGUE: "Solicitação entregue com sucesso!"
  - Cancelamento: "Solicitação cancelada"

## Detalhes técnicos
- Badge do sidebar: `useMemo` com `getMockRequests()` dentro do `AppSidebar`, computando `gestaoItems` dinamicamente em vez de const estática
- Notifications: tipos visuais com cores inline (green check para success, yellow alert para warning, red X para error)
- Pulsing alert: `AlertTriangle` com `className="h-3.5 w-3.5 text-destructive animate-pulse"`

