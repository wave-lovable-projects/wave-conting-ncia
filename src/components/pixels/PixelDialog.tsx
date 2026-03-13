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
import { useCreatePixel, useUpdatePixel } from '@/hooks/usePixels';
import { getMockBMs } from '@/data/mock-business-managers';
import type { Pixel } from '@/types/pixel';
import { toast } from '@/hooks/use-toast';

const mockSuppliers = [
  { id: 's1', name: 'Fornecedor Alpha' },
  { id: 's2', name: 'Fornecedor Beta' },
  { id: 's3', name: 'Fornecedor Gamma' },
];

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  pixelId: z.string().min(1, 'Pixel ID obrigatório'),
  bmId: z.string().optional(),
  supplierId: z.string().optional(),
  status: z.enum(['ACTIVE', 'DISABLED', 'BLOCKED']),
  domain: z.string().optional(),
  receivedAt: z.string().optional(),
  blockedAt: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface PixelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pixel: Pixel | null;
}

export function PixelDialog({ open, onOpenChange, pixel }: PixelDialogProps) {
  const createPixel = useCreatePixel();
  const updatePixel = useUpdatePixel();
  const isEditing = !!pixel;
  const bms = getMockBMs();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', pixelId: '', status: 'ACTIVE' },
  });

  useEffect(() => {
    if (open) {
      if (pixel) {
        reset({ name: pixel.name, pixelId: pixel.pixelId, bmId: pixel.bmId || '', supplierId: pixel.supplierId || '', status: pixel.status, domain: pixel.domain || '', receivedAt: pixel.receivedAt || '', blockedAt: pixel.blockedAt || '', notes: pixel.notes || '' });
      } else {
        reset({ name: '', pixelId: '', bmId: '', supplierId: '', status: 'ACTIVE', domain: '', receivedAt: '', blockedAt: '', notes: '' });
      }
    }
  }, [open, pixel, reset]);

  const onSubmit = async (values: FormValues) => {
    const supplier = mockSuppliers.find(s => s.id === values.supplierId);
    const bm = bms.find(b => b.id === values.bmId);
    const payload = {
      name: values.name,
      pixelId: values.pixelId,
      status: values.status as Pixel['status'],
      bmId: values.bmId || undefined,
      bmName: bm?.name,
      supplierId: values.supplierId || undefined,
      supplierName: supplier?.name,
      domain: values.domain || undefined,
      receivedAt: values.receivedAt || undefined,
      blockedAt: values.blockedAt || undefined,
      notes: values.notes || undefined,
    };
    if (isEditing) {
      await updatePixel.mutateAsync({ id: pixel.id, ...payload });
      toast({ title: 'Pixel atualizado' });
    } else {
      await createPixel.mutateAsync(payload);
      toast({ title: 'Pixel criado' });
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar Pixel' : 'Novo Pixel'}</SheetTitle>
          <SheetDescription>{isEditing ? 'Atualize os dados do pixel' : 'Preencha os dados do novo pixel'}</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div><Label>Nome *</Label><Input {...register('name')} />{errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}</div>
          <div><Label>Pixel ID *</Label><Input {...register('pixelId')} />{errors.pixelId && <p className="text-xs text-destructive mt-1">{errors.pixelId.message}</p>}</div>
          <div><Label>BM Vinculada</Label>
            <Controller name="bmId" control={control} render={({ field }) => (
              <Select value={field.value || 'NONE'} onValueChange={v => field.onChange(v === 'NONE' ? '' : v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="NONE">Nenhuma</SelectItem>{bms.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
              </Select>
            )} />
          </div>
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
                <SelectContent><SelectItem value="ACTIVE">Ativo</SelectItem><SelectItem value="DISABLED">Desativado</SelectItem><SelectItem value="BLOCKED">Bloqueado</SelectItem></SelectContent>
              </Select>
            )} />
          </div>
          <div><Label>Domínio</Label><Input {...register('domain')} placeholder="exemplo.com" /></div>
          <div><Label>Data de Recebimento</Label><Input type="date" {...register('receivedAt')} /></div>
          <div><Label>Data de Block</Label><Input type="date" {...register('blockedAt')} /></div>
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
