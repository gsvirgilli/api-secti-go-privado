import { useAppContext } from '@/contexts/AppContext';

export const useAppData = () => {
  const context = useAppContext();
  
  if (!context) {
    throw new Error('useAppData must be used within an AppProvider');
  }

  // ---------- Estatísticas Calculadas ----------
  const studentStats = {
    total: context.students.length,
    active: context.students.filter(s => s.status === "Ativo").length,
    inactive: context.students.filter(s => s.status === "Inativo").length,
    pending: context.students.filter(s => s.status === "Pendente").length,
    activityRate: context.students.length > 0
      ? Math.round((context.students.filter(s => s.status === "Ativo").length / context.students.length) * 100)
      : 0
  };

  const classStats = {
    total: context.classes.length,
    active: context.classes.filter(c => c.status === "Ativo").length,
    planned: context.classes.filter(c => c.status === "Planejada").length,
    completed: context.classes.filter(c => c.status === "Concluída").length,
    cancelled: context.classes.filter(c => c.status === "Cancelada").length,
  };

  const courseStats = {
    total: context.courses.length,
    active: context.courses.filter(c => c.status === "Ativo").length,
    inactive: context.courses.filter(c => c.status === "Inativo").length,
  };

  const instructorStats = {
    total: context.instructors.length,
    active: context.instructors.filter(i => i.status === "Ativo").length,
    inactive: context.instructors.filter(i => i.status === "Inativo").length,
  };

  // ---------- Dados para Charts ----------
  const charts = {
    studentsByStatus: [
      { name: 'Ativos', value: studentStats.active, fill: '#10b981' },
      { name: 'Inativos', value: studentStats.inactive, fill: '#ef4444' },
      { name: 'Pendentes', value: studentStats.pending, fill: '#f59e0b' },
    ],
    classesByStatus: [
      { name: 'Ativas', value: classStats.active, fill: '#3b82f6' },
      { name: 'Planejadas', value: classStats.planned, fill: '#8b5cf6' },
      { name: 'Concluídas', value: classStats.completed, fill: '#10b981' },
      { name: 'Canceladas', value: classStats.cancelled, fill: '#ef4444' },
    ],
    coursesByStatus: [
      { name: 'Ativos', value: courseStats.active, fill: '#10b981' },
      { name: 'Inativos', value: courseStats.inactive, fill: '#6b7280' },
    ],
  };

  // ---------- Retorno do hook ----------
  return {
    // Context completo (todas as funções e dados)
    ...context,
    // Estatísticas agregadas
    stats: {
      students: studentStats,
      classes: classStats,
      courses: courseStats,
      instructors: instructorStats,
    },
    // Dados para gráficos
    charts,
  };
};

export default useAppData;
