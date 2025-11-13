-- Script para popular matrículas dos alunos existentes que não têm matrícula ou têm formato incorreto

-- Criar variável para o ano atual
SET @year = YEAR(CURDATE());

-- Resetar contador
SET @counter = 0;

-- Popular/corrigir matrículas para todos os alunos
UPDATE alunos
SET matricula = CONCAT(@year, LPAD(@counter := @counter + 1, 4, '0'))
WHERE id > 0
ORDER BY id ASC;

-- Mostrar resultado
SELECT 
  CONCAT('Atualizadas ', COUNT(*), ' matrículas') AS resultado
FROM alunos 
WHERE matricula IS NOT NULL;

-- Listar alunos com suas matrículas
SELECT id, matricula, nome, status
FROM alunos
ORDER BY id;
