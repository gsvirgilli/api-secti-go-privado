import { Router } from 'express';
import CandidateController from './candidate.controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  createCandidateSchema,
  updateCandidateSchema,
  listCandidateFiltersSchema,
  rejectCandidateSchema
} from './candidate.validator.js';

const router = Router();

/**
 * Rotas de Candidatos
 * Todas as rotas exigem autenticação JWT
 */

// Rota de estatísticas deve vir antes de /:id para evitar conflito
router.get(
  '/statistics',
  isAuthenticated,
  CandidateController.getStatistics
);

// Lista candidatos com filtros opcionais
router.get(
  '/',
  isAuthenticated,
  CandidateController.list
);

// Busca candidato por ID
router.get(
  '/:id',
  isAuthenticated,
  CandidateController.findById
);

// Cria novo candidato
router.post(
  '/',
  isAuthenticated,
  validateRequest(createCandidateSchema),
  CandidateController.create
);

// Atualiza candidato existente
router.put(
  '/:id',
  isAuthenticated,
  validateRequest(updateCandidateSchema),
  CandidateController.update
);

// Deleta candidato
router.delete(
  '/:id',
  isAuthenticated,
  CandidateController.delete
);

// Aprova candidato (converte em aluno)
router.post(
  '/:id/approve',
  isAuthenticated,
  CandidateController.approve
);

// Rejeita candidato
router.post(
  '/:id/reject',
  isAuthenticated,
  validateRequest(rejectCandidateSchema),
  CandidateController.reject
);

export default router;
