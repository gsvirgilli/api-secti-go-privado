-- Adicionar coluna telefone à tabela instrutores
ALTER TABLE instrutores ADD COLUMN telefone VARCHAR(20) NULL DEFAULT NULL;

-- Se precisar fazer rollback:
-- ALTER TABLE instrutores DROP COLUMN telefone;
