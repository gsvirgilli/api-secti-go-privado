-- INSERIR DADOS NAS TABELAS

INSERT INTO usuarios (nome, email, senha_hash, role, ativo) VALUES 
('Admin', 'admin@example.com', '$2b$10$3TNbU8TS0pN3XsJU7O9elu8KwSBB5pVqN4dFZKNtCdqVKYlvEXnzK', 'ADMIN', 1);

INSERT INTO cursos (nome, descricao, carga_horaria, nivel, status) VALUES
('Desenvolvimento Web', 'Web com React', 120, 'INTERMEDIARIO', 'ATIVO'),
('Banco de Dados', 'SQL e NoSQL', 80, 'BASICO', 'ATIVO'),
('Python Avançado', 'Python com Django', 100, 'AVANCADO', 'ATIVO'),
('Mobile iOS', 'iOS com Swift', 90, 'INTERMEDIARIO', 'ATIVO'),
('DevOps', 'Docker e Cloud', 110, 'AVANCADO', 'ATIVO');

INSERT INTO turmas (nome, descricao, data_inicio, data_fim, turno, id_curso, vagas, status) VALUES
('Web A', 'Turma web 2025', '2025-01-15', '2025-06-15', 'MANHA', 1, 30, 'PLANEJADA'),
('Web B', 'Turma web 2025', '2025-02-01', '2025-07-01', 'TARDE', 1, 30, 'PLANEJADA'),
('BD A', 'Turma BD 2025', '2025-01-20', '2025-04-20', 'NOITE', 2, 25, 'PLANEJADA'),
('Python A', 'Turma Python 2025', '2025-02-10', '2025-07-10', 'MANHA', 3, 20, 'PLANEJADA'),
('DevOps A', 'Turma DevOps 2025', '2025-03-01', '2025-08-01', 'TARDE', 5, 15, 'PLANEJADA');

INSERT INTO instrutores (nome, email, cpf, especialidade, telefone, ativo) VALUES
('Carlos Silva', 'carlos@example.com', '12345678901', 'Web', '11999999999', 1),
('Maria Santos', 'maria@example.com', '98765432101', 'BD', '11988888888', 1),
('João Oliveira', 'joao@example.com', '55566677788', 'Python', '11987654321', 1),
('Ana Costa', 'ana@example.com', '11122233344', 'Mobile', '11987654322', 1);

INSERT INTO instrutor_turma (id_instrutor, id_turma) VALUES
(1, 1), (1, 2), (2, 3), (3, 4), (4, 5);
