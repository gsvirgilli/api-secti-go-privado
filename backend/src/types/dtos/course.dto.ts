// Request DTOs
export interface CreateCourseRequest {
  nome: string;
  carga_horaria: number;
  descricao?: string;
}

export interface UpdateCourseRequest {
  nome?: string;
  carga_horaria?: number;
  descricao?: string;
}

export interface CourseSearchParams {
  search?: string;
  minHours?: number;
  maxHours?: number;
  page?: number;
  limit?: number;
}

// Response DTOs
export interface CourseResponse {
  id: number;
  nome: string;
  carga_horaria: number;
  descricao: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseListResponse {
  courses: CourseResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface CourseWithClassesResponse extends CourseResponse {
  classes: {
    id: number;
    nome: string;
    turno: string;
    data_inicio: Date | null;
    data_fim: Date | null;
  }[];
}

