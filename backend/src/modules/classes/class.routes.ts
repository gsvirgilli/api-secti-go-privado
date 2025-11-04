import { Router } from 'express';
import ClassController from './class.controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { auditMiddleware } from '../../middlewares/audit.middleware.js';
import Class from './class.model.js';

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
 *     summary: Listar todas as turmas com paginação
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
 *           enum: [MANHA, TARDE, NOITE, INTEGRAL]
 *         description: Filtrar por turno
 *       - in: query
 *         name: id_curso
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do curso
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ATIVA, ENCERRADA, CANCELADA]
 *         description: Filtrar por status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Quantidade de itens por página
 *     responses:
 *       200:
 *         description: Lista paginada de turmas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Class'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
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
router.post('/', isAuthenticated, auditMiddleware({
  entidade: 'turma',
  getEntityId: (req) => req.body.id,
}), ClassController.create);

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
router.put('/:id', isAuthenticated, auditMiddleware({
  entidade: 'turma',
  getEntityId: (req) => Number(req.params.id),
  getOldData: async (req) => {
    const turma = await Class.findByPk(req.params.id);
    return turma?.toJSON();
  }
}), ClassController.update);

router.delete('/:id', isAuthenticated, auditMiddleware({
  entidade: 'turma',
  getEntityId: (req) => Number(req.params.id),
  getOldData: async (req) => {
    const turma = await Class.findByPk(req.params.id);
    return turma?.toJSON();
  }
}), ClassController.delete);

/**
 * @swagger
 * /api/classes/{id}/status:
 *   patch:
 *     summary: Alterar status de uma turma
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ATIVA, ENCERRADA, CANCELADA]
 *                 description: Novo status da turma
 *           examples:
 *             encerrar:
 *               summary: Encerrar turma
 *               value:
 *                 status: ENCERRADA
 *             cancelar:
 *               summary: Cancelar turma
 *               value:
 *                 status: CANCELADA
 *             reativar:
 *               summary: Reativar turma cancelada
 *               value:
 *                 status: ATIVA
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       400:
 *         description: Transição de status inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   examples:
 *                     - Apenas turmas ATIVAS podem ser encerradas
 *                     - Turmas ENCERRADAS não podem ser reativadas
 *       404:
 *         description: Turma não encontrada
 *       401:
 *         description: Não autenticado
 */
router.patch('/:id/status', isAuthenticated, auditMiddleware({
  entidade: 'turma',
  getEntityId: (req) => Number(req.params.id),
  getOldData: async (req) => {
    const turma = await Class.findByPk(req.params.id);
    return turma?.toJSON();
  }
}), ClassController.updateStatus);

/**
 * @route POST /api/classes/:id/instructors/:instructorId
 * @description Associa um instrutor a uma turma
 * @access Private
 */
router.post('/:id/instructors/:instructorId', isAuthenticated, ClassController.addInstructor);

/**
 * @route DELETE /api/classes/:id/instructors/:instructorId
 * @description Remove um instrutor de uma turma
 * @access Private
 */
router.delete('/:id/instructors/:instructorId', isAuthenticated, ClassController.removeInstructor);

export default router;
