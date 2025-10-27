import type { BaseEntity, ClassShift } from '../common/index.js';

export interface Class extends BaseEntity {
  nome: string;
  turno: ClassShift;
  data_inicio: Date | null;
  data_fim: Date | null;
  id_curso: number;
}

export interface ClassWithRelations extends Class {
  // Add relations here when needed
  course?: import('./course.entity.js').Course;
  // enrollments?: Enrollment[];
  // attendances?: Attendance[];
}

