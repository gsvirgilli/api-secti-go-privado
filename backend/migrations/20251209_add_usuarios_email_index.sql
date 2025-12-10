-- Adicionar índice na coluna email da tabela usuarios para otimizar buscas de login
CREATE INDEX idx_usuarios_email ON usuarios(email);
