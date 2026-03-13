

# Remove `/sugestoes` Page

## Files to delete
- `src/pages/Sugestoes.tsx`
- `src/components/suggestions/SuggestionCard.tsx`
- `src/components/suggestions/SuggestionDetailSheet.tsx`
- `src/components/suggestions/FloatingSuggestionButton.tsx`
- `src/hooks/useSuggestions.ts`
- `src/types/suggestion.ts`
- `src/data/mock-suggestions.ts`

## Files to edit
1. **`src/App.tsx`** — Remove `Sugestoes` import and route
2. **`src/components/layout/AppSidebar.tsx`** — Remove "Sugestões" from `outrosItems` and `Lightbulb` icon import if unused

