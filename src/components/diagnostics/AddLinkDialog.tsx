import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateDiagnosticLink } from '@/hooks/useDiagnostics';
import { getMockDiagnosticNodes } from '@/data/mock-diagnostics';
import { ASSET_TYPE_LABELS } from '@/types/diagnostic';
import type { AssetType } from '@/types/diagnostic';
import { Loader2 } from 'lucide-react';

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLinkDialog({ open, onOpenChange }: AddLinkDialogProps) {
  const [sourceType, setSourceType] = useState<string>('');
  const [sourceId, setSourceId] = useState('');
  const [targetType, setTargetType] = useState<string>('');
  const [targetId, setTargetId] = useState('');
  const [relationship, setRelationship] = useState('');

  const createLink = useCreateDiagnosticLink();
  const nodes = getMockDiagnosticNodes();

  const sourceNodes = sourceType ? nodes.filter(n => n.type === sourceType) : nodes;
  const targetNodes = targetType ? nodes.filter(n => n.type === targetType) : nodes;

  const selectedSource = nodes.find(n => n.id === sourceId);
  const selectedTarget = nodes.find(n => n.id === targetId);

  const handleSubmit = () => {
    if (!sourceId || !targetId || !relationship.trim() || !selectedSource || !selectedTarget) return;
    createLink.mutate({
      sourceType: selectedSource.type,
      sourceId,
      sourceName: selectedSource.name,
      targetType: selectedTarget.type,
      targetId,
      targetName: selectedTarget.name,
      relationship: relationship.trim(),
    }, { onSuccess: () => { onOpenChange(false); reset(); } });
  };

  const reset = () => { setSourceType(''); setSourceId(''); setTargetType(''); setTargetId(''); setRelationship(''); };

  return (
    <Dialog open={open} onOpenChange={v => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Nova Conexão</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Origem</Label>
            <Select value={sourceType} onValueChange={v => { setSourceType(v); setSourceId(''); }}>
              <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
              <SelectContent>
                {Object.entries(ASSET_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Ativo de Origem *</Label>
            <Select value={sourceId} onValueChange={setSourceId}>
              <SelectTrigger><SelectValue placeholder="Selecione o ativo" /></SelectTrigger>
              <SelectContent>
                {sourceNodes.map(n => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tipo de Destino</Label>
            <Select value={targetType} onValueChange={v => { setTargetType(v); setTargetId(''); }}>
              <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
              <SelectContent>
                {Object.entries(ASSET_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Ativo de Destino *</Label>
            <Select value={targetId} onValueChange={setTargetId}>
              <SelectTrigger><SelectValue placeholder="Selecione o ativo" /></SelectTrigger>
              <SelectContent>
                {targetNodes.map(n => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tipo de Relação *</Label>
            <Input value={relationship} onChange={e => setRelationship(e.target.value)} placeholder='Ex: "vinculada a", "compartilha BM com"' />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!sourceId || !targetId || !relationship.trim() || createLink.isPending}>
            {createLink.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            Criar Conexão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
