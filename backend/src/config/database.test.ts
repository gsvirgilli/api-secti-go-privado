import { Sequelize } from 'sequelize';

// Configuração específica para testes usando SQLite em memória
export const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:', // Banco em memória para testes
  logging: false, // Desabilitar logs nos testes
  sync: { force: true } // Sempre recriar o banco nos testes
});

export const setupTestDatabase = async () => {
  try {
    await testSequelize.authenticate();
    console.log('✅ Banco de teste (SQLite) conectado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao conectar banco de teste:', error);
    throw error;
  }
};

export const teardownTestDatabase = async () => {
  try {
    await testSequelize.close();
    console.log('✅ Banco de teste fechado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao fechar banco de teste:', error);
  }
};