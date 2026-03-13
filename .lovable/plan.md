
# Plan: Ad Account Data Changes + Inline Row Actions

## Part 1: Ad Account Data Changes

### 1.1 Remove "Banco" field everywhere
- **Type** (`ad-account.ts`): Remove `bank` property
- **Mock data** (`mock-ad-accounts.ts`): Remove `bank` from all records
- **Table** (`AdAccountsTable.tsx`): Remove "Banco" column header and cell
- **Dialog** (`AdAccountDialog.tsx`): Remove bank input field and schema property
- **CSV Upload** (`UploadLoteDialog.tsx`): Remove `bank` from CSV_HEADERS and template

### 1.2 Change PaymentType to CARD | AGENCY
- **Type** (`ad-account.ts`): `PaymentType = 'CARD' | 'AGENCY'`
- **Mock data**: Replace CREDIT/DEBIT/BOLETO/PIX with CARD or AGENCY
- **Table** (`AdAccountsTable.tsx`): Update `paymentLabels` to `{ CARD: 'Cartão', AGENCY: 'Agência' }`
- **Dialog** (`AdAccountDialog.tsx`): Update schema enum and Select options
- **Filters** (`AdAccountFilters.tsx`): Update payment filter options
- **BulkEditDialog**: If it has payment options, update there too (it doesn't currently)

### 1.3 Change AccountStatus to WARMING | ACTIVE | ADVERTISING | DISABLED | ROLLBACK
- **Type**: `AccountStatus = 'WARMING' | 'ACTIVE' | 'ADVERTISING' | 'DISABLED' | 'ROLLBACK'`
- **StatusBadge** (`StatusBadge.tsx`): Add `WARMING` (blue/info) and `ADVERTISING` (green/accent) entries
- **Mock data**: Update some accounts with new statuses
- **Dialog**: Update schema enum and Select options
- **Filters**: Update status filter options
- **BulkEditDialog**: Update accountStatus options
- **StatsCards**: Add cards for new statuses (Aquecendo, Anunciando)

### 1.4 Change BmStatus to ACTIVE | DISABLED only (remove BLOCKED)
- **Type**: `BmStatus = 'ACTIVE' | 'DISABLED'`
- **StatusBadge**: BLOCKED entry can remain for backward compat
- **Mock data**: Replace BLOCKED with DISABLED
- **Dialog**: Remove BLOCKED option from BM status select

### 1.5 Change "Saldo" from boolean to number (currency amount)
- **Type**: Change `balanceRemoved: boolean` to `balance: number` and add `currency: 'USD' | 'BRL'`
- **Mock data**: Replace `balanceRemoved: true/false` with `balance: 150.00, currency: 'BRL'` etc
- **Table**: Show formatted currency value instead of Sim/Não badge
- **Dialog**: Replace Switch with numeric Input + currency Select
- **StatsCards**: Update "Saldo Removido" card — perhaps show total balance
- **Filters**: Remove `balanceRemoved` filter (no longer boolean)

## Part 2: Inline Row Actions (all tables)

Move the "Ações" column to appear as a hover icon inside the "Nome" cell. The `MoreHorizontal` trigger only appears on row hover.

**Tables to update** (6 total):
1. `AdAccountsTable.tsx` — remove Ações column, add hover dropdown in Nome cell
2. `PageTable.tsx` — same pattern
3. `BMTable.tsx` — same
4. `PixelTable.tsx` — same
5. `ProfileTable.tsx` — same
6. `RequestTable.tsx` — same
7. `MetaCampaigns.tsx` — same (inline table)

**Pattern**: The Nome `<TableCell>` becomes:
```tsx
<TableCell className="font-medium text-foreground">
  <div className="flex items-center gap-1 group/name">
    <span>{name}</span>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/name:opacity-100">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>...</DropdownMenuContent>
    </DropdownMenu>
  </div>
</TableCell>
```

The `group` hover needs to be on `<TableRow>` (using `group/row`) so the icon appears when hovering anywhere on the row.

## Summary

- **Files to edit**: ~12 files
- `src/types/ad-account.ts` — type changes
- `src/data/mock-ad-accounts.ts` — data updates
- `src/components/ad-accounts/AdAccountsTable.tsx` — columns + inline actions
- `src/components/ad-accounts/AdAccountDialog.tsx` — form fields
- `src/components/ad-accounts/AdAccountFilters.tsx` — filter options
- `src/components/ad-accounts/BulkEditDialog.tsx` — status options
- `src/components/ad-accounts/StatsCards.tsx` — new status cards + balance
- `src/components/ad-accounts/UploadLoteDialog.tsx` — CSV template
- `src/components/shared/StatusBadge.tsx` — new statuses
- `src/components/pages/PageTable.tsx` — inline actions
- `src/components/business-managers/BMTable.tsx` — inline actions
- `src/components/pixels/PixelTable.tsx` — inline actions
- `src/components/profiles/ProfileTable.tsx` — inline actions
- `src/components/requests/RequestTable.tsx` — inline actions
- `src/pages/MetaCampaigns.tsx` — inline actions
- `src/hooks/useAdAccounts.ts` — update filter logic for balance
