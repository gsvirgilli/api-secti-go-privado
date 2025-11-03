-- Adicionar coluna vagas na tabela turmas
-- Este script adiciona o campo vagas necessário para o gerenciamento automático de vagas

-- Verificar se a coluna já existe, se não, adicionar
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.columns 
WHERE table_schema = 'sukatechdb' 
  AND table_name = 'turmas' 
  AND column_name = 'vagas';

SET @query = IF(@col_exists = 0, 
    'ALTER TABLE turmas ADD COLUMN vagas INT NOT NULL DEFAULT 30', 
    'SELECT "Coluna vagas já existe" AS message');

PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Atualizar turmas existentes que não têm vagas definidas
UPDATE turmas SET vagas = 30 WHERE vagas IS NULL OR vagas = 0;

-- Exibir estrutura atualizada
DESCRIBE turmas;
