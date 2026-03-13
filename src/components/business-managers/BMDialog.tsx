import { useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateBM, useUpdateBM } from '@/hooks/useBusinessManagers';
import { bmFunctions } from '@/data/mock-business-managers';
import type { BusinessManager } from '@/types/business-manager';
import { toast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

const mockSuppliers = [
  { id: 's1', name: 'Fornecedor Alpha' },
  { id: 's2', name: 'Fornecedor Beta' },
  { id: 's3', name: 'Fornecedor Gamma' },
];

const mockGestores = [
  { id: 'u1', name: 'João Silva' },
  { id: 'u2', name: 'Maria Souza' },
  { id: 'u3', name: 'Carlos Lima' },
];

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  bmId: z.string().min(1, 'BM ID obrigatório'),
  function: z.string().min(1, 'Função obrigatória'),
  status: z.enum(['ACTIVE', 'DISABLED', 'BLOCKED']),
  supplierId: z.string().optional(),
  receivedAt: z.string().optional(),
  blockedAt: z.string().optional(),
  gestorIds: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

interface BMDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bm: BusinessManager | null;
}

export function BMDialog({ open, onOpenChange, bm }: BMDialogProps) {
  const createBM = useCreateBM();
  const updateBM = useUpdateBM();
  const isEditing = !!bm;

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', bmId: '', function: 'Anúncios', status: 'ACTIVE', supplierId: '', receivedAt: '', blockedAt: '', gestorIds: [] },
  });

  useEffect(() => {
    if (open) {
      if (bm) {
        reset({
          name: bm.name,
          bmId: bm.bmId,
          function: bm.function,
          status: bm.status,
          supplierId: bm.supplierId || '',
          receivedAt: bm.receivedAt || '',
          blockedAt: bm.blockedAt || '',
          gestorIds: bm.gestores.map(g => g.id),
        });
      } else {
        reset({ name: '', bmId: '', function: 'Anúncios', status: 'ACTIVE', supplierId: '', receivedAt: '', blockedAt: '', gestorIds: [] });
      }
    }
  }, [open, bm, reset]);

  const selectedGestorIds = watch('gestorIds');

  const onSubmit = async (values: FormValues) => {
    const supplier = mockSuppliers.find(s => s.id === values.supplierId);
    const gestores = mockGestores.filter(g => values.gestorIds.includes(g.id));
    const payload = {
      name: values.name,
      bmId: values.bmId,
      function: values.function,
      status: values.status as BusinessManager['status'],
      supplierId: values.supplierId || undefined,
      supplierName: supplier?.name,
      receivedAt: values.receivedAt || undefined,
      blockedAt: values.blockedAt || undefined,
      gestores,
    };
    if (isEditing) {
      await updateBM.mutateAsync({ id: bm.id, ...payload });
      toast({ title: 'BM atualizada' });
    } else {
      await createBM.mutateAsync(payload);
      toast({ title: 'BM criada' });
    }
    onOpenChange(false);
  };

  const toggleGestor = (id: string) => {
    const current = selectedGestorIds;
    setValue('gestorIds', current.includes(id) ? current.filter(g => g !== id) : [...current, id]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar BM' : 'Nova Business Manager'}</SheetTitle>
          <SheetDescription>{isEditing ? 'Atualize os dados da BM' : 'Preencha os dados para criar uma nova BM'}</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div>
            <Label>Nome *</Label>
            <Input {...register('name')} />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label>BM ID *</Label>
            <Input {...register('bmId')} />
            {errors.bmId && <p className="text-xs text-destructive mt-1">{errors.bmId.message}</p>}
          </div>
          <div>
            <Label>Função *</Label>
            <Controller name="function" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {bmFunctions.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
          </div>
          <div>
            <Label>Status *</Label>
            <Controller name="status" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Ativa</SelectItem>
                  <SelectItem value="DISABLED">Desativada</SelectItem>
                  <SelectItem value="BLOCKED">Bloqueada</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </div>
          <div>
            <Label>Fornecedor</Label>
            <Controller name="supplierId" control={control} render={({ field }) => (
              <Select value={field.value || 'NONE'} onValueChange={v => field.onChange(v === 'NONE' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Nenhum</SelectItem>
                  {mockSuppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
          </div>
          <div>
            <Label>Data de Recebimento</Label>
            <Input type="date" {...register('receivedAt')} />
          </div>
          <div>
            <Label>Data de Block</Label>
            <Input type="date" {...register('blockedAt')} />
          </div>
          <div>
            <Label>Gestores</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {mockGestores.map(g => {
                const selected = selectedGestorIds.includes(g.id);
                return (
                  <Badge
                    key={g.id}
                    variant={selected ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleGestor(g.id)}
                  >
                    {g.name}
                    {selected && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">{isEditing ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
