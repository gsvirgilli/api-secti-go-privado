import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3333/api",
});

// --- Rotas de cada módulo ---
export const AuthAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
};

export const StudentsAPI = {
  list: () => api.get("/students"),
  create: (data) => api.post("/students", data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

export const CoursesAPI = {
  list: () => api.get("/courses"),
  create: (data) => api.post("/courses", data),
};

export const ClassesAPI = {
  list: () => api.get("/classes"),
};

export const InstructorsAPI = {
  list: () => api.get("/instructors"),
};
