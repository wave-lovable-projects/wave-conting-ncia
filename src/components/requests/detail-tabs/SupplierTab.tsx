import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useUpdateRequest, useUpdateRequestStatus } from '@/hooks/useRequests';
import { useUIStore } from '@/store/ui.store';
import { getMockSuppliers } from '@/data/mock-suppliers';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Loader2, CheckCircle, Circle, ArrowRight } from 'lucide-react';
import type { Request } from '@/types/request';
import { cn } from '@/lib/utils';

interface Props { request: Request }

export function SupplierTab({ request }: Props) {
  const suppliers = getMockSuppliers().filter((s) => s.status === 'ACTIVE');
  const updateRequest = useUpdateRequest();
  const updateStatus = useUpdateRequestStatus();
  const user = useUIStore((s) => s.user);

  const [supplierId, setSupplierId] = useState(request.supplierId ?? '');
  const [orderDate, setOrderDate] = useState(request.supplierOrderDate?.split('T')[0] ?? '');
  const [expectedDate, setExpectedDate] = useState(request.supplierExpectedDate?.split('T')[0] ?? '');
  const [cost, setCost] = useState(request.supplierCost?.toString() ?? '');
  const [notes, setNotes] = useState('');

  const selectedSupplier = suppliers.find((s) => s.id === supplierId);
  const hasSupplierData = !!request.supplierId;

  const handleSave = async () => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    if (!supplier) return;
    try {
      await updateRequest.mutateAsync({
        id: request.id,
        supplierId,
        supplierName: supplier.name,
        supplierOrderDate: orderDate ? new Date(orderDate).toISOString() : undefined,
        supplierExpectedDate: expectedDate ? new Date(expectedDate).toISOString() : undefined,
        supplierCost: cost ? parseFloat(cost) : undefined,
      });
      toast({ title: 'Dados do fornecedor salvos' });
    } catch {
      toast({ title: 'Erro ao salvar dados do fornecedor', variant: 'destructive' });
    }
  };

  const handleMarkReceived = async () => {
    try {
      await updateRequest.mutateAsync({
        id: request.id,
        supplierReceivedDate: new Date().toISOString(),
      });
      await updateStatus.mutateAsync({
        id: request.id,
        status: 'RECEBIDA',
        changedBy: user?.name ?? 'Sistema',
      });
      toast({ title: 'Solicitação marcada como recebida' });
    } catch {
      toast({ title: 'Erro ao marcar como recebida', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-5">
      {/* Supplier timeline if data exists */}
      {hasSupplierData && (
        <>
          <div className="bg-surface-1 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Timeline do Pedido</h4>
            <div className="flex items-center gap-2 text-xs">
              <TimelineStep
                label="Pedido"
                date={request.supplierOrderDate}
                done={!!request.supplierOrderDate}
              />
              <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <TimelineStep
                label="Previsão"
                date={request.supplierExpectedDate}
                done={!!request.supplierExpectedDate}
              />
              <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <TimelineStep
                label="Recebido"
                date={request.supplierReceivedDate}
                done={!!request.supplierReceivedDate}
              />
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Fornecedor</label>
          <Select value={supplierId} onValueChange={setSupplierId}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Selecionar fornecedor..." /></SelectTrigger>
            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Data do Pedido</label>
            <Input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} className="h-9" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Previsão de Entrega</label>
            <Input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} className="h-9" />
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Custo Estimado (R$)</label>
          <Input type="number" step="0.01" min="0" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0,00" className="h-9" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Observações</label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observações sobre o pedido..." rows={3} />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={!supplierId || updateRequest.isPending} className="flex-1">
          {updateRequest.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Salvar Dados do Fornecedor
        </Button>
        {request.status === 'SOLICITADA_FORNECEDOR' && !request.supplierReceivedDate && (
          <Button
            variant="outline"
            onClick={handleMarkReceived}
            disabled={updateStatus.isPending}
            className="border-success text-success hover:bg-success/10"
          >
            {updateStatus.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Marcar como Recebido
          </Button>
        )}
      </div>
    </div>
  );
}

function TimelineStep({ label, date, done }: { label: string; date?: string; done: boolean }) {
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      {done ? (
        <CheckCircle className="h-4 w-4 text-success" />
      ) : (
        <Circle className="h-4 w-4 text-muted-foreground" />
      )}
      <div>
        <p className={cn('font-medium', done ? 'text-foreground' : 'text-muted-foreground')}>{label}</p>
        {date && <p className="text-muted-foreground">{format(new Date(date), 'dd/MM/yyyy')}</p>}
      </div>
    </div>
  );
}
