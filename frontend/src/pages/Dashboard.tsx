import { Users, GraduationCap, BookOpen, UserCheck, TrendingUp, Calendar, Plus, Target, Loader2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DataBot } from "@/components/ui/DataBot";
import { useNavigate } from "react-router-dom";
import { useAppData } from "@/hooks/useAppData";
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
  const { students, courses, classes } = useAppData();
  const [isLoading, setIsLoading] = useState(false);
  const [widgets, setWidgets] = useState([
    { id: 'stats', type: 'stats', visible: true, order: 0 },
    { id: 'charts', type: 'charts', visible: true, order: 1 },
    { id: 'calendar', type: 'calendar', visible: true, order: 2 }
  ]);

  // Calcular dados reais para os gráficos
  const coursesData = courses.map(course => ({
    name: course.title,
    value: course.students,
    fill: course.color.replace('bg-', 'hsl(var(--primary))')
  }));

  // Cores para as barras (ciclo de cores do tema)
  const barColors = [
    "hsl(var(--primary))",
    "hsl(var(--primary-light))", 
    "hsl(var(--primary-dark))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "hsl(var(--muted-foreground))",
  ];

  // Calcular estatísticas reais
  const activeStudents = students.filter(s => s.status === "Ativo").length;
  const activeInstructors = 4;
  const activeCourses = courses.filter(c => c.status === "Ativo").length;
  const activeClasses = classes.filter(c => c.status === "Ativo").length;
  const totalEnrolled = classes.reduce((sum, cls) => sum + cls.enrolled, 0);
  const totalCapacity = classes.reduce((sum, cls) => sum + cls.capacity, 0);
  const occupancyRate = Math.round((totalEnrolled / totalCapacity) * 100) || 0;

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border-l-4 border-primary hover:bg-primary/10 transition-colors duration-300">
                  <div className="text-center min-w-[60px]">
                    <p className="text-lg font-bold text-primary">15</p>
                    <p className="text-xs text-muted-foreground font-medium">SET</p>
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">Início das Inscrições</p>
                  <p className="text-xs text-muted-foreground">Turma de Programação Web</p>
                </div>
                  <Badge variant="outline" className="text-primary border-primary">Em Breve</Badge>
              </div>
              
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border-l-4 border-orange-500 hover:bg-orange-100 transition-colors duration-300">
                  <div className="text-center min-w-[60px]">
                    <p className="text-lg font-bold text-orange-600">22</p>
                    <p className="text-xs text-muted-foreground font-medium">SET</p>
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-sm text-orange-800">Início das Aulas</p>
                    <p className="text-xs text-orange-600">Turma de Robótica Básica</p>
                </div>
                  <Badge variant="outline" className="text-orange-700 border-orange-300">Próximo</Badge>
              </div>
              
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500 hover:bg-blue-100 transition-colors duration-300">
                  <div className="text-center min-w-[60px]">
                    <p className="text-lg font-bold text-blue-600">30</p>
                    <p className="text-xs text-muted-foreground font-medium">SET</p>
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-sm text-blue-800">Formatura</p>
                    <p className="text-xs text-blue-600">Turma de Informática Avançada</p>
                </div>
                  <Badge variant="outline" className="text-blue-700 border-blue-300">Evento</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

      <DataBot />
    </div>
    </TooltipProvider>
  );
};

export default Dashboard;