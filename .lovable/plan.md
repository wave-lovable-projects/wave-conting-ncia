

# Ad Accounts Module Implementation

## Overview
Replace the placeholder ContasAnuncio page with a full-featured ad accounts management module. Since there's no backend yet, all data hooks will use **mock data** with TanStack Query, ready to swap to real API calls later.

## Files to Create

### Types
- `src/types/ad-account.ts` — AdAccount, AdAccountHistory, AdAccountFilters interfaces

### Mock Data
- `src/data/mock-ad-accounts.ts` — ~20 mock ad accounts with varied statuses, plus mock history entries, mock managers/suppliers/niches lists

### Hooks
- `src/hooks/useAdAccounts.ts` — TanStack Query hooks wrapping mock data with simulated filtering, pagination, sorting. Hooks: useAdAccounts, useAdAccount, useCreateAdAccount, useUpdateAdAccount, useDeleteAdAccount, useBulkUpdateAdAccounts, useAdAccountHistory. All structured to swap `queryFn` to real API calls later.

### Components (`src/components/ad-accounts/`)
- **StatsCards.tsx** — 6 summary cards (Total, Ativas, Desativadas, Rollback, Em Uso, Saldo Removido). Clickable to set filter.
- **AdAccountFilters.tsx** — Search input + 6 Select dropdowns (Gestor, Status, Nicho, Squad, Fornecedor, Tipo Pagamento) + clear button. 400ms debounce on search.
- **AdAccountsTable.tsx** — Full table with 16 columns (checkbox, name, accountId w/ copy, supplier, BM, niche, product, manager, account status, BM status, balance removed, payment type, bank, card last4, usage status, actions dropdown). Row selection via checkboxes, column sorting, pagination via DataTablePagination. Actions dropdown: Editar, Registrar Incidente, Ver Conexões, Copiar ID, Excluir.
- **AdAccountDialog.tsx** — Sheet (right panel) for create/edit. React Hook Form + Zod validation. All fields from spec. Invalidates query cache on save.
- **BulkEditDialog.tsx** — Dialog for bulk editing selected accounts. Toggle per field (status, usage, manager, supplier, niche). Calls bulk update.
- **UploadLoteDialog.tsx** — Dialog with drag-and-drop CSV area, template download link, preview table (first 5 rows), import button with result summary.

### Shared Components
- `src/components/shared/CellWithHistory.tsx` — Table cell wrapper showing current value + clock icon on hover → Popover with field change history (date, old→new, who changed).
- `src/components/shared/BulkActionsBar.tsx` — Bar shown when items selected: count label + Editar em massa / Excluir / Limpar seleção buttons.
- `src/components/shared/AssetConnectionsDialog.tsx` — Dialog showing connected assets (BMs, Profiles, Pages, Pixels) grouped by type, with mock data.

### Page
- `src/pages/ContasAnuncio.tsx` — Replaces placeholder. Composes: PageHeader (title + "Importar CSV" / "Nova Conta" buttons), StatsCards, AdAccountFilters, BulkActionsBar (conditional), AdAccountsTable, plus all dialogs wired to state.

## Technical Approach
- **No TanStack Table dependency** — build a manual table using the existing shadcn Table components (already installed). Sorting and selection managed via React state.
- **Mock data layer** — all hooks return mock data via `queryFn` returning promises. Mutations update a local ref and invalidate queries. This makes the swap to real API trivial later.
- **State management** — filter state, selection state, dialog open state all managed via `useState` in the page component, passed as props.
- **Debounce** — search input uses a `useEffect` with 400ms timeout.
- **Copy to clipboard** — uses `navigator.clipboard.writeText()` with toast feedback.

## Files Modified
- `src/pages/ContasAnuncio.tsx` — complete rewrite

