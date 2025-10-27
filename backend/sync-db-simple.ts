import { sequelize } from './src/config/database.js';

// Importar app que já carrega todos os models
import './src/app.js';

async function syncDatabase() {
  try {
    console.log('🔄 Sincronizando banco de dados...');
    
    // Testa conexão
    await sequelize.authenticate();
    console.log('✅ Conexão com banco estabelecida');
    
    // Sincroniza modelos com banco (alter: true = atualiza sem dropar)
    await sequelize.sync({ alter: true });
    
    console.log('✅ Banco de dados sincronizado com sucesso!');
    console.log('📋 Tabelas criadas/atualizadas:');
    const models = Object.keys(sequelize.models);
    models.forEach(model => {
      console.log(`  - ${model}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco:', error);
    process.exit(1);
  }
}

syncDatabase();
