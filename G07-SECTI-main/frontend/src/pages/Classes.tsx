import { useState, useMemo } from "react";
import { DataBot } from "@/components/ui/DataBot";
import { Plus, Search, Eye, Grid, List, Filter, Download, MoreHorizontal, Calendar, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ClassDetailsModal from "@/components/modals/ClassDetailsModal";
import ClassFormModal from "@/components/modals/ClassFormModal";
import { useAppData } from "@/hooks/useAppData";
import { useToast } from "@/hooks/use-toast";
import type { Class } from "@/contexts/AppContext";

type SortField = "name" | "course" | "instructor" | "status" | "startDate" | "enrolled";
type SortOrder = "asc" | "desc";

const Classes = () => {
  const { classes, stats } = useAppData();
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  
  // Filtros avançados
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [instructorFilter, setInstructorFilter] = useState<string>("all");
  const [capacityFilter, setCapacityFilter] = useState<string>("all");
  
  // Ordenação
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filtros temporais
  const [temporalFilter, setTemporalFilter] = useState<string>("all");
  
  // Notificações
  const [showNotifications, setShowNotifications] = useState(true);

  // Dados únicos para filtros
  const uniqueCourses = useMemo(() => {
    const courses = [...new Set(classes.map(c => c.course))];
    return courses.sort();
  }, [classes]);

  const uniqueInstructors = useMemo(() => {
    const instructors = [...new Set(classes.map(c => c.instructor))];
    return instructors.sort();
  }, [classes]);

  // Filtros e ordenação
  const filteredAndSortedClasses = useMemo(() => {
    let filtered = classes.filter(classItem => {
      const matchesStatus = statusFilter === "all" || classItem.status === statusFilter;
      const matchesCourse = courseFilter === "all" || classItem.course === courseFilter;
      const matchesInstructor = instructorFilter === "all" || classItem.instructor === instructorFilter;
      
      let matchesCapacity = true;
      if (capacityFilter === "full") {
        matchesCapacity = classItem.enrolled >= classItem.capacity;
      } else if (capacityFilter === "available") {
        matchesCapacity = classItem.enrolled < classItem.capacity;
      } else if (capacityFilter === "empty") {
        matchesCapacity = classItem.enrolled === 0;
      }

      // Filtros temporais
      let matchesTemporal = true;
      if (temporalFilter !== "all") {
        const today = new Date();
        const startDate = new Date(classItem.startDate.split('/').reverse().join('-'));
        const endDate = new Date(classItem.endDate.split('/').reverse().join('-'));
        const daysToStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const daysToEnd = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (temporalFilter) {
          case "today":
            matchesTemporal = daysToStart === 0;
            break;
          case "tomorrow":
            matchesTemporal = daysToStart === 1;
            break;
          case "this_week":
            matchesTemporal = daysToStart >= 0 && daysToStart <= 7;
            break;
          case "ending_soon":
            matchesTemporal = daysToEnd >= 0 && daysToEnd <= 7;
            break;
          case "active":
            matchesTemporal = startDate <= today && endDate >= today;
            break;
        }
      }

      return matchesStatus && matchesCourse && matchesInstructor && matchesCapacity && matchesTemporal;
    });

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === "startDate") {
        aValue = new Date(aValue.split('/').reverse().join('-'));
        bValue = new Date(bValue.split('/').reverse().join('-'));
      }
      
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [classes, statusFilter, courseFilter, instructorFilter, capacityFilter, sortField, sortOrder]);

  // Paginação
  const totalPages = Math.ceil(filteredAndSortedClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClasses = filteredAndSortedClasses.slice(startIndex, endIndex);

  // Notificações de turmas
  const notifications = useMemo(() => {
    const today = new Date();
    const notifications = [];
    
    // Turmas que iniciam em 24h
    const startingSoon = classes.filter(c => {
      const startDate = new Date(c.startDate.split('/').reverse().join('-'));
      const daysToStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysToStart >= 0 && daysToStart <= 1 && c.status === "Planejada";
    });
    
    if (startingSoon.length > 0) {
      notifications.push({
        type: "warning",
        title: "Turmas iniciam em breve",
        message: `${startingSoon.length} turma(s) iniciam nas próximas 24h`,
        classes: startingSoon
      });
    }
    
    // Turmas lotadas
    const fullClasses = classes.filter(c => c.enrolled >= c.capacity && c.status === "Ativo");
    if (fullClasses.length > 0) {
      notifications.push({
        type: "info",
        title: "Turmas lotadas",
        message: `${fullClasses.length} turma(s) estão com capacidade máxima`,
        classes: fullClasses
      });
    }
    
    // Turmas que terminam em breve
    const endingSoon = classes.filter(c => {
      const endDate = new Date(c.endDate.split('/').reverse().join('-'));
      const daysToEnd = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysToEnd >= 0 && daysToEnd <= 7 && c.status === "Ativo";
    });
    
    if (endingSoon.length > 0) {
      notifications.push({
        type: "success",
        title: "Turmas terminam em breve",
        message: `${endingSoon.length} turma(s) terminam na próxima semana`,
        classes: endingSoon
      });
    }
    
    return notifications;
  }, [classes]);

  const handleViewDetails = (classData: Class) => {
    setSelectedClass(classData);
    setIsModalOpen(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDuplicateClass = (classData: Class) => {
    const duplicatedClass = {
      ...classData,
      name: `${classData.name} - Cópia`,
      enrolled: 0,
      students: [],
      status: "Planejada",
      startDate: "",
      endDate: ""
    };
    
    // Simular adição da turma duplicada
    toast({
      title: "Turma duplicada",
      description: `A turma "${classData.name}" foi duplicada com sucesso`,
    });
  };

  const handleArchiveClass = (classData: Class) => {
    toast({
      title: "Turma arquivada",
      description: `A turma "${classData.name}" foi arquivada`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-emerald-100 text-emerald-700";
      case "Planejada":
        return "bg-blue-100 text-blue-700";
      case "Concluída":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCapacityColor = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  const isStartingSoon = (startDate: string) => {
    const today = new Date();
    const start = new Date(startDate.split('/').reverse().join('-'));
    const diffDays = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-white border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-foreground">
              <Grid className="h-8 w-8 text-primary" />
              Turmas
            </h1>
            <p className="text-muted-foreground mt-1">Gerencie as turmas e suas matrículas</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                // Simular exportação
                toast({
                  title: "Exportação iniciada",
                  description: "Os dados das turmas estão sendo exportados",
                });
              }}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button 
              onClick={() => setIsFormModalOpen(true)}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              Cadastrar Turma
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{stats.classes.total}</p>
              <p className="text-sm text-muted-foreground">Total de Turmas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{stats.classes.active}</p>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.classes.planned}</p>
              <p className="text-sm text-muted-foreground">Planejadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{stats.classes.completed}</p>
              <p className="text-sm text-muted-foreground">Concluídas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notificações */}
      {showNotifications && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <Card key={index} className={`border-l-4 ${
              notification.type === "warning" ? "border-l-orange-500 bg-orange-50" :
              notification.type === "info" ? "border-l-blue-500 bg-blue-50" :
              "border-l-green-500 bg-green-50"
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      notification.type === "warning" ? "bg-orange-500" :
                      notification.type === "info" ? "bg-blue-500" :
                      "bg-green-500"
                    }`}></div>
                    <div>
                      <h4 className="font-medium text-foreground">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotifications(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Planejada">Planejada</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Curso</label>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os cursos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os cursos</SelectItem>
                  {uniqueCourses.map(course => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Instrutor</label>
              <Select value={instructorFilter} onValueChange={setInstructorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os instrutores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os instrutores</SelectItem>
                  {uniqueInstructors.map(instructor => (
                    <SelectItem key={instructor} value={instructor}>{instructor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Capacidade</label>
              <Select value={capacityFilter} onValueChange={setCapacityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as capacidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as capacidades</SelectItem>
                  <SelectItem value="empty">Vazias</SelectItem>
                  <SelectItem value="available">Com vagas</SelectItem>
                  <SelectItem value="full">Lotadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={temporalFilter} onValueChange={setTemporalFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os períodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os períodos</SelectItem>
                  <SelectItem value="today">Começam hoje</SelectItem>
                  <SelectItem value="tomorrow">Começam amanhã</SelectItem>
                  <SelectItem value="this_week">Esta semana</SelectItem>
                  <SelectItem value="ending_soon">Terminam em breve</SelectItem>
                  <SelectItem value="active">Em andamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredAndSortedClasses.length} turma(s) encontrada(s)
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Itens por página:</span>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => {
              setItemsPerPage(parseInt(value));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Classes Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedClasses.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-lg transition-shadow cursor-pointer relative">
              {isStartingSoon(classItem.startDate) && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-orange-100 text-orange-700 text-xs">
                    Inicia em breve
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      {classItem.name}
                    </CardTitle>
                    <p className="text-primary font-medium">{classItem.course}</p>
                  </div>
                  <Badge className={getStatusColor(classItem.status)}>
                    {classItem.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Instrutor: {classItem.instructor}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Horário: {classItem.schedule}
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Vagas: {classItem.enrolled}/{classItem.capacity}</span>
                      <span className={getCapacityColor(classItem.enrolled, classItem.capacity)}>
                        {Math.round((classItem.enrolled / classItem.capacity) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(classItem.enrolled / classItem.capacity) * 100} 
                      className="h-2"
                    />
                  </div>
                  <p>Duração: {classItem.duration}</p>
                </div>

                <Button 
                  onClick={() => handleViewDetails(classItem)}
                  variant="outline" 
                  className="w-full gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Ver detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("name")}
                >
                  Nome {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("course")}
                >
                  Curso {sortField === "course" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("instructor")}
                >
                  Instrutor {sortField === "instructor" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("enrolled")}
                >
                  Vagas {sortField === "enrolled" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("status")}
                >
                  Status {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("startDate")}
                >
                  Início {sortField === "startDate" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClasses.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {isStartingSoon(classItem.startDate) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Inicia em breve</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {classItem.name}
                    </div>
                  </TableCell>
                  <TableCell>{classItem.course}</TableCell>
                  <TableCell>{classItem.instructor}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{classItem.enrolled}/{classItem.capacity}</span>
                      <div className="w-16">
                        <Progress 
                          value={(classItem.enrolled / classItem.capacity) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(classItem.status)}>
                      {classItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{classItem.startDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Ações
                          <MoreHorizontal className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleViewDetails(classItem)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateClass(classItem)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Duplicar turma
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleArchiveClass(classItem)}>
                          <MoreHorizontal className="h-4 w-4 mr-2" />
                          Arquivar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredAndSortedClasses.length)} de {filteredAndSortedClasses.length} turmas
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <ClassDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classData={selectedClass}
      />

      <ClassFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        mode="create"
      />

      <DataBot />
    </div>
  );
};

export default Classes;