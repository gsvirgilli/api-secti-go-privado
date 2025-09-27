import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import StudentDetailsModal from "./StudentDetailsModal";
import ClassFormModal from "./ClassFormModal";

interface ClassDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: {
    id: number;
    name: string;
    course: string;
    instructor: string;
    capacity: number;
    enrolled: number;
    schedule: string;
    duration: string;
    status: string;
    startDate: string;
    endDate: string;
    students: Array<{
      id: number;
      name: string;
      status: string;
    }>;
  } | null;
}

const ClassDetailsModal = ({ isOpen, onClose, classData }: ClassDetailsModalProps) => {
  const { toast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  if (!classData) return null;

  const handleEditClass = () => {
    setIsEditModalOpen(true);
  };

  const handleStudentDetails = (student: any) => {
    // Create full student object for the modal
    const fullStudent = {
      id: student.id,
      name: student.name,
      cpf: "000.000.000-00",
      phone: "(00) 00000-0000",
      email: `${student.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      birthDate: "01/01/2000",
      address: "Endereço não informado",
      attendance: 85,
      performance: 8.5,
      status: student.status
    };
    setSelectedStudent(fullStudent);
    setIsStudentModalOpen(true);
  };


  const handleDeleteClass = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    toast({
      title: "TURMA EXCLUÍDA",
      description: "Voltar para Turmas",
      className: "bg-red-100 text-red-800 border-red-200",
    });
    setIsDeleteModalOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-foreground mb-4">
            {classData.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações da Turma */}
          <div className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Curso:</span>
                <span className="font-medium">{classData.course}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Instrutor:</span>
                <span className="font-medium">{classData.instructor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vagas:</span>
                <span className="font-medium">{classData.enrolled}/{classData.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Carga horária:</span>
                <span className="font-medium">{classData.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge className="bg-emerald-100 text-emerald-700">
                  {classData.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data início:</span>
                <span className="font-medium">{classData.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data fim:</span>
                <span className="font-medium">{classData.endDate}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleEditClass}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Editar Turma
              </Button>
              <Button 
                onClick={handleDeleteClass}
                variant="destructive" 
                className="w-full"
              >
                Excluir Turma
              </Button>
            </div>
          </div>

          {/* Lista de Alunos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Alunos Matriculados</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {classData.students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                      {student.name.charAt(0)}
                    </div>
                    <span className="font-medium">{student.name}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleStudentDetails(student)}
                  >
                    <Eye className="h-4 w-4" />
                    Ver detalhes
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button onClick={onClose} variant="outline" className="px-8">
            Voltar
          </Button>
        </div>

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="QUER MESMO EXCLUIR ESSA TURMA?"
          message="Esta ação não pode ser desfeita."
        />

        <ClassFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          classData={classData}
          mode="edit"
        />

        <StudentDetailsModal
          isOpen={isStudentModalOpen}
          onClose={() => setIsStudentModalOpen(false)}
          student={selectedStudent}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClassDetailsModal;