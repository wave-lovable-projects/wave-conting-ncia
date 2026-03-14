

# Alterações em `/pixels`

## 1. Remover campos: Domínio, Data Recebimento, Fornecedor

### `PixelDialog.tsx` (modal de criar/editar)
- Remover `mockSuppliers`, campos `supplierId`, `domain`, `receivedAt` do schema Zod e do formulário
- Remover os blocos de UI correspondentes (linhas 107-114 Fornecedor, 123 Domínio, 124 Data Recebimento)
- Limpar payload no `onSubmit` removendo `supplierId`, `supplierName`, `domain`, `receivedAt`

### `PixelTable.tsx` (tabela)
- Remover colunas: Fornecedor (linha 65), Domínio (linha 67), Dt. Recebimento (linha 68)
- Remover as `TableCell` correspondentes (linhas 103, 105, 106)

### `PixelFilters.tsx` (filtros)
- Remover `mockSuppliers` e a categoria `supplierId` do array de filtros
- Remover `supplierId` de `FILTER_KEYS`

### `Pixels.tsx` (página)
- Remover `SUPPLIER_OPTIONS` e o campo `supplierId` de `bulkFields`
- Remover lógica de `supplierName` no `handleBulkApply`

## 2. BM Vinculada como Combobox no modal

### `PixelDialog.tsx`
- Adicionar imports de `Popover`, `Command`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandItem` e ícones `Check`, `ChevronsUpDown`
- Substituir o `Select` de BM Vinculada por um Combobox com busca (mesmo padrão do `ComboboxField` em `RequestDialog.tsx`)
- O combobox usa `Popover` + `Command` para permitir busca textual entre as BMs

