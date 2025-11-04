import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAppData } from "@/hooks/useAppData";
import type { Class } from "@/contexts/AppContext";

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData?: Class | null;
  mode: "create" | "edit";
}

const ClassFormModal = ({ isOpen, onClose, classData, mode }: ClassFormModalProps) => {
  const { toast } = useToast();
  const { addClass, updateClass, courses, instructors } = useAppData();
  const [formData, setFormData] = useState({
    name: classData?.name || "",
    course: classData?.course || "",
    instructor: classData?.instructor || "",
    instructorId: classData?.instructorId || 0, // ID do instrutor selecionado
    capacity: classData?.capacity || 0,
    schedule: classData?.schedule || "",
    duration: classData?.duration || "",
    status: classData?.status || "Planejada",
    startDate: classData?.startDate || "",
    endDate: classData?.endDate || "",
    enrolled: classData?.enrolled || 0,
    students: classData?.students || [],
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.course || !formData.instructor) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      if (mode === "create") {
        await addClass(formData);
      } else if (classData) {
        await updateClass(classData.id, formData);
      }

      const action = mode === "create" ? "CRIADA" : "ATUALIZADA";
      toast({
        title: `TURMA ${action}`,
        description: `A turma ${formData.name} foi ${action.toLowerCase()} com sucesso`,
        className: "bg-green-100 text-green-800 border-green-200",
      });

      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar turma:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar a turma",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-foreground">
            {mode === "create" ? "Cadastrar Nova Turma" : "Editar Turma"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Turma *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: TURMA A"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Curso *</Label>
              <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.title}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor">Instrutor *</Label>
              <Select 
                value={formData.instructorId > 0 ? formData.instructorId.toString() : ""} 
                onValueChange={(value) => {
                  const instructorId = parseInt(value);
                  const instructor = instructors.find(i => i.id === instructorId);
                  handleInputChange("instructorId", instructorId);
                  handleInputChange("instructor", instructor?.name || "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o instrutor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.length === 0 ? (
                    <SelectItem value="0" disabled>Nenhum instrutor cadastrado</SelectItem>
                  ) : (
                    instructors.map((instructor) => (
                      <SelectItem key={instructor.id} value={instructor.id.toString()}>
                        {instructor.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidade</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", parseInt(e.target.value) || 0)}
                placeholder="20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Carga Horária</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                placeholder="Ex: 120h"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planejada">Planejada</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início</Label>
              <Input
                id="startDate"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                placeholder="dd/mm/aaaa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Término</Label>
              <Input
                id="endDate"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                placeholder="dd/mm/aaaa"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule">Horário</Label>
            <Textarea
              id="schedule"
              value={formData.schedule}
              onChange={(e) => handleInputChange("schedule", e.target.value)}
              placeholder="Ex: Segunda a Sexta - 14h às 17h"
              rows={2}
            />
          </div>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {mode === "create" ? "Cadastrar" : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClassFormModal;