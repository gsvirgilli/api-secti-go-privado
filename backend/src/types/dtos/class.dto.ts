import type { ClassShift } from '../common/index.js';

// Request DTOs
export interface CreateClassRequest {
  nome: string;
  turno: ClassShift;
  data_inicio?: Date;
  data_fim?: Date;
  id_curso: number;
}

export interface UpdateClassRequest {
  nome?: string;
  turno?: ClassShift;
  data_inicio?: Date;
  data_fim?: Date;
  id_curso?: number;
}

export interface ClassSearchParams {
  search?: string;
  turno?: ClassShift;
  id_curso?: number;
  page?: number;
  limit?: number;
}

// Response DTOs
export interface ClassResponse {
  id: number;
  nome: string;
  turno: ClassShift;
  data_inicio: Date | null;
  data_fim: Date | null;
  id_curso: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassListResponse {
  classes: ClassResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface ClassWithDetailsResponse extends ClassResponse {
  course: {
    id: number;
    nome: string;
    carga_horaria: number;
  };
  students: {
    id: number;
    matricula: string;
    nome: string;
    email: string;
  }[];
  instructor?: {
    id: number;
    nome: string;
    email: string;
  };
}

