import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useUpdateRequest, useUpdateRequestStatus } from '@/hooks/useRequests';
import { useUIStore } from '@/store/ui.store';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Request } from '@/types/request';

const WARMING_ACTIONS = [
  'Publicar conteúdo',
  'Interagir com feed',
  'Adicionar amigos',
  'Configurar perfil',
  'Verificar conta',
  'Postar stories',
];

interface Props { request: Request }

export function WarmingTab({ request }: Props) {
  const updateRequest = useUpdateRequest();
  const updateStatus = useUpdateRequestStatus();
  const user = useUIStore((s) => s.user);

  const [checked, setChecked] = useState<boolean[]>(new Array(WARMING_ACTIONS.length).fill(false));
  const [startDate, setStartDate] = useState(request.warmingStartDate?.split('T')[0] ?? '');
  const [endDate, setEndDate] = useState(request.warmingEndDate?.split('T')[0] ?? '');

  const completedCount = checked.filter(Boolean).length;
  const progress = (completedCount / WARMING_ACTIONS.length) * 100;

  const toggleAction = (idx: number) => {
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const handleSaveDates = async () => {
    try {
      await updateRequest.mutateAsync({
        id: request.id,
        warmingStartDate: startDate ? new Date(startDate).toISOString() : undefined,
        warmingEndDate: endDate ? new Date(endDate).toISOString() : undefined,
      });
      toast({ title: 'Datas de aquecimento salvas' });
    } catch {
      toast({ title: 'Erro ao salvar datas', variant: 'destructive' });
    }
  };

  const handleFinish = async () => {
    try {
      await updateStatus.mutateAsync({
        id: request.id,
        status: 'PRONTA',
        changedBy: user?.name ?? 'Sistema',
      });
      toast({ title: 'Aquecimento concluído — solicitação marcada como Pronta' });
    } catch {
      toast({ title: 'Erro ao concluir aquecimento', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-5">
      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Início</label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-9" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Fim</label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-9" />
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={handleSaveDates} disabled={updateRequest.isPending}>
        {updateRequest.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Salvar Datas
      </Button>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="text-foreground font-medium">{completedCount} de {WARMING_ACTIONS.length} ações concluídas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        {WARMING_ACTIONS.map((action, idx) => (
          <label
            key={action}
            className="flex items-center gap-3 bg-surface-1 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-surface-2 transition-colors"
          >
            <Checkbox
              checked={checked[idx]}
              onCheckedChange={() => toggleAction(idx)}
            />
            <span className="text-sm text-foreground">{action}</span>
          </label>
        ))}
      </div>

      {/* Finish */}
      {request.status === 'EM_AQUECIMENTO' && (
        <Button
          onClick={handleFinish}
          disabled={updateStatus.isPending}
          className="w-full bg-success text-success-foreground hover:bg-success/90"
        >
          {updateStatus.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Concluir Aquecimento
        </Button>
      )}
    </div>
  );
}
