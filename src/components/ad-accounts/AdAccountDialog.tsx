import { useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateAdAccount, useUpdateAdAccount } from '@/hooks/useAdAccounts';
import { mockManagers, mockSuppliers } from '@/data/mock-ad-accounts';
import type { AdAccount } from '@/types/ad-account';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  accountId: z.string().min(1, 'ID obrigatório'),
  accessLink: z.string().optional(),
  supplierId: z.string().optional(),
  bmId: z.string().optional(),
  niche: z.string().optional(),
  product: z.string().optional(),
  vsl: z.string().optional(),
  managerId: z.string().optional(),
  accountStatus: z.enum(['WARMING', 'ACTIVE', 'ADVERTISING', 'DISABLED', 'ROLLBACK']),
  bmStatus: z.enum(['ACTIVE', 'DISABLED']).optional(),
  balance: z.number().min(0, 'Saldo deve ser positivo'),
  currency: z.enum(['USD', 'BRL']),
  paymentType: z.enum(['CARD', 'AGENCY']).optional(),
  cardLast4: z.string().max(4).optional(),
  usageStatus: z.enum(['IN_USE', 'STANDBY', 'RETIRED']),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: AdAccount | null;
}

const mockBms = [
  { id: 'bm1', name: 'BM Principal' },
  { id: 'bm2', name: 'BM Secundária' },
  { id: 'bm3', name: 'BM Edu' },
];

export function AdAccountDialog({ open, onOpenChange, account }: Props) {
  const isEdit = !!account;
  const create = useCreateAdAccount();
  const update = useUpdateAdAccount();

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', accountId: '', accountStatus: 'ACTIVE', balance: 0, currency: 'BRL', usageStatus: 'STANDBY',
    },
  });

  useEffect(() => {
    if (open && account) {
      reset({
        name: account.name,
        accountId: account.accountId,
        accessLink: account.accessLink || '',
        supplierId: account.supplierId || '',
        bmId: account.bmId || '',
        niche: account.niche || '',
        product: account.product || '',
        vsl: account.vsl || '',
        managerId: account.managerId || '',
        accountStatus: account.accountStatus,
        bmStatus: account.bmStatus,
        balance: account.balance,
        currency: account.currency,
        paymentType: account.paymentType,
        cardLast4: account.cardLast4 || '',
        usageStatus: account.usageStatus,
      });
    } else if (open) {
      reset({ name: '', accountId: '', accountStatus: 'ACTIVE', balance: 0, currency: 'BRL', usageStatus: 'STANDBY' });
    }
  }, [open, account, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const supplierName = mockSuppliers.find(s => s.id === data.supplierId)?.name;
      const managerName = mockManagers.find(m => m.id === data.managerId)?.name;
      const bmName = mockBms.find(b => b.id === data.bmId)?.name;

      const payload = { ...data, supplierName, managerName, bmName } as any;

      if (isEdit) {
        await update.mutateAsync({ id: account!.id, ...payload });
        toast({ title: 'Conta atualizada' });
      } else {
        await create.mutateAsync(payload);
        toast({ title: 'Conta criada' });
      }
      onOpenChange(false);
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle>{isEdit ? 'Editar Conta' : 'Nova Conta de Anúncio'}</SheetTitle>
          <SheetDescription>{isEdit ? 'Atualize os dados da conta' : 'Preencha os dados para criar uma nova conta'}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <form id="ad-account-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Nome *</Label>
              <Input {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>ID da Conta *</Label>
              <Input {...register('accountId')} />
              {errors.accountId && <p className="text-xs text-destructive">{errors.accountId.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Link de Acesso</Label>
              <Input {...register('accessLink')} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Fornecedor</Label>
                <Controller name="supplierId" control={control} render={({ field }) => (
                  <Select value={field.value || '__none__'} onValueChange={(v) => field.onChange(v === '__none__' ? '' : v)}>
                    <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Nenhum</SelectItem>
                      {mockSuppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div className="space-y-1.5">
                <Label>BM Vinculada</Label>
                <Controller name="bmId" control={control} render={({ field }) => (
                  <Select value={field.value || '__none__'} onValueChange={(v) => field.onChange(v === '__none__' ? '' : v)}>
                    <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Nenhuma</SelectItem>
                      {mockBms.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nicho</Label>
                <Input {...register('niche')} />
              </div>
              <div className="space-y-1.5">
                <Label>Produto</Label>
                <Input {...register('product')} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>VSL</Label>
              <Input {...register('vsl')} />
            </div>
            <div className="space-y-1.5">
              <Label>Gestor</Label>
              <Controller name="managerId" control={control} render={({ field }) => (
                <Select value={field.value || '__none__'} onValueChange={(v) => field.onChange(v === '__none__' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Nenhum</SelectItem>
                    {mockManagers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Status da Conta *</Label>
                <Controller name="accountStatus" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WARMING">Aquecendo</SelectItem>
                      <SelectItem value="ACTIVE">Ativa</SelectItem>
                      <SelectItem value="ADVERTISING">Anunciando</SelectItem>
                      <SelectItem value="DISABLED">Desabilitada</SelectItem>
                      <SelectItem value="ROLLBACK">Rollback</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div className="space-y-1.5">
                <Label>Status da BM</Label>
                <Controller name="bmStatus" control={control} render={({ field }) => (
                  <Select value={field.value || '__none__'} onValueChange={(v) => field.onChange(v === '__none__' ? undefined : v)}>
                    <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Nenhum</SelectItem>
                      <SelectItem value="ACTIVE">Ativa</SelectItem>
                      <SelectItem value="DISABLED">Desabilitada</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tipo de Pagamento</Label>
                <Controller name="paymentType" control={control} render={({ field }) => (
                  <Select value={field.value || '__none__'} onValueChange={(v) => field.onChange(v === '__none__' ? undefined : v)}>
                    <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Nenhum</SelectItem>
                      <SelectItem value="CARD">Cartão</SelectItem>
                      <SelectItem value="AGENCY">Agência</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div className="space-y-1.5">
                <Label>Status de Uso *</Label>
                <Controller name="usageStatus" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_USE">Em Uso</SelectItem>
                      <SelectItem value="STANDBY">Standby</SelectItem>
                      <SelectItem value="RETIRED">Aposentada</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Saldo</Label>
                <div className="flex gap-2">
                  <Controller name="currency" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">R$</SelectItem>
                        <SelectItem value="USD">$</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                  <Input type="number" step="0.01" min="0" {...register('balance', { valueAsNumber: true })} className="flex-1" />
                </div>
                {errors.balance && <p className="text-xs text-destructive">{errors.balance.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Final do Cartão</Label>
                <Input {...register('cardLast4')} maxLength={4} placeholder="0000" />
              </div>
            </div>
          </form>
        </ScrollArea>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" form="ad-account-form" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
