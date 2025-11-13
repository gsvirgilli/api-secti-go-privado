import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, AlertCircle, MapPin, User, Mail, Phone, Calendar, GraduationCap, Clock, ArrowLeft, Home, FileText, Upload, X, File } from "lucide-react";
import { useFormConfig } from "@/contexts/FormConfigContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CandidatesAPI, CoursesAPI } from "@/lib/api";
import { validateCPF, validateEmail, validatePhone, maskCPF, maskPhone, maskCEP, fetchAddressByCEP } from "@/lib/validation";

interface Course {
  id: number;
  nome: string;
  descricao?: string;
  carga_horaria?: number;
  nivel?: string;
  status?: 'ATIVO' | 'INATIVO' | 'EM_DESENVOLVIMENTO';
}

const Inscricao = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { config: formConfig, isConfigLoaded } = useFormConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // Detectar mudanças na configuração e notificar
  useEffect(() => {
    const handleConfigUpdate = (e: any) => {
      console.log('🔄 Configuração do formulário foi atualizada!', e.detail);
      
      const newConfig = e.detail;
      
      // Se inscrições foram fechadas, mostrar alerta grande
      if (!newConfig.inscricoesAbertas) {
        toast({
          title: "⚠️ Inscrições Fechadas",
          description: "O processo seletivo foi encerrado pelo administrador.",
          variant: "destructive",
          duration: 5000,
        });
      } else {
        toast({
          title: "⚡ Formulário Atualizado",
          description: "As configurações foram alteradas. Recarregue a página para ver todas as mudanças.",
          className: "bg-blue-100 text-blue-800 border-blue-200",
          duration: 4000,
        });
      }
    };

    window.addEventListener('formConfigUpdated', handleConfigUpdate);
    return () => window.removeEventListener('formConfigUpdated', handleConfigUpdate);
  }, [toast]);

  const [formData, setFormData] = useState({
    // Dados pessoais
    nome: "",
    cpf: "",
    rg: "",
    sexo: "",
    deficiencia: "",
    email: "",
    telefone: "",
    telefone2: "",
    data_nascimento: "",
    cidade_nascimento: "",
    idade: "",
    nome_mae: "",
    // Endereço
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    // Seleção
    curso_id: "",
    curso_id2: "",
    turno: "",
    turno2: "",
    local_curso: "",
    // Questionário Social
    raca_cor: "",
    renda_mensal: "",
    pessoas_renda: "",
    tipo_residencia: "",
    itens_casa: [] as string[],
    // Programa Goianas
    goianas_ciencia: "",
    // Menor de idade
    menor_idade: false,
    nome_responsavel: "",
    cpf_responsavel: "",
    // Arquivos
    rg_frente: null as File | null,
    rg_verso: null as File | null,
    cpf_aluno: null as File | null,
    comprovante_endereco: null as File | null,
    identidade_responsavel_frente: null as File | null,
    identidade_responsavel_verso: null as File | null,
    cpf_responsavel_file: null as File | null,
    comprovante_escolaridade: null as File | null,
    foto_3x4: null as File | null,
  });

  // Helper: Verificar se campo está visível
  const isFieldVisible = (fieldId: string): boolean => {
    const field = formConfig.fields.find(f => f.id === fieldId);
    return field?.visible !== false; // Se não encontrar, mostra por padrão
  };

  // Helper: Verificar se campo é obrigatório
  const isFieldRequired = (fieldId: string): boolean => {
    const field = formConfig.fields.find(f => f.id === fieldId);
    return field?.required === true;
  };

  // Carregar cursos ao montar o componente
  useEffect(() => {
    loadCourses();
  }, []);

  // Pular automaticamente a etapa 3 se não for menor de idade
  useEffect(() => {
    if (currentStep === 3 && !formData.menor_idade) {
      setCurrentStep(4);
    }
  }, [formData.menor_idade, currentStep]);

  const loadCourses = async () => {
    setIsLoadingCourses(true);
    try {
      console.log('🔄 [PÚBLICO] Carregando cursos...');
      const response = await CoursesAPI.listPublic();
      console.log('📦 [PÚBLICO] Response completa:', response);
      console.log('📦 [PÚBLICO] Response.data:', response.data);
      
      // O endpoint público retorna { message: '...', data: [...] }
      let coursesData = [];
      
      if (response.data?.data) {
        coursesData = response.data.data;
        console.log('📚 [PÚBLICO] Cursos com data wrapper:', coursesData);
      } else if (Array.isArray(response.data)) {
        coursesData = response.data;
        console.log('📚 [PÚBLICO] Cursos array direto:', coursesData);
      }
      
      console.log('📊 [PÚBLICO] Total de cursos ATIVOS:', coursesData.length);
      
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      console.log('✅ [PÚBLICO] Cursos definidos no estado');
    } catch (error) {
      console.error("❌ [PÚBLICO] Erro ao carregar cursos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os cursos disponíveis. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // Buscar endereço por CEP
  const handleCEPChange = async (cep: string) => {
    const maskedCEP = maskCEP(cep);
    setFormData(prev => ({ ...prev, cep: maskedCEP }));

    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length === 8) {
      setIsLoadingCEP(true);
      try {
        const address = await fetchAddressByCEP(cleanCEP);
        if (address) {
          setFormData(prev => ({
            ...prev,
            rua: address.logradouro || "",
            bairro: address.bairro || "",
            cidade: address.cidade || "",
            estado: address.estado || "",
          }));
        } else {
          toast({
            title: "CEP não encontrado",
            description: "Verifique o CEP digitado.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setIsLoadingCEP(false);
      }
    }
  };

  // Validação por etapa
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Dados Pessoais - VALIDAÇÃO DINÂMICA
        // Nome
        if (isFieldVisible('nome') && isFieldRequired('nome')) {
          if (!formData.nome.trim() || formData.nome.trim().length < 3) {
            newErrors.nome = "Nome completo é obrigatório (mínimo 3 caracteres)";
          }
        }
        
        // CPF
        if (isFieldVisible('cpf') && isFieldRequired('cpf')) {
          const cleanCPF = formData.cpf.replace(/\D/g, '');
          if (!cleanCPF || cleanCPF.length !== 11 || !validateCPF(cleanCPF)) {
            newErrors.cpf = "CPF inválido (deve ter 11 dígitos)";
          }
        }
        
        // RG
        if (isFieldVisible('rg') && isFieldRequired('rg')) {
          if (!formData.rg.trim()) {
            newErrors.rg = "RG é obrigatório";
          }
        }
        
        // Sexo
        if (isFieldVisible('sexo') && isFieldRequired('sexo')) {
          if (!formData.sexo) {
            newErrors.sexo = "Sexo é obrigatório";
          }
        }
        
        // Deficiência
        if (isFieldVisible('deficiencia') && isFieldRequired('deficiencia')) {
          if (!formData.deficiencia) {
            newErrors.deficiencia = "Este campo é obrigatório";
          }
        }
        
        // Email
        if (isFieldVisible('email') && isFieldRequired('email')) {
          if (!formData.email.trim() || !validateEmail(formData.email)) {
            newErrors.email = "Email inválido";
          }
        }
        
        // Telefone
        if (isFieldVisible('telefone') && isFieldRequired('telefone')) {
          const cleanPhone = formData.telefone.replace(/\D/g, '');
          if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 11) {
            newErrors.telefone = "Telefone inválido (10 ou 11 dígitos)";
          }
        }
        
        // Data de Nascimento
        if (isFieldVisible('data_nascimento') && isFieldRequired('data_nascimento')) {
          if (!formData.data_nascimento) {
            newErrors.data_nascimento = "Data de nascimento é obrigatória";
          }
        }
        
        // Idade
        if (isFieldVisible('idade') && isFieldRequired('idade')) {
          if (!formData.idade || parseInt(formData.idade) <= 12) {
            newErrors.idade = "Idade deve ser maior que 12 anos";
          }
        }
        
        // Nome da mãe
        if (isFieldVisible('nome_mae') && isFieldRequired('nome_mae')) {
          if (!formData.nome_mae.trim()) {
            newErrors.nome_mae = "Nome da mãe é obrigatório";
          }
        }
        break;

      case 2: // Endereço (opcional, mas se preenchido, validar)
        // Endereço é opcional, então não há erros obrigatórios
        break;

      case 3: // Responsável Legal
        // Se for menor de idade, validar campos do responsável
        if (formData.menor_idade) {
          if (!formData.nome_responsavel.trim()) {
            newErrors.nome_responsavel = "Nome do responsável é obrigatório";
          }
          const cleanCPFResp = formData.cpf_responsavel.replace(/\D/g, '');
          if (!cleanCPFResp || cleanCPFResp.length !== 11 || !validateCPF(cleanCPFResp)) {
            newErrors.cpf_responsavel = "CPF do responsável inválido";
          }
        }
        // Se não for menor, sempre passa pela validação (não precisa de campos)
        break;

      case 4: // Seleção de Curso
        if (!formData.curso_id) {
          newErrors.curso_id = "Curso é obrigatório";
        }
        if (!formData.turno) {
          newErrors.turno = "Turno é obrigatório";
        }
        if (!formData.local_curso) {
          newErrors.local_curso = "Local do curso é obrigatório";
        }
        break;

      case 5: // Questionário Social
        if (!formData.raca_cor) {
          newErrors.raca_cor = "Este campo é obrigatório";
        }
        if (!formData.renda_mensal) {
          newErrors.renda_mensal = "Este campo é obrigatório";
        }
        if (!formData.pessoas_renda) {
          newErrors.pessoas_renda = "Este campo é obrigatório";
        }
        if (!formData.tipo_residencia) {
          newErrors.tipo_residencia = "Este campo é obrigatório";
        }
        if (formData.itens_casa.length === 0) {
          newErrors.itens_casa = "Selecione ao menos um item";
        }
        break;

      case 6: // Goianas na Ciência
        if (!formData.goianas_ciencia) {
          newErrors.goianas_ciencia = "Este campo é obrigatório";
        }
        break;

      case 7: // Documentos - OBRIGATÓRIOS
        if (!formData.rg_frente) {
          newErrors.rg_frente = "Identidade (frente) é obrigatória";
        }
        if (!formData.rg_verso) {
          newErrors.rg_verso = "Identidade (verso) é obrigatória";
        }
        if (!formData.cpf_aluno) {
          newErrors.cpf_aluno = "CPF do aluno é obrigatório";
        }
        if (!formData.comprovante_endereco) {
          newErrors.comprovante_endereco = "Comprovante de endereço é obrigatório";
        }
        if (!formData.foto_3x4) {
          newErrors.foto_3x4 = "Foto 3x4 é obrigatória";
        }
        if (formData.menor_idade) {
          if (!formData.identidade_responsavel_frente) {
            newErrors.identidade_responsavel_frente = "Identidade do responsável (frente) é obrigatória";
          }
          if (!formData.identidade_responsavel_verso) {
            newErrors.identidade_responsavel_verso = "Identidade do responsável (verso) é obrigatória";
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navegar para próxima etapa
  const handleNextStep = async () => {
    if (validateStep(currentStep)) {
      // Se estiver na etapa 1 (Dados Pessoais), validar com o backend antes de avançar
      if (currentStep === 1) {
        setIsLoading(true);
        
        try {
          const cleanCPF = formData.cpf.replace(/\D/g, '');
          const cleanPhone = formData.telefone ? formData.telefone.replace(/\D/g, '') : undefined;
          
          // Chamar API de validação
          await CandidatesAPI.validateUniqueFields({
            cpf: cleanCPF,
            email: formData.email.trim().toLowerCase(),
            telefone: cleanPhone
          });
          
          // Se passou na validação, pode avançar
          setIsLoading(false);
        } catch (error: any) {
          setIsLoading(false);
          
          if (error.response?.data?.errors) {
            // Mostrar todos os erros retornados
            const errorMessages = error.response.data.errors.join('\n');
            
            toast({
              title: "❌ Dados já cadastrados",
              description: errorMessages,
              variant: "destructive",
              duration: 7000,
            });
            
            return; // Não avançar
          }
          
          // Erro genérico
          toast({
            title: "Erro ao validar dados",
            description: "Não foi possível validar seus dados. Tente novamente.",
            variant: "destructive",
          });
          
          return; // Não avançar
        }
      }
      
      let nextStep = currentStep + 1;
      
      // Pular etapa 3 (Responsável Legal) se não for menor de idade
      if (nextStep === 3 && !formData.menor_idade) {
        nextStep = 4;
      }
      
      setCurrentStep(Math.min(nextStep, totalSteps));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
    }
  };

  // Navegar para etapa anterior
  const handlePrevStep = () => {
    let prevStep = currentStep - 1;
    
    // Pular etapa 3 (Responsável Legal) se não for menor de idade ao voltar
    if (prevStep === 3 && !formData.menor_idade) {
      prevStep = 2;
    }
    
    setCurrentStep(Math.max(prevStep, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Obter título da etapa
  const getStepTitle = (step: number): string => {
    const titles = {
      1: "Dados Pessoais",
      2: "Endereço",
      3: "Responsável Legal",
      4: "Seleção de Curso",
      5: "Questionário Social",
      6: "Goianas na Ciência",
      7: "Documentos",
    };
    return titles[step as keyof typeof titles] || "";
  };

  // Submissão do formulário
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    console.log('🚀 Iniciando envio da inscrição...');
    
    // Validar todas as etapas obrigatórias
    const stepsToValidate = [1, 2, 4, 5, 6, 7]; // Todas exceto 3 que é condicional
    
    for (const step of stepsToValidate) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        toast({
          title: "Campos obrigatórios faltando",
          description: `Por favor, complete a etapa: ${getStepTitle(step)}`,
          variant: "destructive",
        });
        return;
      }
    }
    
    // Validar responsável legal se for menor de idade
    if (formData.menor_idade && !validateStep(3)) {
      setCurrentStep(3);
      toast({
        title: "Dados do responsável obrigatórios",
        description: "Por favor, preencha os dados do responsável legal.",
        variant: "destructive",
      });
      return;
    }

    console.log('✅ Validação passou! Preparando envio...');
    setIsLoading(true);

    try {
      // Preparar dados para envio - ENVIANDO TODOS OS CAMPOS
      const cleanCPF = formData.cpf.replace(/\D/g, '');
      const cleanPhone = formData.telefone.replace(/\D/g, '');
      const cleanPhone2 = formData.telefone2.replace(/\D/g, '');
      const cleanCEP = formData.cep.replace(/\D/g, '');
      const cleanCPFResponsavel = formData.cpf_responsavel.replace(/\D/g, '');

      const payload = {
        // Dados pessoais obrigatórios
        nome: formData.nome.trim(),
        cpf: cleanCPF,
        email: formData.email.trim().toLowerCase(),
        telefone: cleanPhone,
        data_nascimento: formData.data_nascimento,
        curso_id: Number(formData.curso_id),
        turno: formData.turno,
        
        // Dados pessoais adicionais
        ...(formData.rg && { rg: formData.rg.trim() }),
        ...(formData.sexo && { sexo: formData.sexo }),
        ...(formData.deficiencia && { deficiencia: formData.deficiencia }),
        ...(cleanPhone2 && { telefone2: cleanPhone2 }),
        ...(formData.idade && { idade: parseInt(formData.idade) }),
        ...(formData.nome_mae && { nome_mae: formData.nome_mae.trim() }),
        
        // Endereço
        ...(cleanCEP && { cep: cleanCEP }),
        ...(formData.rua && { rua: formData.rua.trim() }),
        ...(formData.numero && { numero: formData.numero.trim() }),
        ...(formData.complemento && { complemento: formData.complemento.trim() }),
        ...(formData.bairro && { bairro: formData.bairro.trim() }),
        ...(formData.cidade && { cidade: formData.cidade.trim() }),
        ...(formData.estado && { estado: formData.estado.trim().toUpperCase() }),
        
        // Curso - segunda opção
        ...(formData.curso_id2 && { curso_id2: Number(formData.curso_id2) }),
        ...(formData.turno2 && { turno2: formData.turno2 }),
        ...(formData.local_curso && { local_curso: formData.local_curso }),
        
        // Questionário Social
        ...(formData.raca_cor && { raca_cor: formData.raca_cor }),
        ...(formData.renda_mensal && { renda_mensal: formData.renda_mensal }),
        ...(formData.pessoas_renda && { pessoas_renda: formData.pessoas_renda }),
        ...(formData.tipo_residencia && { tipo_residencia: formData.tipo_residencia }),
        ...(formData.itens_casa.length > 0 && { itens_casa: formData.itens_casa.join(',') }),
        
        // Programa Goianas
        ...(formData.goianas_ciencia && { goianas_ciencia: formData.goianas_ciencia }),
        
        // Responsável Legal
        menor_idade: formData.menor_idade,
        ...(formData.menor_idade && formData.nome_responsavel && { nome_responsavel: formData.nome_responsavel.trim() }),
        ...(formData.menor_idade && cleanCPFResponsavel && { cpf_responsavel: cleanCPFResponsavel }),
        
        // Status inicial
        status: 'pendente'
      };

      // Preparar arquivos para envio
      const files: Record<string, File> = {};
      if (formData.rg_frente) files.rg_frente = formData.rg_frente;
      if (formData.rg_verso) files.rg_verso = formData.rg_verso;
      if (formData.cpf_aluno) files.cpf_aluno = formData.cpf_aluno;
      if (formData.comprovante_endereco) files.comprovante_endereco = formData.comprovante_endereco;
      if (formData.identidade_responsavel_frente) files.identidade_responsavel_frente = formData.identidade_responsavel_frente;
      if (formData.identidade_responsavel_verso) files.identidade_responsavel_verso = formData.identidade_responsavel_verso;
      if (formData.cpf_responsavel_file) files.cpf_responsavel_doc = formData.cpf_responsavel_file;
      if (formData.comprovante_escolaridade) files.comprovante_escolaridade = formData.comprovante_escolaridade;
      if (formData.foto_3x4) files.foto_3x4 = formData.foto_3x4;

      console.log('📤 Enviando dados completos:', payload);
      console.log('📎 Arquivos anexados:', Object.keys(files));
      
      await CandidatesAPI.createPublic(payload, files);

      setIsSuccess(true);
      toast({
        title: "✅ Inscrição realizada com sucesso!",
        description: "Sua candidatura foi enviada e está em análise. Você receberá um retorno em breve.",
        className: "bg-emerald-100 text-emerald-800 border-emerald-200",
      });

      // Limpar formulário após 3 segundos
      setTimeout(() => {
        setFormData({
          nome: "",
          cpf: "",
          rg: "",
          sexo: "",
          deficiencia: "",
          email: "",
          telefone: "",
          telefone2: "",
          data_nascimento: "",
          cidade_nascimento: "",
          idade: "",
          nome_mae: "",
          cep: "",
          rua: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          curso_id: "",
          curso_id2: "",
          turno: "",
          turno2: "",
          local_curso: "",
          raca_cor: "",
          renda_mensal: "",
          pessoas_renda: "",
          tipo_residencia: "",
          itens_casa: [],
          goianas_ciencia: "",
          menor_idade: false,
          nome_responsavel: "",
          cpf_responsavel: "",
          rg_frente: null,
          rg_verso: null,
          cpf_aluno: null,
          comprovante_endereco: null,
          identidade_responsavel_frente: null,
          identidade_responsavel_verso: null,
          cpf_responsavel_file: null,
          comprovante_escolaridade: null,
          foto_3x4: null,
        });
        setErrors({});
        setIsSuccess(false);
        setCurrentStep(1);
      }, 3000);
    } catch (error: any) {
      console.error("Erro ao enviar inscrição:", error);
      console.log("Detalhes do erro:", error.response?.data);

      // Usar a mensagem exata do backend
      let errorMessage = "Erro ao processar inscrição. Tente novamente mais tarde.";

      if (error.response?.data?.error) {
        // Mostrar exatamente a mensagem que o backend enviou
        errorMessage = error.response.data.error;
      }

      // Determinar se deve voltar para alguma etapa específica
      if (errorMessage.includes("curso") && errorMessage.includes("não encontrado")) {
        setCurrentStep(4); // Voltar para etapa de seleção de curso
      } else if (errorMessage.includes("CPF")) {
        setCurrentStep(1); // Voltar para dados pessoais
      } else if (errorMessage.includes("email") || errorMessage.includes("Email")) {
        setCurrentStep(1); // Voltar para dados pessoais
      } else if (errorMessage.includes("telefone")) {
        setCurrentStep(1); // Voltar para dados pessoais
      }

      toast({
        title: "❌ Erro ao enviar inscrição",
        description: errorMessage,
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/logo_suckatech.png" 
                alt="SukaTech Logo" 
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-xl font-bold text-foreground">SukaTech</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Início
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/login")}
                className="gap-2"
              >
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header da Página */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Inscrição no Processo Seletivo
          </h1>
          <div className="text-base text-muted-foreground max-w-2xl mx-auto space-y-2">
            <p>
              {formConfig.welcomeText}
            </p>
            <p className="font-semibold text-primary text-lg">
              {formConfig.instructionsText}
            </p>
          </div>
          
          {/* Aviso se inscrições estão fechadas */}
          {!formConfig.inscricoesAbertas && (
            <div className="max-w-2xl mx-auto mt-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
                <X className="h-12 w-12 text-red-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-red-900 mb-2">
                  Inscrições Temporariamente Fechadas
                </h3>
                <p className="text-red-700 mb-4">
                  O processo seletivo não está recebendo novas inscrições no momento. Por favor, volte mais tarde ou entre em contato conosco.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => navigate("/")}>
                    <Home className="h-4 w-4 mr-2" />
                    Voltar ao Início
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Indicador de Progresso */}
        {!isSuccess && formConfig.inscricoesAbertas && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-muted-foreground">
                Etapa {currentStep === 3 ? '3' : currentStep > 3 && !formData.menor_idade ? currentStep - 1 : currentStep} de {formData.menor_idade ? totalSteps : totalSteps - 1}
              </span>
              <span className="text-sm font-semibold text-primary">
                {Math.round((currentStep / (formData.menor_idade ? totalSteps : totalSteps - 1)) * 100)}% Completo
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${(currentStep / (formData.menor_idade ? totalSteps : totalSteps - 1)) * 100}%` }}
              />
            </div>
            <div className="mt-6 grid gap-2" style={{ gridTemplateColumns: `repeat(${formData.menor_idade ? totalSteps : totalSteps - 1}, minmax(0, 1fr))` }}>
              {Array.from({ length: totalSteps }, (_, i) => i + 1)
                .filter(step => formData.menor_idade || step !== 3)
                .map((step) => (
                <div
                  key={step}
                  className={`flex flex-col items-center gap-2 ${
                    step === currentStep ? 'scale-105' : ''
                  } transition-all duration-300`}
                >
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                      ${step < currentStep 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : step === currentStep 
                        ? 'bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20' 
                        : 'bg-slate-200 text-slate-400'
                      }
                    `}
                  >
                    {step < currentStep ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step > 3 && !formData.menor_idade ? step - 1 : step
                    )}
                  </div>
                  <span className={`text-xs text-center font-medium hidden sm:block ${
                    step === currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {getStepTitle(step)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulário */}
        {formConfig.inscricoesAbertas && (
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              {isSuccess ? 'Inscrição Concluída' : getStepTitle(currentStep)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            {isSuccess ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-bold text-emerald-700 mb-3">
                  Inscrição Realizada com Sucesso!
                </h3>
                <p className="text-lg text-muted-foreground mb-8">
                  Sua candidatura foi enviada e está em análise. Você receberá um retorno em breve.
                </p>
                <Button onClick={() => navigate("/")} variant="outline">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Etapa 1: Dados Pessoais */}
                {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-3 duration-500">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Dados Pessoais</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Nome Completo - Linha 1 */}
                    <div className="md:col-span-2">
                      <Label htmlFor="nome" className="text-base font-semibold mb-2 block">
                        Nome Completo <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, nome: e.target.value }));
                          if (errors.nome) setErrors(prev => ({ ...prev, nome: "" }));
                        }}
                        placeholder="Digite seu nome completo"
                        className={`h-11 ${errors.nome ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                      {errors.nome && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.nome}
                        </p>
                      )}
                    </div>

                    {/* CPF e RG - Linha 2 */}
                    {isFieldVisible('cpf') && (
                    <div>
                      <Label htmlFor="cpf" className="text-base font-semibold mb-2 block">
                        CPF {isFieldRequired('cpf') && <span className="text-destructive">*</span>}
                      </Label>
                      <Input
                        id="cpf"
                        value={formData.cpf}
                        onChange={(e) => {
                          const masked = maskCPF(e.target.value);
                          setFormData(prev => ({ ...prev, cpf: masked }));
                          if (errors.cpf) setErrors(prev => ({ ...prev, cpf: "" }));
                        }}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className={`h-11 ${errors.cpf ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                      {errors.cpf && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.cpf}
                        </p>
                      )}
                    </div>
                    )}

                    {isFieldVisible('rg') && (
                    <div>
                      <Label htmlFor="rg" className="text-base font-semibold mb-2 block">
                        RG {isFieldRequired('rg') && <span className="text-destructive">*</span>}
                      </Label>
                      <Input
                        id="rg"
                        value={formData.rg}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, rg: e.target.value }));
                          if (errors.rg) setErrors(prev => ({ ...prev, rg: "" }));
                        }}
                        placeholder="Digite seu RG (opcional)"
                        className={`h-11 ${errors.rg ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                      {errors.rg && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.rg}
                        </p>
                      )}
                    </div>
                    )}

                    {/* Data de Nascimento e Idade - Linha 3 - LADO A LADO */}
                    {isFieldVisible('data_nascimento') && (
                    <div>
                      <Label htmlFor="data_nascimento" className="text-base font-semibold mb-2 block">
                        Data de Nascimento {isFieldRequired('data_nascimento') && <span className="text-destructive">*</span>}
                      </Label>
                      <Input
                        id="data_nascimento"
                        type="date"
                        value={formData.data_nascimento}
                        onChange={(e) => {
                          const birthDate = e.target.value;
                          setFormData(prev => ({ ...prev, data_nascimento: birthDate }));
                          if (errors.data_nascimento) setErrors(prev => ({ ...prev, data_nascimento: "" }));
                          
                          // Calcular idade automaticamente
                          if (birthDate) {
                            const birth = new Date(birthDate);
                            const today = new Date();
                            let age = today.getFullYear() - birth.getFullYear();
                            const monthDiff = today.getMonth() - birth.getMonth();
                            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                              age--;
                            }
                            setFormData(prev => ({ ...prev, idade: String(age) }));
                            if (errors.idade) setErrors(prev => ({ ...prev, idade: "" }));
                          }
                        }}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
                        className={`h-11 ${errors.data_nascimento ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                      {errors.data_nascimento && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.data_nascimento}
                        </p>
                      )}
                    </div>
                    )}

                    {isFieldVisible('idade') && (
                    <div>
                      <Label htmlFor="idade" className="text-base font-semibold mb-2 block">
                        Idade {isFieldRequired('idade') && <span className="text-destructive">*</span>}
                      </Label>
                      <Input
                        id="idade"
                        type="number"
                        value={formData.idade}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, idade: e.target.value }));
                          if (errors.idade) setErrors(prev => ({ ...prev, idade: "" }));
                        }}
                        placeholder="Automático"
                        min="13"
                        max="100"
                        readOnly
                        className={`h-11 bg-muted ${errors.idade ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                      {errors.idade && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.idade}
                        </p>
                      )}
                    </div>
                    )}

                    {/* Email e Telefone 1 - Linha 4 */}
                    {isFieldVisible('email') && (
                    <div>
                      <Label htmlFor="email" className="text-base font-semibold mb-2 block">
                        Email {isFieldRequired('email') && <span className="text-destructive">*</span>}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, email: e.target.value }));
                          if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                        }}
                        placeholder="seu@email.com"
                        className={`h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                    )}

                    {isFieldVisible('telefone') && (
                    <div>
                      <Label htmlFor="telefone" className="text-base font-semibold mb-2 block">
                        Telefone {isFieldRequired('telefone') && <span className="text-destructive">*</span>}
                      </Label>
                      <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => {
                          const masked = maskPhone(e.target.value);
                          setFormData(prev => ({ ...prev, telefone: masked }));
                          if (errors.telefone) setErrors(prev => ({ ...prev, telefone: "" }));
                        }}
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        className={`h-11 ${errors.telefone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                      {errors.telefone && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.telefone}
                        </p>
                      )}
                    </div>
                    )}

                    {/* Telefone 2 e Sexo - Linha 5 */}
                    {isFieldVisible('telefone2') && (
                    <div>
                      <Label htmlFor="telefone2" className="text-base font-semibold mb-2 block">
                        Telefone 2 (opcional)
                      </Label>
                      <Input
                        id="telefone2"
                        value={formData.telefone2}
                        onChange={(e) => {
                          const masked = maskPhone(e.target.value);
                          setFormData(prev => ({ ...prev, telefone2: masked }));
                        }}
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        className="h-11"
                      />
                    </div>
                    )}

                    {isFieldVisible('sexo') && (
                    <div>
                      <Label htmlFor="sexo" className="text-base font-semibold mb-2 block">
                        Sexo {isFieldRequired('sexo') && <span className="text-destructive">*</span>}
                      </Label>
                      <Select
                        value={formData.sexo}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, sexo: value }));
                          if (errors.sexo) setErrors(prev => ({ ...prev, sexo: "" }));
                        }}
                      >
                        <SelectTrigger className={`h-11 ${errors.sexo ? "border-destructive focus-visible:ring-destructive" : ""}`}>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FEMININO">Feminino</SelectItem>
                          <SelectItem value="MASCULINO">Masculino</SelectItem>
                          <SelectItem value="OUTRO">Outro</SelectItem>
                          <SelectItem value="PREFIRO_NAO_INFORMAR">Prefiro não informar</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.sexo && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.sexo}
                        </p>
                      )}
                    </div>
                    )}

                    {/* Deficiência - Linha 6 - 2 colunas */}
                    {isFieldVisible('deficiencia') && (
                    <div className="md:col-span-2">
                      <Label htmlFor="deficiencia" className="text-base font-semibold mb-2 block">
                        Possui algum tipo de deficiência? {isFieldRequired('deficiencia') && <span className="text-destructive">*</span>}
                      </Label>
                      <Select
                        value={formData.deficiencia}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, deficiencia: value }));
                          if (errors.deficiencia) setErrors(prev => ({ ...prev, deficiencia: "" }));
                        }}
                      >
                        <SelectTrigger className={`h-11 ${errors.deficiencia ? "border-destructive focus-visible:ring-destructive" : ""}`}>
                          <SelectValue placeholder="Selecione a opção" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NAO">Não possuo deficiência</SelectItem>
                          <SelectItem value="AUDITIVA">Deficiência auditiva</SelectItem>
                          <SelectItem value="VISUAL">Deficiência visual</SelectItem>
                          <SelectItem value="FISICA">Deficiência física</SelectItem>
                          <SelectItem value="INTELECTUAL">Deficiência intelectual ou mental</SelectItem>
                          <SelectItem value="MULTIPLA">Deficiência múltipla</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.deficiencia && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.deficiencia}
                        </p>
                      )}
                    </div>
                    )}

                    {/* Nome da Mãe - Linha 7 - 2 colunas */}
                    {isFieldVisible('nome_mae') && (
                    <div className="md:col-span-2">
                      <Label htmlFor="nome_mae" className="text-base font-semibold mb-2 block">
                        Nome da mãe {isFieldRequired('nome_mae') && <span className="text-destructive">*</span>}
                      </Label>
                      <Input
                        id="nome_mae"
                        value={formData.nome_mae}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, nome_mae: e.target.value }));
                          if (errors.nome_mae) setErrors(prev => ({ ...prev, nome_mae: "" }));
                        }}
                        placeholder="Digite o nome completo da mãe"
                        className={`h-11 ${errors.nome_mae ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                      {errors.nome_mae && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.nome_mae}
                        </p>
                      )}
                    </div>
                    )}
                  </div>
                </div>
                )}

                {/* Etapa 2: Endereço */}
                {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-3 duration-500">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Endereço</h3>
                    <span className="text-sm text-muted-foreground">(Opcional)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <Label htmlFor="cep" className="text-base font-semibold mb-2 block">
                        CEP
                      </Label>
                      <div className="relative">
                        <Input
                          id="cep"
                          value={formData.cep}
                          onChange={(e) => handleCEPChange(e.target.value)}
                          placeholder="00000-000"
                          maxLength={9}
                          disabled={isLoadingCEP}
                          className="h-11"
                        />
                        {isLoadingCEP && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="rua" className="text-base font-semibold mb-2 block">
                        Rua
                      </Label>
                      <Input
                        id="rua"
                        value={formData.rua}
                        onChange={(e) => setFormData(prev => ({ ...prev, rua: e.target.value }))}
                        placeholder="Nome da rua"
                        className="h-11"
                      />
                    </div>

                    <div>
                      <Label htmlFor="numero" className="text-base font-semibold mb-2 block">
                        Número
                      </Label>
                      <Input
                        id="numero"
                        value={formData.numero}
                        onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                        placeholder="123"
                        className="h-11"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="complemento" className="text-base font-semibold mb-2 block">
                        Complemento
                      </Label>
                      <Input
                        id="complemento"
                        value={formData.complemento}
                        onChange={(e) => setFormData(prev => ({ ...prev, complemento: e.target.value }))}
                        placeholder="Apto, Bloco, etc."
                        className="h-11"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bairro" className="text-base font-semibold mb-2 block">
                        Bairro
                      </Label>
                      <Input
                        id="bairro"
                        value={formData.bairro}
                        onChange={(e) => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
                        placeholder="Nome do bairro"
                        className="h-11"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cidade" className="text-base font-semibold mb-2 block">
                        Cidade
                      </Label>
                      <Input
                        id="cidade"
                        value={formData.cidade}
                        onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                        placeholder="Nome da cidade"
                        className="h-11"
                      />
                    </div>

                    <div>
                      <Label htmlFor="estado" className="text-base font-semibold mb-2 block">
                        Estado (UF)
                      </Label>
                      <Input
                        id="estado"
                        value={formData.estado}
                        onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value.toUpperCase() }))}
                        placeholder="GO"
                        maxLength={2}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
                )}

                {/* Etapa 3: Responsável Legal */}
                {currentStep === 3 && formData.menor_idade && (
                <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-3 duration-500">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Responsável Legal</h3>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-900 mb-1">
                          Informações do Responsável Legal
                        </p>
                        <p className="text-xs text-amber-700">
                          Como você é menor de idade, precisamos dos dados do seu responsável legal.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="menor_idade" className="text-base font-semibold mb-2 block">
                        É menor de idade? <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.menor_idade ? "sim" : "nao"}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, menor_idade: value === "sim" }));
                        }}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nao">Não</SelectItem>
                          <SelectItem value="sim">Sim</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.menor_idade && (
                      <>
                        <div>
                          <Label htmlFor="nome_responsavel" className="text-base font-semibold mb-2 block">
                            Nome do responsável legal <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="nome_responsavel"
                            value={formData.nome_responsavel}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, nome_responsavel: e.target.value }));
                            }}
                            placeholder="Digite o nome completo do responsável"
                            className="h-11"
                          />
                        </div>

                        <div>
                          <Label htmlFor="cpf_responsavel" className="text-base font-semibold mb-2 block">
                            CPF do responsável legal <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="cpf_responsavel"
                            value={formData.cpf_responsavel}
                            onChange={(e) => {
                              const masked = maskCPF(e.target.value);
                              setFormData(prev => ({ ...prev, cpf_responsavel: masked }));
                            }}
                            placeholder="000.000.000-00"
                            maxLength={14}
                            className="h-11"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                )}

                {/* Etapa 4: Seleção de Curso */}
                {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-3 duration-500">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Inscrição - Cursos</h3>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Obs.</strong> O aluno poderá escolher a 2° opção de curso desde que não seja no mesmo período da 1° opção de curso.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="curso_id" className="text-base font-semibold mb-2 block">
                        1º Opção de Curso <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.curso_id}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, curso_id: value, turno: "" }));
                          if (errors.curso_id) setErrors(prev => ({ ...prev, curso_id: "" }));
                        }}
                        disabled={isLoadingCourses}
                      >
                        <SelectTrigger className={`h-11 ${errors.curso_id ? "border-destructive focus-visible:ring-destructive" : ""}`}>
                          <SelectValue placeholder={isLoadingCourses ? "Carregando cursos..." : "Selecione o curso"} />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={String(course.id)}>
                              {course.nome}
                              {course.carga_horaria && ` (${course.carga_horaria}h)`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.curso_id && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.curso_id}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="turno" className="text-base font-semibold mb-2 block">
                        Turno <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.turno}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, turno: value }));
                          if (errors.turno) setErrors(prev => ({ ...prev, turno: "" }));
                        }}
                        disabled={!formData.curso_id}
                      >
                        <SelectTrigger className={`h-11 ${errors.turno ? "border-destructive focus-visible:ring-destructive" : ""}`}>
                          <SelectValue placeholder="Selecione o turno" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MATUTINO">Matutino (08h30 - 11h30)</SelectItem>
                          <SelectItem value="VESPERTINO">Vespertino (14h - 17h)</SelectItem>
                          <SelectItem value="NOTURNO">Noturno (18h30 - 21h30)</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.turno && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.turno}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="curso_id2" className="text-base font-semibold mb-2 block">
                        2º Opção de Curso
                      </Label>
                      <Select
                        value={formData.curso_id2}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, curso_id2: value, turno2: "" }));
                        }}
                        disabled={isLoadingCourses}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={isLoadingCourses ? "Carregando cursos..." : "Selecione o curso (opcional)"} />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={String(course.id)}>
                              {course.nome}
                              {course.carga_horaria && ` (${course.carga_horaria}h)`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="turno2" className="text-base font-semibold mb-2 block">
                        Turno (2º Opção)
                      </Label>
                      <Select
                        value={formData.turno2}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, turno2: value }));
                        }}
                        disabled={!formData.curso_id2}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione o turno" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MATUTINO">Matutino (08h30 - 11h30)</SelectItem>
                          <SelectItem value="VESPERTINO">Vespertino (14h - 17h)</SelectItem>
                          <SelectItem value="NOTURNO">Noturno (18h30 - 21h30)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="local_curso" className="text-base font-semibold mb-2 block">
                        Aonde você deseja realizar o curso? <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.local_curso}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, local_curso: value }));
                          if (errors.local_curso) setErrors(prev => ({ ...prev, local_curso: "" }));
                        }}
                      >
                        <SelectTrigger className={`h-11 ${errors.local_curso ? "border-destructive focus-visible:ring-destructive" : ""}`}>
                          <SelectValue placeholder="Selecione o local" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SUKATECH_SEDE">SUKATECH SEDE - Escola do Futuro José Luiz Bittencourt, Bairro Floresta, Região Noroeste</SelectItem>
                          <SelectItem value="MAOS_DADAS">Laboratório na ONG de Mãos Dadas J.K - R. JK 13, Setor São Carlos</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.local_curso && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.local_curso}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                )}

                {/* Etapa 5: Questionário Social */}
                {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-3 duration-500">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Questionário Social</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="raca_cor" className="text-base font-semibold mb-2 block">
                        Como você se autodeclara segundo o censo do IBGE? <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.raca_cor}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, raca_cor: value }));
                          if (errors.raca_cor) setErrors(prev => ({ ...prev, raca_cor: "" }));
                        }}
                      >
                        <SelectTrigger className={`h-11 ${errors.raca_cor ? "border-destructive" : ""}`}>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BRANCO">Branco</SelectItem>
                          <SelectItem value="PARDO">Pardo</SelectItem>
                          <SelectItem value="NEGRO">Negro</SelectItem>
                          <SelectItem value="INDIGENA">Indígena</SelectItem>
                          <SelectItem value="AMARELO">Amarelo</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.raca_cor && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.raca_cor}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="renda_mensal" className="text-base font-semibold mb-2 block">
                        Qual a sua renda mensal familiar? <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.renda_mensal}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, renda_mensal: value }));
                          if (errors.renda_mensal) setErrors(prev => ({ ...prev, renda_mensal: "" }));
                        }}
                      >
                        <SelectTrigger className={`h-11 ${errors.renda_mensal ? "border-destructive" : ""}`}>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SEM_RENDA">Não possui renda mensal</SelectItem>
                          <SelectItem value="ATE_MEIO_SM">Recebe até meio salário mínimo</SelectItem>
                          <SelectItem value="ATE_1_SM">Até um salário mínimo</SelectItem>
                          <SelectItem value="1_A_2_SM">De 1 a 2 salários mínimos</SelectItem>
                          <SelectItem value="2_A_3_SM">De 2 a 3 salários mínimos</SelectItem>
                          <SelectItem value="3_A_4_SM">De 3 a 4 salários mínimos</SelectItem>
                          <SelectItem value="ACIMA_5_SM">Acima de 5 salários mínimos</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.renda_mensal && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.renda_mensal}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="pessoas_renda" className="text-base font-semibold mb-2 block">
                        Quantas pessoas vivem da renda familiar? <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.pessoas_renda}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, pessoas_renda: value }));
                          if (errors.pessoas_renda) setErrors(prev => ({ ...prev, pessoas_renda: "" }));
                        }}
                      >
                        <SelectTrigger className={`h-11 ${errors.pessoas_renda ? "border-destructive" : ""}`}>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5_OU_MAIS">5 ou mais</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.pessoas_renda && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.pessoas_renda}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="tipo_residencia" className="text-base font-semibold mb-2 block">
                        A residência em que mora é: <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.tipo_residencia}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, tipo_residencia: value }));
                          if (errors.tipo_residencia) setErrors(prev => ({ ...prev, tipo_residencia: "" }));
                        }}
                      >
                        <SelectTrigger className={`h-11 ${errors.tipo_residencia ? "border-destructive" : ""}`}>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PROPRIA_QUITADA">Própria quitada</SelectItem>
                          <SelectItem value="PROPRIA_FINANCIADA">Própria financiada</SelectItem>
                          <SelectItem value="ALUGADA">Alugada</SelectItem>
                          <SelectItem value="HERDADA">Herdada</SelectItem>
                          <SelectItem value="CEDIDA">Cedida</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.tipo_residencia && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.tipo_residencia}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-base font-semibold mb-2 block">
                        Quais os itens/ bens/ serviços que você tem em sua casa? <span className="text-destructive">*</span>
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {["TV", "CELULAR", "COMPUTADOR", "INTERNET"].map((item) => (
                          <div key={item} className="flex items-center space-x-2">
                            <Checkbox
                              id={`item_${item}`}
                              checked={formData.itens_casa.includes(item)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({ ...prev, itens_casa: [...prev.itens_casa, item] }));
                                } else {
                                  setFormData(prev => ({ ...prev, itens_casa: prev.itens_casa.filter(i => i !== item) }));
                                }
                                if (errors.itens_casa) setErrors(prev => ({ ...prev, itens_casa: "" }));
                              }}
                            />
                            <Label htmlFor={`item_${item}`} className="text-sm font-normal cursor-pointer">
                              {item}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {errors.itens_casa && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.itens_casa}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                )}

                {/* Etapa 6: Programa Goianas na Ciência */}
                {currentStep === 6 && (
                <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-3 duration-500">
                <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Goianas na Ciência e Inovação</h3>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      O Programa Goianas na Ciência e Inovação é uma iniciativa do Governo do Estado de Goiás, através da Secretaria de Estado de Ciência, Tecnologia e Inovação – SECTI e vários parceiros importantes, que busca promover e instituir uma série de projetos para combater as disparidades de gênero no âmbito da Ciência, Tecnologia e Inovação – CT&I. O público-alvo são meninas e mulheres a partir dos 8 anos de idade até aquelas que estejam na pós-graduação. Espera-se atuar na educação, fortalecer projetos de extensão, incentivar mulheres empreendedoras e pesquisadoras da área de ciência, tecnologia e inovação.
                    </p>
                    
                    <div>
                      <Label htmlFor="goianas_ciencia" className="text-base font-semibold mb-2 block">
                        Você deseja fazer parte do Goianas na Ciência? <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.goianas_ciencia}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, goianas_ciencia: value }));
                          if (errors.goianas_ciencia) setErrors(prev => ({ ...prev, goianas_ciencia: "" }));
                        }}
                      >
                        <SelectTrigger className={`h-11 ${errors.goianas_ciencia ? "border-destructive" : ""}`}>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SIM">Sim</SelectItem>
                          <SelectItem value="NAO">Não</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.goianas_ciencia && (
                        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {errors.goianas_ciencia}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                </div>
                )}

                {/* Etapa 7: Anexo de Documentação */}
                {currentStep === 7 && (
                <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-3 duration-500">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Upload className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Anexo de documentação</h3>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <div className="flex gap-3">
                      <Upload className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-900 mb-1">
                          Documentos Obrigatórios
                        </p>
                        <p className="text-xs text-amber-700">
                          Tenha em mãos cópias dos documentos para fazer o upload. Formatos aceitos: PDF, imagem ou documento.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="rg_frente" className="text-base font-semibold mb-2 block">
                        Identidade do aluno (frente) <span className="text-destructive">*</span>
                      </Label>
                      <div className="space-y-2">
                        {!formData.rg_frente ? (
                          <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${errors.rg_frente ? 'border-destructive bg-destructive/5' : 'border-slate-300 hover:border-primary bg-slate-50/50'}`}>
                            <label htmlFor="rg_frente" className="cursor-pointer flex flex-col items-center gap-2">
                              <Upload className={`h-8 w-8 ${errors.rg_frente ? 'text-destructive' : 'text-slate-400'}`} />
                              <span className="text-sm font-medium text-slate-700">
                                Clique para enviar o arquivo
                              </span>
                              <span className="text-xs text-slate-500">PDF, imagem ou documento</span>
                              <Input
                                id="rg_frente"
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setFormData(prev => ({ ...prev, rg_frente: file }));
                                    if (errors.rg_frente) setErrors(prev => ({ ...prev, rg_frente: "" }));
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="border-2 border-blue-300 bg-blue-50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <File className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-blue-900 mb-0.5">Arquivo enviado</p>
                                <p className="text-xs text-blue-700 truncate">{formData.rg_frente.name}</p>
                                <p className="text-xs text-blue-600 mt-1">
                                  {(formData.rg_frente.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600"
                                onClick={() => setFormData(prev => ({ ...prev, rg_frente: null }))}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {errors.rg_frente && (
                          <p className="text-sm text-destructive flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            {errors.rg_frente}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="rg_verso" className="text-base font-semibold mb-2 block">
                        Identidade do aluno (verso) <span className="text-destructive">*</span>
                      </Label>
                      <div className="space-y-2">
                        {!formData.rg_verso ? (
                          <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${errors.rg_verso ? 'border-destructive bg-destructive/5' : 'border-slate-300 hover:border-primary bg-slate-50/50'}`}>
                            <label htmlFor="rg_verso" className="cursor-pointer flex flex-col items-center gap-2">
                              <Upload className={`h-8 w-8 ${errors.rg_verso ? 'text-destructive' : 'text-slate-400'}`} />
                              <span className="text-sm font-medium text-slate-700">
                                Clique para enviar o arquivo
                              </span>
                              <span className="text-xs text-slate-500">PDF, imagem ou documento</span>
                              <Input
                                id="rg_verso"
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setFormData(prev => ({ ...prev, rg_verso: file }));
                                    if (errors.rg_verso) setErrors(prev => ({ ...prev, rg_verso: "" }));
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="border-2 border-blue-300 bg-blue-50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <File className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-blue-900 mb-0.5">Arquivo enviado</p>
                                <p className="text-xs text-blue-700 truncate">{formData.rg_verso.name}</p>
                                <p className="text-xs text-blue-600 mt-1">
                                  {(formData.rg_verso.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600"
                                onClick={() => setFormData(prev => ({ ...prev, rg_verso: null }))}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {errors.rg_verso && (
                          <p className="text-sm text-destructive flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            {errors.rg_verso}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cpf_aluno" className="text-base font-semibold mb-2 block">
                        CPF aluno <span className="text-destructive">*</span>
                      </Label>
                      <div className="space-y-2">
                        {!formData.cpf_aluno ? (
                          <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${errors.cpf_aluno ? 'border-destructive bg-destructive/5' : 'border-slate-300 hover:border-primary bg-slate-50/50'}`}>
                            <label htmlFor="cpf_aluno" className="cursor-pointer flex flex-col items-center gap-2">
                              <Upload className={`h-8 w-8 ${errors.cpf_aluno ? 'text-destructive' : 'text-slate-400'}`} />
                              <span className="text-sm font-medium text-slate-700">
                                Clique para enviar o arquivo
                              </span>
                              <span className="text-xs text-slate-500">PDF, imagem ou documento</span>
                              <Input
                                id="cpf_aluno"
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setFormData(prev => ({ ...prev, cpf_aluno: file }));
                                    if (errors.cpf_aluno) setErrors(prev => ({ ...prev, cpf_aluno: "" }));
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="border-2 border-blue-300 bg-blue-50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <File className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-blue-900 mb-0.5">Arquivo enviado</p>
                                <p className="text-xs text-blue-700 truncate">{formData.cpf_aluno.name}</p>
                                <p className="text-xs text-blue-600 mt-1">
                                  {(formData.cpf_aluno.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600"
                                onClick={() => setFormData(prev => ({ ...prev, cpf_aluno: null }))}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {errors.cpf_aluno && (
                          <p className="text-sm text-destructive flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            {errors.cpf_aluno}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="comprovante_endereco" className="text-base font-semibold mb-2 block">
                        Comprovante de endereço <span className="text-destructive">*</span>
                      </Label>
                      <div className="space-y-2">
                        {!formData.comprovante_endereco ? (
                          <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${errors.comprovante_endereco ? 'border-destructive bg-destructive/5' : 'border-slate-300 hover:border-primary bg-slate-50/50'}`}>
                            <label htmlFor="comprovante_endereco" className="cursor-pointer flex flex-col items-center gap-2">
                              <Upload className={`h-8 w-8 ${errors.comprovante_endereco ? 'text-destructive' : 'text-slate-400'}`} />
                              <span className="text-sm font-medium text-slate-700">
                                Clique para enviar o arquivo
                              </span>
                              <span className="text-xs text-slate-500">PDF, imagem ou documento</span>
                              <Input
                                id="comprovante_endereco"
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setFormData(prev => ({ ...prev, comprovante_endereco: file }));
                                    if (errors.comprovante_endereco) setErrors(prev => ({ ...prev, comprovante_endereco: "" }));
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="border-2 border-blue-300 bg-blue-50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <File className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-blue-900 mb-0.5">Arquivo enviado</p>
                                <p className="text-xs text-blue-700 truncate">{formData.comprovante_endereco.name}</p>
                                <p className="text-xs text-blue-600 mt-1">
                                  {(formData.comprovante_endereco.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600"
                                onClick={() => setFormData(prev => ({ ...prev, comprovante_endereco: null }))}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {errors.comprovante_endereco && (
                          <p className="text-sm text-destructive flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            {errors.comprovante_endereco}
                          </p>
                        )}
                      </div>
                    </div>

                    {formData.menor_idade && (
                      <>
                        <div>
                          <Label htmlFor="identidade_responsavel_frente" className="text-base font-semibold mb-2 block">
                            Identidade do responsável legal (frente) <span className="text-destructive">*</span>
                          </Label>
                          <div className="space-y-2">
                            {!formData.identidade_responsavel_frente ? (
                              <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${errors.identidade_responsavel_frente ? 'border-destructive bg-destructive/5' : 'border-slate-300 hover:border-primary bg-slate-50/50'}`}>
                                <label htmlFor="identidade_responsavel_frente" className="cursor-pointer flex flex-col items-center gap-2">
                                  <Upload className={`h-8 w-8 ${errors.identidade_responsavel_frente ? 'text-destructive' : 'text-slate-400'}`} />
                                  <span className="text-sm font-medium text-slate-700">
                                    Clique para enviar o arquivo
                                  </span>
                                  <span className="text-xs text-slate-500">PDF, imagem ou documento</span>
                                  <Input
                                    id="identidade_responsavel_frente"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setFormData(prev => ({ ...prev, identidade_responsavel_frente: file }));
                                        if (errors.identidade_responsavel_frente) setErrors(prev => ({ ...prev, identidade_responsavel_frente: "" }));
                                      }
                                    }}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            ) : (
                              <div className="border-2 border-blue-300 bg-blue-50 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <File className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-blue-900 mb-0.5">Arquivo enviado</p>
                                    <p className="text-xs text-blue-700 truncate">{formData.identidade_responsavel_frente.name}</p>
                                    <p className="text-xs text-blue-600 mt-1">
                                      {(formData.identidade_responsavel_frente.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600"
                                    onClick={() => setFormData(prev => ({ ...prev, identidade_responsavel_frente: null }))}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                            {errors.identidade_responsavel_frente && (
                              <p className="text-sm text-destructive flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4" />
                                {errors.identidade_responsavel_frente}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="identidade_responsavel_verso" className="text-base font-semibold mb-2 block">
                            Identidade do responsável legal (verso) <span className="text-destructive">*</span>
                          </Label>
                          <div className="space-y-2">
                            {!formData.identidade_responsavel_verso ? (
                              <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${errors.identidade_responsavel_verso ? 'border-destructive bg-destructive/5' : 'border-slate-300 hover:border-primary bg-slate-50/50'}`}>
                                <label htmlFor="identidade_responsavel_verso" className="cursor-pointer flex flex-col items-center gap-2">
                                  <Upload className={`h-8 w-8 ${errors.identidade_responsavel_verso ? 'text-destructive' : 'text-slate-400'}`} />
                                  <span className="text-sm font-medium text-slate-700">
                                    Clique para enviar o arquivo
                                  </span>
                                  <span className="text-xs text-slate-500">PDF, imagem ou documento</span>
                                  <Input
                                    id="identidade_responsavel_verso"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setFormData(prev => ({ ...prev, identidade_responsavel_verso: file }));
                                        if (errors.identidade_responsavel_verso) setErrors(prev => ({ ...prev, identidade_responsavel_verso: "" }));
                                      }
                                    }}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            ) : (
                              <div className="border-2 border-blue-300 bg-blue-50 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <File className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-blue-900 mb-0.5">Arquivo enviado</p>
                                    <p className="text-xs text-blue-700 truncate">{formData.identidade_responsavel_verso.name}</p>
                                    <p className="text-xs text-blue-600 mt-1">
                                      {(formData.identidade_responsavel_verso.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600"
                                    onClick={() => setFormData(prev => ({ ...prev, identidade_responsavel_verso: null }))}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                            {errors.identidade_responsavel_verso && (
                              <p className="text-sm text-destructive flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4" />
                                {errors.identidade_responsavel_verso}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="cpf_responsavel_file" className="text-base font-semibold mb-2 block">
                            CPF do responsável legal
                          </Label>
                          <div className="space-y-2">
                            {!formData.cpf_responsavel_file ? (
                              <div className="border-2 border-dashed rounded-lg p-4 text-center transition-colors border-slate-300 hover:border-primary bg-slate-50/50">
                                <label htmlFor="cpf_responsavel_file" className="cursor-pointer flex flex-col items-center gap-2">
                                  <Upload className="h-8 w-8 text-slate-400" />
                                  <span className="text-sm font-medium text-slate-700">
                                    Clique para enviar o arquivo
                                  </span>
                                  <span className="text-xs text-slate-500">PDF, imagem ou documento</span>
                                  <Input
                                    id="cpf_responsavel_file"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setFormData(prev => ({ ...prev, cpf_responsavel_file: file }));
                                      }
                                    }}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            ) : (
                              <div className="border-2 border-blue-300 bg-blue-50 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <File className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-blue-900 mb-0.5">Arquivo enviado</p>
                                    <p className="text-xs text-blue-700 truncate">{formData.cpf_responsavel_file.name}</p>
                                    <p className="text-xs text-blue-600 mt-1">
                                      {(formData.cpf_responsavel_file.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600"
                                    onClick={() => setFormData(prev => ({ ...prev, cpf_responsavel_file: null }))}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <Label htmlFor="comprovante_escolaridade" className="text-base font-semibold mb-2 block">
                        Comprovante de Escolaridade
                      </Label>
                      <div className="space-y-2">
                        {!formData.comprovante_escolaridade ? (
                          <div className="border-2 border-dashed rounded-lg p-4 text-center transition-colors border-slate-300 hover:border-primary bg-slate-50/50">
                            <label htmlFor="comprovante_escolaridade" className="cursor-pointer flex flex-col items-center gap-2">
                              <Upload className="h-8 w-8 text-slate-400" />
                              <span className="text-sm font-medium text-slate-700">
                                Clique para enviar o arquivo
                              </span>
                              <span className="text-xs text-slate-500">PDF, imagem ou documento</span>
                              <Input
                                id="comprovante_escolaridade"
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setFormData(prev => ({ ...prev, comprovante_escolaridade: file }));
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="border-2 border-blue-300 bg-blue-50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <File className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-blue-900 mb-0.5">Arquivo enviado</p>
                                <p className="text-xs text-blue-700 truncate">{formData.comprovante_escolaridade.name}</p>
                                <p className="text-xs text-blue-600 mt-1">
                                  {(formData.comprovante_escolaridade.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600"
                                onClick={() => setFormData(prev => ({ ...prev, comprovante_escolaridade: null }))}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="foto_3x4" className="text-base font-semibold mb-2 block">
                        Foto 3x4 <span className="text-destructive">*</span>
                      </Label>
                      <div className="space-y-2">
                        {!formData.foto_3x4 ? (
                          <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${errors.foto_3x4 ? 'border-destructive bg-destructive/5' : 'border-slate-300 hover:border-primary bg-slate-50/50'}`}>
                            <label htmlFor="foto_3x4" className="cursor-pointer flex flex-col items-center gap-2">
                              <Upload className={`h-8 w-8 ${errors.foto_3x4 ? 'text-destructive' : 'text-slate-400'}`} />
                              <span className="text-sm font-medium text-slate-700">
                                Clique para enviar o arquivo
                              </span>
                              <span className="text-xs text-slate-500">Imagem JPG ou PNG</span>
                              <Input
                                id="foto_3x4"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setFormData(prev => ({ ...prev, foto_3x4: file }));
                                    if (errors.foto_3x4) setErrors(prev => ({ ...prev, foto_3x4: "" }));
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="border-2 border-blue-300 bg-blue-50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <File className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-blue-900 mb-0.5">Arquivo enviado</p>
                                <p className="text-xs text-blue-700 truncate">{formData.foto_3x4.name}</p>
                                <p className="text-xs text-blue-600 mt-1">
                                  {(formData.foto_3x4.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600"
                                onClick={() => setFormData(prev => ({ ...prev, foto_3x4: null }))}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {errors.foto_3x4 && (
                          <p className="text-sm text-destructive flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            {errors.foto_3x4}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Seção: Mais Informações */}
                  <div className="bg-green-50/50 border border-green-200/50 rounded-lg p-6 mt-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg">
                        <svg 
                          className="w-9 h-9 text-white" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-lg font-bold text-foreground mb-1">
                        Mais Informações
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Entre em contato conosco através do WhatsApp
                      </p>
                      <a 
                        href={`https://wa.me/${formConfig.whatsapp}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-base font-semibold text-[#25D366] hover:text-[#20BA5A] transition-colors"
                      >
                        <svg 
                          className="w-5 h-5" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        {formConfig.whatsapp.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')}
                      </a>
                    </div>
                  </div>
                  </div>
                </div>
                )}

                {/* Botões de Navegação */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      className="h-12 sm:w-auto"
                      size="lg"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 h-12 text-base font-semibold"
                      size="lg"
                    >
                      Próxima Etapa
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => handleSubmit()}
                      disabled={isLoading || isSuccess}
                      className="flex-1 h-12 text-base font-semibold"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Enviar Inscrição
                        </>
                      )}
                    </Button>
                  )}

                  {currentStep === 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/")}
                      className="h-12"
                      size="lg"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </div>

                <p className="text-sm text-muted-foreground text-center pt-4">
                  <span className="text-destructive">*</span> Campos obrigatórios
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
};

export default Inscricao;
