import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from './NotificationBell';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { User, KeyRound, LogOut } from 'lucide-react';
import { ChangePasswordDialog } from '@/components/users/ChangePasswordDialog';

const routeNames: Record<string, string> = {
  '/': 'Contas de Anúncio',
  '/bms': 'Business Managers',
  '/perfis': 'Perfis',
  '/paginas': 'Páginas',
  '/pixels': 'Pixels',
  '/fornecedores': 'Fornecedores',
  '/solicitacoes': 'Solicitações',
  '/diagnostico': 'Diagnóstico',
  '/sugestoes': 'Sugestões',
  '/usuarios': 'Usuários',
  '/atividades': 'Log de Atividades',
  '/meta': 'Dashboard Meta API',
};

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const currentPage = routeNames[location.pathname] || 'Página';
  const [pwDialogOpen, setPwDialogOpen] = useState(false);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <>
      <header className="h-14 border-b border-border bg-surface-0 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="lg:hidden text-muted-foreground" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground font-medium">
                  {currentPage}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-surface-2 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-surface-3 text-foreground text-xs font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-foreground hidden sm:inline">
                  {user?.name || 'Usuário'}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2 cursor-pointer" asChild>
                <Link to="/usuarios"><User className="h-4 w-4" /> Ver perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setPwDialogOpen(true)}>
                <KeyRound className="h-4 w-4" />
                Alterar senha
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="gap-2 cursor-pointer text-destructive">
                <LogOut className="h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ChangePasswordDialog
        open={pwDialogOpen}
        onOpenChange={setPwDialogOpen}
        userId={user?.id ?? null}
        userName={user?.name}
      />
    </>
  );
}
