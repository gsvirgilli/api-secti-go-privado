export interface Student {
  id: number;
  matricula: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  enrollmentDate: string;
  status: string;
  course: string;
  class: string;
  progress: number;
  attendance: number;
  grades: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  students: number;
  level: string;
  status: string;
  color: string;
}

export interface Class {
  id: number;
  name: string;
  course: string;
  instructor: string; // Nome do primeiro instrutor (compatibilidade)
  instructorId?: number; // ID do primeiro instrutor (compatibilidade)
  instructors?: Array<{ id: number; name: string }>; // Múltiplos instrutores
  instructorIds?: number[]; // IDs dos instrutores
  capacity: number;
  enrolled: number;
  schedule: string;
  duration: string;
  status: string;
  startDate: string;
  endDate: string;
  students: Array<{
    id: number;
    name: string;
    status: string;
  }>;
}

export interface Instructor {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  specialization: string;
  experience: string;
  status: string;
  classes: Array<{
    id: number;
    name: string;
    course: string;
  }>;
}

export interface Candidate {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  curso_id?: number;
  turno?: string;
  status?: string;
  // Endereço
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  // Outros campos
  data_nascimento?: string;
  nome_mae?: string;
  sexo?: string;
  deficiencia?: string;
  telefone2?: string;
  rg?: string;
  idade?: number;
  curso_id2?: number;
  turno2?: string;
}
