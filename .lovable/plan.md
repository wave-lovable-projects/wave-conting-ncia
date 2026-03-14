

# Alterações: Tabelas sem quebra de linha, Filtro de período unificado, Dropdown lateral

## 1. Tabelas sem quebra de linha

**Arquivo: `src/components/ui/table.tsx`**
- Adicionar `whitespace-nowrap` ao `TableHead` e `TableCell` para impedir quebra de linha em todas as tabelas do sistema.

## 2. Filtro de período como date range picker dentro do UnifiedFilter

**Arquivos: `src/components/shared/UnifiedFilter.tsx`, `RequestFilters.tsx`, `ActivityFilters.tsx`**

O UnifiedFilter ganhará suporte a uma categoria especial do tipo `dateRange`. Quando o usuário seleciona "Período" na lista de categorias, em vez do Command com checkboxes, aparece um calendário `mode="range"` do react-day-picker.

- **UnifiedFilter**: Adicionar prop opcional `dateRange?: { from?: Date; to?: Date }` e `onDateRangeChange?: (range: { from?: Date; to?: Date }) => void`. Adicionar uma categoria visual "Período" (com ícone de calendário) que ao ser selecionada mostra o Calendar em `mode="range"`. Mostrar chip com o período selecionado.
- **RequestFilters**: Remover os dois Popovers de "De" e "Até". Passar `dateRange` e `onDateRangeChange` ao UnifiedFilter.
- **ActivityFilters**: Remover os dois Popovers de "Início" e "Fim". Passar `dateRange` e `onDateRangeChange` ao UnifiedFilter.

## 3. Dropdown do filtro abre para o lado direito

**Arquivo: `src/components/shared/UnifiedFilter.tsx`**

Quando o usuário clica em uma categoria, em vez de substituir o conteúdo do popover (navegação interna), o submenu de opções abrirá como um segundo painel ao lado direito. Implementação: usar layout de dois painéis dentro do PopoverContent — lista de categorias à esquerda, e ao selecionar uma, o painel de opções aparece à direita expandindo o popover. O PopoverContent terá `w-auto` com `flex` horizontal, mostrando ambos os painéis lado a lado quando uma categoria está ativa.

Layout:
```text
┌──────────────┬──────────────────┐
│ Tipo         │ □ Conta Anúncio  │
│ Status    ●  │ □ BM             │
│ Prioridade   │ □ Perfil         │
│ Fornecedor   │ Buscar...        │
│ Período      │                  │
│              │ [Limpar] [Aplicar]│
├──────────────┴──────────────────┤
│ [Limpar tudo]                   │
└─────────────────────────────────┘
```

- Remover o botão "Voltar" (ArrowLeft) — não há mais navegação, é side-by-side
- PopoverContent: `className="w-auto p-0"` com `<div className="flex">`
- Painel esquerdo: lista de categorias (sempre visível, ~180px)
- Painel direito: Command com opções da categoria selecionada (~240px), ou Calendar para "Período"
- Categoria ativa destacada com `bg-accent`

