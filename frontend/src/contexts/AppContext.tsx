import { useState, useEffect, ReactNode } from 'react';
import { StudentsAPI, CoursesAPI, ClassesAPI, InstructorsAPI, CandidatesAPI } from '@/lib/api';
import { AppContext, AppContextType, unwrapNestedArray, getApiErrorMessage } from '@/contexts/appContextCore';

interface BackendStudent {
  id?: number;
  matricula?: string;
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  data_nascimento?: string;
  endereco?: string;
  createdAt?: string;
  status?: string;
  turma?: {
    nome?: string;
    turno?: string;
    curso?: {
      nome?: string;
    };
  } | null;
}

interface BackendCourseTurma {
  id?: number;
  nome?: string;
  alunos?: BackendStudent[];
}

interface BackendCourse {
  id?: number;
  nome?: string;
  descricao?: string;
  carga_horaria?: number;
  nivel?: string;
  status?: string;
  turmas?: BackendCourseTurma[];
}

interface BackendClass {
  id?: number;
  nome?: string;
  curso?: { nome?: string };
  id_curso?: number;
  instrutores?: Array<{ id?: number; nome?: string }>;
  alunos?: Array<{ id?: number; nome?: string; matricula?: string; email?: string; status?: string }>;
  turma?: { turno?: string };
  vagas?: number;
  status?: string;
  turno?: string;
  data_inicio?: string;
  data_fim?: string;
}

interface BackendInstructor {
  id?: number;
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  data_nascimento?: string;
  endereco?: string;
  especialidade?: string;
  experiencia?: string;
  status?: string;
  turmas?: Array<{ id?: number; nome?: string; status?: string; curso?: { nome?: string } }>;
}

type BackendCandidate = Candidate;

type CourseCreatePayload = {
  nome: string;
  carga_horaria: number;
  descricao?: string;
  nivel?: string;
  status?: string;
};

type CourseUpdatePayload = Partial<CourseCreatePayload>;

type ClassCreatePayload = {
  nome: string;
  vagas: number;
  status: string;
  turno: string;
  id_curso: number;
  data_inicio?: string | null;
  data_fim?: string | null;
};

type ClassUpdatePayload = Partial<ClassCreatePayload>;

type InstructorPayload = {
  nome: string;
  cpf: string;
  email: string;
  data_nascimento?: string | null;
  endereco?: string;
  especialidade?: string;
  experiencia?: string;
  status?: string;
};

type InstructorUpdatePayload = Partial<InstructorPayload>;

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados da API ao montar o componente
  useEffect(() => {
    async function loadData() {
      // Não carregar dados se estiver em páginas públicas
      const publicPaths = ['/login', '/register', '/reset-password', '/new-password'];
      const isPublicPath = publicPaths.some(path => window.location.pathname.includes(path));

      if (isPublicPath) {
        setLoading(false);
        return;
      }

      // Verificar se há token antes de tentar carregar dados
      const token = localStorage.getItem("@sukatech:token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Função para carregar todos os cursos (backend limita a 10 por página)
        const loadAllCourses = async () => {
          const seenIds = new Set();
          let uniqueCourses: BackendCourse[] = [];
          let currentPage = 1;
          let hasMore = true;

          while (hasMore && currentPage <= 10) {
            const response = await CoursesAPI.list({ page: currentPage, limit: 100 });
            const pageData = unwrapNestedArray<BackendCourse>(response.data);
            const pagination = response.data?.data?.pagination;

            // Filtrar apenas cursos novos (não duplicados)
            const newCourses = pageData.filter((course) => {
              if (seenIds.has(course.id)) {
                return false; // Duplicado
              }
              seenIds.add(course.id);
              return true;
            });

            uniqueCourses = [...uniqueCourses, ...newCourses];

            // Se não teve cursos novos, parar (backend não suporta paginação)
            if (newCourses.length === 0) {
              break;
            }

            hasMore = pagination?.hasNextPage || false;
            currentPage++;
          }

          return { data: { data: { data: uniqueCourses } } };
        };

        // Carregar dados (com limit maior para pegar todos)
        const [studentsRes, coursesRes, classesRes, instructorsRes, candidatesRes] = await Promise.all([
          StudentsAPI.list({ limit: 100, page: 1 }).catch(() => ({ data: [] })),
          loadAllCourses().catch(() => ({ data: { data: { data: [] } } })),
          ClassesAPI.list({ limit: 100, page: 1 }).catch(() => ({ data: [] })),
          InstructorsAPI.list().catch(() => ({ data: [] })),
          CandidatesAPI.list({ limit: 100, page: 1 }).catch(() => ({ data: [] }))
        ]);

        // Garantir que students seja um array e transformar do backend para frontend
        const backendStudents = unwrapNestedArray<BackendStudent>(studentsRes.data);

        // Transformar students do backend para formato frontend
        const frontendStudents: Student[] = backendStudents.map((bs) => {
          const formatDate = (date: string | null) => {
            if (!date) return '';
            const d = new Date(date);
            return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
          };

          // Converter status do backend (minúsculo) para frontend (primeira letra maiúscula)
          const formatStatus = (status: string) => {
            if (!status) return 'Ativo';
            return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
          };

          return {
            id: bs.id,
            matricula: bs.matricula || '',
            name: bs.nome || '',
            cpf: bs.cpf || '',
            email: bs.email || '',
            phone: bs.telefone || '',
            birthDate: formatDate(bs.data_nascimento),
            address: bs.endereco || '',
            enrollmentDate: formatDate(bs.createdAt),
            status: formatStatus(bs.status),
            course: bs.turma?.curso?.nome || '', // Curso vem através da turma
            class: bs.turma?.nome || '',
            progress: 0,
            attendance: 0,
            grades: 0
          };
        });

        setStudents(frontendStudents);

        // Transform backend courses to frontend format
        // Backend retorna { success, data: { data: [...], pagination: {...} }, message }
        const backendCourses = unwrapNestedArray<BackendCourse>(coursesRes.data);

        const frontendCourses: Course[] = backendCourses.map((bc) => {
          // Contar alunos de todas as turmas deste curso
          const totalStudents = bc.turmas?.reduce((sum, turma) => {
            return sum + (turma.alunos ? turma.alunos.length : 0);
          }, 0) ?? 0;

          return {
            id: bc.id,
            title: bc.nome,
            description: bc.descricao || '',
            duration: `${bc.carga_horaria}h`,
            students: totalStudents,
            level: ((): string => {
              const map: Record<string, string> = {
                'INICIANTE': 'Iniciante',
                'INTERMEDIARIO': 'Intermediário',
                'AVANCADO': 'Avançado'
              };
              return bc.nivel ? (map[bc.nivel] || 'Intermediário') : 'Intermediário';
            })(),
            status: ((): string => {
              const map: Record<string, string> = {
                'ATIVO': 'Ativo',
                'INATIVO': 'Inativo',
                'EM_DESENVOLVIMENTO': 'Em Desenvolvimento'
              };
              return bc.status ? (map[bc.status] || 'Ativo') : 'Ativo';
            })(),
            color: 'bg-blue-500'
          };
        });

        setCourses(frontendCourses);

        // Garantir que classes seja um array e transformar do backend para frontend
        const backendClasses = unwrapNestedArray<BackendClass>(classesRes.data);

        // Transformar classes do backend para formato frontend
        const frontendClasses: Class[] = backendClasses.map((bc) => {
          const formatDate = (date: string | null) => {
            if (!date) return '';
            // Se já está em formato dd/mm/yyyy, retorna direto
            if (date.includes('/')) return date;
            // Se está em formato yyyy-MM-dd, converte sem usar new Date para evitar problema de timezone
            const parts = date.split('T')[0].split('-'); // Remove hora se tiver e separa
            if (parts.length === 3) {
              return `${parts[2]}/${parts[1]}/${parts[0]}`; // dd/mm/yyyy
            }
            return date;
          };

          // Transformar alunos da turma
          const students = (bc.alunos || []).map((aluno) => ({
            id: aluno.id,
            name: aluno.nome,
            matricula: aluno.matricula,
            email: aluno.email,
            status: aluno.status
          }));

          // Pegar primeiro instrutor (se houver)
          const instructor = bc.instrutores && bc.instrutores.length > 0
            ? bc.instrutores[0].nome
            : 'A definir';
          const instructorId = bc.instrutores && bc.instrutores.length > 0
            ? bc.instrutores[0].id
            : undefined;

          // Mapear status do backend para frontend
          const statusMap: Record<string, string> = {
            'ATIVA': 'Ativo',
            'PLANEJADA': 'Planejada',
            'ENCERRADA': 'Concluída',
            'CANCELADA': 'Cancelada'
          };
          const frontendStatus = bc.status ? (statusMap[bc.status] || 'Planejada') : 'Planejada';

          // Mapear turno do backend para formato amigável
          const turnoMap: Record<string, string> = {
            'MANHA': 'Matutino',
            'TARDE': 'Vespertino',
            'NOITE': 'Noturno',
            'INTEGRAL': 'Integral'
          };
          const frontendSchedule = bc.turno ? (turnoMap[bc.turno] || bc.turno) : '';

          return {
            id: bc.id,
            name: bc.nome || '',
            course: bc.curso?.nome || bc.id_curso?.toString() || '',
            instructor: instructor,
            instructorId: instructorId,
            capacity: bc.vagas || 0,
            enrolled: students.length,
            schedule: frontendSchedule,
            duration: '6 meses',
            status: frontendStatus,
            startDate: formatDate(bc.data_inicio),
            endDate: formatDate(bc.data_fim),
            students: students
          };
        });

        console.log('✅ Classes no loadData:', frontendClasses);
        setClasses(frontendClasses);

        // Transformar instructors do backend para formato frontend
        const backendInstructors = unwrapNestedArray<BackendInstructor>(instructorsRes.data);

        const frontendInstructors: Instructor[] = backendInstructors.map((bi) => {
          const formatDate = (date: string | null) => {
            if (!date) return '';
            const d = new Date(date);
            return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
          };

          // Mapear turmas associadas
          const classes = (bi.turmas || []).map((turma) => ({
            id: turma.id,
            name: turma.nome,
            status: turma.status,
            courseName: turma.curso?.nome || ''
          }));

          return {
            id: bi.id,
            name: bi.nome || '',
            cpf: bi.cpf || '',
            email: bi.email || '',
            phone: bi.telefone || '',
            birthDate: formatDate(bi.data_nascimento),
            address: bi.endereco || '',
            specialization: bi.especialidade || '',
            experience: bi.experiencia || '',
            status: bi.status ? (bi.status.charAt(0).toUpperCase() + bi.status.slice(1).toLowerCase()) : 'Ativo',
            classes: classes
          };
        });

        console.log('✅ Instrutores carregados:', frontendInstructors);
        setInstructors(frontendInstructors);

        // Transformar candidates do backend para formato frontend
        const backendCandidates = unwrapNestedArray<BackendCandidate>(candidatesRes.data);

        console.log('✅ Candidatos carregados:', backendCandidates);
        setCandidates(backendCandidates);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Em caso de erro, usar arrays vazios ao invés de dados mockados
        setStudents([]);
        setCourses([]);
        setClasses([]);
        setInstructors([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Adicionar listener para detectar quando o token é adicionado/removido
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === '@sukatech:token') {
        // Token foi adicionado ou removido, recarregar dados
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Refresh functions
  const refreshStudents = async () => {
    try {
      const response = await StudentsAPI.list({ limit: 100, page: 1 });

      const backendStudents = unwrapNestedArray<BackendStudent>(response.data);

      const frontendStudents: Student[] = backendStudents.map(bs => {
        const formatDate = (date: string | null) => {
          if (!date) return '';
          const d = new Date(date);
          return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        };

        const formatStatus = (status: string | undefined) => {
          if (!status) return 'Ativo';
          return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        };

        const formatTurno = (turno?: string) => {
          const turnoMap: Record<string, string> = {
            'MANHA': 'Matutino',
            'TARDE': 'Vespertino',
            'NOITE': 'Noturno',
            'INTEGRAL': 'Integral'
          };
          if (!turno) return '';
          return turnoMap[turno] || turno;
        };

        let className = '';
        if (bs.turma?.nome) {
          className = bs.turma.nome;
          if (bs.turma.turno) {
            className += ` - ${formatTurno(bs.turma.turno)}`;
          }
        }

        return {
          id: bs.id,
          matricula: bs.matricula || '',
          name: bs.nome || '',
          cpf: bs.cpf || '',
          email: bs.email || '',
          phone: bs.telefone || '',
          birthDate: formatDate(bs.data_nascimento),
          address: bs.endereco || '',
          enrollmentDate: formatDate(bs.createdAt),
          status: formatStatus(bs.status),
          course: bs.turma?.curso?.nome || '',
          class: className || 'Sem turma',
          progress: 0,
          attendance: 0,
          grades: 0
        };
      });

      setStudents(frontendStudents);
      setError(null);
    } catch (err: unknown) {
      console.error('Erro ao carregar alunos:', err);
      setError(getApiErrorMessage(err, 'Erro ao carregar alunos'));
    }
  };

  // Student actions
  const addStudent = async (studentData: Omit<Student, 'id'>): Promise<Student> => {
    try {
      setError(null);

      console.log('➕ Criando aluno:', studentData);

      // Buscar id_curso baseado no nome do curso selecionado
      let id_curso = null;
      if (studentData.course) {
        const selectedCourse = courses.find(c => c.title === studentData.course);
        id_curso = selectedCourse ? selectedCourse.id : null;
      }

      // Buscar id_turma baseado no nome da turma selecionada
      let id_turma = null;
      if (studentData.class) {
        const selectedClass = classes.find(c => c.name === studentData.class);
        id_turma = selectedClass ? selectedClass.id : null;
      }

      // Transform frontend format to backend format
      const backendData = {
        nome: studentData.name,
        cpf: studentData.cpf.replace(/\D/g, ''), // Remove formatação
        email: studentData.email,
        telefone: studentData.phone || null,
        data_nascimento: studentData.birthDate || null, // Backend aceita DD/MM/YYYY e MM/DD/YYYY
        endereco: studentData.address || null,
        id_curso: id_curso,
        id_turma: id_turma,
        status: 'ativo'
      };

      console.log('➕ Dados para backend:', backendData);

      const response = await StudentsAPI.create(backendData);
      console.log('➕ Resposta do backend:', response);

      const backendStudent = response.data.data; // Backend returns {success, data, message}
      console.log('➕ Backend student:', backendStudent);

      // Transform backend format to frontend format
      const formatDate = (date: string | null) => {
        if (!date) return '';
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
      };

      // Converter status do backend (minúsculo) para frontend (primeira letra maiúscula)
      const formatStatus = (status: string) => {
        if (!status) return 'Ativo';
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      };

      const newStudent: Student = {
        id: backendStudent.id,
        name: backendStudent.nome,
        cpf: backendStudent.cpf,
        email: backendStudent.email,
        phone: backendStudent.telefone || '',
        birthDate: formatDate(backendStudent.data_nascimento),
        address: backendStudent.endereco || '',
        enrollmentDate: formatDate(backendStudent.createdAt),
        status: formatStatus(backendStudent.status),
        course: backendStudent.turma?.curso?.nome || '', // Curso vem através da turma
        class: backendStudent.turma?.nome || '',
        progress: 0,
        attendance: 0,
        grades: 0
      };

      console.log('➕ Novo aluno transformado:', newStudent);

      setStudents(prev => {
        const updated = [...prev, newStudent];
        console.log('➕ Alunos após adicionar:', updated);
        return updated;
      });

      // Refresh related data
      await refreshClasses();
      await refreshCourses();

      return newStudent;
    } catch (err: unknown) {
      console.error('Erro ao criar aluno:', err);
      if (isAxiosError(err)) {
        console.error('Detalhes do erro:', err.response?.data);
      }
      const errorMessage = getApiErrorMessage(err, 'Erro ao criar aluno');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateStudent = async (id: number, studentData: Partial<Student>): Promise<void> => {
    try {
      setError(null);

      console.log('✏️ Atualizando aluno:', id, studentData);

      // Transform frontend format to backend format
      // IMPORTANTE: Enviar APENAS os campos que o backend aceita (nome, email, telefone, turma_id, status)
      const backendData: Record<string, unknown> = {};
      if (studentData.name !== undefined) backendData.nome = studentData.name;
      if (studentData.email !== undefined) backendData.email = studentData.email;
      if (studentData.phone !== undefined) backendData.telefone = studentData.phone;

      // Buscar turma_id se turma foi alterada
      if (studentData.class !== undefined) {
        if (studentData.class === "" || studentData.class === null) {
          backendData.turma_id = null; // Remover da turma
        } else {
          const turma = classes.find(c => c.name === studentData.class);
          if (turma) {
            backendData.turma_id = turma.id;
          }
        }
      }

      if (studentData.status !== undefined) {
        console.log('🔍 Status enviado:', studentData.status);
        backendData.status = studentData.status; // Backend vai converter automaticamente
      }

      console.log('✏️ Dados para backend:', backendData);
      console.log('✏️ Dados em JSON:', JSON.stringify(backendData, null, 2));

      // Verificar se há dados para enviar
      if (Object.keys(backendData).length === 0) {
        console.warn('⚠️ Nenhum dado para atualizar');
        return;
      }

      const response = await StudentsAPI.update(id, backendData);
      console.log('✅ Resposta do backend:', response.data);

      // Recarregar a lista de alunos do backend para garantir sincronização
      await refreshStudents();

      // Refresh related data
      await refreshClasses();

    } catch (err: unknown) {
      console.error('❌ Erro completo ao atualizar aluno:', err);
      if (isAxiosError(err)) {
        console.error('❌ Resposta do servidor:', err.response?.data);
        console.error('❌ Detalhes da validação:', JSON.stringify(err.response?.data?.details, null, 2));
      }
      const errorMessage = getApiErrorMessage(err, 'Erro ao atualizar aluno');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteStudent = async (id: number): Promise<void> => {
    try {
      setError(null);
      await StudentsAPI.delete(id);

      setStudents(prev => prev.filter(s => s.id !== id));

      // Refresh related data
      await refreshClasses();
      await refreshCourses();

    } catch (err: unknown) {
      console.error('Erro ao deletar aluno:', err);
      if (isAxiosError(err)) {
        console.error('Detalhes do erro:', err.response?.data);
      }
      const errorMessage = getApiErrorMessage(err, 'Erro ao deletar aluno');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const transferStudentToWaitingList = async (id: number, motivo?: string): Promise<void> => {
    try {
      setError(null);
      await StudentsAPI.transferToWaitingList(id, motivo);

      // Remove aluno da lista
      setStudents(prev => prev.filter(s => s.id !== id));

      // Refresh related data
      await refreshClasses();
      await refreshCourses();

    } catch (err: unknown) {
      console.error('Erro ao transferir aluno para lista de espera:', err);
      if (isAxiosError(err)) {
        console.error('Detalhes do erro:', err.response?.data);
      }
      const errorMessage = getApiErrorMessage(err, 'Erro ao transferir aluno para lista de espera');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getStudentById = (id: number) => students.find(s => s.id === id);

  const refreshCourses = async () => {
    try {
      const response = await CoursesAPI.list({ limit: 100 });
      console.log('🔍 Response completa:', response);
      console.log('🔍 response.data:', response.data);

      const backendCourses = unwrapNestedArray<BackendCourse>(response.data);
      console.log('🔍 Backend courses:', backendCourses);
      console.log('🔍 É array?', Array.isArray(backendCourses));

      const frontendCourses: Course[] = backendCourses.map(bc => {
        let totalStudents = 0;
        if (bc.turmas && Array.isArray(bc.turmas)) {
          totalStudents = bc.turmas.reduce((sum: number, turma) => {
            return sum + (turma.alunos ? turma.alunos.length : 0);
          }, 0);
        }

        return {
          id: bc.id,
          title: bc.nome,
          description: bc.descricao || '',
          duration: `${bc.carga_horaria}h`,
          students: totalStudents,
          level: ((): string => {
            const map: Record<string, string> = {
              'INICIANTE': 'Iniciante',
              'INTERMEDIARIO': 'Intermediário',
              'AVANCADO': 'Avançado'
            };
            return bc.nivel ? (map[bc.nivel] || 'Intermediário') : 'Intermediário';
          })(),
          status: ((): string => {
            const map: Record<string, string> = {
              'ATIVO': 'Ativo',
              'INATIVO': 'Inativo',
              'EM_DESENVOLVIMENTO': 'Em Desenvolvimento'
            };
            return bc.status ? (map[bc.status] || 'Ativo') : 'Ativo';
          })(),
          color: 'bg-blue-500'
        };
      });

      console.log('🔍 Frontend courses transformados:', frontendCourses);
      setCourses(frontendCourses);
      setError(null);
    } catch (err: unknown) {
      console.error('Erro ao carregar cursos:', err);
      setError(getApiErrorMessage(err, 'Erro ao carregar cursos'));
    }
  };

  // Course actions
  const addCourse = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
    try {
      setError(null);

      console.log('➕ Criando curso:', courseData);

      // Transform frontend format to backend format
      const backendData: CourseCreatePayload = {
        nome: courseData.title,
        carga_horaria: parseInt(courseData.duration.replace(/\D/g, '')) || 0,
        descricao: courseData.description || undefined
      };
      // Map level to backend enum if provided
      if (courseData.level) {
        const mapToBackend: Record<string, string> = {
          'Iniciante': 'INICIANTE',
          'Intermediário': 'INTERMEDIARIO',
          'Avançado': 'AVANCADO'
        };
        backendData.nivel = mapToBackend[courseData.level] || 'INTERMEDIARIO';
      }
      // Map status to backend enum if provided
      if (courseData.status) {
        const mapToBackend: Record<string, string> = {
          'Ativo': 'ATIVO',
          'Inativo': 'INATIVO',
          'Em Desenvolvimento': 'EM_DESENVOLVIMENTO'
        };
        backendData.status = mapToBackend[courseData.status] || 'ATIVO';
      }

      console.log('➕ Dados para backend:', backendData);

      const response = await CoursesAPI.create(backendData);
      console.log('➕ Resposta do backend:', response);
      console.log('➕ response.data:', response.data);

      const backendCourse = response.data.data; // Backend returns {success, data, message}
      console.log('➕ Backend course:', backendCourse);

      // Transform backend format to frontend format
      const newCourse: Course = {
        id: backendCourse.id,
        title: backendCourse.nome,
        description: backendCourse.descricao || '',
        duration: `${backendCourse.carga_horaria}h`,
        students: 0,
        level: ((): string => {
          const map: Record<string, string> = {
            'INICIANTE': 'Iniciante',
            'INTERMEDIARIO': 'Intermediário',
            'AVANCADO': 'Avançado'
          };
          return backendCourse.nivel ? (map[backendCourse.nivel] || 'Intermediário') : 'Intermediário';
        })(),
        status: ((): string => {
          const map: Record<string, string> = {
            'ATIVO': 'Ativo',
            'INATIVO': 'Inativo',
            'EM_DESENVOLVIMENTO': 'Em Desenvolvimento'
          };
          return backendCourse.status ? (map[backendCourse.status] || 'Ativo') : 'Ativo';
        })(),
        color: 'bg-blue-500'
      };

      console.log('➕ Novo curso transformado:', newCourse);
      setCourses(prev => {
        const updated = [...prev, newCourse];
        console.log('➕ Cursos após adicionar:', updated);
        return updated;
      });

      return newCourse;
    } catch (err: unknown) {
      console.error('Erro ao criar curso:', err);
      if (isAxiosError(err)) {
        console.error('Detalhes do erro:', err.response?.data);
      }
      const errorMessage = getApiErrorMessage(err, 'Erro ao criar curso');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateCourse = async (id: number, courseData: Partial<Course>): Promise<void> => {
    try {
      setError(null);

      console.log('🔧 Atualizando curso:', id, courseData);

      // Transform frontend format to backend format
      const backendData: CourseUpdatePayload = {};
      if (courseData.title) backendData.nome = courseData.title;
      if (courseData.duration) backendData.carga_horaria = parseInt(courseData.duration.replace(/\D/g, '')) || 0;
      if (courseData.description !== undefined) backendData.descricao = courseData.description || undefined;
      if (courseData.level) {
        const mapToBackend: Record<string, string> = {
          'Iniciante': 'INICIANTE',
          'Intermediário': 'INTERMEDIARIO',
          'Avançado': 'AVANCADO'
        };
        backendData.nivel = mapToBackend[courseData.level] || 'INTERMEDIARIO';
      }
      if (courseData.status) {
        const mapToBackend: Record<string, string> = {
          'Ativo': 'ATIVO',
          'Inativo': 'INATIVO',
          'Em Desenvolvimento': 'EM_DESENVOLVIMENTO'
        };
        backendData.status = mapToBackend[courseData.status] || 'ATIVO';
      }

      console.log('🔧 Dados backend:', backendData);

      const response = await CoursesAPI.update(id, backendData);
      console.log('🔧 Resposta do update:', response);

      // Ao invés de atualizar manualmente, recarregar do backend para garantir consistência
      await refreshCourses();

      // Refresh related data
      await refreshClasses();
      await refreshStudents();

    } catch (err: unknown) {
      console.error('❌ Erro ao atualizar curso:', err);
      if (isAxiosError(err)) {
        console.error('Detalhes do erro:', err.response?.data);
      }
      const errorMessage = getApiErrorMessage(err, 'Erro ao atualizar curso');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteCourse = async (id: number): Promise<void> => {
    try {
      setError(null);
      await CoursesAPI.delete(id);

      setCourses(prev => prev.filter(c => c.id !== id));

      // Refresh related data
      await refreshClasses();

    } catch (err: unknown) {
      console.error('Erro ao deletar curso:', err);
      if (isAxiosError(err)) {
        console.error('Detalhes do erro:', err.response?.data);
      }
      const errorMessage = getApiErrorMessage(err, 'Erro ao deletar curso');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getCourseById = (id: number) => courses.find(c => c.id === id);

  const refreshClasses = async () => {
    try {
      const response = await ClassesAPI.list({ limit: 100 });

      const backendClasses = unwrapNestedArray<BackendClass>(response.data);

      const frontendClasses: Class[] = backendClasses.map(bc => {
        const formatDate = (date: string | null) => {
          if (!date) return '';
          // Se já está em formato dd/mm/yyyy, retorna direto
          if (date.includes('/')) return date;
          // Se está em formato yyyy-MM-dd, converte sem usar new Date para evitar problema de timezone
          const parts = date.split('T')[0].split('-'); // Remove hora se tiver e separa
          if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`; // dd/mm/yyyy
          }
          return date;
        };
        // Transformar alunos da turma (se houver) e ajustar contador
        const students = (bc.alunos || []).map(aluno => ({
          id: aluno.id,
          name: aluno.nome,
          matricula: aluno.matricula,
          email: aluno.email,
          status: aluno.status
        }));

        // Pegar primeiro instrutor (se houver)
        const instructor = bc.instrutores && bc.instrutores.length > 0
          ? bc.instrutores[0].nome
          : 'A definir';
        const instructorId = bc.instrutores && bc.instrutores.length > 0
          ? bc.instrutores[0].id
          : undefined;

        // Mapear status do backend para frontend
        const statusMap: Record<string, string> = {
          'ATIVA': 'Ativo',
          'PLANEJADA': 'Planejada',
          'ENCERRADA': 'Concluída',
          'CANCELADA': 'Cancelada'
        };
        const frontendStatus = bc.status ? (statusMap[bc.status] || 'Planejada') : 'Planejada';

        // Mapear turno do backend para formato amigável
        const turnoMap: Record<string, string> = {
          'MANHA': 'Matutino',
          'TARDE': 'Vespertino',
          'NOITE': 'Noturno',
          'INTEGRAL': 'Integral'
        };
        const frontendSchedule = bc.turno ? (turnoMap[bc.turno] || bc.turno) : '';

        return {
          id: bc.id,
          name: bc.nome || '',
          course: bc.curso?.nome || bc.id_curso?.toString() || '',
          instructor: instructor,
          instructorId: instructorId,
          capacity: bc.vagas || 0,
          enrolled: students.length,
          schedule: frontendSchedule,
          duration: '6 meses',
          status: frontendStatus,
          startDate: formatDate(bc.data_inicio),
          endDate: formatDate(bc.data_fim),
          students: students
        };
      });

      setClasses(frontendClasses);
      setError(null);
    } catch (err: unknown) {
      console.error('Erro ao carregar turmas:', err);
      if (isAxiosError(err)) {
        console.error('Detalhes do erro:', err.response?.data);
      }
      setError(getApiErrorMessage(err, 'Erro ao carregar turmas'));
    }
  };

  // Class actions
  const addClass = async (classData: Omit<Class, 'id'>): Promise<Class> => {
    try {
      setError(null);

      // Mapear campos do frontend para o backend
      const scheduleMap: Record<string, string> = {
        'Matutino': 'MANHA',
        'Manhã': 'MANHA',
        'Vespertino': 'TARDE',
        'Tarde': 'TARDE',
        'Noturno': 'NOITE',
        'Noite': 'NOITE',
        'Integral': 'INTEGRAL'
      };

      const parseDate = (dateStr?: string) => {
        if (!dateStr || dateStr.trim() === '') return null;
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        return null;
      };

      const startDate = parseDate(classData.startDate);
      const endDate = parseDate(classData.endDate);

      const course = courses.find(c => c.title === classData.course);
      if (!course) {
        throw new Error(`Curso "${classData.course}" não encontrado`);
      }

      const backendData: ClassCreatePayload = {
        nome: classData.name,
        vagas: classData.capacity || 0,
        status: classData.status === 'Ativo' ? 'ATIVA' :
          classData.status === 'Concluída' ? 'ENCERRADA' :
            classData.status === 'Cancelada' ? 'CANCELADA' :
              'ATIVA',
        turno: scheduleMap[classData.schedule] || 'MANHA',
        id_curso: course.id,
        data_inicio: startDate,
        data_fim: endDate
      };

      console.log('📤 Enviando dados para backend:', backendData);

      const response = await ClassesAPI.create(backendData);
      const newClass = response.data;

      // Associate instructor if provided
      if (classData.instructorId && newClass.id) {
        try {
          await ClassesAPI.addInstructor(newClass.id, classData.instructorId);
          console.log(`✅ Instrutor ${classData.instructorId} associado à turma ${newClass.id}`);
        } catch (error) {
          console.error('Erro ao associar instrutor:', error);
          // Don't throw - allow class creation to succeed
        }
      }

      setClasses(prev => [...prev, newClass]);

      // Refresh to get updated data with instructor
      await refreshClasses();

      return newClass;
    } catch (err: unknown) {
      console.error('Erro ao criar turma:', err);
      if (isAxiosError(err)) {
        console.error('Detalhes do erro:', err.response?.data);
      }
      const errorMessage = getApiErrorMessage(err, 'Erro ao criar turma');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateClass = async (id: number, classData: Partial<Class>): Promise<void> => {
    try {
      setError(null);
      // Map frontend fields to backend fields
      const backendData: ClassUpdatePayload = {};

      if (classData.name) backendData.nome = classData.name;
      // Converter datas no formato dd/mm/yyyy para ISO
      const parseDate = (d?: string) => {
        if (!d || d.trim() === '') return null; // Retorna null para campo vazio
        const parts = d.split('/');
        if (parts.length !== 3) return null;
        const iso = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        return iso;
      };

      const dataInicio = parseDate(classData.startDate as string | undefined);
      const dataFim = parseDate(classData.endDate as string | undefined);
      // Sempre envia as datas (null limpa o campo no backend)
      if (dataInicio !== undefined) backendData.data_inicio = dataInicio;
      if (dataFim !== undefined) backendData.data_fim = dataFim;

      // Map course title to id_curso if possível
      if (classData.course) {
        const selectedCourse = courses.find(c => c.title === classData.course);
        if (selectedCourse) backendData.id_curso = selectedCourse.id;
      }

      // Map capacity to vagas
      if (typeof classData.capacity === 'number') backendData.vagas = classData.capacity;

      // Map schedule to turno
      if (classData.schedule) {
        const scheduleMap: Record<string, string> = {
          'Matutino': 'MANHA',
          'Manhã': 'MANHA',
          'Vespertino': 'TARDE',
          'Tarde': 'TARDE',
          'Noturno': 'NOITE',
          'Noite': 'NOITE',
          'Integral': 'INTEGRAL'
        };
        backendData.turno = scheduleMap[classData.schedule] || 'MANHA';
      }

      // Only call update if we have backend-updatable fields
      if (Object.keys(backendData).length > 0) {
        console.log('🔄 Atualizando campos da turma:', backendData);
        await ClassesAPI.update(id, backendData);
      }

      // Handle status separately via dedicated endpoint
      if (classData.status) {
        // Map frontend display status to backend enum
        const statusMap: Record<string, string> = {
          'Ativo': 'ATIVA',
          'Planejada': 'PLANEJADA',
          'Concluída': 'ENCERRADA',
          'Cancelada': 'CANCELADA'
        };
        const mapped = statusMap[classData.status];

        // Get current class to check if status actually changed
        const currentClass = classes.find(c => c.id === id);
        const currentBackendStatus = currentClass ? statusMap[currentClass.status] : undefined;

        if (mapped && mapped !== currentBackendStatus) {
          console.log('🔄 Atualizando status da turma:', { id, from: currentBackendStatus, to: mapped });
          try {
            await ClassesAPI.updateStatus(id, { status: mapped });
            console.log('✅ Status atualizado com sucesso');
          } catch (statusError) {
            console.error('❌ Erro ao atualizar status da turma:', statusError);
            if (isAxiosError(statusError)) {
              console.error('❌ Detalhes do status:', statusError.response?.data);
            }
            // Don't throw - continue with other updates
          }
        }
      }

      // Handle instructor association if instructorId is provided
      if (classData.instructorId) {
        // Get current class to check if instructor changed
        const currentClass = classes.find(c => c.id === id);

        // If instructor changed, update association
        if (!currentClass || currentClass.instructorId !== classData.instructorId) {
          try {
            // Remove old instructor if exists
            if (currentClass?.instructorId) {
              await ClassesAPI.removeInstructor(id, currentClass.instructorId);
            }
            // Add new instructor
            await ClassesAPI.addInstructor(id, classData.instructorId);
            console.log(`✅ Instrutor ${classData.instructorId} associado à turma ${id}`);
          } catch (error) {
            console.error('Erro ao atualizar instrutor da turma:', error);
            // Don't throw - allow other updates to succeed
          }
        }
      }

      // Update local state: merge changes (keep students etc.)
      setClasses(prev => prev.map(cls =>
        cls.id === id ? { ...cls, ...classData } : cls
      ));

      // Refresh related data
      await refreshStudents();
      await refreshClasses();

    } catch (err: unknown) {
      console.error('Erro ao atualizar turma:', err);
      if (isAxiosError(err)) {
        console.error('Detalhes do erro:', err.response?.data);
      }
      const errorMessage = getApiErrorMessage(err, 'Erro ao atualizar turma');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteClass = async (id: number): Promise<void> => {
    try {
      setError(null);
      await ClassesAPI.delete(id);

      setClasses(prev => prev.filter(c => c.id !== id));

      // Refresh students data
      await refreshStudents();

    } catch (err: unknown) {
      console.error('Erro ao deletar turma:', err);
      if (isAxiosError(err)) {
        console.error('Detalhes do erro:', err.response?.data);
      }
      const errorMessage = getApiErrorMessage(err, 'Erro ao deletar turma');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getClassById = (id: number) => classes.find(c => c.id === id);

  // Utility functions
  const getStudentsByCourse = (courseName: string) =>
    students.filter(s => s.course === courseName);

  const getStudentsByClass = (className: string) =>
    students.filter(s => s.class === className);

  const getClassesByCourse = (courseName: string) =>
    classes.filter(c => c.course === courseName);

  // Instructor actions
  const addInstructor = async (instructorData: Omit<Instructor, 'id'>): Promise<void> => {
    try {
      setError(null);

      const backendData: InstructorPayload = {
        nome: instructorData.name,
        cpf: instructorData.cpf.replace(/\D/g, ''), // Remove formatação
        email: instructorData.email,
        data_nascimento: instructorData.birthDate || null,
        endereco: instructorData.address,
        especialidade: instructorData.specialization,
        experiencia: instructorData.experience,
        status: instructorData.status
      };

      await InstructorsAPI.create(backendData);

      // Recarregar instrutores
      const response = await InstructorsAPI.list();
      const backendInstructors = unwrapNestedArray<BackendInstructor>(response.data);

      const frontendInstructors: Instructor[] = backendInstructors.map(bi => {
        return {
          id: bi.id,
          name: bi.nome || '',
          cpf: bi.cpf || '',
          email: bi.email || '',
          phone: '',
          birthDate: bi.data_nascimento || '',
          address: bi.endereco || '',
          specialization: bi.especialidade || '',
          experience: bi.experiencia || '',
          status: bi.status || 'Ativo',
          classes: []
        };
      });

      setInstructors(frontendInstructors);
    } catch (err: unknown) {
      console.error('Erro ao criar instrutor:', err);
      if (isAxiosError(err)) {
        console.error('Detalhes do erro:', err.response?.data);
      }
      const errorMessage = getApiErrorMessage(err, 'Erro ao criar instrutor');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateInstructor = async (id: number, instructorData: Partial<Instructor>): Promise<void> => {
    try {
      setError(null);

      const backendData: InstructorUpdatePayload = {};
      if (instructorData.name !== undefined) backendData.nome = instructorData.name;
      if (instructorData.cpf !== undefined) backendData.cpf = instructorData.cpf.replace(/\D/g, '');
      if (instructorData.email !== undefined) backendData.email = instructorData.email;
      if (instructorData.birthDate !== undefined) backendData.data_nascimento = instructorData.birthDate || null;
      if (instructorData.address !== undefined) backendData.endereco = instructorData.address;
      if (instructorData.specialization !== undefined) backendData.especialidade = instructorData.specialization;
      if (instructorData.experience !== undefined) backendData.experiencia = instructorData.experience;
      if (instructorData.status !== undefined) backendData.status = instructorData.status;

      console.log('🔄 Atualizando instrutor ID:', id);
      console.log('📤 Dados enviados:', backendData);

      const updateResponse = await InstructorsAPI.update(id, backendData);
      console.log('✅ Resposta da API:', updateResponse.data);

      // Recarregar instrutores
      const response = await InstructorsAPI.list();
      const backendInstructors = unwrapNestedArray<BackendInstructor>(response.data);

      const frontendInstructors: Instructor[] = backendInstructors.map(bi => {
        return {
          id: bi.id,
          name: bi.nome || '',
          cpf: bi.cpf || '',
          email: bi.email || '',
          phone: '',
          birthDate: bi.data_nascimento || '',
          address: bi.endereco || '',
          specialization: bi.especialidade || '',
          experience: bi.experiencia || '',
          status: bi.status || 'Ativo',
          classes: []
        };
      });

      setInstructors(frontendInstructors);
    } catch (err: unknown) {
      console.error('Erro ao atualizar instrutor:', err);
      if (isAxiosError(err)) {
        console.error('Detalhes do erro:', err.response?.data);
      }
      const errorMessage = getApiErrorMessage(err, 'Erro ao atualizar instrutor');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteInstructor = async (id: number): Promise<void> => {
    try {
      setError(null);
      await InstructorsAPI.delete(id);

      setInstructors(prev => prev.filter(i => i.id !== id));
    } catch (err: unknown) {
      console.error('Erro ao deletar instrutor:', err);
      if (isAxiosError(err)) {
        console.error('Detalhes do erro:', err.response?.data);
      }
      const errorMessage = getApiErrorMessage(err, 'Erro ao deletar instrutor');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getInstructorById = (id: number) => instructors.find(i => i.id === id);

  const refreshCandidates = async () => {
    try {
      const response = await CandidatesAPI.list({ limit: 100, page: 1 });

      // Extrair e transformar candidatos
      let backendCandidates = [];
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data)) {
          backendCandidates = response.data;
        } else if (response.data.data && Array.isArray(response.data.data.data)) {
          backendCandidates = response.data.data.data;
        } else if (Array.isArray(response.data.data)) {
          backendCandidates = response.data.data;
        }
      }

      setCandidates(backendCandidates);
      setError(null);
    } catch (err: unknown) {
      console.error('Erro ao carregar candidatos:', err);
      if (isAxiosError(err)) {
        console.error('Detalhes do erro:', err.response?.data);
      }
      setError(getApiErrorMessage(err, 'Erro ao carregar candidatos'));
    }
  };

  const value: AppContextType = {
    students,
    courses,
    classes,
    instructors,
    candidates,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    transferStudentToWaitingList,
    getStudentById,
    refreshStudents,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    refreshCourses,
    addClass,
    updateClass,
    deleteClass,
    getClassById,
    refreshClasses,
    addInstructor,
    updateInstructor,
    deleteInstructor,
    getInstructorById,
    refreshCandidates,
    getStudentsByCourse,
    getStudentsByClass,
    getClassesByCourse,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
