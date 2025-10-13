import { useState } from "react";
import { DataBot } from "@/components/ui/DataBot";
import { Plus, Search, Clock, Users, GraduationCap, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CourseFormModal from "@/components/modals/CourseFormModal";
import { useAppData } from "@/hooks/useAppData";
import { useToast } from "@/hooks/use-toast";
import type { Course } from "@/contexts/AppContext";

const Courses = () => {
  const { courses, updateCourse, deleteCourse } = useAppData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCourse = (course: Course) => {
    console.log('Editar curso:', course);
    setSelectedCourse(course);
    setIsFormModalOpen(true);
  };

  const handleDeleteCourse = (course: Course) => {
    console.log('Tentando excluir curso:', course);
    if (confirm(`Tem certeza que deseja excluir o curso "${course.title}"? Esta ação não pode ser desfeita.`)) {
      console.log('Confirmado, excluindo curso:', course.id);
      deleteCourse(course.id);
      toast({
        title: "Curso Excluído",
        description: `${course.title} foi excluído com sucesso`,
        className: "bg-red-100 text-red-800 border-red-200",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-white border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-foreground">
              <GraduationCap className="h-8 w-8 text-primary" />
              Cursos
            </h1>
            <p className="text-muted-foreground mt-1">Gerencie os cursos oferecidos pela instituição</p>
          </div>
          <Button 
            onClick={() => setIsFormModalOpen(true)}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Cadastrar Curso
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Pesquisar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
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
                          console.log('Clicou em editar curso');
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
                          console.log('Clicou em excluir curso');
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
        ))}
      </div>

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