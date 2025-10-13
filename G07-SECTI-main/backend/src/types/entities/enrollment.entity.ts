import type { Timestamps, EnrollmentStatus } from '../common/index.js';

export interface Enrollment extends Timestamps {
  id_aluno: number;
  id_turma: number;
  status: EnrollmentStatus;
}

export interface EnrollmentWithRelations extends Enrollment {
  // Add relations here when needed
  student?: import('./student.entity.js').Student;
  class?: import('./class.entity.js').Class;
}
