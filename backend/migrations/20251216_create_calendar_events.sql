-- Migration: Create calendar_events table
-- Date: 2025-12-16

CREATE TABLE IF NOT EXISTS `calendar_events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(200) NOT NULL COMMENT 'Título do evento',
  `descricao` TEXT NULL COMMENT 'Descrição detalhada do evento',
  `data_inicio` DATETIME NOT NULL COMMENT 'Data e hora de início do evento',
  `data_fim` DATETIME NULL COMMENT 'Data e hora de término do evento',
  `tipo` ENUM('AULA', 'PROVA', 'ENTREGA', 'FERIADO', 'EVENTO', 'INSCRICAO', 'FORMATURAS') NOT NULL DEFAULT 'EVENTO' COMMENT 'Tipo de evento no calendário',
  `status` ENUM('PLANEJADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO') NOT NULL DEFAULT 'PLANEJADO' COMMENT 'Status do evento',
  `turma_id` INT NULL COMMENT 'ID da turma relacionada (opcional)',
  `curso_id` INT NULL COMMENT 'ID do curso relacionado (opcional)',
  `cor` VARCHAR(7) NULL DEFAULT '#3B82F6' COMMENT 'Cor do evento em formato hexadecimal',
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_calendar_data_inicio` (`data_inicio`),
  INDEX `idx_calendar_tipo` (`tipo`),
  INDEX `idx_calendar_turma` (`turma_id`),
  INDEX `idx_calendar_curso` (`curso_id`),
  CONSTRAINT `fk_calendar_turma` FOREIGN KEY (`turma_id`) REFERENCES `turmas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_calendar_curso` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Eventos do calendário académico';
