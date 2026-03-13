import { Button } from '@/components/ui/button';
import { Pencil, Trash2, X } from 'lucide-react';

interface BulkActionsBarProps {
  count: number;
  onBulkEdit?: () => void;
  onBulkDelete: () => void;
  onClear: () => void;
}

export function BulkActionsBar({ count, onBulkEdit, onBulkDelete, onClear }: BulkActionsBarProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface-2 px-4 py-2.5 border border-border">
      <span className="text-sm font-medium text-foreground">{count} {count === 1 ? 'item selecionado' : 'itens selecionados'}</span>
      <div className="h-4 w-px bg-border" />
      <Button variant="outline" size="sm" onClick={onBulkEdit}>
        <Pencil className="h-3.5 w-3.5 mr-1.5" /> Editar em massa
      </Button>
      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={onBulkDelete}>
        <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Excluir
      </Button>
      <Button variant="ghost" size="sm" onClick={onClear}>
        <X className="h-3.5 w-3.5 mr-1.5" /> Limpar
      </Button>
    </div>
  );
}
