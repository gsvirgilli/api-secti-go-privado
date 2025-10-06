import express from 'express';
import cors from 'cors';
import router from '../../src/routes/index.js';
import { errorHandler } from '../../src/middlewares/errorHandler.js';
import { setupTestDatabase } from '../../src/config/database.test.config.js';

// Criar aplicação de teste
export async function createTestApp() {
  // Configurar banco de teste
  await setupTestDatabase();

  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Test server is running' });
  });

  // Rotas da API usando a mesma estrutura da aplicação principal
  app.use('/api', router);

  // Error handler
  app.use(errorHandler);

  return app;
}