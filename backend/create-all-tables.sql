-- ============================================================================
-- Script completo para criar TODAS as tabelas do banco de dados
-- Projeto: API SECTI - Processo Seletivo
-- ============================================================================

-- ============================================================================
-- 1. TABELA DE USUÁRIOS (Login/Autenticação)
-- ============================================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'INSTRUTOR', 'CANDIDATO', 'ALUNO') NOT NULL DEFAULT 'CANDIDATO',
  ativo BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_usuarios_email (email),
  INDEX idx_usuarios_role (role)
);

-- ============================================================================
-- 2. TABELA DE CURSOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS cursos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  carga_horaria INT,
  nivel ENUM('BASICO', 'INTERMEDIARIO', 'AVANCADO') DEFAULT 'BASICO',
  status ENUM('ATIVO', 'INATIVO', 'DESCONTINUADO') DEFAULT 'ATIVO',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_cursos_status (status)
);

-- ============================================================================
-- 3. TABELA DE TURMAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS turmas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_inicio DATE,
  data_fim DATE,
  turno VARCHAR(50),
  id_curso INT NOT NULL,
  vagas INT DEFAULT 0,
  status ENUM('PLANEJADA', 'ATIVA', 'ENCERRADA', 'CANCELADA') DEFAULT 'PLANEJADA',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_curso) REFERENCES cursos(id) ON DELETE RESTRICT,
  INDEX idx_turmas_curso (id_curso),
  INDEX idx_turmas_status (status)
);

-- ============================================================================
-- 4. TABELA DE INSTRUTORES
-- ============================================================================
CREATE TABLE IF NOT EXISTS instrutores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  cpf VARCHAR(11) UNIQUE,
  especialidade VARCHAR(255),
  telefone VARCHAR(20),
  ativo BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_instrutores_email (email),
  INDEX idx_instrutores_cpf (cpf)
);

-- ============================================================================
-- 5. TABELA DE ASSOCIAÇÃO INSTRUTOR-TURMA
-- ============================================================================
CREATE TABLE IF NOT EXISTS instrutor_turma (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_instrutor INT NOT NULL,
  id_turma INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_instrutor_turma (id_instrutor, id_turma),
  FOREIGN KEY (id_instrutor) REFERENCES instrutores(id) ON DELETE CASCADE,
  FOREIGN KEY (id_turma) REFERENCES turmas(id) ON DELETE CASCADE
);

-- ============================================================================
-- 6. TABELA DE CANDIDATOS (Processo Seletivo)
-- ============================================================================
CREATE TABLE IF NOT EXISTS candidatos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- Dados básicos (obrigatórios)
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(11) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  data_nascimento DATE,
  
  -- Curso e turno
  curso_id INT,
  turno VARCHAR(50),
  curso_id2 INT,
  turno2 VARCHAR(50),
  local_curso VARCHAR(100),
  
  -- Status
  status ENUM('PENDENTE', 'REPROVADO', 'LISTA_ESPERA') DEFAULT 'PENDENTE',
  processo_seletivo_id INT,
  
  -- Dados pessoais estendidos
  rg VARCHAR(20),
  sexo ENUM('FEMININO', 'MASCULINO', 'OUTRO', 'PREFIRO_NAO_INFORMAR'),
  deficiencia ENUM('NAO', 'AUDITIVA', 'VISUAL', 'FISICA', 'INTELECTUAL', 'MULTIPLA'),
  telefone2 VARCHAR(20),
  idade INT,
  nome_mae VARCHAR(100),
  cidade_nascimento VARCHAR(100),
  
  -- Endereço
  cep VARCHAR(8),
  rua VARCHAR(200),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  
  -- Questionário Social
  raca_cor ENUM('BRANCO', 'PARDO', 'NEGRO', 'INDIGENA', 'AMARELO'),
  renda_mensal ENUM('SEM_RENDA', 'ATE_MEIO_SM', 'ATE_1_SM', '1_A_2_SALARIOS', '2_A_3_SALARIOS', '3_A_4_SALARIOS', 'ACIMA_5_SALARIOS'),
  pessoas_renda INT,
  tipo_residencia ENUM('PROPRIA_QUITADA', 'PROPRIA_FINANCIADA', 'ALUGADA', 'HERDADA', 'CEDIDA'),
  itens_casa VARCHAR(500),
  
  -- Programa Goianas
  goianas_ciencia ENUM('SIM', 'NAO'),
  
  -- Responsável Legal (para menores)
  menor_idade BOOLEAN DEFAULT FALSE,
  nome_responsavel VARCHAR(100),
  cpf_responsavel VARCHAR(11),
  
  -- URLs dos documentos
  rg_frente_url VARCHAR(255),
  rg_verso_url VARCHAR(255),
  cpf_aluno_url VARCHAR(255),
  comprovante_endereco_url VARCHAR(255),
  identidade_responsavel_frente_url VARCHAR(255),
  identidade_responsavel_verso_url VARCHAR(255),
  cpf_responsavel_url VARCHAR(255),
  comprovante_escolaridade_url VARCHAR(255),
  foto_3x4_url VARCHAR(255),
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Índices
  FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE SET NULL,
  FOREIGN KEY (curso_id2) REFERENCES cursos(id) ON DELETE SET NULL,
  INDEX idx_candidatos_cpf (cpf),
  INDEX idx_candidatos_email (email),
  INDEX idx_candidatos_status (status),
  INDEX idx_candidatos_curso_id (curso_id),
  INDEX idx_candidatos_curso_id2 (curso_id2)
);

-- ============================================================================
-- 7. TABELA DE ALUNOS
-- ============================================================================
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
  status ENUM('ativo', 'trancado', 'concluido', 'desistente') DEFAULT 'ativo',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (candidato_id) REFERENCES candidatos(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL,
  INDEX idx_alunos_cpf (cpf),
  INDEX idx_alunos_email (email),
  INDEX idx_alunos_matricula (matricula),
  INDEX idx_alunos_turma (turma_id)
);

-- ============================================================================
-- 8. TABELA DE MATRÍCULAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS matriculas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT NOT NULL,
  turma_id INT NOT NULL,
  data_matricula DATE NOT NULL,
  status ENUM('ATIVA', 'CONCLUIDA', 'CANCELADA', 'TRANCADA') DEFAULT 'ATIVA',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
  UNIQUE KEY unique_aluno_turma (aluno_id, turma_id),
  INDEX idx_matriculas_status (status)
);

-- ============================================================================
-- 9. TABELA DE PRESENÇA/FREQUÊNCIA
-- ============================================================================
CREATE TABLE IF NOT EXISTS presencas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT NOT NULL,
  turma_id INT NOT NULL,
  data_aula DATE NOT NULL,
  presente BOOLEAN DEFAULT TRUE,
  observacoes VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
  INDEX idx_presencas_aluno (aluno_id),
  INDEX idx_presencas_data (data_aula)
);

-- ============================================================================
-- 10. TABELA DE LOGS DE AUDITORIA
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  tabela VARCHAR(255) NOT NULL,
  operacao ENUM('CREATE', 'READ', 'UPDATE', 'DELETE') NOT NULL,
  registro_id INT,
  dados_anteriores JSON,
  dados_novos JSON,
  descricao VARCHAR(500),
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_audit_usuario (usuario_id),
  INDEX idx_audit_tabela (tabela),
  INDEX idx_audit_data (createdAt)
);

-- ============================================================================
-- 11. TABELA DE TOKENS DE RESET DE SENHA
-- ============================================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  usado BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_password_reset_usuario (usuario_id),
  INDEX idx_password_reset_token (token),
  INDEX idx_password_reset_expires (expires_at)
);

-- ============================================================================
-- 12. INSERTAR DADOS DE EXEMPLO
-- ============================================================================

-- Usuário ADMIN
INSERT IGNORE INTO usuarios (nome, email, senha_hash, role, createdAt, updatedAt)
VALUES (
  'Admin Sistema',
  'admin@example.com',
  '$2b$10$3TNbU8TS0pN3XsJU7O9elu8KwSBB5pVqN4dFZKNtCdqVKYlvEXnzK',
  'ADMIN',
  NOW(),
  NOW()
);

-- Cursos
INSERT IGNORE INTO cursos (nome, descricao, carga_horaria, nivel, status, createdAt, updatedAt)
VALUES
  ('Desenvolvimento Web', 'Curso completo de desenvolvimento web com HTML, CSS, JavaScript e frameworks modernos', 120, 'INTERMEDIARIO', 'ATIVO', NOW(), NOW()),
  ('Banco de Dados', 'Fundamentos de banco de dados SQL e NoSQL com MySQL e MongoDB', 80, 'BASICO', 'ATIVO', NOW(), NOW()),
  ('Python Avançado', 'Programação em Python com frameworks Django e FastAPI', 100, 'AVANCADO', 'ATIVO', NOW(), NOW()),
  ('Mobile iOS', 'Desenvolvimento de aplicativos para iOS com Swift', 90, 'INTERMEDIARIO', 'ATIVO', NOW(), NOW()),
  ('DevOps e Cloud', 'Containerização com Docker, Kubernetes, CI/CD e Cloud Computing', 110, 'AVANCADO', 'ATIVO', NOW(), NOW());

-- Turmas
INSERT IGNORE INTO turmas (nome, descricao, data_inicio, data_fim, turno, id_curso, vagas, status, createdAt, updatedAt)
VALUES
  ('Web - Turma A', 'Primeira turma de desenvolvimento web 2025', '2025-01-15', '2025-06-15', 'MANHA', 1, 30, 'PLANEJADA', NOW(), NOW()),
  ('Web - Turma B', 'Segunda turma de desenvolvimento web 2025', '2025-02-01', '2025-07-01', 'TARDE', 1, 30, 'PLANEJADA', NOW(), NOW()),
  ('BD - Turma A', 'Turma de banco de dados 2025', '2025-01-20', '2025-04-20', 'NOITE', 2, 25, 'PLANEJADA', NOW(), NOW()),
  ('Python - Turma A', 'Turma de Python avançado 2025', '2025-02-10', '2025-07-10', 'MANHA', 3, 20, 'PLANEJADA', NOW(), NOW()),
  ('DevOps - Turma A', 'Turma de DevOps e Cloud 2025', '2025-03-01', '2025-08-01', 'TARDE', 5, 15, 'PLANEJADA', NOW(), NOW());

-- Instrutores
INSERT IGNORE INTO instrutores (nome, email, cpf, especialidade, telefone, ativo, createdAt, updatedAt)
VALUES
  ('Carlos Silva', 'carlos@example.com', '12345678901', 'Web Development', '11999999999', TRUE, NOW(), NOW()),
  ('Maria Santos', 'maria@example.com', '98765432101', 'Banco de Dados', '11988888888', TRUE, NOW(), NOW()),
  ('João Oliveira', 'joao@example.com', '55566677788', 'Python Development', '11987654321', TRUE, NOW(), NOW()),
  ('Ana Costa', 'ana@example.com', '11122233344', 'Mobile Development', '11987654322', TRUE, NOW(), NOW());

-- Associar instrutores às turmas
INSERT IGNORE INTO instrutor_turma (id_instrutor, id_turma, createdAt, updatedAt)
VALUES
  (1, 1, NOW(), NOW()),
  (1, 2, NOW(), NOW()),
  (2, 3, NOW(), NOW()),
  (3, 4, NOW(), NOW()),
  (4, 5, NOW(), NOW());

-- ============================================================================
-- 13. ÍNDICES ADICIONAIS PARA PERFORMANCE
-- ============================================================================
ALTER TABLE usuarios ADD INDEX idx_usuarios_ativo (ativo);
ALTER TABLE cursos ADD INDEX idx_cursos_nivel (nivel);
ALTER TABLE turmas ADD INDEX idx_turmas_data_inicio (data_inicio);
ALTER TABLE alunos ADD INDEX idx_alunos_status (status);

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
COMMIT;
