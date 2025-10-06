import type { 
  CreateCandidateRequest, 
  UpdateCandidateRequest, 
  CandidateResponse, 
  CandidateListResponse,
  CandidateWithClassResponse 
} from '../dtos/candidate.dto.js';
import type { BaseService, PaginatedService } from './base.service.types.js';

export interface CandidateServiceInterface extends 
  BaseService<CandidateResponse, CreateCandidateRequest, UpdateCandidateRequest>,
  PaginatedService<CandidateResponse, { search?: string; status?: string; id_turma_desejada?: number; page?: number; limit?: number }> {
  
  findByCpf(cpf: string): Promise<{ success: boolean; data?: CandidateResponse; error?: string }>;
  findByEmail(email: string): Promise<{ success: boolean; data?: CandidateResponse; error?: string }>;
  getWithClass(id: number): Promise<{ success: boolean; data?: CandidateWithClassResponse; error?: string }>;
  approve(id: number): Promise<{ success: boolean; error?: string }>;
  reject(id: number, reason?: string): Promise<{ success: boolean; error?: string }>;
  convertToStudent(id: number): Promise<{ success: boolean; data?: any; error?: string }>;
}
