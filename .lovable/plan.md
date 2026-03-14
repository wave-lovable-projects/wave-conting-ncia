
Diagnóstico (com base no código + replay):
- O combobox está dentro de um `Sheet` (Radix Dialog), mas o `PopoverContent` é sempre renderizado em `Portal` no `body` (`src/components/ui/popover.tsx`).
- Em contexto de `Sheet`, isso costuma quebrar scroll de wheel/trackpad em conteúdos portaled por causa do lock de scroll do Dialog (`react-remove-scroll`), mesmo quando clique/seleção funcionam.
- O `CommandList` já tem `overflow-y-auto`; o problema não é apenas CSS da lista.

Plano de correção:
1) Tornar o `PopoverContent` compatível com container customizado
- Arquivo: `src/components/ui/popover.tsx`
- Ajustar wrapper para aceitar prop opcional `container` e repassar para `<PopoverPrimitive.Portal container={...}>`.
- Manter comportamento atual como default (sem container) para não quebrar outros usos.

2) Ancorar os comboboxes do modal de solicitação dentro do próprio `Sheet`
- Arquivo: `src/components/requests/RequestDialog.tsx`
- Criar `ref` para o `SheetContent`.
- Passar esse `ref.current` como `container` para o `PopoverContent` usado no `ComboboxField`.
- Assim, a lista passa a existir dentro da árvore “permitida” pelo lock do Sheet, liberando wheel/trackpad.

3) Limpar handlers que atrapalham diagnóstico
- Em `CommandList` do combobox, remover `onWheelCapture={e => e.stopPropagation()}` (não resolve lock do portal e pode gerar comportamento inconsistente).
- Manter `max-h` + `overflow-y-auto` na lista.

4) Garantir propagação da correção para os 3 comboboxes afetados
- BM Desejada (Conta de Anúncio)
- Fornecedor Preferido (Business Manager)
- Conta de Destino (Saldo)
- Como todos usam `ComboboxField`, a correção será única e reaproveitada.

Validação pós-implementação (E2E):
- Em `/solicitacoes` > “Nova Solicitação”, abrir cada combobox com lista longa.
- Testar:
  - scroll com roda do mouse
  - scroll com trackpad
  - arraste da barra de rolagem
  - busca + scroll após filtro
- Confirmar que quem rola é a lista do combobox (não o `Sheet` ao fundo).

Arquivos a editar:
- `src/components/ui/popover.tsx`
- `src/components/requests/RequestDialog.tsx`
