-- Migration: Adicionar campos extras na tabela instrutores
-- Data: 2025-11-04

ALTER TABLE instrutores 
ADD COLUMN telefone VARCHAR(20) NULL AFTER email;

ALTER TABLE instrutores 
ADD COLUMN data_nascimento DATE NULL AFTER telefone;

ALTER TABLE instrutores 
ADD COLUMN endereco VARCHAR(255) NULL AFTER data_nascimento;

ALTER TABLE instrutores 
ADD COLUMN experiencia VARCHAR(255) NULL AFTER especialidade;

ALTER TABLE instrutores 
ADD COLUMN status VARCHAR(50) DEFAULT 'Ativo' AFTER experiencia;
