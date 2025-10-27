import type { 
  CreateClassRequest, 
  UpdateClassRequest, 
  ClassResponse, 
  ClassListResponse,
  ClassWithDetailsResponse 
} from '../dtos/class.dto.js';
import type { BaseService, PaginatedService } from './base.service.types.js';

export interface ClassServiceInterface extends 
  BaseService<ClassResponse, CreateClassRequest, UpdateClassRequest>,
  PaginatedService<ClassResponse, { search?: string; turno?: string; id_curso?: number; page?: number; limit?: number }> {
  
  getWithDetails(id: number): Promise<{ success: boolean; data?: ClassWithDetailsResponse; error?: string }>;
  assignInstructor(classId: number, instructorId: number): Promise<{ success: boolean; error?: string }>;
  removeInstructor(classId: number, instructorId: number): Promise<{ success: boolean; error?: string }>;
  getSchedule(classId: number, startDate?: Date, endDate?: Date): Promise<{ success: boolean; data?: any[]; error?: string }>;
}

