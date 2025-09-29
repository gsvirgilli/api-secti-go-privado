import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface InstructorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructor: {
    id: number;
    name: string;
    cpf: string;
    email: string;
    phone: string;
    birthDate: string;
    address: string;
    specialization: string;
    experience: string;
    status: string;
    classes: Array<{
      id: number;
      name: string;
      course: string;
    }>;
  } | null;
}

const InstructorDetailsModal = ({ isOpen, onClose, instructor }: InstructorDetailsModalProps) => {
  const { toast } = useToast();

  if (!instructor) return null;

  const handleEditInstructor = () => {
    toast({
      title: "Editar Instrutor",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleAssignClass = () => {
    toast({
      title: "Atribuir Turma",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleDeleteInstructor = () => {
    toast({
      title: "Excluir Cadastro",
      description: "Tem certeza que deseja excluir este instrutor?",
      variant: "destructive",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-foreground mb-4">
            {instructor.name}
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
                  <span className="font-medium">{instructor.cpf}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data de nascimento:</span>
                  <span className="font-medium">{instructor.birthDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">E-mail:</span>
                  <span className="font-medium">{instructor.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Telefone:</span>
                  <span className="font-medium">{instructor.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Endereço:</span>
                  <span className="font-medium">{instructor.address}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Situação acadêmica</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Especialização:</span>
                  <span className="font-medium">{instructor.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experiência:</span>
                  <span className="font-medium">{instructor.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cursos ministrados:</span>
                  <span className="font-medium">{instructor.classes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Turmas ativas:</span>
                  <span className="font-medium">{instructor.classes.filter(c => c.name.includes('Ativa')).length || 1}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configurações */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Configurações</h3>
              <div className="space-y-3">
                <Button 
                  onClick={handleEditInstructor}
                  variant="outline" 
                  className="w-full justify-start text-primary hover:text-primary"
                >
                  Editar informações
                </Button>
                <Button 
                  onClick={handleAssignClass}
                  variant="outline" 
                  className="w-full justify-start text-primary hover:text-primary"
                >
                  Atribuir Turma
                </Button>
                <Button 
                  onClick={handleDeleteInstructor}
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  Excluir cadastro
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Turmas Atuais</h3>
              <div className="space-y-2">
                {instructor.classes.map((classItem) => (
                  <div key={classItem.id} className="p-3 bg-muted/20 rounded-lg">
                    <div className="font-medium">{classItem.name}</div>
                    <div className="text-sm text-muted-foreground">{classItem.course}</div>
                  </div>
                ))}
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

export default InstructorDetailsModal;