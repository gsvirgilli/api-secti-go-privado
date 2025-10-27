import type { BaseEntity } from '../common/index.js';

export interface Student extends BaseEntity {
  matricula: string;
  cpf: string;
  nome: string;
  email: string;
}

export interface StudentWithRelations extends Student {
  // Add relations here when needed
  // enrollments?: Enrollment[];
  // attendances?: Attendance[];
}

