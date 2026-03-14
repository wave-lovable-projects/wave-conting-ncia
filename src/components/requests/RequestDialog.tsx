import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/shared/RichTextEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useCreateRequest, useCreateRequestTemplate } from '@/hooks/useRequests';
import { toast } from '@/hooks/use-toast';
import { REQUEST_TYPES, REQUEST_TYPE_LABELS } from '@/types/request';
import type { RequestType, RequestTemplate } from '@/types/request';
import { mockSuppliers, getMockAdAccounts } from '@/data/mock-ad-accounts';
import { getMockBMs, bmFunctions } from '@/data/mock-business-managers';

const PRIORITIES = [
  { value: 'LOW', label: 'Baixa' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'URGENT', label: 'Urgente' },
] as const;

const formSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório'),
  assetType: z.enum(['CONTA_ANUNCIO', 'BUSINESS_MANAGER', 'PERFIL', 'PAGINA', 'SALDO']),
  quantity: z.coerce.number().min(1, 'Mínimo 1'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.date().optional(),
  description: z.string().trim().min(1, 'Descrição é obrigatória'),
  specCurrency: z.string().optional(),
  specPaymentType: z.string().optional(),
  specBm: z.string().optional(),
  specProxy: z.string().optional(),
  specFunction: z.string().optional(),
  specSupplier: z.string().optional(),
  specDestAccount: z.string().optional(),
  specAmount: z.string().optional(),
  specAmountCurrency: z.string().optional(),
  specDetails: z.string().optional(),
  saveAsTemplate: z.boolean().optional(),
  templateName: z.string().optional(),
}).refine((data) => {
  if (data.saveAsTemplate && (!data.templateName || data.templateName.trim().length === 0)) {
    return false;
  }
  return true;
}, { message: 'Nome do template é obrigatório', path: ['templateName'] });

type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTemplate?: RequestTemplate | null;
}

function applySpecsToForm(type: RequestType, specs: Record<string, string>, form: ReturnType<typeof useForm<FormValues>>) {
  if (type === 'CONTA_ANUNCIO') {
    if (specs.moeda) form.setValue('specCurrency', specs.moeda);
    if (specs.pagamento) form.setValue('specPaymentType', specs.pagamento);
    if (specs.bmDesejada) form.setValue('specBm', specs.bmDesejada);
  } else if (type === 'PERFIL') {
    if (specs.proxy) form.setValue('specProxy', specs.proxy);
  } else if (type === 'BUSINESS_MANAGER') {
    if (specs.funcao) form.setValue('specFunction', specs.funcao);
    if (specs.fornecedorPreferido) form.setValue('specSupplier', specs.fornecedorPreferido);
  } else if (type === 'SALDO') {
    if (specs.contaDestino) form.setValue('specDestAccount', specs.contaDestino);
    if (specs.valor) form.setValue('specAmount', specs.valor);
    if (specs.moeda) form.setValue('specAmountCurrency', specs.moeda);
  }
}

// --- Combobox Field ---
interface ComboboxOption {
  value: string;
  label: string;
}

const ComboboxField = React.forwardRef<HTMLButtonElement, {
  options: ComboboxOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  portalContainer?: HTMLElement | null;
}>(({ options, value, onChange, placeholder, portalContainer }, ref) => {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selectedLabel || <span className="text-muted-foreground">{placeholder}</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" container={portalContainer}>
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandList className="max-h-[200px] overflow-y-auto">
            <CommandEmpty>Nenhum resultado.</CommandEmpty>
            {options.map((opt) => (
              <CommandItem
                key={opt.value}
                value={opt.label}
                onSelect={() => { onChange(opt.value); setOpen(false); }}
              >
                <Check className={cn("mr-2 h-4 w-4", value === opt.value ? "opacity-100" : "opacity-0")} />
                {opt.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

ComboboxField.displayName = 'ComboboxField';

export function RequestDialog({ open, onOpenChange, initialTemplate }: Props) {
  const createMutation = useCreateRequest();
  const createTemplateMutation = useCreateRequestTemplate();
  const sheetRef = useRef<HTMLDivElement>(null);
  const bms = getMockBMs();
  const adAccounts = getMockAdAccounts();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      assetType: 'CONTA_ANUNCIO',
      quantity: 1,
      priority: 'MEDIUM',
      description: '',
      saveAsTemplate: false,
      templateName: '',
    },
  });

  const watchAssetType = form.watch('assetType') as RequestType;
  const watchSaveAsTemplate = form.watch('saveAsTemplate');

  useEffect(() => {
    if (initialTemplate && open) {
      form.reset({
        title: initialTemplate.name,
        assetType: initialTemplate.assetType,
        quantity: initialTemplate.quantity,
        priority: initialTemplate.priority,
        description: initialTemplate.description || '',
        saveAsTemplate: false,
        templateName: '',
      });
      setTimeout(() => {
        applySpecsToForm(initialTemplate.assetType, initialTemplate.specifications, form);
      }, 0);
    }
  }, [initialTemplate, open, form]);

  useEffect(() => {
    if (!initialTemplate) {
      form.setValue('specCurrency', '');
      form.setValue('specPaymentType', '');
      form.setValue('specBm', '');
      form.setValue('specProxy', '');
      form.setValue('specFunction', '');
      form.setValue('specSupplier', '');
      form.setValue('specDestAccount', '');
      form.setValue('specAmount', '');
      form.setValue('specAmountCurrency', 'BRL');
      form.setValue('specDetails', '');
    }
  }, [watchAssetType, form, initialTemplate]);

  function buildSpecifications(values: FormValues): Record<string, string> {
    const specs: Record<string, string> = {};
    const t = values.assetType;
    if (t === 'CONTA_ANUNCIO') {
      if (values.specCurrency) specs.moeda = values.specCurrency;
      if (values.specPaymentType) specs.pagamento = values.specPaymentType;
      if (values.specBm) specs.bmDesejada = values.specBm;
    } else if (t === 'PERFIL') {
      if (values.specProxy) specs.proxy = values.specProxy;
    } else if (t === 'BUSINESS_MANAGER') {
      if (values.specFunction) specs.funcao = values.specFunction;
      if (values.specSupplier) specs.fornecedorPreferido = values.specSupplier;
    } else if (t === 'SALDO') {
      if (values.specDestAccount) specs.contaDestino = values.specDestAccount;
      if (values.specAmount) specs.valor = values.specAmount;
      if (values.specAmountCurrency) specs.moeda = values.specAmountCurrency;
    }
    return specs;
  }

  async function onSubmit(values: FormValues) {
    try {
      const specifications = buildSpecifications(values);
      await createMutation.mutateAsync({
        title: values.title,
        description: values.description,
        assetType: values.assetType as RequestType,
        priority: values.priority as any,
        status: 'PENDENTE',
        quantity: values.quantity,
        requesterId: 'u1',
        requesterName: 'Admin Wave',
        attachments: [],
        dueDate: values.dueDate?.toISOString(),
        specifications,
      });

      if (values.saveAsTemplate && values.templateName) {
        try {
          await createTemplateMutation.mutateAsync({
            name: values.templateName.trim(),
            description: values.description,
            assetType: values.assetType as RequestType,
            quantity: values.quantity,
            priority: values.priority as any,
            specifications,
            createdByName: 'Admin Wave',
          });
          toast({ title: 'Solicitação criada e template salvo com sucesso' });
        } catch {
          toast({ title: 'Solicitação criada, mas erro ao salvar template', variant: 'destructive' });
        }
      } else {
        toast({ title: 'Solicitação criada com sucesso' });
      }

      form.reset();
      onOpenChange(false);
    } catch {
      toast({ title: 'Erro ao criar solicitação. Tente novamente.', variant: 'destructive' });
    }
  }

  const isPending = createMutation.isPending || createTemplateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) form.reset(); onOpenChange(v); }}>
      <SheetContent ref={sheetRef} className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{initialTemplate ? 'Nova Solicitação (via Template)' : 'Nova Solicitação'}</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            {/* Section: Informações Gerais */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Informações Gerais</h3>
              <Separator />

              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl><Input placeholder="Título da solicitação" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="assetType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Ativo *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {REQUEST_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{REQUEST_TYPE_LABELS[t]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="quantity" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade *</FormLabel>
                    <FormControl><Input type="number" min={1} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="priority" render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="dueDate" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data Desejada de Entrega</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'dd/MM/yyyy') : 'Selecionar data'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl><Textarea placeholder="Descreva a solicitação..." rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Section: Especificações do Ativo */}
            {watchAssetType !== 'PAGINA' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Especificações do Ativo</h3>
                <Separator />
                <SpecFields type={watchAssetType} form={form} bms={bms} adAccounts={adAccounts} portalContainer={sheetRef.current} />
              </div>
            )}

            {/* Section: Salvar como Template */}
            <div className="space-y-3">
              <Separator />
              <FormField control={form.control} name="saveAsTemplate" render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-sm font-normal !mt-0 cursor-pointer">Salvar como template para uso futuro</FormLabel>
                </FormItem>
              )} />
              {watchSaveAsTemplate && (
                <FormField control={form.control} name="templateName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Template *</FormLabel>
                    <FormControl><Input placeholder="Ex: 5 Contas Ecommerce BRL Cartão" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancelar</Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Solicitação
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

// --- Dynamic specification fields by asset type ---

interface SpecFieldsProps {
  type: RequestType;
  form: ReturnType<typeof useForm<FormValues>>;
  bms: ReturnType<typeof getMockBMs>;
  adAccounts: ReturnType<typeof getMockAdAccounts>;
  portalContainer?: HTMLElement | null;
}

function SpecFields({ type, form, bms, adAccounts, portalContainer }: SpecFieldsProps) {
  switch (type) {
    case 'CONTA_ANUNCIO':
      return <SpecContaAnuncio form={form} bms={bms} portalContainer={portalContainer} />;
    case 'PERFIL':
      return <SpecPerfil form={form} />;
    case 'BUSINESS_MANAGER':
      return <SpecBM form={form} portalContainer={portalContainer} />;
    case 'SALDO':
      return <SpecSaldo form={form} adAccounts={adAccounts} portalContainer={portalContainer} />;
    default:
      return null;
  }
}

function SpecContaAnuncio({ form, bms, portalContainer }: { form: any; bms: any[]; portalContainer?: HTMLElement | null }) {
  const bmOptions: ComboboxOption[] = bms.map((bm) => ({
    value: bm.name,
    label: `${bm.name} (${bm.bmId})`,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="specCurrency" render={({ field }) => (
          <FormItem>
            <FormLabel>Moeda</FormLabel>
            <Select value={field.value || ''} onValueChange={field.onChange}>
              <FormControl><SelectTrigger><SelectValue placeholder="Moeda" /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="BRL">BRL</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="INDIFERENTE">Indiferente</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )} />
        <FormField control={form.control} name="specPaymentType" render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Pagamento</FormLabel>
            <Select value={field.value || ''} onValueChange={field.onChange}>
              <FormControl><SelectTrigger><SelectValue placeholder="Pagamento" /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="Cartão">Cartão</SelectItem>
                <SelectItem value="Agência">Agência</SelectItem>
                <SelectItem value="Indiferente">Indiferente</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )} />
      </div>
      <FormField control={form.control} name="specBm" render={({ field }) => (
        <FormItem>
          <FormLabel>BM Desejada (opcional)</FormLabel>
          <FormControl>
            <ComboboxField
              options={bmOptions}
              value={field.value || ''}
              onChange={field.onChange}
              placeholder="Selecionar BM"
              portalContainer={portalContainer}
            />
          </FormControl>
        </FormItem>
      )} />
    </div>
  );
}

function SpecPerfil({ form }: { form: any }) {
  return (
    <div className="space-y-4">
      <FormField control={form.control} name="specProxy" render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Proxy Necessário (opcional)</FormLabel>
          <FormControl><Input placeholder="Ex: Residencial BR, Mobile US..." {...field} /></FormControl>
        </FormItem>
      )} />
    </div>
  );
}

function SpecBM({ form, portalContainer }: { form: any; portalContainer?: HTMLElement | null }) {
  const supplierOptions: ComboboxOption[] = mockSuppliers.map((s) => ({
    value: s.name,
    label: s.name,
  }));

  return (
    <div className="space-y-4">
      <FormField control={form.control} name="specFunction" render={({ field }) => (
        <FormItem>
          <FormLabel>Função Desejada (opcional)</FormLabel>
          <Select value={field.value || ''} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue placeholder="Selecionar função" /></SelectTrigger></FormControl>
            <SelectContent>
              {bmFunctions.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormItem>
      )} />
      <FormField control={form.control} name="specSupplier" render={({ field }) => (
        <FormItem>
          <FormLabel>Fornecedor Preferido (opcional)</FormLabel>
          <FormControl>
            <ComboboxField
              options={supplierOptions}
              value={field.value || ''}
              onChange={field.onChange}
              placeholder="Selecionar fornecedor"
              portalContainer={portalContainer}
            />
          </FormControl>
        </FormItem>
      )} />
    </div>
  );
}

function SpecSaldo({ form, adAccounts, portalContainer }: { form: any; adAccounts: any[]; portalContainer?: HTMLElement | null }) {
  const accountOptions: ComboboxOption[] = adAccounts.map((a) => ({
    value: a.name,
    label: `${a.name} (${a.accountId})`,
  }));

  return (
    <div className="space-y-4">
      <FormField control={form.control} name="specDestAccount" render={({ field }) => (
        <FormItem>
          <FormLabel>Conta de Destino</FormLabel>
          <FormControl>
            <ComboboxField
              options={accountOptions}
              value={field.value || ''}
              onChange={field.onChange}
              placeholder="Selecionar conta"
              portalContainer={portalContainer}
            />
          </FormControl>
        </FormItem>
      )} />
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="specAmount" render={({ field }) => (
          <FormItem>
            <FormLabel>Valor Solicitado</FormLabel>
            <FormControl><Input type="number" min={0} placeholder="0.00" {...field} /></FormControl>
          </FormItem>
        )} />
        <FormField control={form.control} name="specAmountCurrency" render={({ field }) => (
          <FormItem>
            <FormLabel>Moeda</FormLabel>
            <Select value={field.value || 'BRL'} onValueChange={field.onChange}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="BRL">BRL</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )} />
      </div>
    </div>
  );
}
