// Common types used across the application

export type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

export type BaseEntity = {
  id: number;
} & Timestamps;

export type UserRole = 'ADMIN' | 'INSTRUTOR';

export type CandidateStatus = 'PENDENTE' | 'APROVADO' | 'REJEITADO';

export type EnrollmentStatus = 'Cursando' | 'Concluído' | 'Cancelado';

export type AttendanceStatus = 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO';

export type ClassShift = 'MANHÃ' | 'TARDE' | 'NOITE';

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  offset?: number;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
