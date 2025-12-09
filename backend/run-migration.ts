import { sequelize } from './src/config/database.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conexão estabelecida com sucesso!');

    // Ler o arquivo de migração
    const migrationFile = path.join(__dirname, 'migrations', '20251208_add_attendance_fields.sql');
    const sql = fs.readFileSync(migrationFile, 'utf-8');

    console.log('\n📝 Executando migração...\n');
    
    // Dividir por pontos e vírgulas e executar cada comando
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--'));

    for (const command of commands) {
      try {
        console.log(`⏳ Executando: ${command.substring(0, 60)}...`);
        await sequelize.query(command);
        console.log(`✅ OK\n`);
      } catch (error: any) {
        // Ignorar erros de constraint já existente
        if (error.message?.includes('Duplicate key') || error.message?.includes('already exists')) {
          console.log(`⚠️  Já existe (ignorado)\n`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n🎉 Migração concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro ao executar migração:', error);
    process.exit(1);
  }
}

runMigration();
