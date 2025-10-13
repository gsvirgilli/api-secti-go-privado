import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Edit, FileText, Trash2 } from "lucide-react";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: number;
    name: string;
    cpf: string;
    email: string;
    phone: string;
    birthDate: string;
    address: string;
    enrollmentDate: string;
    status: string;
    course: string;
    class: string;
    progress: number;
    attendance: number;
    grades: number;
  } | null;
  onEdit?: (student: any) => void;
  onDelete?: (studentId: number) => void;
}

const StudentDetailsModal = ({ isOpen, onClose, student, onEdit, onDelete }: StudentDetailsModalProps) => {
  const { toast } = useToast();

  if (!student) return null;

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
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsModal;