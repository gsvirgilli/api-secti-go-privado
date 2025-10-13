import { api } from "./api";

// AUTH
export const AuthAPI = {
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),
  register: (data: any) => api.post("/auth/register", data),
};

// USERS
export const UsersAPI = {
  list: () => api.get("/users"),
  create: (data: any) => api.post("/users", data),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// STUDENTS
export const StudentsAPI = {
  list: () => api.get("/students"),
  create: (data: any) => api.post("/students", data),
  update: (id: number, data: any) => api.put(`/students/${id}`, data),
  delete: (id: number) => api.delete(`/students/${id}`),
};

// INSTRUCTORS
export const InstructorsAPI = {
  list: () => api.get("/instructors"),
  create: (data: any) => api.post("/instructors", data),
  update: (id: number, data: any) => api.put(`/instructors/${id}`, data),
  delete: (id: number) => api.delete(`/instructors/${id}`),
};

// COURSES
export const CoursesAPI = {
  list: () => api.get("/courses"),
  create: (data: any) => api.post("/courses", data),
  update: (id: number, data: any) => api.put(`/courses/${id}`, data),
  delete: (id: number) => api.delete(`/courses/${id}`),
};

// CLASSES
export const ClassesAPI = {
  list: () => api.get("/classes"),
  create: (data: any) => api.post("/classes", data),
  update: (id: number, data: any) => api.put(`/classes/${id}`, data),
  delete: (id: number) => api.delete(`/classes/${id}`),
};
