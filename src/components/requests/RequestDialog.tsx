import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useCreateRequest } from '@/hooks/useRequests';
import { toast } from '@/hooks/use-toast';
import { REQUEST_TYPES, REQUEST_TYPE_LABELS } from '@/types/request';
import type { RequestType } from '@/types/request';
import { mockNiches, mockSuppliers, getMockAdAccounts } from '@/data/mock-ad-accounts';
import { getMockBMs, bmFunctions } from '@/data/mock-business-managers';

const PRIORITIES = [
  { value: 'LOW', label: 'Baixa' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'URGENT', label: 'Urgente' },
] as const;

const formSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório'),
  assetType: z.enum(['CONTA_ANUNCIO', 'BUSINESS_MANAGER', 'PERFIL', 'PAGINA', 'PIXEL', 'SALDO', 'MISTO']),
  quantity: z.coerce.number().min(1, 'Mínimo 1'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.date().optional(),
  description: z.string().trim().min(1, 'Descrição é obrigatória'),
  // Specification fields (all optional, validated contextually)
  specNiche: z.string().optional(),
  specCurrency: z.string().optional(),
  specPaymentType: z.string().optional(),
  specBm: z.string().optional(),
  specProxy: z.string().optional(),
  specWarmingLevel: z.string().optional(),
  specFunction: z.string().optional(),
  specSupplier: z.string().optional(),
  specHistory: z.boolean().optional(),
  specDomain: z.string().optional(),
  specDestAccount: z.string().optional(),
  specAmount: z.string().optional(),
  specAmountCurrency: z.string().optional(),
  specDetails: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestDialog({ open, onOpenChange }: Props) {
  const createMutation = useCreateRequest();
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
      specHistory: false,
    },
  });

  const watchAssetType = form.watch('assetType') as RequestType;

  // Reset spec fields when asset type changes
  useEffect(() => {
    form.setValue('specNiche', '');
    form.setValue('specCurrency', '');
    form.setValue('specPaymentType', '');
    form.setValue('specBm', '');
    form.setValue('specProxy', '');
    form.setValue('specWarmingLevel', '');
    form.setValue('specFunction', '');
    form.setValue('specSupplier', '');
    form.setValue('specHistory', false);
    form.setValue('specDomain', '');
    form.setValue('specDestAccount', '');
    form.setValue('specAmount', '');
    form.setValue('specAmountCurrency', 'BRL');
    form.setValue('specDetails', '');
  }, [watchAssetType, form]);

  function buildSpecifications(values: FormValues): Record<string, string> {
    const specs: Record<string, string> = {};
    const t = values.assetType;
    if (t === 'CONTA_ANUNCIO') {
      if (values.specNiche) specs.nicho = values.specNiche;
      if (values.specCurrency) specs.moeda = values.specCurrency;
      if (values.specPaymentType) specs.pagamento = values.specPaymentType;
      if (values.specBm) specs.bmDesejada = values.specBm;
    } else if (t === 'PERFIL') {
      if (values.specProxy) specs.proxy = values.specProxy;
      if (values.specWarmingLevel) specs.aquecimento = values.specWarmingLevel;
    } else if (t === 'BUSINESS_MANAGER') {
      if (values.specFunction) specs.funcao = values.specFunction;
      if (values.specSupplier) specs.fornecedorPreferido = values.specSupplier;
    } else if (t === 'PAGINA') {
      if (values.specNiche) specs.nicho = values.specNiche;
      specs.comHistorico = values.specHistory ? 'Sim' : 'Não';
    } else if (t === 'PIXEL') {
      if (values.specDomain) specs.dominio = values.specDomain;
      if (values.specBm) specs.bmDesejada = values.specBm;
    } else if (t === 'SALDO') {
      if (values.specDestAccount) specs.contaDestino = values.specDestAccount;
      if (values.specAmount) specs.valor = values.specAmount;
      if (values.specAmountCurrency) specs.moeda = values.specAmountCurrency;
    } else if (t === 'MISTO') {
      if (values.specDetails) specs.detalhes = values.specDetails;
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
      toast({ title: 'Solicitação criada com sucesso' });
      form.reset();
      onOpenChange(false);
    } catch {
      toast({ title: 'Erro ao criar solicitação. Tente novamente.', variant: 'destructive' });
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) form.reset(); onOpenChange(v); }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Nova Solicitação</SheetTitle>
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
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Especificações do Ativo</h3>
              <Separator />
              <SpecFields type={watchAssetType} form={form} bms={bms} adAccounts={adAccounts} />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancelar</Button>
              <Button type="submit" disabled={createMutation.isPending} className="flex-1">
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
}

function SpecFields({ type, form, bms, adAccounts }: SpecFieldsProps) {
  switch (type) {
    case 'CONTA_ANUNCIO':
      return <SpecContaAnuncio form={form} bms={bms} />;
    case 'PERFIL':
      return <SpecPerfil form={form} />;
    case 'BUSINESS_MANAGER':
      return <SpecBM form={form} />;
    case 'PAGINA':
      return <SpecPagina form={form} />;
    case 'PIXEL':
      return <SpecPixel form={form} bms={bms} />;
    case 'SALDO':
      return <SpecSaldo form={form} adAccounts={adAccounts} />;
    case 'MISTO':
      return <SpecMisto form={form} />;
    default:
      return null;
  }
}

function SpecContaAnuncio({ form, bms }: { form: any; bms: any[] }) {
  return (
    <div className="space-y-4">
      <FormField control={form.control} name="specNiche" render={({ field }) => (
        <FormItem>
          <FormLabel>Nicho Desejado</FormLabel>
          <Select value={field.value || ''} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue placeholder="Selecionar nicho" /></SelectTrigger></FormControl>
            <SelectContent>
              {mockNiches.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormItem>
      )} />
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="specCurrency" render={({ field }) => (
          <FormItem>
            <FormLabel>Moeda</FormLabel>
            <Select value={field.value || ''} onValueChange={field.onChange}>
              <FormControl><SelectTrigger><SelectValue placeholder="Moeda" /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="BRL">BRL</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
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
              </SelectContent>
            </Select>
          </FormItem>
        )} />
      </div>
      <FormField control={form.control} name="specBm" render={({ field }) => (
        <FormItem>
          <FormLabel>BM Desejada (opcional)</FormLabel>
          <Select value={field.value || ''} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue placeholder="Selecionar BM" /></SelectTrigger></FormControl>
            <SelectContent>
              {bms.map((bm) => <SelectItem key={bm.id} value={bm.name}>{bm.name} ({bm.bmId})</SelectItem>)}
            </SelectContent>
          </Select>
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
          <FormLabel>Tipo de Proxy Necessário</FormLabel>
          <FormControl><Input placeholder="Ex: Residencial BR, Mobile US..." {...field} /></FormControl>
        </FormItem>
      )} />
      <FormField control={form.control} name="specWarmingLevel" render={({ field }) => (
        <FormItem>
          <FormLabel>Nível de Aquecimento</FormLabel>
          <Select value={field.value || ''} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue placeholder="Selecionar nível" /></SelectTrigger></FormControl>
            <SelectContent>
              <SelectItem value="Novo">Novo</SelectItem>
              <SelectItem value="Parcialmente aquecido">Parcialmente aquecido</SelectItem>
              <SelectItem value="Totalmente aquecido">Totalmente aquecido</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )} />
    </div>
  );
}

function SpecBM({ form }: { form: any }) {
  return (
    <div className="space-y-4">
      <FormField control={form.control} name="specFunction" render={({ field }) => (
        <FormItem>
          <FormLabel>Função Desejada</FormLabel>
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
          <Select value={field.value || ''} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue placeholder="Selecionar fornecedor" /></SelectTrigger></FormControl>
            <SelectContent>
              {mockSuppliers.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormItem>
      )} />
    </div>
  );
}

function SpecPagina({ form }: { form: any }) {
  return (
    <div className="space-y-4">
      <FormField control={form.control} name="specNiche" render={({ field }) => (
        <FormItem>
          <FormLabel>Nicho</FormLabel>
          <Select value={field.value || ''} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue placeholder="Selecionar nicho" /></SelectTrigger></FormControl>
            <SelectContent>
              {mockNiches.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormItem>
      )} />
      <FormField control={form.control} name="specHistory" render={({ field }) => (
        <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
          <FormLabel className="text-sm font-normal">Com histórico de publicações</FormLabel>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )} />
    </div>
  );
}

function SpecPixel({ form, bms }: { form: any; bms: any[] }) {
  return (
    <div className="space-y-4">
      <FormField control={form.control} name="specDomain" render={({ field }) => (
        <FormItem>
          <FormLabel>Domínio Alvo</FormLabel>
          <FormControl><Input placeholder="Ex: meusite.com.br" {...field} /></FormControl>
        </FormItem>
      )} />
      <FormField control={form.control} name="specBm" render={({ field }) => (
        <FormItem>
          <FormLabel>BM Desejada (opcional)</FormLabel>
          <Select value={field.value || ''} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue placeholder="Selecionar BM" /></SelectTrigger></FormControl>
            <SelectContent>
              {bms.map((bm) => <SelectItem key={bm.id} value={bm.name}>{bm.name} ({bm.bmId})</SelectItem>)}
            </SelectContent>
          </Select>
        </FormItem>
      )} />
    </div>
  );
}

function SpecSaldo({ form, adAccounts }: { form: any; adAccounts: any[] }) {
  return (
    <div className="space-y-4">
      <FormField control={form.control} name="specDestAccount" render={({ field }) => (
        <FormItem>
          <FormLabel>Conta de Destino</FormLabel>
          <Select value={field.value || ''} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue placeholder="Selecionar conta" /></SelectTrigger></FormControl>
            <SelectContent>
              {adAccounts.map((a) => <SelectItem key={a.id} value={a.name}>{a.name} ({a.accountId})</SelectItem>)}
            </SelectContent>
          </Select>
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

function SpecMisto({ form }: { form: any }) {
  return (
    <FormField control={form.control} name="specDetails" render={({ field }) => (
      <FormItem>
        <FormLabel>Detalhes da Combinação</FormLabel>
        <FormControl><Textarea placeholder="Descreva os ativos e quantidades desejadas..." rows={4} {...field} /></FormControl>
      </FormItem>
    )} />
  );
}
