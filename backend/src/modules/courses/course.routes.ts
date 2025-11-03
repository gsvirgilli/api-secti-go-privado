import { Router } from 'express';
import CourseController from './course.controller.js';
import {
  validateCreateCourse,
  validateUpdateCourse,
  validateGetCourse,
  validateCourseFilters
} from './course.validator.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const router = Router();

/**
 * Rotas públicas (sem autenticação)
 */

// GET /api/courses/public - Listar todos os cursos (público)
router.get('/public', CourseController.indexPublic);

// GET /api/courses/:id/public - Buscar curso específico com turmas (público)
router.get('/:id/public', CourseController.showPublic);

/**
 * Rotas para gerenciamento de cursos
 * Todas as rotas abaixo requerem autenticação
 */

// GET /api/courses/statistics - Obter estatísticas dos cursos
router.get('/statistics', isAuthenticated, CourseController.statistics);

// GET /api/courses - Listar todos os cursos com filtros opcionais
router.get('/', isAuthenticated, validateCourseFilters, CourseController.index);

// GET /api/courses/:id - Buscar curso específico por ID
router.get('/:id', isAuthenticated, validateGetCourse, CourseController.show);

// POST /api/courses - Criar novo curso
router.post('/', isAuthenticated, validateCreateCourse, CourseController.store);

// PUT /api/courses/:id - Atualizar curso
router.put('/:id', isAuthenticated, validateUpdateCourse, CourseController.update);

// DELETE /api/courses/:id - Deletar curso
router.delete('/:id', isAuthenticated, validateGetCourse, CourseController.destroy);

export default router;