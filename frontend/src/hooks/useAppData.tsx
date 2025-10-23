import { useAppContext } from '@/contexts/AppContext';
import type { Instructor, Class, Course } from '@/contexts/AppContext';

export const useAppData = () => {
  const context = useAppContext();
  
  if (!context) {
    throw new Error('useAppData must be used within an AppProvider');
  }

  // ---------- CRUD de Instrutores ----------
  const createInstructor = (newInstructor: Instructor) => {
    context.setInstructors([...context.instructors, newInstructor]);
  };

  const updateInstructor = (updatedInstructor: Instructor) => {
    context.setInstructors(
      context.instructors.map(i =>
        i.id === updatedInstructor.id ? updatedInstructor : i
      )
    );
  };

  const deleteInstructor = (id: string) => {
    context.setInstructors(context.instructors.filter(i => i.id !== id));
  };

  // ---------- CRUD de Turmas ----------
  const createClass = (newClass: Class) => {
    context.setClasses([...context.classes, newClass]);
  };

  const updateClass = (updatedClass: Class) => {
    context.setClasses(
      context.classes.map(c => c.id === updatedClass.id ? updatedClass : c)
    );
  };

  const deleteClass = (id: string) => {
    context.setClasses(context.classes.filter(c => c.id !== id));
  };

  // ---------- CRUD de Cursos ----------
  const createCourse = (newCourse: Course) => {
    context.setCourses([...context.courses, newCourse]);
  };

  const updateCourse = (updatedCourse: Course) => {
    context.setCourses(
      context.courses.map(c => c.id === updatedCourse.id ? updatedCourse : c)
    );
  };

  const deleteCourse = (id: string) => {
    context.setCourses(context.courses.filter(c => c.id !== id));
  };

  // ---------- Estatísticas ----------
  const studentStats = {
    total: context.students.length,
    active: context.students.filter(s => s.status === "Ativo").length,
    inactive: context.students.filter(s => s.status === "Inativo").length,
    activityRate: context.students.length > 0
      ? Math.round((context.students.filter(s => s.status === "Ativo").length / context.students.length) * 100)
      : 0
  };

  const classStats = {
    total: context.classes.length,
    active: context.classes.filter(c => c.status === "Ativo").length,
    planned: context.classes.filter(c => c.status === "Planejada").length,
    completed: context.classes.filter(c => c.status === "Concluída").length
  };

  const courseStats = {
    total: context.courses.length,
    active: context.courses.filter(c => c.status === "Ativo").length
  };

  // ---------- Retorno do hook ----------
  return {
    ...context,
    instructors: context.instructors,
    classes: context.classes,
    courses: context.courses,
    students: context.students,
    createInstructor,
    updateInstructor,
    deleteInstructor,
    createClass,
    updateClass,
    deleteClass,
    createCourse,
    updateCourse,
    deleteCourse,
    stats: {
      students: studentStats,
      classes: classStats,
      courses: courseStats
    }
  };
};

export default useAppData;
