import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateUser, useUpdateUser, useUsers } from '@/hooks/useUsers';
import { mockSquads } from '@/data/mock-users';
import { toast } from '@/hooks/use-toast';
import type { User } from '@/types/user';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

export function UserDialog({ open, onOpenChange, user }: Props) {
  const isEditing = !!user;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('AUXILIAR');
  const [squadId, setSquadId] = useState('');
  const [managerId, setManagerId] = useState('');

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const { data: allUsers } = useUsers();
  const gestores = allUsers?.filter((u) => u.role === 'GESTOR') ?? [];

  useEffect(() => {
    if (user) {
      setName(user.name); setEmail(user.email); setRole(user.role);
      setSquadId(user.squadId ?? ''); setManagerId(user.managerId ?? '');
    } else {
      setName(''); setEmail(''); setPassword(''); setRole('AUXILIAR'); setSquadId(''); setManagerId('');
    }
  }, [user, open]);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) { toast({ title: 'Nome e Email são obrigatórios', variant: 'destructive' }); return; }
    if (!isEditing && password.length < 8) { toast({ title: 'Senha deve ter no mínimo 8 caracteres', variant: 'destructive' }); return; }

    const squad = mockSquads.find((s) => s.id === squadId);
    const manager = gestores.find((g) => g.id === managerId);

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: user.id, name, email, role: role as any,
          squadId: squadId || undefined, squadName: squad?.name,
          managerId: role === 'AUXILIAR' ? managerId || undefined : undefined,
          managerName: role === 'AUXILIAR' ? manager?.name : undefined,
        });
        toast({ title: 'Usuário atualizado' });
      } else {
        await createMutation.mutateAsync({
          name, email, role: role as any, isActive: true, password,
          squadId: squadId || undefined, squadName: squad?.name,
          managerId: role === 'AUXILIAR' ? managerId || undefined : undefined,
          managerName: role === 'AUXILIAR' ? manager?.name : undefined,
        });
        toast({ title: 'Usuário criado' });
      }
      onOpenChange(false);
    } catch { toast({ title: 'Erro ao salvar', variant: 'destructive' }); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" />
          </div>
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
          </div>
          {!isEditing && (
            <div className="space-y-2">
              <Label>Senha *</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" />
            </div>
          )}
          <div className="space-y-2">
            <Label>Role *</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="GESTOR">Gestor</SelectItem>
                <SelectItem value="AUXILIAR">Auxiliar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Squad</Label>
            <Select value={squadId || 'NONE'} onValueChange={(v) => setSquadId(v === 'NONE' ? '' : v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">Nenhuma</SelectItem>
                {mockSquads.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {role === 'AUXILIAR' && (
            <div className="space-y-2">
              <Label>Gestor Vinculado</Label>
              <Select value={managerId || 'NONE'} onValueChange={(v) => setManagerId(v === 'NONE' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Nenhum</SelectItem>
                  {gestores.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
            {isEditing ? 'Salvar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
