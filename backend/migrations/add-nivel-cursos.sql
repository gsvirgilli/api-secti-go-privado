-- Adiciona coluna nivel na tabela cursos para indicar nível do curso
ALTER TABLE cursos
ADD COLUMN nivel ENUM('INICIANTE', 'INTERMEDIARIO', 'AVANCADO')
NOT NULL DEFAULT 'INTERMEDIARIO'
AFTER descricao;

-- Atualiza registros existentes para valor padrão caso NULL
UPDATE cursos SET nivel = 'INTERMEDIARIO' WHERE nivel IS NULL;

-- Índice para consultas por nível (se necessário)
CREATE INDEX idx_cursos_nivel ON cursos(nivel);
