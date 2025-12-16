import { useState, useEffect } from 'react';
import { Bell, Trash2, Check, User, Users, Calendar, AlertCircle } from 'lucide-react';
import { NotificationAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface Notification {
  id: number;
  titulo: string;
  descricao: string;
  tipo: 'ALUNO' | 'TURMA' | 'INSTRUTOR' | 'CALENDARIO' | 'CANDIDATO';
  icone?: string;
  lido: boolean;
  createdAt: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Carregar notificações não lidas
  useEffect(() => {
    loadNotifications();

    // Recarregar a cada 30 segundos
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await NotificationAPI.getUnread();
      setNotifications(response.data?.data || []);
      setUnreadCount(response.data?.unreadCount || 0);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await NotificationAPI.markAsRead(id);
      await loadNotifications();
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await NotificationAPI.delete(id);
      await loadNotifications();
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationAPI.markAllAsRead();
      await loadNotifications();
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case 'ALUNO':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'TURMA':
        return <Users className="h-4 w-4 text-green-600" />;
      case 'INSTRUTOR':
        return <Users className="h-4 w-4 text-purple-600" />;
      case 'CALENDARIO':
        return <Calendar className="h-4 w-4 text-orange-600" />;
      case 'CANDIDATO':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationBgColor = (tipo: string) => {
    switch (tipo) {
      case 'ALUNO':
        return 'bg-blue-50 border-l-4 border-blue-500';
      case 'TURMA':
        return 'bg-green-50 border-l-4 border-green-500';
      case 'INSTRUTOR':
        return 'bg-purple-50 border-l-4 border-purple-500';
      case 'CALENDARIO':
        return 'bg-orange-50 border-l-4 border-orange-500';
      case 'CANDIDATO':
        return 'bg-red-50 border-l-4 border-red-500';
      default:
        return 'bg-gray-50 border-l-4 border-gray-500';
    }
  };

  const formatTime = (date: string) => {
    const notificationDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - notificationDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;

    return notificationDate.toLocaleDateString('pt-BR');
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full hover:bg-muted"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
              variant="default"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white border-b z-10">
          <h2 className="text-sm font-semibold text-foreground">
            Notificações {unreadCount > 0 && `(${unreadCount})`}
          </h2>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={handleMarkAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Notificações */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg ${getNotificationBgColor(notification.tipo)} transition-all hover:shadow-sm`}
              >
                <div className="flex items-start gap-3">
                  {/* Ícone */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.tipo)}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {notification.titulo}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {notification.descricao}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-1 flex-shrink-0">
                    {!notification.lido && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleMarkAsRead(notification.id)}
                        title="Marcar como lida"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleDelete(notification.id)}
                      title="Deletar"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  // Aqui você pode adicionar um link para ver todas as notificações
                  setIsOpen(false);
                }}
              >
                Ver todas as notificações
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
