import { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();

// Health já existe em app.ts, mas mantemos um ping adicional aqui se quiser agrupar todas as rotas sob /api
router.get('/ping', (_req, res) => {
  return res.json({ status: 'ok' });
});

// Exemplo de rota protegida
router.get('/me', isAuthenticated, (req, res) => {
  return res.json({ user: req.user });
});

export default router;

