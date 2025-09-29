import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppData } from "@/hooks/useAppData";
import type { Course } from "@/contexts/AppContext";

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseData?: Course | null;
  mode: "create" | "edit";
}

const CourseFormModal = ({ isOpen, onClose, courseData, mode }: CourseFormModalProps) => {
  const { toast } = useToast();
  const { addCourse, updateCourse } = useAppData();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    level: "Básico",
    status: "Ativo",
    color: "bg-blue-500",
    students: 0,
  });

  // Atualizar dados do formulário quando courseData mudar
  useEffect(() => {
    if (courseData && mode === "edit") {
      setFormData({
        title: courseData.title || "",
        description: courseData.description || "",
        duration: courseData.duration || "",
        level: courseData.level || "Básico",
        status: courseData.status || "Ativo",
        color: courseData.color || "bg-blue-500",
        students: courseData.students || 0,
      });
    } else if (mode === "create") {
      // Resetar formulário para criação
      setFormData({
        title: "",
        description: "",
        duration: "",
        level: "Básico",
        status: "Ativo",
        color: "bg-blue-500",
        students: 0,
      });
    }
  }, [courseData, mode]);

  const colorOptions = [
    { value: "bg-blue-500", label: "Azul", class: "bg-blue-500" },
    { value: "bg-emerald-500", label: "Verde", class: "bg-emerald-500" },
    { value: "bg-purple-500", label: "Roxo", class: "bg-purple-500" },
    { value: "bg-orange-500", label: "Laranja", class: "bg-orange-500" },
    { value: "bg-pink-500", label: "Rosa", class: "bg-pink-500" },
    { value: "bg-indigo-500", label: "Índigo", class: "bg-indigo-500" },
    { value: "bg-red-500", label: "Vermelho", class: "bg-red-500" },
    { value: "bg-yellow-500", label: "Amarelo", class: "bg-yellow-500" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.duration) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (mode === "create") {
      addCourse(formData);
    } else if (courseData) {
      updateCourse(courseData.id, formData);
    }

    const action = mode === "create" ? "CRIADO" : "ATUALIZADO";
    toast({
      title: `CURSO ${action}`,
      description: `O curso ${formData.title} foi ${action.toLowerCase()} com sucesso`,
      className: "bg-green-100 text-green-800 border-green-200",
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-foreground">
            {mode === "create" ? "Cadastrar Novo Curso" : "Editar Curso"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Título do Curso *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Ex: Introdução à Programação"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descreva o conteúdo e objetivos do curso"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Carga Horária *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                placeholder="Ex: 120h"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Nível</Label>
              <Select value={formData.level} onValueChange={(value) => handleInputChange("level", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Básico">Básico</SelectItem>
                  <SelectItem value="Iniciante">Iniciante</SelectItem>
                  <SelectItem value="Intermediário">Intermediário</SelectItem>
                  <SelectItem value="Avançado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                  <SelectItem value="Em Desenvolvimento">Em Desenvolvimento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Cor de Identificação</Label>
              <Select value={formData.color} onValueChange={(value) => handleInputChange("color", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${color.class}`}></div>
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

export default CourseFormModal;