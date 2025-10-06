import type { 
  CreateCourseRequest, 
  UpdateCourseRequest, 
  CourseResponse, 
  CourseListResponse,
  CourseWithClassesResponse 
} from '../dtos/course.dto.js';
import type { BaseService, PaginatedService } from './base.service.types.js';

export interface CourseServiceInterface extends 
  BaseService<CourseResponse, CreateCourseRequest, UpdateCourseRequest>,
  PaginatedService<CourseResponse, { search?: string; minHours?: number; maxHours?: number; page?: number; limit?: number }> {
  
  getWithClasses(id: number): Promise<{ success: boolean; data?: CourseWithClassesResponse; error?: string }>;
  getStatistics(id: number): Promise<{ success: boolean; data?: any; error?: string }>;
}
