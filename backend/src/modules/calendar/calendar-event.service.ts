import CalendarEvent from './calendar-event.model.js';
import { Op } from 'sequelize';
import type { CreateCalendarEventData, UpdateCalendarEventData } from './calendar-event.types.js';

class CalendarEventService {
  /**
   * Lista eventos do calendário com filtros
   */
  async list(filters: {
    mes?: number;
    ano?: number;
    tipo?: string;
    status?: string;
    turma_id?: number;
    curso_id?: number;
    page?: number;
    limit?: number;
  }) {
    const { mes, ano, tipo, status, turma_id, curso_id, page = 1, limit = 50 } = filters;
    
    const where: any = {};

    // Filtro por mês e ano
    if (mes && ano) {
      const dataInicio = new Date(ano, mes - 1, 1);
      const dataFim = new Date(ano, mes, 0, 23, 59, 59);
      where.data_inicio = { [Op.between]: [dataInicio, dataFim] };
    } else if (ano) {
      const dataInicio = new Date(ano, 0, 1);
      const dataFim = new Date(ano, 11, 31, 23, 59, 59);
      where.data_inicio = { [Op.between]: [dataInicio, dataFim] };
    }

    if (tipo) where.tipo = tipo;
    if (status) where.status = status;
    if (turma_id) where.turma_id = turma_id;
    if (curso_id) where.curso_id = curso_id;

    const offset = (page - 1) * limit;

    const { count, rows } = await CalendarEvent.findAndCountAll({
      where,
      order: [['data_inicio', 'ASC']],
      offset,
      limit,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Busca um evento por ID
   */
  async findById(id: number): Promise<CalendarEvent> {
    const event = await CalendarEvent.findByPk(id);
    if (!event) {
      throw new Error('Evento não encontrado');
    }
    return event;
  }

  /**
   * Cria um novo evento
   */
  async create(data: CreateCalendarEventData): Promise<CalendarEvent> {
    // Normalizar datas para evitar problemas de timezone
    if (data.data_inicio && typeof data.data_inicio === 'string') {
      // Garante que a data seja interpretada como UTC (sem timezone)
      data.data_inicio = new Date(data.data_inicio + 'T00:00:00Z') as any;
    }
    if (data.data_fim && typeof data.data_fim === 'string') {
      data.data_fim = new Date(data.data_fim + 'T00:00:00Z') as any;
    }

    const event = await CalendarEvent.create(data as any);
    return event;
  }

  /**
   * Atualiza um evento
   */
  async update(id: number, data: UpdateCalendarEventData): Promise<CalendarEvent> {
    const event = await this.findById(id);
    
    // Normalizar datas para evitar problemas de timezone
    if (data.data_inicio && typeof data.data_inicio === 'string') {
      data.data_inicio = new Date(data.data_inicio + 'T00:00:00Z') as any;
    }
    if (data.data_fim && typeof data.data_fim === 'string') {
      data.data_fim = new Date(data.data_fim + 'T00:00:00Z') as any;
    }

    await event.update(data);
    return event;
  }

  /**
   * Deleta um evento
   */
  async delete(id: number): Promise<void> {
    const event = await this.findById(id);
    await event.destroy();
  }

  /**
   * Lista eventos próximos (próximos 30 dias)
   */
  async listUpcoming(limit: number = 10): Promise<CalendarEvent[]> {
    const hoje = new Date();
    const proximamente = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);

    return CalendarEvent.findAll({
      where: {
        data_inicio: {
          [Op.between]: [hoje, proximamente],
        },
        status: { [Op.in]: ['PLANEJADO', 'EM_ANDAMENTO'] },
      },
      order: [['data_inicio', 'ASC']],
      limit,
    });
  }

  /**
   * Lista eventos do calendário académico (todos os tipos)
   */
  async listAcademicCalendar(mes?: number, ano?: number) {
    const where: any = {
      tipo: { [Op.in]: ['INSCRICAO', 'AULA', 'PROVA', 'ENTREGA', 'FORMATURAS', 'FERIADO'] },
    };

    if (mes && ano) {
      const dataInicio = new Date(ano, mes - 1, 1);
      const dataFim = new Date(ano, mes, 0, 23, 59, 59);
      where.data_inicio = { [Op.between]: [dataInicio, dataFim] };
    }

    return CalendarEvent.findAll({
      where,
      order: [['data_inicio', 'ASC']],
    });
  }
}

export default new CalendarEventService();
