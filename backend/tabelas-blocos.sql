-- BLOCO 1: cursos
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

-- BLOCO 2: turmas
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

-- BLOCO 3: instrutores
CREATE TABLE instrutores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255),
  email VARCHAR(255),
  cpf VARCHAR(11),
  especialidade VARCHAR(255),
  telefone VARCHAR(20),
  ativo INT,
  createdAt DATETIME,
  updatedAt DATETIME
);

-- BLOCO 4: instrutor_turma
CREATE TABLE instrutor_turma (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_instrutor INT,
  id_turma INT,
  createdAt DATETIME,
  updatedAt DATETIME
);

-- BLOCO 5: candidatos
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
  status VARCHAR(50),
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
  menor_idade INT,
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

-- BLOCO 6: alunos
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

-- BLOCO 7: matriculas
CREATE TABLE matriculas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT,
  turma_id INT,
  data_matricula DATE,
  status VARCHAR(50),
  createdAt DATETIME,
  updatedAt DATETIME
);

-- BLOCO 8: presencas
CREATE TABLE presencas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT,
  turma_id INT,
  data_aula DATE,
  presente INT,
  observacoes VARCHAR(500),
  createdAt DATETIME,
  updatedAt DATETIME
);
