#!/bin/bash

# Script para executar a migração SQL no Aiven via Render
# Este script conecta ao banco usando as variáveis de ambiente do Render

echo "🔄 Iniciando migração do banco de dados..."
echo ""

# Extrair credenciais do DATABASE_URL (padrão do Render)
# Formato: mysql://user:password@host:port/database

if [ -z "$DATABASE_URL" ]; then
  echo "❌ Variável DATABASE_URL não encontrada!"
  echo "Usando variáveis individuais..."
  
  HOST="${DATABASE_HOST:-localhost}"
  PORT="${DATABASE_PORT:-3306}"
  USER="${DATABASE_USER:-root}"
  PASS="${DATABASE_PASSWORD:-}"
  DB="${DATABASE_NAME:-sukatechdb}"
else
  # Parse DATABASE_URL
  echo "✅ DATABASE_URL encontrada, extraindo credenciais..."
  
  # Format: mysql://user:password@host:port/database
  HOST=$(echo $DATABASE_URL | sed -E 's|.*@([^:/]+).*|\1|')
  PORT=$(echo $DATABASE_URL | sed -E 's|.*:([0-9]+)/.*|\1|')
  USER=$(echo $DATABASE_URL | sed -E 's|mysql://([^:]+).*|\1|')
  PASS=$(echo $DATABASE_URL | sed -E 's|mysql://[^:]+:([^@]+).*|\1|')
  DB=$(echo $DATABASE_URL | sed -E 's|.*/([^/]+).*|\1|')
fi

echo "📡 Dados de conexão:"
echo "  Host: $HOST"
echo "  Port: $PORT"
echo "  User: $USER"
echo "  Database: $DB"
echo ""

# Executar migração via Node.js/tsx
npx tsx -e "
import { Sequelize } from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';

const sequelize = new Sequelize('$DB', '$USER', '$PASS', {
  host: '$HOST',
  port: $PORT,
  dialect: 'mysql',
  logging: console.log,
  dialectOptions: {
    timeout: 30000
  }
});

async function migrate() {
  try {
    console.log('🔐 Autenticando...');
    await sequelize.authenticate();
    console.log('✅ Conectado com sucesso!\\n');

    const sql = \`
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
    \`;

    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--'));

    console.log('📝 Executando ' + commands.length + ' comandos...\\n');

    for (const command of commands) {
      try {
        console.log('⏳ ' + command.substring(0, 60) + '...');
        await sequelize.query(command);
        console.log('✅ OK\\n');
      } catch (error) {
        if (error.message?.includes('Duplicate') || error.message?.includes('already exists')) {
          console.log('⚠️  Já existe (ignorado)\\n');
        } else {
          throw error;
        }
      }
    }

    console.log('🎉 Migração concluída com sucesso!');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\\n❌ Erro:', error.message);
    process.exit(1);
  }
}

migrate();
"
