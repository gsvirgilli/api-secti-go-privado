-- Migration: Adicionar status PLANEJADA ao ENUM da tabela turmas
-- Data: 2025-11-04

-- No MySQL, não é possível adicionar valores a um ENUM diretamente
-- Precisamos recriar a coluna com ALTER TABLE ... MODIFY

ALTER TABLE turmas 
MODIFY COLUMN status ENUM('ATIVA', 'PLANEJADA', 'ENCERRADA', 'CANCELADA') 
NOT NULL DEFAULT 'PLANEJADA';
