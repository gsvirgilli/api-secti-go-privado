-- SOLUÇÃO: Sincronizar alunos com turmas
-- Este script corrige alunos sem turma_id

-- Passo 1: Ver o estado atual
SELECT '=== ANTES DA SINCRONIZAÇÃO ===' as info;
SELECT COUNT(*) as 'Total de Alunos' FROM alunos;
SELECT COUNT(*) as 'Alunos com turma_id' FROM alunos WHERE turma_id IS NOT NULL;
SELECT COUNT(*) as 'Alunos sem turma_id' FROM alunos WHERE turma_id IS NULL;

-- Passo 2: Tentar sincronizar com a tabela de matriculas
-- Se os alunos estão em matriculas, copiar a turma_id de lá
UPDATE alunos a
SET turma_id = (
  SELECT id_turma 
  FROM matriculas m 
  WHERE m.id_aluno = a.id 
  LIMIT 1
)
WHERE turma_id IS NULL 
  AND EXISTS (
    SELECT 1 FROM matriculas m WHERE m.id_aluno = a.id
  );

-- Passo 3: Se ainda houver alunos sem turma, tentar usar candidatos
-- (se você armazenou a turma desejada lá)
UPDATE alunos a
SET turma_id = (
  SELECT turma_id 
  FROM candidatos c 
  WHERE c.id = a.candidato_id
  LIMIT 1
)
WHERE turma_id IS NULL 
  AND candidato_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM candidatos c 
    WHERE c.id = a.candidato_id AND c.turma_id IS NOT NULL
  );

-- Passo 4: Ver resultado
SELECT '=== DEPOIS DA SINCRONIZAÇÃO ===' as info;
SELECT COUNT(*) as 'Total de Alunos' FROM alunos;
SELECT COUNT(*) as 'Alunos com turma_id' FROM alunos WHERE turma_id IS NOT NULL;
SELECT COUNT(*) as 'Alunos sem turma_id' FROM alunos WHERE turma_id IS NULL;

-- Passo 5: Mostrar detalhes
SELECT '=== DETALHES DOS ALUNOS ===' as info;
SELECT id, nome, turma_id FROM alunos ORDER BY id;

-- Passo 6: Mostrar alunos por turma
SELECT '=== ALUNOS POR TURMA ===' as info;
SELECT t.id, t.nome, COUNT(a.id) as total_alunos
FROM turmas t
LEFT JOIN alunos a ON a.turma_id = t.id
GROUP BY t.id, t.nome
ORDER BY t.id;
