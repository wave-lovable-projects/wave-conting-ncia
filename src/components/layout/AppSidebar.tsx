import { useMemo } from 'react';
import {
  CreditCard,
  Building2,
  UserCircle,
  FileText,
  Crosshair,
  Package,
  ClipboardList,
  Users,
  Search,
  Activity,
  Zap,
  BarChart3,
  PanelLeftClose,
  PanelLeft,
  Waves,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useUIStore } from '@/store/ui.store';
import { Badge } from '@/components/ui/badge';
import { getMockRequests } from '@/data/mock-requests';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { type LucideIcon } from 'lucide-react';

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: number;
  adminOnly?: boolean;
}

const contingenciaItems: NavItem[] = [
  { title: 'Contas de Anúncio', url: '/', icon: CreditCard },
  { title: 'Business Managers', url: '/bms', icon: Building2 },
  { title: 'Perfis', url: '/perfis', icon: UserCircle },
  { title: 'Páginas', url: '/paginas', icon: FileText },
  { title: 'Pixels', url: '/pixels', icon: Crosshair },
];

const outrosItems: NavItem[] = [
  { title: 'Diagnóstico', url: '/diagnostico', icon: Search },
  { title: 'Log de Atividades', url: '/atividades', icon: Activity },
];

const metaItems: NavItem[] = [
  { title: 'Dashboard', url: '/meta', icon: Zap },
];

function SidebarNavSection({
  label,
  items,
  collapsed,
  userRole,
}: {
  label: string;
  items: NavItem[];
  collapsed: boolean;
  userRole?: string;
}) {
  const filteredItems = items.filter(
    (item) => !item.adminOnly || userRole === 'ADMIN'
  );

  if (filteredItems.length === 0) return null;

  return (
    <SidebarGroup>
      {!collapsed && (
        <SidebarGroupLabel className="text-muted-foreground text-xs font-semibold tracking-wider uppercase px-3">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {filteredItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === '/'}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
                        activeClassName="bg-surface-2 text-foreground font-medium"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                ) : (
                  <NavLink
                    to={item.url}
                    end={item.url === '/'}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
                    activeClassName="bg-surface-2 text-foreground font-medium"
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.title}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <Badge variant="default" className="ml-auto text-[10px] h-5 min-w-5 flex items-center justify-center">
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';
  const user = useUIStore((s) => s.user);

  const gestaoItems: NavItem[] = useMemo(() => {
    const requests = getMockRequests();
    const isAdmin = user?.role === 'ADMIN';
    const badgeCount = isAdmin
      ? requests.filter((r) => r.status === 'PENDENTE').length
      : requests.filter((r) => r.status === 'PRONTA').length;

    return [
      { title: 'Fornecedores', url: '/fornecedores', icon: Package },
      { title: 'Solicitações', url: '/solicitacoes', icon: ClipboardList, badge: badgeCount },
      { title: 'Dashboard Solic.', url: '/solicitacoes/dashboard', icon: BarChart3 },
      { title: 'Usuários', url: '/usuarios', icon: Users, adminOnly: true },
    ];
  }, [user?.role]);

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waves className="h-6 w-6 text-primary" />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground tracking-tight">
                  WAVE
                </span>
                <span className="text-[10px] text-muted-foreground tracking-widest uppercase -mt-1">
                  Contingência
                </span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 gap-1">
        <SidebarNavSection label="Contingência" items={contingenciaItems} collapsed={collapsed} userRole={user?.role} />
        <SidebarNavSection label="Gestão" items={gestaoItems} collapsed={collapsed} userRole={user?.role} />
        <SidebarNavSection label="Outros" items={outrosItems} collapsed={collapsed} userRole={user?.role} />
        <SidebarNavSection label="Meta" items={metaItems} collapsed={collapsed} userRole={user?.role} />
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
