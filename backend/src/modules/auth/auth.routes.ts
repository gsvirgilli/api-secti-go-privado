import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import rateLimit from 'express-rate-limit';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { loginSchema, registerSchema } from './auth.validator.js';
import { auditLogin } from '../../middlewares/audit.middleware.js';

const authRouter = Router();
const authController = new AuthController();

// Limita tentativas de login para mitigar brute force
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 10, // 10 tentativas por IP por janela
	standardHeaders: true,
	legacyHeaders: false,
	message: { message: 'Muitas tentativas de login. Tente novamente mais tarde.' },
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *               - role
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@exemplo.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: senha123
 *               role:
 *                 type: string
 *                 enum: [ADMIN, INSTRUTOR, COORDENADOR]
 *                 example: ADMIN
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já cadastrado
 */
authRouter.post('/register', validateRequest(registerSchema), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@exemplo.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT Token para autenticação
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Credenciais inválidas
 *       429:
 *         description: Muitas tentativas de login
 */
authRouter.post('/login', loginLimiter, validateRequest(loginSchema), auditLogin, authController.login);

export default authRouter;