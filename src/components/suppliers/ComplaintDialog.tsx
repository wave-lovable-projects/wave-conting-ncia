import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSuppliers, useCreateComplaint } from '@/hooks/useSuppliers';
import { toast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComplaintDialog({ open, onOpenChange }: Props) {
  const [supplierId, setSupplierId] = useState('');
  const [assetType, setAssetType] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const { data: suppliers } = useSuppliers();
  const createMutation = useCreateComplaint();

  const reset = () => { setSupplierId(''); setAssetType(''); setDescription(''); setPriority('MEDIUM'); };

  const handleSubmit = async () => {
    if (!supplierId || !assetType || !description.trim()) {
      toast({ title: 'Preencha todos os campos obrigatórios', variant: 'destructive' });
      return;
    }
    const supplier = suppliers?.find((s) => s.id === supplierId);
    try {
      await createMutation.mutateAsync({
        supplierId, supplierName: supplier?.name, assetType, description, priority: priority as any,
        status: 'OPEN', attachments: [],
      });
      toast({ title: 'Reclamação criada' });
      reset();
      onOpenChange(false);
    } catch { toast({ title: 'Erro ao criar reclamação', variant: 'destructive' }); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Nova Reclamação</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Fornecedor *</Label>
            <Select value={supplierId} onValueChange={setSupplierId}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{suppliers?.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tipo do Ativo *</Label>
            <Select value={assetType} onValueChange={setAssetType}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="CONTAS">Contas</SelectItem>
                <SelectItem value="PERFIS">Perfis</SelectItem>
                <SelectItem value="BMS">BMs</SelectItem>
                <SelectItem value="PAGINAS">Páginas</SelectItem>
                <SelectItem value="PIXELS">Pixels</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Descrição *</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva o problema..." rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Prioridade *</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Baixa</SelectItem>
                <SelectItem value="MEDIUM">Média</SelectItem>
                <SelectItem value="HIGH">Alta</SelectItem>
                <SelectItem value="URGENT">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending}>Criar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
