-- =====================================================
-- SCRIPT ADICIONAL: DADOS EXTRAS PARA TESTES
-- População expandida com mais registros variados
-- =====================================================

USE defaultdb;

-- =====================================================
-- ADICIONAR MAIS USUÁRIOS
-- =====================================================
INSERT INTO usuarios (nome, email, senha_hash, role, ativo) VALUES
('Gustavo Pereira', 'gustavo.pereira@secti.com', '$2b$10$YourHashedPasswordHere123456789012345678901234', 'ALUNO', 1),
('Camila Rocha', 'camila.rocha@secti.com', '$2b$10$YourHashedPasswordHere123456789012345678901234', 'ALUNO', 1),
('Diego Santos', 'diego.santos@secti.com', '$2b$10$YourHashedPasswordHere123456789012345678901234', 'ALUNO', 1),
('Fernanda Dias', 'fernanda.dias@secti.com', '$2b$10$YourHashedPasswordHere123456789012345678901234', 'ALUNO', 1),
('Felipe Martins', 'felipe.martins@secti.com', '$2b$10$YourHashedPasswordHere123456789012345678901234', 'INSTRUTOR', 1);

-- =====================================================
-- ADICIONAR MAIS INSTRUTORES
-- =====================================================
INSERT INTO instrutores (cpf, nome, email, telefone, endereco, data_nascimento, especialidade, experiencia, status) VALUES
('12345678905', 'Felipe Martins', 'felipe.martins@secti.com', '11987654323',
  'Rua K, 600 - São Paulo, SP', '1989-06-18', 'Git e DevOps', '9 anos em versionamento e CI/CD', 'ATIVO'),
('12345678906', 'Rachel Costa', 'rachel.costa@secti.com', '11987654324',
  'Rua L, 700 - São Paulo, SP', '1991-10-25', 'Segurança da Informação', '7 anos em segurança', 'ATIVO');

-- =====================================================
-- ADICIONAR MAIS CANDIDATOS
-- =====================================================
INSERT INTO candidatos (nome, email, cpf, telefone, data_nascimento, endereco, status, opcao_curso_1, opcao_curso_2) VALUES
('Marcelo Assis', 'marcelo.assis@email.com', '11122233350', '11999000007', '1993-05-08', 
  'Rua M, 700 - São Paulo', 'APROVADO', 4, 5),
('Sophia Gomes', 'sophia.gomes@email.com', '11122233351', '11999000008', '2000-03-22',
  'Rua N, 800 - São Paulo', 'APROVADO', 1, 2),
('Bruno Torres', 'bruno.torres@email.com', '11122233352', '11999000009', '1994-08-14',
  'Rua O, 900 - São Paulo', 'PENDENTE', 3, 4),
('Isabela Nunes', 'isabela.nunes@email.com', '11122233353', '11999000010', '1997-11-30',
  'Rua P, 1000 - São Paulo', 'PENDENTE', 5, 6);

-- =====================================================
-- ADICIONAR MAIS ALUNOS
-- =====================================================
INSERT INTO alunos (matricula, cpf, nome, email, telefone, data_nascimento, endereco, candidato_id, usuario_id, turma_id, status) VALUES
('MAT006', '11122233350', 'Marcelo Assis', 'marcelo.assis@secti.com', '11999000007',
  '1993-05-08', 'Rua M, 700 - São Paulo', 7, 11, 5, 'ativo'),
('MAT007', '11122233351', 'Sophia Gomes', 'sophia.gomes@secti.com', '11999000008',
  '2000-03-22', 'Rua N, 800 - São Paulo', 8, 12, 2, 'ativo'),
('MAT008', '11122233352', 'Bruno Torres', 'bruno.torres@secti.com', '11999000009',
  '1994-08-14', 'Rua O, 900 - São Paulo', NULL, 13, 3, 'ativo'),
('MAT009', '11122233353', 'Isabela Nunes', 'isabela.nunes@secti.com', '11999000010',
  '1997-11-30', 'Rua P, 1000 - São Paulo', NULL, 14, 4, 'ativo');

-- =====================================================
-- ADICIONAR MAIS MATRÍCULAS
-- =====================================================
INSERT INTO matriculas (id_aluno, id_turma, data_matricula, status) VALUES
(6, 5, NOW(), 'ATIVA'),
(7, 2, NOW(), 'ATIVA'),
(8, 3, '2025-01-25', 'ATIVA'),
(9, 4, '2025-02-15', 'ATIVA'),
(1, 3, '2025-01-22', 'ATIVA'),
(2, 2, NOW(), 'ATIVA');

-- =====================================================
-- ADICIONAR MAIS FREQUÊNCIAS
-- =====================================================
INSERT INTO presencas (id_aluno, id_turma, data_aula, presente) VALUES
(5, 2, '2025-02-01', 1),
(5, 2, '2025-02-03', 1),
(5, 2, '2025-02-05', 0),
(6, 5, '2025-03-01', 1),
(7, 2, '2025-02-01', 1),
(7, 2, '2025-02-03', 1),
(8, 3, '2025-01-25', 1),
(8, 3, '2025-01-27', 1),
(8, 3, '2025-01-29', 0),
(9, 4, '2025-02-15', 1);

-- =====================================================
-- ADICIONAR MAIS CURSOS DO ALUNO
-- =====================================================
INSERT INTO student_courses (student_id, course_id, turma_id, status, data_inicio) VALUES
(6, 4, 5, 'EM_ANDAMENTO', '2025-03-01'),
(7, 1, 2, 'EM_ANDAMENTO', '2025-02-01'),
(8, 2, 3, 'EM_ANDAMENTO', '2025-01-25'),
(9, 3, 4, 'EM_ANDAMENTO', '2025-02-15');

-- =====================================================
-- ADICIONAR MAIS EVENTOS
-- =====================================================
INSERT INTO calendar_events (titulo, descricao, data_evento, tipo, id_turma) VALUES
('Aula prática - Componentes', 'Aula prática sobre criação de componentes React', '2025-02-15', 'AULA', 1),
('Prova parcial - SQL', 'Primeira avaliação de SQL', '2025-02-28', 'AVALIACAO', 3),
('Mentoria - Python', 'Sessão de mentoria individual sobre Python', '2025-03-05', 'MENTORIA', 4),
('Sprint Planning', 'Planejamento do próximo sprint', '2025-02-20', 'REUNIAO', 5),
('Live Coding - DevOps', 'Sessão ao vivo de programação DevOps', '2025-04-15', 'WORKSHOP', 6);

-- =====================================================
-- ADICIONAR MAIS NOTIFICAÇÕES
-- =====================================================
INSERT INTO notifications (usuario_id, titulo, mensagem, lida, tipo) VALUES
(11, 'Material disponível', 'Novo material sobre Flutter foi publicado', 0, 'INFO'),
(12, 'Recordação de entrega', 'Sua entrega vence em 2 dias', 1, 'AVISO'),
(13, 'Dúvida respondida', 'Um instrutor respondeu sua dúvida no fórum', 0, 'INFO'),
(14, 'Felicidades!', 'Você alcançou 100% de frequência! Parabéns!', 0, 'SUCESSO'),
(8, 'Novo peer', 'Um novo colega se juntou à sua turma', 0, 'INFO');

-- =====================================================
-- ADICIONAR MAIS LOGS DE AUDITORIA
-- =====================================================
INSERT INTO audit_logs (usuario_id, entidade, acao, descricao, valores_anteriores, valores_novos, ip_address) VALUES
(1, 'cursos', 'INSERT', 'Novo curso: Git e Versionamento', NULL, 'Git e Versionamento', '127.0.0.1'),
(1, 'turmas', 'INSERT', 'Turma criada: Flutter - Turma A', NULL, 'Flutter - Turma A', '127.0.0.1'),
(2, 'presencas', 'INSERT', 'Presença registrada para aluno 6', NULL, 'Presente', '127.0.0.1'),
(1, 'candidatos', 'UPDATE', 'Candidato 7 aprovado', 'PENDENTE', 'APROVADO', '127.0.0.1'),
(1, 'candidatos', 'UPDATE', 'Candidato 8 aprovado', 'PENDENTE', 'APROVADO', '127.0.0.1'),
(3, 'alunos', 'UPDATE', 'Status do aluno 3 alterado', 'ativo', 'ativo', '127.0.0.1'),
(1, 'notificacoes', 'INSERT', 'Notificação enviada para aluno 11', NULL, 'Material disponível', '127.0.0.1'),
(1, 'presencas', 'BULK_INSERT', '10 registros de frequência adicionados', NULL, '10 registros', '127.0.0.1');

-- =====================================================
-- VERIFICAÇÃO FINAL ATUALIZADA
-- =====================================================
SELECT '✅ SCRIPT ADICIONAL CONCLUÍDO!' as Status;

SELECT '📊 CONTAGEM TOTAL DE REGISTROS:' as Resumo;
SELECT 
  (SELECT COUNT(*) FROM usuarios) as 'Total Usuários',
  (SELECT COUNT(*) FROM cursos) as 'Total Cursos',
  (SELECT COUNT(*) FROM turmas) as 'Total Turmas',
  (SELECT COUNT(*) FROM alunos) as 'Total Alunos',
  (SELECT COUNT(*) FROM instrutores) as 'Total Instrutores',
  (SELECT COUNT(*) FROM candidatos) as 'Total Candidatos',
  (SELECT COUNT(*) FROM matriculas) as 'Total Matrículas',
  (SELECT COUNT(*) FROM presencas) as 'Total Frequências',
  (SELECT COUNT(*) FROM calendar_events) as 'Total Eventos',
  (SELECT COUNT(*) FROM notifications) as 'Total Notificações',
  (SELECT COUNT(*) FROM audit_logs) as 'Total Logs';
