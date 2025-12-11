import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAppData } from "@/hooks/useAppData";
import { getApiErrorMessage } from "@/contexts/appContextCore";
import type { Class } from "@/types/appContext";

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData?: Class | null;
  mode: "create" | "edit";
}

const ClassFormModal = ({ isOpen, onClose, classData, mode }: ClassFormModalProps) => {
  const { toast } = useToast();
  const { addClass, updateClass, courses, instructors } = useAppData();

  // Converter dd/mm/yyyy para yyyy-MM-dd (para input type="date")
  const convertToInputFormat = (date: string) => {
    if (!date) return "";
    const parts = date.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return date;
  };

  // Converter yyyy-MM-dd para dd/mm/yyyy (para backend)
  const convertToDisplayFormat = (date: string) => {
    if (!date) return "";
    const parts = date.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1].padStart(2, '0');
      const day = parts[2].padStart(2, '0');
      return `${day}/${month}/${year}`;
    }
    return date;
  };

  const [formData, setFormData] = useState({
    name: classData?.name || "",
    course: classData?.course || "",
    instructor: classData?.instructor || "",
    instructorIds: classData?.instructorIds || [], // Múltiplos IDs de instrutores
    capacity: classData?.capacity || 0,
    schedule: classData?.schedule || "",
    duration: classData?.duration || "",
    status: classData?.status || "Planejada",
    startDate: convertToInputFormat(classData?.startDate || ""),
    endDate: convertToInputFormat(classData?.endDate || ""),
    enrolled: classData?.enrolled || 0,
    students: classData?.students || [],
  });

  // Atualizar formData quando classData mudar (modo edição)
  useEffect(() => {
    if (classData && mode === "edit") {
      setFormData({
        name: classData.name || "",
        course: classData.course || "",
        instructor: classData.instructor || "",
        instructorIds: classData.instructorIds || [],
        capacity: classData.capacity || 0,
        schedule: classData.schedule || "",
        duration: classData.duration || "",
        status: classData.status || "Planejada",
        startDate: convertToInputFormat(classData.startDate || ""),
        endDate: convertToInputFormat(classData.endDate || ""),
        enrolled: classData.enrolled || 0,
        students: classData.students || [],
      });
    } else if (mode === "create") {
      // Resetar form ao criar
      setFormData({
        name: "",
        course: "",
        instructor: "",
        instructorIds: [],
        capacity: 0,
        schedule: "",
        duration: "",
        status: "Planejada",
        startDate: "",
        endDate: "",
        enrolled: 0,
        students: [],
      });
    }
  }, [classData, mode]);

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

    // Validar se status é ATIVA, deve ter instrutor
    if (formData.status === "Ativo" && (!formData.instructorIds || formData.instructorIds.length === 0)) {
      toast({
        title: "Instrutor obrigatório",
        description: "Turmas ativas devem ter pelo menos um instrutor cadastrado",
        variant: "destructive"
      });
      return;
    }

    try {
      // Converter datas de volta para formato dd/mm/yyyy antes de enviar (ou vazio se não informado)
      const dataToSend = {
        ...formData,
        startDate: formData.startDate ? convertToDisplayFormat(formData.startDate) : "",
        endDate: formData.endDate ? convertToDisplayFormat(formData.endDate) : ""
      };

      console.log('📋 Dados a enviar:', { formData, dataToSend });

      if (mode === "create") {
        await addClass(dataToSend);
      } else if (classData) {
        console.log('🔄 Atualizando turma', classData.id, 'com instrutorIds:', dataToSend.instructorIds);
        await updateClass(classData.id, dataToSend);
      }

      const action = mode === "create" ? "CRIADA" : "ATUALIZADA";
      toast({
        title: `TURMA ${action}`,
        description: `A turma ${formData.name} foi ${action.toLowerCase()} com sucesso`,
        className: "bg-green-100 text-green-800 border-green-200",
      });

      onClose();
    } catch (error: unknown) {
      console.error('Erro ao salvar turma:', error);
      toast({
        title: "Erro ao salvar",
        description: getApiErrorMessage(error, "Não foi possível salvar a turma"),
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
            <div className="space-y-2 md:col-span-2">
              <Label>Instrutores *</Label>
              <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                {instructors.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum instrutor cadastrado</p>
                ) : (
                  instructors.map((instructor) => (
                    <div key={instructor.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`instructor-${instructor.id}`}
                        checked={formData.instructorIds.includes(instructor.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const newIds = [...formData.instructorIds, instructor.id];
                            handleInputChange("instructorIds", newIds);
                            // Atualizar instructor (nome do primeiro)
                            const firstInstructor = instructors.find(i => i.id === newIds[0]);
                            handleInputChange("instructor", firstInstructor?.name || "");
                          } else {
                            const newIds = formData.instructorIds.filter(id => id !== instructor.id);
                            handleInputChange("instructorIds", newIds);
                            // Atualizar instructor (nome do novo primeiro ou vazio)
                            const firstInstructor = newIds.length > 0 ? instructors.find(i => i.id === newIds[0]) : undefined;
                            handleInputChange("instructor", firstInstructor?.name || "");
                          }
                        }}
                        className="rounded"
                      />
                      <label htmlFor={`instructor-${instructor.id}`} className="text-sm cursor-pointer">
                        {instructor.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Selecionados: {formData.instructorIds.length} instrutor(es)
              </p>
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
                  <SelectItem key="status-planejada" value="Planejada">Planejada</SelectItem>
                  <SelectItem key="status-ativo" value="Ativo">Ativo</SelectItem>
                  <SelectItem key="status-concluida" value="Concluída">Concluída</SelectItem>
                  <SelectItem key="status-cancelada" value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início (opcional)</Label>
              <div className="flex gap-2">
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className="flex-1"
                />
                {formData.startDate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleInputChange("startDate", "")}
                    title="Limpar data"
                  >
                    ✕
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Término (opcional)</Label>
              <div className="flex gap-2">
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className="flex-1"
                />
                {formData.endDate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleInputChange("endDate", "")}
                    title="Limpar data"
                  >
                    ✕
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule">Turno *</Label>
            <Select value={formData.schedule} onValueChange={(value) => handleInputChange("schedule", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="turno-manha" value="Matutino">Matutino</SelectItem>
                <SelectItem key="turno-tarde" value="Vespertino">Vespertino</SelectItem>
                <SelectItem key="turno-noite" value="Noturno">Noturno</SelectItem>
                <SelectItem key="turno-integral" value="Integral">Integral</SelectItem>
              </SelectContent>
            </Select>
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