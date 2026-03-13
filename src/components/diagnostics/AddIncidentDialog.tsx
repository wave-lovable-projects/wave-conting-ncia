import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useCreateIncident } from '@/hooks/useDiagnostics';
import { getMockDiagnosticNodes } from '@/data/mock-diagnostics';
import { ASSET_TYPE_LABELS, RESTRICTION_TYPE_LABELS } from '@/types/diagnostic';
import type { AssetType, RestrictionType } from '@/types/diagnostic';
import { useUIStore } from '@/store/ui.store';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddIncidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddIncidentDialog({ open, onOpenChange }: AddIncidentDialogProps) {
  const user = useUIStore(s => s.user);
  const [date, setDate] = useState<Date>(new Date());
  const [assetType, setAssetType] = useState<string>('');
  const [assetId, setAssetId] = useState('');
  const [restrictionType, setRestrictionType] = useState<string>('');
  const [fbReason, setFbReason] = useState('');
  const [suspectedCause, setSuspectedCause] = useState('');
  const [notes, setNotes] = useState('');

  const createIncident = useCreateIncident();
  const nodes = getMockDiagnosticNodes();
  const filteredNodes = assetType ? nodes.filter(n => n.type === assetType) : nodes;
  const selectedNode = nodes.find(n => n.id === assetId);

  const handleSubmit = () => {
    if (!assetId || !restrictionType || !selectedNode) return;
    createIncident.mutate({
      date: format(date, 'yyyy-MM-dd'),
      assetType: selectedNode.type,
      assetId,
      assetName: selectedNode.name,
      restrictionType: restrictionType as RestrictionType,
      facebookReason: fbReason || undefined,
      suspectedCause: suspectedCause || undefined,
      linkedElements: [],
      notes: notes || undefined,
      createdByName: user?.name || 'Usuário',
    }, { onSuccess: () => { onOpenChange(false); reset(); } });
  };

  const reset = () => { setAssetType(''); setAssetId(''); setRestrictionType(''); setFbReason(''); setSuspectedCause(''); setNotes(''); setDate(new Date()); };

  return (
    <Dialog open={open} onOpenChange={v => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Registrar Incidente</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Data *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full justify-start text-left font-normal')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'dd/MM/yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={d => d && setDate(d)} className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Tipo do Ativo *</Label>
            <Select value={assetType} onValueChange={v => { setAssetType(v); setAssetId(''); }}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {Object.entries(ASSET_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ativo *</Label>
            <Select value={assetId} onValueChange={setAssetId}>
              <SelectTrigger><SelectValue placeholder="Selecione o ativo" /></SelectTrigger>
              <SelectContent>
                {filteredNodes.map(n => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Restrição *</Label>
            <Select value={restrictionType} onValueChange={setRestrictionType}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {Object.entries(RESTRICTION_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Motivo no Facebook</Label>
            <Input value={fbReason} onChange={e => setFbReason(e.target.value)} placeholder="Mensagem exibida pelo Facebook" />
          </div>

          <div className="space-y-2">
            <Label>Causa Suspeita</Label>
            <Input value={suspectedCause} onChange={e => setSuspectedCause(e.target.value)} placeholder="O que pode ter causado" />
          </div>

          <div className="space-y-2">
            <Label>Notas</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Observações adicionais" rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!assetId || !restrictionType || createIncident.isPending}>
            {createIncident.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            Registrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
