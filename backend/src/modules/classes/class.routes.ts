import { Router } from 'express';
import ClassController from './class.controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const router = Router();

/**
 * Rotas de Turmas
 * Todas as rotas requerem autenticação
 */

/**
 * @swagger
 * /api/classes/statistics:
 *   get:
 *     summary: Obter estatísticas das turmas
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas das turmas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 ativas:
 *                   type: integer
 *                 encerradas:
 *                   type: integer
 *                 porTurno:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Não autenticado
 */
router.get('/statistics', isAuthenticated, ClassController.getStatistics);

/**
 * @swagger
 * /api/classes/check-conflict:
 *   post:
 *     summary: Verificar conflito de horário entre turmas
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - turno
 *               - data_inicio
 *               - data_fim
 *               - nome
 *               - id_curso
 *               - vagas
 *             properties:
 *               turno:
 *                 type: string
 *                 enum: [MATUTINO, VESPERTINO, NOTURNO]
 *               data_inicio:
 *                 type: string
 *                 format: date
 *               data_fim:
 *                 type: string
 *                 format: date
 *               nome:
 *                 type: string
 *               id_curso:
 *                 type: integer
 *               vagas:
 *                 type: integer
 *     parameters:
 *       - in: query
 *         name: excludeId
 *         schema:
 *           type: integer
 *         description: ID da turma a excluir da verificação
 *     responses:
 *       200:
 *         description: Resultado da verificação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasConflict:
 *                   type: boolean
 *       401:
 *         description: Não autenticado
 */
router.post('/check-conflict', isAuthenticated, ClassController.checkConflict);

/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Listar todas as turmas
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome
 *       - in: query
 *         name: turno
 *         schema:
 *           type: string
 *           enum: [MATUTINO, VESPERTINO, NOTURNO]
 *         description: Filtrar por turno
 *       - in: query
 *         name: id_curso
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do curso
 *     responses:
 *       200:
 *         description: Lista de turmas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 *       401:
 *         description: Não autenticado
 */
router.get('/', isAuthenticated, ClassController.list);

/**
 * @swagger
 * /api/classes/{id}:
 *   get:
 *     summary: Buscar turma por ID
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Dados da turma
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       404:
 *         description: Turma não encontrada
 *       401:
 *         description: Não autenticado
 */
router.get('/:id', isAuthenticated, ClassController.findById);

/**
 * @swagger
 * /api/classes:
 *   post:
 *     summary: Criar nova turma
 *     tags: [Classes]
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
 *               - turno
 *               - id_curso
 *               - vagas
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Turma Python 2024-1
 *               turno:
 *                 type: string
 *                 enum: [MATUTINO, VESPERTINO, NOTURNO]
 *                 example: MATUTINO
 *               data_inicio:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               data_fim:
 *                 type: string
 *                 format: date
 *                 example: 2024-06-30
 *               id_curso:
 *                 type: integer
 *                 example: 1
 *               vagas:
 *                 type: integer
 *                 minimum: 0
 *                 example: 30
 *     responses:
 *       201:
 *         description: Turma criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */
router.post('/', isAuthenticated, ClassController.create);

/**
 * @swagger
 * /api/classes/{id}:
 *   put:
 *     summary: Atualizar turma
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               turno:
 *                 type: string
 *                 enum: [MATUTINO, VESPERTINO, NOTURNO]
 *               data_inicio:
 *                 type: string
 *                 format: date
 *               data_fim:
 *                 type: string
 *                 format: date
 *               vagas:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Turma atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       404:
 *         description: Turma não encontrada
 *       401:
 *         description: Não autenticado
 *   delete:
 *     summary: Deletar turma
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Turma deletada com sucesso
 *       404:
 *         description: Turma não encontrada
 *       401:
 *         description: Não autenticado
 */
router.put('/:id', isAuthenticated, ClassController.update);
router.delete('/:id', isAuthenticated, ClassController.delete);

export default router;
