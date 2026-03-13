import { useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePage, useUpdatePage } from '@/hooks/usePages';
import { getMockBMs } from '@/data/mock-business-managers';
import type { FacebookPage } from '@/types/page';
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
  pageId: z.string().min(1, 'Page ID obrigatório'),
  bmId: z.string().optional(),
  originBmId: z.string().optional(),
  supplierId: z.string().optional(),
  status: z.enum(['ACTIVE', 'DISABLED', 'BLOCKED']),
  receivedAt: z.string().optional(),
  blockedAt: z.string().optional(),
  usedAt: z.string().optional(),
  managerId: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface PageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: FacebookPage | null;
}

export function PageDialog({ open, onOpenChange, page }: PageDialogProps) {
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();
  const isEditing = !!page;
  const bms = getMockBMs();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', pageId: '', status: 'ACTIVE' },
  });

  useEffect(() => {
    if (open) {
      if (page) {
        reset({ name: page.name, pageId: page.pageId, bmId: page.bmId || '', originBmId: page.originBmId || '', supplierId: page.supplierId || '', status: page.status, receivedAt: page.receivedAt || '', blockedAt: page.blockedAt || '', usedAt: page.usedAt || '', managerId: page.managerId || '', notes: page.notes || '' });
      } else {
        reset({ name: '', pageId: '', bmId: '', originBmId: '', supplierId: '', status: 'ACTIVE', receivedAt: '', blockedAt: '', usedAt: '', managerId: '', notes: '' });
      }
    }
  }, [open, page, reset]);

  const onSubmit = async (values: FormValues) => {
    const supplier = mockSuppliers.find(s => s.id === values.supplierId);
    const bm = bms.find(b => b.id === values.bmId);
    const manager = mockManagers.find(m => m.id === values.managerId);
    const payload = {
      name: values.name,
      pageId: values.pageId,
      status: values.status as FacebookPage['status'],
      bmId: values.bmId || undefined,
      bmName: bm?.name,
      originBmId: values.originBmId || undefined,
      supplierId: values.supplierId || undefined,
      supplierName: supplier?.name,
      managerId: values.managerId || undefined,
      managerName: manager?.name,
      receivedAt: values.receivedAt || undefined,
      blockedAt: values.blockedAt || undefined,
      usedAt: values.usedAt || undefined,
      notes: values.notes || undefined,
    };
    if (isEditing) {
      await updatePage.mutateAsync({ id: page.id, ...payload });
      toast({ title: 'Página atualizada' });
    } else {
      await createPage.mutateAsync(payload);
      toast({ title: 'Página criada' });
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar Página' : 'Nova Página'}</SheetTitle>
          <SheetDescription>{isEditing ? 'Atualize os dados da página' : 'Preencha os dados da nova página'}</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div><Label>Nome *</Label><Input {...register('name')} />{errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}</div>
          <div><Label>Page ID *</Label><Input {...register('pageId')} />{errors.pageId && <p className="text-xs text-destructive mt-1">{errors.pageId.message}</p>}</div>
          <div><Label>BM Vinculada</Label>
            <Controller name="bmId" control={control} render={({ field }) => (
              <Select value={field.value || 'NONE'} onValueChange={v => field.onChange(v === 'NONE' ? '' : v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="NONE">Nenhuma</SelectItem>{bms.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
              </Select>
            )} />
          </div>
          <div><Label>BM de Origem</Label><Input {...register('originBmId')} placeholder="ID da BM de origem" /></div>
          <div><Label>Fornecedor</Label>
            <Controller name="supplierId" control={control} render={({ field }) => (
              <Select value={field.value || 'NONE'} onValueChange={v => field.onChange(v === 'NONE' ? '' : v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="NONE">Nenhum</SelectItem>{mockSuppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            )} />
          </div>
          <div><Label>Status *</Label>
            <Controller name="status" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="ACTIVE">Ativa</SelectItem><SelectItem value="DISABLED">Desativada</SelectItem><SelectItem value="BLOCKED">Bloqueada</SelectItem></SelectContent>
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
          <div><Label>Data de Recebimento</Label><Input type="date" {...register('receivedAt')} /></div>
          <div><Label>Data de Block</Label><Input type="date" {...register('blockedAt')} /></div>
          <div><Label>Data de Uso</Label><Input type="date" {...register('usedAt')} /></div>
          <div><Label>Notas</Label><Textarea {...register('notes')} /></div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">{isEditing ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
