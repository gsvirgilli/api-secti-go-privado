-- Diagnóstico SQL: Verificar sincronização de alunos e turmas
-- Execute este script no seu banco de dados

-- 1. Quantos alunos existem?
SELECT 'Total de Alunos' as info, COUNT(*) as quantidade FROM alunos;

-- 2. Quantos alunos têm turma_id preenchido?
SELECT 'Alunos com turma_id' as info, COUNT(*) as quantidade FROM alunos WHERE turma_id IS NOT NULL;

-- 3. Quantos alunos têm turma_id NULL?
SELECT 'Alunos sem turma_id (NULL)' as info, COUNT(*) as quantidade FROM alunos WHERE turma_id IS NULL;

-- 4. Listar todos os alunos com seus turma_id
SELECT '--- ALUNOS ---' as info;
SELECT id, nome, turma_id, status FROM alunos ORDER BY id;

-- 5. Quantas turmas existem?
SELECT '--- TURMAS ---' as info;
SELECT COUNT(*) as total FROM turmas;
SELECT id, nome FROM turmas ORDER BY id;

-- 6. Quantas matrículas existem?
SELECT '--- MATRÍCULAS ---' as info;
SELECT COUNT(*) as total FROM matriculas;

-- 7. Listar alunos agrupados por turma_id
SELECT '--- ALUNOS POR TURMA_ID ---' as info;
SELECT 
  COALESCE(turma_id, 'NULL') as turma_id, 
  COUNT(*) as quantidade_alunos 
FROM alunos 
GROUP BY turma_id 
ORDER BY turma_id;

-- 8. Verificar alunos cujo turma_id não existe na tabela turmas
SELECT '--- INCONSISTÊNCIAS ---' as info;
SELECT a.id, a.nome, a.turma_id 
FROM alunos a
LEFT JOIN turmas t ON a.turma_id = t.id
WHERE a.turma_id IS NOT NULL AND t.id IS NULL
ORDER BY a.id;
