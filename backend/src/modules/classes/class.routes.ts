import { Router } from 'express';
import ClassController from './class.controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const router = Router();

/**
 * Rotas de Turmas
 * Todas as rotas requerem autenticação
 */

// Estatísticas devem vir antes de :id para não ser confundido com um ID
router.get('/statistics', isAuthenticated, ClassController.getStatistics);

// Verificar conflito de horário
router.post('/check-conflict', isAuthenticated, ClassController.checkConflict);

// CRUD básico
router.get('/', isAuthenticated, ClassController.list);
router.get('/:id', isAuthenticated, ClassController.findById);
router.post('/', isAuthenticated, ClassController.create);
router.put('/:id', isAuthenticated, ClassController.update);
router.delete('/:id', isAuthenticated, ClassController.delete);

export default router;
