import { Router, Request, Response } from 'express';
import NotificationService from './notification.service.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import * as z from 'zod';

const router = Router();

/**
 * Schema de validação para teste de email
 */
const testEmailSchema = z.object({
  email: z.string().email('Email inválido')
});

/**
 * @swagger
 * /api/notifications/test:
 *   post:
 *     summary: Enviar email de teste
 *     description: Envia um email de teste para verificar se o sistema de notificações está funcionando
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email para enviar o teste
 *                 example: seu-email@example.com
 *     responses:
 *       200:
 *         description: Email de teste enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email de teste enviado com sucesso
 *       400:
 *         description: Email inválido
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro ao enviar email
 */
router.post('/test', isAuthenticated, async (req: Request, res: Response) => {
  try {
    // Validar dados
    const { email } = testEmailSchema.parse(req.body);

    // Enviar email de teste
    await NotificationService.sendTestEmail(email);

    return res.status(200).json({
      message: 'Email de teste enviado com sucesso',
      email
    });
  } catch (error: any) {
    console.error('Erro ao enviar email de teste:', error);
    
    // Erros de validação Zod
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.errors
      });
    }

    return res.status(500).json({
      error: 'Erro ao enviar email de teste',
      message: error.message
    });
  }
});

export default router;
