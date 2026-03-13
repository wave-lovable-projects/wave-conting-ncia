import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  LOW: { label: 'Baixa', className: 'bg-muted text-muted-foreground border-border' },
  MEDIUM: { label: 'Média', className: 'bg-info/15 text-info border-info/30' },
  HIGH: { label: 'Alta', className: 'bg-caution/15 text-caution border-caution/30' },
  URGENT: { label: 'Urgente', className: 'bg-destructive/15 text-destructive border-destructive/30 animate-pulse-glow' },
};

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <Badge variant="outline" className={cn('font-medium text-xs', config.className, className)}>
      {config.label}
    </Badge>
  );
}
