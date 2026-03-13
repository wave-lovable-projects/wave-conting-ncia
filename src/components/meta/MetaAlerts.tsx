import { AlertTriangle, PauseCircle, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMetaAlerts } from '@/hooks/useMeta';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { MetaAlertType } from '@/types/meta';

const alertConfig: Record<MetaAlertType, { icon: typeof AlertTriangle; color: string; label: string }> = {
  account_disabled: { icon: AlertTriangle, color: 'text-destructive', label: 'Conta Desativada' },
  campaign_paused: { icon: PauseCircle, color: 'text-warning', label: 'Campanha Pausada' },
  page_restricted: { icon: ShieldAlert, color: 'text-warning', label: 'Página Restrita' },
};

export function MetaAlerts() {
  const { data: alerts, isLoading } = useMetaAlerts();

  if (isLoading) return <LoadingSpinner className="py-8" />;
  if (!alerts?.length) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Alertas Recentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border',
                alert.type === 'account_disabled'
                  ? 'border-destructive/30 bg-destructive/5'
                  : 'border-warning/30 bg-warning/5'
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', config.color)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('text-xs font-semibold', config.color)}>{config.label}</span>
                  <span className="text-xs text-muted-foreground">• {alert.accountName}</span>
                  {alert.assetName && (
                    <span className="text-xs text-muted-foreground">• {alert.assetName}</span>
                  )}
                </div>
                <p className="text-sm text-foreground mt-0.5">{alert.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(alert.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
