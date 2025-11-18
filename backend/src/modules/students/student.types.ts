export interface CreateStudentData {
  nome: string;
  cpf: string;
  email: string;
  telefone?: string | null;
  data_nascimento?: string | null;
  endereco?: string | null;
  id_curso?: number | null;
  id_turma?: number | null;
  status?: 'ativo' | 'trancado' | 'concluido' | 'desistente';
}
