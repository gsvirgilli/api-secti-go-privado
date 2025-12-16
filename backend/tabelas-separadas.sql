-- ============================================================================
-- EXECUTE CADA BLOCO SEPARADAMENTE (um de cada vez)
-- ============================================================================

-- BLOCO 1: Tabela USUÁRIOS
-- ============================================================================
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  senha_hash VARCHAR(255),
  role VARCHAR(50),
  ativo INT DEFAULT 1,
  createdAt DATETIME,
  updatedAt DATETIME
);

-- BLOCO 2: Tabela CURSOS
-- ============================================================================
CREATE TABLE cursos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255),
  descricao TEXT,
  carga_horaria INT,
  nivel VARCHAR(50),
  status VARCHAR(50),
  createdAt DATETIME,
  updatedAt DATETIME
);

-- BLOCO 3: Tabela TURMAS
-- ============================================================================
CREATE TABLE turmas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255),
  descricao TEXT,
  data_inicio DATE,
  data_fim DATE,
  turno VARCHAR(50),
  id_curso INT,
  vagas INT,
  status VARCHAR(50),
  createdAt DATETIME,
  updatedAt DATETIME
);

-- BLOCO 4: Tabela INSTRUTORES
-- ============================================================================
CREATE TABLE instrutores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255),
  email VARCHAR(255),
  cpf VARCHAR(11),
  especialidade VARCHAR(255),
  telefone VARCHAR(20),
  ativo INT DEFAULT 1,
  createdAt DATETIME,
  updatedAt DATETIME
);

-- BLOCO 5: Tabela INSTRUTOR_TURMA
-- ============================================================================
CREATE TABLE instrutor_turma (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_instrutor INT,
  id_turma INT,
  createdAt DATETIME,
  updatedAt DATETIME
);

-- BLOCO 6: Tabela CANDIDATOS
-- ============================================================================
CREATE TABLE candidatos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255),
  cpf VARCHAR(11) UNIQUE,
  email VARCHAR(255) UNIQUE,
  telefone VARCHAR(20),
  data_nascimento DATE,
  curso_id INT,
  turno VARCHAR(50),
  curso_id2 INT,
  turno2 VARCHAR(50),
  local_curso VARCHAR(100),
  status VARCHAR(50) DEFAULT 'PENDENTE',
  processo_seletivo_id INT,
  rg VARCHAR(20),
  sexo VARCHAR(50),
  deficiencia VARCHAR(50),
  telefone2 VARCHAR(20),
  idade INT,
  nome_mae VARCHAR(100),
  cidade_nascimento VARCHAR(100),
  cep VARCHAR(8),
  rua VARCHAR(200),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  raca_cor VARCHAR(50),
  renda_mensal VARCHAR(50),
  pessoas_renda INT,
  tipo_residencia VARCHAR(50),
  itens_casa VARCHAR(500),
  goianas_ciencia VARCHAR(10),
  menor_idade INT DEFAULT 0,
  nome_responsavel VARCHAR(100),
  cpf_responsavel VARCHAR(11),
  rg_frente_url VARCHAR(255),
  rg_verso_url VARCHAR(255),
  cpf_aluno_url VARCHAR(255),
  comprovante_endereco_url VARCHAR(255),
  identidade_responsavel_frente_url VARCHAR(255),
  identidade_responsavel_verso_url VARCHAR(255),
  cpf_responsavel_url VARCHAR(255),
  comprovante_escolaridade_url VARCHAR(255),
  foto_3x4_url VARCHAR(255),
  createdAt DATETIME,
  updatedAt DATETIME
);

-- BLOCO 7: Tabela ALUNOS
-- ============================================================================
CREATE TABLE alunos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  matricula VARCHAR(50) UNIQUE,
  cpf VARCHAR(11) UNIQUE,
  nome VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  telefone VARCHAR(20),
  data_nascimento DATE,
  endereco VARCHAR(255),
  candidato_id INT,
  usuario_id INT,
  turma_id INT,
  status VARCHAR(50),
  createdAt DATETIME,
  updatedAt DATETIME
);

-- BLOCO 8: Tabela MATRICULAS
-- ============================================================================
CREATE TABLE matriculas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT,
  turma_id INT,
  data_matricula DATE,
  status VARCHAR(50),
  createdAt DATETIME,
  updatedAt DATETIME
);

-- BLOCO 9: Tabela PRESENCAS
-- ============================================================================
CREATE TABLE presencas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT,
  turma_id INT,
  data_aula DATE,
  presente INT DEFAULT 1,
  observacoes VARCHAR(500),
  createdAt DATETIME,
  updatedAt DATETIME
);

-- BLOCO 10: Tabela AUDIT_LOGS
-- ============================================================================
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  tabela VARCHAR(255),
  operacao VARCHAR(50),
  registro_id INT,
  dados_anteriores JSON,
  dados_novos JSON,
  descricao VARCHAR(500),
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  createdAt DATETIME
);

-- BLOCO 11: Tabela PASSWORD_RESET_TOKENS
-- ============================================================================
CREATE TABLE password_reset_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  token VARCHAR(255) UNIQUE,
  expires_at DATETIME,
  usado INT DEFAULT 0,
  createdAt DATETIME,
  updatedAt DATETIME
);

-- BLOCO 12: INSERIR USUÁRIO ADMIN
-- ============================================================================
INSERT INTO usuarios (nome, email, senha_hash, role, ativo) VALUES 
('Admin', 'admin@example.com', '$2b$10$3TNbU8TS0pN3XsJU7O9elu8KwSBB5pVqN4dFZKNtCdqVKYlvEXnzK', 'ADMIN', 1);

-- BLOCO 13: INSERIR CURSOS
-- ============================================================================
INSERT INTO cursos (nome, descricao, carga_horaria, nivel, status) VALUES
('Desenvolvimento Web', 'Web com React', 120, 'INTERMEDIARIO', 'ATIVO'),
('Banco de Dados', 'SQL e NoSQL', 80, 'BASICO', 'ATIVO'),
('Python Avançado', 'Python com Django', 100, 'AVANCADO', 'ATIVO'),
('Mobile iOS', 'iOS com Swift', 90, 'INTERMEDIARIO', 'ATIVO'),
('DevOps', 'Docker e Cloud', 110, 'AVANCADO', 'ATIVO');

-- BLOCO 14: INSERIR TURMAS
-- ============================================================================
INSERT INTO turmas (nome, descricao, data_inicio, data_fim, turno, id_curso, vagas, status) VALUES
('Web A', 'Turma web 2025', '2025-01-15', '2025-06-15', 'MANHA', 1, 30, 'PLANEJADA'),
('Web B', 'Turma web 2025', '2025-02-01', '2025-07-01', 'TARDE', 1, 30, 'PLANEJADA'),
('BD A', 'Turma BD 2025', '2025-01-20', '2025-04-20', 'NOITE', 2, 25, 'PLANEJADA'),
('Python A', 'Turma Python 2025', '2025-02-10', '2025-07-10', 'MANHA', 3, 20, 'PLANEJADA'),
('DevOps A', 'Turma DevOps 2025', '2025-03-01', '2025-08-01', 'TARDE', 5, 15, 'PLANEJADA');

-- BLOCO 15: INSERIR INSTRUTORES
-- ============================================================================
INSERT INTO instrutores (nome, email, cpf, especialidade, telefone, ativo) VALUES
('Carlos Silva', 'carlos@example.com', '12345678901', 'Web', '11999999999', 1),
('Maria Santos', 'maria@example.com', '98765432101', 'BD', '11988888888', 1),
('João Oliveira', 'joao@example.com', '55566677788', 'Python', '11987654321', 1),
('Ana Costa', 'ana@example.com', '11122233344', 'Mobile', '11987654322', 1);

-- BLOCO 16: ASSOCIAR INSTRUTORES A TURMAS
-- ============================================================================
INSERT INTO instrutor_turma (id_instrutor, id_turma) VALUES
(1, 1), (1, 2), (2, 3), (3, 4), (4, 5);
