import { useState } from "react";
import { Bell, Check, Clock, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const allNotifications = [
  {
    id: 1,
    title: "Novo aluno cadastrado",
    message: "Maria Silva foi matriculada na Turma A de Robótica",
    time: "5 min atrás",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    type: "student"
  },
  {
    id: 2,
    title: "Turma concluída",
    message: "Turma B de Informática finalizou o curso com 15 alunos aprovados",
    time: "1 hora atrás",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    read: false,
    type: "class"
  },
  {
    id: 3,
    title: "Instrutor adicionado",
    message: "Carlos Santos foi cadastrado no sistema como instrutor de Python",
    time: "2 horas atrás",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    type: "instructor"
  },
  {
    id: 4,
    title: "Nova matrícula",
    message: "João Pedro se matriculou na Turma C de Programação",
    time: "1 dia atrás",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    type: "student"
  },
  {
    id: 5,
    title: "Curso atualizado",
    message: "O curso de Web Design teve sua carga horária alterada para 100h",
    time: "2 dias atrás",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    type: "course"
  },
  {
    id: 6,
    title: "Aluno desmatriculado",
    message: "Ana Costa foi desmatriculada da Turma D por solicitação própria",
    time: "3 dias atrás",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
    type: "student"
  },
  {
    id: 7,
    title: "Relatório gerado",
    message: "Relatório mensal de frequência dos alunos foi gerado automaticamente",
    time: "1 semana atrás",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    read: true,
    type: "system"
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(allNotifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    if (filter !== "all") return notification.type === filter;
    return true;
  });

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "student": return "👨‍🎓";
      case "instructor": return "👨‍🏫";
      case "class": return "🎓";
      case "course": return "📚";
      case "system": return "⚙️";
      default: return "📢";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "student": return "bg-blue-100 text-blue-700";
      case "instructor": return "bg-purple-100 text-purple-700";
      case "class": return "bg-green-100 text-green-700";
      case "course": return "bg-orange-100 text-orange-700";
      case "system": return "bg-gray-100 text-gray-700";
      default: return "bg-primary-100 text-primary-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Bell className="h-8 w-8" />
            Notificações
          </h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} notificação${unreadCount > 1 ? 'ões' : ''} não lida${unreadCount > 1 ? 's' : ''}` : 'Todas as notificações foram lidas'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} className="gap-2">
            <Check className="h-4 w-4" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar notificações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas ({notifications.length})</SelectItem>
                <SelectItem value="unread">Não lidas ({unreadCount})</SelectItem>
                <SelectItem value="read">Lidas ({notifications.length - unreadCount})</SelectItem>
                <Separator />
                <SelectItem value="student">Alunos</SelectItem>
                <SelectItem value="instructor">Instrutores</SelectItem>
                <SelectItem value="class">Turmas</SelectItem>
                <SelectItem value="course">Cursos</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filter === "all" && "Todas as notificações"}
            {filter === "unread" && "Notificações não lidas"}
            {filter === "read" && "Notificações lidas"}
            {filter === "student" && "Notificações de alunos"}
            {filter === "instructor" && "Notificações de instrutores"}
            {filter === "class" && "Notificações de turmas"}
            {filter === "course" && "Notificações de cursos"}
            {filter === "system" && "Notificações do sistema"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-muted/30 transition-colors ${
                    !notification.read ? "bg-primary/5 border-l-4 border-l-primary" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-2xl">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {notification.time}
                            </div>
                            <Badge variant="outline" className={getTypeColor(notification.type)}>
                              {notification.type === "student" && "Aluno"}
                              {notification.type === "instructor" && "Instrutor"}
                              {notification.type === "class" && "Turma"}
                              {notification.type === "course" && "Curso"}
                              {notification.type === "system" && "Sistema"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-primary hover:text-primary"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                Nenhuma notificação encontrada
              </h3>
              <p className="text-muted-foreground">
                {filter === "unread" 
                  ? "Você não tem notificações não lidas."
                  : "Não há notificações para este filtro."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;