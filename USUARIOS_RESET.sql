-- ============================================================================
-- LIMPAR E RECRIAR TABELAS RELACIONADAS
-- ============================================================================

-- Desabilitar verificação de chaves estrangeiras temporariamente
SET FOREIGN_KEY_CHECKS=0;

-- Dropar tabelas que dependem de usuarios
DROP TABLE IF EXISTS matriculas;
DROP TABLE IF EXISTS presencas;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS student_courses;
DROP TABLE IF EXISTS alunos;
DROP TABLE IF EXISTS usuarios;

-- Reabilitar verificação de chaves estrangeiras
SET FOREIGN_KEY_CHECKS=1;

-- ============================================================================
-- RECRIAR TABELA USUARIOS
-- ============================================================================
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'CANDIDATO',
  ativo BOOLEAN DEFAULT 1,
  avatar_url VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- ============================================================================
-- RECRIAR TABELA ALUNOS
-- ============================================================================
CREATE TABLE alunos (
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

-- ============================================================================
-- RECRIAR TABELA MATRICULAS
-- ============================================================================
CREATE TABLE matriculas (
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

-- ============================================================================
-- RECRIAR TABELA PRESENCAS
-- ============================================================================
CREATE TABLE presencas (
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

-- ============================================================================
-- RECRIAR TABELA ATTENDANCE
-- ============================================================================
CREATE TABLE attendance (
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

-- ============================================================================
-- RECRIAR TABELA STUDENT_COURSES
-- ============================================================================
CREATE TABLE student_courses (
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
INSERT INTO usuarios (nome, email, senha_hash, role, ativo) VALUES 
('Admin', 'admin@example.com', '$2b$10$3TNbU8TS0pN3XsJU7O9elu8KwSBB5pVqN4dFZKNtCdqVKYlvEXnzK', 'ADMIN', 1);

-- Alunos
INSERT INTO alunos (matricula, cpf, nome, email, telefone, data_nascimento, status) VALUES
('MAT001', '11111111111', 'Carlos Silva', 'carlos@example.com', '11987654325', '1999-01-10', 'Ativo'),
('MAT002', '22222222222', 'Julia Costa', 'julia@example.com', '11987654326', '2000-02-20', 'Ativo'),
('MAT003', '33333333333', 'Lucas Alves', 'lucas@example.com', '11987654327', '2001-03-30', 'Ativo'),
('MAT004', '44444444444', 'Fernanda Lima', 'fernanda@example.com', '11987654328', '2002-04-15', 'Ativo');

-- Matrículas
INSERT INTO matriculas (aluno_id, turma_id, data_matricula, status) VALUES
(1, 1, '2025-01-15', 'ATIVA'),
(2, 2, '2025-02-01', 'ATIVA'),
(3, 3, '2025-01-20', 'ATIVA'),
(4, 4, '2025-02-10', 'ATIVA');

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================
SELECT 'OK - Tabelas recriadas com sucesso!' as Status;
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_alunos FROM alunos;
SELECT COUNT(*) as total_matriculas FROM matriculas;
