import { Router } from 'express';
import authRouter from '../modules/auth/auth.routes.js';
import usersRouter from '../modules/users/user.routes.js';
import coursesRouter from '../modules/courses/course.routes.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import classRoutes from "./class.routes.ts";
import studentRoutes from "./student.routes.ts";
import instructorRoutes from "./instructor.routes.ts";



const router = Router();

// Rotas de autenticação (público)
router.use('/auth', authRouter);

// Rotas protegidas por autenticação
router.use('/users', usersRouter);
router.use('/courses', coursesRouter);
router.use('/classes', classRoutes);
router.use('/students', studentRoutes);
router.use('/instructors', instructorRoutes); 

// No futuro, adicionaremos outras rotas aqui:
// router.use('/turmas', turmasRouter);
// router.use('/alunos', alunosRouter);
// router.use('/instrutores', instrutoresRouter);

// Health já existe em app.ts, mas mantemos um ping adicional aqui se quiser agrupar todas as rotas sob /api
router.get('/ping', (_req, res) => {
  return res.json({ status: 'ok' });
});

// Exemplo de rota protegida
router.get('/me', isAuthenticated, (req, res) => {
  return res.json({ user: req.user });
});

export default router;

