import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChangePassword } from '@/hooks/useUsers';
import { toast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  userName?: string;
}

export function ChangePasswordDialog({ open, onOpenChange, userId, userName }: Props) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const changePw = useChangePassword();

  const reset = () => { setPassword(''); setConfirm(''); };

  const handleSubmit = async () => {
    if (password.length < 8) { toast({ title: 'Senha deve ter no mínimo 8 caracteres', variant: 'destructive' }); return; }
    if (password !== confirm) { toast({ title: 'As senhas não coincidem', variant: 'destructive' }); return; }
    if (!userId) return;
    try {
      await changePw.mutateAsync({ id: userId, password });
      toast({ title: 'Senha alterada com sucesso' });
      reset();
      onOpenChange(false);
    } catch { toast({ title: 'Erro ao alterar senha', variant: 'destructive' }); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>Alterar Senha{userName ? ` — ${userName}` : ''}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nova Senha *</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" />
          </div>
          <div className="space-y-2">
            <Label>Confirmar Nova Senha *</Label>
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repita a senha" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={changePw.isPending}>Alterar Senha</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
