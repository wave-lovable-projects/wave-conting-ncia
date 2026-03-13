import { useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProfile, useUpdateProfile } from '@/hooks/useProfiles';
import type { Profile } from '@/types/profile';
import { toast } from '@/hooks/use-toast';

const mockSuppliers = [
  { id: 's1', name: 'Fornecedor Alpha' },
  { id: 's2', name: 'Fornecedor Beta' },
  { id: 's3', name: 'Fornecedor Gamma' },
];
const mockManagers = [
  { id: 'u1', name: 'João Silva' },
  { id: 'u2', name: 'Maria Souza' },
  { id: 'u3', name: 'Carlos Lima' },
];

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
  profileLink: z.string().optional(),
  supplierId: z.string().optional(),
  managerId: z.string().optional(),
  auxiliarId: z.string().optional(),
  proxy: z.string().optional(),
  status: z.enum(['ACTIVE', 'DISABLED', 'BLOCKED']),
  receivedAt: z.string().optional(),
  deactivatedAt: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
}

export function ProfileDialog({ open, onOpenChange, profile }: ProfileDialogProps) {
  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile();
  const isEditing = !!profile;

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', status: 'ACTIVE' },
  });

  useEffect(() => {
    if (open) {
      if (profile) {
        reset({
          name: profile.name, email: profile.email, password: profile.password,
          profileLink: profile.profileLink || '', supplierId: profile.supplierId || '',
          managerId: profile.managerId || '', auxiliarId: profile.auxiliarId || '',
          proxy: profile.proxy || '', status: profile.status,
          receivedAt: profile.receivedAt || '', deactivatedAt: profile.deactivatedAt || '',
        });
      } else {
        reset({ name: '', email: '', password: '', profileLink: '', supplierId: '', managerId: '', auxiliarId: '', proxy: '', status: 'ACTIVE', receivedAt: '', deactivatedAt: '' });
      }
    }
  }, [open, profile, reset]);

  const onSubmit = async (values: FormValues) => {
    const supplier = mockSuppliers.find(s => s.id === values.supplierId);
    const manager = mockManagers.find(m => m.id === values.managerId);
    const auxiliar = mockManagers.find(m => m.id === values.auxiliarId);
    const payload = {
      ...values,
      status: values.status as Profile['status'],
      supplierName: supplier?.name,
      managerName: manager?.name,
      auxiliarName: auxiliar?.name,
      supplierId: values.supplierId || undefined,
      managerId: values.managerId || undefined,
      auxiliarId: values.auxiliarId || undefined,
      profileLink: values.profileLink || undefined,
      proxy: values.proxy || undefined,
      receivedAt: values.receivedAt || undefined,
      deactivatedAt: values.deactivatedAt || undefined,
    };
    if (isEditing) {
      await updateProfile.mutateAsync({ id: profile.id, ...payload });
      toast({ title: 'Perfil atualizado' });
    } else {
      await createProfile.mutateAsync(payload);
      toast({ title: 'Perfil criado' });
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar Perfil' : 'Novo Perfil'}</SheetTitle>
          <SheetDescription>{isEditing ? 'Atualize os dados do perfil' : 'Preencha os dados do novo perfil'}</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div><Label>Nome *</Label><Input {...register('name')} />{errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}</div>
          <div><Label>Email *</Label><Input {...register('email')} />{errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}</div>
          <div><Label>Senha *</Label><Input {...register('password')} />{errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}</div>
          <div><Label>Link do Perfil</Label><Input {...register('profileLink')} placeholder="https://facebook.com/profile/..." /></div>
          <div><Label>Fornecedor</Label>
            <Controller name="supplierId" control={control} render={({ field }) => (
              <Select value={field.value || 'NONE'} onValueChange={v => field.onChange(v === 'NONE' ? '' : v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="NONE">Nenhum</SelectItem>{mockSuppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            )} />
          </div>
          <div><Label>Gestor</Label>
            <Controller name="managerId" control={control} render={({ field }) => (
              <Select value={field.value || 'NONE'} onValueChange={v => field.onChange(v === 'NONE' ? '' : v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="NONE">Nenhum</SelectItem>{mockManagers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
              </Select>
            )} />
          </div>
          <div><Label>Auxiliar</Label>
            <Controller name="auxiliarId" control={control} render={({ field }) => (
              <Select value={field.value || 'NONE'} onValueChange={v => field.onChange(v === 'NONE' ? '' : v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="NONE">Nenhum</SelectItem>{mockManagers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
              </Select>
            )} />
          </div>
          <div><Label>Proxy</Label><Input {...register('proxy')} placeholder="192.168.1.1:8080" /></div>
          <div><Label>Status *</Label>
            <Controller name="status" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Ativo</SelectItem>
                  <SelectItem value="DISABLED">Desativado</SelectItem>
                  <SelectItem value="BLOCKED">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </div>
          <div><Label>Data de Recebimento</Label><Input type="date" {...register('receivedAt')} /></div>
          <div><Label>Data de Desativação</Label><Input type="date" {...register('deactivatedAt')} /></div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">{isEditing ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
