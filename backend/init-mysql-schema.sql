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
VALUES ('Admin Teste', 'teste@example.com', '$2b$10$3TNbU8TS0pN3XsJU7O9elu8KwSBB5pVqN4dFZKNtCdqVKYlvEXnzK', 'ADMIN', NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Inserir cursos de exemplo
INSERT IGNORE INTO cursos (id, nome, descricao, carga_horaria, createdAt, updatedAt) 
VALUES 
  (1, 'Desenvolvimento Web', 'Curso completo de desenvolvimento web com React e Node.js', 120, NOW(), NOW()),
  (2, 'Banco de Dados', 'Fundamentos de banco de dados SQL e NoSQL', 80, NOW(), NOW()),
  (3, 'Python Avançado', 'Programação em Python com frameworks', 100, NOW(), NOW()),
  (4, 'Mobile iOS', 'Desenvolvimento de aplicativos para iOS', 90, NOW(), NOW()),
  (5, 'DevOps e Cloud', 'Containerização, CI/CD e Cloud Computing', 110, NOW(), NOW());

-- Inserir turmas
INSERT IGNORE INTO turmas (id, nome, descricao, data_inicio, data_fim, turno, id_curso, vagas, status, createdAt, updatedAt)
VALUES
  (1, 'Web - Turma A', 'Turma A de desenvolvimento web', '2025-01-15', '2025-06-15', 'MANHA', 1, 30, 'ATIVA', NOW(), NOW()),
  (2, 'BD - Turma B', 'Turma B de banco de dados', '2025-02-01', '2025-05-01', 'TARDE', 2, 25, 'ATIVA', NOW(), NOW()),
  (3, 'Python - Turma C', 'Turma C de Python', '2025-01-20', '2025-07-20', 'NOITE', 3, 20, 'ATIVA', NOW(), NOW());

-- Inserir instrutores
INSERT IGNORE INTO instrutores (id, nome, email, cpf, especialidade, telefone, createdAt, updatedAt)
VALUES
  (1, 'Carlos Silva', 'carlos@example.com', '12345678901', 'Web Development', '11999999999', NOW(), NOW()),
  (2, 'Maria Santos', 'maria@example.com', '98765432101', 'Banco de Dados', '11988888888', NOW(), NOW());

-- Inserir relacionamento instrutor-turma
INSERT IGNORE INTO instrutor_turma (id_instrutor, id_turma, createdAt, updatedAt)
SELECT i.id, t.id, NOW(), NOW()
FROM instrutores i
CROSS JOIN turmas t
WHERE i.email = 'carlos@example.com' AND t.nome = 'Web - Turma A'
ON DUPLICATE KEY UPDATE updatedAt = NOW();

INSERT IGNORE INTO instrutor_turma (id_instrutor, id_turma, createdAt, updatedAt)
SELECT i.id, t.id, NOW(), NOW()
FROM instrutores i
CROSS JOIN turmas t
WHERE i.email = 'maria@example.com' AND t.nome = 'BD - Turma B'
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Inserir candidatos
INSERT IGNORE INTO candidatos (nome, cpf, email, telefone, data_nascimento, status, id_turma_desejada, createdAt, updatedAt)
SELECT 'João Candidato', '11122233344', 'joao.candidato@example.com', '11987654321', '1995-05-15', 'PENDENTE', t.id, NOW(), NOW()
FROM turmas t WHERE t.nome = 'Web - Turma A'
LIMIT 1;

INSERT IGNORE INTO candidatos (nome, cpf, email, telefone, data_nascimento, status, id_turma_desejada, createdAt, updatedAt)
SELECT 'Ana Candidata', '55566677788', 'ana.candidata@example.com', '11987654322', '1996-08-20', 'PENDENTE', t.id, NOW(), NOW()
FROM turmas t WHERE t.nome = 'Python - Turma C'
LIMIT 1;

-- Inserir alunos (usando INSERT IGNORE para evitar duplicatas baseadas em CPF ou email únicos)
INSERT IGNORE INTO alunos (id, matricula, cpf, nome, email, telefone, data_nascimento, endereco, status, createdAt, updatedAt)
VALUES
  (1, 'MAT001', '11111111111', 'Pedro Silva', 'pedro@example.com', '11987654323', '1998-03-10', 'Rua A, 123', 'ativo', NOW(), NOW()),
  (2, 'MAT002', '22222222222', 'Julia Costa', 'julia@example.com', '11987654324', '1997-07-22', 'Rua B, 456', 'ativo', NOW(), NOW()),
  (3, 'MAT003', '33333333333', 'Lucas Oliveira', 'lucas@example.com', '11987654325', '1999-11-05', 'Rua C, 789', 'ativo', NOW(), NOW()),
  (4, 'MAT004', '44444444444', 'Fernanda Lima', 'fernanda@example.com', '11987654326', '1996-01-18', 'Rua D, 101', 'ativo', NOW(), NOW()),
  (5, 'MAT005', '66666666666', 'Roberto Alves', 'roberto@example.com', '11987654327', '1994-09-30', 'Rua E, 202', 'ativo', NOW(), NOW());
