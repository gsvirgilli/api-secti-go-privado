// Request DTOs
export interface CreateStudentRequest {
  matricula: string;
  cpf: string;
  nome: string;
  email: string;
}

export interface UpdateStudentRequest {
  matricula?: string;
  cpf?: string;
  nome?: string;
  email?: string;
}

export interface StudentSearchParams {
  search?: string;
  page?: number;
  limit?: number;
}

// Response DTOs
export interface StudentResponse {
  id: number;
  matricula: string;
  cpf: string;
  nome: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentListResponse {
  students: StudentResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface StudentWithEnrollmentsResponse extends StudentResponse {
  enrollments: {
    id_turma: number;
    status: string;
    class: {
      id: number;
      nome: string;
      turno: string;
    };
  }[];
}
