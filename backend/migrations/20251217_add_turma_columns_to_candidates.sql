-- Migration: Adicionar colunas turma_id e id_turma_desejada à tabela candidatos
-- Data: 2025-12-17

ALTER TABLE candidatos 
ADD COLUMN id_turma_desejada INT NULL AFTER status;

ALTER TABLE candidatos 
ADD COLUMN turma_id INT NULL AFTER id_turma_desejada;

-- Adicionar foreign keys
ALTER TABLE candidatos 
ADD FOREIGN KEY (id_turma_desejada) REFERENCES turmas(id) ON DELETE SET NULL;

ALTER TABLE candidatos 
ADD FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL;
