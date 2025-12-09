import { Router } from 'express';
import { sequelize } from '../config/database.js';

const router = Router();

router.post('/run-migration', async (req, res) => {
  try {
    console.log('🔄 Iniciando migração...');

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

    console.log(`📝 Executando ${commands.length} comandos...`);

    const results = [];

    for (const command of commands) {
      try {
        console.log(`⏳ ${command.substring(0, 60)}...`);
        await sequelize.query(command);
        console.log('✅ OK');
        results.push({
          command: command.substring(0, 60),
          status: 'success'
        });
      } catch (error: any) {
        if (error.message?.includes('Duplicate') || error.message?.includes('already exists')) {
          console.log('⚠️  Já existe (ignorado)');
          results.push({
            command: command.substring(0, 60),
            status: 'skipped',
            reason: 'Already exists'
          });
        } else {
          throw error;
        }
      }
    }

    console.log('🎉 Migração concluída com sucesso!');
    
    return res.json({
      success: true,
      message: '🎉 Migração concluída com sucesso!',
      commandsExecuted: results.length,
      details: results
    });
  } catch (error: any) {
    console.error('❌ Erro ao executar migração:', error.message);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
});

export default router;
