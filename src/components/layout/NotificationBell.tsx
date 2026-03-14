import { useState, useEffect } from 'react';
import { Bell, Check, CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  createdAt: Date;
  read: boolean;
}

const typeIcon: Record<NotificationType, { icon: typeof Info; className: string }> = {
  info: { icon: Info, className: 'text-info' },
  success: { icon: CheckCircle2, className: 'text-success' },
  warning: { icon: AlertTriangle, className: 'text-warning' },
  error: { icon: XCircle, className: 'text-destructive' },
};

const mockNotifications: Notification[] = [
  {
    id: '1', type: 'success',
    title: 'Solicitação aprovada',
    body: 'Sua solicitação "5 contas de anúncio nicho Saúde" foi aprovada pelo contingência.',
    createdAt: new Date(Date.now() - 5 * 60000), read: false,
  },
  {
    id: '2', type: 'info',
    title: 'Pedido ao fornecedor realizado',
    body: 'Pedido ao fornecedor realizado para solicitação "10 perfis para aquecimento squad Alpha".',
    createdAt: new Date(Date.now() - 25 * 60000), read: false,
  },
  {
    id: '3', type: 'info',
    title: 'Ativos recebidos',
    body: 'Ativos recebidos para solicitação "3 contas de anúncio" — aguardando aquecimento.',
    createdAt: new Date(Date.now() - 50 * 60000), read: false,
  },
  {
    id: '4', type: 'success',
    title: 'Solicitação pronta para entrega',
    body: 'Solicitação "2 BMs prontas para entrega" está pronta para entrega.',
    createdAt: new Date(Date.now() - 2 * 3600000), read: false,
  },
  {
    id: '5', type: 'success',
    title: 'Solicitação entregue',
    body: 'Solicitação "8 contas entregues ao squad Gamma" foi entregue — 8 contas vinculadas.',
    createdAt: new Date(Date.now() - 4 * 3600000), read: true,
  },
  {
    id: '6', type: 'error',
    title: 'Solicitação rejeitada',
    body: 'Solicitação "Solicitação de perfis rejeitada" foi rejeitada — motivo: sem orçamento.',
    createdAt: new Date(Date.now() - 6 * 3600000), read: true,
  },
  {
    id: '7', type: 'warning',
    title: 'ALERTA: Solicitação parada',
    body: 'Solicitação "5 perfis em aquecimento" está parada há 7 dias na etapa "Em Aquecimento".',
    createdAt: new Date(Date.now() - 1 * 3600000), read: false,
  },
];

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    document.title = unreadCount > 0 ? `(${unreadCount}) WAVE` : 'WAVE';
  }, [unreadCount]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-surface-2 transition-colors text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-semibold text-foreground">Notificações</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="h-7 text-xs gap-1">
              <Check className="h-3 w-3" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">
              Nenhuma notificação
            </p>
          ) : (
            notifications.map((n) => {
              const { icon: TypeIcon, className: iconClass } = typeIcon[n.type];
              return (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-border last:border-0 flex gap-3 ${
                    !n.read ? 'bg-surface-1' : ''
                  }`}
                >
                  <TypeIcon className={`h-4 w-4 shrink-0 mt-0.5 ${iconClass}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {formatDistanceToNow(n.createdAt, { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </div>
              );
            })
          )}
        </ScrollArea>
        <div className="border-t border-border px-4 py-2">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            Ver todas
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
