import { Router } from 'express';
import StudentController from './student.controller.js';
import EnrollmentController from '../enrollments/enrollment.controller.js';
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

/**
 * @swagger
 * /api/students/statistics:
 *   get:
 *     summary: Obter estatísticas dos alunos
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas dos alunos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 ativos:
 *                   type: integer
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/statistics',
  isAuthenticated,
  StudentController.getStatistics
);

/**
 * @swagger
 * /api/students/cpf/{cpf}:
 *   get:
 *     summary: Buscar aluno por CPF
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{11}$'
 *         description: CPF do aluno (11 dígitos)
 *         example: '12345678901'
 *     responses:
 *       200:
 *         description: Dados do aluno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Aluno não encontrado
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/cpf/:cpf',
  isAuthenticated,
  StudentController.findByCPF
);

/**
 * @swagger
 * /api/students/matricula/{matricula}:
 *   get:
 *     summary: Buscar aluno por matrícula
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matricula
 *         required: true
 *         schema:
 *           type: string
 *         description: Matrícula do aluno
 *         example: '2024001'
 *     responses:
 *       200:
 *         description: Dados do aluno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Aluno não encontrado
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/matricula/:matricula',
  isAuthenticated,
  StudentController.findByMatricula
);

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Listar todos os alunos
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome
 *       - in: query
 *         name: cpf
 *         schema:
 *           type: string
 *         description: Filtrar por CPF
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email
 *     responses:
 *       200:
 *         description: Lista de alunos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/',
  isAuthenticated,
  StudentController.list
);

/**
 * @swagger
 * /api/students/{id}/enrollments:
 *   get:
 *     summary: Listar matrículas de um aluno
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Lista de matrículas do aluno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Enrollment'
 *       404:
 *         description: Aluno não encontrado
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/:id/enrollments',
  isAuthenticated,
  EnrollmentController.listByStudent
);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Buscar aluno por ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Dados do aluno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Aluno não encontrado
 *       401:
 *         description: Não autenticado
 *   put:
 *     summary: Atualizar aluno
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Aluno não encontrado
 *       401:
 *         description: Não autenticado
 *   delete:
 *     summary: Deletar aluno
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Aluno deletado com sucesso
 *       404:
 *         description: Aluno não encontrado
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/:id',
  isAuthenticated,
  StudentController.findById
);

router.put(
  '/:id',
  isAuthenticated,
  validateRequest(updateStudentSchema),
  StudentController.update
);

router.delete(
  '/:id',
  isAuthenticated,
  StudentController.delete
);

export default router;
