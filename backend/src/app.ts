import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok', message: 'SUKA TECH API is running!' });
});

// Rotas da API
app.use('/api', router);

// Error handler central
app.use(errorHandler);

export { app };
