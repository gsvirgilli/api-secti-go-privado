import type { BaseEntity, AttendanceStatus } from '../common/index.js';

export interface Attendance extends BaseEntity {
  id_aluno: number;
  id_turma: number;
  data_chamada: Date;
  status: AttendanceStatus;
}

export interface AttendanceWithRelations extends Attendance {
  // Add relations here when needed
  student?: import('./student.entity.js').Student;
  class?: import('./class.entity.js').Class;
}

