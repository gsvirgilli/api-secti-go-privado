import { useState, useEffect } from "react";
import { DataBot } from "@/components/ui/DataBot";
import { Plus, Search, Clock, Users, GraduationCap, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CourseFormModal from "@/components/modals/CourseFormModal";
import { ExportButtons } from "@/components/ExportButtons";
import { useAppData } from "@/hooks/useAppData";
import { useToast } from "@/hooks/use-toast";
import { ReportsAPI } from "@/lib/api";
import type { Course } from "@/contexts/AppContext";

const Courses = () => {
  const { courses, updateCourse, deleteCourse } = useAppData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);
  const [itemsToShow, setItemsToShow] = useState(10);
  const [isSearching, setIsSearching] = useState(false);

  // Atualizar cursos exibidos quando courses mudar ou quando itemsToShow mudar
  useEffect(() => {
    if (!isSearching) {
      setDisplayedCourses(courses.slice(0, itemsToShow));
    }
  }, [courses, itemsToShow, isSearching]);

  // Buscar cursos (localmente por enquanto, depois pode ser API)
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    if (value.trim() === "") {
      // Se limpar a pesquisa, volta ao estado inicial
      setIsSearching(false);
      setDisplayedCourses(courses.slice(0, itemsToShow));
    } else {
      // Pesquisa em TODOS os cursos do contexto
      setIsSearching(true);
      const filtered = courses.filter(course =>
        course.title.toLowerCase().includes(value.toLowerCase()) ||
        course.description.toLowerCase().includes(value.toLowerCase())
      );
      setDisplayedCourses(filtered);
    }
  };

  const handleLoadMore = () => {
    const newItemsToShow = itemsToShow + 10;
    setItemsToShow(newItemsToShow);
    setDisplayedCourses(courses.slice(0, newItemsToShow));
  };

  const hasMore = !isSearching && itemsToShow < courses.length;

  // Debug
  console.log('📊 Courses Debug:', {
    totalCourses: courses.length,
    itemsToShow,
    displayedCoursesLength: displayedCourses.length,
    isSearching,
    hasMore,
    firstCourseTitles: courses.slice(0, 3).map(c => c.title),
    displayedTitles: displayedCourses.slice(0, 3).map(c => c.title)
  });

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsFormModalOpen(true);
  };

  const handleDeleteCourse = async (course: Course) => {
    if (confirm(`Tem certeza que deseja excluir o curso "${course.title}"? Esta ação não pode ser desfeita.`)) {
      try {
        await deleteCourse(course.id);
        toast({
          title: "Curso Excluído",
          description: `${course.title} foi excluído com sucesso`,
          className: "bg-green-100 text-green-800 border-green-200",
        });
      } catch (error: any) {
        console.error('Erro ao excluir curso:', error);
        toast({
          title: "Erro ao Excluir",
          description: error.message || "Não foi possível excluir o curso",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-white border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-foreground">
              <GraduationCap className="h-8 w-8 text-primary" />
              Cursos
            </h1>
            <p className="text-muted-foreground mt-1">Gerencie os cursos oferecidos pela instituição</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <ExportButtons
              onExportPDF={async () => {
                const response = await ReportsAPI.coursesPDF();
                return response.data;
              }}
              onExportExcel={async () => {
                // Cursos só tem PDF no backend por enquanto, podemos usar o mesmo
                const response = await ReportsAPI.coursesPDF();
                return response.data;
              }}
              filename="relatorio-cursos"
              showExcel={false}
              size="sm"
            />
            <Button 
              onClick={() => setIsFormModalOpen(true)}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              Cadastrar Curso
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Pesquisar cursos em todos os registros..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Info */}
      {displayedCourses.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {isSearching 
            ? `${displayedCourses.length} curso(s) encontrado(s)`
            : `Mostrando ${displayedCourses.length} de ${courses.length} curso(s)`
          }
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCourses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? "Nenhum curso encontrado com este termo" : "Nenhum curso cadastrado"}
            </p>
          </div>
        ) : (
          displayedCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${course.color} flex-shrink-0 ml-2 mt-1`}></div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <Badge variant="outline">
                    {course.level}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{course.students} alunos matriculados</span>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span>Taxa de conclusão: 85%</span>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Badge 
                      className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    >
                      {course.status}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditCourse(course);
                        }}
                        className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                        title="Editar curso"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteCourse(course);
                        }}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        title="Excluir curso"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Carregar Mais 10 Cursos ({courses.length - itemsToShow} restantes)
          </Button>
        </div>
      )}

      <CourseFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          console.log('Fechando modal de formulário');
          setIsFormModalOpen(false);
          setSelectedCourse(null);
        }}
        mode={selectedCourse ? "edit" : "create"}
        courseData={selectedCourse}
      />

      <DataBot />
    </div>
  );
};

export default Courses;