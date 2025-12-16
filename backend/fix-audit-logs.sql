-- Adicionar coluna user_agent se não existir
ALTER TABLE audit_logs ADD COLUMN user_agent VARCHAR(500) NULL COMMENT 'User Agent do navegador' AFTER ip;

-- Verificar se funciona
SHOW COLUMNS FROM audit_logs;
