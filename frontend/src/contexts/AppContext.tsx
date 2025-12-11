import { useState, useEffect, ReactNode } from 'react';
import { isAxiosError } from 'axios';
import { StudentsAPI, CoursesAPI, ClassesAPI, InstructorsAPI, CandidatesAPI } from '@/lib/api';
import { AUTH_CHANGE_EVENT } from '@/lib/authEvents';
import { AppContext, AppContextType, unwrapNestedArray, getApiErrorMessage } from '@/contexts/appContextCore';
import type { Student, Course, Class, Instructor, Candidate } from '@/types/appContext';

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

const COURSE_LEVEL_LABELS: Record<string, string> = {
  INICIANTE: 'Iniciante',
  INTERMEDIARIO: 'Intermediário',
  AVANCADO: 'Avançado'
};

const COURSE_LEVEL_VALUES: Record<string, string> = {
  Iniciante: 'INICIANTE',
  'Intermediário': 'INTERMEDIARIO',
  Avançado: 'AVANCADO'
};

const COURSE_STATUS_LABELS: Record<string, string> = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  EM_DESENVOLVIMENTO: 'Em Desenvolvimento'
};

const COURSE_STATUS_VALUES: Record<string, string> = {
  Ativo: 'ATIVO',
  Inativo: 'INATIVO',
  'Em Desenvolvimento': 'EM_DESENVOLVIMENTO'
};

const CLASS_STATUS_LABELS: Record<string, string> = {
  ATIVA: 'Ativo',
  PLANEJADA: 'Planejada',
  ENCERRADA: 'Concluída',
  CANCELADA: 'Cancelada'
};

const CLASS_STATUS_VALUES: Record<string, string> = {
  Ativo: 'ATIVA',
  Planejada: 'PLANEJADA',
  'Concluída': 'ENCERRADA',
  Cancelada: 'CANCELADA'
};

const SHIFT_LABELS: Record<string, string> = {
  MANHA: 'Matutino',
  TARDE: 'Vespertino',
  NOITE: 'Noturno',
  INTEGRAL: 'Integral'
};

const SHIFT_VALUES: Record<string, string> = {
  Matutino: 'MANHA',
  'Manhã': 'MANHA',
  Vespertino: 'TARDE',
  Tarde: 'TARDE',
  Noturno: 'NOITE',
  Noite: 'NOITE',
  Integral: 'INTEGRAL'
};

const formatDate = (value?: string | null) => {
  if (!value) return '';
  if (value.includes('/')) return value;
  const isoPortion = value.split('T')[0];
  const [year, month, day] = isoPortion.split('-');
  if (year && month && day) {
    return `${day}/${month}/${year}`;
  }
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return `${String(parsed.getDate()).padStart(2, '0')}/${String(parsed.getMonth() + 1).padStart(2, '0')}/${parsed.getFullYear()}`;
  }
  return '';
};

const normalizeStatus = (status?: string, fallback = 'Ativo') => {
  if (!status) return fallback;
  const normalized = status.toLowerCase();
  return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`;
};

const getClassScheduleLabel = (turno?: string) => SHIFT_LABELS[turno ?? ''] || (turno || '');

const getClassStatusLabel = (status?: string) => CLASS_STATUS_LABELS[status ?? ''] || 'Planejada';

const mapCourseLevel = (nivel?: string) => COURSE_LEVEL_LABELS[nivel ?? ''] || 'Intermediário';

const mapCourseStatus = (status?: string) => COURSE_STATUS_LABELS[status ?? ''] || 'Ativo';

const backendCourseLevelValue = (label?: string) => COURSE_LEVEL_VALUES[label ?? ''] || 'INTERMEDIARIO';

const backendCourseStatusValue = (label?: string) => COURSE_STATUS_VALUES[label ?? ''] || 'ATIVO';

const backendClassStatusValue = (label?: string) => CLASS_STATUS_VALUES[label ?? ''] || 'ATIVA';

const backendScheduleValue = (label?: string) => SHIFT_VALUES[label ?? ''] || 'MANHA';

const buildStudentClassName = (turma?: BackendStudent['turma']) => {
  if (!turma?.nome) return 'Sem turma';
  const turnoLabel = getClassScheduleLabel(turma.turno);
  return turnoLabel ? `${turma.nome} - ${turnoLabel}` : turma.nome;
};

const mapBackendStudent = (student: BackendStudent): Student => ({
  id: student.id ?? 0,
  matricula: student.matricula || '',
  name: student.nome || '',
  cpf: student.cpf || '',
  email: student.email || '',
  phone: student.telefone || '',
  birthDate: formatDate(student.data_nascimento),
  address: student.endereco || '',
  enrollmentDate: formatDate(student.createdAt),
  status: normalizeStatus(student.status),
  course: student.turma?.curso?.nome || '',
  class: buildStudentClassName(student.turma),
  progress: 0,
  attendance: 0,
  grades: 0
});

const countCourseStudents = (turmas?: BackendCourseTurma[]) => {
  if (!turmas) return 0;
  return turmas.reduce((sum, turma) => sum + (turma.alunos?.length ?? 0), 0);
};

const mapBackendCourse = (course: BackendCourse): Course => ({
  id: course.id ?? 0,
  title: course.nome || '',
  description: course.descricao || '',
  duration: `${course.carga_horaria ?? 0}h`,
  students: countCourseStudents(course.turmas),
  level: mapCourseLevel(course.nivel),
  status: mapCourseStatus(course.status),
  color: 'bg-blue-500'
});

const mapClassStudents = (alunos?: BackendClass['alunos']) =>
  (alunos || []).map(aluno => ({
    id: aluno.id ?? 0,
    name: aluno.nome || '',
    status: normalizeStatus(aluno.status, '')
  }));

const mapBackendClass = (classData: BackendClass): Class => {
  const instructors = classData.instrutores || [];
  const firstInstructor = instructors.length > 0 ? instructors[0] : undefined;

  return {
    id: classData.id ?? 0,
    name: classData.nome || '',
    course: classData.curso?.nome || (classData.id_curso?.toString() || ''),
    instructor: firstInstructor?.nome || 'A definir',
    instructorId: firstInstructor?.id,
    instructors: instructors.map(i => ({ id: i.id, name: i.nome })),
    instructorIds: instructors.map(i => i.id),
    capacity: classData.vagas || 0,
    enrolled: (classData.alunos?.length ?? 0),
    schedule: getClassScheduleLabel(classData.turno),
    duration: '6 meses',
    status: getClassStatusLabel(classData.status),
    startDate: formatDate(classData.data_inicio),
    endDate: formatDate(classData.data_fim),
    students: mapClassStudents(classData.alunos)
  };
};

const mapBackendInstructor = (instructor: BackendInstructor): Instructor => ({
  id: instructor.id ?? 0,
  name: instructor.nome || '',
  cpf: instructor.cpf || '',
  email: instructor.email || '',
  phone: instructor.telefone || '',
  birthDate: formatDate(instructor.data_nascimento),
  address: instructor.endereco || '',
  specialization: instructor.especialidade || '',
  experience: instructor.experiencia || '',
  status: normalizeStatus(instructor.status),
  classes: (instructor.turmas || []).map(turma => ({
    id: turma.id ?? 0,
    name: turma.nome || '',
    course: turma.curso?.nome || ''
  }))
});

const parseDateInput = (value?: string) => {
  if (!value) return null;
  const parts = value.split('/');
  if (parts.length !== 3) return null;
  return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
};

const logAxiosError = (error: unknown) => {
  if (isAxiosError(error)) {
    console.error('Detalhes do erro na API:', error.response?.data);
  }
};

const buildErrorMessage = (error: unknown, message: string) => {
  console.error(message, error);
  logAxiosError(error);
  return getApiErrorMessage(error, message);
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authReloadTrigger, setAuthReloadTrigger] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAuthChange = () => {
      setAuthReloadTrigger(prev => prev + 1);
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  }, []);

  // Carregar dados da API sempre que o estado de autenticação mudar
  useEffect(() => {
    async function loadData() {
      const publicPaths = ['/login', '/register', '/reset-password', '/new-password'];
      const isPublicPath = typeof window === 'undefined'
        ? false
        : publicPaths.some(path => window.location.pathname.includes(path));

      if (isPublicPath) {
        setStudents([]);
        setCourses([]);
        setClasses([]);
        setInstructors([]);
        setCandidates([]);
        setLoading(false);
        return;
      }

      const token = typeof window === 'undefined'
        ? null
        : localStorage.getItem('@sukatech:token');
      if (!token) {
        setStudents([]);
        setCourses([]);
        setClasses([]);
        setInstructors([]);
        setCandidates([]);
        setLoading(false);
        return;
      }

      const loadAllCourses = async () => {
        const seenIds = new Set<number | undefined>();
        let uniqueCourses: BackendCourse[] = [];
        let currentPage = 1;
        let hasMore = true;

        while (hasMore && currentPage <= 10) {
          const response = await CoursesAPI.list({ page: currentPage, limit: 100 });
          const pageData = unwrapNestedArray<BackendCourse>(response.data);
          const pagination = response.data?.data?.pagination;

          const newCourses = pageData.filter((course) => {
            if (seenIds.has(course.id)) {
              return false;
            }
            seenIds.add(course.id);
            return true;
          });

          uniqueCourses = [...uniqueCourses, ...newCourses];

          if (newCourses.length === 0) {
            break;
          }

          hasMore = pagination?.hasNextPage || false;
          currentPage++;
        }

        return { data: { data: { data: uniqueCourses } } };
      };

      try {
        setLoading(true);

        const [studentsRes, coursesRes, classesRes, instructorsRes, candidatesRes] = await Promise.all([
          StudentsAPI.list({ limit: 100, page: 1 }).catch(() => ({ data: [] })),
          loadAllCourses().catch(() => ({ data: { data: { data: [] } } })),
          ClassesAPI.list({ limit: 100, page: 1 }).catch(() => ({ data: [] })),
          InstructorsAPI.list().catch(() => ({ data: [] })),
          CandidatesAPI.list({ limit: 100, page: 1 }).catch(() => ({ data: [] }))
        ]);

        const backendStudents = unwrapNestedArray<BackendStudent>(studentsRes.data);
        setStudents(backendStudents.map(mapBackendStudent));

        const backendCourses = unwrapNestedArray<BackendCourse>(coursesRes.data);
        setCourses(backendCourses.map(mapBackendCourse));

        const backendClasses = unwrapNestedArray<BackendClass>(classesRes.data);
        setClasses(backendClasses.map(mapBackendClass));

        const backendInstructors = unwrapNestedArray<BackendInstructor>(instructorsRes.data);
        setInstructors(backendInstructors.map(mapBackendInstructor));

        const backendCandidates = unwrapNestedArray<BackendCandidate>(candidatesRes.data);
        setCandidates(backendCandidates);
        setError(null);
      } catch (error) {
        const errorMessage = buildErrorMessage(error, 'Erro ao carregar dados');
        setError(errorMessage);
        setStudents([]);
        setCourses([]);
        setClasses([]);
        setInstructors([]);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [authReloadTrigger]);

  // Adicionar listener para detectar quando o token é adicionado/removido
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === '@sukatech:token') {
        setAuthReloadTrigger(prev => prev + 1);
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
      setStudents(backendStudents.map(mapBackendStudent));
      setError(null);
    } catch (err: unknown) {
      const errorMessage = buildErrorMessage(err, 'Erro ao carregar alunos');
      setError(errorMessage);
    }
  };

  // Student actions
  const addStudent = async (studentData: Omit<Student, 'id'>): Promise<Student> => {
    try {
      setError(null);
      const selectedCourse = courses.find(c => c.title === studentData.course);
      const selectedClass = classes.find(c => c.name === studentData.class);

      const backendData = {
        nome: studentData.name,
        cpf: studentData.cpf.replace(/\D/g, ''),
        email: studentData.email,
        telefone: studentData.phone || null,
        data_nascimento: studentData.birthDate || null,
        endereco: studentData.address || null,
        id_curso: selectedCourse?.id ?? null,
        id_turma: selectedClass?.id ?? null,
        status: 'ativo'
      };

      const response = await StudentsAPI.create(backendData);
      const backendStudent = response.data.data;
      const newStudent = mapBackendStudent(backendStudent);

      setStudents(prev => [...prev, newStudent]);
      await refreshClasses();
      await refreshCourses();

      return newStudent;
    } catch (err: unknown) {
      const errorMessage = buildErrorMessage(err, 'Erro ao criar aluno');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateStudent = async (id: number, studentData: Partial<Student>): Promise<void> => {
    try {
      setError(null);

      const backendData: Record<string, unknown> = {};
      if (studentData.name !== undefined) backendData.nome = studentData.name;
      if (studentData.email !== undefined) backendData.email = studentData.email;
      if (studentData.phone !== undefined) backendData.telefone = studentData.phone;
      if (studentData.birthDate !== undefined) backendData.data_nascimento = studentData.birthDate;
      if (studentData.address !== undefined) backendData.endereco = studentData.address;

      if (studentData.class !== undefined) {
        if (studentData.class === '' || studentData.class === null) {
          backendData.turma_id = null;
        } else {
          const turma = classes.find(c => c.name === studentData.class);
          if (turma) {
            backendData.turma_id = turma.id;
          }
        }
      }

      if (studentData.status !== undefined) {
        backendData.status = studentData.status;
      }

      if (Object.keys(backendData).length === 0) {
        return;
      }

      await StudentsAPI.update(id, backendData);
      await refreshStudents();
      await refreshClasses();
    } catch (err: unknown) {
      const errorMessage = buildErrorMessage(err, 'Erro ao atualizar aluno');
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
      const errorMessage = buildErrorMessage(err, 'Erro ao deletar aluno');
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
      const errorMessage = buildErrorMessage(err, 'Erro ao transferir aluno para lista de espera');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getStudentById = (id: number) => students.find(s => s.id === id);

  const refreshCourses = async () => {
    try {
      const response = await CoursesAPI.list({ limit: 100 });
      const backendCourses = unwrapNestedArray<BackendCourse>(response.data);
      setCourses(backendCourses.map(mapBackendCourse));
      setError(null);
    } catch (err: unknown) {
      const errorMessage = buildErrorMessage(err, 'Erro ao carregar cursos');
      setError(errorMessage);
    }
  };

  // Course actions
  const addCourse = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
    try {
      setError(null);

      const backendData: CourseCreatePayload = {
        nome: courseData.title,
        carga_horaria: parseInt(courseData.duration.replace(/\D/g, '')) || 0,
        descricao: courseData.description || undefined
      };

      if (courseData.level) {
        backendData.nivel = backendCourseLevelValue(courseData.level);
      }

      if (courseData.status) {
        backendData.status = backendCourseStatusValue(courseData.status);
      }

      const response = await CoursesAPI.create(backendData);
      const backendCourse = response.data.data;
      const newCourse = mapBackendCourse(backendCourse);
      setCourses(prev => [...prev, newCourse]);

      return newCourse;
    } catch (err: unknown) {
      const errorMessage = buildErrorMessage(err, 'Erro ao criar curso');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateCourse = async (id: number, courseData: Partial<Course>): Promise<void> => {
    try {
      setError(null);

      const backendData: CourseUpdatePayload = {};
      if (courseData.title) backendData.nome = courseData.title;
      if (courseData.duration) backendData.carga_horaria = parseInt(courseData.duration.replace(/\D/g, '')) || 0;
      if (courseData.description !== undefined) backendData.descricao = courseData.description || undefined;
      if (courseData.level) backendData.nivel = backendCourseLevelValue(courseData.level);
      if (courseData.status) backendData.status = backendCourseStatusValue(courseData.status);

      if (Object.keys(backendData).length > 0) {
        await CoursesAPI.update(id, backendData);
      }

      await refreshCourses();
      await refreshClasses();
      await refreshStudents();
    } catch (err: unknown) {
      const errorMessage = buildErrorMessage(err, 'Erro ao atualizar curso');
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
      const errorMessage = buildErrorMessage(err, 'Erro ao deletar curso');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getCourseById = (id: number) => courses.find(c => c.id === id);

  const refreshClasses = async () => {
    try {
      const response = await ClassesAPI.list({ limit: 100 });
      const backendClasses = unwrapNestedArray<BackendClass>(response.data);
      setClasses(backendClasses.map(mapBackendClass));
      setError(null);
    } catch (err: unknown) {
      const errorMessage = buildErrorMessage(err, 'Erro ao carregar turmas');
      setError(errorMessage);
    }
  };

  // Class actions
  const addClass = async (classData: Omit<Class, 'id'>): Promise<Class> => {
    try {
      setError(null);

      const course = courses.find(c => c.title === classData.course);
      if (!course) {
        throw new Error(`Curso "${classData.course}" não encontrado`);
      }

      const backendData: ClassCreatePayload = {
        nome: classData.name,
        vagas: classData.capacity || 0,
        status: backendClassStatusValue(classData.status),
        turno: backendScheduleValue(classData.schedule),
        id_curso: course.id,
        data_inicio: parseDateInput(classData.startDate),
        data_fim: parseDateInput(classData.endDate)
      };

      const response = await ClassesAPI.create(backendData);
      const newClass = response.data;

      if (classData.instructorId && newClass.id) {
        try {
          await ClassesAPI.addInstructor(newClass.id, classData.instructorId);
        } catch (error) {
          logAxiosError(error);
        }
      }

      await refreshClasses();
      return mapBackendClass(newClass);
    } catch (err: unknown) {
      const errorMessage = buildErrorMessage(err, 'Erro ao criar turma');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateClass = async (id: number, classData: Partial<Class>): Promise<void> => {
    try {
      setError(null);
      const currentClass = classes.find(c => c.id === id);
      if (!currentClass) throw new Error('Turma não encontrada');

      const backendData: ClassUpdatePayload = {};

      if (classData.name) backendData.nome = classData.name;

      if (classData.course) {
        const selectedCourse = courses.find(c => c.title === classData.course);
        if (selectedCourse) backendData.id_curso = selectedCourse.id;
      }

      if (typeof classData.capacity === 'number') backendData.vagas = classData.capacity;

      if (classData.schedule) backendData.turno = backendScheduleValue(classData.schedule);

      if (classData.startDate !== undefined) backendData.data_inicio = parseDateInput(classData.startDate);
      if (classData.endDate !== undefined) backendData.data_fim = parseDateInput(classData.endDate);

      if (Object.keys(backendData).length > 0) {
        await ClassesAPI.update(id, backendData);
      }

      if (classData.status) {
        const mappedStatus = backendClassStatusValue(classData.status);
        const currentStatus = backendClassStatusValue(currentClass.status);

        if (mappedStatus !== currentStatus) {
          try {
            await ClassesAPI.updateStatus(id, { status: mappedStatus });
          } catch (statusError) {
            logAxiosError(statusError);
          }
        }
      }

      if (classData.instructorIds !== undefined) {
        const oldInstructorIds = currentClass.instructorIds || [];
        const newInstructorIds = classData.instructorIds || [];

        console.log('🔄 Atualizando instrutores:', { oldInstructorIds, newInstructorIds });

        // Encontrar instrutores a remover
        const instructorsToRemove = oldInstructorIds.filter(
          id => !newInstructorIds.includes(id) && id > 0
        );

        // Encontrar instrutores a adicionar
        const instructorsToAdd = newInstructorIds.filter(
          id => !oldInstructorIds.includes(id) && id > 0
        );

        console.log('➕ Adicionando:', instructorsToAdd, '➖ Removendo:', instructorsToRemove);

        // Remover instrutores antigos
        for (const instructorId of instructorsToRemove) {
          console.log(`Removendo instrutor ${instructorId} da turma ${id}`);
          await ClassesAPI.removeInstructor(id, instructorId).catch(logAxiosError);
        }

        // Adicionar novos instrutores
        for (const instructorId of instructorsToAdd) {
          console.log(`Adicionando instrutor ${instructorId} à turma ${id}`);
          await ClassesAPI.addInstructor(id, instructorId).catch(logAxiosError);
        }
      } else if (classData.instructorId !== undefined && classData.instructorId !== currentClass.instructorId) {
        // Fallback para compatibilidade com código antigo (um único instrutor)
        if (currentClass.instructorId && currentClass.instructorId > 0) {
          await ClassesAPI.removeInstructor(id, currentClass.instructorId).catch(logAxiosError);
        }
        if (classData.instructorId && classData.instructorId > 0) {
          await ClassesAPI.addInstructor(id, classData.instructorId).catch(logAxiosError);
        }
      }

      setClasses(prev => prev.map(cls =>
        cls.id === id ? { ...cls, ...classData } : cls
      ));

      await refreshStudents();
      await refreshClasses();
    } catch (err: unknown) {
      const errorMessage = buildErrorMessage(err, 'Erro ao atualizar turma');
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
      const errorMessage = buildErrorMessage(err, 'Erro ao deletar turma');
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

  const refreshInstructors = async () => {
    try {
      const response = await InstructorsAPI.list();
      const backendInstructors = unwrapNestedArray<BackendInstructor>(response.data);
      setInstructors(backendInstructors.map(mapBackendInstructor));
      setError(null);
    } catch (err: unknown) {
      const errorMessage = buildErrorMessage(err, 'Erro ao carregar instrutores');
      setError(errorMessage);
    }
  };

  // Instructor actions
  const addInstructor = async (instructorData: Omit<Instructor, 'id'>): Promise<void> => {
    try {
      setError(null);

      const backendData: InstructorPayload = {
        nome: instructorData.name,
        cpf: instructorData.cpf.replace(/\D/g, ''),
        email: instructorData.email,
        data_nascimento: instructorData.birthDate || null,
        endereco: instructorData.address,
        especialidade: instructorData.specialization,
        experiencia: instructorData.experience,
        status: instructorData.status
      };

      await InstructorsAPI.create(backendData);
      await refreshInstructors();
    } catch (err: unknown) {
      const errorMessage = buildErrorMessage(err, 'Erro ao criar instrutor');
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

      if (Object.keys(backendData).length > 0) {
        await InstructorsAPI.update(id, backendData);
        await refreshInstructors();
      }
    } catch (err: unknown) {
      const errorMessage = buildErrorMessage(err, 'Erro ao atualizar instrutor');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteInstructor = async (id: number): Promise<void> => {
    try {
      setError(null);
      await InstructorsAPI.delete(id);

      await refreshInstructors();

    } catch (err: unknown) {
      const errorMessage = buildErrorMessage(err, 'Erro ao deletar instrutor');
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getInstructorById = (id: number) => instructors.find(i => i.id === id);

  const refreshCandidates = async () => {
    try {
      const response = await CandidatesAPI.list({ limit: 100, page: 1 });
      const backendCandidates = unwrapNestedArray<BackendCandidate>(response.data);
      setCandidates(backendCandidates);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = buildErrorMessage(err, 'Erro ao carregar candidatos');
      setError(errorMessage);
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
