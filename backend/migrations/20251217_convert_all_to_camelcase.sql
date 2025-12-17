-- ============================================================================
-- Migration: Converter TODAS as colunas para camelCase
-- Data: 2025-12-17
-- ============================================================================

-- ============================================================================
-- TABELA: calendar_events
-- ============================================================================
ALTER TABLE calendar_events 
CHANGE COLUMN data_inicio dataInicio DATETIME NOT NULL COMMENT 'Data e hora de início do evento',
CHANGE COLUMN data_fim dataFim DATETIME NULL COMMENT 'Data e hora de término do evento',
CHANGE COLUMN turma_id turmaId INT NULL COMMENT 'ID da turma relacionada (opcional)',
CHANGE COLUMN curso_id cursoId INT NULL COMMENT 'ID do curso relacionado (opcional)';

-- Recriar índices
DROP INDEX idx_calendar_data_inicio ON calendar_events;
DROP INDEX idx_calendar_turma ON calendar_events;
DROP INDEX idx_calendar_curso ON calendar_events;
CREATE INDEX idx_calendar_data_inicio ON calendar_events (dataInicio);
CREATE INDEX idx_calendar_turma ON calendar_events (turmaId);
CREATE INDEX idx_calendar_curso ON calendar_events (cursoId);

-- ============================================================================
-- TABELA: presenca
-- ============================================================================
ALTER TABLE presenca 
CHANGE COLUMN id_aluno alunoId INT NOT NULL,
CHANGE COLUMN id_turma turmaId INT NOT NULL,
CHANGE COLUMN data_chamada dataChamada DATE NOT NULL;

-- Recriar índices
DROP INDEX unique_presenca ON presenca;
DROP INDEX idx_presenca_data ON presenca;
DROP INDEX idx_presenca_aluno ON presenca;
DROP INDEX idx_presenca_turma ON presenca;
CREATE UNIQUE INDEX unique_presenca ON presenca (alunoId, turmaId, dataChamada);
CREATE INDEX idx_presenca_data ON presenca (dataChamada);
CREATE INDEX idx_presenca_aluno ON presenca (alunoId);
CREATE INDEX idx_presenca_turma ON presenca (turmaId);

-- ============================================================================
-- TABELA: attendance
-- ============================================================================
ALTER TABLE attendance 
CHANGE COLUMN id_aluno alunoId INT NOT NULL,
CHANGE COLUMN id_turma turmaId INT NOT NULL,
CHANGE COLUMN data_chamada dataChamada DATE NOT NULL;

-- Recriar índices
DROP INDEX unique_attendance ON attendance;
DROP INDEX idx_attendance_data ON attendance;
DROP INDEX idx_attendance_aluno ON attendance;
DROP INDEX idx_attendance_turma ON attendance;
CREATE UNIQUE INDEX unique_attendance ON attendance (alunoId, turmaId, dataChamada);
CREATE INDEX idx_attendance_data ON attendance (dataChamada);
CREATE INDEX idx_attendance_aluno ON attendance (alunoId);
CREATE INDEX idx_attendance_turma ON attendance (turmaId);

-- ============================================================================
-- TABELA: matriculas (em migrations - tem duplicata em create-all-tables)
-- ============================================================================
ALTER TABLE matriculas 
CHANGE COLUMN id_aluno alunoId INT NOT NULL,
CHANGE COLUMN id_turma turmaId INT NOT NULL,
CHANGE COLUMN data_matricula dataMatricula DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Recriar índices
DROP INDEX unique_aluno_turma ON matriculas;
DROP INDEX idx_matricula_data ON matriculas;
CREATE UNIQUE INDEX unique_aluno_turma ON matriculas (alunoId, turmaId);
CREATE INDEX idx_matricula_data ON matriculas (dataMatricula);

-- ============================================================================
-- TABELA: student_courses
-- ============================================================================
ALTER TABLE student_courses 
CHANGE COLUMN student_id studentId INT NOT NULL,
CHANGE COLUMN course_id courseId INT NOT NULL,
CHANGE COLUMN turma_id turmaId INT,
CHANGE COLUMN data_inicio dataInicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CHANGE COLUMN data_conclusao dataConclusao DATETIME NULL,
CHANGE COLUMN motivo_desistencia motivoDesistencia VARCHAR(255) NULL;

-- Recriar índices
DROP INDEX unique_student_course ON student_courses;
DROP INDEX idx_student_id ON student_courses;
DROP INDEX idx_course_id ON student_courses;
CREATE UNIQUE INDEX unique_student_course ON student_courses (studentId, courseId);
CREATE INDEX idx_student_id ON student_courses (studentId);
CREATE INDEX idx_course_id ON student_courses (courseId);

-- ============================================================================
-- Atualizar Foreign Keys (se necessário)
-- ============================================================================
-- Os nomes de colunas já foram atualizados, as constraints funcionarão automaticamente
