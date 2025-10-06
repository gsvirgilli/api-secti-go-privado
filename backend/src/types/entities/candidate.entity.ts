import type { BaseEntity, CandidateStatus } from '../common/index.js';

export interface Candidate extends BaseEntity {
  nome: string;
  cpf: string;
  email: string;
  status: CandidateStatus;
  id_turma_desejada: number | null;
}

export interface CandidateWithRelations extends Candidate {
  // Add relations here when needed
  desiredClass?: import('./class.entity.js').Class;
}
