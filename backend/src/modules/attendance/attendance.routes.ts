import { Router } from 'express';
import AttendanceController from './attendance.controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const router = Router();

/**
 * Rotas de Presença
 * Todas as rotas exigem autenticação JWT
 */

/**
 * @swagger
 * /api/attendances/bulk:
 *   post:
 *     summary: Registrar presença em lote (múltiplos alunos)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attendances
 *             properties:
 *               attendances:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id_aluno
 *                     - id_turma
 *                     - data_chamada
 *                     - status
 *                   properties:
 *                     id_aluno:
 *                       type: integer
 *                     id_turma:
 *                       type: integer
 *                     data_chamada:
 *                       type: string
 *                       format: date
 *                     status:
 *                       type: string
 *                       enum: [PRESENTE, AUSENTE, JUSTIFICADO]
 *             example:
 *               attendances:
 *                 - id_aluno: 1
 *                   id_turma: 1
 *                   data_chamada: '2024-11-03'
 *                   status: PRESENTE
 *                 - id_aluno: 2
 *                   id_turma: 1
 *                   data_chamada: '2024-11-03'
 *                   status: AUSENTE
 *     responses:
 *       201:
 *         description: Presenças registradas com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */
router.post(
  '/bulk',
  isAuthenticated,
  AttendanceController.createBulk
);

/**
 * @swagger
 * /api/attendances/stats/{id_aluno}/{id_turma}:
 *   get:
 *     summary: Obter estatísticas de presença de um aluno
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_aluno
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *       - in: path
 *         name: id_turma
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Estatísticas de presença
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_aluno:
 *                   type: integer
 *                 id_turma:
 *                   type: integer
 *                 total_aulas:
 *                   type: integer
 *                 total_presencas:
 *                   type: integer
 *                 total_ausencias:
 *                   type: integer
 *                 total_justificadas:
 *                   type: integer
 *                 percentual_presenca:
 *                   type: number
 *                   format: float
 *       404:
 *         description: Aluno ou turma não encontrado
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/stats/:id_aluno/:id_turma',
  isAuthenticated,
  AttendanceController.getStudentStats
);

/**
 * @swagger
 * /api/attendances/report/{id_turma}/{data}:
 *   get:
 *     summary: Obter relatório de presença diário de uma turma
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_turma
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *       - in: path
 *         name: data
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data da chamada (YYYY-MM-DD)
 *         example: '2024-11-03'
 *     responses:
 *       200:
 *         description: Relatório de presença
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_turma:
 *                   type: integer
 *                 data:
 *                   type: string
 *                   format: date
 *                 total_alunos:
 *                   type: integer
 *                 presencas:
 *                   type: integer
 *                 ausencias:
 *                   type: integer
 *                 justificadas:
 *                   type: integer
 *                 alunos:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Turma não encontrada
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/report/:id_turma/:data',
  isAuthenticated,
  AttendanceController.getClassReport
);

/**
 * @swagger
 * /api/attendances:
 *   get:
 *     summary: Listar presenças com filtros
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_aluno
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do aluno
 *       - in: query
 *         name: id_turma
 *         schema:
 *           type: integer
 *         description: Filtrar por ID da turma
 *       - in: query
 *         name: data_chamada
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por data (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PRESENTE, AUSENTE, JUSTIFICADO]
 *         description: Filtrar por status
 *     responses:
 *       200:
 *         description: Lista de presenças
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 *       401:
 *         description: Não autenticado
 *   post:
 *     summary: Registrar presença individual
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_aluno
 *               - id_turma
 *               - data_chamada
 *               - status
 *             properties:
 *               id_aluno:
 *                 type: integer
 *                 example: 1
 *               id_turma:
 *                 type: integer
 *                 example: 1
 *               data_chamada:
 *                 type: string
 *                 format: date
 *                 example: '2024-11-03'
 *               status:
 *                 type: string
 *                 enum: [PRESENTE, AUSENTE, JUSTIFICADO]
 *                 example: PRESENTE
 *     responses:
 *       201:
 *         description: Presença registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       400:
 *         description: Dados inválidos ou aluno não matriculado
 *       409:
 *         description: Presença já registrada para esta data
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/',
  isAuthenticated,
  AttendanceController.list
);

router.post(
  '/',
  isAuthenticated,
  AttendanceController.create
);

/**
 * @swagger
 * /api/attendances/{id}:
 *   get:
 *     summary: Buscar presença por ID
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da presença
 *     responses:
 *       200:
 *         description: Dados da presença
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       404:
 *         description: Presença não encontrada
 *       401:
 *         description: Não autenticado
 *   patch:
 *     summary: Atualizar status da presença
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da presença
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PRESENTE, AUSENTE, JUSTIFICADO]
 *                 example: JUSTIFICADO
 *     responses:
 *       200:
 *         description: Presença atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       404:
 *         description: Presença não encontrada
 *       401:
 *         description: Não autenticado
 *   delete:
 *     summary: Deletar registro de presença
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da presença
 *     responses:
 *       200:
 *         description: Presença deletada com sucesso
 *       404:
 *         description: Presença não encontrada
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/:id',
  isAuthenticated,
  AttendanceController.findById
);

router.patch(
  '/:id',
  isAuthenticated,
  AttendanceController.update
);

router.delete(
  '/:id',
  isAuthenticated,
  AttendanceController.delete
);

export default router;
