const mysql = require('mysql2/promise');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'sukatechdb',
    port: process.env.DATABASE_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0
  });

  try {
    console.log('🔄 Conectando ao banco de dados...');
    
    const sql = `
      -- Tabela PRESENCA
      ALTER TABLE presenca ADD COLUMN IF NOT EXISTS motivo_justificacao TEXT COMMENT 'Motivo da justificação';
      ALTER TABLE presenca ADD COLUMN IF NOT EXISTS id_usuario INT COMMENT 'ID do usuário que registrou a frequência';
      ALTER TABLE presenca ADD CONSTRAINT fk_presenca_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL;
      ALTER TABLE presenca ADD INDEX IF NOT EXISTS idx_presenca_usuario (id_usuario);

      -- Tabela ATTENDANCE
      ALTER TABLE attendance ADD COLUMN IF NOT EXISTS motivo_justificacao TEXT COMMENT 'Motivo da justificação';
      ALTER TABLE attendance ADD COLUMN IF NOT EXISTS id_usuario INT COMMENT 'ID do usuário que registrou a frequência';
      ALTER TABLE attendance ADD CONSTRAINT fk_attendance_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL;
      ALTER TABLE attendance ADD INDEX IF NOT EXISTS idx_attendance_usuario (id_usuario);

      -- Remover coluna observacoes
      ALTER TABLE presenca DROP COLUMN IF EXISTS observacoes;
      ALTER TABLE attendance DROP COLUMN IF EXISTS observacoes;
    `;

    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--'));

    console.log('✅ Conectado!\n');
    console.log('📝 Executando ' + commands.length + ' comandos...\n');

    for (const command of commands) {
      try {
        console.log('⏳ ' + command.substring(0, 60) + '...');
        await connection.query(command);
        console.log('✅ OK\n');
      } catch (error) {
        if (error.message?.includes('Duplicate') || error.message?.includes('already exists')) {
          console.log('⚠️  Já existe (ignorado)\n');
        } else {
          throw error;
        }
      }
    }

    console.log('🎉 Migração concluída com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();
