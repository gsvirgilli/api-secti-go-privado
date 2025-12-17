-- Adicionar coluna avatar_url à tabela usuarios
ALTER TABLE usuarios ADD COLUMN avatar_url VARCHAR(255) NULL DEFAULT NULL;
