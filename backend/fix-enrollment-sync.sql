-- Script de CORREÇÃO: Sincronizar alunos com turmas baseado em matriculas
-- ⚠️ EXECUTE COM CUIDADO! Faça backup antes!

-- Opção 1: Se os alunos estão em matriculas mas turma_id é NULL
-- Copiar turma_id da tabela matriculas para alunos
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

-- Verificar resultado
SELECT 'Após atualização - Alunos com turma_id:' as info, COUNT(*) as quantidade 
FROM alunos 
WHERE turma_id IS NOT NULL;

-- Se ainda houver problema, pode ser que matriculas também esteja vazio
-- Nesse caso, você precisa:
-- 1. Verificar qual turma cada aluno deve pertencer
-- 2. Popular manualmente ou via script específico

-- Opção 2: Populr matriculas baseado em turma_id dos alunos
-- (se preferir usar a tabela matriculas em vez de turma_id direto)
INSERT INTO matriculas (id_aluno, id_turma, status, createdAt, updatedAt)
SELECT 
  a.id,
  a.turma_id,
  'ativo' as status,
  NOW() as createdAt,
  NOW() as updatedAt
FROM alunos a
WHERE a.turma_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM matriculas m 
    WHERE m.id_aluno = a.id AND m.id_turma = a.turma_id
  )
ON DUPLICATE KEY UPDATE status = 'ativo';
