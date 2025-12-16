-- Adicionar índice para otimizar consultas de cursos por status
ALTER TABLE `cursos` ADD INDEX `idx_status` (`status`);
