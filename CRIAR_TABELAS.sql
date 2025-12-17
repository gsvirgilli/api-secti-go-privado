-- ============================================================================
-- SCRIPT PARA CRIAR TODAS AS TABELAS - API SECTI GO PRIVADO
-- Execute no DBeaver conectado ao banco do DigitalOcean
-- ============================================================================

-- 1. USUÁRIOS
CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'CANDIDATO',
  ativo BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  INDEX idx_email (email)
);

-- 2. CURSOS
CREATE TABLE IF NOT EXISTS cursos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  carga_horaria INT,
  nivel VARCHAR(50) DEFAULT 'BASICO',
  status VARCHAR(50) DEFAULT 'ATIVO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  INDEX idx_status (status)
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  FOREIGN KEY (id_curso) REFERENCES cursos(id),
  INDEX idx_status (status),
  INDEX idx_curso (id_curso)
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  INDEX idx_email (email),
  INDEX idx_cpf (cpf)
);

-- 5. INSTRUTOR-TURMA
CREATE TABLE IF NOT EXISTS instrutor_turma (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_instrutor INT NOT NULL,
  id_turma INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  UNIQUE KEY unique_instrutor_turma (id_instrutor, id_turma),
  FOREIGN KEY (id_instrutor) REFERENCES instrutores(id) ON DELETE CASCADE,
  FOREIGN KEY (id_turma) REFERENCES turmas(id) ON DELETE CASCADE,
  INDEX idx_instrutor (id_instrutor),
  INDEX idx_turma (id_turma)
);

-- 6. CANDIDATOS
CREATE TABLE IF NOT EXISTS candidatos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(11) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  data_nascimento DATE,
  curso_id INT NOT NULL,
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
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
  status VARCHAR(50) DEFAULT 'Ativo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  FOREIGN KEY (candidato_id) REFERENCES candidatos(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL,
  INDEX idx_cpf (cpf),
  INDEX idx_email (email),
  INDEX idx_matricula (matricula),
  INDEX idx_status (status)
);

-- 8. MATRÍCULAS
CREATE TABLE IF NOT EXISTS matriculas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT NOT NULL,
  turma_id INT NOT NULL,
  data_matricula DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'ATIVA',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
  INDEX idx_aluno (aluno_id),
  INDEX idx_turma (turma_id),
  INDEX idx_status (status)
);

-- 9. PRESENCAS
CREATE TABLE IF NOT EXISTS presencas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT NOT NULL,
  turma_id INT NOT NULL,
  data_aula DATE NOT NULL,
  presente BOOLEAN DEFAULT 1,
  observacoes VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
  INDEX idx_aluno (aluno_id),
  INDEX idx_turma (turma_id),
  INDEX idx_data (data_aula)
);

-- 10. ATTENDANCE
CREATE TABLE IF NOT EXISTS attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT NOT NULL,
  turma_id INT NOT NULL,
  data_aula DATE NOT NULL,
  presente BOOLEAN DEFAULT 1,
  observacoes VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
  INDEX idx_aluno (aluno_id),
  INDEX idx_turma (turma_id),
  INDEX idx_data (data_aula)
);

-- 11. AUDIT LOGS
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_tabela (tabela),
  INDEX idx_operacao (operacao),
  INDEX idx_usuario (usuario_id),
  INDEX idx_criacao (created_at)
);

-- 12. PASSWORD RESET TOKENS
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  usado BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_usuario (usuario_id),
  INDEX idx_expira (expires_at)
);

-- 13. CALENDAR EVENTS
CREATE TABLE IF NOT EXISTS calendar_events (
  id INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT NULL,
  data_inicio DATETIME NOT NULL,
  data_fim DATETIME NULL,
  tipo ENUM('AULA', 'PROVA', 'ENTREGA', 'FERIADO', 'EVENTO', 'INSCRICAO', 'FORMATURAS') NOT NULL DEFAULT 'EVENTO',
  status ENUM('PLANEJADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO') NOT NULL DEFAULT 'PLANEJADO',
  turma_id INT NULL,
  curso_id INT NULL,
  cor VARCHAR(7) NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (id),
  INDEX idx_data_inicio (data_inicio),
  INDEX idx_tipo (tipo),
  INDEX idx_turma (turma_id),
  INDEX idx_curso (curso_id),
  CONSTRAINT fk_calendar_turma FOREIGN KEY (turma_id) REFERENCES turmas (id) ON DELETE CASCADE,
  CONSTRAINT fk_calendar_curso FOREIGN KEY (curso_id) REFERENCES cursos (id) ON DELETE CASCADE
);

-- 14. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descricao LONGTEXT NOT NULL,
  tipo ENUM('ALUNO', 'TURMA', 'INSTRUTOR', 'CALENDARIO', 'CANDIDATO') NOT NULL DEFAULT 'ALUNO',
  icone VARCHAR(50),
  lido BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  INDEX idx_lido (lido),
  INDEX idx_tipo (tipo),
  INDEX idx_criacao (created_at)
);

-- 15. STUDENT COURSES
CREATE TABLE IF NOT EXISTS student_courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  turma_id INT,
  status ENUM('Ativo', 'Concluído', 'Desistente') NOT NULL DEFAULT 'Ativo',
  data_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  data_conclusao DATETIME NULL,
  motivo_desistencia VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  FOREIGN KEY (student_id) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES cursos(id) ON DELETE CASCADE,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL,
  UNIQUE KEY unique_student_course (student_id, course_id),
  INDEX idx_student_id (student_id),
  INDEX idx_course_id (course_id),
  INDEX idx_status (status)
);

-- ============================================================================
-- INSERIR DADOS
-- ============================================================================

-- Usuário Admin
INSERT IGNORE INTO usuarios (nome, email, senha_hash, role, ativo) VALUES 
('Admin', 'admin@example.com', '$2b$10$3TNbU8TS0pN3XsJU7O9elu8KwSBB5pVqN4dFZKNtCdqVKYlvEXnzK', 'ADMIN', 1);

-- Cursos
INSERT IGNORE INTO cursos (nome, descricao, carga_horaria, nivel, status) VALUES
('Desenvolvimento Web', 'Web com React', 120, 'INTERMEDIARIO', 'ATIVO'),
('Banco de Dados', 'SQL e NoSQL', 80, 'BASICO', 'ATIVO'),
('Python Avançado', 'Python com Django', 100, 'AVANCADO', 'ATIVO'),
('Mobile iOS', 'iOS com Swift', 90, 'INTERMEDIARIO', 'ATIVO'),
('DevOps', 'Docker e Cloud', 110, 'AVANCADO', 'ATIVO');

-- Turmas
INSERT IGNORE INTO turmas (nome, descricao, data_inicio, data_fim, turno, id_curso, vagas, status) VALUES
('Web A', 'Turma web 2025', '2025-01-15', '2025-06-15', 'MANHA', 1, 30, 'PLANEJADA'),
('Web B', 'Turma web 2025', '2025-02-01', '2025-07-01', 'TARDE', 1, 30, 'PLANEJADA'),
('BD A', 'Turma BD 2025', '2025-01-20', '2025-04-20', 'NOITE', 2, 25, 'PLANEJADA'),
('Python A', 'Turma Python 2025', '2025-02-10', '2025-07-10', 'MANHA', 3, 20, 'PLANEJADA'),
('DevOps A', 'Turma DevOps 2025', '2025-03-01', '2025-08-01', 'TARDE', 5, 15, 'PLANEJADA');

-- Instrutores
INSERT IGNORE INTO instrutores (nome, email, cpf, especialidade, telefone, ativo) VALUES
('Carlos Silva', 'carlos@example.com', '12345678901', 'Web', '11999999999', 1),
('Maria Santos', 'maria@example.com', '98765432101', 'BD', '11988888888', 1),
('João Oliveira', 'joao@example.com', '55566677788', 'Python', '11987654321', 1),
('Ana Costa', 'ana@example.com', '11122233344', 'Mobile', '11987654322', 1);

-- Instrutor-Turma
INSERT IGNORE INTO instrutor_turma (id_instrutor, id_turma) VALUES
(1, 1), (1, 2), (2, 3), (3, 4), (4, 5);

-- Candidatos
INSERT IGNORE INTO candidatos (nome, cpf, email, telefone, data_nascimento, curso_id, turno, status) VALUES
('João da Silva', '12345678901', 'joao@example.com', '11987654321', '1995-05-15', 1, 'MANHA', 'PENDENTE'),
('Maria Santos', '98765432101', 'maria@example.com', '11987654322', '1996-08-20', 2, 'TARDE', 'PENDENTE'),
('Pedro Oliveira', '55566677788', 'pedro@example.com', '11987654323', '1997-03-10', 1, 'NOITE', 'APROVADO'),
('Ana Costa', '11122233344', 'ana@example.com', '11987654324', '1998-12-25', 3, 'MANHA', 'LISTA_ESPERA');

-- Alunos
INSERT IGNORE INTO alunos (matricula, cpf, nome, email, telefone, data_nascimento, status) VALUES
('MAT001', '11111111111', 'Carlos Silva', 'carlos@example.com', '11987654325', '1999-01-10', 'Ativo'),
('MAT002', '22222222222', 'Julia Costa', 'julia@example.com', '11987654326', '2000-02-20', 'Ativo'),
('MAT003', '33333333333', 'Lucas Alves', 'lucas@example.com', '11987654327', '2001-03-30', 'Ativo'),
('MAT004', '44444444444', 'Fernanda Lima', 'fernanda@example.com', '11987654328', '2002-04-15', 'Ativo');

-- Matrículas
INSERT IGNORE INTO matriculas (aluno_id, turma_id, data_matricula, status) VALUES
(1, 1, '2025-01-15', 'ATIVA'),
(2, 2, '2025-02-01', 'ATIVA'),
(3, 3, '2025-01-20', 'ATIVA'),
(4, 4, '2025-02-10', 'ATIVA');

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================
SELECT 'OK - Todas as tabelas foram criadas e populadas!' as Status;
