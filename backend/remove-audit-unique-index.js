import { sequelize } from './src/config/database.js';

async function removeUniqueIndex() {
  try {
    console.log('Removendo índice único idx_audit_unique...');
    
    // Tentar remover o índice
    await sequelize.query(`ALTER TABLE audit_logs DROP INDEX idx_audit_unique;`);
    
    console.log('✅ Índice removido com sucesso!');
    process.exit(0);
  } catch (error) {
    if (error.message.includes('no such index')) {
      console.log('✅ Índice não encontrado (já foi removido ou nunca existiu)');
      process.exit(0);
    }
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

removeUniqueIndex();
