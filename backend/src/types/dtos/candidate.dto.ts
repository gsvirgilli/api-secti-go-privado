import type { CandidateStatus } from '../common/index.js';

// Request DTOs
export interface CreateCandidateRequest {
  nome: string;
  cpf: string;
  email: string;
  id_turma_desejada?: number;
}

export interface UpdateCandidateRequest {
  nome?: string;
  cpf?: string;
  email?: string;
  status?: CandidateStatus;
  id_turma_desejada?: number;
}

export interface CandidateSearchParams {
  search?: string;
  status?: CandidateStatus;
  id_turma_desejada?: number;
  page?: number;
  limit?: number;
}

// Response DTOs
export interface CandidateResponse {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  status: CandidateStatus;
  id_turma_desejada: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CandidateListResponse {
  candidates: CandidateResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface CandidateWithClassResponse extends CandidateResponse {
  desiredClass?: {
    id: number;
    nome: string;
    turno: string;
    course: {
      id: number;
      nome: string;
    };
  };
}

