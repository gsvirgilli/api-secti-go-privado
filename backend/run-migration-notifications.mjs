import { sequelize } from './src/config/database.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

async function runMigration() {
  try {
    // Conectar ao banco
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados');

    // Ler e executar a migration
    const migrationPath = resolve('./migrations/20251216_create_notifications.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    // Executar cada statement
    const statements = sql.split(';').filter(s => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await sequelize.query(statement);
        console.log('✅ Executado:', statement.substring(0, 50) + '...');
      }
    }

    console.log('✅ Migration de notificações executada com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migration:', error.message);
    process.exit(1);
  }
}

runMigration();
