-- ============================================================================
-- CRIAR AS TABELAS FALTANTES
-- ============================================================================

-- ============================================================================
-- TABELA AUDIT_LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  tabela VARCHAR(255) NOT NULL,
  operacao VARCHAR(50) NOT NULL,
  registro_id INT,
  dados_anteriores JSON,
  dados_novos JSON,
  descricao VARCHAR(500),
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_tabela (tabela),
  INDEX idx_operacao (operacao),
  INDEX idx_usuario (usuario_id),
  INDEX idx_criacao (created_at)
);

-- ============================================================================
-- TABELA PASSWORD_RESET_TOKENS
-- ============================================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  usado BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_usuario (usuario_id),
  INDEX idx_expira (expires_at)
);

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================
SELECT 'OK - Tabelas faltantes criadas!' as Status;
SHOW TABLES;
