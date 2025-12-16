-- VERIFICAR O QUE FOI INSERIDO

SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_cursos FROM cursos;
SELECT COUNT(*) as total_turmas FROM turmas;
SELECT COUNT(*) as total_instrutores FROM instrutores;
SELECT COUNT(*) as total_alunos FROM alunos;
SELECT COUNT(*) as total_candidatos FROM candidatos;

-- Ver se tem dados em alunos
SELECT * FROM alunos LIMIT 5;

-- Ver se tem dados em candidatos
SELECT * FROM candidatos LIMIT 5;
