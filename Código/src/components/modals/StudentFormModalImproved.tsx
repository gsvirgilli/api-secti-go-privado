
import React, { useState } from "react";
import { Loader2, CheckCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MaskedInput } from "@/components/ui/masked-input";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { 
  validateCPF, 
  validateEmail, 
  validatePhone, 
  validateAge, 
  validateRequired,
  maskCPF, 
  maskPhone, 
  maskCEP, 
  maskRG,
  fetchAddressByCEP,
  civilStatusOptions,
  educationOptions
} from "@/lib/validation";

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    cpf: "",
    rg: "",
    email: "",
    birthDate: "",
    cep: "",
    city: "",
    state: "",
    neighborhood: "",
    street: "",
    number: "",
    complement: "",
    course: "",
    class: "",
    motherName: "",
    fatherName: "",
    civilStatus: "",
    education: "",
    phone: "",
    photo: null as File | null
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(form.name)) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!validateRequired(form.cpf)) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (!validateCPF(form.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    if (!validateRequired(form.rg)) {
      newErrors.rg = "RG é obrigatório";
    }

    if (!validateRequired(form.email)) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Email inválido";
    }

    if (!validateRequired(form.birthDate)) {
      newErrors.birthDate = "Data de nascimento é obrigatória";
    } else if (!validateAge(form.birthDate, 14, 100)) {
      newErrors.birthDate = "Idade deve estar entre 14 e 100 anos";
    }

    if (!validateRequired(form.motherName)) {
      newErrors.motherName = "Nome da mãe é obrigatório";
    }

    if (!validateRequired(form.phone)) {
      newErrors.phone = "Telefone é obrigatório";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Telefone inválido";
    }

    if (!validateRequired(form.course)) {
      newErrors.course = "Curso é obrigatório";
    }

    if (!validateRequired(form.class)) {
      newErrors.class = "Turma é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCEPChange = async (cep: string) => {
    if (cep.length === 9) {
      setIsLoadingAddress(true);
      try {
        const address = await fetchAddressByCEP(cep);
        if (address) {
          setForm(prev => ({
            ...prev,
            cep,
            street: address.logradouro,
            neighborhood: address.bairro,
            city: address.cidade,
            state: address.estado
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setIsLoadingAddress(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simular envio para API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    onSubmit(form);
  };

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cadastrar Aluno</h2>
          <Button variant="ghost" onClick={onClose}>✕</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Pessoais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={!!errors.name}
                errorMessage={errors.name}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento *</Label>
              <Input
                id="birthDate"
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                error={!!errors.birthDate}
                errorMessage={errors.birthDate}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <MaskedInput
                id="cpf"
                mask={maskCPF}
                value={form.cpf}
                onValueChange={(value) => setForm({ ...form, cpf: value })}
                error={!!errors.cpf}
                errorMessage={errors.cpf}
                placeholder="000.000.000-00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rg">RG *</Label>
              <MaskedInput
                id="rg"
                mask={maskRG}
                value={form.rg}
                onValueChange={(value) => setForm({ ...form, rg: value })}
                error={!!errors.rg}
                errorMessage={errors.rg}
                placeholder="00.000.000-0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={!!errors.email}
                errorMessage={errors.email}
                placeholder="aluno@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <MaskedInput
                id="phone"
                mask={maskPhone}
                value={form.phone}
                onValueChange={(value) => setForm({ ...form, phone: value })}
                error={!!errors.phone}
                errorMessage={errors.phone}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </div>

          {/* Informações Familiares */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="motherName">Nome da Mãe *</Label>
              <Input
                id="motherName"
                value={form.motherName}
                onChange={(e) => setForm({ ...form, motherName: e.target.value })}
                error={!!errors.motherName}
                errorMessage={errors.motherName}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fatherName">Nome do Pai</Label>
              <Input
                id="fatherName"
                value={form.fatherName}
                onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="civilStatus">Estado Civil</Label>
              <Select value={form.civilStatus} onValueChange={(value) => setForm({ ...form, civilStatus: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado civil" />
                </SelectTrigger>
                <SelectContent>
                  {civilStatusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="education">Escolaridade</Label>
              <Select value={form.education} onValueChange={(value) => setForm({ ...form, education: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a escolaridade" />
                </SelectTrigger>
                <SelectContent>
                  {educationOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Endereço</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <div className="relative">
                  <MaskedInput
                    id="cep"
                    mask={maskCEP}
                    value={form.cep}
                    onValueChange={(value) => {
                      setForm({ ...form, cep: value });
                      handleCEPChange(value);
                    }}
                    placeholder="00000-000"
                  />
                  {isLoadingAddress && (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={form.neighborhood}
                  onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="street">Rua</Label>
                <Input
                  id="street"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={form.complement}
                  onChange={(e) => setForm({ ...form, complement: e.target.value })}
                  placeholder="Apartamento, bloco, etc."
                />
              </div>
            </div>
          </div>

          {/* Informações Acadêmicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Acadêmicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Curso *</Label>
                <Select value={form.course} onValueChange={(value) => setForm({ ...form, course: value })}>
                  <SelectTrigger error={!!errors.course}>
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="robotica">Robótica</SelectItem>
                    <SelectItem value="informatica">Informática</SelectItem>
                    <SelectItem value="programacao">Programação</SelectItem>
                  </SelectContent>
                </Select>
                {errors.course && <p className="text-sm text-red-500">{errors.course}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="class">Turma *</Label>
                <Select value={form.class} onValueChange={(value) => setForm({ ...form, class: value })}>
                  <SelectTrigger error={!!errors.class}>
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="turma-a">Turma A</SelectItem>
                    <SelectItem value="turma-b">Turma B</SelectItem>
                    <SelectItem value="turma-c">Turma C</SelectItem>
                  </SelectContent>
                </Select>
                {errors.class && <p className="text-sm text-red-500">{errors.class}</p>}
              </div>
            </div>
          </div>

          {/* Foto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Foto</h3>
            <PhotoUpload
              onPhotoChange={(file) => setForm({ ...form, photo: file })}
              currentPhoto={null}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                "Cadastrar Aluno"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
