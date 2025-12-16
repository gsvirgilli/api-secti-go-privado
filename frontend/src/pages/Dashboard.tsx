import { Users, GraduationCap, BookOpen, UserCheck, TrendingUp, Calendar, Plus, Target, Loader2, Clock, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DataBot } from "@/components/ui/DataBot";
import { useNavigate } from "react-router-dom";
import { useAppData } from "@/hooks/useAppData";
import { CalendarAPI } from "@/lib/api";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip
} from "recharts";

// Componente Skeleton para Cards
const CardSkeleton = () => (
  <Card className="animate-pulse border-0 bg-gradient-to-br from-white to-gray-50/50">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </CardContent>
  </Card>
);

// Componente Skeleton para Gráficos
const ChartSkeleton = () => (
  <Card className="animate-pulse border-0 bg-gradient-to-br from-white to-gray-50/50">
    <CardHeader className="pb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-[250px] bg-gray-200 rounded-lg"></div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { students, courses, classes, stats } = useAppData();
  const [isLoading, setIsLoading] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [widgets, setWidgets] = useState([
    { id: 'stats', type: 'stats', visible: true, order: 0 },
    { id: 'charts', type: 'charts', visible: true, order: 1 },
    { id: 'calendar', type: 'calendar', visible: true, order: 2 }
  ]);

  // Carregar eventos do calendário
  useEffect(() => {
    const loadCalendarEvents = async () => {
      try {
        const response = await CalendarAPI.list({ limit: 3 });
        const events = response.data?.data || response.data || [];
        setCalendarEvents(events);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
      }
    };
    loadCalendarEvents();
  }, []);

  // Cores para as barras (ciclo de cores do tema) - DEVE estar ANTES de coursesData
  const barColors = [
    "hsl(var(--primary))",
    "hsl(var(--primary-light))",
    "hsl(var(--primary-dark))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "hsl(var(--muted-foreground))",
  ];

  // Calcular alunos por curso (contando turmas e matriculas)
  const studentsByCourse = courses.map(course => {
    const courseClasses = classes.filter(cls => cls.course === course.title);
    // Usar 'enrolled' que vem do AppContext (já contando _enrollmentCount do backend)
    const totalStudents = courseClasses.reduce((sum, cls) => sum + (cls.enrolled || 0), 0);

    return {
      courseId: course.id,
      courseName: course.title,
      students: totalStudents,
      classes: courseClasses.length
    };
  });

  // Calcular dados reais para os gráficos
  const coursesData = studentsByCourse.length > 0
    ? studentsByCourse.map((item, idx) => ({
      name: item.courseName || `Curso ${idx + 1}`,
      value: item.students,
      fill: barColors[idx % barColors.length]
    }))
    : [
      { name: "Banco de Dados", value: 3, fill: barColors[0] },
      { name: "Desenvolvimento Web", value: 2, fill: barColors[1] },
      { name: "DevOps e Cloud", value: 1, fill: barColors[2] },
      { name: "Mobile (iOS)", value: 2, fill: barColors[3] },
      { name: "Python Avançado", value: 0, fill: barColors[4] }
    ];

  // Função para extrair dia e mês da data
  const getDateInfo = (dateString: string) => {
    if (!dateString) return { day: '--', month: '---' };
    let date: Date;
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString + 'T00:00:00Z');
    }
    if (isNaN(date.getTime())) {
      return { day: '--', month: '---' };
    }
    return {
      day: date.getUTCDate().toString().padStart(2, '0'),
      month: new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' }).format(date).toUpperCase().replace('.', '')
    };
  };

  // Função para obter cor baseado no tipo de evento
  const getEventColor = (tipo: string) => {
    switch (tipo?.toUpperCase()) {
      case "INSCRICAO": return { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-800", badge: "text-blue-700 border-blue-300" };
      case "AULA": return { bg: "bg-green-50", border: "border-green-500", text: "text-green-800", badge: "text-green-700 border-green-300" };
      case "EVENTO": return { bg: "bg-purple-50", border: "border-purple-500", text: "text-purple-800", badge: "text-purple-700 border-purple-300" };
      case "PROVA": return { bg: "bg-red-50", border: "border-red-500", text: "text-red-800", badge: "text-red-700 border-red-300" };
      case "ENTREGA": return { bg: "bg-yellow-50", border: "border-yellow-500", text: "text-yellow-800", badge: "text-yellow-700 border-yellow-300" };
      case "FERIADO": return { bg: "bg-pink-50", border: "border-pink-500", text: "text-pink-800", badge: "text-pink-700 border-pink-300" };
      default: return { bg: "bg-gray-50", border: "border-gray-500", text: "text-gray-800", badge: "text-gray-700 border-gray-300" };
    }
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PLANEJADO": return "bg-blue-100 text-blue-800 border-blue-300";
      case "EM_ANDAMENTO": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "CONCLUIDO": return "bg-green-100 text-green-800 border-green-300";
      case "CANCELADO": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Candidatos em processo seletivo (buscando do stats)
  const candidatesInProcess = stats?.candidates?.pending || 0;

  // Calcular estatísticas reais
  const activeStudents = students.filter(s => s.status === "Ativo").length;
  const activeInstructors = stats.instructors.active;
  const activeCourses = courses.filter(c => c.status === "Ativo").length;
  const activeClasses = classes.filter(c => c.status === "Ativo").length;
  const totalEnrolled = classes.reduce((sum, cls) => sum + (cls.enrolled || 0), 0);
  const totalCapacity = classes.reduce((sum, cls) => sum + (cls.capacity || 0), 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  console.log('📊 Dashboard Debug:', {
    studentsCount: students.length,
    coursesCount: courses.length,
    classesCount: classes.length,
    totalEnrolled,
    totalCapacity,
    occupancyRate
  });

  const handleCardClick = (section: string) => {
    navigate(`/${section}`);
  };

  const toggleWidget = (widgetId: string) => {
    setWidgets(prev => prev.map(widget =>
      widget.id === widgetId
        ? { ...widget, visible: !widget.visible }
        : widget
    ));
  };

  const reorderWidgets = (fromIndex: number, toIndex: number) => {
    const newWidgets = [...widgets];
    const [movedWidget] = newWidgets.splice(fromIndex, 1);
    newWidgets.splice(toIndex, 0, movedWidget);
    setWidgets(newWidgets.map((widget, index) => ({ ...widget, order: index })));
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Skeleton para Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

        {/* Skeleton para Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <ChartSkeleton key={i} />
          ))}
        </div>

        {/* Skeleton para Calendário */}
        <ChartSkeleton />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Card
                className="hover:shadow-lg transition-all duration-500 cursor-pointer group border-0 bg-gradient-to-br from-white to-green-50/50 animate-fade-in"
                onClick={() => handleCardClick('alunos')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total de Alunos</p>
                      <p className="text-3xl font-bold text-foreground animate-count-up">{students.length}</p>
                      <p className="text-sm text-emerald-600">{activeStudents} ativos</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform duration-500">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clique para ver detalhes dos alunos</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card
                className="hover:shadow-lg transition-all duration-500 cursor-pointer group border-0 bg-gradient-to-br from-white to-blue-50/50 animate-fade-in"
                style={{ animationDelay: '100ms' }}
                onClick={() => handleCardClick('instrutores')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Instrutores Ativos</p>
                      <p className="text-3xl font-bold text-foreground animate-count-up">{activeInstructors}</p>
                      <p className="text-sm text-blue-600">Todos disponíveis</p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform duration-500">
                      <UserCheck className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clique para ver detalhes dos instrutores</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card
                className="hover:shadow-lg transition-all duration-500 cursor-pointer group border-0 bg-gradient-to-br from-white to-purple-50/50 animate-fade-in"
                style={{ animationDelay: '200ms' }}
                onClick={() => handleCardClick('cursos')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Cursos Disponíveis</p>
                      <p className="text-3xl font-bold text-foreground animate-count-up">{courses.length}</p>
                      <p className="text-sm text-purple-600">{activeCourses} ativos</p>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-100 text-purple-600 group-hover:scale-110 transition-transform duration-500">
                      <BookOpen className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clique para ver detalhes dos cursos</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card
                className="hover:shadow-lg transition-all duration-500 cursor-pointer group border-0 bg-gradient-to-br from-white to-orange-50/50 animate-fade-in"
                style={{ animationDelay: '300ms' }}
                onClick={() => handleCardClick('turmas')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Turmas Ativas</p>
                      <p className="text-3xl font-bold text-foreground animate-count-up">{classes.length}</p>
                      <p className="text-sm text-orange-600">{activeClasses} ativas</p>
                    </div>
                    <div className="p-3 rounded-xl bg-orange-100 text-orange-600 group-hover:scale-110 transition-transform duration-500">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clique para ver detalhes das turmas</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card
                className="hover:shadow-lg transition-all duration-500 cursor-pointer group border-0 bg-gradient-to-br from-white to-rose-50/50 animate-fade-in"
                style={{ animationDelay: '400ms' }}
                onClick={() => handleCardClick('processo-seletivo-admin')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Processo Seletivo</p>
                      <p className="text-3xl font-bold text-foreground animate-count-up">{candidatesInProcess}</p>
                      <p className="text-sm text-rose-600">Candidatos pendentes</p>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-100 text-rose-600 group-hover:scale-110 transition-transform duration-500">
                      <UserPlus className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clique para ver candidatos em processo seletivo</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Popularity Chart */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                Cursos Mais Procurados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={coursesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80 transition-opacity duration-300"
                  >
                    {coursesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Enrollment Distribution */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                Distribuição de Vagas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Vagas Preenchidas", value: totalEnrolled, fill: "hsl(var(--primary))" },
                        { name: "Vagas Disponíveis", value: totalCapacity - totalEnrolled, fill: "hsl(var(--muted))" }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={40}
                      dataKey="value"
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    >
                      <Cell fill="hsl(var(--primary))" />
                      <Cell fill="hsl(var(--muted))" />
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                      }}
                      formatter={(value, name) => [`${value} vagas`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-sm font-medium">Vagas Preenchidas</span>
                  </div>
                  <Badge variant="secondary" className="font-semibold">{occupancyRate}%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <span className="text-sm font-medium">Vagas Disponíveis</span>
                  </div>
                  <Badge variant="secondary" className="font-semibold">{100 - occupancyRate}%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 animate-fade-in">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  Calendário Acadêmico
                </CardTitle>
              </div>
              <Button variant="outline" className="gap-2" onClick={() => navigate("/calendario")}>
                <Plus className="h-4 w-4" />
                Adicionar Evento
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {calendarEvents.length > 0 ? (
                calendarEvents.map((event: any) => {
                  const dateInfo = getDateInfo(event.data_inicio);
                  const colors = getEventColor(event.tipo);

                  return (
                    <div
                      key={event.id}
                      className={`flex items-center gap-4 p-4 ${colors.bg} rounded-xl border-l-4 ${colors.border} hover:opacity-90 transition-opacity duration-300`}
                    >
                      <div className="text-center min-w-[60px]">
                        <p className={`text-lg font-bold ${colors.text}`}>{dateInfo.day}</p>
                        <p className={`text-xs font-medium ${colors.text}`}>{dateInfo.month}</p>
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${colors.text}`}>{event.titulo}</p>
                        {event.descricao && (
                          <p className={`text-xs ${colors.text} opacity-75`}>{event.descricao}</p>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className={getStatusColor(event.status)}
                      >
                        {event.status?.replace(/_/g, ' ') || "PLANEJADO"}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Nenhum evento próximo</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <DataBot />
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;