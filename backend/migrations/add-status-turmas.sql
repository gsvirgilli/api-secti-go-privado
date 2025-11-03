-- Adiciona coluna status na tabela turmas
ALTER TABLE turmas 
ADD COLUMN status ENUM('ATIVA', 'ENCERRADA', 'CANCELADA') 
NOT NULL DEFAULT 'ATIVA' 
AFTER vagas;

-- Adiciona índice para melhorar performance de filtros por status
CREATE INDEX idx_turmas_status ON turmas(status);

-- Atualiza turmas existentes para ATIVA
UPDATE turmas SET status = 'ATIVA' WHERE status IS NULL;
