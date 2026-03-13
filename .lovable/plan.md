

# Wave Contingência — Full Application Structure

## Important Note
This project runs on **Vite + React**, not Next.js (Lovable does not support Next.js). All routing will use React Router DOM as already configured. The rest of the stack (Zustand, Axios, React Hook Form + Zod, etc.) will be added as requested.

## New Dependencies
- `zustand` — global UI state
- `axios` — HTTP client

## File Structure

```text
src/
├── lib/
│   ├── api.ts              # Axios instance + interceptors
│   └── auth.ts             # Token helpers (localStorage)
├── store/
│   └── ui.store.ts         # Zustand store (user, sidebar, modal)
├── hooks/
│   └── useAuth.ts          # Login/logout/user hook
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx     # Main layout wrapper
│   │   ├── AppSidebar.tsx   # Sidebar with 3 sections
│   │   ├── Header.tsx       # Breadcrumb + avatar dropdown
│   │   └── NotificationBell.tsx
│   ├── shared/
│   │   ├── StatusBadge.tsx
│   │   ├── PriorityBadge.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── PageHeader.tsx
│   │   └── DataTablePagination.tsx
│   └── auth/
│       └── ProtectedRoute.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── ContasAnuncio.tsx     # / (home)
│   ├── BusinessManagers.tsx  # /bms
│   ├── Perfis.tsx
│   ├── Paginas.tsx
│   ├── Pixels.tsx
│   ├── Fornecedores.tsx
│   ├── Solicitacoes.tsx
│   ├── Diagnostico.tsx
│   ├── Sugestoes.tsx
│   ├── Usuarios.tsx
│   ├── Atividades.tsx
│   └── MetaDashboard.tsx
└── App.tsx                  # Updated routes
```

## Key Implementation Details

### Auth Layer
- `lib/auth.ts`: get/set/clear tokens in localStorage, `isAuthenticated()` check
- `lib/api.ts`: Axios with `VITE_API_URL`, request interceptor adds Bearer token, response interceptor catches 401 → tries refresh → clears & redirects on failure
- `hooks/useAuth.ts`: exposes `user`, `login()`, `logout()` — stores user in Zustand
- `ProtectedRoute`: checks `isAuthenticated()`, redirects to `/login` if false

### Zustand Store
- `user` object (id, name, email, role, squadId) | null
- `sidebarCollapsed`, `activeModal`, and setters

### Login Page
- Centered card with WAVE branding (~ symbol + "CONTINGÊNCIA" subtitle)
- React Hook Form + Zod validation (email required+valid, password min 6)
- Loading state on button, toast on error
- "Esqueci minha senha" link → /reset-password

### Reset Password Page
- Email field, submit shows confirmation message, link back to /login

### AppShell Layout
- Uses SidebarProvider + Sidebar from shadcn
- Responsive: collapses below 1024px
- Renders Header + `<Outlet />` for child routes

### AppSidebar
- WAVE logo at top with ~ icon
- 3 sections: CONTINGÊNCIA (5 items), GESTÃO (3 items, Usuários admin-only), OUTROS (4 items)
- Solicitações shows badge count
- Active route highlighting via NavLink
- Collapsed mode: icons only with tooltips

### Header
- Left: breadcrumb from current route
- Right: NotificationBell + Avatar dropdown (Ver perfil, Alterar senha, Sair)

### NotificationBell
- Bell icon with unread count badge
- Popover with mock notifications list (title, body, relative time via date-fns)
- "Marcar todas como lidas" + "Ver todas" buttons
- Updates document.title with `(N) WAVE` when unread > 0

### Shared Components
- StatusBadge: maps status strings to colored badges (ACTIVE→green, DISABLED→red, etc.)
- PriorityBadge: LOW→gray, MEDIUM→blue, HIGH→orange, URGENT→red with pulse-glow animation
- LoadingSpinner, EmptyState, ConfirmDialog, PageHeader, DataTablePagination

### Placeholder Pages
Each protected route renders a centered "Em construção" state with the section name and a construction icon.

## Routing in App.tsx
- Public: `/login`, `/reset-password`
- Protected (wrapped in ProtectedRoute + AppShell layout): all 12 protected routes
- Catch-all `*` → NotFound

