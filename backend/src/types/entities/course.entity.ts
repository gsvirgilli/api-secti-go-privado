import type { BaseEntity } from '../common/index.js';

export interface Course extends BaseEntity {
  nome: string;
  carga_horaria: number;
  descricao: string | null;
}

export interface CourseWithRelations extends Course {
  // Add relations here when needed
  // classes?: Class[];
}
