import { useState } from "react";
import { GraduationCap, Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Cadastro = () => {
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  const { toast } = useToast();

  const [studentForm, setStudentForm] = useState({
    name: "",
    cpf: "",
    email: "",
    birthDate: "",
    address: "",
    course: "",
    class: ""
  });

  const [classForm, setClassForm] = useState({
    name: "",
    course: "",
    instructor: "",
    period: "",
    schedule: "",
    workload: "",
    startDate: "",
    endDate: "",
    maxStudents: ""
  });

  const [instructorForm, setInstructorForm] = useState({
    name: "",
    cpf: "",
    email: "",
    birthDate: "",
    address: "",
    areaOfExpertise: "",
    phone: ""
  });

  // Funções de validação
  const validateStudentForm = () => {
    const errors: Record<string, string> = {};

    if (!validateRequired(studentForm.name)) {
      errors.name = "Nome é obrigatório";
    }

    if (!validateRequired(studentForm.cpf)) {
      errors.cpf = "CPF é obrigatório";
    } else if (!validateCPF(studentForm.cpf)) {
      errors.cpf = "CPF inválido";
    }

    if (!validateRequired(studentForm.rg)) {
      errors.rg = "RG é obrigatório";
    }

    if (!validateRequired(studentForm.email)) {
      errors.email = "Email é obrigatório";
    } else if (!validateEmail(studentForm.email)) {
      errors.email = "Email inválido";
    }

    if (!validateRequired(studentForm.birthDate)) {
      errors.birthDate = "Data de nascimento é obrigatória";
    } else if (!validateAge(studentForm.birthDate, 14, 100)) {
      errors.birthDate = "Idade deve estar entre 14 e 100 anos";
    }

    if (!validateRequired(studentForm.motherName)) {
      errors.motherName = "Nome da mãe é obrigatório";
    }

    if (!validateRequired(studentForm.phone)) {
      errors.phone = "Telefone é obrigatório";
    } else if (!validatePhone(studentForm.phone)) {
      errors.phone = "Telefone inválido";
    }

    if (!validateRequired(studentForm.course)) {
      errors.course = "Curso é obrigatório";
    }

    if (!validateRequired(studentForm.class)) {
      errors.class = "Turma é obrigatória";
    }

    setStudentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateClassForm = () => {
    const errors: Record<string, string> = {};

    if (!validateRequired(classForm.name)) {
      errors.name = "Nome da turma é obrigatório";
    }

    if (!validateRequired(classForm.course)) {
      errors.course = "Curso é obrigatório";
    }

    if (!validateRequired(classForm.instructor)) {
      errors.instructor = "Instrutor é obrigatório";
    }

    if (!validateRequired(classForm.period)) {
      errors.period = "Período é obrigatório";
    }

    if (!validateRequired(classForm.schedule)) {
      errors.schedule = "Horário é obrigatório";
    }

    if (!validateRequired(classForm.workload)) {
      errors.workload = "Carga horária é obrigatória";
    }

    if (!validateRequired(classForm.startDate)) {
      errors.startDate = "Data de início é obrigatória";
    }

    if (!validateRequired(classForm.endDate)) {
      errors.endDate = "Data de término é obrigatória";
    }

    if (!validateRequired(classForm.maxStudents)) {
      errors.maxStudents = "Número máximo de alunos é obrigatório";
    }

    setClassErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateInstructorForm = () => {
    const errors: Record<string, string> = {};

    if (!validateRequired(instructorForm.name)) {
      errors.name = "Nome é obrigatório";
    }

    if (!validateRequired(instructorForm.cpf)) {
      errors.cpf = "CPF é obrigatório";
    } else if (!validateCPF(instructorForm.cpf)) {
      errors.cpf = "CPF inválido";
    }

    if (!validateRequired(instructorForm.rg)) {
      errors.rg = "RG é obrigatório";
    }

    if (!validateRequired(instructorForm.email)) {
      errors.email = "Email é obrigatório";
    } else if (!validateEmail(instructorForm.email)) {
      errors.email = "Email inválido";
    }

    if (!validateRequired(instructorForm.birthDate)) {
      errors.birthDate = "Data de nascimento é obrigatória";
    } else if (!validateAge(instructorForm.birthDate, 18, 100)) {
      errors.birthDate = "Idade deve estar entre 18 e 100 anos";
    }

    if (!validateRequired(instructorForm.motherName)) {
      errors.motherName = "Nome da mãe é obrigatório";
    }

    if (!validateRequired(instructorForm.phone)) {
      errors.phone = "Telefone é obrigatório";
    } else if (!validatePhone(instructorForm.phone)) {
      errors.phone = "Telefone inválido";
    }

    if (!validateRequired(instructorForm.areaOfExpertise)) {
      errors.areaOfExpertise = "Área de atuação é obrigatória";
    }

    setInstructorErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Função para buscar endereço por CEP
  const handleCEPChange = async (cep: string, formType: 'student' | 'instructor') => {
    if (cep.length === 9) { // CEP com máscara
      setIsLoadingAddress(true);
      try {
        const address = await fetchAddressByCEP(cep);
        if (address) {
          if (formType === 'student') {
            setStudentForm(prev => ({
              ...prev,
              cep,
              street: address.logradouro,
              neighborhood: address.bairro,
              city: address.cidade,
              state: address.estado
            }));
          } else {
            setInstructorForm(prev => ({
              ...prev,
              cep,
              street: address.logradouro,
              neighborhood: address.bairro,
              city: address.cidade,
              state: address.estado
            }));
          }
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setIsLoadingAddress(false);
      }
    }
  };

  // Função para limpar formulários
  const clearStudentForm = () => {
    setStudentForm({
      name: "", cpf: "", rg: "", email: "", birthDate: "", address: "",
      cep: "", city: "", state: "", neighborhood: "", street: "", number: "", complement: "",
      course: "", class: "", motherName: "", fatherName: "", civilStatus: "", education: "", phone: "", photo: null
    });
    setStudentErrors({});
  };

  const clearClassForm = () => {
    setClassForm({
      name: "", course: "", instructor: "", period: "", schedule: "", workload: "",
      startDate: "", endDate: "", maxStudents: "", description: ""
    });
    setClassErrors({});
  };

  const clearInstructorForm = () => {
    setInstructorForm({
      name: "", cpf: "", rg: "", email: "", birthDate: "", address: "",
      cep: "", city: "", state: "", neighborhood: "", street: "", number: "", complement: "",
      areaOfExpertise: "", phone: "", motherName: "", fatherName: "", civilStatus: "", education: "", photo: null
    });
    setInstructorErrors({});
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStudentForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simular envio para API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsSuccess(true);
    
    toast({
      title: "✅ ALUNO CADASTRADO COM SUCESSO!",
      description: "Os dados foram salvos no sistema",
      className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    });
    
    setTimeout(() => {
      setIsStudentModalOpen(false);
      clearStudentForm();
      setIsSuccess(false);
    }, 1500);
  };

  const handleClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateClassForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simular envio para API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsSuccess(true);
    
    toast({
      title: "✅ TURMA CADASTRADA COM SUCESSO!",
      description: "A turma foi criada no sistema",
      className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    });
    
    setTimeout(() => {
      setIsClassModalOpen(false);
      clearClassForm();
      setIsSuccess(false);
    }, 1500);
  };

  const handleInstructorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInstructorForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simular envio para API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsSuccess(true);
    
    toast({
      title: "✅ INSTRUTOR CADASTRADO COM SUCESSO!",
      description: "Os dados foram salvos no sistema",
      className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    });
    
    setTimeout(() => {
      setIsInstructorModalOpen(false);
      clearInstructorForm();
      setIsSuccess(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-8">Sistema de Cadastro</h1>
        </div>

        <div className="space-y-6">
          {/* Cadastrar Aluno */}
          <Button
            onClick={() => setIsStudentModalOpen(true)}
            className="w-full h-20 text-xl font-semibold bg-primary-light hover:bg-primary-light/90 text-primary-dark gap-4"
          >
            <GraduationCap className="h-8 w-8" />
            CADASTRAR ALUNO
          </Button>

          {/* Cadastrar Turma */}
          <Button
            onClick={() => setIsClassModalOpen(true)}
            className="w-full h-20 text-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-4"
          >
            <Users className="h-8 w-8" />
            CADASTRAR TURMA
          </Button>

          {/* Cadastrar Instrutor */}
          <Button
            onClick={() => setIsInstructorModalOpen(true)}
            className="w-full h-20 text-xl font-semibold bg-primary-dark hover:bg-primary-dark/90 text-primary-foreground gap-4"
          >
            <UserCheck className="h-8 w-8" />
            CADASTRAR INSTRUTOR
          </Button>
        </div>
      </div>

      {/* Modal Cadastrar Aluno */}
      <Dialog open={isStudentModalOpen} onOpenChange={setIsStudentModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-none">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-foreground">Cadastrar Aluno</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Nome Completo</Label>
                <Input
                  id="studentName"
                  placeholder="Nome do aluno"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentBirthDate">Data de nascimento</Label>
                <Input
                  id="studentBirthDate"
                  type="date"
                  value={studentForm.birthDate}
                  onChange={(e) => setStudentForm({ ...studentForm, birthDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentCPF">CPF</Label>
                <Input
                  id="studentCPF"
                  placeholder="000.000.000-00"
                  value={studentForm.cpf}
                  onChange={(e) => setStudentForm({ ...studentForm, cpf: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentEmail">E-MAIL</Label>
                <Input
                  id="studentEmail"
                  type="email"
                  placeholder="aluno@email.com"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentAddress">Endereço</Label>
              <Input
                id="studentAddress"
                placeholder="Endereço completo"
                value={studentForm.address}
                onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentCourse">Curso</Label>
                <Select value={studentForm.course} onValueChange={(value) => setStudentForm({ ...studentForm, course: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="robotica">Robótica</SelectItem>
                    <SelectItem value="informatica">Informática</SelectItem>
                    <SelectItem value="programacao">Programação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentClass">Turma</Label>
                <Select value={studentForm.class} onValueChange={(value) => setStudentForm({ ...studentForm, class: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="turma-a">Turma A</SelectItem>
                    <SelectItem value="turma-b">Turma B</SelectItem>
                    <SelectItem value="turma-c">Turma C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3">
              CADASTRAR ALUNO
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Cadastrar Turma */}
      <Dialog open={isClassModalOpen} onOpenChange={setIsClassModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-none">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-foreground">Cadastrar Turma</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleClassSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="classPeriod">Período</Label>
                <Select value={classForm.period} onValueChange={(value) => setClassForm({ ...classForm, period: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matutino">Matutino</SelectItem>
                    <SelectItem value="vespertino">Vespertino</SelectItem>
                    <SelectItem value="noturno">Noturno</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="classInstructor">Instrutor</Label>
                <Select value={classForm.instructor} onValueChange={(value) => setClassForm({ ...classForm, instructor: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o instrutor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instrutor-a">Instrutor A</SelectItem>
                    <SelectItem value="instrutor-b">Instrutor B</SelectItem>
                    <SelectItem value="instrutor-c">Instrutor C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="classCourse">Curso</Label>
                <Select value={classForm.course} onValueChange={(value) => setClassForm({ ...classForm, course: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="robotica">Robótica</SelectItem>
                    <SelectItem value="informatica">Informática</SelectItem>
                    <SelectItem value="programacao">Programação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="classWorkload">Carga Horária</Label>
                <Select value={classForm.workload} onValueChange={(value) => setClassForm({ ...classForm, workload: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a carga horária" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60h">60 horas</SelectItem>
                    <SelectItem value="80h">80 horas</SelectItem>
                    <SelectItem value="100h">100 horas</SelectItem>
                    <SelectItem value="120h">120 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3">
              CADASTRAR TURMA
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Cadastrar Instrutor */}
      <Dialog open={isInstructorModalOpen} onOpenChange={setIsInstructorModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-none">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-foreground">Cadastrar Instrutor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInstructorSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructorName">Nome Completo</Label>
                <Input
                  id="instructorName"
                  placeholder="Nome do instrutor"
                  value={instructorForm.name}
                  onChange={(e) => setInstructorForm({ ...instructorForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructorBirthDate">Data de nascimento</Label>
                <Input
                  id="instructorBirthDate"
                  type="date"
                  value={instructorForm.birthDate}
                  onChange={(e) => setInstructorForm({ ...instructorForm, birthDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructorCPF">CPF</Label>
                <Input
                  id="instructorCPF"
                  placeholder="000.000.000-00"
                  value={instructorForm.cpf}
                  onChange={(e) => setInstructorForm({ ...instructorForm, cpf: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructorEmail">E-MAIL</Label>
                <Input
                  id="instructorEmail"
                  type="email"
                  placeholder="instrutor@email.com"
                  value={instructorForm.email}
                  onChange={(e) => setInstructorForm({ ...instructorForm, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructorAddress">Endereço</Label>
              <Input
                id="instructorAddress"
                placeholder="Endereço completo"
                value={instructorForm.address}
                onChange={(e) => setInstructorForm({ ...instructorForm, address: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructorArea">Área de atuação</Label>
                <Input
                  id="instructorArea"
                  placeholder="Ex: Robótica e Automação"
                  value={instructorForm.areaOfExpertise}
                  onChange={(e) => setInstructorForm({ ...instructorForm, areaOfExpertise: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructorPhone">Telefone</Label>
                <Input
                  id="instructorPhone"
                  placeholder="(11) 99999-9999"
                  value={instructorForm.phone}
                  onChange={(e) => setInstructorForm({ ...instructorForm, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3">
              CADASTRAR INSTRUTOR
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cadastro;