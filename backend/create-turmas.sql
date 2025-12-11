-- Criar turmas para os alunos

-- Primeiro, verificar se já existem turmas
SELECT 'Turmas existentes:' as info;
SELECT id, nome FROM turmas;

-- Se não existir nenhuma turma, criar algumas
-- Assumindo que os alunos devem estar em uma turma de um curso

-- 1. Verificar cursos
SELECT 'Cursos existentes:' as info;
SELECT id, nome FROM cursos LIMIT 5;

-- 2. Criar turmas (ajuste o id_curso conforme necessário)
INSERT INTO turmas (nome, turno, data_inicio, data_fim, id_curso, vagas, status, createdAt, updatedAt)
VALUES 
('Turma A - Manhã', 'MANHA', '2025-01-01', '2025-06-30', 1, 30, 'ATIVA', NOW(), NOW()),
('Turma B - Tarde', 'TARDE', '2025-01-01', '2025-06-30', 1, 30, 'ATIVA', NOW(), NOW()),
('Turma C - Noite', 'NOITE', '2025-01-01', '2025-06-30', 1, 30, 'ATIVA', NOW(), NOW())
ON DUPLICATE KEY UPDATE status = status;

-- 3. Verificar turmas criadas
SELECT 'Turmas após criação:' as info;
SELECT id, nome, turno, vagas FROM turmas;

-- 4. Atualizar alunos com turma_id (adicionar todos à primeira turma)
UPDATE alunos 
SET turma_id = 1 
WHERE turma_id IS NULL;

-- 5. Verificar resultado final
SELECT 'Alunos agora com turma_id:' as info;
SELECT id, nome, turma_id FROM alunos;

SELECT 'Resumo final:' as info;
SELECT t.id, t.nome, COUNT(a.id) as total_alunos
FROM turmas t
LEFT JOIN alunos a ON a.turma_id = t.id
GROUP BY t.id, t.nome;
