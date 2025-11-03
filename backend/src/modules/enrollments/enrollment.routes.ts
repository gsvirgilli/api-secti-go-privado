import { Router } from 'express';
import EnrollmentController from './enrollment.controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const router = Router();

/**
 * @route GET /api/enrollments
 * @desc Lista todas as matrículas
 * @access Privado (autenticado)
 */
router.get('/', isAuthenticated, EnrollmentController.index);

/**
 * @route GET /api/enrollments/:id_aluno/:id_turma
 * @desc Busca uma matrícula específica
 * @access Privado (autenticado)
 */
router.get('/:id_aluno/:id_turma', isAuthenticated, EnrollmentController.show);

/**
 * @route POST /api/enrollments
 * @desc Cria uma nova matrícula e decrementa vagas da turma
 * @access Privado (autenticado)
 */
router.post('/', isAuthenticated, EnrollmentController.store);

/**
 * @route PATCH /api/enrollments/:id_aluno/:id_turma/cancel
 * @desc Cancela uma matrícula e incrementa vagas da turma
 * @access Privado (autenticado)
 */
router.patch('/:id_aluno/:id_turma/cancel', isAuthenticated, EnrollmentController.cancel);

/**
 * @route DELETE /api/enrollments/:id_aluno/:id_turma
 * @desc Remove uma matrícula e incrementa vagas se não estava cancelada
 * @access Privado (autenticado)
 */
router.delete('/:id_aluno/:id_turma', isAuthenticated, EnrollmentController.destroy);

export default router;
