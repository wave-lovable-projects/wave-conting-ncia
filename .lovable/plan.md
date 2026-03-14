

# Correções em `/pixels` e `/paginas`

## 1. PixelDialog — Fix scroll do combobox

O problema de scroll é que o `PopoverContent` é portado fora do `SheetContent`. A solução (já usada em `RequestDialog`) é passar `container={portalContainer}` para o `PopoverContent`, onde `portalContainer` é uma `ref` ao `SheetContent`.

**Arquivo**: `src/components/pixels/PixelDialog.tsx`
- Adicionar `useRef` para o container do sheet
- Passar `ref` ao `SheetContent`  
- Adicionar `container={containerRef.current}` ao `PopoverContent`

## 2. PageDialog — Comboboxes + Datepickers

**Arquivo**: `src/components/pages/PageDialog.tsx`

### 2a. BM Vinculada, BM de Origem, Fornecedor → Combobox
- Substituir os 3 `Select` por `Popover` + `Command` (mesmo padrão do `RequestDialog`)
- **BM de Origem**: usar a mesma lista `bms` (não mais input de texto livre)
- Cada combobox terá seu próprio state `open` e usará `container={portalContainer}`

### 2b. Datas → Datepicker com Calendar
- Substituir os 3 `<Input type="date">` por `Popover` + `Calendar` (padrão shadcn datepicker)
- Alterar schema: `receivedAt`, `blockedAt`, `usedAt` de `z.string()` para `z.date().optional()`
- Ajustar `reset` e `onSubmit` para converter entre Date e string ISO
- Adicionar `pointer-events-auto` no Calendar

### 2c. Portal container
- Adicionar `useRef` + `container` no `SheetContent` como no PixelDialog

## Resultado
- Scroll funciona nos comboboxes (ambos modais)
- BM de Origem mostra mesmas BMs que BM Vinculada
- Datas usam calendar picker visual
- Fornecedor é combobox pesquisável

