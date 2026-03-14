

# Remover "Pixel" das opções de Solicitação

## Alterações

### 1. `src/types/request.ts`
- Remover `'PIXEL'` do array `REQUEST_TYPES`
- Remover entrada `PIXEL` de `REQUEST_TYPE_LABELS`

### 2. `src/components/requests/RequestDialog.tsx`
- Remover `'PIXEL'` do enum do `formSchema`
- Remover o `case 'PIXEL'` no switch de specs e na lógica de build/parse de specifications
- Remover o componente `SpecPixel` e sua referência

### 3. `src/pages/Solicitacoes.tsx`
- Remover a entrada `PIXEL` do mapa `ASSET_TYPE_ICONS`

### 4. `src/components/requests/RequestFilters.tsx` (se houver filtro por tipo)
- Ajuste automático pois usa `REQUEST_TYPES` / `REQUEST_TYPE_LABELS`

Nenhum dado mock precisa mudar — se existirem requests de tipo PIXEL nos mocks, continuarão visíveis mas não será possível criar novos.

