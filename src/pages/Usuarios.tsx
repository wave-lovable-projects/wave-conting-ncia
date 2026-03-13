import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { UserCard } from '@/components/users/UserCard';
import { UserFiltersBar } from '@/components/users/UserFilters';
import { UserDialog } from '@/components/users/UserDialog';
import { ChangePasswordDialog } from '@/components/users/ChangePasswordDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { useUIStore } from '@/store/ui.store';
import { toast } from '@/hooks/use-toast';
import type { User, UserFilters } from '@/types/user';
import { Plus } from 'lucide-react';

export default function Usuarios() {
  const navigate = useNavigate();
  const currentUser = useUIStore((s) => s.user);
  const [filters, setFilters] = useState<UserFilters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pwUserId, setPwUserId] = useState<string | null>(null);
  const [pwUserName, setPwUserName] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: users } = useUsers(filters);
  const deleteMutation = useDeleteUser();

  useEffect(() => {
    if (currentUser && currentUser.role !== 'ADMIN') {
      toast({ title: 'Acesso não permitido', variant: 'destructive' });
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (currentUser && currentUser.role !== 'ADMIN') return null;

  const admins = users?.filter((u) => u.role === 'ADMIN') ?? [];
  const gestores = users?.filter((u) => u.role === 'GESTOR') ?? [];
  const auxiliares = users?.filter((u) => u.role === 'AUXILIAR') ?? [];

  const handleEdit = (u: User) => { setEditingUser(u); setDialogOpen(true); };
  const handleChangePassword = (u: User) => { setPwUserId(u.id); setPwUserName(u.name); };
  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
    toast({ title: 'Usuário excluído' });
  };

  const renderSection = (title: string, sectionUsers: User[]) => (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-3">{title} ({sectionUsers.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sectionUsers.map((u) => (
          <UserCard key={u.id} user={u} onEdit={handleEdit} onChangePassword={handleChangePassword} onDelete={setDeleteId} />
        ))}
      </div>
      {sectionUsers.length === 0 && (
        <p className="text-sm text-muted-foreground py-4">Nenhum usuário nesta categoria</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuários"
        actions={
          <Button onClick={() => { setEditingUser(null); setDialogOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Novo Usuário
          </Button>
        }
      />

      <UserFiltersBar filters={filters} onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))} />

      <div className="space-y-8">
        {renderSection('Administradores', admins)}
        {renderSection('Gestores', gestores)}
        {renderSection('Auxiliares', auxiliares)}
      </div>

      <UserDialog open={dialogOpen} onOpenChange={setDialogOpen} user={editingUser} />
      <ChangePasswordDialog open={!!pwUserId} onOpenChange={(v) => { if (!v) setPwUserId(null); }} userId={pwUserId} userName={pwUserName} />
      <ConfirmDialog
        open={!!deleteId}
        title="Excluir Usuário"
        description="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        variant="danger"
      />
    </div>
  );
}
