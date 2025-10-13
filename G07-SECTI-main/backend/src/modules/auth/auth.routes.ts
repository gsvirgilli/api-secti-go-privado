import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import rateLimit from 'express-rate-limit';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { loginSchema, registerSchema } from './auth.validator.js';

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

authRouter.post('/register', validateRequest(registerSchema), authController.register);
authRouter.post('/login', loginLimiter, validateRequest(loginSchema), authController.login);

export default authRouter;