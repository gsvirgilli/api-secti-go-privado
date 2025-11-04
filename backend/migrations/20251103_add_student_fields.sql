-- Migration: Adicionar campos telefone, data_nascimento e endereco à tabela alunos
-- Data: 2025-11-03
-- Descrição: Permite cadastro direto de alunos com informações completas

-- Verificar e adicionar coluna telefone
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = 'sukatechdb' AND TABLE_NAME = 'alunos' AND COLUMN_NAME = 'telefone');
SET @query = IF(@col_exists = 0, 
  'ALTER TABLE alunos ADD COLUMN telefone VARCHAR(20) NULL AFTER email', 
  'SELECT "Coluna telefone já existe" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar e adicionar coluna data_nascimento
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = 'sukatechdb' AND TABLE_NAME = 'alunos' AND COLUMN_NAME = 'data_nascimento');
SET @query = IF(@col_exists = 0, 
  'ALTER TABLE alunos ADD COLUMN data_nascimento DATE NULL AFTER telefone', 
  'SELECT "Coluna data_nascimento já existe" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar e adicionar coluna endereco
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = 'sukatechdb' AND TABLE_NAME = 'alunos' AND COLUMN_NAME = 'endereco');
SET @query = IF(@col_exists = 0, 
  'ALTER TABLE alunos ADD COLUMN endereco VARCHAR(200) NULL AFTER data_nascimento', 
  'SELECT "Coluna endereco já existe" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Permitir NULL em candidato_id e usuario_id para cadastro direto
ALTER TABLE alunos 
MODIFY COLUMN candidato_id INT NULL;

ALTER TABLE alunos 
MODIFY COLUMN usuario_id INT NULL;

-- Permitir NULL em turma_id para cadastro antes de matrícula
ALTER TABLE alunos 
MODIFY COLUMN turma_id INT NULL;

-- Adicionar índices para melhor performance
CREATE INDEX idx_alunos_telefone ON alunos(telefone);
CREATE INDEX idx_alunos_data_nascimento ON alunos(data_nascimento);

-- Log de sucesso
SELECT 'Migration 20251103_add_student_fields.sql aplicada com sucesso!' AS status;
