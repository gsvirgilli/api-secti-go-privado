import { Router } from 'express';
import { passwordResetController } from './password-reset.controller.js';
import { 
  forgotPasswordSchema, 
  validateTokenSchema, 
  resetPasswordSchema,
  validate 
} from './password-reset.validator.js';
import rateLimit from 'express-rate-limit';

const router = Router();

/**
 * Rate limiter para proteção contra ataques
 * Limita a 5 tentativas por IP a cada 15 minutos
 */
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 requisições
  message: 'Muitas tentativas. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperação de senha
 *     description: Envia um email com link para redefinir a senha
 *     tags: [Password Reset]
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
 *                 example: usuario@example.com
 *                 description: Email do usuário que esqueceu a senha
 *     responses:
 *       200:
 *         description: Email de recuperação enviado (resposta genérica por segurança)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Se o email existir em nosso sistema, você receberá instruções para redefinir sua senha.
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro de validação
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       429:
 *         description: Muitas tentativas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Muitas tentativas. Tente novamente em 15 minutos.
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  '/forgot-password',
  resetLimiter,
  validate(forgotPasswordSchema),
  passwordResetController.requestReset.bind(passwordResetController)
);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   get:
 *     summary: Validar token de recuperação
 *     description: Verifica se o token é válido e não está expirado
 *     tags: [Password Reset]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 64
 *         description: Token de recuperação de senha (64 caracteres hex)
 *         example: a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token expirado. Solicite uma nova recuperação de senha.
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  '/reset-password/:token',
  validate(validateTokenSchema),
  passwordResetController.validateToken.bind(passwordResetController)
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Redefinir senha
 *     description: Redefine a senha do usuário usando um token válido
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 minLength: 64
 *                 example: a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890
 *                 description: Token de recuperação de senha
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 pattern: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$
 *                 example: SenhaForte123
 *                 description: Nova senha (mínimo 6 caracteres, deve conter maiúscula, minúscula e número)
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Senha redefinida com sucesso!
 *       400:
 *         description: Token inválido/expirado ou erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token inválido ou já utilizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  '/reset-password',
  resetLimiter,
  validate(resetPasswordSchema),
  passwordResetController.resetPassword.bind(passwordResetController)
);

export default router;
