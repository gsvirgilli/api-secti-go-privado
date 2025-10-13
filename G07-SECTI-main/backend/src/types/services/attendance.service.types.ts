import type { 
  CreateAttendanceRequest, 
  UpdateAttendanceRequest, 
  AttendanceResponse, 
  AttendanceListResponse,
  AttendanceWithDetailsResponse,
  BulkAttendanceRequest,
  ClassAttendanceReportResponse 
} from '../dtos/attendance.dto.js';
import type { BaseService, PaginatedService } from './base.service.types.js';

export interface AttendanceServiceInterface extends 
  BaseService<AttendanceResponse, CreateAttendanceRequest, UpdateAttendanceRequest>,
  PaginatedService<AttendanceResponse, { id_aluno?: number; id_turma?: number; data_chamada?: Date; status?: string; page?: number; limit?: number }> {
  
  getWithDetails(id: number): Promise<{ success: boolean; data?: AttendanceWithDetailsResponse; error?: string }>;
  getByStudent(studentId: number, classId?: number): Promise<{ success: boolean; data?: AttendanceResponse[]; error?: string }>;
  getByClass(classId: number, date?: Date): Promise<{ success: boolean; data?: AttendanceResponse[]; error?: string }>;
  createBulk(data: BulkAttendanceRequest): Promise<{ success: boolean; data?: AttendanceResponse[]; error?: string }>;
  getClassReport(classId: number, date: Date): Promise<{ success: boolean; data?: ClassAttendanceReportResponse; error?: string }>;
  getStudentAttendanceRate(studentId: number, classId: number): Promise<{ success: boolean; data?: { rate: number; total: number; present: number }; error?: string }>;
}
