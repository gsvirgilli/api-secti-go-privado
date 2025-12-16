CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL COMMENT 'Título da notificação',
  descricao LONGTEXT NOT NULL COMMENT 'Descrição detalhada da notificação',
  tipo ENUM('ALUNO', 'TURMA', 'INSTRUTOR', 'CALENDARIO', 'CANDIDATO') NOT NULL DEFAULT 'ALUNO' COMMENT 'Tipo de notificação',
  icone VARCHAR(50) COMMENT 'Ícone da notificação',
  lido BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Se a notificação foi lida',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_notification_lido (lido),
  INDEX idx_notification_tipo (tipo),
  INDEX idx_notification_criacao (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
