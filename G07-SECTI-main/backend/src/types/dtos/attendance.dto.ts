import type { AttendanceStatus } from '../common/index.js';

// Request DTOs
export interface CreateAttendanceRequest {
  id_aluno: number;
  id_turma: number;
  data_chamada: Date;
  status: AttendanceStatus;
}

export interface UpdateAttendanceRequest {
  status: AttendanceStatus;
}

export interface AttendanceSearchParams {
  id_aluno?: number;
  id_turma?: number;
  data_chamada?: Date;
  status?: AttendanceStatus;
  page?: number;
  limit?: number;
}

export interface BulkAttendanceRequest {
  id_turma: number;
  data_chamada: Date;
  attendances: {
    id_aluno: number;
    status: AttendanceStatus;
  }[];
}

// Response DTOs
export interface AttendanceResponse {
  id: number;
  id_aluno: number;
  id_turma: number;
  data_chamada: Date;
  status: AttendanceStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceListResponse {
  attendances: AttendanceResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface AttendanceWithDetailsResponse extends AttendanceResponse {
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
  };
}

export interface ClassAttendanceReportResponse {
  class: {
    id: number;
    nome: string;
    turno: string;
  };
  date: Date;
  totalStudents: number;
  present: number;
  absent: number;
  justified: number;
  attendances: AttendanceWithDetailsResponse[];
}
