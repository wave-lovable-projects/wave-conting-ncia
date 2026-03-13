import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { Supplier, SupplierAssetType } from '@/types/supplier';
import { useCreateSupplier, useUpdateSupplier } from '@/hooks/useSuppliers';
import { toast } from '@/hooks/use-toast';

const assetTypes: { value: SupplierAssetType; label: string }[] = [
  { value: 'CONTAS', label: 'Contas de Anúncio' },
  { value: 'PERFIS', label: 'Perfis' },
  { value: 'BMS', label: 'Business Managers' },
  { value: 'PAGINAS', label: 'Páginas' },
  { value: 'PIXELS', label: 'Pixels' },
];

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: Supplier | null;
}

export function SupplierDialog({ open, onOpenChange, supplier }: SupplierDialogProps) {
  const isEditing = !!supplier;
  const [name, setName] = useState(supplier?.name ?? '');
  const [status, setStatus] = useState(supplier?.status ?? 'ACTIVE');
  const [types, setTypes] = useState<SupplierAssetType[]>(supplier?.types ?? []);

  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();

  const resetForm = () => { setName(''); setStatus('ACTIVE'); setTypes([]); };

  const handleOpenChange = (v: boolean) => {
    if (!v) resetForm();
    else if (supplier) { setName(supplier.name); setStatus(supplier.status); setTypes(supplier.types); }
    onOpenChange(v);
  };

  const handleSubmit = async () => {
    if (!name.trim()) { toast({ title: 'Nome é obrigatório', variant: 'destructive' }); return; }
    if (types.length === 0) { toast({ title: 'Selecione ao menos um tipo', variant: 'destructive' }); return; }
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: supplier.id, name, status: status as any, types });
        toast({ title: 'Fornecedor atualizado' });
      } else {
        await createMutation.mutateAsync({ name, status: status as any, types, totalAccounts: 0, totalProfiles: 0, totalBMs: 0, totalPages: 0, totalPixels: 0 });
        toast({ title: 'Fornecedor criado' });
      }
      handleOpenChange(false);
    } catch { toast({ title: 'Erro ao salvar', variant: 'destructive' }); }
  };

  const toggleType = (t: SupplierAssetType) => {
    setTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do fornecedor" />
          </div>
          <div className="space-y-2">
            <Label>Tipos de Ativo *</Label>
            <div className="space-y-2">
              {assetTypes.map((at) => (
                <div key={at.value} className="flex items-center gap-2">
                  <Checkbox checked={types.includes(at.value)} onCheckedChange={() => toggleType(at.value)} id={at.value} />
                  <label htmlFor={at.value} className="text-sm text-foreground cursor-pointer">{at.label}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status *</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Ativo</SelectItem>
                <SelectItem value="INACTIVE">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
            {isEditing ? 'Salvar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
