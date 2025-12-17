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
  avatar_url VARCHAR(255),
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
  cpf VARCHAR(11) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  endereco VARCHAR(255),
  data_nascimento DATE,
  especialidade VARCHAR(255),
  experiencia TEXT,
  status VARCHAR(50),
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
  
  -- Turmas desejadas
  id_turma_desejada INT,
  turma_id INT,
  
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
  FOREIGN KEY (id_turma_desejada) REFERENCES turmas(id) ON DELETE SET NULL,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL,
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
  INDEX idx_alunos_turmaId (turma_id)
);

-- ============================================================================
-- 8. TABELA DE MATRÍCULAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS matriculas (
  aluno_id INT NOT NULL,
  turma_id INT NOT NULL,
  status ENUM('ativo', 'trancado', 'concluido', 'cancelado') NOT NULL DEFAULT 'ativo',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (aluno_id, turma_id),
  FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
  INDEX idx_matriculas_status (status)
);

-- ============================================================================
-- 9. TABELA DE CURSOS DOS ALUNOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS student_courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  turma_id INT,
  status ENUM('Ativo', 'Concluído', 'Desistente') NOT NULL DEFAULT 'Ativo',
  data_inicio DATE NOT NULL,
  data_conclusao DATE,
  motivo_desistencia VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES cursos(id) ON DELETE CASCADE,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL,
  UNIQUE KEY unique_student_course (student_id, course_id),
  INDEX idx_student_courses_status (status),
  INDEX idx_student_courses_student (student_id)
);

-- ============================================================================
-- 10. TABELA DE EVENTOS DO CALENDÁRIO
-- ============================================================================
CREATE TABLE IF NOT EXISTS calendar_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  tipo ENUM('AULA', 'PROVA', 'ENTREGA', 'FERIADO', 'EVENTO', 'INSCRICAO', 'FORMATURAS') NOT NULL DEFAULT 'EVENTO',
  status ENUM('PLANEJADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO') NOT NULL DEFAULT 'PLANEJADO',
  turma_id INT,
  curso_id INT,
  cor VARCHAR(7) DEFAULT '#3B82F6',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
  FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
  INDEX idx_calendar_events_data_inicio (data_inicio),
  INDEX idx_calendar_events_tipo (tipo),
  INDEX idx_calendar_events_status (status)
);

-- ============================================================================
-- 11. TABELA DE PRESENÇA/FREQUÊNCIA (NOVA ESTRUTURA)
-- ============================================================================
CREATE TABLE IF NOT EXISTS attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_aluno INT NOT NULL,
  id_turma INT NOT NULL,
  id_usuario INT,
  data_chamada DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PRESENTE',
  motivo_justificacao TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_aluno) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (id_turma) REFERENCES turmas(id) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_attendance_aluno (id_aluno),
  INDEX idx_attendance_turma (id_turma),
  INDEX idx_attendance_data (data_chamada),
  INDEX idx_attendance_status (status)
);

-- ============================================================================
-- 12. TABELA DE PRESENÇA/FREQUÊNCIA (LEGADO)
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
-- 13. TABELA DE LOGS DE AUDITORIA
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
-- 14. TABELA DE TOKENS DE RESET DE SENHA
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
-- 15. TABELA DE NOTIFICAÇÕES
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT NOT NULL,
  tipo ENUM('ALUNO', 'TURMA', 'INSTRUTOR', 'CALENDARIO', 'CANDIDATO') NOT NULL DEFAULT 'ALUNO',
  icone VARCHAR(50),
  lido BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_notifications_lido (lido),
  INDEX idx_notifications_tipo (tipo),
  INDEX idx_notifications_data (createdAt)
);

-- ============================================================================
-- 16. INSERTAR DADOS DE EXEMPLO
-- ============================================================================

-- Usuário ADMIN
INSERT IGNORE INTO usuarios (nome, email, senha_hash, role, createdAt, updatedAt)
VALUES (
  'Admin Sistema',
  'admin@example.com',
  '$2b$10$96wkrPF5sJfs69FmuZy.terpWLpVuI1KWC5sVyOrZJvNbiHh9hpa.',
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
INSERT IGNORE INTO instrutores (nome, email, cpf, especialidade, telefone, endereco, data_nascimento, experiencia, status, ativo, createdAt, updatedAt)
VALUES
  ('Carlos Silva', 'carlos@example.com', '12345678901', 'Web Development', '11999999999', 'Rua das Flores, 100, São Paulo', '1985-05-10', '10 anos de experiência em desenvolvimento web', 'ATIVO', TRUE, NOW(), NOW()),
  ('Maria Santos', 'maria@example.com', '98765432101', 'Banco de Dados', '11988888888', 'Av. Paulista, 1000, São Paulo', '1988-08-22', '12 anos de experiência em banco de dados', 'ATIVO', TRUE, NOW(), NOW()),
  ('João Oliveira', 'joao@example.com', '55566677788', 'Python Development', '11987654321', 'Rua da Paz, 250, São Paulo', '1990-03-15', '8 anos de experiência em Python', 'ATIVO', TRUE, NOW(), NOW()),
  ('Ana Costa', 'ana.costa@example.com', '11122233344', 'Mobile Development', '11987654322', 'Rua das Acácias, 500, São Paulo', '1987-12-05', '9 anos de experiência em mobile', 'ATIVO', TRUE, NOW(), NOW()),
  ('Roberto Mendes', 'roberto.mendes@example.com', '44455566601', 'DevOps e Cloud', '11987654329', 'Rua Central, 750, São Paulo', '1986-07-20', '11 anos de experiência em DevOps', 'ATIVO', TRUE, NOW(), NOW()),
  ('Carla Ferreira', 'carla.ferreira@example.com', '77788899901', 'Frontend Development', '11987654330', 'Rua das Flores, 300, São Paulo', '1992-01-30', '7 anos de experiência em Frontend', 'ATIVO', TRUE, NOW(), NOW()),
  ('Lucas Souza', 'lucas.souza@example.com', '33344455601', 'Backend Development', '11987654331', 'Av. Brasil, 1500, São Paulo', '1989-09-12', '10 anos de experiência em Backend', 'ATIVO', TRUE, NOW(), NOW()),
  ('Fernanda Lima', 'fernanda.lima@example.com', '66677788901', 'UX/UI Design', '11987654332', 'Rua do Comércio, 200, São Paulo', '1991-04-08', '6 anos de experiência em Design', 'ATIVO', TRUE, NOW(), NOW());

-- Associar instrutores às turmas
INSERT IGNORE INTO instrutor_turma (id_instrutor, id_turma, createdAt, updatedAt)
VALUES
  (1, 1, NOW(), NOW()),
  (1, 2, NOW(), NOW()),
  (2, 3, NOW(), NOW()),
  (3, 4, NOW(), NOW()),
  (4, 5, NOW(), NOW());

-- Candidatos (Processo Seletivo)
INSERT IGNORE INTO candidatos (nome, cpf, email, telefone, data_nascimento, curso_id, turno, status, rg, sexo, deficiencia, 
  cep, rua, numero, complemento, bairro, cidade, estado, raca_cor, renda_mensal, pessoas_renda, tipo_residencia, 
  goianas_ciencia, menor_idade, createdAt, updatedAt)
VALUES
  ('Alexandre Pereira', '45678901234', 'alexandre.pereira@candidate.com', '11999111111', '2003-05-12', 1, 'MANHA', 'PENDENTE', 
    '1234567', 'MASCULINO', 'NAO', '01310100', 'Avenida Paulista', '1900', 'Apto 101', 'Bela Vista', 'São Paulo', 'SP', 
    'PARDO', 'ATE_1_SM', 4, 'ALUGADA', 'NAO', FALSE, NOW(), NOW()),
    
  ('Beatriz Ferreira', '56789012345', 'beatriz.ferreira@candidate.com', '11999222222', '2004-08-22', 2, 'TARDE', 'PENDENTE', 
    '2345678', 'FEMININO', 'NAO', '01321000', 'Rua Augusta', '500', 'Apto 202', 'Centro', 'São Paulo', 'SP', 
    'BRANCO', '1_A_2_SALARIOS', 3, 'PROPRIA_QUITADA', 'SIM', FALSE, NOW(), NOW()),
    
  ('Cláudio Santos', '67890123456', 'claudio.santos@candidate.com', '11999333333', '2005-02-03', 1, 'NOITE', 'REPROVADO', 
    '3456789', 'MASCULINO', 'AUDITIVA', '01311200', 'Rua Oscar Freire', '300', 'Apto 303', 'Cerqueira César', 'São Paulo', 'SP', 
    'NEGRO', '2_A_3_SALARIOS', 2, 'ALUGADA', 'NAO', FALSE, NOW(), NOW()),
    
  ('Daniela Gomes', '78901234567', 'daniela.gomes@candidate.com', '11999444444', '2002-11-15', 3, 'MANHA', 'LISTA_ESPERA', 
    '4567890', 'FEMININO', 'NAO', '01405000', 'Avenida Brigadeiro Faria Lima', '2000', 'Sala 401', 'Pinheiros', 'São Paulo', 'SP', 
    'AMARELO', 'ATE_MEIO_SM', 5, 'CEDIDA', 'SIM', FALSE, NOW(), NOW()),
    
  ('Everton Ribeiro', '89012345678', 'everton.ribeiro@candidate.com', '11999555555', '2003-07-28', 4, 'TARDE', 'PENDENTE', 
    '5678901', 'MASCULINO', 'NAO', '01509001', 'Avenida Paulista', '1200', 'Bloco A', 'Paraíso', 'São Paulo', 'SP', 
    'PARDO', '1_A_2_SALARIOS', 4, 'PROPRIA_FINANCIADA', 'NAO', FALSE, NOW(), NOW()),
    
  ('Fernanda Rocha', '90123456789', 'fernanda.rocha@candidate.com', '11999666666', '2004-01-10', 2, 'MANHA', 'PENDENTE', 
    '6789012', 'FEMININO', 'VISUAL', '02124010', 'Rua Vergueiro', '800', 'Apto 50', 'Liberdade', 'São Paulo', 'SP', 
    'BRANCO', 'SEM_RENDA', 3, 'ALUGADA', 'NAO', FALSE, NOW(), NOW()),
    
  ('Gustavo Martins', '01234567890', 'gustavo.martins@candidate.com', '11999777777', '2005-04-19', 5, 'NOITE', 'PENDENTE', 
    '7890123', 'MASCULINO', 'FISICA', '03102700', 'Avenida Brasil', '2500', 'Apto 1501', 'Saúde', 'São Paulo', 'SP', 
    'INDIGENA', '3_A_4_SALARIOS', 2, 'PROPRIA_QUITADA', 'SIM', FALSE, NOW(), NOW()),
    
  ('Helene Oliveira', '12345609876', 'helene.oliveira@candidate.com', '11999888888', '2003-09-05', 1, 'TARDE', 'PENDENTE', 
    '8901234', 'FEMININO', 'NAO', '04000000', 'Avenida Imigrantes', '1500', 'Apto 2301', 'Ipiranga', 'São Paulo', 'SP', 
    'PARDO', 'ATE_1_SM', 6, 'CEDIDA', 'NAO', FALSE, NOW(), NOW());

-- Alunos
INSERT IGNORE INTO alunos (matricula, cpf, nome, email, telefone, data_nascimento, endereco, turma_id, status, createdAt, updatedAt)
VALUES
  ('MAT2025001', '12345678900', 'João Silva', 'joao.silva@example.com', '11999999999', '2005-03-15', 'Rua A, 123, São Paulo', 1, 'ativo', NOW(), NOW()),
  ('MAT2025002', '98765432100', 'Maria Santos', 'maria.santos@example.com', '11988888888', '2004-07-22', 'Rua B, 456, São Paulo', 1, 'ativo', NOW(), NOW()),
  ('MAT2025003', '55566677700', 'Pedro Oliveira', 'pedro.oliveira@example.com', '11987654321', '2006-01-10', 'Rua C, 789, São Paulo', 2, 'ativo', NOW(), NOW()),
  ('MAT2025004', '11122233300', 'Ana Costa', 'ana.costa@example.com', '11987654322', '2005-11-05', 'Rua D, 321, São Paulo', 3, 'ativo', NOW(), NOW()),
  ('MAT2025005', '44455566600', 'Carlos Mendes', 'carlos.mendes@example.com', '11987654323', '2004-05-30', 'Rua E, 654, São Paulo', 1, 'ativo', NOW(), NOW()),
  ('MAT2025006', '77788899900', 'Fernanda Lima', 'fernanda.lima@example.com', '11987654324', '2005-09-12', 'Rua F, 987, São Paulo', 2, 'trancado', NOW(), NOW()),
  ('MAT2025007', '33344455500', 'Bruno Costa', 'bruno.costa@example.com', '11987654325', '2006-02-28', 'Rua G, 147, São Paulo', 3, 'ativo', NOW(), NOW()),
  ('MAT2025008', '66677788800', 'Juliana Martins', 'juliana.martins@example.com', '11987654326', '2005-08-14', 'Rua H, 258, São Paulo', 1, 'ativo', NOW(), NOW()),
  ('MAT2025009', '99900011100', 'Leonardo Rocha', 'leonardo.rocha@example.com', '11987654327', '2004-12-01', 'Rua I, 369, São Paulo', 2, 'ativo', NOW(), NOW()),
  ('MAT2025010', '22233344400', 'Beatriz Gomes', 'beatriz.gomes@example.com', '11987654328', '2005-06-19', 'Rua J, 741, São Paulo', 3, 'ativo', NOW(), NOW());

-- ============================================================================
-- 15. ÍNDICES ADICIONAIS PARA PERFORMANCE
-- ============================================================================
ALTER TABLE usuarios ADD INDEX idx_usuarios_ativo (ativo);
ALTER TABLE cursos ADD INDEX idx_cursos_nivel (nivel);
ALTER TABLE turmas ADD INDEX idx_turmas_data_inicio (data_inicio);
ALTER TABLE alunos ADD INDEX idx_alunos_status (status);

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
COMMIT;
