-- Script para criar tabelas no MySQL compatível com os modelos Sequelize

USE sukatechdb;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'INSTRUTOR',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Tabela de Cursos
CREATE TABLE IF NOT EXISTS cursos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  carga_horaria INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Tabela de Turmas
CREATE TABLE IF NOT EXISTS turmas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  data_inicio DATE,
  data_fim DATE,
  turno VARCHAR(20),
  id_curso INT,
  vagas INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'ATIVO',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (id_curso) REFERENCES cursos(id) ON DELETE SET NULL
);

-- Tabela de Instrutores
CREATE TABLE IF NOT EXISTS instrutores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  cpf VARCHAR(11) UNIQUE,
  especialidade VARCHAR(100),
  telefone VARCHAR(20),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Tabela de Associação Instrutor-Turma
CREATE TABLE IF NOT EXISTS instrutor_turma (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_instrutor INT NOT NULL,
  id_turma INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY unique_instrutor_turma (id_instrutor, id_turma),
  FOREIGN KEY (id_instrutor) REFERENCES instrutores(id) ON DELETE CASCADE,
  FOREIGN KEY (id_turma) REFERENCES turmas(id) ON DELETE CASCADE
);

-- Tabela de Candidatos
CREATE TABLE IF NOT EXISTS candidatos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(11) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  data_nascimento DATE,
  turma_id INT,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDENTE',
  id_turma_desejada INT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL,
  FOREIGN KEY (id_turma_desejada) REFERENCES turmas(id) ON DELETE SET NULL
);

-- Tabela de Alunos
CREATE TABLE IF NOT EXISTS alunos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  matricula VARCHAR(50) NOT NULL UNIQUE,
  cpf VARCHAR(11) NOT NULL UNIQUE,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  data_nascimento DATE,
  endereco VARCHAR(255),
  candidato_id INT,
  usuario_id INT,
  turma_id INT,
  status ENUM('ativo', 'trancado', 'concluido', 'desistente') NOT NULL DEFAULT 'ativo',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (candidato_id) REFERENCES candidatos(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL
);

-- Inserir usuário de teste
INSERT INTO usuarios (nome, email, senha_hash, role, createdAt, updatedAt) 
VALUES ('Admin Teste', 'admin@sukatech.com', '$2b$10$YourHashHere', 'ADMIN', NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Inserir alguns cursos de exemplo
INSERT INTO cursos (nome, descricao, carga_horaria, createdAt, updatedAt) 
VALUES 
  ('Desenvolvimento Web', 'Curso completo de desenvolvimento web', 120, NOW(), NOW()),
  ('Banco de Dados', 'Fundamentos de banco de dados', 80, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();
