-- Verificar usuários existentes
SELECT 'Usuários existentes:' as '';
SELECT id, nome, email, role FROM usuarios;

-- Inserir admin se não existir (senha: admin123 hasheada com bcrypt)
INSERT IGNORE INTO usuarios (nome, email, senha_hash, role, createdAt, updatedAt) 
VALUES (
  'Administrador',
  'admin@sukatech.com',
  '$2b$08$rHqmV.N5MYmI/nxGJJ5mAeE3KmG7vQH8nxQjGDKLPKCYvh3FIzGJW',
  'ADMIN',
  NOW(),
  NOW()
);

-- Mostrar resultado
SELECT 'Usuário admin criado/verificado:' as '';
SELECT id, nome, email, role FROM usuarios WHERE email = 'admin@sukatech.com';
