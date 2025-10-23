import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppData } from "@/hooks/useAppData";
import type { Student } from "@/contexts/AppContext";
import { StudentsAPI } from "@/lib/api";

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentData?: Student | null;
  mode: "create" | "edit";
}

const StudentFormModal = ({ isOpen, onClose, studentData, mode }: StudentFormModalProps) => {
  const { toast } = useToast();
  const { courses, classes, addStudent, updateStudent } = useAppData();

  const [isLoading, setIsLoading] = useState(false);
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
    enrollmentDate: new Date().toLocaleDateString("pt-BR"),
  });

  // Atualiza os dados no modo edição
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
        enrollmentDate: studentData.enrollmentDate || new Date().toLocaleDateString("pt-BR"),
      });
    } else {
      // Resetar se for criar novo aluno
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
        enrollmentDate: new Date().toLocaleDateString("pt-BR"),
      });
    }
  }, [studentData, mode]);

  // Formatação
  const formatCPF = (value: string) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");

  const formatPhone = (value: string) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4,5})(\d{4})/, "$1-$2");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Envio do formulário
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validação simples
  if (!formData.name || !formData.cpf || !formData.email) {
    toast({
      title: "Campos obrigatórios",
      description: "Preencha nome, CPF e e-mail antes de continuar.",
      variant: "destructive",
    });
    return;
  }

  try {
    setIsLoading(true);

    // 🔹 Simulação de resposta
    const fakeResponse = { data: { ...formData, id: Math.random() } };
    addStudent(fakeResponse.data);

    toast({
      title: "✅ Aluno cadastrado com sucesso!",
      description: `${formData.name} foi adicionado ao sistema.`,
      className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    });

    onClose();
  } catch (error) {
    toast({
      title: "Erro ao salvar",
      description: "Não foi possível salvar os dados do aluno. Tente novamente.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
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
            {/* Nome */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: João Silva Santos"
              />
            </div>

            {/* CPF */}
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

            {/* Email */}
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

            {/* Telefone */}
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

            {/* Nascimento */}
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
              />
            </div>

            {/* Endereço */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Rua, número, bairro, cidade"
              />
            </div>

            {/* Curso */}
            <div className="space-y-2">
              <Label htmlFor="course">Curso</Label>
              <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


            </div>

            {/* Turma */}
            <div className="space-y-2">
              <Label htmlFor="class">Turma</Label>
              <Select value={formData.class} onValueChange={(value) => handleInputChange("class", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id.toString()}>
                    {classItem.name} - {classItem.course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
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

          {/* Botões */}
          <div className="flex gap-4 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading
                ? "Salvando..."
                : mode === "create"
                ? "Cadastrar"
                : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentFormModal;
