import type { 
  CreateStudentRequest, 
  UpdateStudentRequest, 
  StudentResponse, 
  StudentListResponse,
  StudentWithEnrollmentsResponse 
} from '../dtos/student.dto.js';
import type { BaseService, PaginatedService } from './base.service.types.js';

export interface StudentServiceInterface extends 
  BaseService<StudentResponse, CreateStudentRequest, UpdateStudentRequest>,
  PaginatedService<StudentResponse, { search?: string; page?: number; limit?: number }> {
  
  findByMatricula(matricula: string): Promise<{ success: boolean; data?: StudentResponse; error?: string }>;
  findByCpf(cpf: string): Promise<{ success: boolean; data?: StudentResponse; error?: string }>;
  findByEmail(email: string): Promise<{ success: boolean; data?: StudentResponse; error?: string }>;
  getWithEnrollments(id: number): Promise<{ success: boolean; data?: StudentWithEnrollmentsResponse; error?: string }>;
  getEnrollmentHistory(id: number): Promise<{ success: boolean; data?: any[]; error?: string }>;
}

