import { sequelize } from './src/config/database.js';

async function addIndexes() {
  try {
    console.log('Iniciando adição de índices...');

    // Adicionar índice na coluna email da tabela usuarios
    await sequelize.query(`
      ALTER TABLE usuarios 
      ADD INDEX idx_usuarios_email (email);
    `).catch(err => {
      // Ignorar erro se o índice já existe
      if (err.message.includes('Duplicate key name')) {
        console.log('✓ Índice idx_usuarios_email já existe');
      } else {
        throw err;
      }
    });

    console.log('✅ Índice idx_usuarios_email criado com sucesso');

    // Verificar se o índice foi criado
    const [indexes] = await sequelize.query(`
      SHOW INDEX FROM usuarios WHERE Key_name = 'idx_usuarios_email';
    `);
    
    if (indexes.length > 0) {
      console.log('✅ Índice verificado e ativo:', indexes[0]);
    } else {
      console.warn('⚠️ Índice não encontrado após criação');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao adicionar índices:', error);
    process.exit(1);
  }
}

addIndexes();
