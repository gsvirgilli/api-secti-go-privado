-- Diagnóstico rápido de alunos e turmas
-- Execute essas queries no seu banco Render para entender a situação

-- 1. Verificar total de alunos
SELECT COUNT(*) as total_alunos FROM alunos;

-- 2. Ver alunos com turma_id preenchido
SELECT COUNT(*) as com_turma FROM alunos WHERE turma_id IS NOT NULL;

-- 3. Ver alunos SEM turma_id
SELECT COUNT(*) as sem_turma FROM alunos WHERE turma_id IS NULL;

-- 4. Listar todos os alunos com suas turmas
SELECT 
  a.id,
  a.nome,
  a.matricula,
  a.turma_id,
  t.nome as turma_nome
FROM alunos a
LEFT JOIN turmas t ON a.turma_id = t.id
ORDER BY a.id;

-- 5. Ver turmas e quantos alunos têm em cada
SELECT 
  t.id,
  t.nome,
  COUNT(a.id) as qtd_alunos
FROM turmas t
LEFT JOIN alunos a ON t.id = a.turma_id
GROUP BY t.id, t.nome
ORDER BY t.id;

-- 6. Ver se existe tabela matriculas e dados nela
SELECT COUNT(*) as total_matriculas FROM matriculas;

-- 7. Se houver matrículas, listar as primeiras
SELECT * FROM matriculas LIMIT 10;

-- AÇÃO: Se alunos têm turma_id NULL, você pode vincular com:
-- UPDATE alunos SET turma_id = (ID_DA_TURMA) WHERE id IN (1,2,3,4,5,6);
