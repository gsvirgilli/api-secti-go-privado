import { useState, useEffect } from "react";
import { DataBot } from "@/components/ui/DataBot";
import { 
  Plus, Search, Trophy, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Users, TrendingUp, Calendar, AlertTriangle, CheckCircle, XCircle, Clock,
  ChevronDown, ChevronUp, BarChart3, PieChart, Activity, Target, BookOpen,
  GraduationCap, Clock4, TrendingDown, UserCheck, UserX, CalendarDays,
  Eye, Edit, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";
import StudentDetailsModal from "@/components/modals/StudentDetailsModal";
import StudentFormModal from "@/components/modals/StudentFormModal";
import { useAppData } from "@/hooks/useAppData";
import type { Student } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

const Students = () => {
  const { students, stats, charts, updateStudent, deleteStudent } = useAppData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Estados para mobile e responsividade
  const [isMobile, setIsMobile] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<{[key: string]: boolean}>({});
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Detectar dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Gestos de swipe para mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentPage < totalPages) {
      goToNextPage();
    } else if (isRightSwipe && currentPage > 1) {
      goToPreviousPage();
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.cpf.includes(searchTerm) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cálculos de paginação
  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  // Funções de navegação
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Geração de páginas para exibição
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Reset da página quando a busca muda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Reset da página quando muda itens por página
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Toggle de seções colapsáveis
  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleViewDetails = (student: Student) => {
    console.log('Ver detalhes:', student);
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    console.log('Editar aluno:', student);
    setSelectedStudent(student);
    setIsFormModalOpen(true);
  };

  const handleDeleteStudent = (student: Student) => {
    console.log('Tentando excluir aluno:', student);
    if (confirm(`Tem certeza que deseja excluir o aluno ${student.name}? Esta ação não pode ser desfeita.`)) {
      console.log('Confirmado, excluindo aluno:', student.id);
      deleteStudent(student.id);
      toast({
        title: "Aluno Excluído",
        description: `${student.name} foi excluído com sucesso`,
        className: "bg-red-100 text-red-800 border-red-200",
      });
    }
  };

  // Status visual com ícones animados
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'Inativo':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Pendente':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  // Componente de card para mobile
  const StudentCard = ({ student }: { student: Student }) => (
    <Card className="mb-4 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">{student.name}</h3>
            <p className="text-sm text-muted-foreground">{student.cpf}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(student.status)}
            <Badge 
              variant={student.status === "Ativo" ? "default" : "secondary"}
              className={student.status === "Ativo" ? "bg-emerald-100 text-emerald-700" : ""}
            >
              {student.status}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>{student.course}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-purple-500" />
            <span>{student.class}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-3">
        <Button 
            variant="ghost" 
          size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Clicou em ver detalhes (mobile)');
              handleViewDetails(student);
            }}
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
            title="Ver detalhes"
          >
            <Eye className="h-4 w-4" />
        </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Clicou em editar (mobile)');
              handleEditStudent(student);
            }}
            className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
            title="Editar aluno"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Clicou em excluir (mobile)');
              handleDeleteStudent(student);
            }}
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            title="Excluir aluno"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      {/* Header */}
      <div className="p-6 rounded-lg bg-white border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-foreground">
              <Users className="h-8 w-8 text-primary" />
              Alunos
            </h1>
            <p className="text-muted-foreground mt-1">Gerencie os alunos cadastrados no sistema</p>
          </div>
          <Button 
            onClick={() => setIsFormModalOpen(true)}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            {isMobile ? "Novo" : "Cadastrar Aluno"}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{stats.students.total}</p>
                <p className="text-sm text-muted-foreground">Total de Alunos</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-emerald-600">{stats.students.active}</p>
                <p className="text-sm text-muted-foreground">Alunos Ativos</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.students.inactive}</p>
                <p className="text-sm text-muted-foreground">Alunos Inativos</p>
              </div>
              <XCircle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{stats.students.activityRate}%</p>
                <p className="text-sm text-muted-foreground">Taxa de Atividade</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Layout */}
      <div className="space-y-6">
        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Busca otimizada para touch */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={isMobile ? "Buscar alunos..." : "Buscar por Nome, CPF ou Email..."}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>

            {/* Mobile Cards ou Desktop Table */}
            {isMobile ? (
              <div className="space-y-4">
                {currentStudents.map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.cpf}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(student.status)}
                            <Badge 
                              variant={student.status === "Ativo" ? "default" : "secondary"}
                              className={student.status === "Ativo" ? "bg-emerald-100 text-emerald-700" : ""}
                            >
                              {student.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{student.course}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                          <Button 
                              variant="ghost" 
                            size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Clicou em ver detalhes');
                                handleViewDetails(student);
                              }}
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                              title="Ver detalhes"
                            >
                              <Eye className="h-4 w-4" />
                          </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Clicou em editar');
                                handleEditStudent(student);
                              }}
                              className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                              title="Editar aluno"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Clicou em excluir');
                                handleDeleteStudent(student);
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                              title="Excluir aluno"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-6">
              {/* Informações da paginação */}
              <div className="flex items-center gap-4">
                {!isMobile && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Mostrar</span>
                    <Select 
                      value={String(itemsPerPage)} 
                      onValueChange={handleItemsPerPageChange}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">
                      de {totalItems} alunos
                    </span>
                  </div>
                )}
                
                <span className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </span>
              </div>

              {/* Controles de navegação */}
              <div className="flex items-center gap-2">
                {!isMobile && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToFirstPage}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Números das páginas */}
                <div className="flex gap-1">
                  {getPageNumbers().map((page, index) => (
                    <Button
                      key={index}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => typeof page === 'number' && goToPage(page)}
                      disabled={page === '...'}
                      className="h-8 w-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                {!isMobile && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToLastPage}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Informações adicionais */}
            {totalItems > 0 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} alunos
                  {searchTerm && ` (filtrados por "${searchTerm}")`}
                </p>
              </div>
            )}

            {/* Mensagem quando não há resultados */}
            {totalItems === 0 && (
              <div className="mt-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground">
                      {searchTerm ? "Nenhum aluno encontrado" : "Nenhum aluno cadastrado"}
                    </p>
                    <p className="text-muted-foreground">
                      {searchTerm 
                        ? `Tente ajustar os termos de busca`
                        : "Comece cadastrando o primeiro aluno"
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    </div>
                      </div>

      {/* Botão Flutuante de Alertas */}
      <div className="fixed bottom-32 right-6 z-50">
                      <Button
          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-14 h-14 shadow-lg"
          onClick={() => setIsAlertModalOpen(true)}
        >
          <AlertTriangle className="h-6 w-6" />
                      </Button>
                                    </div>

      <StudentDetailsModal 
        isOpen={isModalOpen}
        onClose={() => {
          console.log('Fechando modal de detalhes');
          setIsModalOpen(false);
        }}
        student={selectedStudent}
        onEdit={(student) => {
          console.log('Editar aluno do modal:', student);
          setSelectedStudent(student);
          setIsModalOpen(false);
          setIsFormModalOpen(true);
        }}
        onDelete={(studentId) => {
          console.log('Excluir aluno do modal:', studentId);
          const student = students.find(s => s.id === studentId);
          if (student) {
            handleDeleteStudent(student);
          }
        }}
      />

      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          console.log('Fechando modal de formulário');
          setIsFormModalOpen(false);
          setSelectedStudent(null);
        }}
        mode={selectedStudent ? "edit" : "create"}
        studentData={selectedStudent}
      />

      {/* Modal de Alertas Inteligentes */}
      <Dialog open={isAlertModalOpen} onOpenChange={setIsAlertModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              Alertas Inteligentes
            </DialogTitle>
            <DialogDescription>
              Notificações importantes sobre o desempenho dos alunos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <div className="flex-1">
                <p className="text-sm font-medium text-red-700">Baixa atividade detectada</p>
                <p className="text-xs text-red-600">5 alunos com baixa frequência</p>
                  </div>
                </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <UserCheck className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                <p className="text-sm font-medium text-green-700">Bom desempenho</p>
                <p className="text-xs text-green-600">15 alunos com notas acima de 8.0</p>
                  </div>
                </div>
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <Clock4 className="h-4 w-4 text-amber-500" />
                  <div className="flex-1">
                <p className="text-sm font-medium text-amber-700">Avaliações pendentes</p>
                <p className="text-xs text-amber-600">3 turmas com avaliações próximas</p>
                  </div>
                </div>
              </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAlertModalOpen(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DataBot />
    </div>
  );
};

export default Students;