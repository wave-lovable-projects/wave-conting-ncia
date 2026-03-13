import { Copy, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { useMetaAccounts } from '@/hooks/useMeta';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export function MetaAccountCards() {
  const { data: accounts, isLoading } = useMetaAccounts();

  if (isLoading) return <LoadingSpinner className="py-8" />;
  if (!accounts?.length) return null;

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({ title: 'ID copiado', description: id });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-3">Contas Sincronizadas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {accounts.map((acc) => {
          const isInactive = acc.status !== 'ACTIVE';
          return (
            <Card
              key={acc.id}
              className={cn(
                'transition-colors',
                isInactive && 'border-destructive/40 bg-destructive/5'
              )}
            >
              <CardContent className="py-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-foreground text-sm truncate">{acc.name}</p>
                  <StatusBadge status={acc.status} />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="font-mono">{acc.accountId}</span>
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyId(acc.accountId)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Saldo</span>
                  <span className="font-semibold text-foreground">
                    {acc.currency === 'BRL' ? 'R$' : '$'} {acc.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {acc.spendCap !== undefined && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Spend Cap</span>
                    <span>{acc.currency === 'BRL' ? 'R$' : '$'} {acc.spendCap.toLocaleString('pt-BR')}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Sincronizado {formatDistanceToNow(new Date(acc.lastSyncAt), { addSuffix: true, locale: ptBR })}
                </p>
                {isInactive && (
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Conta inativa</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
