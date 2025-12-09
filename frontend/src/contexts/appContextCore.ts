import { createContext } from 'react';
import type { Student, Course, Class, Instructor, Candidate } from '@/types/appContext';
import { getApiErrorMessage } from '@/lib/apiErrors';

export interface AppContextType {
  // Data
  students: Student[];
  courses: Course[];
  classes: Class[];
  instructors: Instructor[];
  candidates: Candidate[];
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

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const unwrapNestedArray = <T,>(payload?: unknown): T[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (typeof payload === 'object' && payload !== null) {
    return unwrapNestedArray<T>((payload as { data?: unknown }).data);
  }
  return [];
};

export { getApiErrorMessage };
