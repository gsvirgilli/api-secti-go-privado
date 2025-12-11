-- Migração para adicionar índices de performance
-- Data: 2025-12-11

-- Índices para tabela CURSOS (courses)
ALTER TABLE cursos ADD INDEX idx_cursos_nome (nome);
ALTER TABLE cursos ADD INDEX idx_cursos_status (status);
ALTER TABLE cursos ADD INDEX idx_cursos_carga_horaria (carga_horaria);

-- Índices para tabela TURMAS (classes)
ALTER TABLE turmas ADD INDEX idx_turmas_nome (nome);
ALTER TABLE turmas ADD INDEX idx_turmas_status (status);
ALTER TABLE turmas ADD INDEX idx_turmas_turno (turno);
ALTER TABLE turmas ADD INDEX idx_turmas_id_curso (id_curso);
ALTER TABLE turmas ADD INDEX idx_turmas_data_inicio (data_inicio);

-- Índices para tabela ALUNOS (students)
ALTER TABLE alunos ADD INDEX idx_alunos_nome (nome);
ALTER TABLE alunos ADD INDEX idx_alunos_email (email);
ALTER TABLE alunos ADD INDEX idx_alunos_status (status);
ALTER TABLE alunos ADD INDEX idx_alunos_turma_id (turma_id);
ALTER TABLE alunos ADD INDEX idx_alunos_matricula (matricula);

-- Índices para tabela MATRÍCULAS (enrollments)
ALTER TABLE matriculas ADD INDEX idx_matriculas_id_aluno (id_aluno);
ALTER TABLE matriculas ADD INDEX idx_matriculas_id_turma (id_turma);
ALTER TABLE matriculas ADD INDEX idx_matriculas_status (status);
ALTER TABLE matriculas ADD INDEX idx_matriculas_data_inscricao (data_inscricao);

-- Índices para tabela INSTRUTORES (instructors)
ALTER TABLE instrutores ADD INDEX idx_instrutores_nome (nome);
ALTER TABLE instrutores ADD INDEX idx_instrutores_email (email);
ALTER TABLE instrutores ADD INDEX idx_instrutores_status (status);

-- Índices para tabela PRESENÇA (attendance)
ALTER TABLE presenca ADD INDEX idx_presenca_id_aluno (id_aluno);
ALTER TABLE presenca ADD INDEX idx_presenca_id_turma (id_turma);
ALTER TABLE presenca ADD INDEX idx_presenca_data (data);
ALTER TABLE presenca ADD INDEX idx_presenca_id_usuario (id_usuario);

-- Índices para tabela USUARIOS (users)
ALTER TABLE usuarios ADD INDEX idx_usuarios_email (email);
ALTER TABLE usuarios ADD INDEX idx_usuarios_role (role);

-- Índices para tabela CANDIDATOS (candidates)
ALTER TABLE candidatos ADD INDEX idx_candidatos_status (status);
ALTER TABLE candidatos ADD INDEX idx_candidatos_email (email);
ALTER TABLE candidatos ADD INDEX idx_candidatos_data_criacao (data_criacao);

-- Índices de compound para queries comuns
ALTER TABLE matriculas ADD INDEX idx_matriculas_turma_status (id_turma, status);
ALTER TABLE turmas ADD INDEX idx_turmas_curso_status (id_curso, status);
ALTER TABLE presenca ADD INDEX idx_presenca_turma_aluno (id_turma, id_aluno);
ALTER TABLE alunos ADD INDEX idx_alunos_turma_status (turma_id, status);
