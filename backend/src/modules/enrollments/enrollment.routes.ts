import { Router } from 'express';
import EnrollmentController from './enrollment.controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { auditMiddleware } from '../../middlewares/audit.middleware.js';
import Enrollment from './enrollment.model.js';

const router = Router();

/**
 * @swagger
 * /api/enrollments:
 *   get:
 *     summary: Listar todas as matrículas
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de matrículas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 *       401:
 *         description: Não autenticado
 *   post:
 *     summary: Criar nova matrícula (decrementa vagas automaticamente)
 *     tags: [Enrollments]
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
 *             properties:
 *               id_aluno:
 *                 type: integer
 *                 example: 1
 *               id_turma:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Matrícula criada com sucesso (vagas decrementadas)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: Turma sem vagas ou matrícula já existe
 *       404:
 *         description: Aluno ou turma não encontrados
 *       401:
 *         description: Não autenticado
 */
router.get('/', isAuthenticated, EnrollmentController.index);
router.post('/', isAuthenticated, auditMiddleware({
  entidade: 'matricula',
  getEntityId: (req) => undefined, // Matrícula é composta
}), EnrollmentController.store);

/**
 * @swagger
 * /api/enrollments/{id_aluno}/{id_turma}:
 *   get:
 *     summary: Buscar matrícula específica
 *     tags: [Enrollments]
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
 *         description: Dados da matrícula
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       404:
 *         description: Matrícula não encontrada
 *       401:
 *         description: Não autenticado
 *   delete:
 *     summary: Deletar matrícula (incrementa vagas automaticamente)
 *     tags: [Enrollments]
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
 *         description: Matrícula deletada com sucesso (vagas incrementadas se estava ativa)
 *       404:
 *         description: Matrícula não encontrada
 *       401:
 *         description: Não autenticado
 */
router.get('/:id_aluno/:id_turma', isAuthenticated, EnrollmentController.show);
router.delete('/:id_aluno/:id_turma', isAuthenticated, auditMiddleware({
  entidade: 'matricula',
  getEntityId: (req) => undefined, // Matrícula é composta
  getOldData: async (req) => {
    const enrollment = await Enrollment.findOne({
      where: {
        id_aluno: req.params.id_aluno,
        id_turma: req.params.id_turma
      }
    });
    return enrollment?.toJSON();
  }
}), EnrollmentController.destroy);

/**
 * @swagger
 * /api/enrollments/{id_aluno}/{id_turma}/cancel:
 *   patch:
 *     summary: Cancelar matrícula (incrementa vagas automaticamente)
 *     tags: [Enrollments]
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
 *         description: Matrícula cancelada com sucesso (vagas incrementadas)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Enrollment'
 *       404:
 *         description: Matrícula não encontrada
 *       400:
 *         description: Matrícula já cancelada
 *       401:
 *         description: Não autenticado
 */
router.patch('/:id_aluno/:id_turma/cancel', isAuthenticated, auditMiddleware({
  entidade: 'matricula',
  getEntityId: (req) => undefined, // Matrícula é composta
  getOldData: async (req) => {
    const enrollment = await Enrollment.findOne({
      where: {
        id_aluno: req.params.id_aluno,
        id_turma: req.params.id_turma
      }
    });
    return enrollment?.toJSON();
  }
}), EnrollmentController.cancel);

export default router;
