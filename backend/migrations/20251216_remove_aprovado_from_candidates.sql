-- Migration: Remover status APROVADO do enum de candidatos
-- Data: 2025-12-16
-- Descrição: Remove APROVADO do enum, deixando apenas PENDENTE, REPROVADO, LISTA_ESPERA

ALTER TABLE candidatos
MODIFY COLUMN status ENUM('PENDENTE', 'REPROVADO', 'LISTA_ESPERA') NOT NULL DEFAULT 'PENDENTE';
