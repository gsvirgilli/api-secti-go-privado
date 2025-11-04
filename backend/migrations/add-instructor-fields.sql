-- Adicionar campos faltantes na tabela instrutores
ALTER TABLE instrutores 
  ADD COLUMN IF NOT EXISTS telefone VARCHAR(20) NULL AFTER email,
  ADD COLUMN IF NOT EXISTS data_nascimento DATE NULL AFTER telefone,
  ADD COLUMN IF NOT EXISTS endereco VARCHAR(255) NULL AFTER data_nascimento,
  ADD COLUMN IF NOT EXISTS experiencia VARCHAR(255) NULL AFTER especialidade,
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) NULL AFTER experiencia;

-- Definir valor padrão para instrutores existentes
UPDATE instrutores SET status = 'Ativo' WHERE status IS NULL;
