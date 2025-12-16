import { Request, Response } from 'express';
import CalendarEventService from './calendar-event.service.js';
import {
  createCalendarEventSchema,
  updateCalendarEventSchema,
  listCalendarEventsSchema,
} from './calendar-event.validator.js';
import { z } from 'zod';

class CalendarEventController {
  /**
   * Lista eventos do calendário
   * GET /api/calendar
   */
  async list(req: Request, res: Response) {
    try {
      const filters = listCalendarEventsSchema.parse(req.query);
      const result = await CalendarEventService.list(filters);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues,
        });
      }

      console.error('Erro ao listar eventos:', error);
      return res.status(500).json({ error: 'Erro ao listar eventos' });
    }
  }

  /**
   * Busca um evento por ID
   * GET /api/calendar/:id
   */
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const event = await CalendarEventService.findById(Number(id));
      return res.status(200).json(event);
    } catch (error) {
      if (error instanceof Error && error.message === 'Evento não encontrado') {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }

      console.error('Erro ao buscar evento:', error);
      return res.status(500).json({ error: 'Erro ao buscar evento' });
    }
  }

  /**
   * Cria um novo evento
   * POST /api/calendar
   */
  async create(req: Request, res: Response) {
    try {
      const data = createCalendarEventSchema.parse(req.body) as any;
      const event = await CalendarEventService.create(data);
      return res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues,
        });
      }

      console.error('Erro ao criar evento:', error);
      return res.status(500).json({ error: 'Erro ao criar evento' });
    }
  }

  /**
   * Atualiza um evento
   * PUT /api/calendar/:id
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = updateCalendarEventSchema.parse(req.body);
      const event = await CalendarEventService.update(Number(id), data);
      return res.status(200).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.issues,
        });
      }

      if (error instanceof Error && error.message === 'Evento não encontrado') {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }

      console.error('Erro ao atualizar evento:', error);
      return res.status(500).json({ error: 'Erro ao atualizar evento' });
    }
  }

  /**
   * Deleta um evento
   * DELETE /api/calendar/:id
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await CalendarEventService.delete(Number(id));
      return res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Evento não encontrado') {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }

      console.error('Erro ao deletar evento:', error);
      return res.status(500).json({ error: 'Erro ao deletar evento' });
    }
  }

  /**
   * Lista eventos próximos (próximos 30 dias)
   * GET /api/calendar/upcoming
   */
  async upcoming(req: Request, res: Response) {
    try {
      const { limit = 10 } = req.query;
      const events = await CalendarEventService.listUpcoming(Number(limit));
      return res.status(200).json(events);
    } catch (error) {
      console.error('Erro ao listar eventos próximos:', error);
      return res.status(500).json({ error: 'Erro ao listar eventos próximos' });
    }
  }

  /**
   * Lista calendário académico
   * GET /api/calendar/academic
   */
  async academic(req: Request, res: Response) {
    try {
      const { mes, ano } = req.query;
      const events = await CalendarEventService.listAcademicCalendar(
        mes ? Number(mes) : undefined,
        ano ? Number(ano) : undefined
      );
      return res.status(200).json(events);
    } catch (error) {
      console.error('Erro ao listar calendário académico:', error);
      return res.status(500).json({ error: 'Erro ao listar calendário académico' });
    }
  }
}

export default new CalendarEventController();
