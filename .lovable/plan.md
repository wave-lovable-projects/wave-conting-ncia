

# Filtros de período no Dashboard + Rota raiz para Perfis

## 1. Rota raiz → Perfis
**`src/App.tsx`**: Trocar `path="/"` de `ContasAnuncio` para `Perfis`. Contas de Anúncio vai para `/contas`.

**`src/components/layout/AppSidebar.tsx`**: Atualizar URL de Perfis para `/` e Contas de Anúncio para `/contas`.

## 2. Filtros de período no Dashboard
**`src/pages/SolicitacoesDashboard.tsx`**:
- Adicionar dois date pickers (data início / data fim) na page header ou logo abaixo
- Filtrar `visibleAll` pelo campo `createdAt` dentro do período selecionado
- Usar Popover + Calendar (shadcn) com `pointer-events-auto`
- Passar requests filtrados ao `RequestDashboard`

## Arquivos editados
- `src/App.tsx`
- `src/components/layout/AppSidebar.tsx`
- `src/pages/SolicitacoesDashboard.tsx`

