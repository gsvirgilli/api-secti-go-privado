-- Criar tabela de relacionamento entre alunos e cursos
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

-- Adicionar coluna para rastrear qual é o curso "principal" do aluno
ALTER TABLE alunos ADD COLUMN status_reason VARCHAR(255) NULL DEFAULT NULL COMMENT 'Motivo do status (ex: desistência)';
