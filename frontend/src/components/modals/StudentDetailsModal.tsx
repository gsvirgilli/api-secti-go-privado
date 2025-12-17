import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Edit, FileText, Trash2, Plus } from "lucide-react";
import { StudentCoursesAPI } from "@/lib/api";
import type { Student } from "@/types/appContext";
import { useAppData } from "@/hooks/useAppData";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: number) => void;
}

const StudentDetailsModal = ({ isOpen, onClose, student, onEdit, onDelete }: StudentDetailsModalProps) => {
  const { toast } = useToast();
  const { courses } = useAppData();
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  if (!student) return null;

  // Debug: mostrar dados dos cursos
  console.log('StudentDetailsModal - Student:', student);
  console.log('StudentDetailsModal - Courses:', student.courses);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(student);
    } else {
      toast({
        title: "Editar Aluno",
        description: `Abrindo formulário para editar ${student.name}`,
        className: "bg-blue-100 text-blue-800 border-blue-200",
      });
    }
    onClose();
  };

  const handleGenerateReport = () => {
    toast({
      title: "Relatório Gerado",
      description: `Relatório individual de ${student.name} gerado com sucesso`,
      className: "bg-green-100 text-green-800 border-green-200",
    });

    // Simular download do relatório
    const link = document.createElement('a');
    link.href = '#';
    link.download = `relatorio-${student.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir a matrícula de ${student.name}? Esta ação não pode ser desfeita.`)) {
      if (onDelete) {
        onDelete(student.id);
      } else {
        toast({
          title: "Matrícula Excluída",
          description: `Matrícula de ${student.name} excluída com sucesso`,
          className: "bg-red-100 text-red-800 border-red-200",
        });
      }
      onClose();
    }
  };

  const handleAddCourse = async () => {
    if (!selectedCourseId) {
      toast({
        title: "Erro",
        description: "Selecione um curso para adicionar",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAddingCourse(true);
      await StudentCoursesAPI.addCourse(student.id, selectedCourseId);

      toast({
        title: "Sucesso",
        description: "Aluno adicionado ao curso com sucesso",
        className: "bg-green-100 text-green-800 border-green-200",
      });

      // Recarregar a página para atualizar os dados
      window.location.reload();
    } catch (error: unknown) {
      console.error('Erro ao adicionar curso:', error);
      toast({
        title: "Erro ao Adicionar Curso",
        description: "Não foi possível adicionar o aluno ao curso",
        variant: "destructive",
      });
    } finally {
      setIsAddingCourse(false);
      setShowAddCourseModal(false);
      setSelectedCourseId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-foreground mb-4">
            {student.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações Pessoais */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Informações pessoais</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Matrícula:</span>
                  <span className="font-medium font-mono">{student.matricula || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPF:</span>
                  <span className="font-medium">{student.cpf}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data de nascimento:</span>
                  <span className="font-medium">{student.birthDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">E-mail:</span>
                  <span className="font-medium">{student.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Telefone:</span>
                  <span className="font-medium">{student.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Endereço:</span>
                  <span className="font-medium">{student.address}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Frequência e desempenho</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Percentual de presenças:</span>
                  <span className="font-medium">{student.attendance}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Média de faltas por curso:</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Situação Acadêmica */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Situação acadêmica</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cursos concluídos:</span>
                  <span className="font-medium">Informática</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cursos em andamento:</span>
                  <span className="font-medium">{student.course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Turma atual:</span>
                  <span className="font-medium">{student.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Média geral:</span>
                  <span className="font-medium">{student.grades}</span>
                </div>
              </div>

              {/* Seção de múltiplos cursos */}
              {student.courses && student.courses.length > 0 ? (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-foreground">Cursos matriculado</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAddCourseModal(true)}
                      className="h-7 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {student.courses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-2 bg-muted rounded text-xs">
                        <span className="font-medium">{course.course?.nome}</span>
                        <Badge
                          variant={course.status === 'Ativo' ? 'default' : 'secondary'}
                          className={
                            course.status === 'Ativo'
                              ? 'bg-emerald-100 text-emerald-700'
                              : course.status === 'Concluído'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-red-100 text-red-700'
                          }
                        >
                          {course.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Cursos matriculados</h4>
                  <p className="text-xs text-muted-foreground mb-3">Nenhum curso registrado ou dados ainda carregando...</p>
                  <Button
                    size="sm"
                    onClick={() => setShowAddCourseModal(true)}
                    className="w-full h-8 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar Primeiro Curso
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Configurações</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-primary hover:text-primary"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar informações
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-primary hover:text-primary"
                  onClick={handleGenerateReport}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar relatório individual
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir matrícula
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button onClick={onClose} variant="outline" className="px-8">
            Voltar
          </Button>
        </div>

        {/* Modal para Adicionar Curso */}
        <Dialog open={showAddCourseModal} onOpenChange={setShowAddCourseModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Curso para {student.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Selecione o curso:</label>
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => setSelectedCourseId(course.id)}
                      className={`w-full text-left p-2 rounded transition-colors ${selectedCourseId === course.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                        }`}
                    >
                      <div className="font-medium text-sm">{course.title}</div>
                      <div className="text-xs text-muted-foreground">{course.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowAddCourseModal(false)}
                  disabled={isAddingCourse}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddCourse}
                  disabled={isAddingCourse || !selectedCourseId}
                >
                  {isAddingCourse ? 'Adicionando...' : 'Adicionar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsModal;