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
    
    // Importar e sincronizar modelos de teste
    const CourseTest = await import('../modules/courses/course.test.model.js');
    const UserTest = await import('../modules/users/user.test.model.js');
    
    // Sincronizar todos os modelos
    await testSequelize.sync({ force: true });
    console.log('✅ Modelos de teste sincronizados com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco de teste:', error);
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