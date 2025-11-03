import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudentsAPI, CoursesAPI, ClassesAPI } from '@/lib/api';

// Types
export interface Student {
  id: number;
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
  loading: boolean;
  error: string | null;
  
  // Student actions
  addStudent: (student: Omit<Student, 'id'>) => Promise<Student>;
  updateStudent: (id: number, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: number) => Promise<void>;
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
  addInstructor: (instructor: Omit<Instructor, 'id'>) => void;
  updateInstructor: (id: number, instructor: Partial<Instructor>) => void;
  deleteInstructor: (id: number) => void;
  getInstructorById: (id: number) => Instructor | undefined;
  
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados da API ao montar o componente
  useEffect(() => {
    async function loadData() {
      // Não carregar dados se estiver em páginas públicas
      const publicPaths = ['/login', '/register', '/reset-password'];
      const isPublicPath = publicPaths.some(path => window.location.pathname.includes(path));
      
      if (isPublicPath) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Carregar dados em paralelo
        const [studentsRes, coursesRes, classesRes] = await Promise.all([
          StudentsAPI.list().catch(() => ({ data: initialStudents })),
          CoursesAPI.list().catch(() => ({ data: initialCourses })),
          ClassesAPI.list().catch(() => ({ data: initialClasses }))
        ]);

        setStudents(studentsRes.data || initialStudents);
        setCourses(coursesRes.data || initialCourses);
        setClasses(classesRes.data || initialClasses);
        setInstructors(initialInstructors); // Por enquanto, usar mock para instrutores
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Em caso de erro, usar dados mockados
        setStudents(initialStudents);
        setCourses(initialCourses);
        setClasses(initialClasses);
        setInstructors(initialInstructors);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Refresh functions
  const refreshStudents = async () => {
    try {
      const response = await StudentsAPI.list();
      setStudents(response.data || []);
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
      const response = await StudentsAPI.create(studentData);
      const newStudent = response.data;
      
      setStudents(prev => [...prev, newStudent]);
      
      // Refresh related data
      await refreshClasses();
      await refreshCourses();
      
      return newStudent;
    } catch (err: any) {
      console.error('Erro ao criar aluno:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao criar aluno';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateStudent = async (id: number, studentData: Partial<Student>): Promise<void> => {
    try {
      setError(null);
      await StudentsAPI.update(id, studentData);
      
      setStudents(prev => prev.map(student => 
        student.id === id ? { ...student, ...studentData } : student
      ));
      
      // Refresh related data
      await refreshClasses();
      
    } catch (err: any) {
      console.error('Erro ao atualizar aluno:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar aluno';
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

  const getStudentById = (id: number) => students.find(s => s.id === id);

  const refreshCourses = async () => {
    try {
      const response = await CoursesAPI.list();
      setCourses(response.data || []);
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
      const response = await CoursesAPI.create(courseData);
      const newCourse = response.data;
      
      setCourses(prev => [...prev, newCourse]);
      
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
      await CoursesAPI.update(id, courseData);
      
      setCourses(prev => prev.map(course => 
        course.id === id ? { ...course, ...courseData } : course
      ));
      
      // Refresh related data
      await refreshClasses();
      await refreshStudents();
      
    } catch (err: any) {
      console.error('Erro ao atualizar curso:', err);
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
      const response = await ClassesAPI.list();
      setClasses(response.data || []);
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
      const response = await ClassesAPI.create(classData);
      const newClass = response.data;
      
      setClasses(prev => [...prev, newClass]);
      
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
      await ClassesAPI.update(id, classData);
      
      setClasses(prev => prev.map(cls => 
        cls.id === id ? { ...cls, ...classData } : cls
      ));
      
      // Refresh related data
      await refreshStudents();
      
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
      const errorMessage = err.response?.data?.message || 'Erro ao deletar turma';
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
  const addInstructor = (instructorData: Omit<Instructor, 'id'>) => {
    const newId = Math.max(...instructors.map(i => i.id), 0) + 1;
    setInstructors(prev => [...prev, { ...instructorData, id: newId }]);
  };

  const updateInstructor = (id: number, instructorData: Partial<Instructor>) => {
    setInstructors(prev => prev.map(instructor => 
      instructor.id === id ? { ...instructor, ...instructorData } : instructor
    ));
  };

  const deleteInstructor = (id: number) => {
    setInstructors(prev => prev.filter(i => i.id !== id));
  };

  const getInstructorById = (id: number) => instructors.find(i => i.id === id);

  const value: AppContextType = {
    students,
    courses,
    classes,
    instructors,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
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