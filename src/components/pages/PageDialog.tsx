import { useEffect, useRef, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from '@/components/ui/command';
import { Calendar } from '@/components/ui/calendar';
import { Check, ChevronsUpDown, CalendarIcon } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePage, useUpdatePage } from '@/hooks/usePages';
import { getMockBMs } from '@/data/mock-business-managers';
import type { FacebookPage } from '@/types/page';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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
  receivedAt: z.date().optional().nullable(),
  blockedAt: z.date().optional().nullable(),
  usedAt: z.date().optional().nullable(),
  managerId: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface PageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: FacebookPage | null;
}

interface ComboboxFieldProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  portalContainer?: HTMLElement | null;
}

function ComboboxField({ options, value, onChange, placeholder, portalContainer }: ComboboxFieldProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal">
          {selectedLabel || <span className="text-muted-foreground">{placeholder}</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" container={portalContainer}>
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandList className="max-h-[200px] overflow-y-auto">
            <CommandEmpty>Nenhum resultado.</CommandEmpty>
            <CommandItem value="__none__" onSelect={() => { onChange(''); setOpen(false); }}>
              <Check className={cn("mr-2 h-4 w-4", !value ? "opacity-100" : "opacity-0")} />
              Nenhum(a)
            </CommandItem>
            {options.map((opt) => (
              <CommandItem key={opt.value} value={opt.label} onSelect={() => { onChange(opt.value); setOpen(false); }}>
                <Check className={cn("mr-2 h-4 w-4", value === opt.value ? "opacity-100" : "opacity-0")} />
                {opt.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface DatePickerFieldProps {
  value: Date | null | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder: string;
  portalContainer?: HTMLElement | null;
}

function DatePickerField({ value, onChange, placeholder, portalContainer }: DatePickerFieldProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'dd/MM/yyyy') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" container={portalContainer}>
        <Calendar
          mode="single"
          selected={value || undefined}
          onSelect={(d) => onChange(d || undefined)}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}

function parseOptionalDate(str?: string): Date | undefined {
  if (!str) return undefined;
  const d = new Date(str);
  return isNaN(d.getTime()) ? undefined : d;
}

function formatDateToISO(d?: Date | null): string | undefined {
  if (!d) return undefined;
  return d.toISOString().split('T')[0];
}

export function PageDialog({ open, onOpenChange, page }: PageDialogProps) {
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();
  const isEditing = !!page;
  const bms = getMockBMs();
  const sheetRef = useRef<HTMLDivElement>(null);

  const bmOptions = bms.map(b => ({ value: b.id, label: b.name }));
  const supplierOptions = mockSuppliers.map(s => ({ value: s.id, label: s.name }));

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', pageId: '', status: 'ACTIVE' },
  });

  useEffect(() => {
    if (open) {
      if (page) {
        reset({
          name: page.name, pageId: page.pageId, bmId: page.bmId || '', originBmId: page.originBmId || '',
          supplierId: page.supplierId || '', status: page.status,
          receivedAt: parseOptionalDate(page.receivedAt), blockedAt: parseOptionalDate(page.blockedAt),
          usedAt: parseOptionalDate(page.usedAt), managerId: page.managerId || '', notes: page.notes || '',
        });
      } else {
        reset({
          name: '', pageId: '', bmId: '', originBmId: '', supplierId: '', status: 'ACTIVE',
          receivedAt: undefined, blockedAt: undefined, usedAt: undefined, managerId: '', notes: '',
        });
      }
    }
  }, [open, page, reset]);

  const onSubmit = async (values: FormValues) => {
    const supplier = mockSuppliers.find(s => s.id === values.supplierId);
    const bm = bms.find(b => b.id === values.bmId);
    const originBm = bms.find(b => b.id === values.originBmId);
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
      receivedAt: formatDateToISO(values.receivedAt),
      blockedAt: formatDateToISO(values.blockedAt),
      usedAt: formatDateToISO(values.usedAt),
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
      <SheetContent ref={sheetRef} className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar Página' : 'Nova Página'}</SheetTitle>
          <SheetDescription>{isEditing ? 'Atualize os dados da página' : 'Preencha os dados da nova página'}</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div><Label>Nome *</Label><Input {...register('name')} />{errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}</div>
          <div><Label>Page ID *</Label><Input {...register('pageId')} />{errors.pageId && <p className="text-xs text-destructive mt-1">{errors.pageId.message}</p>}</div>

          <div>
            <Label>BM Vinculada</Label>
            <Controller name="bmId" control={control} render={({ field }) => (
              <ComboboxField options={bmOptions} value={field.value || ''} onChange={field.onChange} placeholder="Selecionar BM..." portalContainer={sheetRef.current} />
            )} />
          </div>

          <div>
            <Label>BM de Origem</Label>
            <Controller name="originBmId" control={control} render={({ field }) => (
              <ComboboxField options={bmOptions} value={field.value || ''} onChange={field.onChange} placeholder="Selecionar BM de origem..." portalContainer={sheetRef.current} />
            )} />
          </div>

          <div>
            <Label>Fornecedor</Label>
            <Controller name="supplierId" control={control} render={({ field }) => (
              <ComboboxField options={supplierOptions} value={field.value || ''} onChange={field.onChange} placeholder="Selecionar fornecedor..." portalContainer={sheetRef.current} />
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

          <div>
            <Label>Data de Recebimento</Label>
            <Controller name="receivedAt" control={control} render={({ field }) => (
              <DatePickerField value={field.value} onChange={field.onChange} placeholder="Selecionar data..." portalContainer={sheetRef.current} />
            )} />
          </div>

          <div>
            <Label>Data de Block</Label>
            <Controller name="blockedAt" control={control} render={({ field }) => (
              <DatePickerField value={field.value} onChange={field.onChange} placeholder="Selecionar data..." portalContainer={sheetRef.current} />
            )} />
          </div>

          <div>
            <Label>Data de Uso</Label>
            <Controller name="usedAt" control={control} render={({ field }) => (
              <DatePickerField value={field.value} onChange={field.onChange} placeholder="Selecionar data..." portalContainer={sheetRef.current} />
            )} />
          </div>

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
