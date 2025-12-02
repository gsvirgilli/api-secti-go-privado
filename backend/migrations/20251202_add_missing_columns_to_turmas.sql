-- Migração: Adicionar colunas faltantes na tabela turmas
-- Data: 2025-12-02

SET @db = DATABASE();

-- Adicionar coluna vagas
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='turmas' AND COLUMN_NAME='vagas' AND TABLE_SCHEMA=@db);
SET @sql = IF(@column_exists = 0, 'ALTER TABLE turmas ADD COLUMN vagas INT DEFAULT 30', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar coluna status
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='turmas' AND COLUMN_NAME='status' AND TABLE_SCHEMA=@db);
SET @sql = IF(@column_exists = 0, 'ALTER TABLE turmas ADD COLUMN status VARCHAR(50) DEFAULT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
