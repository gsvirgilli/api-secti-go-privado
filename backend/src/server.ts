import { app } from './app.js';
import { env } from './config/environment.js';
import { testConnection } from './config/database.js'; // Importamos nossa função de teste

const port = env.APP_PORT;

app.listen(port, () => {
  testConnection(); // <-- A linha mágica! Chamamos a função aqui.
  console.log(`🚀 Servidor rodando na porta ${port}`);
});

// teste de conexão com o banco de dados
testConnection();