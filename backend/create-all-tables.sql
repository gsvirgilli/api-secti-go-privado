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
  cargaHoraria INT,
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
  dataInicio DATE,
  dataFim DATE,
  turno VARCHAR(50),
  idCurso INT NOT NULL,
  vagas INT DEFAULT 0,
  status ENUM('PLANEJADA', 'ATIVA', 'ENCERRADA', 'CANCELADA') DEFAULT 'PLANEJADA',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (idCurso) REFERENCES cursos(id) ON DELETE RESTRICT,
  INDEX idx_turmas_curso (idCurso),
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
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_instrutores_email (email),
  INDEX idx_instrutores_cpf (cpf)
);

-- ============================================================================
-- 5. TABELA DE ASSOCIAÇÃO INSTRUTOR-TURMA
-- ============================================================================
CREATE TABLE IF NOT EXISTS instrutor_turma (
  id INT PRIMARY KEY AUTO_INCREMENT,
  idInstrutor INT NOT NULL,
  idTurma INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_instrutor_turma (idInstrutor, idTurma),
  FOREIGN KEY (idInstrutor) REFERENCES instrutores(id) ON DELETE CASCADE,
  FOREIGN KEY (idTurma) REFERENCES turmas(id) ON DELETE CASCADE
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
  dataNascimento DATE,
  
  -- Curso e turno
  cursoId INT,
  turno VARCHAR(50),
  cursoId2 INT,
  turno2 VARCHAR(50),
  localCurso VARCHAR(100),
  
  -- Status
  status ENUM('PENDENTE', 'REPROVADO', 'LISTA_ESPERA') DEFAULT 'PENDENTE',
  processoSeletorivoId INT,
  
  -- Turmas desejadas
  idTurmaDesejada INT,
  turmaId INT,
  
  -- Dados pessoais estendidos
  rg VARCHAR(20),
  sexo ENUM('FEMININO', 'MASCULINO', 'OUTRO', 'PREFIRO_NAO_INFORMAR'),
  deficiencia ENUM('NAO', 'AUDITIVA', 'VISUAL', 'FISICA', 'INTELECTUAL', 'MULTIPLA'),
  telefone2 VARCHAR(20),
  idade INT,
  nomeMae VARCHAR(100),
  cidadeNascimento VARCHAR(100),
  
  -- Endereço
  cep VARCHAR(8),
  rua VARCHAR(200),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  
  -- Questionário Social
  racaCor ENUM('BRANCO', 'PARDO', 'NEGRO', 'INDIGENA', 'AMARELO'),
  rendaMensal ENUM('SEM_RENDA', 'ATE_MEIO_SM', 'ATE_1_SM', '1_A_2_SALARIOS', '2_A_3_SALARIOS', '3_A_4_SALARIOS', 'ACIMA_5_SALARIOS'),
  pessoasRenda INT,
  tipoResidencia ENUM('PROPRIA_QUITADA', 'PROPRIA_FINANCIADA', 'ALUGADA', 'HERDADA', 'CEDIDA'),
  itensCasa VARCHAR(500),
  
  -- Programa Goianas
  goianasCiencia ENUM('SIM', 'NAO'),
  
  -- Responsável Legal (para menores)
  menorIdade BOOLEAN DEFAULT FALSE,
  nomeResponsavel VARCHAR(100),
  cpfResponsavel VARCHAR(11),
  
  -- URLs dos documentos
  rgFrenteUrl VARCHAR(255),
  rgVersoUrl VARCHAR(255),
  cpfAlunoUrl VARCHAR(255),
  comproventeEnderecoUrl VARCHAR(255),
  identidadeResponsavelFrenteUrl VARCHAR(255),
  identidadeResponsavelVersoUrl VARCHAR(255),
  cpfResponsavelUrl VARCHAR(255),
  comproventeEscolaridadeUrl VARCHAR(255),
  foto3x4Url VARCHAR(255),
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Índices
  FOREIGN KEY (cursoId) REFERENCES cursos(id) ON DELETE SET NULL,
  FOREIGN KEY (cursoId2) REFERENCES cursos(id) ON DELETE SET NULL,
  FOREIGN KEY (idTurmaDesejada) REFERENCES turmas(id) ON DELETE SET NULL,
  FOREIGN KEY (turmaId) REFERENCES turmas(id) ON DELETE SET NULL,
  INDEX idx_candidatos_cpf (cpf),
  INDEX idx_candidatos_email (email),
  INDEX idx_candidatos_status (status),
  INDEX idx_candidatos_curso_id (cursoId),
  INDEX idx_candidatos_curso_id2 (cursoId2)
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
  dataNascimento DATE,
  endereco VARCHAR(255),
  candidatoId INT,
  usuarioId INT,
  turmaId INT,
  status ENUM('ativo', 'trancado', 'concluido', 'desistente') DEFAULT 'ativo',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (candidatoId) REFERENCES candidatos(id) ON DELETE SET NULL,
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (turmaId) REFERENCES turmas(id) ON DELETE SET NULL,
  INDEX idx_alunos_cpf (cpf),
  INDEX idx_alunos_email (email),
  INDEX idx_alunos_matricula (matricula),
  INDEX idx_alunos_turma (turmaId)
);

-- ============================================================================
-- 8. TABELA DE MATRÍCULAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS matriculas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alunoId INT NOT NULL,
  turmaId INT NOT NULL,
  dataMatricula DATE NOT NULL,
  status ENUM('ATIVA', 'CONCLUIDA', 'CANCELADA', 'TRANCADA') DEFAULT 'ATIVA',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (alunoId) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (turmaId) REFERENCES turmas(id) ON DELETE CASCADE,
  UNIQUE KEY unique_aluno_turma (alunoId, turmaId),
  INDEX idx_matriculas_status (status)
);

-- ============================================================================
-- 9. TABELA DE PRESENÇA/FREQUÊNCIA
-- ============================================================================
CREATE TABLE IF NOT EXISTS presencas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alunoId INT NOT NULL,
  turmaId INT NOT NULL,
  dataAula DATE NOT NULL,
  presente BOOLEAN DEFAULT TRUE,
  observacoes VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (alunoId) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (turmaId) REFERENCES turmas(id) ON DELETE CASCADE,
  INDEX idx_presencas_aluno (alunoId),
  INDEX idx_presencas_data (dataAula)
);

-- ============================================================================
-- 10. TABELA DE LOGS DE AUDITORIA
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuarioId INT,
  tabela VARCHAR(255) NOT NULL,
  operacao ENUM('CREATE', 'READ', 'UPDATE', 'DELETE') NOT NULL,
  registroId INT,
  dadosAnteriores JSON,
  dadosNovos JSON,
  descricao VARCHAR(500),
  ipAddress VARCHAR(45),
  userAgent VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_audit_usuario (usuarioId),
  INDEX idx_audit_tabela (tabela),
  INDEX idx_audit_data (createdAt)
);

-- ============================================================================
-- 11. TABELA DE TOKENS DE RESET DE SENHA
-- ============================================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuarioId INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expiresAt DATETIME NOT NULL,
  usado BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_password_reset_usuario (usuarioId),
  INDEX idx_password_reset_token (token),
  INDEX idx_password_reset_expires (expiresAt)
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
INSERT IGNORE INTO turmas (nome, descricao, dataInicio, dataFim, turno, idCurso, vagas, status, createdAt, updatedAt)
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
INSERT IGNORE INTO instrutor_turma (idInstrutor, idTurma, createdAt, updatedAt)
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
ALTER TABLE turmas ADD INDEX idx_turmas_data_inicio (dataInicio);
ALTER TABLE alunos ADD INDEX idx_alunos_status (status);

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
COMMIT;
