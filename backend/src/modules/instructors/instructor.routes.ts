import { Router } from 'express';
import InstructorController from './instructor.controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { auditMiddleware } from '../../middlewares/audit.middleware.js';
import Instructor from './instructor.model.js';

const router = Router();

/**
 * Rotas de Instrutores
 * Todas as rotas exigem autenticação JWT
 */

/**
 * @swagger
 * /api/instructors/statistics:
 *   get:
 *     summary: Obter estatísticas dos instrutores
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas dos instrutores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalInstructors:
 *                   type: integer
 *                   example: 15
 *                 totalWithClasses:
 *                   type: integer
 *                   example: 12
 *                 totalWithoutClasses:
 *                   type: integer
 *                   example: 3
 *                 mostActiveInstructor:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     totalTurmas:
 *                       type: integer
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/statistics',
  isAuthenticated,
  InstructorController.getStatistics
);

/**
 * @swagger
 * /api/instructors/cpf/{cpf}:
 *   get:
 *     summary: Buscar instrutor por CPF
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{11}$'
 *         description: CPF do instrutor (11 dígitos)
 *         example: '12345678901'
 *     responses:
 *       200:
 *         description: Dados do instrutor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       404:
 *         description: Instrutor não encontrado
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/cpf/:cpf',
  isAuthenticated,
  InstructorController.findByCPF
);

/**
 * @swagger
 * /api/instructors/email/{email}:
 *   get:
 *     summary: Buscar instrutor por email
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email do instrutor
 *         example: 'instrutor@example.com'
 *     responses:
 *       200:
 *         description: Dados do instrutor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       404:
 *         description: Instrutor não encontrado
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/email/:email',
  isAuthenticated,
  InstructorController.findByEmail
);

/**
 * @swagger
 * /api/instructors:
 *   get:
 *     summary: Listar todos os instrutores
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome (busca parcial)
 *         example: 'João'
 *       - in: query
 *         name: cpf
 *         schema:
 *           type: string
 *           pattern: '^\d{11}$'
 *         description: Filtrar por CPF (11 dígitos)
 *         example: '12345678901'
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email (busca parcial)
 *         example: 'instrutor@example.com'
 *       - in: query
 *         name: especialidade
 *         schema:
 *           type: string
 *         description: Filtrar por especialidade (busca parcial)
 *         example: 'Programação'
 *     responses:
 *       200:
 *         description: Lista de instrutores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instructor'
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/',
  isAuthenticated,
  InstructorController.list
);

/**
 * @swagger
 * /api/instructors:
 *   post:
 *     summary: Criar novo instrutor
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cpf
 *               - nome
 *               - email
 *             properties:
 *               cpf:
 *                 type: string
 *                 pattern: '^\d{11}$'
 *                 description: CPF do instrutor (11 dígitos)
 *                 example: '12345678901'
 *               nome:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 description: Nome completo do instrutor
 *                 example: 'João Silva'
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 100
 *                 description: Email do instrutor
 *                 example: 'joao.silva@example.com'
 *               especialidade:
 *                 type: string
 *                 maxLength: 100
 *                 nullable: true
 *                 description: Especialidade do instrutor
 *                 example: 'Desenvolvimento Web'
 *     responses:
 *       201:
 *         description: Instrutor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       400:
 *         description: Erro de validação ou CPF/email já cadastrado
 *       401:
 *         description: Não autenticado
 */
router.post(
  '/',
  isAuthenticated,
  auditMiddleware({
    entidade: 'instrutor',
    getEntityId: (req) => req.body.id,
  }),
  InstructorController.create
);

/**
 * @swagger
 * /api/instructors/{id}:
 *   get:
 *     summary: Buscar instrutor por ID
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do instrutor
 *         example: 1
 *     responses:
 *       200:
 *         description: Dados do instrutor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       404:
 *         description: Instrutor não encontrado
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/:id',
  isAuthenticated,
  InstructorController.findById
);

/**
 * @swagger
 * /api/instructors/{id}:
 *   put:
 *     summary: Atualizar instrutor
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do instrutor
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 description: Nome completo do instrutor
 *                 example: 'João Silva Santos'
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 100
 *                 description: Email do instrutor
 *                 example: 'joao.santos@example.com'
 *               especialidade:
 *                 type: string
 *                 maxLength: 100
 *                 nullable: true
 *                 description: Especialidade do instrutor
 *                 example: 'Full Stack Development'
 *     responses:
 *       200:
 *         description: Instrutor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       400:
 *         description: Erro de validação ou email já cadastrado
 *       404:
 *         description: Instrutor não encontrado
 *       401:
 *         description: Não autenticado
 */
router.put(
  '/:id',
  isAuthenticated,
  auditMiddleware({
    entidade: 'instrutor',
    getEntityId: (req) => Number(req.params.id),
    getOldData: async (req) => {
      const instructor = await Instructor.findByPk(req.params.id);
      return instructor?.toJSON();
    }
  }),
  InstructorController.update
);

/**
 * @swagger
 * /api/instructors/{id}:
 *   delete:
 *     summary: Deletar instrutor
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do instrutor
 *         example: 1
 *     responses:
 *       204:
 *         description: Instrutor deletado com sucesso
 *       400:
 *         description: Instrutor possui turmas associadas
 *       404:
 *         description: Instrutor não encontrado
 *       401:
 *         description: Não autenticado
 */
router.delete(
  '/:id',
  isAuthenticated,
  auditMiddleware({
    entidade: 'instrutor',
    getEntityId: (req) => Number(req.params.id),
    getOldData: async (req) => {
      const instructor = await Instructor.findByPk(req.params.id);
      return instructor?.toJSON();
    }
  }),
  InstructorController.delete
);

/**
 * @swagger
 * /api/instructors/{id}/classes:
 *   get:
 *     summary: Listar turmas de um instrutor
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do instrutor
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de turmas do instrutor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_instrutor:
 *                     type: integer
 *                   id_turma:
 *                     type: integer
 *                   turma:
 *                     $ref: '#/components/schemas/Class'
 *       404:
 *         description: Instrutor não encontrado
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/:id/classes',
  isAuthenticated,
  InstructorController.getClasses
);

/**
 * @swagger
 * /api/instructors/{id}/classes:
 *   post:
 *     summary: Atribuir instrutor a uma turma
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do instrutor
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_turma
 *             properties:
 *               id_turma:
 *                 type: integer
 *                 description: ID da turma
 *                 example: 5
 *     responses:
 *       201:
 *         description: Instrutor atribuído à turma com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_instrutor:
 *                   type: integer
 *                 id_turma:
 *                   type: integer
 *       400:
 *         description: Instrutor já atribuído à turma
 *       404:
 *         description: Instrutor ou turma não encontrado
 *       401:
 *         description: Não autenticado
 */
router.post(
  '/:id/classes',
  isAuthenticated,
  InstructorController.assignToClass
);

/**
 * @swagger
 * /api/instructors/{id}/classes/{classId}:
 *   delete:
 *     summary: Desatribuir instrutor de uma turma
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do instrutor
 *         example: 1
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *         example: 5
 *     responses:
 *       204:
 *         description: Instrutor desatribuído da turma com sucesso
 *       404:
 *         description: Instrutor não encontrado ou não está atribuído à turma
 *       401:
 *         description: Não autenticado
 */
router.delete(
  '/:id/classes/:classId',
  isAuthenticated,
  InstructorController.unassignFromClass
);

export default router;
