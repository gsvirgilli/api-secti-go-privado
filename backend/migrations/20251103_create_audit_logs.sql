-- Migration: Criar tabela de logs de auditoria
-- Data: 2025-11-03

CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NULL,
  `acao` ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'APPROVE', 'REJECT') NOT NULL COMMENT 'Tipo de ação realizada',
  `entidade` VARCHAR(100) NOT NULL COMMENT 'Nome da entidade afetada (tabela/modelo)',
  `entidade_id` INT NULL COMMENT 'ID do registro afetado',
  `dados_anteriores` JSON NULL COMMENT 'Estado anterior do registro (para UPDATE/DELETE)',
  `dados_novos` JSON NULL COMMENT 'Estado novo do registro (para CREATE/UPDATE)',
  `ip` VARCHAR(45) NULL COMMENT 'Endereço IP do usuário',
  `user_agent` VARCHAR(500) NULL COMMENT 'User Agent do navegador',
  `descricao` TEXT NULL COMMENT 'Descrição adicional da ação',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  INDEX `idx_audit_usuario` (`usuario_id`),
  INDEX `idx_audit_entidade` (`entidade`, `entidade_id`),
  INDEX `idx_audit_acao` (`acao`),
  INDEX `idx_audit_created` (`createdAt`),
  
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
