import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import router from './routes/index.js';
import migrationRouter from './routes/migration.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Configurar Express para confiar em proxy reverso (Render, Vercel, etc)
app.set('trust proxy', 1);

// 🛡️ Adicionar headers de segurança HTTP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    }
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  hsts: { maxAge: 31536000, includeSubDomains: true }
}));

// 📦 Comprimir respostas gzip
app.use(compression());

// 🔒 Rate limiting global (100 requisições por 15 minutos por IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas requisições. Tente novamente mais tarde.' },
  skip: (req) => req.path === '/api/health' // Não limitar health checks
});
app.use('/api/', globalLimiter);

// CORS configurado com segurança - aceitar múltiplas origens
const allowedOrigins = [
  'http://localhost:5173',        // Dev local
  'http://localhost:3000',        // Dev alternativo
  process.env.FRONTEND_URL,       // Variável de ambiente
  'https://api-secti-go-privado.vercel.app',  // Vercel (produção)
].filter(origin => origin && origin !== 'undefined'); // Remover undefined

app.use(cors({
  origin: (origin, callback) => {
    // Se não houver origin (requisições não-browser como curl), permitir
    if (!origin) {
      callback(null, true);
    }
    // Permitir se estiver na whitelist
    else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    }
    // Permitir qualquer URL do Vercel Preview (*.vercel.app)
    else if (origin.endsWith('.vercel.app')) {
      callback(null, true);
    }
    // Rejeitar outras origens
    else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 horas
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SUKATECH API Docs',
  customfavIcon: '/favicon.ico'
}));

// Endpoint para obter o JSON do Swagger
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/', (req, res) => {
  return res.json({ status: 'ok', message: 'SUKA TECH API is running!' });
});

// ✅ Endpoint PÚBLICO de diagnóstico simples - sem autenticação
app.get('/api/test/students-count', async (req, res) => {
  try {
    const { sequelize } = await import('./config/database.js');
    
    const [result] = await sequelize.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN turma_id IS NOT NULL THEN 1 ELSE 0 END) as com_turma,
        SUM(CASE WHEN turma_id IS NULL THEN 1 ELSE 0 END) as sem_turma
      FROM alunos
    `) as any;
    
    return res.json({
      total: result[0].total,
      com_turma: result[0].com_turma,
      sem_turma: result[0].sem_turma
    });
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  }
});

// ✅ Endpoint PÚBLICO de diagnóstico - sem autenticação
app.get('/api/diagnose/students', async (req, res) => {
  try {
    const { sequelize } = await import('./config/database.js');
    
    const [totalStudents] = await sequelize.query(`
      SELECT COUNT(*) as total FROM alunos
    `) as any;
    
    const [withClass] = await sequelize.query(`
      SELECT COUNT(*) as total FROM alunos WHERE turma_id IS NOT NULL
    `) as any;
    
    const [withoutClass] = await sequelize.query(`
      SELECT COUNT(*) as total FROM alunos WHERE turma_id IS NULL
    `) as any;
    
    const [students] = await sequelize.query(`
      SELECT a.id, a.nome, a.matricula, a.turma_id, t.nome as turma_nome
      FROM alunos a
      LEFT JOIN turmas t ON a.turma_id = t.id
      ORDER BY a.id
    `) as any;
    
    return res.json({
      totalStudents: totalStudents[0].total,
      withClass: withClass[0].total,
      withoutClass: withoutClass[0].total,
      students
    });
  } catch (error) {
    console.error('Erro no diagnóstico:', error);
    return res.status(500).json({ error: String(error) });
  }
});

// Endpoint de diagnóstico de matrículas
app.get('/api/diagnose/enrollments', async (req, res) => {
  try {
    const { sequelize } = await import('./config/database.js');
    
    const [students] = await sequelize.query(`
      SELECT COUNT(*) as total FROM alunos
    `) as any;
    
    const [studentsWithTurmaId] = await sequelize.query(`
      SELECT COUNT(*) as total FROM alunos WHERE turma_id IS NOT NULL
    `) as any;
    
    const [classes] = await sequelize.query(`
      SELECT COUNT(*) as total FROM turmas
    `) as any;
    
    const [enrollments] = await sequelize.query(`
      SELECT COUNT(*) as total FROM matriculas
    `) as any;
    
    const [enrollmentDetails] = await sequelize.query(`
      SELECT m.id_aluno, a.nome as aluno, m.id_turma, t.nome as turma, m.status 
      FROM matriculas m 
      LEFT JOIN alunos a ON m.id_aluno = a.id
      LEFT JOIN turmas t ON m.id_turma = t.id
      LIMIT 10
    `) as any;
    
    return res.json({
      students: students[0].total,
      studentsWithTurmaId: studentsWithTurmaId[0].total,
      classes: classes[0].total,
      enrollments: enrollments[0].total,
      enrollmentDetails
    });
  } catch (error) {
    console.error('Erro no diagnóstico:', error);
    return res.status(500).json({ error: String(error) });
  }
});

app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok', message: 'SUKA TECH API is running!' });
});

// Rotas da API
app.use('/api', router);
app.use('/api/admin', migrationRouter);

// Handler para rotas não encontradas (404)
app.use((req, res) => {
  console.error(`[404] Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler central
app.use(errorHandler);

export { app };
