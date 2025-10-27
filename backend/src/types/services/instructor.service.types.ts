import type { 
  CreateInstructorRequest, 
  UpdateInstructorRequest, 
  InstructorResponse, 
  InstructorListResponse,
  InstructorWithClassesResponse 
} from '../dtos/instructor.dto.js';
import type { BaseService, PaginatedService } from './base.service.types.js';

export interface InstructorServiceInterface extends 
  BaseService<InstructorResponse, CreateInstructorRequest, UpdateInstructorRequest>,
  PaginatedService<InstructorResponse, { search?: string; especialidade?: string; page?: number; limit?: number }> {
  
  findByCpf(cpf: string): Promise<{ success: boolean; data?: InstructorResponse; error?: string }>;
  findByEmail(email: string): Promise<{ success: boolean; data?: InstructorResponse; error?: string }>;
  getWithClasses(id: number): Promise<{ success: boolean; data?: InstructorWithClassesResponse; error?: string }>;
  getAvailableInstructors(date: Date, classId?: number): Promise<{ success: boolean; data?: InstructorResponse[]; error?: string }>;
}

