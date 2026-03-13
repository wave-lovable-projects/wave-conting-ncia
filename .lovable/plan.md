

# Meta Marketing API Integration — Implementation Plan

## Overview
Two new pages (`/meta` Dashboard and `/meta/campanhas` Campaigns), plus OAuth callback route, types, mock data, hooks, and sidebar update. Follows established mock data + TanStack Query pattern.

## Files to Create

### Types & Data & Hooks (3 files)

| File | Purpose |
|------|---------|
| `src/types/meta.ts` | MetaAccountSummary, MetaCampaign, MetaInsight, MetaAlert, MetaAuthStatus interfaces |
| `src/data/mock-meta.ts` | Mock auth status, ~4 accounts, ~10 campaigns, daily insights, ~6 alerts |
| `src/hooks/useMeta.ts` | useMetaAuthStatus, useMetaAccounts, useMetaCampaigns, useMetaInsights, usePauseCampaign, useActivateCampaign, useSyncMetaAccounts, useConnectMeta |

### Components (6 files)

| File | Purpose |
|------|---------|
| `src/components/meta/MetaConnectButton.tsx` | "Conectar com Meta" button — simulates OAuth redirect, shows loading state |
| `src/components/meta/MetaConnectionStatus.tsx` | Card: connected/disconnected status, token expiry, sync button, last sync time |
| `src/components/meta/MetaAccountCards.tsx` | Grid of synced account cards: name, ID, status badge, balance, currency, sync age, red highlight if not ACTIVE |
| `src/components/meta/MetaAlerts.tsx` | List of recent webhook alerts with type icons, color-coded (red for disabled, yellow for restricted) |
| `src/components/meta/CampaignInsightsSheet.tsx` | Sheet: metrics cards + line chart (daily spend) + bar chart (impressions vs clicks) with date range picker |
| `src/components/meta/CampaignFilters.tsx` | Filters: account select, status, search, date range |

### Pages (3 files)

| File | Purpose |
|------|---------|
| `src/pages/MetaDashboard.tsx` | Rewrite: 4 sections — Connection Status, Account Cards, Alerts, Today's Metrics (cards + line chart) |
| `src/pages/MetaCampaigns.tsx` | New: Campaign table with actions (pause/activate/insights/FB link), filters, account select |
| `src/pages/MetaCallback.tsx` | OAuth callback: reads `code` param, calls mock callback, redirects to `/meta` with toast |

### Files to Edit

| File | Change |
|------|--------|
| `src/App.tsx` | Add routes: `/meta/campanhas` and `/meta/callback` |
| `src/components/layout/AppSidebar.tsx` | Change "Meta API" to section "Meta" with two items: "Dashboard" (`/meta`) and "Campanhas" (`/meta/campanhas`) |
| `src/components/shared/StatusBadge.tsx` | Add PAUSED and ARCHIVED status configs |

## Technical Notes

- **Mock OAuth**: `useConnectMeta` simulates OAuth by toggling a mock auth state. MetaCallback page reads `?code=` and calls mock endpoint.
- **Charts**: Recharts via shadcn chart components (already available) for spend line chart, impressions/clicks bar chart.
- **Campaign actions**: Pause/Activate use ConfirmDialog before mutation. "Ver no Facebook" opens `https://business.facebook.com/adsmanager` in new tab.
- **Sidebar restructure**: Replace single "Meta API" item in `outrosItems` with a new `metaItems` section rendered as "Meta" group.

## Total: ~12 new files, 3 edits

