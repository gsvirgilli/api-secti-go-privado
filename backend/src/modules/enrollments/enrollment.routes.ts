import { Router } from 'express';
import EnrollmentController from './enrollment.controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  createEnrollmentSchema,
  updateEnrollmentSchema,
  transferEnrollmentSchema,
} from './enrollment.validator.js';

const router = Router();

/**
 * Rotas de Matrículas
 * Todas as rotas exigem autenticação JWT
 */

// Rota de estatísticas deve vir antes de /:id_aluno/:id_turma para evitar conflito
router.get(
  '/statistics',
  isAuthenticated,
  EnrollmentController.getStatistics
);

// Rotas para buscar matrículas por aluno ou turma
router.get(
  '/student/:id_aluno',
  isAuthenticated,
  EnrollmentController.findByStudent
);

router.get(
  '/class/:id_turma',
  isAuthenticated,
  EnrollmentController.findByClass
);

// Lista matrículas com filtros opcionais
router.get(
  '/',
  isAuthenticated,
  EnrollmentController.list
);

// Busca matrícula específica
router.get(
  '/:id_aluno/:id_turma',
  isAuthenticated,
  EnrollmentController.findOne
);

// Cria nova matrícula
router.post(
  '/',
  isAuthenticated,
  validateRequest(createEnrollmentSchema),
  EnrollmentController.create
);

// Atualiza matrícula existente
router.put(
  '/:id_aluno/:id_turma',
  isAuthenticated,
  validateRequest(updateEnrollmentSchema),
  EnrollmentController.update
);

// Cancela matrícula
router.post(
  '/:id_aluno/:id_turma/cancel',
  isAuthenticated,
  EnrollmentController.cancel
);

// Reativa matrícula
router.put(
  '/:id_aluno/:id_turma/reactivate',
  isAuthenticated,
  EnrollmentController.reactivate
);

// Transfere aluno para outra turma
router.post(
  '/:id_aluno/:id_turma/transfer',
  isAuthenticated,
  validateRequest(transferEnrollmentSchema),
  EnrollmentController.transfer
);

// Deleta matrícula
router.delete(
  '/:id_aluno/:id_turma',
  isAuthenticated,
  EnrollmentController.delete
);

export default router;
