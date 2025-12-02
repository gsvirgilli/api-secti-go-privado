-- Adicionar campos faltantes na tabela instrutores
-- Usando PREPARE STATEMENT para adicionar colunas condicionalmente

SET @db = DATABASE();

SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='instrutores' AND COLUMN_NAME='telefone' AND TABLE_SCHEMA=@db);
SET @sql = IF(@column_exists = 0, 'ALTER TABLE instrutores ADD COLUMN telefone VARCHAR(20) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='instrutores' AND COLUMN_NAME='data_nascimento' AND TABLE_SCHEMA=@db);
SET @sql = IF(@column_exists = 0, 'ALTER TABLE instrutores ADD COLUMN data_nascimento DATE NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='instrutores' AND COLUMN_NAME='endereco' AND TABLE_SCHEMA=@db);
SET @sql = IF(@column_exists = 0, 'ALTER TABLE instrutores ADD COLUMN endereco VARCHAR(255) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='instrutores' AND COLUMN_NAME='experiencia' AND TABLE_SCHEMA=@db);
SET @sql = IF(@column_exists = 0, 'ALTER TABLE instrutores ADD COLUMN experiencia VARCHAR(255) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='instrutores' AND COLUMN_NAME='status' AND TABLE_SCHEMA=@db);
SET @sql = IF(@column_exists = 0, 'ALTER TABLE instrutores ADD COLUMN status VARCHAR(50) NULL DEFAULT \"Ativo\"', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Definir valor padrão para instrutores existentes
UPDATE instrutores SET status = 'Ativo' WHERE status IS NULL;
