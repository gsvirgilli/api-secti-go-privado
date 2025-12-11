-- Verificar estado dos dados
SELECT 'ALUNOS COM TURMA_ID NULL' as titulo;
SELECT id, nome, turma_id FROM alunos WHERE turma_id IS NULL;

SELECT 'ALUNOS COM TURMA_ID NOT NULL' as titulo;
SELECT id, nome, turma_id FROM alunos WHERE turma_id IS NOT NULL;

SELECT 'TODAS AS TURMAS' as titulo;
SELECT id, nome, vagas FROM turmas;

SELECT 'CANDIDATOS' as titulo;
SELECT id, nome, status, id_turma_desejada, turma_id FROM candidatos;
