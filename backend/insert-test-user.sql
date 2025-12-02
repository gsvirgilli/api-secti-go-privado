-- Script para criar usuário de teste no Aiven MySQL
-- Use este script no console web do Aiven (defaultdb)

INSERT INTO usuarios (nome, email, senha_hash, role, createdAt, updatedAt) VALUES 
('Usuário Teste', 'teste@example.com', '$2b$10$RNoM5x2pA6wVhoFi2ox4Te7etuB1KAKR3cikdgGzFhyyGGt87Y0US', 'ADMIN', NOW(), NOW());

-- Credenciais para teste:
-- Email: teste@example.com
-- Senha: Teste123!
-- Role: ADMIN

-- Verificar se foi criado:
-- SELECT * FROM usuarios WHERE email = 'teste@example.com';
