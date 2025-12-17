-- Migração: Criar tabela de Matrículas (relacionamento entre alunos e turmas)
-- Data: 2025-12-02

CREATE TABLE IF NOT EXISTS matriculas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alunoId INT NOT NULL,
  turmaId INT NOT NULL,
  dataMatricula DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'ATIVA',
  observacoes TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY unique_aluno_turma (alunoId, turmaId),
  FOREIGN KEY (alunoId) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (turmaId) REFERENCES turmas(id) ON DELETE CASCADE,
  INDEX idx_matricula_status (status),
  INDEX idx_matricula_data (dataMatricula)
);
