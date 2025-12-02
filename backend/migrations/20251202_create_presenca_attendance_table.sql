-- Migração: Criar tabela de Presença/Attendance
-- Data: 2025-12-02

CREATE TABLE IF NOT EXISTS presenca (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_aluno INT NOT NULL,
  id_turma INT NOT NULL,
  data_chamada DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  observacoes TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY unique_presenca (id_aluno, id_turma, data_chamada),
  FOREIGN KEY (id_aluno) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (id_turma) REFERENCES turmas(id) ON DELETE CASCADE,
  INDEX idx_presenca_data (data_chamada),
  INDEX idx_presenca_status (status),
  INDEX idx_presenca_aluno (id_aluno),
  INDEX idx_presenca_turma (id_turma)
);

-- Alias para evitar conflito de nomes (presença é uma palavra reservada em alguns contextos)
CREATE TABLE IF NOT EXISTS attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_aluno INT NOT NULL,
  id_turma INT NOT NULL,
  data_chamada DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  observacoes TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY unique_attendance (id_aluno, id_turma, data_chamada),
  FOREIGN KEY (id_aluno) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (id_turma) REFERENCES turmas(id) ON DELETE CASCADE,
  INDEX idx_attendance_data (data_chamada),
  INDEX idx_attendance_status (status),
  INDEX idx_attendance_aluno (id_aluno),
  INDEX idx_attendance_turma (id_turma)
);
