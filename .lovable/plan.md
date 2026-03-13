

# Refactor: Unified Filter Component

## Current State
11 filter components across the app, each rendering multiple inline `<Select>` dropdowns. Pages affected:
- **ContasAnuncio** → `AdAccountFilters` (6 filters)
- **BusinessManagers** → `BMFilters` (2 filters)
- **Paginas** → `PageFilters` (3 filters)
- **Pixels** → `PixelFilters` (3 filters)
- **Perfis** → `ProfileFilters` (3 filters)
- **Fornecedores** → `SupplierGridFilters` (1 filter) + `ComplaintFilters` (3 filters)
- **Solicitacoes** → `RequestFilters` (3 filters)
- **Usuarios** → `UserFilters` (3 filters)
- **Atividades** → `ActivityFilters` (3 filters + date range)
- **Sugestoes** → inline selects (2 filters)
- **MetaCampaigns** → `CampaignFilters`

## New UX Pattern

```text
┌──────────────────────┐  ┌──────────┐  ┌─────────────────┐
│ 🔍 Buscar...         │  │ ▼ Filtros │  │ ✕ Limpar (N)    │
└──────────────────────┘  └──────────┘  └─────────────────┘
                              │
                    ┌─────────▼──────────────────┐
                    │  Status        ▸ [2]       │
                    │  Fornecedor    ▸            │
                    │  Gestor        ▸            │
                    │  Squad         ▸            │
                    │  Pagamento     ▸            │
                    │  Nicho         ▸            │
                    │───────────────────────────  │
                    │  [Limpar]       [Aplicar]   │
                    └────────────────────────────┘
                              │ click category
                    ┌─────────▼──────────────────┐
                    │  🔍 Buscar status...        │
                    │  ☑ Ativa                    │
                    │  ☐ Desativada               │
                    │  ☑ Rollback                 │
                    │  [← Voltar]                 │
                    └────────────────────────────┘
```

- A single **"Filtros"** button with a badge showing active filter count
- Opens a **Popover** listing all available filter categories for that page
- Clicking a category navigates into a **Command** (searchable list) with checkboxes for multi-select
- Back button returns to category list
- "Aplicar" closes the popover and applies; "Limpar" resets all
- Active filters shown as dismissible badges/chips next to the button
- Search input remains separate (outside the Filtros popover)

## Implementation

### 1. Create shared `UnifiedFilter` component
**File**: `src/components/shared/UnifiedFilter.tsx`

A generic, reusable component that accepts a config array:
```ts
interface FilterCategory {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  multiSelect?: boolean; // default true
}

interface UnifiedFilterProps {
  categories: FilterCategory[];
  values: Record<string, string[]>; // key → selected values
  onChange: (values: Record<string, string[]>) => void;
  onClear: () => void;
}
```

Internally manages:
- Popover open/close state
- Two-panel view: category list → item selection (via internal state)
- Uses `Command` + `CommandInput` + `CommandItem` with checkboxes for item selection
- Badge count on the trigger button
- Active filter chips rendered outside the popover

### 2. Refactor each filter component
Each existing filter file will be rewritten to use `UnifiedFilter` instead of multiple Selects. The search `<Input>` stays separate. Each page defines its `FilterCategory[]` config and maps the unified `Record<string, string[]>` output back to its typed filter interface.

**Files to rewrite** (12 files):
- `src/components/ad-accounts/AdAccountFilters.tsx`
- `src/components/business-managers/BMFilters.tsx`
- `src/components/pages/PageFilters.tsx`
- `src/components/pixels/PixelFilters.tsx`
- `src/components/profiles/ProfileFilters.tsx`
- `src/components/suppliers/SupplierGridFilters.tsx`
- `src/components/suppliers/ComplaintFilters.tsx`
- `src/components/requests/RequestFilters.tsx`
- `src/components/users/UserFilters.tsx`
- `src/components/activities/ActivityFilters.tsx`
- `src/components/meta/CampaignFilters.tsx`
- `src/pages/Sugestoes.tsx` (inline filters)

### 3. No page-level changes needed
The filter components maintain the same external API (`filters`, `onFilterChange`, `onClear`). Pages don't need changes — only the filter components are refactored internally.

### Special cases
- **ActivityFilters**: Date range pickers stay outside `UnifiedFilter` as separate controls (date pickers don't fit the combobox pattern)
- **Sugestoes**: The "sort by" select stays separate since it's ordering, not filtering
- **SupplierGridFilters** and **ComplaintFilters**: The "Novo" button stays outside the filter component

## Total: 1 new shared component + 12 filter rewrites

