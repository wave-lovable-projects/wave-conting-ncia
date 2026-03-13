import { useState, type ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock } from 'lucide-react';
import { useAdAccountHistory } from '@/hooks/useAdAccounts';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CellWithHistoryProps {
  accountId: string;
  field: string;
  children: ReactNode;
}

export function CellWithHistory({ accountId, field, children }: CellWithHistoryProps) {
  const [open, setOpen] = useState(false);
  const { data: history } = useAdAccountHistory(open ? accountId : null, field);

  return (
    <div className="group relative flex items-center gap-1">
      {children}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-surface-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium text-foreground">Histórico de alterações</p>
          </div>
          <div className="max-h-60 overflow-auto">
            {history && history.length > 0 ? history.map((h) => (
              <div key={h.id} className="p-3 border-b border-border last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  {h.oldValue && <StatusBadge status={h.oldValue} />}
                  <span className="text-muted-foreground text-xs">→</span>
                  {h.newValue && <StatusBadge status={h.newValue} />}
                </div>
                <p className="text-xs text-muted-foreground">
                  {h.changedByName} · {formatDistanceToNow(new Date(h.createdAt), { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            )) : (
              <p className="p-3 text-sm text-muted-foreground">Nenhum histórico encontrado</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
