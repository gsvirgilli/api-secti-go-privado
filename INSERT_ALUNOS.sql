-- ============================================================================
-- INSERIR ALUNOS
-- ============================================================================

-- Alunos para Turma Web A (turma_id = 1)
INSERT IGNORE INTO alunos (matricula, cpf, nome, email, telefone, data_nascimento, endereco, turma_id, status, created_at, updated_at)
VALUES
('2025001', '12345678901', 'João Silva', 'joao.silva@example.com', '11999999001', '2000-05-10', 'Rua A, 100, São Paulo, SP', 1, 'ativo', NOW(), NOW()),
('2025002', '12345678902', 'Maria Santos', 'maria.santos@example.com', '11999999002', '2001-03-15', 'Rua B, 200, São Paulo, SP', 1, 'ativo', NOW(), NOW()),
('2025003', '12345678903', 'Carlos Oliveira', 'carlos.oliveira@example.com', '11999999003', '2000-08-22', 'Rua C, 300, São Paulo, SP', 1, 'ativo', NOW(), NOW()),
('2025004', '12345678904', 'Ana Costa', 'ana.costa@example.com', '11999999004', '2001-01-30', 'Rua D, 400, São Paulo, SP', 1, 'ativo', NOW(), NOW()),
('2025005', '12345678905', 'Pedro Ferreira', 'pedro.ferreira@example.com', '11999999005', '2000-11-05', 'Rua E, 500, São Paulo, SP', 1, 'ativo', NOW(), NOW()),
('2025006', '12345678906', 'Juliana Rocha', 'juliana.rocha@example.com', '11999999006', '2001-07-18', 'Rua F, 600, São Paulo, SP', 1, 'trancado', NOW(), NOW());

-- Alunos para Turma Web B (turma_id = 2)
INSERT IGNORE INTO alunos (matricula, cpf, nome, email, telefone, data_nascimento, endereco, turma_id, status, created_at, updated_at)
VALUES
('2025007', '12345678907', 'Felipe Gomes', 'felipe.gomes@example.com', '11999999007', '2000-02-14', 'Rua G, 700, São Paulo, SP', 2, 'ativo', NOW(), NOW()),
('2025008', '12345678908', 'Beatriz Lima', 'beatriz.lima@example.com', '11999999008', '2001-06-25', 'Rua H, 800, São Paulo, SP', 2, 'ativo', NOW(), NOW()),
('2025009', '12345678909', 'Lucas Martins', 'lucas.martins@example.com', '11999999009', '2000-09-03', 'Rua I, 900, São Paulo, SP', 2, 'ativo', NOW(), NOW()),
('2025010', '12345678910', 'Fernanda Alves', 'fernanda.alves@example.com', '11999999010', '2001-04-12', 'Rua J, 1000, São Paulo, SP', 2, 'ativo', NOW(), NOW()),
('2025011', '12345678911', 'Rafael Santos', 'rafael.santos@example.com', '11999999011', '2000-12-28', 'Rua K, 1100, São Paulo, SP', 2, 'ativo', NOW(), NOW());

-- Alunos para Turma BD A (turma_id = 3)
INSERT IGNORE INTO alunos (matricula, cpf, nome, email, telefone, data_nascimento, endereco, turma_id, status, created_at, updated_at)
VALUES
('2025012', '12345678912', 'Isabela Torres', 'isabela.torres@example.com', '11999999012', '2000-10-08', 'Rua L, 1200, São Paulo, SP', 3, 'ativo', NOW(), NOW()),
('2025013', '12345678913', 'Gabriel Ribeiro', 'gabriel.ribeiro@example.com', '11999999013', '2001-02-20', 'Rua M, 1300, São Paulo, SP', 3, 'ativo', NOW(), NOW()),
('2025014', '12345678914', 'Camila Moura', 'camila.moura@example.com', '11999999014', '2000-07-11', 'Rua N, 1400, São Paulo, SP', 3, 'ativo', NOW(), NOW()),
('2025015', '12345678915', 'Thiago Mendes', 'thiago.mendes@example.com', '11999999015', '2001-05-17', 'Rua O, 1500, São Paulo, SP', 3, 'ativo', NOW(), NOW());

-- Alunos para Turma Python A (turma_id = 4)
INSERT IGNORE INTO alunos (matricula, cpf, nome, email, telefone, data_nascimento, endereco, turma_id, status, created_at, updated_at)
VALUES
('2025016', '12345678916', 'Vanessa Silva', 'vanessa.silva@example.com', '11999999016', '2000-04-23', 'Rua P, 1600, São Paulo, SP', 4, 'ativo', NOW(), NOW()),
('2025017', '12345678917', 'Diego Costa', 'diego.costa@example.com', '11999999017', '2001-08-09', 'Rua Q, 1700, São Paulo, SP', 4, 'ativo', NOW(), NOW()),
('2025018', '12345678918', 'Amanda Souza', 'amanda.souza@example.com', '11999999018', '2000-06-16', 'Rua R, 1800, São Paulo, SP', 4, 'ativo', NOW(), NOW()),
('2025019', '12345678919', 'Marcelo Pires', 'marcelo.pires@example.com', '11999999019', '2001-09-02', 'Rua S, 1900, São Paulo, SP', 4, 'ativo', NOW(), NOW());

-- Alunos para Turma DevOps A (turma_id = 5)
INSERT IGNORE INTO alunos (matricula, cpf, nome, email, telefone, data_nascimento, endereco, turma_id, status, created_at, updated_at)
VALUES
('2025020', '12345678920', 'Sophia Ferreira', 'sophia.ferreira@example.com', '11999999020', '2000-01-27', 'Rua T, 2000, São Paulo, SP', 5, 'ativo', NOW(), NOW()),
('2025021', '12345678921', 'Arthur Lima', 'arthur.lima@example.com', '11999999021', '2001-10-14', 'Rua U, 2100, São Paulo, SP', 5, 'ativo', NOW(), NOW()),
('2025022', '12345678922', 'Carolina Gomes', 'carolina.gomes@example.com', '11999999022', '2000-03-31', 'Rua V, 2200, São Paulo, SP', 5, 'ativo', NOW(), NOW()),
('2025023', '12345678923', 'Mateus Oliveira', 'mateus.oliveira@example.com', '11999999023', '2001-11-21', 'Rua W, 2300, São Paulo, SP', 5, 'concluido', NOW(), NOW());

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================
SELECT 'OK - Alunos inseridos com sucesso!' as Status;
SELECT COUNT(*) as total_alunos FROM alunos;
SELECT turma_id, COUNT(*) as quantidade FROM alunos GROUP BY turma_id;
SELECT status, COUNT(*) as quantidade FROM alunos GROUP BY status;
