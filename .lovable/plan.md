

# 3 "OUTROS" Modules Implementation

## Overview
Implement Diagnóstico (`/diagnostico`), Log de Atividades (`/atividades`), and Sugestões (`/sugestoes`). Plus a floating suggestion button in AppShell.

## Dependencies
- `@xyflow/react` — for the connection graph in Diagnóstico

## Files to Create/Edit

### Module 1: Diagnóstico (10 files)

| File | Purpose |
|------|---------|
| `src/types/diagnostic.ts` | Incident, DiagnosticLink, DiagnosticNode, DiagnosticFilters interfaces |
| `src/data/mock-diagnostics.ts` | ~10 incidents, ~12 links, graph nodes/edges derived from mock assets |
| `src/hooks/useDiagnostics.ts` | useIncidents, useCreateIncident, useDeleteIncident, useDiagnosticLinks, useCreateDiagnosticLink, useDeleteDiagnosticLink, useConnectionGraph |
| `src/components/diagnostics/ConnectionGraph.tsx` | React Flow graph with color-coded nodes by asset type, edge labels, click-to-select node, zoom controls |
| `src/components/diagnostics/NodeDetailPanel.tsx` | Side panel showing selected node's asset details + related incidents |
| `src/components/diagnostics/AddLinkDialog.tsx` | Dialog: Source asset (type + search), Target asset (type + search), Relationship text |
| `src/components/diagnostics/IncidentTimeline.tsx` | Vertical timeline of incidents with filters (asset type, restriction type, date range) |
| `src/components/diagnostics/AddIncidentDialog.tsx` | Dialog: Date*, Asset Type*, Asset (dynamic select), Restriction Type*, FB Reason, Suspected Cause, Linked Elements (multiselect), Notes |
| `src/components/diagnostics/CorrelationMatrix.tsx` | Heatmap table: assets × assets, cell intensity = shared incident count, click to see details |
| `src/pages/Diagnostico.tsx` | 3-tab page: Grafo de Conexões, Incidentes, Correlação |

### Module 2: Log de Atividades (5 files)

| File | Purpose |
|------|---------|
| `src/types/activity.ts` | ActivityLog interface, ActivityFilters |
| `src/data/mock-activities.ts` | ~30 activity logs across all entity types and actions |
| `src/hooks/useActivities.ts` | useActivityLogs(filters, pagination), useActivitySummary |
| `src/components/activities/ActivityFilters.tsx` | Search, entity type multiselect, user select, date range picker, clear button |
| `src/pages/Atividades.tsx` | Collapsible summary panel (top users, top entities) + filtered/paginated table with expandable details |

### Module 3: Sugestões (7 files)

| File | Purpose |
|------|---------|
| `src/types/suggestion.ts` | Suggestion, SuggestionComment, SuggestionFilters interfaces |
| `src/data/mock-suggestions.ts` | ~8 suggestions with votes and comments |
| `src/hooks/useSuggestions.ts` | useSuggestions, useCreateSuggestion, useVoteSuggestion, useSuggestionComments, useCreateSuggestionComment, useUpdateSuggestionStatus |
| `src/components/suggestions/SuggestionCard.tsx` | Card: title, truncated description, status badge, page, author, date, vote buttons (👍👎), admin status select |
| `src/components/suggestions/SuggestionDetailSheet.tsx` | Sheet: full details, votes, attachments, status history (admin), comments section |
| `src/components/suggestions/FloatingSuggestionButton.tsx` | Fixed bottom-right Lightbulb button, opens NewSuggestionDialog with auto-filled current route |
| `src/pages/Sugestoes.tsx` | Filters + suggestion card list |

### Files to Edit

| File | Change |
|------|--------|
| `src/components/layout/AppShell.tsx` | Add `FloatingSuggestionButton` component |
| `src/components/shared/StatusBadge.tsx` | Add ANALYZING status config |

## Technical Approach

- **Same mock data pattern** as all other modules: module-level arrays, get/set helpers, TanStack Query hooks with simulated delays
- **React Flow graph**: Custom node component with colored borders per asset type. Mock graph data derived from existing mock assets (ad accounts, BMs, profiles, pages, pixels). Minimap + controls.
- **Correlation matrix**: Build from incidents — for each pair of assets that share incidents, count overlaps. Render as HTML table with bg-opacity scaled by count.
- **Activity logs**: Read-only table, no CRUD. Expandable detail rows showing field-level changes.
- **Floating button**: `position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 50`. Uses `useLocation()` to auto-fill page field.
- **Vote system**: Toggle vote via mutation, optimistic update on query cache.

## Total: ~22 new files, 3 page rewrites, 2 component edits, 1 package install

