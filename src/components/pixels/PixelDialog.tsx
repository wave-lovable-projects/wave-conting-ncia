import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePixel, useUpdatePixel } from '@/hooks/usePixels';
import { getMockBMs } from '@/data/mock-business-managers';
import type { Pixel } from '@/types/pixel';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  pixelId: z.string().min(1, 'Pixel ID obrigatório'),
  bmId: z.string().optional(),
  status: z.enum(['ACTIVE', 'DISABLED', 'BLOCKED']),
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
  const [bmOpen, setBmOpen] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', pixelId: '', status: 'ACTIVE' },
  });

  useEffect(() => {
    if (open) {
      if (pixel) {
        reset({ name: pixel.name, pixelId: pixel.pixelId, bmId: pixel.bmId || '', status: pixel.status, blockedAt: pixel.blockedAt || '', notes: pixel.notes || '' });
      } else {
        reset({ name: '', pixelId: '', bmId: '', status: 'ACTIVE', blockedAt: '', notes: '' });
      }
    }
  }, [open, pixel, reset]);

  const onSubmit = async (values: FormValues) => {
    const bm = bms.find(b => b.id === values.bmId);
    const payload = {
      name: values.name,
      pixelId: values.pixelId,
      status: values.status as Pixel['status'],
      bmId: values.bmId || undefined,
      bmName: bm?.name,
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
          <div>
            <Label>BM Vinculada</Label>
            <Controller name="bmId" control={control} render={({ field }) => (
              <Popover open={bmOpen} onOpenChange={setBmOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={bmOpen} className="w-full justify-between font-normal">
                    {field.value ? bms.find(b => b.id === field.value)?.name || 'Selecionar BM...' : 'Selecionar BM...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar BM..." />
                    <CommandList>
                      <CommandEmpty>Nenhuma BM encontrada.</CommandEmpty>
                      <CommandItem value="__none__" onSelect={() => { field.onChange(''); setBmOpen(false); }}>
                        <Check className={cn("mr-2 h-4 w-4", !field.value ? "opacity-100" : "opacity-0")} />
                        Nenhuma
                      </CommandItem>
                      {bms.map(b => (
                        <CommandItem key={b.id} value={b.name} onSelect={() => { field.onChange(b.id); setBmOpen(false); }}>
                          <Check className={cn("mr-2 h-4 w-4", field.value === b.id ? "opacity-100" : "opacity-0")} />
                          {b.name}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
