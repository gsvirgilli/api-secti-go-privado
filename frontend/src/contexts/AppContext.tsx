import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudentsAPI, CoursesAPI, ClassesAPI, InstructorsAPI, CandidatesAPI } from '@/lib/api';

// Types
export interface Student {
  id: number;
  matricula: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  enrollmentDate: string;
  status: string;
  course: string;
  class: string;
  progress: number;
  attendance: number;
  grades: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  students: number;
  level: string;
  status: string;
  color: string;
}

export interface Class {
  id: number;
  name: string;
  course: string;
  instructor: string;
  instructorId?: number; // ID do instrutor associado
  capacity: number;
  enrolled: number;
  schedule: string;
  duration: string;
  status: string;
  startDate: string;
  endDate: string;
  students: Array<{
    id: number;
    name: string;
    status: string;
  }>;
}

export interface Instructor {
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
  classes: Array<{
    id: number;
    name: string;
    course: string;
  }>;
}

interface AppContextType {
  // Data
  students: Student[];
  courses: Course[];
  classes: Class[];
  instructors: Instructor[];
  candidates: any[];
  loading: boolean;
  error: string | null;

  // Student actions
  addStudent: (student: Omit<Student, 'id'>) => Promise<Student>;
  updateStudent: (id: number, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: number) => Promise<void>;
  transferStudentToWaitingList: (id: number, motivo?: string) => Promise<void>;
  getStudentById: (id: number) => Student | undefined;
  refreshStudents: () => Promise<void>;

  // Course actions
  addCourse: (course: Omit<Course, 'id'>) => Promise<Course>;
  updateCourse: (id: number, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: number) => Promise<void>;
  getCourseById: (id: number) => Course | undefined;
  refreshCourses: () => Promise<void>;

  // Class actions
  addClass: (classData: Omit<Class, 'id'>) => Promise<Class>;
  updateClass: (id: number, classData: Partial<Class>) => Promise<void>;
  deleteClass: (id: number) => Promise<void>;
  getClassById: (id: number) => Class | undefined;
  refreshClasses: () => Promise<void>;

  // Instructor actions
  addInstructor: (instructor: Omit<Instructor, 'id'>) => Promise<void>;
  updateInstructor: (id: number, instructor: Partial<Instructor>) => Promise<void>;
  deleteInstructor: (id: number) => Promise<void>;
  getInstructorById: (id: number) => Instructor | undefined;
  refreshCandidates: () => Promise<void>;

  // Utils
  getStudentsByCourse: (courseName: string) => Student[];
  getStudentsByClass: (className: string) => Student[];
  getClassesByCourse: (courseName: string) => Class[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial data
const initialStudents: Student[] = [
  {
    id: 1,
    name: "Maria Conceição de Melo",
    cpf: "123.456.789-00",
    email: "maria.melo@email.com",
    phone: "(11) 99999-9999",
    birthDate: "15/03/1995",
    address: "Rua das Flores, 123",
    enrollmentDate: "01/02/2024",
    status: "Ativo",
    course: "Robótica",
    class: "TURMA A",
    progress: 85,
    attendance: 92,
    grades: 8.5
  },
  {
    id: 1,
    name: "Maria Conceição de Melo",
    cpf: "123.456.789-00",
    email: "maria.melo@email.com",
    phone: "(11) 99999-9999",
    birthDate: "15/03/1995",
    address: "Rua das Flores, 123",
    enrollmentDate: "01/02/2024",
    status: "Ativo",
    course: "Robótica",
    class: "TURMA A",
    progress: 85,
    attendance: 92,
    grades: 8.5
  },
  {
    id: 2,
    name: "João Conceição de Melo",
    cpf: "987.654.321-00",
    email: "joao.melo@email.com",
    phone: "(11) 98888-8888",
    birthDate: "20/07/1990",
    address: "Av. Central, 456",
    enrollmentDate: "15/01/2024",
    status: "Ativo",
    course: "Informática",
    class: "TURMA B",
    progress: 78,
    attendance: 88,
    grades: 7.8
  },
  {
    id: 3,
    name: "Ana Conceição de Melo",
    cpf: "456.789.123-00",
    email: "ana.melo@email.com",
    phone: "(11) 97777-7777",
    birthDate: "10/12/1998",
    address: "Rua Nova, 789",
    enrollmentDate: "01/03/2024",
    status: "Ativo",
    course: "Programação",
    class: "TURMA C",
    progress: 92,
    attendance: 95,
    grades: 9.2
  },
  {
    id: 4,
    name: "Pedro Conceição de Melo",
    cpf: "789.123.456-00",
    email: "pedro.melo@email.com",
    phone: "(11) 96666-6666",
    birthDate: "05/09/1985",
    address: "Praça da Paz, 321",
    enrollmentDate: "10/11/2023",
    status: "Inativo",
    course: "Web Design",
    class: "TURMA D",
    progress: 65,
    attendance: 70,
    grades: 6.5
  },
  {
    id: 5,
    name: "Carlos Silva Santos",
    cpf: "321.654.987-00",
    email: "carlos.santos@email.com",
    phone: "(11) 95555-5555",
    birthDate: "12/01/1992",
    address: "Rua das Palmeiras, 654",
    enrollmentDate: "05/02/2024",
    status: "Ativo",
    course: "Robótica",
    class: "TURMA A",
    progress: 88,
    attendance: 90,
    grades: 8.8
  }
];

const initialCourses: Course[] = [
  {
    id: 1,
    title: "Robótica",
    description: "Curso básico de robótica",
    duration: "120h",
    students: 35,
    level: "Básico",
    status: "Ativo",
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Informática",
    description: "Curso básico de informática",
    duration: "80h",
    students: 25,
    level: "Básico",
    status: "Ativo",
    color: "bg-emerald-500"
  },
  {
    id: 3,
    title: "Introdução à Informática",
    description: "Curso introdutório de informática básica",
    duration: "60h",
    students: 42,
    level: "Iniciante",
    status: "Ativo",
    color: "bg-purple-500"
  },
  {
    id: 4,
    title: "Programação",
    description: "Programação avançada em Python",
    duration: "100h",
    students: 18,
    level: "Avançado",
    status: "Ativo",
    color: "bg-orange-500"
  },
  {
    id: 5,
    title: "Web Design",
    description: "Web Design e UX/UI",
    duration: "90h",
    students: 28,
    level: "Intermediário",
    status: "Ativo",
    color: "bg-pink-500"
  },
  {
    id: 6,
    title: "Python",
    description: "Banco de dados e SQL",
    duration: "70h",
    students: 22,
    level: "Intermediário",
    status: "Ativo",
    color: "bg-indigo-500"
  }
];

const initialClasses: Class[] = [
  {
    id: 1,
    name: "TURMA A",
    course: "Robótica",
    instructor: "Instrutor A",
    capacity: 20,
    enrolled: 15,
    schedule: "Segunda a Sexta - 14h às 17h",
    duration: "120h",
    status: "Ativo",
    startDate: "01/04/2025",
    endDate: "30/08/2025",
    students: [
      { id: 1, name: "Maria Conceição de Melo", status: "Ativo" },
      { id: 5, name: "Carlos Silva Santos", status: "Ativo" },
    ]
  },
  {
    id: 2,
    name: "TURMA B",
    course: "Informática",
    instructor: "Instrutor B",
    capacity: 25,
    enrolled: 18,
    schedule: "Segunda a Sexta - 8h às 11h",
    duration: "80h",
    status: "Ativo",
    startDate: "15/03/2025",
    endDate: "15/07/2025",
    students: [
      { id: 2, name: "João Conceição de Melo", status: "Ativo" },
    ]
  },
  {
    id: 3,
    name: "TURMA C",
    course: "Programação",
    instructor: "Instrutor C",
    capacity: 15,
    enrolled: 12,
    schedule: "Terça e Quinta - 19h às 22h",
    duration: "100h",
    status: "Ativo",
    startDate: "05/02/2025",
    endDate: "05/08/2025",
    students: [
      { id: 3, name: "Ana Conceição de Melo", status: "Ativo" },
    ]
  },
  {
    id: 4,
    name: "TURMA D",
    course: "Web Design",
    instructor: "Instrutor D",
    capacity: 20,
    enrolled: 20,
    schedule: "Segunda a Sexta - 9h às 12h",
    duration: "90h",
    status: "Concluída",
    startDate: "10/09/2024",
    endDate: "10/12/2024",
    students: [
      { id: 4, name: "Pedro Conceição de Melo", status: "Concluído" },
    ]
  },
  {
    id: 5,
    name: "TURMA E",
    course: "Python",
    instructor: "Instrutor E",
    capacity: 18,
    enrolled: 8,
    schedule: "Sábados - 8h às 17h",
    duration: "70h",
    status: "Planejada",
    startDate: "01/06/2025",
    endDate: "01/10/2025",
    students: []
  }
];

const initialInstructors: Instructor[] = [
  {
    id: 1,
    name: "Instrutor A",
    cpf: "111.222.333-44",
    email: "instrutor.a@sukatech.com",
    phone: "(11) 99999-1111",
    birthDate: "15/05/1980",
    address: "Rua dos Professores, 100",
    specialization: "Robótica e Automação",
    experience: "8 anos",
    status: "Ativo",
    classes: [
      { id: 1, name: "Turma A - Robótica", course: "Robótica" },
      { id: 2, name: "Turma C - Automação", course: "Automação" }
    ]
  },
  {
    id: 2,
    name: "Instrutor B",
    cpf: "222.333.444-55",
    email: "instrutor.b@sukatech.com",
    phone: "(11) 99999-2222",
    birthDate: "22/08/1975",
    address: "Av. Educação, 200",
    specialization: "Informática e Programação",
    experience: "12 anos",
    status: "Ativo",
    classes: [
      { id: 3, name: "Turma B - Informática", course: "Informática" }
    ]
  },
  {
    id: 3,
    name: "Instrutor C",
    cpf: "333.444.555-66",
    email: "instrutor.c@sukatech.com",
    phone: "(11) 99999-3333",
    birthDate: "10/12/1985",
    address: "Rua do Conhecimento, 300",
    specialization: "Web Design e UX/UI",
    experience: "6 anos",
    status: "Ativo",
    classes: [
      { id: 4, name: "Turma D - Web Design", course: "Web Design" }
    ]
  },
  {
    id: 4,
    name: "Instrutor D",
    cpf: "444.555.666-77",
    email: "instrutor.d@sukatech.com",
    phone: "(11) 99999-4444",
    birthDate: "03/03/1990",
    address: "Praça da Tecnologia, 400",
    specialization: "Python e Data Science",
    experience: "4 anos",
    status: "Ativo",
    classes: [
      { id: 5, name: "Turma E - Python", course: "Programação Python" }
    ]
  },
  {
    id: 5,
    name: "Instrutor E",
    cpf: "555.666.777-88",
    email: "instrutor.e@sukatech.com",
    phone: "(11) 99999-5555",
    birthDate: "18/07/1982",
    address: "Alameda dos Mestres, 500",
    specialization: "Banco de Dados",
    experience: "10 anos",
    status: "Inativo",
    classes: []
  }
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
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
          let uniqueCourses: any[] = [];
          let currentPage = 1;
          let hasMore = true;

          while (hasMore && currentPage <= 10) {
            const response = await CoursesAPI.list({ page: currentPage, limit: 100 });
            const pageData = response.data?.data?.data || [];
            const pagination = response.data?.data?.pagination;

            // Filtrar apenas cursos novos (não duplicados)
            const newCourses = pageData.filter((course: any) => {
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
        let backendStudents = [];
        if (studentsRes.data && typeof studentsRes.data === 'object') {
          if (Array.isArray(studentsRes.data)) {
            backendStudents = studentsRes.data;
          } else if (studentsRes.data.data && Array.isArray(studentsRes.data.data.data)) {
            backendStudents = studentsRes.data.data.data;
          } else if (Array.isArray(studentsRes.data.data)) {
            backendStudents = studentsRes.data.data;
          }
        }

        // Transformar students do backend para formato frontend
        const frontendStudents: Student[] = backendStudents.map((bs: any) => {
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
        let backendCourses = [];
        if (coursesRes.data && typeof coursesRes.data === 'object') {
          if (Array.isArray(coursesRes.data)) {
            // Se data já é um array direto
            backendCourses = coursesRes.data;
          } else if (coursesRes.data.data && Array.isArray(coursesRes.data.data.data)) {
            // Se tem paginação: data.data.data
            backendCourses = coursesRes.data.data.data;
          } else if (Array.isArray(coursesRes.data.data)) {
            // Se data.data é array direto
            backendCourses = coursesRes.data.data;
          }
        }

        const frontendCourses: Course[] = backendCourses.map((bc: any) => {
          // Contar alunos de todas as turmas deste curso
          let totalStudents = 0;
          if (bc.turmas && Array.isArray(bc.turmas)) {
            totalStudents = bc.turmas.reduce((sum: number, turma: any) => {
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

        setCourses(frontendCourses);

        // Garantir que classes seja um array e transformar do backend para frontend
        let backendClasses = [];
        if (classesRes.data && typeof classesRes.data === 'object') {
          if (Array.isArray(classesRes.data)) {
            backendClasses = classesRes.data;
          } else if (classesRes.data.data && Array.isArray(classesRes.data.data.data)) {
            backendClasses = classesRes.data.data.data;
          } else if (Array.isArray(classesRes.data.data)) {
            backendClasses = classesRes.data.data;
          }
        }

        // Transformar classes do backend para formato frontend
        const frontendClasses: Class[] = backendClasses.map((bc: any) => {
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
          const students = (bc.alunos || []).map((aluno: any) => ({
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
        let backendInstructors = [];
        if (instructorsRes.data && typeof instructorsRes.data === 'object') {
          if (Array.isArray(instructorsRes.data)) {
            backendInstructors = instructorsRes.data;
          } else if (Array.isArray(instructorsRes.data.data)) {
            backendInstructors = instructorsRes.data.data;
          }
        }

        const frontendInstructors: Instructor[] = backendInstructors.map((bi: any) => {
          const formatDate = (date: string | null) => {
            if (!date) return '';
            const d = new Date(date);
            return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
          };

          // Mapear turmas associadas
          const classes = (bi.turmas || []).map((turma: any) => ({
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
        let backendCandidates = [];
        if (candidatesRes.data && typeof candidatesRes.data === 'object') {
          if (Array.isArray(candidatesRes.data)) {
            backendCandidates = candidatesRes.data;
          } else if (candidatesRes.data.data && Array.isArray(candidatesRes.data.data.data)) {
            backendCandidates = candidatesRes.data.data.data;
          } else if (Array.isArray(candidatesRes.data.data)) {
            backendCandidates = candidatesRes.data.data;
          }
        }

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

      // Extrair e transformar students
      let backendStudents = [];
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data)) {
          backendStudents = response.data;
        } else if (response.data.data && Array.isArray(response.data.data.data)) {
          backendStudents = response.data.data.data;
        } else if (Array.isArray(response.data.data)) {
          backendStudents = response.data.data;
        }
      }

      const frontendStudents: Student[] = backendStudents.map((bs: any) => {
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

        // Formatar turno para exibição
        const formatTurno = (turno: string) => {
          const turnoMap: Record<string, string> = {
            'MANHA': 'Matutino',
            'TARDE': 'Vespertino',
            'NOITE': 'Noturno',
            'INTEGRAL': 'Integral'
          };
          return turnoMap[turno] || turno;
        };

        // Montar nome da turma com turno
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
    } catch (err: any) {
      console.error('Erro ao carregar alunos:', err);
      setError(err.response?.data?.message || 'Erro ao carregar alunos');
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

      const backendStudent = response.data.data; // Backend returns { success, data, message }
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
    } catch (err: any) {
      console.error('Erro ao criar aluno:', err);
      console.error('Detalhes do erro:', err.response?.data);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Erro ao criar aluno';
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
      const error = err as { response?: { data?: { error?: string; message?: string; details?: any } } };
      console.error('❌ Resposta do servidor:', error.response?.data);
      console.error('❌ Detalhes da validação:', JSON.stringify(error.response?.data?.details, null, 2));
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Erro ao atualizar aluno';
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

    } catch (err: any) {
      console.error('Erro ao deletar aluno:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao deletar aluno';
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

    } catch (err: any) {
      console.error('Erro ao transferir aluno para lista de espera:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Erro ao transferir aluno para lista de espera';
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

      // Backend retorna { success, data: { data: [...], pagination: {...} }, message }
      let backendCourses = [];
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data)) {
          backendCourses = response.data;
        } else if (response.data.data && Array.isArray(response.data.data.data)) {
          // Com paginação: data.data.data
          backendCourses = response.data.data.data;
        } else if (Array.isArray(response.data.data)) {
          backendCourses = response.data.data;
        }
      }
      console.log('🔍 Backend courses:', backendCourses);
      console.log('🔍 É array?', Array.isArray(backendCourses));

      // Transform backend format to frontend format
      const frontendCourses: Course[] = backendCourses.map((bc: any) => {
        // Contar alunos de todas as turmas deste curso
        let totalStudents = 0;
        if (bc.turmas && Array.isArray(bc.turmas)) {
          totalStudents = bc.turmas.reduce((sum: number, turma: any) => {
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
    } catch (err: any) {
      console.error('Erro ao carregar cursos:', err);
      setError(err.response?.data?.message || 'Erro ao carregar cursos');
    }
  };

  // Course actions
  const addCourse = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
    try {
      setError(null);

      console.log('➕ Criando curso:', courseData);

      // Transform frontend format to backend format
      const backendData: any = {
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

      const backendCourse = response.data.data; // Backend returns { success, data, message }
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
    } catch (err: any) {
      console.error('Erro ao criar curso:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao criar curso';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateCourse = async (id: number, courseData: Partial<Course>): Promise<void> => {
    try {
      setError(null);

      console.log('🔧 Atualizando curso:', id, courseData);

      // Transform frontend format to backend format
      const backendData: any = {};
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

    } catch (err: any) {
      console.error('❌ Erro ao atualizar curso:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar curso';
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

    } catch (err: any) {
      console.error('Erro ao deletar curso:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao deletar curso';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getCourseById = (id: number) => courses.find(c => c.id === id);

  const refreshClasses = async () => {
    try {
      const response = await ClassesAPI.list({ limit: 100 });

      // Extrair e transformar classes
      let backendClasses = [];
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data)) {
          backendClasses = response.data;
        } else if (response.data.data && Array.isArray(response.data.data.data)) {
          backendClasses = response.data.data.data;
        } else if (Array.isArray(response.data.data)) {
          backendClasses = response.data.data;
        }
      }

      const frontendClasses: Class[] = backendClasses.map((bc: any) => {
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
        const students = (bc.alunos || []).map((aluno: any) => ({
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
    } catch (err: any) {
      console.error('Erro ao carregar turmas:', err);
      setError(err.response?.data?.message || 'Erro ao carregar turmas');
    }
  };

  // Class actions
  const addClass = async (classData: Omit<Class, 'id'>): Promise<Class> => {
    try {
      setError(null);

      // Mapear campos do frontend para o backend
      const backendData: any = {
        nome: classData.name,
        vagas: classData.capacity || 0,
        status: classData.status === 'Ativo' ? 'ATIVA' :
          classData.status === 'Concluída' ? 'ENCERRADA' :
            classData.status === 'Cancelada' ? 'CANCELADA' :
              'ATIVA', // Default para "Planejada" vira ATIVA
      };

      // Mapear turno baseado no schedule ou usar default
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

      // Buscar ID do curso pelo nome
      const course = courses.find(c => c.title === classData.course);
      if (!course) {
        throw new Error(`Curso "${classData.course}" não encontrado`);
      }
      backendData.id_curso = course.id;

      // Converter datas se fornecidas
      const parseDate = (dateStr?: string) => {
        if (!dateStr || dateStr.trim() === '') return null;
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        return null;
      };

      backendData.data_inicio = parseDate(classData.startDate);
      backendData.data_fim = parseDate(classData.endDate);

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
    } catch (err: any) {
      console.error('Erro ao criar turma:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao criar turma';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateClass = async (id: number, classData: Partial<Class>): Promise<void> => {
    try {
      setError(null);
      // Map frontend fields to backend fields
      const backendData: any = {};

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
            console.error('❌ Erro ao atualizar status:', (statusError as any)?.response?.data);
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

    } catch (err: any) {
      console.error('Erro ao atualizar turma:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar turma';
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

    } catch (err: any) {
      console.error('Erro ao deletar turma:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Erro ao deletar turma';
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

      const backendData = {
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
      let backendInstructors = [];
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data)) {
          backendInstructors = response.data;
        } else if (Array.isArray(response.data.data)) {
          backendInstructors = response.data.data;
        }
      }

      const frontendInstructors: Instructor[] = backendInstructors.map((bi: any) => {
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
    } catch (err: any) {
      console.error('Erro ao criar instrutor:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao criar instrutor';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateInstructor = async (id: number, instructorData: Partial<Instructor>): Promise<void> => {
    try {
      setError(null);

      const backendData: any = {};
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
      let backendInstructors = [];
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data)) {
          backendInstructors = response.data;
        } else if (Array.isArray(response.data.data)) {
          backendInstructors = response.data.data;
        }
      }

      const frontendInstructors: Instructor[] = backendInstructors.map((bi: any) => {
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
    } catch (err: any) {
      console.error('Erro ao atualizar instrutor:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar instrutor';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteInstructor = async (id: number): Promise<void> => {
    try {
      setError(null);
      await InstructorsAPI.delete(id);

      setInstructors(prev => prev.filter(i => i.id !== id));
    } catch (err: any) {
      console.error('Erro ao deletar instrutor:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao deletar instrutor';
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
    } catch (err: any) {
      console.error('Erro ao carregar candidatos:', err);
      setError(err.response?.data?.message || 'Erro ao carregar candidatos');
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

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};