import { useState, useEffect, useCallback } from "react";
import {
  Search, Users, Clock, CheckCircle, XCircle, Eye,
  FileText, Calendar, Mail, Phone, MapPin, GraduationCap, BookOpen,
  Edit, Save, X, Download, User, Home, Heart, Building, DollarSign,
  Settings, Plus, Trash2, ToggleLeft, ToggleRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CandidatesAPI, CoursesAPI, ClassesAPI, StudentsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useFormConfig } from "@/contexts/useFormConfig";
import { isAxiosError } from "axios";
import { getApiErrorMessage } from "@/lib/apiErrors";

/**
 * Campos que SEMPRE devem ser obrigatórios
 * Estes campos não podem ser desmarcados como obrigatórios
 * porque a API e o banco de dados exigem esses dados
 */
const ALWAYS_REQUIRED_FIELDS = [
  'nome',           // API: .min(3)
  'cpf',            // API: .regex(/^\d{11}$/)
  'email',          // API: .email()
  'telefone',       // API: .min(10)
  'data_nascimento', // API: .regex(/^\d{4}-\d{2}-\d{2}$/)
  'curso_id',       // API: obrigatório
  'turno',          // API: obrigatório
];

interface Candidate {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  data_nascimento?: string;
  status: string;

  // Dados pessoais adicionais
  rg?: string;
  sexo?: string;
  deficiencia?: string;
  telefone2?: string;
  idade?: number;
  nome_mae?: string;

  // Endereço
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;

  // Curso
  curso_id?: number;
  turno?: string;
  curso_id2?: number;
  turno2?: string;
  local_curso?: string;
  turma?: { nome?: string };

  // Questionário Social
  raca_cor?: string;
  renda_mensal?: string;
  pessoas_renda?: string;
  tipo_residencia?: string;
  itens_casa?: string;

  // Programa Goianas
  goianas_ciencia?: string;

  // Responsável Legal
  menor_idade?: boolean;
  nome_responsavel?: string;
  cpf_responsavel?: string;

  // Documentos
  rg_frente_url?: string;
  rg_verso_url?: string;
  cpf_aluno_url?: string;
  comprovante_endereco_url?: string;
  identidade_responsavel_frente_url?: string;
  identidade_responsavel_verso_url?: string;
  cpf_responsavel_url?: string;
  comprovante_escolaridade_url?: string;
  foto_3x4_url?: string;

  createdAt: string;
  updatedAt?: string;
  curso?: {
    id: number;
    nome: string;
  };
}

interface Course {
  id: number;
  nome: string;
  descricao?: string;
  carga_horaria?: number;
  nivel?: string;
  status?: 'ATIVO' | 'INATIVO' | 'EM_DESENVOLVIMENTO';
}

// URL base para documentos (remove /api do final)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const DOCUMENT_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

const ProcessoSeletivo = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { config, updateConfig } = useFormConfig();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCandidate, setEditedCandidate] = useState<Candidate | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para informações de turma e vagas
  const [turmaInfo, setTurmaInfo] = useState<{
    opcao1?: { curso: string; turma: string; vagas: number; total: number } | null;
    opcao2?: { curso: string; turma: string; vagas: number; total: number } | null;
  }>({});

  // Estados para configuração do formulário
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [tempConfig, setTempConfig] = useState(config);

  // Estados para adicionar curso
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    nome: "",
    descricao: "",
    carga_horaria: "",
    nivel: "INTERMEDIARIO" as "INICIANTE" | "INTERMEDIARIO" | "AVANCADO"
  });
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Carregar candidatos
  useEffect(() => {
    loadCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar se há token antes de fazer a requisição
      const token = localStorage.getItem("@sukatech:token");
      if (!token) {
        setError("Você precisa estar logado para visualizar os candidatos. Faça login primeiro.");
        setIsAuthError(true);
        setLoading(false);
        return;
      }
      setIsAuthError(false);

      const params: { status?: string } = {};
      if (statusFilter !== "all") {
        params.status = statusFilter;
      } else {
        // Quando "all", excluir aprovados (que já viraram alunos)
        params.status = "PENDENTE,REPROVADO,LISTA_ESPERA";
      }
      const response = await CandidatesAPI.list(params);

      // A API retorna { data: Candidate[], pagination: {...} }
      let candidatesData: Candidate[] = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          // Se for array direto
          candidatesData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Se for objeto com propriedade data
          candidatesData = response.data.data;
        } else if (response.data.candidates && Array.isArray(response.data.candidates)) {
          // Se for objeto com propriedade candidates
          candidatesData = response.data.candidates;
        }
      }

      setCandidates(candidatesData || []);
    } catch (error: unknown) {
      console.error("Erro ao carregar candidatos:", error);

      let errorMessage = "Não foi possível carregar os candidatos. Tente novamente mais tarde.";

      if (isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          errorMessage = "Sua sessão expirou. Por favor, faça login novamente.";
          setIsAuthError(true);
        } else {
          setIsAuthError(false);
          errorMessage = error.response.data?.error ||
            error.response.data?.message ||
            errorMessage;
        }
      } else {
        setIsAuthError(false);
        errorMessage = getApiErrorMessage(error, errorMessage);
      }

      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      // Garantir que sempre temos um array, mesmo em caso de erro
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar candidatos
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch =
      candidate.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.cpf.includes(searchTerm) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      candidate.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  // Cálculos de paginação
  const totalItems = filteredCandidates.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

  // Funções de paginação
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Status visual
  const getStatusIcon = (status: string) => {
    if (!status) {
      return <Clock className="h-4 w-4 text-gray-500" />;
    }
    switch (status.toUpperCase()) {
      case 'APROVADO':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'REPROVADO':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'PENDENTE':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'LISTA_ESPERA':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    if (!status) {
      return <Badge className="bg-gray-100 text-gray-700">Desconhecido</Badge>;
    }
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case 'APROVADO':
        return <Badge className="bg-emerald-100 text-emerald-700">Aprovado</Badge>;
      case 'REPROVADO':
        return <Badge className="bg-red-100 text-red-700">Reprovado</Badge>;
      case 'PENDENTE':
        return <Badge className="bg-amber-100 text-amber-700">Pendente</Badge>;
      case 'LISTA_ESPERA':
        return <Badge className="bg-orange-100 text-orange-700">Lista de Espera</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Formatar CPF
  const formatCPF = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
  };

  // Formatar telefone
  const formatPhone = (phone?: string) => {
    if (!phone) return '-';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  // Formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  // Ver detalhes do candidato
  const handleViewDetails = async (candidate: Candidate) => {
    try {
      // Fazer fetch completo do candidato para garantir todos os campos
      const response = await CandidatesAPI.findById(candidate.id);
      const fullCandidate = response.data; // Extrair o objeto candidato da resposta
      setSelectedCandidate(fullCandidate);
      setEditedCandidate(fullCandidate);
      setIsEditing(false);
      setIsModalOpen(true);

      // Buscar informações das turmas
      await loadTurmaInfo(fullCandidate);
    } catch (error) {
      console.error('Erro ao carregar detalhes do candidato:', error);
      // Fallback para o candidato da lista se a requisição falhar
      setSelectedCandidate(candidate);
      setEditedCandidate(candidate);
      setIsEditing(false);
      setIsModalOpen(true);
      await loadTurmaInfo(candidate);
    }
  };

  // Buscar informações da turma e vagas disponíveis
  type TurmaOptionInfo = {
    id: number;
    curso: string;
    turma: string;
    vagas: number;
    total: number;
  };

  type TurmaInfo = Partial<{
    opcao1: TurmaOptionInfo;
    opcao2: TurmaOptionInfo;
  }>;

  const loadTurmaInfo = async (candidate: Candidate) => {
    try {
      const turnoMap: Record<string, string> = {
        'MATUTINO': 'MANHA',
        'VESPERTINO': 'TARDE',
        'NOTURNO': 'NOITE',
        'MANHA': 'MANHA',
        'TARDE': 'TARDE',
        'NOITE': 'NOITE'
      };

      const info: TurmaInfo = {};

      // Buscar turma da 1ª opção
      if (candidate.curso_id && candidate.turno) {
        const turno1 = turnoMap[candidate.turno.toUpperCase()] || candidate.turno;
        console.log('📚 Buscando turma 1 - Curso:', candidate.curso_id, 'Turno:', turno1);

        const response1 = await ClassesAPI.findByCourseAndShift(candidate.curso_id, turno1);
        console.log('📦 Response turma 1:', response1.data);

        // A estrutura é: { data: [...turmas], pagination: {...} }
        const turmas1 = response1.data?.data || [];

        if (turmas1.length > 0) {
          const turma = turmas1[0];
          console.log('✅ Turma 1 encontrada:', turma);

          // Contar alunos matriculados
          const studentsResponse = await StudentsAPI.list({ turma_id: turma.id });
          console.log('👥 Alunos na turma 1:', studentsResponse.data);

          const alunosData = studentsResponse.data?.data || [];
          const alunosCount = alunosData.length;

          info.opcao1 = {
            id: turma.id,
            curso: turma.curso?.nome || candidate.curso?.nome || 'Curso não identificado',
            turma: turma.nome,
            vagas: turma.vagas - alunosCount,
            total: turma.vagas
          };
          console.log('✅ Info opcao1:', info.opcao1);
        } else {
          console.log('⚠️ Turma 1 não encontrada');
        }
      }

      // Buscar turma da 2ª opção
      if (candidate.curso_id2 && candidate.turno2) {
        const turno2 = turnoMap[candidate.turno2.toUpperCase()] || candidate.turno2;
        console.log('📚 Buscando turma 2 - Curso:', candidate.curso_id2, 'Turno:', turno2);

        const response2 = await ClassesAPI.findByCourseAndShift(candidate.curso_id2, turno2);
        console.log('📦 Response turma 2:', response2.data);

        // A estrutura é: { data: [...turmas], pagination: {...} }
        const turmas2 = response2.data?.data || [];

        if (turmas2.length > 0) {
          const turma = turmas2[0];
          console.log('✅ Turma 2 encontrada:', turma);

          // Contar alunos matriculados
          const studentsResponse = await StudentsAPI.list({ turma_id: turma.id });
          console.log('👥 Alunos na turma 2:', studentsResponse.data);

          const alunosData = studentsResponse.data?.data || [];
          const alunosCount = alunosData.length;

          info.opcao2 = {
            id: turma.id,
            curso: turma.curso?.nome || 'Curso não identificado',
            turma: turma.nome,
            vagas: turma.vagas - alunosCount,
            total: turma.vagas
          };
          console.log('✅ Info opcao2:', info.opcao2);
        } else {
          console.log('⚠️ Turma 2 não encontrada');
        }
      }

      console.log('🎯 Informações finais das turmas:', info);
      setTurmaInfo(info);
    } catch (error) {
      console.error('❌ Erro ao buscar informações da turma:', error);
      setTurmaInfo({});
    }
  };

  // Iniciar edição
  const handleStartEdit = async () => {
    // Recarregar dados do servidor para garantir que temos os dados mais recentes
    if (selectedCandidate) {
      try {
        const refreshResponse = await CandidatesAPI.findById(selectedCandidate.id);
        const refreshedCandidate = refreshResponse.data;
        setSelectedCandidate(refreshedCandidate);
        setEditedCandidate(refreshedCandidate);
      } catch (error) {
        console.error('Erro ao recarregar candidato:', error);
        // Fallback: usar dados existentes
        setEditedCandidate(selectedCandidate);
      }
    }
    setIsEditing(true);
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditedCandidate(selectedCandidate);
    setIsEditing(false);
  };

  // Salvar edições
  const handleSaveEdit = async () => {
    if (!editedCandidate) return;

    setIsSaving(true);
    try {
      console.log('💾 Salvando candidato:', {
        id: editedCandidate.id,
        nome: editedCandidate.nome,
        curso_id: editedCandidate.curso_id,
        turno: editedCandidate.turno,
        curso_id2: editedCandidate.curso_id2,
        turno2: editedCandidate.turno2,
      });

      await CandidatesAPI.update(editedCandidate.id, editedCandidate);

      toast({
        title: "Sucesso",
        description: "Dados do candidato atualizados com sucesso!",
        className: "bg-emerald-100 text-emerald-800",
      });

      // Recarregar o candidato completo do servidor para garantir sincronização
      const refreshResponse = await CandidatesAPI.findById(editedCandidate.id);
      const refreshedCandidate = refreshResponse.data;

      // Atualizar lista de candidatos com dados atualizados
      setCandidates(prev =>
        prev.map(c => c.id === refreshedCandidate.id ? refreshedCandidate : c)
      );

      setSelectedCandidate(refreshedCandidate);
      setEditedCandidate(refreshedCandidate);
      setIsEditing(false);
    } catch (error: unknown) {
      console.error("Erro ao atualizar candidato:", error);
      toast({
        title: "Erro",
        description: getApiErrorMessage(error, "Não foi possível atualizar os dados. Tente novamente."),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Atualizar status rapidamente
  const handleQuickStatusChange = async (candidateId: number, newStatus: string) => {
    try {
      await CandidatesAPI.update(candidateId, { status: newStatus });

      toast({
        title: "Status atualizado",
        description: `Status alterado para: ${newStatus}`,
        className: "bg-blue-100 text-blue-800",
      });

      // Atualizar lista
      setCandidates(prev =>
        prev.map(c => c.id === candidateId ? { ...c, status: newStatus } : c)
      );

      // Atualizar candidato selecionado se for o mesmo
      if (selectedCandidate?.id === candidateId) {
        setSelectedCandidate(prev => prev ? { ...prev, status: newStatus } : null);
        setEditedCandidate(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  // Deletar candidato
  const handleDeleteCandidate = async () => {
    if (!selectedCandidate) return;

    const confirmDelete = confirm(
      `Tem certeza que deseja deletar o candidato "${selectedCandidate.nome}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmDelete) return;

    setIsSaving(true);
    try {
      await CandidatesAPI.delete(selectedCandidate.id);

      toast({
        title: "Candidato deletado",
        description: `${selectedCandidate.nome} foi removido com sucesso.`,
        className: "bg-red-100 text-red-800",
      });

      // Remover da lista
      setCandidates(prev => prev.filter(c => c.id !== selectedCandidate.id));

      // Fechar modal
      setIsModalOpen(false);
      setSelectedCandidate(null);
      setEditedCandidate(null);
    } catch (error: unknown) {
      console.error("Erro ao deletar candidato:", error);
      toast({
        title: "Erro",
        description: getApiErrorMessage(error, "Não foi possível deletar o candidato."),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Aprovar candidato com escolha de curso
  const handleApproveWithCourse = async (candidateId: number, opcaoCurso: 1 | 2) => {
    try {
      // Obter o turma_id baseado na opção de curso
      const turmaInfo_data = opcaoCurso === 1 ? turmaInfo.opcao1 : turmaInfo.opcao2;
      const turma_id = turmaInfo_data?.id;

      if (!turma_id) {
        toast({
          title: "Erro",
          description: "Turma não identificada. Por favor, tente novamente.",
          variant: "destructive",
        });
        return;
      }

      // Aprovar o candidato no sistema de seleção
      // O backend vai criar o aluno automaticamente
      const response = await CandidatesAPI.approve(candidateId, opcaoCurso, turma_id);

      toast({
        title: "Candidato aprovado e matriculado!",
        description: `${opcaoCurso === 1 ? '1ª opção' : '2ª opção'} foi aprovada. Aluno criado com sucesso!`,
        className: "bg-emerald-100 text-emerald-800",
      });

      // Atualizar lista de candidatos (para remover da view)
      await loadCandidates();

      // Fechar modal
      setIsModalOpen(false);
      setSelectedCandidate(null);
      setEditedCandidate(null);
    } catch (error: unknown) {
      console.error("Erro ao aprovar candidato:", error);
      toast({
        title: "Erro",
        description: getApiErrorMessage(error, "Não foi possível aprovar o candidato."),
        variant: "destructive",
      });
    }
  };

  // Carregar cursos
  const loadCourses = useCallback(async () => {
    setIsLoadingCourses(true);
    try {
      console.log('🔄 Carregando cursos...');
      const response = await CoursesAPI.list();
      console.log('📦 Response completa:', response);
      console.log('📦 Response.data:', response.data);

      // Extrair cursos considerando estrutura de paginação
      let coursesData = [];

      if (response.data?.data?.data) {
        // Estrutura com paginação: { success: true, data: { data: [...], pagination: {...} } }
        coursesData = response.data.data.data;
        console.log('📚 Cursos (com paginação):', coursesData);
      } else if (response.data?.data) {
        // Estrutura simples: { success: true, data: [...] }
        coursesData = response.data.data;
        console.log('📚 Cursos (direto):', coursesData);
      } else if (Array.isArray(response.data)) {
        coursesData = response.data;
        console.log('📚 Cursos (array direto):', coursesData);
      }

      setCourses(Array.isArray(coursesData) ? coursesData : []);
      console.log('✅ Cursos definidos no estado:', coursesData.length, 'cursos');
    } catch (error) {
      console.error("❌ Erro ao carregar cursos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os cursos.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCourses(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isConfigModalOpen) {
      loadCourses();
    }
  }, [isConfigModalOpen, loadCourses]);

  // Carregar cursos também quando abre o modal de detalhes do candidato
  useEffect(() => {
    if (isModalOpen && courses.length === 0) {
      loadCourses();
    }
  }, [isModalOpen, courses.length, loadCourses]);

  // Função helper para obter nome do curso pelo ID
  const getCourseName = (courseId?: number | null) => {
    if (!courseId) return null;
    const course = courses.find(c => c.id === courseId);
    return course?.nome || null;
  };

  // Alternar status ativo/inativo do curso
  const handleToggleCourseStatus = async (courseId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ATIVO' ? 'INATIVO' : 'ATIVO';
      await CoursesAPI.update(courseId, { status: newStatus });

      toast({
        title: "Curso atualizado",
        description: `Curso ${newStatus === 'ATIVO' ? 'ativado' : 'desativado'} para inscrições.`,
        className: "bg-emerald-100 text-emerald-800",
      });

      // Recarregar cursos
      loadCourses();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o curso.",
        variant: "destructive",
      });
    }
  };

  // Criar novo curso
  const handleCreateCourse = async () => {
    if (!newCourse.nome || !newCourse.carga_horaria) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e a carga horária do curso.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingCourse(true);
    try {
      console.log('🆕 Criando curso:', {
        nome: newCourse.nome,
        descricao: newCourse.descricao,
        carga_horaria: parseInt(newCourse.carga_horaria),
        nivel: newCourse.nivel,
        status: 'ATIVO'
      });

      const response = await CoursesAPI.create({
        nome: newCourse.nome,
        descricao: newCourse.descricao,
        carga_horaria: parseInt(newCourse.carga_horaria),
        nivel: newCourse.nivel,
        status: 'ATIVO' // Criar como ativo por padrão
      });

      console.log('✅ Curso criado com sucesso:', response.data);

      toast({
        title: "Curso criado",
        description: `O curso "${newCourse.nome}" foi criado com sucesso e está ativo.`,
        className: "bg-emerald-100 text-emerald-800",
      });

      // Limpar formulário e fechar dialog
      setNewCourse({
        nome: "",
        descricao: "",
        carga_horaria: "",
        nivel: "INTERMEDIARIO"
      });
      setIsAddCourseDialogOpen(false);

      // Recarregar cursos
      console.log('🔄 Recarregando lista de cursos...');
      await loadCourses();
    } catch (error: unknown) {
      console.error('❌ Erro ao criar curso:', error);
      toast({
        title: "Erro ao criar curso",
        description: getApiErrorMessage(error, "Não foi possível criar o curso."),
        variant: "destructive",
      });
    } finally {
      setIsCreatingCourse(false);
    }
  };

  // Estatísticas
  const stats = {
    total: candidates.length,
    pendente: candidates.filter(c => c.status.toUpperCase() === 'PENDENTE').length,
    lista_espera: candidates.filter(c => c.status.toUpperCase() === 'LISTA_ESPERA').length,
    reprovado: candidates.filter(c => c.status.toUpperCase() === 'REPROVADO').length,
  };

  return (
    <div className="space-y-6 min-h-screen">
      {/* Header */}
      <div className="p-6 rounded-lg bg-white border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-foreground">
              <FileText className="h-8 w-8 text-primary" />
              Processo Seletivo
            </h1>
            <p className="text-muted-foreground mt-1">Visualize e gerencie as inscrições dos candidatos</p>
          </div>
          <Button
            onClick={() => setIsConfigModalOpen(true)}
            className="gap-2"
            variant="outline"
          >
            <Settings className="h-4 w-4" />
            Configurar Formulário de Inscrição
          </Button>
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700 mb-3">
              <XCircle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </div>
            <div className="flex gap-2">
              {isAuthError ? (
                <Button
                  onClick={() => navigate("/login")}
                  variant="default"
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  Ir para Login
                </Button>
              ) : (
                <Button
                  onClick={loadCandidates}
                  variant="outline"
                  size="sm"
                >
                  Tentar novamente
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total de Inscrições</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.pendente}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.lista_espera}</p>
                <p className="text-sm text-muted-foreground">Lista de Espera</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.reprovado}</p>
                <p className="text-sm text-muted-foreground">Reprovados</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidates List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Candidatos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por Nome, CPF ou Email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-12"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-full md:w-[200px] h-12">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="PENDENTE">Pendente</SelectItem>
                <SelectItem value="REPROVADO">Reprovado</SelectItem>
                <SelectItem value="LISTA_ESPERA">Lista de Espera</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando candidatos...</p>
            </div>
          ) : currentCandidates.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum candidato encontrado</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentCandidates.map((candidate) => (
                      <TableRow key={candidate.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{candidate.nome}</TableCell>
                        <TableCell>{formatCPF(candidate.cpf)}</TableCell>
                        <TableCell>{candidate.email}</TableCell>
                        <TableCell>{formatPhone(candidate.telefone)}</TableCell>
                        <TableCell>
                          <Select
                            value={candidate.status}
                            onValueChange={(value) => handleQuickStatusChange(candidate.id, value)}
                          >
                            <SelectTrigger className="w-[140px] h-9">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(candidate.status)}
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDENTE">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-amber-600" />
                                  Pendente
                                </div>
                              </SelectItem>
                              <SelectItem value="REPROVADO">
                                <div className="flex items-center gap-2">
                                  <XCircle className="h-4 w-4 text-red-600" />
                                  Reprovado
                                </div>
                              </SelectItem>
                              <SelectItem value="LISTA_ESPERA">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-blue-600" />
                                  Lista de Espera
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(candidate)}
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                              title="Ver detalhes completos"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedCandidate(candidate);
                                setEditedCandidate(candidate);
                                setIsEditing(true);
                                setIsModalOpen(true);
                              }}
                              className="h-8 w-8 p-0 hover:bg-amber-50 hover:text-amber-600"
                              title="Editar candidato"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                const confirmDelete = confirm(
                                  `Tem certeza que deseja deletar o candidato "${candidate.nome}"? Esta ação não pode ser desfeita.`
                                );
                                if (confirmDelete) {
                                  try {
                                    await CandidatesAPI.delete(candidate.id);
                                    setCandidates(prev => prev.filter(c => c.id !== candidate.id));
                                    toast({
                                      title: "Candidato deletado",
                                      description: `${candidate.nome} foi removido com sucesso.`,
                                      className: "bg-red-100 text-red-800",
                                    });
                                  } catch (error) {
                                    toast({
                                      title: "Erro",
                                      description: "Não foi possível deletar o candidato.",
                                      variant: "destructive",
                                    });
                                  }
                                }
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                              title="Deletar candidato"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Mostrar</span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[70px] h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">por página</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} candidatos
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes Completos */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) {
          setIsEditing(false);
          setEditedCandidate(null);
        }
      }}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">
                  {isEditing ? 'Editar Candidato' : 'Detalhes do Candidato'}
                </DialogTitle>
                <DialogDescription>
                  {isEditing ? 'Modifique os campos necessários e salve' : 'Visualização completa dos dados da inscrição'}
                </DialogDescription>
              </div>
              {!isEditing && selectedCandidate && (
                <Button
                  onClick={handleStartEdit}
                  className="gap-2"
                  size="sm"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
              )}
            </div>
          </DialogHeader>
          {(isEditing ? editedCandidate : selectedCandidate) && (
            <div className="space-y-6">
              {/* Dados Pessoais Expandidos */}
              <Card className="border-primary/20">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Dados Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nome */}
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Nome Completo</p>
                      {isEditing ? (
                        <Input
                          value={editedCandidate?.nome || ''}
                          onChange={(e) => setEditedCandidate(prev => prev ? { ...prev, nome: e.target.value } : null)}
                          className="h-9"
                        />
                      ) : (
                        <p className="font-medium">{selectedCandidate?.nome}</p>
                      )}
                    </div>

                    {/* CPF e RG */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">CPF</p>
                      <p className="font-medium">{formatCPF(selectedCandidate?.cpf || '')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">RG</p>
                      {isEditing ? (
                        <Input
                          value={editedCandidate?.rg || ''}
                          onChange={(e) => setEditedCandidate(prev => prev ? { ...prev, rg: e.target.value } : null)}
                          className="h-9"
                        />
                      ) : (
                        <p className="font-medium">{selectedCandidate?.rg || '-'}</p>
                      )}
                    </div>

                    {/* Data Nascimento e Idade */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Data de Nascimento</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(selectedCandidate?.data_nascimento)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Idade</p>
                      <p className="font-medium">{selectedCandidate?.idade || '-'} anos</p>
                    </div>

                    {/* Email e Telefone */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedCandidate?.email || ''}
                          onChange={(e) => setEditedCandidate(prev => prev ? { ...prev, email: e.target.value } : null)}
                          className="h-9"
                        />
                      ) : (
                        <p className="font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {selectedCandidate?.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Telefone</p>
                      {isEditing ? (
                        <Input
                          value={editedCandidate?.telefone || ''}
                          onChange={(e) => setEditedCandidate(prev => prev ? { ...prev, telefone: e.target.value } : null)}
                          className="h-9"
                        />
                      ) : (
                        <p className="font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {formatPhone(selectedCandidate?.telefone)}
                        </p>
                      )}
                    </div>

                    {/* Telefone 2 e Sexo */}
                    {(selectedCandidate?.telefone2 || isEditing) && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Telefone 2</p>
                        {isEditing ? (
                          <Input
                            value={editedCandidate?.telefone2 || ''}
                            onChange={(e) => setEditedCandidate(prev => prev ? { ...prev, telefone2: e.target.value } : null)}
                            className="h-9"
                          />
                        ) : (
                          <p className="font-medium">{formatPhone(selectedCandidate?.telefone2)}</p>
                        )}
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Sexo</p>
                      {isEditing ? (
                        <Select
                          value={editedCandidate?.sexo || ''}
                          onValueChange={(value) => setEditedCandidate(prev => prev ? { ...prev, sexo: value } : null)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FEMININO">Feminino</SelectItem>
                            <SelectItem value="MASCULINO">Masculino</SelectItem>
                            <SelectItem value="OUTRO">Outro</SelectItem>
                            <SelectItem value="PREFIRO_NAO_INFORMAR">Prefiro não informar</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">{selectedCandidate?.sexo || '-'}</p>
                      )}
                    </div>

                    {/* Deficiência */}
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Deficiência</p>
                      {isEditing ? (
                        <Select
                          value={editedCandidate?.deficiencia || ''}
                          onValueChange={(value) => setEditedCandidate(prev => prev ? { ...prev, deficiencia: value } : null)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NAO">Não possuo deficiência</SelectItem>
                            <SelectItem value="AUDITIVA">Deficiência auditiva</SelectItem>
                            <SelectItem value="VISUAL">Deficiência visual</SelectItem>
                            <SelectItem value="FISICA">Deficiência física</SelectItem>
                            <SelectItem value="INTELECTUAL">Deficiência intelectual</SelectItem>
                            <SelectItem value="MULTIPLA">Deficiência múltipla</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">{selectedCandidate?.deficiencia || '-'}</p>
                      )}
                    </div>

                    {/* Nome da Mãe */}
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Nome da Mãe</p>
                      {isEditing ? (
                        <Input
                          value={editedCandidate?.nome_mae || ''}
                          onChange={(e) => setEditedCandidate(prev => prev ? { ...prev, nome_mae: e.target.value } : null)}
                          className="h-9"
                        />
                      ) : (
                        <p className="font-medium">{selectedCandidate?.nome_mae || '-'}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Endereço */}
              <Card className="border-primary/20">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">CEP</p>
                      <p className="font-medium">{selectedCandidate?.cep || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Número</p>
                      <p className="font-medium">{selectedCandidate?.numero || '-'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Rua</p>
                      <p className="font-medium">{selectedCandidate?.rua || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bairro</p>
                      <p className="font-medium">{selectedCandidate?.bairro || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Cidade/UF</p>
                      <p className="font-medium">{selectedCandidate?.cidade && selectedCandidate?.estado ? `${selectedCandidate.cidade} - ${selectedCandidate.estado}` : selectedCandidate?.cidade || '-'}</p>
                    </div>
                    {selectedCandidate?.complemento && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground mb-1">Complemento</p>
                        <p className="font-medium">{selectedCandidate.complemento}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Curso e Turno */}
              <Card className="border-primary/20">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Cursos Escolhidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1ª Opção */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">1ª Opção de Curso</p>
                      {isEditing ? (
                        <Select
                          value={editedCandidate?.curso_id?.toString() || ''}
                          onValueChange={(value) => setEditedCandidate(prev => prev ? { ...prev, curso_id: value ? parseInt(value) : null } : null)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Selecione um curso" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id.toString()}>
                                {course.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">
                          {selectedCandidate?.curso?.nome ||
                            getCourseName(selectedCandidate?.curso_id) ||
                            (selectedCandidate?.curso_id ? `Curso ID: ${selectedCandidate.curso_id}` : '-')}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Turno (1ª opção)</p>
                      {isEditing ? (
                        <Select
                          value={editedCandidate?.turno || ''}
                          onValueChange={(value) => setEditedCandidate(prev => prev ? { ...prev, turno: value || null } : null)}
                          disabled={!editedCandidate?.curso_id}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Selecione um turno" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MATUTINO">Matutino</SelectItem>
                            <SelectItem value="VESPERTINO">Vespertino</SelectItem>
                            <SelectItem value="NOTURNO">Noturno</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">{selectedCandidate?.turno || '-'}</p>
                      )}
                    </div>

                    {/* 2ª Opção - sempre visível em modo edição */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">2ª Opção de Curso</p>
                      {isEditing ? (
                        <Select
                          value={editedCandidate?.curso_id2?.toString() || ''}
                          onValueChange={(value) => setEditedCandidate(prev => prev ? { ...prev, curso_id2: value ? parseInt(value) : null } : null)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Selecione um curso (opcional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id.toString()}>
                                {course.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">
                          {selectedCandidate?.curso2?.nome ||
                            getCourseName(selectedCandidate?.curso_id2) ||
                            (selectedCandidate?.curso_id2 ? `Curso ID: ${selectedCandidate.curso_id2}` : '-')}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Turno (2ª opção)</p>
                      {isEditing ? (
                        <Select
                          value={editedCandidate?.turno2 || ''}
                          onValueChange={(value) => setEditedCandidate(prev => prev ? { ...prev, turno2: value || null } : null)}
                          disabled={!editedCandidate?.curso_id2}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Selecione um turno" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MATUTINO">Matutino</SelectItem>
                            <SelectItem value="VESPERTINO">Vespertino</SelectItem>
                            <SelectItem value="NOTURNO">Noturno</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">{selectedCandidate?.turno2 || '-'}</p>
                      )}
                    </div>

                    {selectedCandidate?.local_curso && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground mb-1">Local desejado</p>
                        <p className="font-medium text-sm">
                          {selectedCandidate.local_curso === 'SUKATECH_SEDE'
                            ? 'SUKATECH SEDE - Escola do Futuro José Luiz Bittencourt'
                            : 'Laboratório na ONG de Mãos Dadas J.K'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Botões de Aprovação - Escolha de Curso */}
              {!isEditing && selectedCandidate && selectedCandidate.status !== 'aprovado' && (
                <Card className="border-emerald-200 bg-emerald-50/50">
                  <CardHeader className="bg-emerald-100/50">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      Aprovar Candidato
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Escolha para qual curso deseja aprovar este candidato:
                    </p>
                    <div className="space-y-3">
                      {/* 1ª Opção */}
                      <div className="p-4 border-2 border-emerald-200 rounded-lg bg-white hover:border-emerald-400 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-emerald-900">
                              1ª Opção: {turmaInfo.opcao1?.curso || selectedCandidate?.curso?.nome ||
                                getCourseName(selectedCandidate?.curso_id) ||
                                (selectedCandidate?.curso_id ? `Curso ID: ${selectedCandidate.curso_id}` : '-')}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Turno: {selectedCandidate?.turno || '-'}
                            </p>
                            {turmaInfo.opcao1 && (
                              <div className="mt-2 space-y-1">
                                <p className="text-sm font-medium text-blue-700">
                                  📚 Turma: {turmaInfo.opcao1.turma}
                                </p>
                                <p className={`text-sm font-bold ${turmaInfo.opcao1.vagas > 0 ? 'text-emerald-600' : 'text-red-600'
                                  }`}>
                                  {turmaInfo.opcao1.vagas > 0 ? '✅' : '❌'} Vagas disponíveis: {turmaInfo.opcao1.vagas} de {turmaInfo.opcao1.total}
                                </p>
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => handleApproveWithCourse(selectedCandidate.id, 1)}
                            className="bg-emerald-600 hover:bg-emerald-700 ml-4"
                            size="sm"
                            disabled={turmaInfo.opcao1 && turmaInfo.opcao1.vagas <= 0}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aprovar 1ª Opção
                          </Button>
                        </div>
                      </div>

                      {/* 2ª Opção (se existir) */}
                      {selectedCandidate?.curso_id2 && (
                        <div className="p-4 border-2 border-emerald-200 rounded-lg bg-white hover:border-emerald-400 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-emerald-900">
                                2ª Opção: {turmaInfo.opcao2?.curso || selectedCandidate?.curso2?.nome ||
                                  getCourseName(selectedCandidate?.curso_id2) ||
                                  (selectedCandidate?.curso_id2 ? `Curso ID ${selectedCandidate.curso_id2}` : '-')}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Turno: {selectedCandidate.turno2 || '-'}
                              </p>
                              {turmaInfo.opcao2 && (
                                <div className="mt-2 space-y-1">
                                  <p className="text-sm font-medium text-blue-700">
                                    📚 Turma: {turmaInfo.opcao2.turma}
                                  </p>
                                  <p className={`text-sm font-bold ${turmaInfo.opcao2.vagas > 0 ? 'text-emerald-600' : 'text-red-600'
                                    }`}>
                                    {turmaInfo.opcao2.vagas > 0 ? '✅' : '❌'} Vagas disponíveis: {turmaInfo.opcao2.vagas} de {turmaInfo.opcao2.total}
                                  </p>
                                </div>
                              )}
                            </div>
                            <Button
                              onClick={() => handleApproveWithCourse(selectedCandidate.id, 2)}
                              className="bg-emerald-600 hover:bg-emerald-700 ml-4"
                              size="sm"
                              disabled={turmaInfo.opcao2 && turmaInfo.opcao2.vagas <= 0}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Aprovar 2ª Opção
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 italic">
                      * O botão fica desabilitado automaticamente se não houver vagas disponíveis.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Questionário Social */}
              {(selectedCandidate?.raca_cor || selectedCandidate?.renda_mensal) && (
                <Card className="border-primary/20">
                  <CardHeader className="bg-primary/5">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Questionário Social
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedCandidate?.raca_cor && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Raça/Cor</p>
                          <p className="font-medium">{selectedCandidate.raca_cor}</p>
                        </div>
                      )}
                      {selectedCandidate?.renda_mensal && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Renda Mensal</p>
                          <p className="font-medium text-sm">{selectedCandidate.renda_mensal.replace(/_/g, ' ')}</p>
                        </div>
                      )}
                      {selectedCandidate?.pessoas_renda && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Pessoas na Renda</p>
                          <p className="font-medium">{selectedCandidate.pessoas_renda}</p>
                        </div>
                      )}
                      {selectedCandidate?.tipo_residencia && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Tipo de Residência</p>
                          <p className="font-medium text-sm">{selectedCandidate.tipo_residencia.replace(/_/g, ' ')}</p>
                        </div>
                      )}
                      {selectedCandidate?.itens_casa && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-muted-foreground mb-1">Itens em Casa</p>
                          <p className="font-medium">{selectedCandidate.itens_casa.split(',').join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Responsável Legal */}
              {selectedCandidate?.menor_idade && (
                <Card className="border-amber-200">
                  <CardHeader className="bg-amber-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Responsável Legal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Nome do Responsável</p>
                        <p className="font-medium">{selectedCandidate.nome_responsavel || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">CPF do Responsável</p>
                        <p className="font-medium">{selectedCandidate.cpf_responsavel ? formatCPF(selectedCandidate.cpf_responsavel) : '-'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Programa Goianas */}
              {selectedCandidate?.goianas_ciencia && (
                <Card className="border-blue-200">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Goianas na Ciência
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="font-medium">
                      {selectedCandidate.goianas_ciencia === 'SIM' ? '✓ Deseja participar' : '✗ Não deseja participar'}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Documentos Anexados */}
              {(selectedCandidate?.rg_frente_url || selectedCandidate?.rg_verso_url || selectedCandidate?.cpf_aluno_url ||
                selectedCandidate?.comprovante_endereco_url || selectedCandidate?.foto_3x4_url ||
                selectedCandidate?.comprovante_escolaridade_url || selectedCandidate?.identidade_responsavel_frente_url ||
                selectedCandidate?.identidade_responsavel_verso_url || selectedCandidate?.cpf_responsavel_url) && (
                  <Card className="border-purple-200">
                    <CardHeader className="bg-purple-50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Documentos Anexados
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedCandidate.rg_frente_url && (
                          <a
                            href={`${DOCUMENT_BASE_URL}${selectedCandidate.rg_frente_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:border-purple-300 hover:bg-purple-50 transition-colors"
                          >
                            <Download className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">RG Frente</span>
                          </a>
                        )}
                        {selectedCandidate.rg_verso_url && (
                          <a
                            href={`${DOCUMENT_BASE_URL}${selectedCandidate.rg_verso_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:border-purple-300 hover:bg-purple-50 transition-colors"
                          >
                            <Download className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">RG Verso</span>
                          </a>
                        )}
                        {selectedCandidate.cpf_aluno_url && (
                          <a
                            href={`${DOCUMENT_BASE_URL}${selectedCandidate.cpf_aluno_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:border-purple-300 hover:bg-purple-50 transition-colors"
                          >
                            <Download className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">CPF</span>
                          </a>
                        )}
                        {selectedCandidate.comprovante_endereco_url && (
                          <a
                            href={`${DOCUMENT_BASE_URL}${selectedCandidate.comprovante_endereco_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:border-purple-300 hover:bg-purple-50 transition-colors"
                          >
                            <Download className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">Comprovante de Endereço</span>
                          </a>
                        )}
                        {selectedCandidate.foto_3x4_url && (
                          <a
                            href={`${DOCUMENT_BASE_URL}${selectedCandidate.foto_3x4_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:border-purple-300 hover:bg-purple-50 transition-colors"
                          >
                            <Download className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">Foto 3x4</span>
                          </a>
                        )}
                        {selectedCandidate.comprovante_escolaridade_url && (
                          <a
                            href={`${DOCUMENT_BASE_URL}${selectedCandidate.comprovante_escolaridade_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:border-purple-300 hover:bg-purple-50 transition-colors"
                          >
                            <Download className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">Comprovante Escolaridade</span>
                          </a>
                        )}
                        {selectedCandidate.identidade_responsavel_frente_url && (
                          <a
                            href={`${DOCUMENT_BASE_URL}${selectedCandidate.identidade_responsavel_frente_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:border-purple-300 hover:bg-purple-50 transition-colors"
                          >
                            <Download className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">RG Responsável (Frente)</span>
                          </a>
                        )}
                        {selectedCandidate.identidade_responsavel_verso_url && (
                          <a
                            href={`${DOCUMENT_BASE_URL}${selectedCandidate.identidade_responsavel_verso_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:border-purple-300 hover:bg-purple-50 transition-colors"
                          >
                            <Download className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">RG Responsável (Verso)</span>
                          </a>
                        )}
                        {selectedCandidate.cpf_responsavel_url && (
                          <a
                            href={`${DOCUMENT_BASE_URL}${selectedCandidate.cpf_responsavel_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:border-purple-300 hover:bg-purple-50 transition-colors"
                          >
                            <Download className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">CPF Responsável</span>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Status e Data */}
              <Card className="border-primary/20">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Status da Inscrição
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Status Atual</p>
                      {isEditing ? (
                        <Select
                          value={editedCandidate?.status || ''}
                          onValueChange={(value) => setEditedCandidate(prev => prev ? { ...prev, status: value } : null)}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDENTE">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-amber-600" />
                                Pendente
                              </div>
                            </SelectItem>
                            <SelectItem value="LISTA_ESPERA">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-orange-600" />
                                Lista de Espera
                              </div>
                            </SelectItem>
                            <SelectItem value="REPROVADO">
                              <div className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-red-600" />
                                Reprovado
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedCandidate?.status || '')}
                          {getStatusBadge(selectedCandidate?.status || '')}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Data de Inscrição</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(selectedCandidate?.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Botões de Ação */}
              {isEditing ? (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={handleStartEdit}
                    className="flex-1"
                    variant="outline"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Dados
                  </Button>
                  <Button
                    onClick={handleDeleteCandidate}
                    disabled={isSaving}
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deletar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Configuração do Formulário de Inscrição */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Configurar Formulário de Inscrição
            </DialogTitle>
            <DialogDescription>
              Gerencie os cursos disponíveis e configure o formulário que aparece na página de inscrição
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="cursos" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cursos">Cursos</TabsTrigger>
              <TabsTrigger value="campos">Campos do Formulário</TabsTrigger>
              <TabsTrigger value="config">Configurações</TabsTrigger>
            </TabsList>

            {/* Aba: Cursos Disponíveis */}
            <TabsContent value="cursos" className="space-y-4 mt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex gap-3">
                  <GraduationCap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Selecionar Cursos Disponíveis para Inscrição
                    </p>
                    <p className="text-xs text-blue-700">
                      Marque os cursos que estarão disponíveis no formulário público de inscrição. Apenas cursos ATIVOS aparecerão para os candidatos.
                    </p>
                  </div>
                </div>
              </div>

              {isLoadingCourses ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground">Carregando cursos...</p>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg bg-slate-50">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-2 font-medium">Nenhum curso cadastrado</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Adicione cursos para disponibilizá-los no formulário de inscrição
                  </p>
                  <Button
                    onClick={() => setIsAddCourseDialogOpen(true)}
                    variant="default"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Curso
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {courses.map((course) => (
                      <Card key={course.id} className={`${course.status === 'ATIVO' ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-lg">{course.nome}</h4>
                                {course.status === 'ATIVO' ? (
                                  <Badge className="bg-emerald-100 text-emerald-700">Ativo</Badge>
                                ) : course.status === 'EM_DESENVOLVIMENTO' ? (
                                  <Badge className="bg-yellow-100 text-yellow-700">Em Desenvolvimento</Badge>
                                ) : (
                                  <Badge variant="secondary">Inativo</Badge>
                                )}
                              </div>
                              {course.descricao && (
                                <p className="text-sm text-muted-foreground mb-2">{course.descricao}</p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {course.carga_horaria && (
                                  <span>📚 {course.carga_horaria}h</span>
                                )}
                                {course.nivel && (
                                  <span>📊 {course.nivel}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={course.status === 'ATIVO'}
                                onCheckedChange={() => handleToggleCourseStatus(course.id, course.status || 'INATIVO')}
                              />
                              <span className="text-sm font-medium whitespace-nowrap">
                                {course.status === 'ATIVO' ? 'Visível' : 'Oculto'}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => setIsAddCourseDialogOpen(true)}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Novo Curso
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Aba: Campos do Formulário */}
            <TabsContent value="campos" className="space-y-4 mt-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900 mb-1">
                      Configurar Campos da Inscrição
                    </p>
                    <p className="text-xs text-green-700">
                      Controle quais campos aparecem no formulário, se são obrigatórios, e personalize os textos. As mudanças aparecem INSTANTANEAMENTE na página de inscrição.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Dados Pessoais */}
                <Card>
                  <CardHeader className="bg-slate-50">
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Dados Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {config.fields
                        .filter(f => f.section === 'pessoais' && !ALWAYS_REQUIRED_FIELDS.includes(f.id))
                        .sort((a, b) => a.order - b.order)
                        .map((field) => (
                          <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div className="font-medium">{field.label}</div>
                                {field.required && <Badge variant="destructive" className="text-xs">Obrigatório</Badge>}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Tipo: {field.type} • ID: {field.id}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Obrigatório</span>
                                <Switch
                                  disabled={ALWAYS_REQUIRED_FIELDS.includes(field.id)}
                                  checked={field.required}
                                  title={ALWAYS_REQUIRED_FIELDS.includes(field.id) ? "Este campo é obrigatório e deve estar sempre visível" : ""}
                                  onCheckedChange={(checked) => {
                                    const updatedFields = config.fields.map(f =>
                                      f.id === field.id ? { ...f, required: checked } : f
                                    );
                                    updateConfig({ fields: updatedFields });
                                  }}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Visível</span>
                                <Switch
                                  disabled={ALWAYS_REQUIRED_FIELDS.includes(field.id)}
                                  checked={field.visible}
                                  title={ALWAYS_REQUIRED_FIELDS.includes(field.id) ? "Este campo é obrigatório e deve estar sempre visível" : ""}
                                  onCheckedChange={(checked) => {
                                    const updatedFields = config.fields.map(f =>
                                      f.id === field.id ? { ...f, visible: checked } : f
                                    );
                                    updateConfig({ fields: updatedFields });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Endereço */}
                <Card>
                  <CardHeader className="bg-slate-50">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Endereço
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {config.fields
                        .filter(f => f.section === 'endereco' && !ALWAYS_REQUIRED_FIELDS.includes(f.id))
                        .sort((a, b) => a.order - b.order)
                        .map((field) => (
                          <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div className="font-medium">{field.label}</div>
                                {field.required && <Badge variant="destructive" className="text-xs">Obrigatório</Badge>}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                ID: {field.id}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Obrigatório</span>
                                <Switch
                                  disabled={ALWAYS_REQUIRED_FIELDS.includes(field.id)}
                                  checked={field.required}
                                  title={ALWAYS_REQUIRED_FIELDS.includes(field.id) ? "Este campo é obrigatório e deve estar sempre visível" : ""}
                                  onCheckedChange={(checked) => {
                                    const updatedFields = config.fields.map(f =>
                                      f.id === field.id ? { ...f, required: checked } : f
                                    );
                                    updateConfig({ fields: updatedFields });
                                  }}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Visível</span>
                                <Switch
                                  disabled={ALWAYS_REQUIRED_FIELDS.includes(field.id)}
                                  checked={field.visible}
                                  title={ALWAYS_REQUIRED_FIELDS.includes(field.id) ? "Este campo é obrigatório e deve estar sempre visível" : ""}
                                  onCheckedChange={(checked) => {
                                    const updatedFields = config.fields.map(f =>
                                      f.id === field.id ? { ...f, visible: checked } : f
                                    );
                                    updateConfig({ fields: updatedFields });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Documentos */}
                <Card>
                  <CardHeader className="bg-slate-50">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Documentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {config.fields
                        .filter(f => f.section === 'documentos' && !ALWAYS_REQUIRED_FIELDS.includes(f.id))
                        .sort((a, b) => a.order - b.order)
                        .map((field) => (
                          <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div className="font-medium">{field.label}</div>
                                {field.required && <Badge variant="destructive" className="text-xs">Obrigatório</Badge>}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                ID: {field.id}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Obrigatório</span>
                                <Switch
                                  disabled={ALWAYS_REQUIRED_FIELDS.includes(field.id)}
                                  checked={field.required}
                                  title={ALWAYS_REQUIRED_FIELDS.includes(field.id) ? "Este campo é obrigatório e deve estar sempre visível" : ""}
                                  onCheckedChange={(checked) => {
                                    const updatedFields = config.fields.map(f =>
                                      f.id === field.id ? { ...f, required: checked } : f
                                    );
                                    updateConfig({ fields: updatedFields });
                                  }}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Visível</span>
                                <Switch
                                  disabled={ALWAYS_REQUIRED_FIELDS.includes(field.id)}
                                  checked={field.visible}
                                  title={ALWAYS_REQUIRED_FIELDS.includes(field.id) ? "Este campo é obrigatório e deve estar sempre visível" : ""}
                                  onCheckedChange={(checked) => {
                                    const updatedFields = config.fields.map(f =>
                                      f.id === field.id ? { ...f, visible: checked } : f
                                    );
                                    updateConfig({ fields: updatedFields });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-xs text-emerald-700">
                  ✅ <strong>Alterações salvas automaticamente!</strong> As mudanças aparecem instantaneamente no formulário de inscrição.
                </p>
              </div>
            </TabsContent>

            {/* Aba: Configurações Gerais */}
            <TabsContent value="config" className="space-y-4 mt-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex gap-3">
                  <Settings className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 mb-1">
                      Configurações do Formulário
                    </p>
                    <p className="text-xs text-amber-700">
                      Personalize textos e configure opções do formulário de inscrição pública.
                    </p>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Texto de Boas-Vindas</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="welcome-text" className="text-sm">
                    Mensagem exibida no topo do formulário
                  </Label>
                  <Textarea
                    id="welcome-text"
                    placeholder="Bem-vindo ao CRC Sukatech! Preencha os dados..."
                    className="mt-2 min-h-[100px]"
                    value={config.welcomeText}
                    onChange={(e) => updateConfig({ welcomeText: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Este texto aparece na página de inscrição pública
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp para Dúvidas</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="(62) 4141-9800"
                      className="mt-2"
                      value={config.whatsapp}
                      onChange={(e) => updateConfig({ whatsapp: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-contato">Email de Contato</Label>
                    <Input
                      id="email-contato"
                      type="email"
                      placeholder="contato@sukatech.com"
                      className="mt-2"
                      value={config.email}
                      onChange={(e) => updateConfig({ email: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Controle de Vagas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="max-vagas">Número máximo de vagas (0 = ilimitado)</Label>
                    <Input
                      id="max-vagas"
                      type="number"
                      placeholder="0"
                      className="mt-2"
                      min="0"
                      value={config.maxVagas}
                      onChange={(e) => updateConfig({ maxVagas: parseInt(e.target.value) || 0 })}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {config.maxVagas === 0 ? '♾️ Vagas ilimitadas' : `📊 Limite: ${config.maxVagas} vagas`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Status do Processo Seletivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">Inscrições Abertas</Label>
                      <p className="text-sm text-muted-foreground">
                        Controle se o formulário de inscrição está disponível ao público
                      </p>
                    </div>
                    <Switch
                      checked={config.inscricoesAbertas}
                      onCheckedChange={(checked) => updateConfig({ inscricoesAbertas: checked })}
                    />
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700">
                      <strong>Status Atual:</strong> {config.inscricoesAbertas ? '✅ Inscrições ABERTAS' : '❌ Inscrições FECHADAS'} - O formulário público está {config.inscricoesAbertas ? 'disponível' : 'bloqueado'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-xs text-emerald-700">
                  ✅ <strong>Salvo automaticamente!</strong> As alterações já estão ativas no formulário de inscrição.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Dialog para Adicionar Curso */}
      <Dialog open={isAddCourseDialogOpen} onOpenChange={setIsAddCourseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Adicionar Novo Curso
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do curso. Ele será criado como ATIVO e ficará visível no formulário.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="curso-nome">
                Nome do Curso <span className="text-destructive">*</span>
              </Label>
              <Input
                id="curso-nome"
                placeholder="Ex: Desenvolvimento Web Full Stack"
                value={newCourse.nome}
                onChange={(e) => setNewCourse({ ...newCourse, nome: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="curso-descricao">Descrição</Label>
              <Textarea
                id="curso-descricao"
                placeholder="Breve descrição do curso..."
                value={newCourse.descricao}
                onChange={(e) => setNewCourse({ ...newCourse, descricao: e.target.value })}
                className="mt-2"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="curso-carga">
                  Carga Horária (horas) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="curso-carga"
                  type="number"
                  placeholder="160"
                  min="1"
                  max="1000"
                  value={newCourse.carga_horaria}
                  onChange={(e) => setNewCourse({ ...newCourse, carga_horaria: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="curso-nivel">Nível</Label>
                <Select
                  value={newCourse.nivel}
                  onValueChange={(value: "INICIANTE" | "INTERMEDIARIO" | "AVANCADO") =>
                    setNewCourse({ ...newCourse, nivel: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INICIANTE">Iniciante</SelectItem>
                    <SelectItem value="INTERMEDIARIO">Intermediário</SelectItem>
                    <SelectItem value="AVANCADO">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsAddCourseDialogOpen(false)}
              disabled={isCreatingCourse}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCourse}
              disabled={isCreatingCourse || !newCourse.nome || !newCourse.carga_horaria}
            >
              {isCreatingCourse ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Curso
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcessoSeletivo;

