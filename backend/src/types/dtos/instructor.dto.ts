// Request DTOs
export interface CreateInstructorRequest {
  cpf: string;
  nome: string;
  email: string;
  especialidade?: string;
}

export interface UpdateInstructorRequest {
  cpf?: string;
  nome?: string;
  email?: string;
  especialidade?: string;
}

export interface InstructorSearchParams {
  search?: string;
  especialidade?: string;
  page?: number;
  limit?: number;
}

// Response DTOs
export interface InstructorResponse {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  especialidade: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InstructorListResponse {
  instructors: InstructorResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface InstructorWithClassesResponse extends InstructorResponse {
  classes: {
    id: number;
    nome: string;
    turno: string;
    course: {
      id: number;
      nome: string;
    };
  }[];
}
