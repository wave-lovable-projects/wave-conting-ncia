

# Dashboard independente e reordenação da sidebar "Gestão"

## Alterações

### 1. `src/components/layout/AppSidebar.tsx`
- Reordenar `gestaoItems` para: Dashboard, Solicitações, Fornecedores, Usuários
- Renomear "Dashboard Solic." para "Dashboard"
- Mudar URL de `/solicitacoes/dashboard` para `/dashboard`

### 2. `src/App.tsx`
- Mudar rota de `/solicitacoes/dashboard` para `/dashboard`

### 3. `src/pages/SolicitacoesDashboard.tsx`
- Renomear título para "Dashboard"
- Remover botão "Voltar" que linka para solicitações
- Padronizar estrutura com as outras páginas (apenas `PageHeader` + conteúdo)

