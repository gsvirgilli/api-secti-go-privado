-- ============================================================================
-- CRIAR TODAS AS TABELAS - API SECTI
-- ============================================================================

-- 1. USUÁRIOS (login/autenticação)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'CANDIDATO',
  ativo BOOLEAN DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. CURSOS
CREATE TABLE IF NOT EXISTS cursos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  carga_horaria INT,
  nivel VARCHAR(50) DEFAULT 'BASICO',
  status VARCHAR(50) DEFAULT 'ATIVO',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. TURMAS
CREATE TABLE IF NOT EXISTS turmas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_inicio DATE,
  data_fim DATE,
  turno VARCHAR(50),
  id_curso INT,
  vagas INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'PLANEJADA',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_curso) REFERENCES cursos(id)
);

-- 4. INSTRUTORES
CREATE TABLE IF NOT EXISTS instrutores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  cpf VARCHAR(11) UNIQUE,
  especialidade VARCHAR(255),
  telefone VARCHAR(20),
  ativo BOOLEAN DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. INSTRUTOR-TURMA
CREATE TABLE IF NOT EXISTS instrutor_turma (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_instrutor INT NOT NULL,
  id_turma INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_instrutor_turma (id_instrutor, id_turma),
  FOREIGN KEY (id_instrutor) REFERENCES instrutores(id),
  FOREIGN KEY (id_turma) REFERENCES turmas(id)
);

-- 6. CANDIDATOS (Processo Seletivo)
CREATE TABLE IF NOT EXISTS candidatos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(11) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
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
  
  menor_idade BOOLEAN DEFAULT 0,
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
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (curso_id) REFERENCES cursos(id),
  FOREIGN KEY (curso_id2) REFERENCES cursos(id),
  INDEX idx_cpf (cpf),
  INDEX idx_email (email),
  INDEX idx_status (status)
);

-- 7. ALUNOS
CREATE TABLE IF NOT EXISTS alunos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  matricula VARCHAR(50) NOT NULL UNIQUE,
  cpf VARCHAR(11) NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  data_nascimento DATE,
  endereco VARCHAR(255),
  candidato_id INT,
  usuario_id INT,
  turma_id INT,
  status VARCHAR(50) DEFAULT 'ativo',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (candidato_id) REFERENCES candidatos(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (turma_id) REFERENCES turmas(id)
);

-- 8. MATRÍCULAS
CREATE TABLE IF NOT EXISTS matriculas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT NOT NULL,
  turma_id INT NOT NULL,
  data_matricula DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'ATIVA',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (aluno_id) REFERENCES alunos(id),
  FOREIGN KEY (turma_id) REFERENCES turmas(id)
);

-- 9. PRESENCAS
CREATE TABLE IF NOT EXISTS presencas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT NOT NULL,
  turma_id INT NOT NULL,
  data_aula DATE NOT NULL,
  presente BOOLEAN DEFAULT 1,
  observacoes VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (aluno_id) REFERENCES alunos(id),
  FOREIGN KEY (turma_id) REFERENCES turmas(id)
);

-- 10. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  tabela VARCHAR(255) NOT NULL,
  operacao VARCHAR(50) NOT NULL,
  registro_id INT,
  dados_anteriores JSON,
  dados_novos JSON,
  descricao VARCHAR(500),
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- 11. PASSWORD RESET TOKENS
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  usado BOOLEAN DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ============================================================================
-- INSERIR DADOS DE EXEMPLO
-- ============================================================================

INSERT IGNORE INTO usuarios (nome, email, senha_hash, role, ativo) VALUES
('Admin Sistema', 'admin@example.com', '$2b$10$3TNbU8TS0pN3XsJU7O9elu8KwSBB5pVqN4dFZKNtCdqVKYlvEXnzK', 'ADMIN', 1);

INSERT IGNORE INTO cursos (nome, descricao, carga_horaria, nivel, status) VALUES
('Desenvolvimento Web', 'Curso de web com React e Node.js', 120, 'INTERMEDIARIO', 'ATIVO'),
('Banco de Dados', 'Fundamentos de SQL e NoSQL', 80, 'BASICO', 'ATIVO'),
('Python Avançado', 'Python com Django e FastAPI', 100, 'AVANCADO', 'ATIVO'),
('Mobile iOS', 'Desenvolvimento iOS com Swift', 90, 'INTERMEDIARIO', 'ATIVO'),
('DevOps e Cloud', 'Docker, Kubernetes e Cloud', 110, 'AVANCADO', 'ATIVO');

INSERT IGNORE INTO turmas (nome, descricao, data_inicio, data_fim, turno, id_curso, vagas, status) VALUES
('Web - Turma A', 'Turma de web 2025', '2025-01-15', '2025-06-15', 'MANHA', 1, 30, 'PLANEJADA'),
('Web - Turma B', 'Turma de web 2025', '2025-02-01', '2025-07-01', 'TARDE', 1, 30, 'PLANEJADA'),
('BD - Turma A', 'Turma de BD 2025', '2025-01-20', '2025-04-20', 'NOITE', 2, 25, 'PLANEJADA'),
('Python - Turma A', 'Turma de Python 2025', '2025-02-10', '2025-07-10', 'MANHA', 3, 20, 'PLANEJADA'),
('DevOps - Turma A', 'Turma DevOps 2025', '2025-03-01', '2025-08-01', 'TARDE', 5, 15, 'PLANEJADA');

INSERT IGNORE INTO instrutores (nome, email, cpf, especialidade, telefone, ativo) VALUES
('Carlos Silva', 'carlos@example.com', '12345678901', 'Web Development', '11999999999', 1),
('Maria Santos', 'maria@example.com', '98765432101', 'Banco de Dados', '11988888888', 1),
('João Oliveira', 'joao@example.com', '55566677788', 'Python Development', '11987654321', 1),
('Ana Costa', 'ana@example.com', '11122233344', 'Mobile Development', '11987654322', 1);

INSERT IGNORE INTO instrutor_turma (id_instrutor, id_turma) VALUES
(1, 1), (1, 2), (2, 3), (3, 4), (4, 5);

-- FIM
