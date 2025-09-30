import { Router } from 'express';
import authRouter from '../modules/auth/auth.routes.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();

router.use('/auth', authRouter);
// No futuro, adicionaremos outras rotas aqui:
// router.use('/cursos', cursoRouter);

// Health já existe em app.ts, mas mantemos um ping adicional aqui se quiser agrupar todas as rotas sob /api
router.get('/ping', (_req, res) => {
  return res.json({ status: 'ok' });
});

// Exemplo de rota protegida
router.get('/me', isAuthenticated, (req, res) => {
  return res.json({ user: req.user });
});

export default router;

