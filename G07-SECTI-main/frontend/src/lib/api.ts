import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3333/api", // URL do seu backend
});

// --- Autenticação ---
export const AuthAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
};

// --- Alunos ---
export const StudentsAPI = {
  list: () => api.get("/students"),
  create: (data) => api.post("/students", data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

// --- Cursos ---
export const CoursesAPI = {
  list: () => api.get("/courses"),
  create: (data) => api.post("/courses", data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

// --- Turmas ---
export const ClassesAPI = {
  list: () => api.get("/classes"),
  create: (data) => api.post("/classes", data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
};

// --- Instrutores ---
export const InstructorsAPI = {
  list: () => api.get("/instructors"),
  create: (data) => api.post("/instructors", data),
  update: (id, data) => api.put(`/instructors/${id}`, data),
  delete: (id) => api.delete(`/instructors/${id}`),
};

// --- Ciclos (novo módulo) ---
export const CyclesAPI = {
  list: () => api.get("/cycles"),
  create: (data) => api.post("/cycles", data),
  update: (id, data) => api.put(`/cycles/${id}`, data),
  delete: (id) => api.delete(`/cycles/${id}`),
};
