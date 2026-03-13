

# 4 Asset Modules Implementation

## Overview
Implement Business Managers (`/bms`), Perfis (`/perfis`), Páginas (`/paginas`), and Pixels (`/pixels`) following the exact same pattern as Contas de Anúncio: types → mock data → hooks → components → page.

## Files to Create

### Module 1: Business Managers

| File | Purpose |
|------|---------|
| `src/types/business-manager.ts` | BusinessManager interface + BMFilters |
| `src/data/mock-business-managers.ts` | ~12 mock BMs with varied statuses, functions, gestores |
| `src/hooks/useBusinessManagers.ts` | useBMs, useBMStats, useCreateBM, useUpdateBM, useDeleteBM |
| `src/components/business-managers/BMStatsCards.tsx` | 4 cards: Total, Ativas, Desativadas, Bloqueadas |
| `src/components/business-managers/BMFilters.tsx` | Search, status, supplier selects |
| `src/components/business-managers/BMTable.tsx` | Table: Nome, BM ID (copy), Função, Status, Fornecedor, Gestores (tags), Dt Recebimento, Dt Block, Ações |
| `src/components/business-managers/BMDialog.tsx` | Sheet: Nome*, BM ID*, Função (select), Status*, Fornecedor, Dt Recebimento, Dt Block, Gestores multiselect |
| `src/pages/BusinessManagers.tsx` | Full page composing all above + ConfirmDialog for delete |

### Module 2: Perfis

| File | Purpose |
|------|---------|
| `src/types/profile.ts` | Profile, ProfileCheckpoint, WarmingAction, ProfileFilters |
| `src/data/mock-profiles.ts` | ~10 mock profiles + checkpoints + warming actions + comments |
| `src/hooks/useProfiles.ts` | useProfiles, useProfileStats, CRUD hooks + useProfileCheckpoints, useCreateCheckpoint, useProfileWarming, useCompleteWarmingAction, useProfileComments, useCreateComment |
| `src/components/profiles/ProfileStatsCards.tsx` | 4 cards: Total, Ativos, Desativados, Bloqueados |
| `src/components/profiles/ProfileFilters.tsx` | Search, status, supplier, manager selects |
| `src/components/profiles/ProfileTable.tsx` | Table with password reveal/copy, email copy |
| `src/components/profiles/ProfileDialog.tsx` | Sheet for create/edit |
| `src/components/profiles/ProfileDetailSheet.tsx` | Detail sheet with 4 tabs: Anotações, Checkpoints, Aquecimento, Comentários |
| `src/pages/Perfis.tsx` | Full page |

### Module 3: Páginas

| File | Purpose |
|------|---------|
| `src/types/page.ts` | FacebookPage interface + PageFilters |
| `src/data/mock-pages.ts` | ~10 mock pages |
| `src/hooks/usePages.ts` | usePages, usePageStats, CRUD hooks |
| `src/components/pages/PageStatsCards.tsx` | 4 cards: Total, Ativas, Desativadas, Bloqueadas |
| `src/components/pages/PageFilters.tsx` | Search, status, supplier, BM selects |
| `src/components/pages/PageTable.tsx` | Table with CellWithHistory on status |
| `src/components/pages/PageDialog.tsx` | Sheet for create/edit |
| `src/components/pages/UploadPaginasDialog.tsx` | CSV import (same pattern as UploadLoteDialog) |
| `src/pages/Paginas.tsx` | Full page with Import CSV + Export CSV + Nova Página buttons |

### Module 4: Pixels

| File | Purpose |
|------|---------|
| `src/types/pixel.ts` | Pixel interface + PixelFilters |
| `src/data/mock-pixels.ts` | ~10 mock pixels |
| `src/hooks/usePixels.ts` | usePixels, usePixelStats, CRUD + useDeletePixels (bulk) |
| `src/components/pixels/PixelStatsCards.tsx` | 4 cards |
| `src/components/pixels/PixelFilters.tsx` | Search, status, supplier, BM selects |
| `src/components/pixels/PixelTable.tsx` | Table with checkboxes for bulk selection |
| `src/components/pixels/PixelDialog.tsx` | Sheet for create/edit |
| `src/pages/Pixels.tsx` | Full page with BulkActionsBar for bulk delete |

## Technical Approach

- **Same patterns as Ad Accounts**: mock data in module-level `let` arrays, get/set helpers, TanStack Query hooks with simulated delays, filter+paginate in queryFn
- **Shared components reused**: StatusBadge, CellWithHistory, DataTablePagination, PageHeader, EmptyState, ConfirmDialog, BulkActionsBar, AssetConnectionsDialog
- **Mock data references**: reuse `mockSuppliers`, `mockManagers` from `mock-ad-accounts.ts`
- **Profile detail sheet** is the unique complex piece — uses shadcn Tabs inside a Sheet with 4 tab panels, each managing its own state and mock data

## Total: ~32 new files, 4 page rewrites

