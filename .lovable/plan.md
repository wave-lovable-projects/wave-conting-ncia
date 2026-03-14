

# Visões Diferenciadas por Role na Página de Solicitações

## Arquivos criados (1)

### `src/hooks/useRequestPermissions.ts`
Hook que recebe `userRole` e `userId` e retorna:
```typescript
{
  canChangeStatus: boolean,        // ADMIN only
  canViewSupplierInfo: boolean,    // ADMIN only
  canViewAllRequests: boolean,     // ADMIN only
  canLinkAssets: boolean,          // ADMIN only
  canAssign: boolean,              // ADMIN only
  canCancelOwn: boolean,           // GESTOR/AUXILIAR — only own PENDENTE
  visibleStatuses: RequestStatus[], // ADMIN: all 7, GESTOR: simplified 4
  simplifiedStatusLabel: (s: RequestStatus) => string, // Maps internal statuses to simplified labels for GESTOR
  pageTitle: string,               // "Gestão de Solicitações" vs "Minhas Solicitações"
}
```

For GESTOR/AUXILIAR, `simplifiedStatusLabel` maps:
- PENDENTE → "Meu Pedido"
- APROVADA/SOLICITADA_FORNECEDOR/RECEBIDA/EM_AQUECIMENTO → "Em Preparação"
- PRONTA → "Pronto"
- ENTREGUE → "Entregue"

## Arquivos editados (6)

### `src/pages/LoginPage.tsx`
- Add second mock login: `gestor@wave.com` / `123456` → `{ id: 'u2', name: 'Carlos Silva', email: 'gestor@wave.com', role: 'GESTOR', squadId: 'squad-alpha' }`
- Update demo hint to show both credentials

### `src/pages/Solicitacoes.tsx`
- Import and use `useRequestPermissions(user?.role, user?.id)`
- Title: `permissions.pageTitle`
- Filter requests by `requesterId === user.id` when `!permissions.canViewAllRequests`
- Hide "Avançar Status" actions when `!permissions.canChangeStatus`
- Show only "Cancelar" for own PENDENTE requests when `canCancelOwn`
- Hide supplier column in table when `!permissions.canViewSupplierInfo`
- Pass permissions down to child components
- Dashboard: pass `isAdmin` prop — GESTOR gets simplified dashboard (only their numbers)

### `src/components/requests/RequestDetailSheet.tsx`
- Import `useRequestPermissions`
- Hide "Fornecedor" tab when `!canViewSupplierInfo`
- Hide status action buttons in footer when `!canChangeStatus` (except cancel own pending)
- Pass permissions to OverviewTab

### `src/components/requests/detail-tabs/OverviewTab.tsx`
- Accept optional `permissions` prop
- Hide "Mudar Status" select when `!canChangeStatus`
- Hide "Responsável" select when `!canAssign`
- Use simplified pipeline for GESTOR (4 steps instead of 7)
- Hide supplier cost info when `!canViewSupplierInfo`

### `src/components/requests/RequestKanbanBoard.tsx`
- Accept optional `columns` prop to override `pipelineColumns`
- For GESTOR: show 4 columns (Meu Pedido, Em Preparação, Pronto, Entregue) grouping the internal statuses
- Disable drag-and-drop when user can't change status

### `src/components/requests/RequestTable.tsx`
- Accept optional `hideSupplierColumn` and `hideAdvanceAction` props
- Conditionally hide supplier column header + cells
- Conditionally hide "Avançar Status" in dropdown menu

## Fluxo de implementação

1. Create `useRequestPermissions` hook
2. Add gestor mock login to `LoginPage`
3. Update `Solicitacoes.tsx` with role-based filtering and conditional UI
4. Update `RequestDetailSheet` to hide tabs/actions
5. Update `OverviewTab` with simplified pipeline
6. Update `RequestKanbanBoard` with grouped columns
7. Update `RequestTable` with conditional columns/actions

