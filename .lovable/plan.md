

# 3 Management Modules Implementation

## Overview
Implement Fornecedores (`/fornecedores`), Solicitações (`/solicitacoes`), and Usuários (`/usuarios`) following established patterns. Key differences from contingency modules: Fornecedores uses card grid + charts + complaints system; Solicitações has list/kanban dual view; Usuários has role-based grouping with admin-only access.

## Dependencies
- `recharts` — already installed, used for Fornecedores charts tab
- `@dnd-kit/core` + `@dnd-kit/sortable` — need to install for Kanban drag-and-drop in Solicitações

## Files to Create

### Module 1: Fornecedores (17 files)

| File | Purpose |
|------|---------|
| `src/types/supplier.ts` | Supplier, Complaint, ComplaintComment interfaces |
| `src/data/mock-suppliers.ts` | ~6 suppliers with metrics + ~8 complaints with comments |
| `src/hooks/useSuppliers.ts` | CRUD hooks + useSupplierComplaints, useCreateComplaint, useUpdateComplaintStatus |
| `src/components/suppliers/SupplierCard.tsx` | Card showing name, status, asset type tags, asset counts |
| `src/components/suppliers/SupplierDialog.tsx` | Dialog: Name*, Types (multiselect checkboxes), Status* |
| `src/components/suppliers/SupplierGrid.tsx` | Grid of SupplierCards with search/status filter |
| `src/components/suppliers/SupplierCharts.tsx` | 3 charts: bar (accounts/supplier), bar (profiles/supplier), pie (total assets) using Recharts |
| `src/components/suppliers/ComplaintCard.tsx` | Card: supplier name, asset type, priority badge, status, date |
| `src/components/suppliers/ComplaintFilters.tsx` | Supplier, status, priority selects |
| `src/components/suppliers/ComplaintDialog.tsx` | Dialog: Supplier*, Asset Type*, Description*, Priority*, Assignee, Attachments |
| `src/components/suppliers/ComplaintDetailSheet.tsx` | Sheet: full complaint details + status change + comments section |
| `src/components/suppliers/ComplaintsList.tsx` | Filtered list of ComplaintCards |
| `src/pages/Fornecedores.tsx` | Page with 3 tabs: Fornecedores, Gráficos, Reclamações |

### Module 2: Solicitações (12 files)

| File | Purpose |
|------|---------|
| `src/types/request.ts` | Request, RequestComment, RequestFilters interfaces |
| `src/data/mock-requests.ts` | ~12 requests across all statuses + comments + status history |
| `src/hooks/useRequests.ts` | useRequests, CRUD, useUpdateRequestStatus, useRequestComments, useCreateRequestComment |
| `src/components/requests/RequestFilters.tsx` | Type, status, priority, requester, assignee selects |
| `src/components/requests/RequestTable.tsx` | Table view: Title, Type tag, Priority, Status, Requester, Assignee, Due date, Actions |
| `src/components/requests/RequestKanbanBoard.tsx` | 4-column kanban (Pendente, Em Andamento, Concluída, Rejeitada) with drag-and-drop |
| `src/components/requests/RequestKanbanCard.tsx` | Kanban card with priority-colored left border |
| `src/components/requests/RequestDialog.tsx` | Sheet: Title*, Description*, Type*, Priority*, Assignee, Due date (datepicker), Attachments |
| `src/components/requests/RequestDetailSheet.tsx` | Sheet: read-only fields, status change (admin), status history, comments with file upload |
| `src/pages/Solicitacoes.tsx` | Page with list/kanban toggle, filters, stats cards |

### Module 3: Usuários (8 files)

| File | Purpose |
|------|---------|
| `src/types/user.ts` | User interface, UserFilters |
| `src/data/mock-users.ts` | ~10 users across ADMIN/GESTOR/AUXILIAR roles |
| `src/hooks/useUsers.ts` | useUsers, CRUD, useToggleUserStatus, useChangePassword |
| `src/components/users/UserCard.tsx` | Card: avatar (initials, role-colored), name, email, role badge, squad, active toggle, actions menu |
| `src/components/users/UserFilters.tsx` | Search, role, squad, status filters |
| `src/components/users/UserDialog.tsx` | Dialog: Name*, Email*, Password* (create only), Role*, Squad, Manager (if AUXILIAR) |
| `src/components/users/ChangePasswordDialog.tsx` | Dialog: New password*, Confirm*, min 8 chars validation |
| `src/pages/Usuarios.tsx` | Admin-only page with role-grouped sections, redirect non-admin with toast |

### Header Updates

| File | Purpose |
|------|---------|
| `src/components/layout/Header.tsx` | Wire "Ver perfil" and "Alterar senha" dropdown items to UserProfileDialog and ChangePasswordDialog |

## Technical Approach

- **Same mock data pattern**: module-level `let` arrays with get/set helpers, TanStack Query with `Promise.resolve()`
- **Kanban drag-and-drop**: Install `@dnd-kit/core` + `@dnd-kit/sortable`. Use `DndContext` with `DragOverlay` for smooth column transitions. On `onDragEnd`, call `useUpdateRequestStatus` mutation.
- **Charts**: Use Recharts `BarChart` and `PieChart` with shadcn chart wrapper components already available
- **Admin guard for Usuarios**: Check `useUIStore` user role at page level, `Navigate` to `/` with toast if not ADMIN
- **Supplier metrics**: Computed from mock data counts in other modules (ad-accounts, profiles, BMs, pages, pixels)
- **Complaint comments**: Inline in mock data, managed via mutations that update the mock array

## Total: ~37 new files, 3 page rewrites, 1 header update, 1 package install

