import type { 
  CreateEnrollmentRequest, 
  UpdateEnrollmentRequest, 
  EnrollmentResponse, 
  EnrollmentListResponse,
  EnrollmentWithDetailsResponse 
} from '../dtos/enrollment.dto.js';
import type { BaseService, PaginatedService } from './base.service.types.js';

export interface EnrollmentServiceInterface extends 
  BaseService<EnrollmentResponse, CreateEnrollmentRequest, UpdateEnrollmentRequest>,
  PaginatedService<EnrollmentResponse, { id_aluno?: number; id_turma?: number; status?: string; page?: number; limit?: number }> {
  
  getWithDetails(id_aluno: number, id_turma: number): Promise<{ success: boolean; data?: EnrollmentWithDetailsResponse; error?: string }>;
  getByStudent(studentId: number): Promise<{ success: boolean; data?: EnrollmentResponse[]; error?: string }>;
  getByClass(classId: number): Promise<{ success: boolean; data?: EnrollmentResponse[]; error?: string }>;
  checkAvailability(classId: number): Promise<{ success: boolean; data?: { available: boolean; capacity?: number; enrolled?: number }; error?: string }>;
}
