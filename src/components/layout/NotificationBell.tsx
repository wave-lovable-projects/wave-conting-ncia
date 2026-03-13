import { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Conta desativada', body: 'A conta "Ads Principal" foi desativada automaticamente.', createdAt: new Date(Date.now() - 5 * 60000), read: false },
  { id: '2', title: 'Nova solicitação', body: 'João enviou uma solicitação de BM.', createdAt: new Date(Date.now() - 30 * 60000), read: false },
  { id: '3', title: 'Rollback concluído', body: 'O rollback da conta #4521 foi finalizado.', createdAt: new Date(Date.now() - 2 * 3600000), read: true },
  { id: '4', title: 'Pixel atualizado', body: 'O pixel "Conv-Main" foi reconectado com sucesso.', createdAt: new Date(Date.now() - 5 * 3600000), read: true },
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
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-semibold text-foreground">Notificações</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="h-7 text-xs gap-1">
              <Check className="h-3 w-3" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">
              Nenhuma notificação
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`px-4 py-3 border-b border-border-subtle last:border-0 ${
                  !n.read ? 'bg-surface-1' : ''
                }`}
              >
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {formatDistanceToNow(n.createdAt, { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            ))
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
