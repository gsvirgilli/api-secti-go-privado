import { useState } from "react";
import { DataBot } from "@/components/ui/DataBot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, TrendingUp, Users, Calendar, Filter, BarChart3, PieChart, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart as RechartsLineChart, Line } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { useAppData } from "@/hooks/useAppData";

const Reports = () => {
  const { toast } = useToast();
  const { stats, charts, students, courses, classes } = useAppData();
  
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    course: "all",
    class: "all", 
    status: "all",
    instructor: "all"
  });
  
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  // Process real data for charts
  const studentsPerCourse = courses.map(course => {
    const courseStudents = students.filter(s => s.course === course.title);
    const activeStudents = courseStudents.filter(s => s.status === "Ativo");
    return {
      name: course.title,
      students: courseStudents.length,
      active: activeStudents.length,
      inactive: courseStudents.length - activeStudents.length
    };
  });

  const monthlyEnrollments = [
    { month: "Jan", enrollments: 12, completions: 8 },
    { month: "Fev", enrollments: 18, completions: 10 },
    { month: "Mar", enrollments: 25, completions: 15 },
    { month: "Abr", enrollments: 30, completions: 20 },
    { month: "Mai", enrollments: 22, completions: 18 },
    { month: "Jun", enrollments: 28, completions: 22 },
  ];

  const performanceData = charts.gradeDistribution.map((item, index) => {
    const gradeRanges = ["Baixo (0-2)", "Baixo (2-4)", "Regular (4-6)", "Bom (6-8)", "Excelente (8-10)"];
    const colors = ["#ef4444", "#f59e0b", "#eab308", "#3b82f6", "#10b981"];
    return {
      name: gradeRanges[index] || item.name,
      value: item.value,
      color: colors[index] || "#6b7280"
    };
  });

  const attendanceData = [
    { month: "Jan", attendance: 92 },
    { month: "Fev", attendance: 88 },
    { month: "Mar", attendance: 95 },
    { month: "Abr", attendance: 90 },
    { month: "Mai", attendance: 93 },
    { month: "Jun", attendance: 89 },
  ];

  // Dados para os gráficos movidos da página de alunos
  const timeEvolutionData = [
    { month: 'Jan', students: 45, newStudents: 12, graduated: 8, dropouts: 3, transfers: 2 },
    { month: 'Fev', students: 52, newStudents: 15, graduated: 5, dropouts: 2, transfers: 1 },
    { month: 'Mar', students: 58, newStudents: 18, graduated: 12, dropouts: 4, transfers: 3 },
    { month: 'Abr', students: 65, newStudents: 20, graduated: 13, dropouts: 2, transfers: 2 },
    { month: 'Mai', students: 72, newStudents: 22, graduated: 15, dropouts: 3, transfers: 1 },
    { month: 'Jun', students: 78, newStudents: 25, graduated: 19, dropouts: 5, transfers: 3 },
  ];

  const retentionData = [
    { course: 'Robótica', retention: 92, totalStudents: 25, avgGrade: 8.5, completionRate: 88 },
    { course: 'Informática', retention: 88, totalStudents: 30, avgGrade: 7.8, completionRate: 85 },
    { course: 'Programação', retention: 85, totalStudents: 28, avgGrade: 8.2, completionRate: 82 },
    { course: 'Web Design', retention: 90, totalStudents: 22, avgGrade: 8.8, completionRate: 86 },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReportSelection = (reportType: string, checked: boolean) => {
    if (checked) {
      setSelectedReports(prev => [...prev, reportType]);
    } else {
      setSelectedReports(prev => prev.filter(type => type !== reportType));
    }
  };

  const handleGenerateCustomReport = (format: string) => {
    if (selectedReports.length === 0) {
      toast({
        title: "Seleção obrigatória",
        description: "Selecione pelo menos um tipo de relatório",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "RELATÓRIO GERADO",
      description: `Relatório personalizado em ${format.toUpperCase()} gerado com sucesso`,
      className: "bg-green-100 text-green-800 border-green-200",
    });

    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `relatorio-personalizado-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQuickReport = (reportType: string, format: string) => {
    toast({
      title: "RELATÓRIO GERADO",
      description: `Relatório de ${reportType} em ${format.toUpperCase()} gerado com sucesso`,
      className: "bg-blue-100 text-blue-800 border-blue-200",
    });
  };

  const reportTypes = [
    { id: "students", label: "Dados dos Alunos", icon: Users },
    { id: "classes", label: "Informações das Turmas", icon: Calendar },
    { id: "performance", label: "Desempenho Acadêmico", icon: TrendingUp },
    { id: "attendance", label: "Controle de Frequência", icon: BarChart3 },
    { id: "instructors", label: "Dados dos Instrutores", icon: Users },
    { id: "courses", label: "Estatísticas dos Cursos", icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-white border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-foreground">
              <FileText className="h-8 w-8 text-primary" />
              Relatórios
            </h1>
            <p className="text-muted-foreground mt-1">Gere relatórios personalizados com filtros e dashboards</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="custom">Relatório Personalizado</TabsTrigger>
          <TabsTrigger value="quick">Relatórios Rápidos</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFrom">Data Início</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTo">Data Fim</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Curso</Label>
                  <Select value={filters.course} onValueChange={(value) => handleFilterChange("course", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os cursos" />
                    </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">Todos os cursos</SelectItem>
                       {courses.map(course => (
                         <SelectItem key={course.id} value={course.id.toString()}>{course.title}</SelectItem>
                       ))}
                     </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Turma</Label>
                  <Select value={filters.class} onValueChange={(value) => handleFilterChange("class", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as turmas" />
                    </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">Todas as turmas</SelectItem>
                       {classes.map(cls => (
                         <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>
                       ))}
                     </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instrutor</Label>
                  <Select value={filters.instructor} onValueChange={(value) => handleFilterChange("instructor", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os instrutores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os instrutores</SelectItem>
                      <SelectItem value="a">Instrutor A</SelectItem>
                      <SelectItem value="b">Instrutor B</SelectItem>
                      <SelectItem value="c">Instrutor C</SelectItem>
                      <SelectItem value="d">Instrutor D</SelectItem>
                      <SelectItem value="e">Instrutor E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={() => setFilters({ dateFrom: "", dateTo: "", course: "all", class: "all", status: "all", instructor: "all" })}
                  variant="outline"
                >
                  Limpar Filtros
                </Button>
                <Button>
                  Aplicar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{stats.students.total}</p>
                  <p className="text-sm text-muted-foreground">Total de Alunos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{stats.students.active}</p>
                  <p className="text-sm text-muted-foreground">Alunos Ativos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.students.activityRate}%</p>
                  <p className="text-sm text-muted-foreground">Taxa de Atividade</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{stats.courses.total}</p>
                  <p className="text-sm text-muted-foreground">Cursos Ativos</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Students per Course */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-normal">
                  <BarChart3 className="h-4 w-4" />
                  Alunos por Curso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studentsPerCourse}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-semibold text-sm">{label}</p>
                                <div className="space-y-1 mt-2">
                                  <p className="text-xs text-green-600">
                                    Ativos: {data.active} alunos
                                  </p>
                                  <p className="text-xs text-red-600">
                                    Inativos: {data.inactive} alunos
                                  </p>
                                  <p className="text-xs text-blue-600">
                                    Total: {data.students} alunos
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="active" stackId="a" fill="#10b981" name="Ativos" />
                      <Bar dataKey="inactive" stackId="a" fill="#ef4444" name="Inativos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-normal">
                  <PieChart className="h-4 w-4" />
                  Distribuição de Desempenho
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={performanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {performanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-semibold text-sm">{data.name}</p>
                                <div className="space-y-1 mt-2">
                                  <p className="text-xs text-gray-600">
                                    Alunos: {data.value}%
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Enrollments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-normal">
                  <LineChart className="h-4 w-4" />
                  Matrículas Mensais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={monthlyEnrollments}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-semibold text-sm">{label}</p>
                                <div className="space-y-1 mt-2">
                                  <p className="text-xs text-blue-600">
                                    Matrículas: {data.enrollments}
                                  </p>
                                  <p className="text-xs text-green-600">
                                    Conclusões: {data.completions}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line type="monotone" dataKey="enrollments" stroke="#3b82f6" strokeWidth={2} name="Matrículas" />
                      <Line type="monotone" dataKey="completions" stroke="#10b981" strokeWidth={2} name="Conclusões" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-normal">
                  <TrendingUp className="h-4 w-4" />
                  Taxa de Frequência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-semibold text-sm">{label}</p>
                                <div className="space-y-1 mt-2">
                                  <p className="text-xs text-purple-600">
                                    Frequência: {data.attendance}%
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="attendance" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Gráficos movidos da página de alunos */}
            
            {/* Evolução Temporal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-normal">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Evolução Temporal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={timeEvolutionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-semibold text-sm">{label}</p>
                                <div className="space-y-1 mt-2">
                                  <p className="text-xs text-green-600">
                                    Total: {data.students} alunos
                                  </p>
                                  <p className="text-xs text-green-600">
                                    Novos: {data.newStudents} alunos
                                  </p>
                                  <p className="text-xs text-purple-600">
                                    Formados: {data.graduated} alunos
                                  </p>
                                  <p className="text-xs text-red-600">
                                    Evasão: {data.dropouts || 0} alunos
                                  </p>
                                  <p className="text-xs text-orange-600">
                                    Transferências: {data.transfers || 0} alunos
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="students" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        name="Total de Alunos"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="newStudents" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Novos Alunos"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Retenção por Curso */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-normal">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Retenção por Curso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={retentionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="course" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-semibold text-sm">{label}</p>
                                <div className="space-y-1 mt-2">
                                  <p className="text-xs text-green-600">
                                    Retenção: {data.retention}%
                                  </p>
                                  <p className="text-xs text-green-600">
                                    Total: {data.totalStudents} alunos
                                  </p>
                                  <p className="text-xs text-purple-600">
                                    Média: {data.avgGrade}
                                  </p>
                                  <p className="text-xs text-orange-600">
                                    Conclusão: {data.completionRate}%
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="retention" 
                        fill="#10b981"
                        name="Taxa de Retenção (%)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Idade dos Alunos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-normal">
                  <PieChart className="h-4 w-4 text-orange-500" />
                  Idade dos Alunos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={charts.ageDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {charts.ageDistribution.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-semibold text-sm">{data.name}</p>
                                <div className="space-y-1 mt-2">
                                  <p className="text-xs text-gray-600">
                                    Alunos: {data.value}%
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Custom Reports Tab */}
        <TabsContent value="custom" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Builder */}
            <Card>
              <CardHeader>
                <CardTitle>Construtor de Relatórios</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Selecione os tipos de dados que deseja incluir no seu relatório personalizado
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.id}
                        checked={selectedReports.includes(type.id)}
                        onCheckedChange={(checked) => handleReportSelection(type.id, checked as boolean)}
                      />
                      <Label htmlFor={type.id} className="flex items-center gap-2 flex-1 cursor-pointer">
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </Label>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Opções de Exportação</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Escolha o formato de saída para seu relatório
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Relatórios selecionados: {selectedReports.length > 0 ? selectedReports.length : "Nenhum"}
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleGenerateCustomReport("pdf")}
                    className="w-full justify-start gap-2"
                    variant="outline"
                  >
                    <FileText className="h-4 w-4" />
                    Exportar como PDF
                  </Button>
                  
                  <Button 
                    onClick={() => handleGenerateCustomReport("excel")}
                    className="w-full justify-start gap-2"
                    variant="outline"
                  >
                    <Download className="h-4 w-4" />
                    Exportar como Excel
                  </Button>
                  
                  <Button 
                    onClick={() => handleGenerateCustomReport("csv")}
                    className="w-full justify-start gap-2"
                    variant="outline"
                  >
                    <Download className="h-4 w-4" />
                    Exportar como CSV
                  </Button>
                </div>

                {selectedReports.length > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Itens incluídos:</p>
                    <ul className="text-sm text-muted-foreground mt-1">
                      {selectedReports.map(reportId => {
                        const reportType = reportTypes.find(t => t.id === reportId);
                        return (
                          <li key={reportId}>• {reportType?.label}</li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quick Reports Tab */}
        <TabsContent value="quick" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Student Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Relatório de Alunos
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Lista completa com dados dos alunos matriculados
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => handleQuickReport("Alunos", "pdf")}
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button 
                  onClick={() => handleQuickReport("Alunos", "excel")}
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </CardContent>
            </Card>

            {/* Classes Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Relatório de Turmas
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Informações detalhadas sobre todas as turmas
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => handleQuickReport("Turmas", "pdf")}
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button 
                  onClick={() => handleQuickReport("Turmas", "excel")}
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </CardContent>
            </Card>

            {/* Performance Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Relatório de Desempenho
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Análise de performance e notas dos alunos
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => handleQuickReport("Desempenho", "pdf")}
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button 
                  onClick={() => handleQuickReport("Desempenho", "excel")}
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </CardContent>
            </Card>

            {/* Attendance Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Relatório de Frequência
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Controle de presença e faltas dos alunos
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => handleQuickReport("Frequência", "pdf")}
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button 
                  onClick={() => handleQuickReport("Frequência", "excel")}
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </CardContent>
            </Card>

            {/* Courses Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Relatório de Cursos
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Estatísticas e informações dos cursos oferecidos
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => handleQuickReport("Cursos", "pdf")}
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button 
                  onClick={() => handleQuickReport("Cursos", "excel")}
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </CardContent>
            </Card>

            {/* Financial Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Relatório Financeiro
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Receitas, despesas e análises financeiras
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => handleQuickReport("Financeiro", "pdf")}
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button 
                  onClick={() => handleQuickReport("Financeiro", "excel")}
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      </Tabs>

      <DataBot />
    </div>
  );
};

export default Reports;