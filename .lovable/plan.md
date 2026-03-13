

# Remove `/meta/campanhas` Page

## Files to delete
- `src/pages/MetaCampaigns.tsx`
- `src/components/meta/CampaignFilters.tsx`
- `src/components/meta/CampaignInsightsSheet.tsx`

## Files to edit

1. **`src/App.tsx`** — Remove `MetaCampaigns` import and `<Route path="/meta/campanhas">` line
2. **`src/components/layout/AppSidebar.tsx`** — Remove `{ title: 'Campanhas', url: '/meta/campanhas', icon: CreditCard }` from `metaItems`
3. **`src/hooks/useMeta.ts`** — Remove `useMetaCampaigns`, `usePauseCampaign`, `useActivateCampaign` hooks and the `MetaCampaignFilters`/`MetaCampaignStatus` type imports (keep other hooks that are still used by MetaDashboard)
4. **`src/types/meta.ts`** — Remove `MetaCampaign`, `MetaCampaignStatus`, `MetaCampaignFilters` types
5. **`src/data/mock-meta.ts`** — Remove `mockMetaCampaigns` array (keep `mockInsightsMap` if still used by MetaDashboard metrics, otherwise clean up)

The MetaDashboard page uses `useTodayMetrics` and `useSpendByAccount` which reference `mockMetaCampaigns` and `mockInsightsMap` internally — those hooks and data will be kept but the campaign-specific exports and hooks will be removed.

