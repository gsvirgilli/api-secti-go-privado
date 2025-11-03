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

/**
 * @swagger
 * /api/courses/public:
 *   get:
 *     summary: Listar todos os cursos (público)
 *     tags: [Courses]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/public', CourseController.indexPublic);

/**
 * @swagger
 * /api/courses/{id}/public:
 *   get:
 *     summary: Buscar curso por ID (público)
 *     tags: [Courses]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Dados do curso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Curso não encontrado
 */
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