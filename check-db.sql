-- Diagnóstico de matrículas
SELECT 'ALUNOS CADASTRADOS' as Info;
SELECT COUNT(*) as Total FROM alunos;

SELECT 'ALUNOS COM TURMA_ID' as Info;
SELECT nome, turma_id FROM alunos WHERE turma_id IS NOT NULL;

SELECT 'TURMAS CADASTRADAS' as Info;
SELECT id, nome FROM turmas LIMIT 10;

SELECT 'MATRÍCULAS NA TABELA MATRICULAS' as Info;
SELECT COUNT(*) as Total FROM matriculas;

SELECT 'DETALHES DAS MATRÍCULAS' as Info;
SELECT m.id_aluno, a.nome as aluno, m.id_turma, t.nome as turma, m.status 
FROM matriculas m
LEFT JOIN alunos a ON m.id_aluno = a.id
LEFT JOIN turmas t ON m.id_turma = t.id;
