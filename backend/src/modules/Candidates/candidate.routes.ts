import { Router } from 'express';
import CandidateController from './candidate.controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  createCandidateSchema,
  updateCandidateSchema,
  listCandidateFiltersSchema,
  rejectCandidateSchema,
  publicCandidateSchema
} from './candidate.validator.js';
import { auditMiddleware } from '../../middlewares/audit.middleware.js';
import Candidate from './candidate.model.js';
import { upload, documentFields } from '../../config/multer.js';

const router = Router();

/**
 * Rotas de Candidatos
 */

// ===== ROTAS PÚBLICAS (sem autenticação) =====

/**
 * @swagger
 * /api/candidates/public:
 *   post:
 *     summary: Criar candidatura pública (sem autenticação)
 *     tags: [Candidates]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cpf
 *               - email
 *               - curso_id
 *               - turno
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 3
 *                 example: João Silva
 *               cpf:
 *                 type: string
 *                 pattern: '^\d{11}$'
 *                 example: '12345678901'
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@exemplo.com
 *               telefone:
 *                 type: string
 *                 example: '11999999999'
 *               curso_id:
 *                 type: integer
 *                 example: 1
 *               turno:
 *                 type: string
 *                 enum: [MATUTINO, VESPERTINO, NOTURNO]
 *                 example: MATUTINO
 *     responses:
 *       201:
 *         description: Candidatura criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidate'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: CPF ou email já cadastrado
 */
router.post(
  '/public',
  upload.fields(documentFields),
  CandidateController.createPublic
);

/**
 * @swagger
 * /api/candidates/validate:
 *   post:
 *     summary: Valida se CPF, email e telefone estão disponíveis
 *     tags: [Candidates]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cpf:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Campos válidos
 *       409:
 *         description: Um ou mais campos já estão em uso
 */
router.post('/validate', CandidateController.validateUniqueFields);

// ===== ROTAS PROTEGIDAS (exigem autenticação) =====

/**
 * @swagger
 * /api/candidates/statistics:
 *   get:
 *     summary: Obter estatísticas de candidatos
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas dos candidatos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 pendentes:
 *                   type: integer
 *                 aprovados:
 *                   type: integer
 *                 reprovados:
 *                   type: integer
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/statistics',
  isAuthenticated,
  CandidateController.getStatistics
);

/**
 * @swagger
 * /api/candidates:
 *   get:
 *     summary: Listar candidatos com filtros
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *       - in: query
 *         name: cpf
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDENTE, APROVADO, REPROVADO]
 *     responses:
 *       200:
 *         description: Lista de candidatos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Candidate'
 *       401:
 *         description: Não autenticado
 *   post:
 *     summary: Criar candidato (admin)
 *     tags: [Candidates]
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
 *               - cpf
 *               - email
 *               - curso_id
 *               - turno
 *             properties:
 *               nome:
 *                 type: string
 *               cpf:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               curso_id:
 *                 type: integer
 *               turno:
 *                 type: string
 *                 enum: [MATUTINO, VESPERTINO, NOTURNO]
 *     responses:
 *       201:
 *         description: Candidato criado com sucesso
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/',
  isAuthenticated,
  CandidateController.list
);

router.post(
  '/',
  isAuthenticated,
  auditMiddleware({
    entidade: 'candidato',
    getEntityId: (req) => req.body.id,
  }),
  validateRequest(createCandidateSchema),
  CandidateController.create
);

/**
 * @swagger
 * /api/candidates/{id}:
 *   get:
 *     summary: Buscar candidato por ID
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do candidato
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidate'
 *       404:
 *         description: Candidato não encontrado
 *       401:
 *         description: Não autenticado
 *   put:
 *     summary: Atualizar candidato
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *               telefone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Candidato atualizado
 *       404:
 *         description: Candidato não encontrado
 *       401:
 *         description: Não autenticado
 *   delete:
 *     summary: Deletar candidato
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Candidato deletado
 *       404:
 *         description: Candidato não encontrado
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/:id',
  isAuthenticated,
  CandidateController.findById
);

router.put(
  '/:id',
  isAuthenticated,
  auditMiddleware({
    entidade: 'candidato',
    getEntityId: (req) => Number(req.params.id),
    getOldData: async (req) => {
      const candidate = await Candidate.findByPk(req.params.id);
      return candidate?.toJSON();
    }
  }),
  validateRequest(updateCandidateSchema),
  CandidateController.update
);

router.delete(
  '/:id',
  isAuthenticated,
  auditMiddleware({
    entidade: 'candidato',
    getEntityId: (req) => Number(req.params.id),
    getOldData: async (req) => {
      const candidate = await Candidate.findByPk(req.params.id);
      return candidate?.toJSON();
    }
  }),
  CandidateController.delete
);

/**
 * @swagger
 * /api/candidates/{id}/approve:
 *   post:
 *     summary: Aprovar candidato (converte em aluno)
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Candidato aprovado e convertido em aluno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *       404:
 *         description: Candidato não encontrado
 *       400:
 *         description: Candidato já aprovado
 *       401:
 *         description: Não autenticado
 */
router.post(
  '/:id/approve',
  isAuthenticated,
  async (req, res, next) => {
    try {
      const candidate = await Candidate.findByPk(req.params.id);
      if (candidate && res.statusCode === 200) {
        const auditLogService = (await import('../../modules/audit/audit-log.service.js')).default;
        await auditLogService.createLog({
          usuario_id: req.user?.id ? Number(req.user.id) : undefined,
          acao: 'APPROVE',
          entidade: 'candidato',
          entidade_id: Number(req.params.id),
          dados_anteriores: candidate.toJSON(),
          ip: auditLogService.getIpFromRequest(req),
          user_agent: auditLogService.getUserAgentFromRequest(req),
          descricao: 'Candidato aprovado e convertido em aluno'
        });
      }
    } catch (err) {
      console.error('[AUDIT] Erro ao registrar aprovação:', err);
    }
    next();
  },
  CandidateController.approve
);

/**
 * @swagger
 * /api/candidates/{id}/reject:
 *   post:
 *     summary: Rejeitar candidato
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - motivo
 *             properties:
 *               motivo:
 *                 type: string
 *                 minLength: 10
 *                 example: Documentação incompleta
 *     responses:
 *       200:
 *         description: Candidato rejeitado
 *       404:
 *         description: Candidato não encontrado
 *       400:
 *         description: Candidato já foi processado
 *       401:
 *         description: Não autenticado
 */
router.post(
  '/:id/reject',
  isAuthenticated,
  async (req, res, next) => {
    try {
      const candidate = await Candidate.findByPk(req.params.id);
      if (candidate && res.statusCode === 200) {
        const auditLogService = (await import('../../modules/audit/audit-log.service.js')).default;
        await auditLogService.createLog({
          usuario_id: req.user?.id ? Number(req.user.id) : undefined,
          acao: 'REJECT',
          entidade: 'candidato',
          entidade_id: Number(req.params.id),
          dados_anteriores: candidate.toJSON(),
          dados_novos: { motivo_rejeicao: req.body.motivo },
          ip: auditLogService.getIpFromRequest(req),
          user_agent: auditLogService.getUserAgentFromRequest(req),
          descricao: `Candidato rejeitado: ${req.body.motivo}`
        });
      }
    } catch (err) {
      console.error('[AUDIT] Erro ao registrar rejeição:', err);
    }
    next();
  },
  validateRequest(rejectCandidateSchema),
  CandidateController.reject
);

export default router;
