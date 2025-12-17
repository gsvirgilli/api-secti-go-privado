-- ============================================================================
-- SCRIPT COMPLETO DE SINCRONIZAÇÃO DO BANCO DE DADOS
-- DigitalOcean - API SECTI GO PRIVADO
-- ============================================================================
-- Execute este script na sua instância do DigitalOcean para sincronizar
-- todas as tabelas necessárias para o projeto funcionarem corretamente

USE defaultdb;

-- ============================================================================
-- 1. USUÁRIOS (login/autenticação)
-- ============================================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'CANDIDATO',
  ativo BOOLEAN DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- ============================================================================
-- 2. CURSOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS cursos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  carga_horaria INT,
  nivel VARCHAR(50) DEFAULT 'BASICO',
  status VARCHAR(50) DEFAULT 'ATIVO',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
);

-- ============================================================================
-- 3. TURMAS
-- ============================================================================
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
  FOREIGN KEY (id_curso) REFERENCES cursos(id),
  INDEX idx_status (status),
  INDEX idx_curso (id_curso)
);

-- ============================================================================
-- 4. INSTRUTORES
-- ============================================================================
CREATE TABLE IF NOT EXISTS instrutores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  cpf VARCHAR(11) UNIQUE,
  especialidade VARCHAR(255),
  telefone VARCHAR(20),
  ativo BOOLEAN DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_cpf (cpf)
);

-- ============================================================================
-- 5. INSTRUTOR-TURMA (relacionamento muitos-para-muitos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS instrutor_turma (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_instrutor INT NOT NULL,
  id_turma INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_instrutor_turma (id_instrutor, id_turma),
  FOREIGN KEY (id_instrutor) REFERENCES instrutores(id) ON DELETE CASCADE,
  FOREIGN KEY (id_turma) REFERENCES turmas(id) ON DELETE CASCADE,
  INDEX idx_instrutor (id_instrutor),
  INDEX idx_turma (id_turma)
);

-- ============================================================================
-- 6. CANDIDATOS (Processo Seletivo)
-- ============================================================================
CREATE TABLE IF NOT EXISTS candidatos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- Dados Pessoais Básicos
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(11) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  data_nascimento DATE,
  
  -- Seleção de Cursos
  curso_id INT NOT NULL,
  turno VARCHAR(50),
  curso_id2 INT,
  turno2 VARCHAR(50),
  local_curso VARCHAR(100),
  
  -- Status e Processo Seletivo
  status VARCHAR(50) DEFAULT 'PENDENTE',
  processo_seletivo_id INT,
  
  -- Dados Pessoais Adicionais
  rg VARCHAR(20),
  sexo VARCHAR(50),
  deficiencia VARCHAR(50),
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
  raca_cor VARCHAR(50),
  renda_mensal VARCHAR(50),
  pessoas_renda INT,
  tipo_residencia VARCHAR(50),
  itens_casa VARCHAR(500),
  
  -- Programa Especial
  goianas_ciencia VARCHAR(10),
  
  -- Responsável Legal (se menor de idade)
  menor_idade BOOLEAN DEFAULT 0,
  nome_responsavel VARCHAR(100),
  cpf_responsavel VARCHAR(11),
  
  -- Documentos (URLs)
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

-- ============================================================================
-- 7. ALUNOS
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
  status VARCHAR(50) DEFAULT 'Ativo',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (candidato_id) REFERENCES candidatos(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL,
  INDEX idx_cpf (cpf),
  INDEX idx_email (email),
  INDEX idx_matricula (matricula),
  INDEX idx_status (status)
);

-- ============================================================================
-- 8. MATRÍCULAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS matriculas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT NOT NULL,
  turma_id INT NOT NULL,
  data_matricula DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'ATIVA',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
  INDEX idx_aluno (aluno_id),
  INDEX idx_turma (turma_id),
  INDEX idx_status (status)
);

-- ============================================================================
-- 9. PRESENCAS / ATTENDANCE
-- ============================================================================
CREATE TABLE IF NOT EXISTS presencas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT NOT NULL,
  turma_id INT NOT NULL,
  data_aula DATE NOT NULL,
  presente BOOLEAN DEFAULT 1,
  observacoes VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
  INDEX idx_aluno (aluno_id),
  INDEX idx_turma (turma_id),
  INDEX idx_data (data_aula)
);

-- Alias para presença (compatibilidade)
CREATE TABLE IF NOT EXISTS attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT NOT NULL,
  turma_id INT NOT NULL,
  data_aula DATE NOT NULL,
  presente BOOLEAN DEFAULT 1,
  observacoes VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
  INDEX idx_aluno (aluno_id),
  INDEX idx_turma (turma_id),
  INDEX idx_data (data_aula)
);

-- ============================================================================
-- 10. AUDIT LOGS
-- ============================================================================
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
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_tabela (tabela),
  INDEX idx_operacao (operacao),
  INDEX idx_usuario (usuario_id),
  INDEX idx_criacao (createdAt)
);

-- ============================================================================
-- 11. PASSWORD RESET TOKENS
-- ============================================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  usado BOOLEAN DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_usuario (usuario_id),
  INDEX idx_expira (expires_at)
);

-- ============================================================================
-- 12. CALENDAR EVENTS (Eventos Académicos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS calendar_events (
  id INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(200) NOT NULL COMMENT 'Título do evento',
  descricao TEXT NULL COMMENT 'Descrição detalhada do evento',
  data_inicio DATETIME NOT NULL COMMENT 'Data e hora de início do evento',
  data_fim DATETIME NULL COMMENT 'Data e hora de término do evento',
  tipo ENUM('AULA', 'PROVA', 'ENTREGA', 'FERIADO', 'EVENTO', 'INSCRICAO', 'FORMATURAS') NOT NULL DEFAULT 'EVENTO' COMMENT 'Tipo de evento no calendário',
  status ENUM('PLANEJADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO') NOT NULL DEFAULT 'PLANEJADO' COMMENT 'Status do evento',
  turma_id INT NULL COMMENT 'ID da turma relacionada (opcional)',
  curso_id INT NULL COMMENT 'ID do curso relacionado (opcional)',
  cor VARCHAR(7) NULL DEFAULT '#3B82F6' COMMENT 'Cor do evento em formato hexadecimal',
  createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_calendar_data_inicio (data_inicio),
  INDEX idx_calendar_tipo (tipo),
  INDEX idx_calendar_turma (turma_id),
  INDEX idx_calendar_curso (curso_id),
  CONSTRAINT fk_calendar_turma FOREIGN KEY (turma_id) REFERENCES turmas (id) ON DELETE CASCADE,
  CONSTRAINT fk_calendar_curso FOREIGN KEY (curso_id) REFERENCES cursos (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Eventos do calendário académico';

-- ============================================================================
-- 13. NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL COMMENT 'Título da notificação',
  descricao LONGTEXT NOT NULL COMMENT 'Descrição detalhada da notificação',
  tipo ENUM('ALUNO', 'TURMA', 'INSTRUTOR', 'CALENDARIO', 'CANDIDATO') NOT NULL DEFAULT 'ALUNO' COMMENT 'Tipo de notificação',
  icone VARCHAR(50) COMMENT 'Ícone da notificação',
  lido BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Se a notificação foi lida',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_notification_lido (lido),
  INDEX idx_notification_tipo (tipo),
  INDEX idx_notification_criacao (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 14. STUDENT COURSES (Relacionamento Alunos-Cursos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS student_courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  turma_id INT,
  status ENUM('Ativo', 'Concluído', 'Desistente') NOT NULL DEFAULT 'Ativo',
  data_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_conclusao DATETIME NULL,
  motivo_desistencia VARCHAR(255) NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (student_id) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES cursos(id) ON DELETE CASCADE,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL,
  
  UNIQUE KEY unique_student_course (student_id, course_id),
  INDEX idx_student_id (student_id),
  INDEX idx_course_id (course_id),
  INDEX idx_status (status)
);

-- ============================================================================
-- INSERIR DADOS DE EXEMPLO (ADMIN)
-- ============================================================================

INSERT IGNORE INTO usuarios (nome, email, senha_hash, role, ativo) VALUES
('Admin Sistema', 'admin@example.com', '$2b$10$3TNbU8TS0pN3XsJU7O9elu8KwSBB5pVqN4dFZKNtCdqVKYlvEXnzK', 'ADMIN', 1);

-- ============================================================================
-- VERIFICAÇÃO FINAL
-- ============================================================================

SELECT 'Tabelas criadas com sucesso!' as Status;

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'defaultdb' 
ORDER BY table_name;
