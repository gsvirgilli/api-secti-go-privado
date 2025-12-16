-- INSERIR CANDIDATOS

INSERT INTO candidatos (nome, cpf, email, telefone, data_nascimento, curso_id, turno, status) VALUES
('João da Silva', '12345678901', 'joao@example.com', '11987654321', '1995-05-15', 1, 'MANHA', 'PENDENTE'),
('Maria Santos', '98765432101', 'maria@example.com', '11987654322', '1996-08-20', 2, 'TARDE', 'PENDENTE'),
('Pedro Oliveira', '55566677788', 'pedro@example.com', '11987654323', '1997-03-10', 1, 'NOITE', 'APROVADO'),
('Ana Costa', '11122233344', 'ana@example.com', '11987654324', '1998-12-25', 3, 'MANHA', 'LISTA_ESPERA');

-- INSERIR ALUNOS

INSERT INTO alunos (matricula, cpf, nome, email, telefone, data_nascimento, status) VALUES
('MAT001', '11111111111', 'Carlos Silva', 'carlos@example.com', '11987654325', '1999-01-10', 'ativo'),
('MAT002', '22222222222', 'Julia Costa', 'julia@example.com', '11987654326', '2000-02-20', 'ativo'),
('MAT003', '33333333333', 'Lucas Alves', 'lucas@example.com', '11987654327', '2001-03-30', 'ativo'),
('MAT004', '44444444444', 'Fernanda Lima', 'fernanda@example.com', '11987654328', '2002-04-15', 'ativo');
