const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sukatechdb', 'sukatech_user', 'sukatech_password', {
  host: 'sukatech_mysql',
  dialect: 'mysql',
  logging: false
});

async function runMigration() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão estabelecida');
    
    // Verificar se as colunas já existem
    const [columns] = await sequelize.query('SHOW COLUMNS FROM instrutores');
    const existingColumns = columns.map(c => c.Field);
    console.log('Colunas existentes:', existingColumns.join(', '));
    
    // Adicionar telefone
    if (!existingColumns.includes('telefone')) {
      await sequelize.query('ALTER TABLE instrutores ADD COLUMN telefone VARCHAR(20) NULL');
      console.log('✅ Coluna telefone adicionada');
    } else {
      console.log('⚠️  Coluna telefone já existe');
    }
    
    // Adicionar data_nascimento
    if (!existingColumns.includes('data_nascimento')) {
      await sequelize.query('ALTER TABLE instrutores ADD COLUMN data_nascimento DATE NULL');
      console.log('✅ Coluna data_nascimento adicionada');
    } else {
      console.log('⚠️  Coluna data_nascimento já existe');
    }
    
    // Adicionar endereco
    if (!existingColumns.includes('endereco')) {
      await sequelize.query('ALTER TABLE instrutores ADD COLUMN endereco VARCHAR(255) NULL');
      console.log('✅ Coluna endereco adicionada');
    } else {
      console.log('⚠️  Coluna endereco já existe');
    }
    
    // Adicionar experiencia
    if (!existingColumns.includes('experiencia')) {
      await sequelize.query('ALTER TABLE instrutores ADD COLUMN experiencia VARCHAR(255) NULL');
      console.log('✅ Coluna experiencia adicionada');
    } else {
      console.log('⚠️  Coluna experiencia já existe');
    }
    
    // Adicionar status
    if (!existingColumns.includes('status')) {
      await sequelize.query('ALTER TABLE instrutores ADD COLUMN status VARCHAR(50) DEFAULT "Ativo"');
      console.log('✅ Coluna status adicionada');
    } else {
      console.log('⚠️  Coluna status já existe');
    }
    
    console.log('\n🎉 Migration concluída com sucesso!');
    
    // Verificar novamente
    const [newColumns] = await sequelize.query('SHOW COLUMNS FROM instrutores');
    console.log('\nColunas atualizadas:', newColumns.map(c => c.Field).join(', '));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

runMigration();
