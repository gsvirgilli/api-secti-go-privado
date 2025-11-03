import axios from "axios";

// Configuração base da API
export const api = axios.create({
  baseURL: "http://localhost:3333/api",
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
    const publicPaths = ['/login', '/register', '/reset-password'];
    const isPublicPath = publicPaths.some(path => window.location.pathname.includes(path));
    
    if (error.response?.status === 401 && !isPublicPath) {
      // Token inválido ou expirado
      localStorage.removeItem("@sukatech:token");
      localStorage.removeItem("@sukatech:user");
      window.location.href = "/login";
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
  
  update: (id: number, data: any) => 
    api.put(`/candidates/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/candidates/${id}`),
  
  approve: (id: number) => 
    api.post(`/candidates/${id}/approve`),
  
  reject: (id: number, motivo: string) => 
    api.post(`/candidates/${id}/reject`, { motivo }),
};

// ======================================
// 🎓 ALUNOS
// ======================================
export const StudentsAPI = {
  list: (params?: { status?: string; turma_id?: number; page?: number; limit?: number }) => 
    api.get("/students", { params }),
  
  findById: (id: number) => 
    api.get(`/students/${id}`),
  
  update: (id: number, data: any) => 
    api.put(`/students/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/students/${id}`),
};

// ======================================
// 📚 CURSOS
// ======================================
export const CoursesAPI = {
  list: (params?: { ativo?: boolean; page?: number; limit?: number }) => 
    api.get("/courses", { params }),
  
  findById: (id: number) => 
    api.get(`/courses/${id}`),
  
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
  
  create: (data: any) => 
    api.post("/classes", data),
  
  update: (id: number, data: any) => 
    api.put(`/classes/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/classes/${id}`),
};

// ======================================
// 📝 MATRÍCULAS
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
// 🏥 HEALTH CHECK
// ======================================
export const HealthAPI = {
  check: () => api.get("/health"),
};

export default api;
