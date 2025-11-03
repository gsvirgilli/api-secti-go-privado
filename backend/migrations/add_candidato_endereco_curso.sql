-- Migration: Adicionar campos de endereço e preferências de curso ao candidato
-- Data: 2025-11-03
-- Descrição: Adiciona campos necessários para candidatura pública

USE sukatechdb;

-- Adicionar campos de endereço
ALTER TABLE candidatos 
ADD COLUMN cep VARCHAR(8) NULL AFTER data_nascimento,
ADD COLUMN rua VARCHAR(200) NULL AFTER cep,
ADD COLUMN numero VARCHAR(20) NULL AFTER rua,
ADD COLUMN complemento VARCHAR(100) NULL AFTER numero,
ADD COLUMN bairro VARCHAR(100) NULL AFTER complemento,
ADD COLUMN cidade VARCHAR(100) NULL AFTER bairro,
ADD COLUMN estado CHAR(2) NULL AFTER cidade;

-- Adicionar campos de preferência de curso e turno
ALTER TABLE candidatos
ADD COLUMN curso_id INT NULL AFTER estado,
ADD COLUMN turno ENUM('MATUTINO', 'VESPERTINO', 'NOTURNO') NULL AFTER curso_id;

-- Adicionar chave estrangeira para curso
ALTER TABLE candidatos
ADD CONSTRAINT fk_candidato_curso
FOREIGN KEY (curso_id) REFERENCES cursos(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Adicionar índice no curso_id para melhorar performance
CREATE INDEX idx_candidato_curso ON candidatos(curso_id);

-- Adicionar índice no turno para filtros
CREATE INDEX idx_candidato_turno ON candidatos(turno);

-- Verificar estrutura da tabela
DESC candidatos;
