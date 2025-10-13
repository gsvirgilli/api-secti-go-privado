import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { UserController } from './user.controller.js';

const usersRouter = Router();
const controller = new UserController();

usersRouter.get('/me', isAuthenticated, (req, res) => controller.me(req, res));

export default usersRouter;
