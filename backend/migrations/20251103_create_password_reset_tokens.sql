-- Migration: Criar tabela de tokens de recuperação de senha
-- Data: 2025-11-03

CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `token` VARCHAR(64) NOT NULL UNIQUE,
  `expires_at` DATETIME NOT NULL,
  `used` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `idx_token` (`token`),
  INDEX `idx_usuario_id` (`usuario_id`),
  INDEX `idx_expires_at` (`expires_at`),
  
  CONSTRAINT `fk_password_reset_usuario`
    FOREIGN KEY (`usuario_id`) 
    REFERENCES `usuarios`(`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
