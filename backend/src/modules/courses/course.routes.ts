import { Router } from 'express';
import CourseController from './course.controller.js';
import {
  validateCreateCourse,
  validateUpdateCourse,
  validateGetCourse,
  validateCourseFilters
} from './course.validator.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { auditMiddleware } from '../../middlewares/audit.middleware.js';
import Course from './course.model.js';

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

/**
 * @swagger
 * /api/courses/statistics:
 *   get:
 *     summary: Obter estatísticas dos cursos
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas dos cursos
 *       401:
 *         description: Não autenticado
 */
router.get('/statistics', isAuthenticated, CourseController.statistics);

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Listar todos os cursos (autenticado)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome
 *       - in: query
 *         name: carga_horaria_min
 *         schema:
 *           type: integer
 *         description: Carga horária mínima
 *       - in: query
 *         name: carga_horaria_max
 *         schema:
 *           type: integer
 *         description: Carga horária máxima
 *     responses:
 *       200:
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       401:
 *         description: Não autenticado
 *   post:
 *     summary: Criar novo curso
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - carga_horaria
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Python Fundamentals
 *               descricao:
 *                 type: string
 *                 example: Curso completo de Python
 *               carga_horaria:
 *                 type: integer
 *                 minimum: 1
 *                 example: 40
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */
router.get('/', isAuthenticated, validateCourseFilters, CourseController.index);
router.post('/', isAuthenticated, auditMiddleware({
  entidade: 'curso',
  getEntityId: (req) => req.body.id,
}), validateCreateCourse, CourseController.store);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Buscar curso por ID (autenticado)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Não autenticado
 *   put:
 *     summary: Atualizar curso
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               carga_horaria:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Curso atualizado com sucesso
 *       404:
 *         description: Curso não encontrado
 *       401:
 *         description: Não autenticado
 *   delete:
 *     summary: Deletar curso (verifica se não há turmas)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Curso deletado com sucesso
 *       400:
 *         description: Curso possui turmas associadas
 *       404:
 *         description: Curso não encontrado
 *       401:
 *         description: Não autenticado
 */
router.get('/:id', isAuthenticated, validateGetCourse, CourseController.show);
router.put('/:id', isAuthenticated, auditMiddleware({
  entidade: 'curso',
  getEntityId: (req) => Number(req.params.id),
  getOldData: async (req) => {
    const course = await Course.findByPk(req.params.id);
    return course?.toJSON();
  }
}), validateUpdateCourse, CourseController.update);
router.delete('/:id', isAuthenticated, auditMiddleware({
  entidade: 'curso',
  getEntityId: (req) => Number(req.params.id),
  getOldData: async (req) => {
    const course = await Course.findByPk(req.params.id);
    return course?.toJSON();
  }
}), validateGetCourse, CourseController.destroy);

export default router;