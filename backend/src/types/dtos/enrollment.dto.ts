import type { EnrollmentStatus } from '../common/index.js';

// Request DTOs
export interface CreateEnrollmentRequest {
  id_aluno: number;
  id_turma: number;
  status?: EnrollmentStatus;
}

export interface UpdateEnrollmentRequest {
  status: EnrollmentStatus;
}

export interface EnrollmentSearchParams {
  id_aluno?: number;
  id_turma?: number;
  status?: EnrollmentStatus;
  page?: number;
  limit?: number;
}

// Response DTOs
export interface EnrollmentResponse {
  id_aluno: number;
  id_turma: number;
  status: EnrollmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnrollmentListResponse {
  enrollments: EnrollmentResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface EnrollmentWithDetailsResponse extends EnrollmentResponse {
  student: {
    id: number;
    matricula: string;
    nome: string;
    email: string;
  };
  class: {
    id: number;
    nome: string;
    turno: string;
    course: {
      id: number;
      nome: string;
    };
  };
}

