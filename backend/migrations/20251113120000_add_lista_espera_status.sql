-- Migration: Adicionar status 'lista_espera' para candidatos
-- Data: 2025-11-13

ALTER TABLE candidatos 
MODIFY COLUMN status ENUM('pendente', 'aprovado', 'reprovado', 'lista_espera') NOT NULL DEFAULT 'pendente';
