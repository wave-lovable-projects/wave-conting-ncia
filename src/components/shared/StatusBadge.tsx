import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: 'Ativa', className: 'bg-success/15 text-success border-success/30' },
  DISABLED: { label: 'Desativada', className: 'bg-destructive/15 text-destructive border-destructive/30' },
  ROLLBACK: { label: 'Rollback', className: 'bg-warning/15 text-warning border-warning/30' },
  BLOCKED: { label: 'Bloqueada', className: 'bg-destructive/20 text-destructive border-destructive/40' },
  STANDBY: { label: 'Standby', className: 'bg-muted text-muted-foreground border-border' },
  IN_USE: { label: 'Em Uso', className: 'bg-info/15 text-info border-info/30' },
  RETIRED: { label: 'Aposentada', className: 'bg-surface-3 text-muted-foreground border-border' },
  PENDING: { label: 'Pendente', className: 'bg-warning/15 text-warning border-warning/30' },
  IN_PROGRESS: { label: 'Em Andamento', className: 'bg-info/15 text-info border-info/30' },
  DONE: { label: 'Concluída', className: 'bg-success/15 text-success border-success/30' },
  REJECTED: { label: 'Rejeitada', className: 'bg-destructive/15 text-destructive border-destructive/30' },
  ANALYZING: { label: 'Analisando', className: 'bg-accent-purple/15 text-accent-purple border-accent-purple/30' },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-muted text-muted-foreground border-border' };
  return (
    <Badge variant="outline" className={cn('font-medium text-xs', config.className, className)}>
      {config.label}
    </Badge>
  );
}
