import { useAppContext } from '@/contexts/AppContext';

export const useAppData = () => {
  const context = useAppContext();
  
  if (!context) {
    throw new Error('useAppData must be used within an AppProvider');
  }
  
  // Calculate statistics
  const studentStats = {
    total: context.students.length,
    active: context.students.filter(s => s.status === "Ativo").length,
    inactive: context.students.filter(s => s.status === "Inativo").length,
    activityRate: context.students.length > 0 ? Math.round((context.students.filter(s => s.status === "Ativo").length / context.students.length) * 100) : 0
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

  // Age distribution for charts
  const ageDistribution = [
    { name: "Até 18 anos", value: 35, color: "#10b981" },
    { name: "18 - 25 anos", value: 45, color: "#3b82f6" },
    { name: "25 - 40 anos", value: 15, color: "#f59e0b" },
    { name: "Mais de 40 anos", value: 5, color: "#ef4444" },
  ];

  // Grade distribution
  const gradeDistribution = [
    { name: "0-2", value: 5 },
    { name: "2-4", value: 8 },
    { name: "4-6", value: 15 },
    { name: "6-8", value: 45 },
    { name: "8-10", value: 27 },
  ];

  // Top students
  const topStudents = context.students
    .filter(s => s.status === "Ativo")
    .sort((a, b) => b.grades - a.grades)
    .slice(0, 3)
    .map(student => ({
      name: student.name,
      grade: student.grades
    }));

  return {
    ...context,
    stats: {
      students: studentStats,
      classes: classStats,
      courses: courseStats
    },
    charts: {
      ageDistribution,
      gradeDistribution,
      topStudents
    }
  };
};

export default useAppData;