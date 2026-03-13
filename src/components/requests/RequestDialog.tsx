import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useCreateRequest } from '@/hooks/useRequests';
import { toast } from '@/hooks/use-toast';
import { REQUEST_TYPES, REQUEST_TYPE_LABELS } from '@/types/request';
import type { RequestType } from '@/types/request';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestDialog({ open, onOpenChange }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assetType, setAssetType] = useState<RequestType>('CONTA_ANUNCIO');
  const [priority, setPriority] = useState('MEDIUM');
  const [quantity, setQuantity] = useState(1);
  const [dueDate, setDueDate] = useState<Date>();

  const createMutation = useCreateRequest();

  const reset = () => { setTitle(''); setDescription(''); setAssetType('CONTA_ANUNCIO'); setPriority('MEDIUM'); setQuantity(1); setDueDate(undefined); };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast({ title: 'Preencha todos os campos obrigatórios', variant: 'destructive' });
      return;
    }
    try {
      await createMutation.mutateAsync({
        title, description, assetType, priority: priority as any,
        status: 'PENDENTE', quantity, requesterId: 'u1', requesterName: 'Admin Wave',
        attachments: [], dueDate: dueDate?.toISOString(),
      });
      toast({ title: 'Solicitação criada com sucesso' });
      reset();
      onOpenChange(false);
    } catch {
      toast({ title: 'Erro ao criar solicitação. Tente novamente.', variant: 'destructive' });
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader><SheetTitle>Nova Solicitação</SheetTitle></SheetHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da solicitação" />
          </div>
          <div className="space-y-2">
            <Label>Descrição *</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva a solicitação..." rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Ativo *</Label>
              <Select value={assetType} onValueChange={(v) => setAssetType(v as RequestType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REQUEST_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{REQUEST_TYPE_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantidade *</Label>
              <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value) || 1)} />
            </div>
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
          <div className="space-y-2">
            <Label>Previsão de Entrega</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'dd/MM/yyyy') : 'Selecionar data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancelar</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending} className="flex-1">
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
