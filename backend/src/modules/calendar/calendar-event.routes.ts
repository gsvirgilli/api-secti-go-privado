import { Router } from 'express';
import CalendarEventController from './calendar-event.controller.js';

const router = Router();

/**
 * Rotas de Calendário Académico
 */

// GET /api/calendar - Listar eventos com filtros
router.get('/', CalendarEventController.list.bind(CalendarEventController));

// GET /api/calendar/upcoming - Próximos eventos
router.get('/upcoming', CalendarEventController.upcoming.bind(CalendarEventController));

// GET /api/calendar/academic - Calendário académico
router.get('/academic', CalendarEventController.academic.bind(CalendarEventController));

// GET /api/calendar/:id - Buscar por ID
router.get('/:id', CalendarEventController.findById.bind(CalendarEventController));

// POST /api/calendar - Criar evento
router.post('/', CalendarEventController.create.bind(CalendarEventController));

// PUT /api/calendar/:id - Atualizar evento
router.put('/:id', CalendarEventController.update.bind(CalendarEventController));

// DELETE /api/calendar/:id - Deletar evento
router.delete('/:id', CalendarEventController.delete.bind(CalendarEventController));

export default router;
