export interface CreateClassData {
  nome: string;
  turno: 'MANHA' | 'TARDE' | 'NOITE' | 'INTEGRAL';
  data_inicio?: Date | null;
  data_fim?: Date | null;
  id_curso: number;
  vagas: number;
  status?: 'ATIVA' | 'ENCERRADA' | 'CANCELADA';
}
