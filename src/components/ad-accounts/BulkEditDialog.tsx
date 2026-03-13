import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBulkUpdateAdAccounts } from '@/hooks/useAdAccounts';
import { mockManagers, mockSuppliers, mockNiches } from '@/data/mock-ad-accounts';
import { toast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onDone: () => void;
}

export function BulkEditDialog({ open, onOpenChange, selectedIds, onDone }: Props) {
  const bulk = useBulkUpdateAdAccounts();
  const [fields, setFields] = useState<Record<string, boolean>>({});
  const [values, setValues] = useState<Record<string, string>>({});

  const toggleField = (f: string) => setFields(prev => ({ ...prev, [f]: !prev[f] }));
  const setValue = (f: string, v: string) => setValues(prev => ({ ...prev, [f]: v }));

  const handleSave = async () => {
    const data: Record<string, string> = {};
    if (fields.accountStatus && values.accountStatus) data.accountStatus = values.accountStatus;
    if (fields.usageStatus && values.usageStatus) data.usageStatus = values.usageStatus;
    if (fields.managerId && values.managerId) {
      data.managerId = values.managerId;
      data.managerName = mockManagers.find(m => m.id === values.managerId)?.name || '';
    }
    if (fields.supplierId && values.supplierId) {
      data.supplierId = values.supplierId;
      data.supplierName = mockSuppliers.find(s => s.id === values.supplierId)?.name || '';
    }
    if (fields.niche && values.niche) data.niche = values.niche;

    if (Object.keys(data).length === 0) {
      toast({ title: 'Selecione ao menos um campo', variant: 'destructive' });
      return;
    }

    await bulk.mutateAsync({ ids: selectedIds, data: data as any });
    toast({ title: `${selectedIds.length} contas atualizadas` });
    onOpenChange(false);
    onDone();
  };

  const fieldConfig = [
    { key: 'accountStatus', label: 'Status da Conta', options: [{ v: 'ACTIVE', l: 'Ativa' }, { v: 'DISABLED', l: 'Desativada' }, { v: 'ROLLBACK', l: 'Rollback' }] },
    { key: 'usageStatus', label: 'Status de Uso', options: [{ v: 'IN_USE', l: 'Em Uso' }, { v: 'STANDBY', l: 'Standby' }, { v: 'RETIRED', l: 'Aposentada' }] },
    { key: 'managerId', label: 'Gestor', options: mockManagers.map(m => ({ v: m.id, l: m.name })) },
    { key: 'supplierId', label: 'Fornecedor', options: mockSuppliers.map(s => ({ v: s.id, l: s.name })) },
    { key: 'niche', label: 'Nicho', options: mockNiches.map(n => ({ v: n, l: n })) },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar {selectedIds.length} contas em massa</DialogTitle>
          <DialogDescription>Ative os campos que deseja alterar</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {fieldConfig.map(f => (
            <div key={f.key} className="space-y-2">
              <div className="flex items-center gap-3">
                <Switch checked={!!fields[f.key]} onCheckedChange={() => toggleField(f.key)} />
                <Label className="text-sm">{f.label}</Label>
              </div>
              {fields[f.key] && (
                <Select value={values[f.key] || ''} onValueChange={(v) => setValue(f.key, v)}>
                  <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                  <SelectContent>
                    {f.options.map(o => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={bulk.isPending}>{bulk.isPending ? 'Salvando...' : 'Aplicar'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
