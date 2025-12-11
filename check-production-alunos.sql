-- ====================================================
-- SCRIPT DE DIAGNÓSTICO - Execute no Render MySQL
-- ====================================================

-- 1. CONTAR ALUNOS E VER DISTRIBUIÇÃO POR TURMA
SELECT 
  'TOTAL DE ALUNOS' as label,
  COUNT(*) as quantidade
FROM alunos
UNION ALL
SELECT 
  'COM TURMA_ID' as label,
  COUNT(*) as quantidade
FROM alunos 
WHERE turma_id IS NOT NULL
UNION ALL
SELECT 
  'SEM TURMA_ID' as label,
  COUNT(*) as quantidade
FROM alunos 
WHERE turma_id IS NULL;

-- 2. LISTAR TODOS OS 6 ALUNOS COM DETALHES
SELECT 
  a.id,
  a.nome,
  a.matricula,
  a.email,
  a.turma_id,
  IF(t.id IS NOT NULL, t.nome, '⚠️ SEM TURMA') as turma_nome,
  a.status,
  a.createdAt
FROM alunos a
LEFT JOIN turmas t ON a.turma_id = t.id
ORDER BY a.id;

-- 3. VER QUANTOS ALUNOS TEM POR TURMA
SELECT 
  t.id,
  t.nome as turma_nome,
  COUNT(a.id) as qtd_alunos,
  GROUP_CONCAT(a.nome SEPARATOR ', ') as nomes_alunos
FROM turmas t
LEFT JOIN alunos a ON t.id = a.turma_id
GROUP BY t.id, t.nome
ORDER BY t.id;

-- 4. SE HOUVER ALUNOS SEM TURMA, MOSTRAR SEUS IDS
SELECT 
  'ALUNOS SEM TURMA:' as info,
  GROUP_CONCAT(CONCAT('ID: ', id, ' (', nome, ')') SEPARATOR ' | ') as alunos
FROM alunos 
WHERE turma_id IS NULL;

-- 5. SE PRECISAR VINCULAR, USE ESTE COMANDO (EXEMPLO):
-- UPDATE alunos SET turma_id = 1 WHERE id IN (3, 4, 5, 6);
-- Mude os IDs e turma_id conforme necessário
