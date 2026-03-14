
# Refatoração da Página de Solicitações

## 1. Button group "Nova Solicitação" + dropdown "Usar Template"
**Arquivo: `src/pages/Solicitacoes.tsx`**
- Remover o botão separado "Usar Template"
- Criar um button group: botão principal "Nova Solicitação" à esquerda + botão com `ChevronDown` à direita
- O botão da seta abre um `DropdownMenu` com a opção "Usar Template" (que abre o picker dialog existente)
- Estilo: botões colados com `rounded-l-md` / `rounded-r-md`, separados por borda sutil

## 2. Dashboard em página própria
**Arquivo: `src/pages/SolicitacoesDashboard.tsx` (novo)**
- Mover o `RequestDashboard` para uma página dedicada `/solicitacoes/dashboard`
- A página importa `RequestDashboard` e `useRequests`, passa os dados

**Arquivo: `src/pages/Solicitacoes.tsx`**
- Remover o `Collapsible` com `RequestDashboard`, o botão "Dashboard/Ocultar" e estado `dashboardOpen`

**Arquivo: `src/App.tsx`**
- Adicionar rota `/solicitacoes/dashboard` antes de `/solicitacoes`

**Arquivo: `src/components/layout/AppSidebar.tsx`**
- Adicionar sub-item ou link para o dashboard no sidebar (ou botão na page header linkando para `/solicitacoes/dashboard`)

## 3. Lista agrupada por status
**Arquivo: `src/components/requests/RequestTable.tsx`**
- Refatorar para agrupar requests por status (similar ao Notion/Linear list view)
- Cada grupo tem um header colapsável com: dot colorido + nome do status + contagem
- Dentro de cada grupo, as linhas da tabela normais
- Usar `Collapsible` por grupo, estado de abertura/fechamento por status
- Ordenação dentro de cada grupo mantém a lógica existente

## 4. Cards maiores no Kanban
**Arquivo: `src/components/requests/RequestKanbanCard.tsx`**
- Aumentar padding do card de `p-3` para `p-4`
- Aumentar tamanho do título de `text-sm` para `text-sm` com `line-clamp-2` (já existe) mas dar mais espaço
- Adicionar descrição truncada (1 linha) se existir
- Mostrar avatar/iniciais do solicitante
- Aumentar espaçamento geral entre elementos

**Arquivo: `src/components/requests/RequestKanbanBoard.tsx`**
- Aumentar largura mínima das colunas de `min-w-[180px] w-[180px]` para `min-w-[260px] w-[260px]`
- Aumentar gap entre cards de `space-y-1.5` para `space-y-2`

## 5. Tooltips nos indicadores de atenção
**Arquivo: `src/components/requests/RequestKanbanCard.tsx`**
- Substituir emoji `⏰` por ícone `Clock` com cor warning
- Envolver o ícone `AlertTriangle` (urgente) em `Tooltip` com `delayDuration={0}` e texto "Prioridade urgente"
- Envolver o ícone `Clock` (stale) em `Tooltip` com `delayDuration={0}` e texto "Parada há X dias nesta etapa"

**Arquivo: `src/components/requests/RequestTable.tsx`**
- Substituir emoji `⏰` por ícone `Clock` com cor warning
- Envolver `AlertTriangle` em `Tooltip` com `delayDuration={0}`: "Prioridade urgente"
- Envolver `Clock` (stale) em `Tooltip` com `delayDuration={0}`: "Parada há X dias nesta etapa"

## 6. Remover glow piscante do badge "Urgente"
**Arquivo: `src/components/shared/PriorityBadge.tsx`**
- Remover `animate-pulse-glow` da config de URGENT
- Manter apenas as cores `bg-destructive/15 text-destructive border-destructive/30`

## Resumo de arquivos
- **Criar**: `src/pages/SolicitacoesDashboard.tsx`
- **Editar**: `src/pages/Solicitacoes.tsx`, `src/App.tsx`, `src/components/layout/AppSidebar.tsx`, `src/components/requests/RequestTable.tsx`, `src/components/requests/RequestKanbanCard.tsx`, `src/components/requests/RequestKanbanBoard.tsx`, `src/components/shared/PriorityBadge.tsx`
