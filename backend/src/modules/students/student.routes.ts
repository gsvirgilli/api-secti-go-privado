import { Router } from 'express';
import StudentController from './student.controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  updateStudentSchema,
  listStudentFiltersSchema
} from './student.validator.js';

const router = Router();

/**
 * Rotas de Alunos
 * Todas as rotas exigem autenticação JWT
 */

// Rota de estatísticas deve vir antes de /:id para evitar conflito
router.get(
  '/statistics',
  isAuthenticated,
  StudentController.getStatistics
);

// Busca aluno por CPF
router.get(
  '/cpf/:cpf',
  isAuthenticated,
  StudentController.findByCPF
);

// Busca aluno por matrícula
router.get(
  '/matricula/:matricula',
  isAuthenticated,
  StudentController.findByMatricula
);

// Lista alunos com filtros opcionais
router.get(
  '/',
  isAuthenticated,
  StudentController.list
);

// Busca aluno por ID
router.get(
  '/:id',
  isAuthenticated,
  StudentController.findById
);

// Atualiza aluno existente
router.put(
  '/:id',
  isAuthenticated,
  validateRequest(updateStudentSchema),
  StudentController.update
);

// Deleta aluno
router.delete(
  '/:id',
  isAuthenticated,
  StudentController.delete
);

export default router;
