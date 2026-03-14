

# Refazer RequestDetailSheet — Painel completo com Tabs

## Arquivo editado (1)

**`src/components/requests/RequestDetailSheet.tsx`** — reescrita completa

## Estrutura

Sheet `sm:max-w-2xl` com 5 Tabs internas:

### Tab "Visão Geral"
- **Barra de progresso visual**: 7 steps horizontais (PENDENTE→ENTREGUE) com ícones e cores. Step ativo highlighted, anteriores preenchidos, posteriores grayed.
- Info grid: tipo (badge+ícone), quantidade (entregue/total), prioridade, solicitante, responsável (select editável com mockUsers ADMIN/GESTOR), datas
- Especificações do ativo (render `specifications` record)
- Status select com **transições válidas apenas**:
  - PENDENTE → APROVADA, REJEITADA
  - APROVADA → SOLICITADA_FORNECEDOR, REJEITADA, CANCELADA
  - SOLICITADA_FORNECEDOR → RECEBIDA, CANCELADA
  - RECEBIDA → EM_AQUECIMENTO, CANCELADA
  - EM_AQUECIMENTO → PRONTA, CANCELADA
  - PRONTA → ENTREGUE, CANCELADA
  - ENTREGUE → (nenhum)
  - REJEITADA → (nenhum)
  - CANCELADA → (nenhum)
- Descrição

### Tab "Fornecedor"
- Formulário inline: fornecedor (select mockSuppliers from `mock-suppliers.ts`), data pedido, previsão entrega, custo (number+moeda), observações
- Se já preenchido, mostrar timeline visual: pedido → previsão → recebimento
- Botão "Marcar como Recebido" (muda status para RECEBIDA, preenche supplierReceivedDate)
- Usa `useUpdateRequest` para salvar campos de fornecedor

### Tab "Ativos Vinculados"
- Lista dos `linkedAssetIds` com badge do ID e botão desvincular (X)
- Contador: "X de Y ativos vinculados" com indicador verde se completo
- Botão "Vincular Ativo" → Dialog simples com input text para ID do ativo + botão adicionar
- Usa `useUpdateRequest` para salvar linkedAssetIds

### Tab "Aquecimento"
- Só renderiza conteúdo se status >= EM_AQUECIMENTO (senão mensagem "Disponível quando status for Em Aquecimento")
- Datas de início/fim (editáveis via date picker)
- Checklist hardcoded de 6 ações de aquecimento (state local): Publicar conteúdo, Interagir com feed, Adicionar amigos, Configurar perfil, Verificar conta, Postar stories
- Progresso: "X de 6 ações concluídas" com Progress bar
- Botão "Concluir Aquecimento" → muda status para PRONTA

### Tab "Histórico"
- Timeline unificada: statusHistory + comments, ordenados por data
- Cada entry: ícone (ArrowRight para status, MessageSquare para comment), cor por status, timestamp, autor
- Input de novo comentário no bottom

## Footer contextual
Botões baseados no status atual (conforme requisitos). Usa `useUpdateRequestStatus` com `user?.name` do `useUIStore`.

## Imports necessários
- `Tabs, TabsList, TabsTrigger, TabsContent` de ui/tabs
- `Progress` de ui/progress  
- `Calendar` + `Popover` para date pickers
- `Checkbox` para checklist
- `useUpdateRequest`, `useUpdateRequestStatus`, `useAddRequestComment`, `useRequest`
- `getMockSuppliers` de mock-suppliers
- `getMockUsers` de mock-users
- `useUIStore` de store/ui.store
- `REQUEST_TYPE_LABELS`, `REQUEST_STATUS_LABELS` de types/request
- Ícones Lucide: Check, Clock, Package, Truck, Flame, Send, etc.

