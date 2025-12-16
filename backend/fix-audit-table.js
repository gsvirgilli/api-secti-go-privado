import { sequelize } from './src/config/database.js';

async function fixAuditTable() {
  try {
    // Verificar colunas existentes
    const columns = await sequelize.getQueryInterface().describeTable('audit_logs');
    
    console.log('Colunas atuais em audit_logs:');
    Object.keys(columns).forEach(col => {
      console.log(`  - ${col}`);
    });
    
    // Se user_agent não existe, adicionar
    if (!columns.user_agent) {
      console.log('\n✅ Adicionando coluna user_agent...');
      await sequelize.getQueryInterface().addColumn(
        'audit_logs',
        'user_agent',
        {
          type: sequelize.Sequelize.STRING(500),
          allowNull: true,
          after: 'ip',
          comment: 'User Agent do navegador'
        }
      );
      console.log('✅ Coluna user_agent adicionada com sucesso!');
    } else {
      console.log('✅ Coluna user_agent já existe.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao corrigir tabela:', error.message);
    process.exit(1);
  }
}

fixAuditTable();
