import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppData } from "@/hooks/useAppData";
import type { Student } from "@/contexts/AppContext";

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentData?: Student | null;
  mode: "create" | "edit";
}

const StudentFormModal = ({ isOpen, onClose, studentData, mode }: StudentFormModalProps) => {
  const { toast } = useToast();
  const { addStudent, updateStudent, courses, classes } = useAppData();
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    phone: "",
    birthDate: "",
    address: "",
    status: "Ativo",
    course: "",
    class: "",
    enrollmentDate: new Date().toLocaleDateString('pt-BR'),
    progress: "0",
    attendance: "0",
    grades: "0",
  });

  // Atualizar dados do formulário quando studentData mudar
  useEffect(() => {
    if (studentData && mode === "edit") {
      setFormData({
        name: studentData.name || "",
        cpf: studentData.cpf || "",
        email: studentData.email || "",
        phone: studentData.phone || "",
        birthDate: studentData.birthDate || "",
        address: studentData.address || "",
        status: studentData.status || "Ativo",
        course: studentData.course || "",
        class: studentData.class || "",
        enrollmentDate: studentData.enrollmentDate || new Date().toLocaleDateString('pt-BR'),
        progress: studentData.progress?.toString() || "0",
        attendance: studentData.attendance?.toString() || "0",
        grades: studentData.grades?.toString() || "0",
      });
    } else if (mode === "create") {
      // Resetar formulário para criação
      setFormData({
        name: "",
        cpf: "",
        email: "",
        phone: "",
        birthDate: "",
        address: "",
        status: "Ativo",
        course: "",
        class: "",
        enrollmentDate: new Date().toLocaleDateString('pt-BR'),
        progress: "0",
        attendance: "0",
        grades: "0",
      });
    }
  }, [studentData, mode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4,5})(\d{4})/, "$1-$2");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cpf || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      // Converter valores numéricos
      const submitData = {
        ...formData,
        progress: Number(formData.progress),
        attendance: Number(formData.attendance),
        grades: Number(formData.grades),
      };

      if (mode === "create") {
        await addStudent(submitData);
      } else if (studentData) {
        await updateStudent(studentData.id, submitData);
      }

      const action = mode === "create" ? "CADASTRADO" : "ATUALIZADO";
      toast({
        title: `ALUNO ${action}`,
        description: `O aluno ${formData.name} foi ${action.toLowerCase()} com sucesso`,
        className: "bg-green-100 text-green-800 border-green-200",
      });

      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar aluno:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o aluno",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-foreground">
            {mode === "create" ? "Cadastrar Novo Aluno" : "Editar Aluno"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: João Silva Santos"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => handleInputChange("cpf", formatCPF(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="joao@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", formatPhone(e.target.value))}
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input
                id="birthDate"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                placeholder="dd/mm/aaaa"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Rua, número, bairro, cidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Curso (opcional)</Label>
              <Select value={formData.course || "none"} onValueChange={(value) => handleInputChange("course", value === "none" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o curso (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum curso</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.title}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Turma (opcional)</Label>
              <Select value={formData.class || "none"} onValueChange={(value) => handleInputChange("class", value === "none" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma turma</SelectItem>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.name}>
                      {classItem.name} - {classItem.course}
                    </SelectItem>
                  ))}
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
                  <SelectItem value="Trancado">Trancado</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4">
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

export default StudentFormModal;