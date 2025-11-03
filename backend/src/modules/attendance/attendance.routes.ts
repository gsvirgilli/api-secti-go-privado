import { Router } from 'express';
import AttendanceController from './attendance.controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const router = Router();

/**
 * Rotas de Presença
 * Todas as rotas exigem autenticação JWT
 */

// Rotas específicas devem vir antes das rotas genéricas

// Registro em lote de presenças
router.post(
  '/bulk',
  isAuthenticated,
  AttendanceController.createBulk
);

// Estatísticas de presença de um aluno em uma turma
router.get(
  '/stats/:id_aluno/:id_turma',
  isAuthenticated,
  AttendanceController.getStudentStats
);

// Relatório de presença de uma turma em uma data
router.get(
  '/report/:id_turma/:data',
  isAuthenticated,
  AttendanceController.getClassReport
);

// Lista presenças com filtros opcionais
router.get(
  '/',
  isAuthenticated,
  AttendanceController.list
);

// Busca presença por ID
router.get(
  '/:id',
  isAuthenticated,
  AttendanceController.findById
);

// Registra uma presença individual
router.post(
  '/',
  isAuthenticated,
  AttendanceController.create
);

// Atualiza presença
router.patch(
  '/:id',
  isAuthenticated,
  AttendanceController.update
);

// Remove presença
router.delete(
  '/:id',
  isAuthenticated,
  AttendanceController.delete
);

export default router;
