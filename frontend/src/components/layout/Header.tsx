import { useState } from "react";
import { Bell, User, X, LogOut, Menu, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Novo aluno cadastrado",
      message: "Maria Silva foi matriculada na Turma A",
      time: "5 min atrás",
      read: false
    },
    {
      id: 2,
      title: "Turma concluída",
      message: "Turma B de Informática finalizou o curso",
      time: "1 hora atrás",
      read: false
    },
    {
      id: 3,
      title: "Instrutor adicionado",
      message: "Carlos Santos foi cadastrado no sistema",
      time: "2 horas atrás",
      read: true
    }
  ]);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleProfileClick = () => {
    navigate("/perfil");
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      {/* Skip to main content for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
      >
        Pular para o conteúdo principal
      </a>
      
      <header 
        className="h-14 sm:h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border flex items-center justify-between px-3 sm:px-4 lg:px-6 lg:pl-6 sticky top-0 z-40"
        role="banner"
      >
        {/* Mobile Menu Button + Search */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 hover:bg-muted focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Abrir menu de navegação"
            aria-expanded="false"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
        
        {/* Action Buttons */}
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Ações do usuário">
          {/* Notifications */}
          <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-muted focus:ring-2 focus:ring-primary focus:ring-offset-2 h-8 w-8 sm:h-9 sm:w-9"
                aria-label={`Notificações${unreadCount > 0 ? ` - ${unreadCount} não lidas` : ''}`}
                aria-describedby="notification-count"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                {unreadCount > 0 && (
                  <>
                    <Badge 
                      id="notification-count"
                      className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 bg-destructive hover:bg-destructive text-destructive-foreground text-xs min-w-0 animate-pulse"
                      aria-live="polite"
                    >
                      {unreadCount}
                    </Badge>
                    <span className="sr-only">{unreadCount} notificações não lidas</span>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-72 sm:w-80 p-0 bg-background border shadow-lg z-50" 
              align="end"
              role="dialog"
              aria-label="Painel de notificações"
            >
              <div className="p-3 sm:p-4 border-b bg-muted/30 flex items-center justify-between">
                <div>
                  {unreadCount > 0 && (
                    <p className="text-xs sm:text-sm text-muted-foreground" aria-live="polite">
                      {unreadCount} não lidas
                    </p>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="flex gap-1">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs h-7 px-2 hover:bg-muted focus:ring-2 focus:ring-primary focus:ring-offset-1"
                        aria-label="Marcar todas as notificações como lidas"
                      >
                        Marcar todas
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllNotifications}
                      className="text-xs h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10 focus:ring-2 focus:ring-destructive focus:ring-offset-1"
                      aria-label="Limpar todas as notificações"
                    >
                      Limpar
                    </Button>
                  </div>
                )}
              </div>
              <div className="max-h-60 sm:max-h-80 overflow-y-auto" role="list" aria-label="Lista de notificações">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`group p-3 sm:p-4 border-b last:border-b-0 hover:bg-muted/50 focus-within:bg-muted/50 cursor-pointer transition-colors ${
                        !notification.read ? "bg-primary/5 border-l-2 border-l-primary" : ""
                      }`}
                      role="listitem"
                      aria-label={`${notification.title} - ${notification.message}`}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div 
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            !notification.read ? "bg-primary" : "bg-transparent"
                          }`} 
                          aria-hidden="true"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs sm:text-sm text-foreground truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="h-7 w-7 p-0 text-primary hover:text-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary focus:ring-offset-1"
                              aria-label={`Marcar "${notification.title}" como lida`}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 focus:ring-2 focus:ring-destructive focus:ring-offset-1"
                            aria-label={`Remover notificação "${notification.title}"`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 sm:p-8 text-center text-muted-foreground" role="status">
                    <Bell className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
                    <p className="text-xs sm:text-sm">Nenhuma notificação</p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-muted focus:ring-2 focus:ring-primary focus:ring-offset-2 h-8 w-8 sm:h-9 sm:w-9"
                aria-label="Menu do usuário"
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 sm:w-56 bg-background border shadow-lg z-50"
              role="menu"
              aria-label="Opções do usuário"
            >
              <DropdownMenuItem 
                onClick={handleProfileClick}
                className="cursor-pointer hover:bg-muted focus:bg-muted focus:ring-2 focus:ring-primary focus:ring-offset-1 text-xs sm:text-sm"
                role="menuitem"
              >
                <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer hover:bg-muted focus:bg-muted focus:ring-2 focus:ring-destructive focus:ring-offset-1 text-destructive focus:text-destructive text-xs sm:text-sm"
                role="menuitem"
              >
                <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
    </>
  );
};

export default Header;