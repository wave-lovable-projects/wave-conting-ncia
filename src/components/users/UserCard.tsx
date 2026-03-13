import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, KeyRound, Trash2 } from 'lucide-react';
import type { User } from '@/types/user';
import { useToggleUserStatus } from '@/hooks/useUsers';

const roleColors: Record<string, string> = {
  ADMIN: 'bg-destructive/20 text-destructive border-destructive/30',
  GESTOR: 'bg-info/20 text-info border-info/30',
  AUXILIAR: 'bg-success/20 text-success border-success/30',
};

const avatarColors: Record<string, string> = {
  ADMIN: 'bg-destructive/20 text-destructive',
  GESTOR: 'bg-info/20 text-info',
  AUXILIAR: 'bg-success/20 text-success',
};

const roleLabels: Record<string, string> = {
  ADMIN: 'Admin', GESTOR: 'Gestor', AUXILIAR: 'Auxiliar',
};

interface Props {
  user: User;
  onEdit: (u: User) => void;
  onChangePassword: (u: User) => void;
  onDelete: (id: string) => void;
}

export function UserCard({ user, onEdit, onChangePassword, onDelete }: Props) {
  const toggleStatus = useToggleUserStatus();
  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Card className="p-4 border-border hover:bg-card-hover transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className={`text-sm font-medium ${avatarColors[user.role]}`}>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{user.name}</h3>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(user)} className="gap-2"><Edit className="h-4 w-4" /> Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangePassword(user)} className="gap-2"><KeyRound className="h-4 w-4" /> Alterar Senha</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(user.id)} className="gap-2 text-destructive"><Trash2 className="h-4 w-4" /> Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className={`text-xs ${roleColors[user.role]}`}>{roleLabels[user.role]}</Badge>
        {user.squadName && <Badge variant="outline" className="text-xs bg-surface-2 border-border text-muted-foreground">{user.squadName}</Badge>}
      </div>

      {user.managerName && (
        <p className="text-xs text-muted-foreground mb-3">Gestor: {user.managerName}</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{user.isActive ? 'Ativo' : 'Inativo'}</span>
        <Switch checked={user.isActive} onCheckedChange={() => toggleStatus.mutate(user.id)} />
      </div>
    </Card>
  );
}
