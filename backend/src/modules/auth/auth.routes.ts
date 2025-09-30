import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { loginSchema, registerSchema } from './auth.validator.js';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/register', validateRequest(registerSchema), authController.register);
authRouter.post('/login', validateRequest(loginSchema), authController.login);

export default authRouter;