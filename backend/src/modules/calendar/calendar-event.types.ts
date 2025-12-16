/**
 * Tipos para o módulo de Calendário Académico
 */

export interface CreateCalendarEventData {
  titulo: string;
  descricao?: string | null;
  data_inicio: Date;
  data_fim?: Date | null;
  tipo: 'AULA' | 'PROVA' | 'ENTREGA' | 'FERIADO' | 'EVENTO' | 'INSCRICAO' | 'FORMATURAS';
  status?: 'PLANEJADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  turma_id?: number | null;
  curso_id?: number | null;
  cor?: string | null;
}

export interface UpdateCalendarEventData {
  titulo?: string;
  descricao?: string | null;
  data_inicio?: Date;
  data_fim?: Date | null;
  tipo?: 'AULA' | 'PROVA' | 'ENTREGA' | 'FERIADO' | 'EVENTO' | 'INSCRICAO' | 'FORMATURAS';
  status?: 'PLANEJADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  turma_id?: number | null;
  curso_id?: number | null;
  cor?: string | null;
}
