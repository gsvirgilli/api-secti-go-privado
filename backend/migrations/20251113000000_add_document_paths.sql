-- Migration: Adicionar campos para armazenar caminhos dos documentos
-- Data: 2025-11-13
-- Usando PREPARE STATEMENT para adicionar colunas condicionalmente

SET @db = DATABASE();

SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='candidatos' AND COLUMN_NAME='rg_frente_url' AND TABLE_SCHEMA=@db);
SET @sql = IF(@column_exists = 0, 'ALTER TABLE candidatos ADD COLUMN rg_frente_url VARCHAR(255) DEFAULT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='candidatos' AND COLUMN_NAME='rg_verso_url' AND TABLE_SCHEMA=@db);
SET @sql = IF(@column_exists = 0, 'ALTER TABLE candidatos ADD COLUMN rg_verso_url VARCHAR(255) DEFAULT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='candidatos' AND COLUMN_NAME='cpf_aluno_url' AND TABLE_SCHEMA=@db);
SET @sql = IF(@column_exists = 0, 'ALTER TABLE candidatos ADD COLUMN cpf_aluno_url VARCHAR(255) DEFAULT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='candidatos' AND COLUMN_NAME='comprovante_endereco_url' AND TABLE_SCHEMA=@db);
SET @sql = IF(@column_exists = 0, 'ALTER TABLE candidatos ADD COLUMN comprovante_endereco_url VARCHAR(255) DEFAULT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='candidatos' AND COLUMN_NAME='identidade_responsavel_frente_url' AND TABLE_SCHEMA=@db);
SET @sql = IF(@column_exists = 0, 'ALTER TABLE candidatos ADD COLUMN identidade_responsavel_frente_url VARCHAR(255) DEFAULT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='candidatos' AND COLUMN_NAME='identidade_responsavel_verso_url' AND TABLE_SCHEMA=@db);
SET @sql = IF(@column_exists = 0, 'ALTER TABLE candidatos ADD COLUMN identidade_responsavel_verso_url VARCHAR(255) DEFAULT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='candidatos' AND COLUMN_NAME='cpf_responsavel_url' AND TABLE_SCHEMA=@db);
SET @sql = IF(@column_exists = 0, 'ALTER TABLE candidatos ADD COLUMN cpf_responsavel_url VARCHAR(255) DEFAULT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='candidatos' AND COLUMN_NAME='comprovante_escolaridade_url' AND TABLE_SCHEMA=@db);
SET @sql = IF(@column_exists = 0, 'ALTER TABLE candidatos ADD COLUMN comprovante_escolaridade_url VARCHAR(255) DEFAULT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='candidatos' AND COLUMN_NAME='foto_3x4_url' AND TABLE_SCHEMA=@db);
SET @sql = IF(@column_exists = 0, 'ALTER TABLE candidatos ADD COLUMN foto_3x4_url VARCHAR(255) DEFAULT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

