import { Router } from 'express';
import auditLogController from './audit-log.controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { isAdmin } from '../../middlewares/isAdmin.js';

const router = Router();

// Wrapper para tratamento de erros assíncronos
const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @swagger
 * components:
 *   schemas:
 *     AuditLog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do log
 *         usuario_id:
 *           type: integer
 *           nullable: true
 *           description: ID do usuário que executou a ação
 *         acao:
 *           type: string
 *           enum: [CREATE, UPDATE, DELETE, LOGIN, LOGOUT, APPROVE, REJECT]
 *           description: Tipo de ação executada
 *         entidade:
 *           type: string
 *           description: Nome da entidade afetada (tabela/model)
 *         entidade_id:
 *           type: integer
 *           nullable: true
 *           description: ID do registro afetado
 *         dados_anteriores:
 *           type: object
 *           nullable: true
 *           description: Estado anterior dos dados (para UPDATE/DELETE)
 *         dados_novos:
 *           type: object
 *           nullable: true
 *           description: Novo estado dos dados (para CREATE/UPDATE)
 *         ip:
 *           type: string
 *           nullable: true
 *           description: Endereço IP do usuário
 *         user_agent:
 *           type: string
 *           nullable: true
 *           description: User agent do navegador
 *         descricao:
 *           type: string
 *           nullable: true
 *           description: Descrição adicional da ação
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data/hora da ação
 *       example:
 *         id: 1
 *         usuario_id: 13
 *         acao: UPDATE
 *         entidade: turma
 *         entidade_id: 5
 *         dados_anteriores: {"status": "ATIVA"}
 *         dados_novos: {"status": "ENCERRADA"}
 *         ip: "192.168.1.100"
 *         user_agent: "Mozilla/5.0..."
 *         descricao: "Turma encerrada manualmente"
 *         createdAt: "2024-01-15T10:30:00Z"
 *
 *     AuditLogStats:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total de logs
 *         por_acao:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               acao:
 *                 type: string
 *               total:
 *                 type: integer
 *         por_entidade:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               entidade:
 *                 type: string
 *               total:
 *                 type: integer
 */

/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     summary: Lista todos os logs de auditoria
 *     description: Retorna lista paginada de logs com filtros opcionais. Apenas administradores.
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do usuário
 *       - in: query
 *         name: acao
 *         schema:
 *           type: string
 *           enum: [CREATE, UPDATE, DELETE, LOGIN, LOGOUT, APPROVE, REJECT]
 *         description: Filtrar por tipo de ação
 *       - in: query
 *         name: entidade
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de entidade
 *       - in: query
 *         name: entidade_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID da entidade
 *       - in: query
 *         name: data_inicio
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data inicial (formato ISO 8601)
 *       - in: query
 *         name: data_fim
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data final (formato ISO 8601)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Registros por página
 *     responses:
 *       200:
 *         description: Lista de logs retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AuditLog'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (apenas admin)
 *       500:
 *         description: Erro interno
 */
router.get('/', isAuthenticated, isAdmin, asyncHandler(auditLogController.listLogs));

/**
 * @swagger
 * /api/audit-logs/stats:
 *   get:
 *     summary: Estatísticas de auditoria
 *     description: Retorna estatísticas agregadas dos logs de auditoria. Apenas administradores.
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: data_inicio
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data inicial (formato ISO 8601)
 *       - in: query
 *         name: data_fim
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data final (formato ISO 8601)
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditLogStats'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (apenas admin)
 *       500:
 *         description: Erro interno
 */
router.get('/stats', isAuthenticated, isAdmin, asyncHandler(auditLogController.getStats));

/**
 * @swagger
 * /api/audit-logs/user/{id}:
 *   get:
 *     summary: Busca logs de um usuário específico
 *     description: Retorna lista paginada de logs de um usuário. Apenas administradores.
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Registros por página
 *     responses:
 *       200:
 *         description: Lista de logs retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AuditLog'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (apenas admin)
 *       500:
 *         description: Erro interno
 */
router.get('/user/:id', isAuthenticated, isAdmin, asyncHandler(auditLogController.getUserLogs));

/**
 * @swagger
 * /api/audit-logs/entity/{type}/{id}:
 *   get:
 *     summary: Busca logs de uma entidade específica
 *     description: Retorna lista paginada de logs de uma entidade. Apenas administradores.
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Tipo da entidade (turma, aluno, etc)
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da entidade
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Registros por página
 *     responses:
 *       200:
 *         description: Lista de logs retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AuditLog'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (apenas admin)
 *       500:
 *         description: Erro interno
 */
router.get('/entity/:type/:id', isAuthenticated, isAdmin, asyncHandler(auditLogController.getEntityLogs));

/**
 * @swagger
 * /api/audit-logs/{id}:
 *   get:
 *     summary: Busca um log específico
 *     description: Retorna detalhes de um log de auditoria. Apenas administradores.
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do log
 *     responses:
 *       200:
 *         description: Log retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditLog'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (apenas admin)
 *       404:
 *         description: Log não encontrado
 *       500:
 *         description: Erro interno
 */
router.get('/:id', isAuthenticated, isAdmin, asyncHandler(auditLogController.getLog));

export default router;
