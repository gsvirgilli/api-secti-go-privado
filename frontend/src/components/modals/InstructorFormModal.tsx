import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppData } from "@/hooks/useAppData";

interface InstructorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructorData?: {
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
  } | null;
  mode: "create" | "edit";
}

const InstructorFormModal = ({ isOpen, onClose, instructorData, mode }: InstructorFormModalProps) => {
  const { toast } = useToast();
  const { addInstructor, updateInstructor } = useAppData();
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    phone: "",
    birthDate: "",
    address: "",
    specialization: "",
    experience: "",
    status: "Ativo",
  });

  // Atualizar dados do formulário quando instructorData mudar
  useEffect(() => {
    if (instructorData && mode === "edit") {
      setFormData({
        name: instructorData.name || "",
        cpf: instructorData.cpf || "",
        email: instructorData.email || "",
        phone: instructorData.phone || "",
        birthDate: instructorData.birthDate || "",
        address: instructorData.address || "",
        specialization: instructorData.specialization || "",
        experience: instructorData.experience || "",
        status: instructorData.status || "Ativo",
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
        specialization: "",
        experience: "",
        status: "Ativo",
      });
    }
  }, [instructorData, mode]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cpf || !formData.email || !formData.specialization) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (mode === "create") {
      addInstructor(formData);
    } else if (instructorData) {
      updateInstructor(instructorData.id, formData);
    }

    const action = mode === "create" ? "CADASTRADO" : "ATUALIZADO";
    toast({
      title: `INSTRUTOR ${action}`,
      description: `O instrutor ${formData.name} foi ${action.toLowerCase()} com sucesso`,
      className: "bg-green-100 text-green-800 border-green-200",
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-foreground">
            {mode === "create" ? "Cadastrar Novo Instrutor" : "Editar Instrutor"}
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
                placeholder="joao@sukatech.com"
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
              <Label htmlFor="specialization">Especialização *</Label>
              <Select value={formData.specialization} onValueChange={(value) => handleInputChange("specialization", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a especialização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Robótica e Automação">Robótica e Automação</SelectItem>
                  <SelectItem value="Informática e Programação">Informática e Programação</SelectItem>
                  <SelectItem value="Web Design e UX/UI">Web Design e UX/UI</SelectItem>
                  <SelectItem value="Python e Data Science">Python e Data Science</SelectItem>
                  <SelectItem value="Banco de Dados">Banco de Dados</SelectItem>
                  <SelectItem value="Desenvolvimento Mobile">Desenvolvimento Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experiência</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                placeholder="Ex: 5 anos"
              />
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
                  <SelectItem value="Férias">Férias</SelectItem>
                  <SelectItem value="Licença">Licença</SelectItem>
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

export default InstructorFormModal;