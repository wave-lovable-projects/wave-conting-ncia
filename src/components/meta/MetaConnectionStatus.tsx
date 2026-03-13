import { CheckCircle2, XCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MetaConnectButton } from './MetaConnectButton';
import { useMetaAuthStatus, useSyncMetaAccounts, useDisconnectMeta } from '@/hooks/useMeta';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function MetaConnectionStatus() {
  const { data: auth, isLoading } = useMetaAuthStatus();
  const sync = useSyncMetaAccounts();
  const disconnect = useDisconnectMeta();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!auth?.connected) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="flex flex-col sm:flex-row items-center gap-4 py-6">
          <XCircle className="h-10 w-10 text-destructive shrink-0" />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-lg font-semibold text-foreground">Não conectado</p>
            <p className="text-sm text-muted-foreground">
              Conecte sua conta Meta para sincronizar contas de anúncio e campanhas.
            </p>
          </div>
          <MetaConnectButton />
        </CardContent>
      </Card>
    );
  }

  const expiresAt = auth.tokenExpiresAt ? new Date(auth.tokenExpiresAt) : null;
  const lastSync = auth.lastSyncAt ? new Date(auth.lastSyncAt) : null;

  return (
    <Card className="border-success/30">
      <CardContent className="flex flex-col sm:flex-row items-center gap-4 py-6">
        <CheckCircle2 className="h-10 w-10 text-success shrink-0" />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-lg font-semibold text-foreground">
            Conectado como <span className="text-success">{auth.userName}</span>
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
            {expiresAt && (
              <span>Token expira em {format(expiresAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
            )}
            {lastSync && (
              <span>Última sync: {format(lastSync, "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => sync.mutate()}
            disabled={sync.isPending}
            className="gap-2"
          >
            {sync.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Sincronizar Agora
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => disconnect.mutate()}
            disabled={disconnect.isPending}
            className="text-destructive hover:text-destructive"
          >
            Desconectar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
