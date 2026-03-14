

# Barra fixa de edição em massa (bottom bar) para todas as páginas de ativos

## Resumo
Substituir o dialog de edição em massa por uma barra fixa na parte inferior da tela que aparece ao selecionar itens. Cada campo editável é um botão que abre um Popover para cima com Command + scroll para selecionar o valor. Aplicar em `/contas`, `/perfis` (que é `/`), `/bms`, `/paginas` e `/pixels`.

## Componente compartilhado

### `src/components/shared/BulkEditBar.tsx`
Barra fixa (`fixed bottom-0`) com:
- Contador de itens selecionados
- Botões para cada campo editável (cada um abre Popover `side="top"` com Command list scrollável)
- Botão "Aplicar" e "Limpar seleção"
- Botão "Excluir" (destructive)
- Recebe `fieldConfig` genérico: `{ key, label, options: { value, label }[] }[]`
- Callback `onApply(values: Record<string, string>)` e `onBulkDelete`, `onClear`

### Refatorar `BulkActionsBar`
Será substituído pelo novo `BulkEditBar` em todas as páginas.

## Seleção nas tabelas (adicionar checkbox)
As tabelas que ainda não têm seleção precisam receber `selectedIds` e `onSelectionChange`:
- **ProfileTable** — adicionar checkbox header + row
- **BMTable** — adicionar checkbox header + row
- **PageTable** — adicionar checkbox header + row
- PixelTable e AdAccountsTable já possuem

## Hooks de bulk update (novos)
Adicionar `useBulkUpdateProfiles`, `useBulkUpdateBMs`, `useBulkUpdatePages`, `useBulkUpdatePixels` nos respectivos hooks (padrão idêntico ao `useBulkUpdateAdAccounts`).

## Páginas — integração

Cada página recebe `selectedIds` state e renderiza `BulkEditBar` quando `selectedIds.size > 0`, passando os campos editáveis específicos:

| Página | Campos editáveis |
|--------|-----------------|
| `/contas` | Status da Conta, Status de Uso, Gestor, Fornecedor, Nicho |
| `/` (Perfis) | Status, Fornecedor, Gestor |
| `/bms` | Status, Fornecedor |
| `/paginas` | Status, Fornecedor, BM, Gestor |
| `/pixels` | Status, Fornecedor, BM |

## Arquivos editados/criados
- **Criar**: `src/components/shared/BulkEditBar.tsx`
- **Editar**: `src/components/profiles/ProfileTable.tsx` (add checkboxes)
- **Editar**: `src/components/business-managers/BMTable.tsx` (add checkboxes)
- **Editar**: `src/components/pages/PageTable.tsx` (add checkboxes)
- **Editar**: `src/hooks/useProfiles.ts` (add `useBulkUpdateProfiles`)
- **Editar**: `src/hooks/useBusinessManagers.ts` (add `useBulkUpdateBMs`)
- **Editar**: `src/hooks/usePages.ts` (add `useBulkUpdatePages`)
- **Editar**: `src/hooks/usePixels.ts` (add `useBulkUpdatePixels`)
- **Editar**: `src/pages/ContasAnuncio.tsx` (replace BulkActionsBar+BulkEditDialog with BulkEditBar)
- **Editar**: `src/pages/Perfis.tsx` (add selection + BulkEditBar)
- **Editar**: `src/pages/BusinessManagers.tsx` (add selection + BulkEditBar)
- **Editar**: `src/pages/Paginas.tsx` (add selection + BulkEditBar)
- **Editar**: `src/pages/Pixels.tsx` (replace BulkActionsBar with BulkEditBar)

