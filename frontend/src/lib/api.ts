import axios from "axios";

// Configuração base da API - usar variável de ambiente ou fallback para localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3333/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("@sukatech:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Não redirecionar automaticamente se estiver nas páginas públicas
    const publicPaths = ['/login', '/register', '/reset-password', '/inscricao', '/processo-seletivo'];
    const isPublicPath = publicPaths.some(path => window.location.pathname.includes(path));
    
    // Não redirecionar automaticamente para páginas protegidas - deixar a página tratar o erro
    const protectedPaths = ['/processo-seletivo-admin', '/dashboard', '/alunos', '/turmas', '/cursos', '/instrutores', '/relatorios', '/perfil', '/cadastro'];
    const isProtectedPath = protectedPaths.some(path => window.location.pathname.includes(path));
    
    if (error.response?.status === 401 && !isPublicPath && !isProtectedPath) {
      // Token inválido ou expirado - apenas limpar e redirecionar se não for página protegida
      localStorage.removeItem("@sukatech:token");
      localStorage.removeItem("@sukatech:user");
      window.location.href = "/login";
    } else if (error.response?.status === 401 && isProtectedPath) {
      // Para páginas protegidas, apenas limpar o token mas não redirecionar
      // A página deve tratar o erro e mostrar mensagem apropriada
      localStorage.removeItem("@sukatech:token");
      localStorage.removeItem("@sukatech:user");
    }
    return Promise.reject(error);
  }
);

// ======================================
// 🔐 AUTENTICAÇÃO
// ======================================
export const AuthAPI = {
  login: (data: { email: string; senha: string }) => 
    api.post("/auth/login", data),
  
  register: (data: { nome: string; email: string; senha: string; role?: string }) => 
    api.post("/auth/register", data),
  
  me: () => 
    api.get("/auth/me"),
  
  // Recuperação de senha
  forgotPassword: (data: { email: string }) => 
    api.post("/auth/forgot-password", data),
  
  validateResetToken: (token: string) => 
    api.get(`/auth/reset-password/${token}`),
  
  resetPassword: (data: { token: string; newPassword: string }) => 
    api.post("/auth/reset-password", data),
};

// ======================================
// 👥 CANDIDATOS
// ======================================
export const CandidatesAPI = {
  list: (params?: { status?: string; page?: number; limit?: number }) => 
    api.get("/candidates", { params }),
  
  findById: (id: number) => 
    api.get(`/candidates/${id}`),
  
  create: (data: any) => 
    api.post("/candidates", data),
  
  // Candidatura pública (sem autenticação)
  createPublic: (data: any, files?: any) => {
    // Se houver arquivos, usar FormData
    if (files && Object.keys(files).length > 0) {
      const formData = new FormData();
      
      // Adicionar todos os campos de dados
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
          formData.append(key, data[key]);
        }
      });
      
      // Adicionar todos os arquivos
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });
      
      return axios.post(`${API_BASE_URL}/candidates/public`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    
    // Se não houver arquivos, enviar JSON
    return axios.post(`${API_BASE_URL}/candidates/public`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  
  update: (id: number, data: any) => 
    api.put(`/candidates/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/candidates/${id}`),
  
  approve: (id: number, opcaoCurso?: 1 | 2) => 
    api.post(`/candidates/${id}/approve`, { opcaoCurso }),
  
  reject: (id: number, motivo: string) => 
    api.post(`/candidates/${id}/reject`, { motivo }),
  
  // Validar campos únicos antes de enviar formulário
  validateUniqueFields: (data: { cpf?: string; email?: string; telefone?: string }) =>
    axios.post(`${API_BASE_URL}/candidates/validate`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    }),
};

// ======================================
// 🎓 ALUNOS
// ======================================
export const StudentsAPI = {
  list: (params?: { status?: string; turma_id?: number; page?: number; limit?: number }) => 
    api.get("/students", { params }),
  
  findById: (id: number) => 
    api.get(`/students/${id}`),
  
  create: (data: any) => 
    api.post("/students", data),
  
  update: (id: number, data: any) => 
    api.put(`/students/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/students/${id}`),
  
  transferToWaitingList: (id: number, motivo?: string) => 
    api.post(`/students/${id}/transfer-to-waiting-list`, { motivo }),
};

// ======================================
// 📚 CURSOS
// ======================================
export const CoursesAPI = {
  list: (params?: { ativo?: boolean; page?: number; limit?: number }) => 
    api.get("/courses", { params }),
  
  findById: (id: number) => 
    api.get(`/courses/${id}`),
  
  // Listagem pública de cursos (sem autenticação)
  listPublic: () => {
    // Criar uma requisição sem token para endpoint público
    return axios.get(`${API_BASE_URL}/courses/public`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  
  create: (data: { nome: string; descricao?: string; carga_horaria?: number; ativo?: boolean }) => 
    api.post("/courses", data),
  
  update: (id: number, data: any) => 
    api.put(`/courses/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/courses/${id}`),
};

// ======================================
// 🏫 TURMAS
// ======================================
export const ClassesAPI = {
  list: (params?: { curso_id?: number; status?: string; page?: number; limit?: number }) => 
    api.get("/classes", { params }),
  
  findById: (id: number) => 
    api.get(`/classes/${id}`),
  
  // Buscar turma por curso e turno
  findByCourseAndShift: (curso_id: number, turno: string) =>
    api.get("/classes", { params: { id_curso: curso_id, turno } }),
  
  create: (data: any) => 
    api.post("/classes", data),
  
  update: (id: number, data: any) => 
    api.put(`/classes/${id}`, data),
  updateStatus: (id: number, data: { status: string }) =>
    api.patch(`/classes/${id}/status`, data),
  
  addInstructor: (classId: number, instructorId: number) =>
    api.post(`/classes/${classId}/instructors/${instructorId}`),
  
  removeInstructor: (classId: number, instructorId: number) =>
    api.delete(`/classes/${classId}/instructors/${instructorId}`),
  
  delete: (id: number) => 
    api.delete(`/classes/${id}`),
};

// ======================================
// �‍🏫 INSTRUTORES
// ======================================
export const InstructorsAPI = {
  list: (params?: { nome?: string; cpf?: string; email?: string; especialidade?: string }) => 
    api.get("/instructors", { params }),
  
  findOne: (id: number) => 
    api.get(`/instructors/${id}`),
  
  findByCPF: (cpf: string) => 
    api.get(`/instructors/cpf/${cpf}`),
  
  findByEmail: (email: string) => 
    api.get(`/instructors/email/${email}`),
  
  create: (data: { cpf: string; nome: string; email: string; especialidade?: string }) => 
    api.post("/instructors", data),
  
  update: (id: number, data: any) => 
    api.put(`/instructors/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/instructors/${id}`),
  
  statistics: () => 
    api.get("/instructors/statistics"),
};

// ======================================
// �📝 MATRÍCULAS
// ======================================
export const EnrollmentsAPI = {
  list: (params?: { status?: string; page?: number; limit?: number }) => 
    api.get("/enrollments", { params }),
  
  findByStudent: (id_aluno: number) => 
    api.get(`/enrollments/student/${id_aluno}`),
  
  findByClass: (id_turma: number) => 
    api.get(`/enrollments/class/${id_turma}`),
  
  findOne: (id_aluno: number, id_turma: number) => 
    api.get(`/enrollments/${id_aluno}/${id_turma}`),
  
  create: (data: { id_aluno: number; id_turma: number; observacoes?: string }) => 
    api.post("/enrollments", data),
  
  update: (id_aluno: number, id_turma: number, data: any) => 
    api.put(`/enrollments/${id_aluno}/${id_turma}`, data),
  
  reactivate: (id_aluno: number, id_turma: number) => 
    api.put(`/enrollments/${id_aluno}/${id_turma}/reactivate`),
  
  cancel: (id_aluno: number, id_turma: number, motivo: string) => 
    api.put(`/enrollments/${id_aluno}/${id_turma}/cancel`, { motivo }),
  
  transfer: (id_aluno: number, nova_turma_id: number, motivo: string) => 
    api.post(`/enrollments/${id_aluno}/transfer`, { nova_turma_id, motivo }),
  
  delete: (id_aluno: number, id_turma: number) => 
    api.delete(`/enrollments/${id_aluno}/${id_turma}`),
  
  statistics: () => 
    api.get("/enrollments/statistics"),
};

// ======================================
// 📊 RELATÓRIOS
// ======================================
export const ReportsAPI = {
  // Estatísticas do dashboard
  dashboard: (params?: {
    data_inicio?: string;
    data_fim?: string;
    id_curso?: number;
    id_turma?: number;
  }) => api.get("/reports/dashboard", { params }),

  // PDFs
  studentsPDF: (params?: { id_turma?: number }) =>
    api.get("/reports/students/pdf", {
      params,
      responseType: "blob",
    }),

  classesPDF: (params?: { id_curso?: number; status?: string }) =>
    api.get("/reports/classes/pdf", {
      params,
      responseType: "blob",
    }),

  attendancePDF: (params?: { id_turma?: number; data_inicio?: string; data_fim?: string }) =>
    api.get("/reports/attendance/pdf", {
      params,
      responseType: "blob",
    }),

  coursesPDF: (params?: { ativo?: boolean }) =>
    api.get("/reports/courses/pdf", {
      params,
      responseType: "blob",
    }),

  // Excel
  studentsExcel: (params?: { id_turma?: number }) =>
    api.get("/reports/students/excel", {
      params,
      responseType: "blob",
    }),

  classesExcel: (params?: { id_curso?: number; status?: string }) =>
    api.get("/reports/classes/excel", {
      params,
      responseType: "blob",
    }),

  attendanceExcel: (params?: { id_turma?: number; data_inicio?: string; data_fim?: string }) =>
    api.get("/reports/attendance/excel", {
      params,
      responseType: "blob",
    }),
};

// ======================================
// 🏥 HEALTH CHECK
// ======================================
export const HealthAPI = {
  check: () => api.get("/health"),
};

export default api;
