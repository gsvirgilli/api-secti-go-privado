-- Migração: Criar tabela de Presença/Attendance
-- Data: 2025-12-02

CREATE TABLE IF NOT EXISTS presenca (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alunoId INT NOT NULL,
  turmaId INT NOT NULL,
  dataChamada DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  observacoes TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY unique_presenca (alunoId, turmaId, dataChamada),
  FOREIGN KEY (alunoId) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (turmaId) REFERENCES turmas(id) ON DELETE CASCADE,
  INDEX idx_presenca_data (dataChamada),
  INDEX idx_presenca_status (status),
  INDEX idx_presenca_aluno (alunoId),
  INDEX idx_presenca_turma (turmaId)
);

-- Alias para evitar conflito de nomes (presença é uma palavra reservada em alguns contextos)
CREATE TABLE IF NOT EXISTS attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alunoId INT NOT NULL,
  turmaId INT NOT NULL,
  dataChamada DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  observacoes TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY unique_attendance (alunoId, turmaId, dataChamada),
  FOREIGN KEY (alunoId) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (turmaId) REFERENCES turmas(id) ON DELETE CASCADE,
  INDEX idx_attendance_data (dataChamada),
  INDEX idx_attendance_status (status),
  INDEX idx_attendance_aluno (alunoId),
  INDEX idx_attendance_turma (turmaId)
);
