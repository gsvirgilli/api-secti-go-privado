import { app } from './app.js';
import { env } from './config/environment.js';
import { testConnection } from './config/database.js'; // Importamos nossa função de teste
import { verifyEmailConnection } from './config/email.js';
import { setupAssociations } from './models/associations.js';

const port = env.APP_PORT;

app.listen(port, async () => {
  testConnection(); // <-- A linha mágica! Chamamos a função aqui.
  
  // Configurar associações entre modelos (após conexão)
  setupAssociations();
  
  console.log(`🚀 Servidor rodando na porta ${port}`);
  
  // Verificar conexão com servidor de email
  await verifyEmailConnection();
});

// teste de conexão com o banco de dados
testConnection();