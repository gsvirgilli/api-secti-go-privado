import type { BaseEntity } from '../common/index.js';

export interface Instructor extends BaseEntity {
  cpf: string;
  nome: string;
  email: string;
  especialidade: string | null;
}

export interface InstructorWithRelations extends Instructor {
  // Add relations here when needed
  // classes?: Class[];
}

