import express from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import router from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Configurar Express para confiar em proxy reverso (Render, Vercel, etc)
app.set('trust proxy', 1);

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

app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok', message: 'SUKA TECH API is running!' });
});

// Rotas da API
app.use('/api', router);

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
