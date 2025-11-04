-- Migration: Adicionar campo status na tabela cursos
-- Data: 2025-11-04
-- Descrição: Adiciona coluna status para controlar o estado do curso (ativo, inativo, em_desenvolvimento)

ALTER TABLE cursos 
ADD COLUMN status ENUM('ATIVO', 'INATIVO', 'EM_DESENVOLVIMENTO') 
NOT NULL DEFAULT 'ATIVO' 
AFTER nivel;
