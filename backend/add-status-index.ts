import { sequelize } from './src/config/database.js';

async function addStatusIndex() {
  try {
    console.log('⏳ Adicionando índice na coluna status...');
    
    // Executar query diretamente
    await sequelize.query('ALTER TABLE `cursos` ADD INDEX `idx_status` (`status`)');
    
    console.log('✅ Índice adicionado com sucesso!');
    process.exit(0);
  } catch (error: any) {
    if (error.message?.includes('Duplicate key name')) {
      console.log('⚠️  Índice já existe');
      process.exit(0);
    }
    console.error('❌ Erro ao adicionar índice:', error.message);
    process.exit(1);
  }
}

addStatusIndex();
