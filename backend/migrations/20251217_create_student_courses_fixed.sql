-- Criar tabela de relacionamento entre alunos e cursos
CREATE TABLE IF NOT EXISTS student_courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentId INT NOT NULL,
  courseId INT NOT NULL,
  turmaId INT,
  status ENUM('Ativo', 'Concluído', 'Desistente') NOT NULL DEFAULT 'Ativo',
  dataInicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dataConclusao DATETIME NULL,
  motivoDesistencia VARCHAR(255) NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (studentId) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (courseId) REFERENCES cursos(id) ON DELETE CASCADE,
  FOREIGN KEY (turmaId) REFERENCES turmas(id) ON DELETE SET NULL,
  
  UNIQUE KEY unique_student_course (studentId, courseId),
  INDEX idx_student_id (studentId),
  INDEX idx_course_id (courseId),
  INDEX idx_status (status)
);
