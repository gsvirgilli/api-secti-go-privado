-- =====================================================
-- SCRIPT COMPLETO DE CRIAÇÃO E POPULAÇÃO DO BANCO DE DADOS
-- Sistema SECTI - Gestão de Cursos e Alunos
-- Data: 2025-12-17
-- =====================================================

-- Usar o banco de dados
USE defaultdb;

-- =====================================================
-- 1. LIMPAR DADOS EXISTENTES (OPCIONAL)
-- Descomente apenas se quiser limpar tudo
-- =====================================================
/*
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE SequelizeMeta;
TRUNCATE TABLE alunos;
TRUNCATE TABLE audit_logs;
TRUNCATE TABLE calendar_events;
TRUNCATE TABLE candidatos;
TRUNCATE TABLE cursos;
TRUNCATE TABLE instrutor_turma;
TRUNCATE TABLE instrutores;
TRUNCATE TABLE matriculas;
TRUNCATE TABLE notifications;
TRUNCATE TABLE password_reset_tokens;
TRUNCATE TABLE presencas;
TRUNCATE TABLE student_courses;
TRUNCATE TABLE turmas;
TRUNCATE TABLE usuarios;
SET FOREIGN_KEY_CHECKS = 1;
*/

-- =====================================================
-- 2. POPULAÇÃO: USUÁRIOS
-- =====================================================
INSERT INTO usuarios (id, nome, email, senha_hash, role, ativo, avatar_url) VALUES
(1, 'Administrador Sistema', 'admin@secti.com', 
  '$2b$10$YourHashedPasswordHere123456789012345678901234', 
  'ADMIN', 1, NULL),
(2, 'Carlos Silva', 'carlos@secti.com',
  '$2b$10$YourHashedPasswordHere123456789012345678901234',
  'INSTRUTOR', 1, NULL),
(3, 'Maria Santos', 'maria@secti.com',
  '$2b$10$YourHashedPasswordHere123456789012345678901234',
  'INSTRUTOR', 1, NULL),
(4, 'João Oliveira', 'joao@secti.com',
  '$2b$10$YourHashedPasswordHere123456789012345678901234',
  'INSTRUTOR', 1, NULL),
(5, 'Ana Costa', 'ana@secti.com',
  '$2b$10$YourHashedPasswordHere123456789012345678901234',
  'INSTRUTOR', 1, NULL),
(6, 'Pedro Silva', 'pedro.silva@secti.com',
  '$2b$10$YourHashedPasswordHere123456789012345678901234',
  'ALUNO', 1, NULL),
(7, 'Julia Santos', 'julia.santos@secti.com',
  '$2b$10$YourHashedPasswordHere123456789012345678901234',
  'ALUNO', 1, NULL),
(8, 'Fernando Costa', 'fernando.costa@secti.com',
  '$2b$10$YourHashedPasswordHere123456789012345678901234',
  'ALUNO', 1, NULL),
(9, 'Lucia Martins', 'lucia.martins@secti.com',
  '$2b$10$YourHashedPasswordHere123456789012345678901234',
  'ALUNO', 1, NULL),
(10, 'Ricardo Gomes', 'ricardo.gomes@secti.com',
  '$2b$10$YourHashedPasswordHere123456789012345678901234',
  'ALUNO', 1, NULL);

-- =====================================================
-- 3. POPULAÇÃO: CURSOS
-- =====================================================
INSERT INTO cursos (id, nome, descricao, carga_horaria, nivel, status) VALUES
(1, 'Desenvolvimento Web com React',
  'Curso completo de desenvolvimento front-end com React.js, HTML5, CSS3 e JavaScript moderno',
  120, 'INTERMEDIARIO', 'ATIVO'),
(2, 'Banco de Dados SQL e NoSQL',
  'Aprenda SQL, MySQL, MongoDB e otimização de queries para aplicações escaláveis',
  80, 'INTERMEDIARIO', 'ATIVO'),
(3, 'Python Avançado',
  'Domínio completo de Python, APIs REST, frameworks Django e FastAPI',
  100, 'AVANCADO', 'ATIVO'),
(4, 'Mobile com Flutter',
  'Desenvolvimento de aplicações mobile iOS e Android com Flutter e Dart',
  90, 'INTERMEDIARIO', 'ATIVO'),
(5, 'DevOps e Cloud Computing',
  'Docker, Kubernetes, CI/CD, AWS, Azure e infraestrutura em nuvem',
  110, 'AVANCADO', 'ATIVO'),
(6, 'Git e Versionamento',
  'Controle de versão com Git, GitHub, GitLab e fluxos de trabalho',
  40, 'INICIANTE', 'ATIVO'),
(7, 'Segurança da Informação',
  'Boas práticas de segurança, criptografia e proteção de dados',
  60, 'AVANCADO', 'PLANEJADO');

-- =====================================================
-- 4. POPULAÇÃO: TURMAS
-- =====================================================
INSERT INTO turmas (id, nome, turno, vagas, status, data_inicio, data_fim, id_curso) VALUES
(1, 'React - Turma A', 'MANHA', 30, 'ATIVA', '2025-01-15', '2025-05-15', 1),
(2, 'React - Turma B', 'TARDE', 30, 'ATIVA', '2025-02-01', '2025-06-01', 1),
(3, 'SQL e NoSQL - Turma A', 'NOITE', 25, 'ATIVA', '2025-01-20', '2025-04-20', 2),
(4, 'Python - Turma A', 'MANHA', 25, 'ATIVA', '2025-02-10', '2025-06-10', 3),
(5, 'Flutter - Turma A', 'TARDE', 20, 'ATIVA', '2025-03-01', '2025-07-01', 4),
(6, 'DevOps - Turma A', 'NOITE', 20, 'PLANEJADA', '2025-04-01', '2025-08-01', 5),
(7, 'Git - Turma A', 'MANHA', 40, 'ATIVA', '2025-01-10', '2025-02-20', 6);

-- =====================================================
-- 5. POPULAÇÃO: INSTRUTORES
-- =====================================================
INSERT INTO instrutores (id, cpf, nome, email, telefone, endereco, data_nascimento, especialidade, experiencia, status) VALUES
(1, '12345678901', 'Carlos Silva', 'carlos@secti.com', '11999999999', 
  'Rua A, 123 - São Paulo, SP', '1985-05-10', 'React e JavaScript', '15 anos em desenvolvimento web', 'ATIVO'),
(2, '12345678902', 'Maria Santos', 'maria@secti.com', '11988888888',
  'Rua B, 456 - São Paulo, SP', '1988-08-22', 'Banco de Dados', '12 anos em dados e SQL', 'ATIVO'),
(3, '12345678903', 'João Oliveira', 'joao@secti.com', '11987654321',
  'Rua C, 789 - São Paulo, SP', '1990-03-15', 'Python', '10 anos em Python e DevOps', 'ATIVO'),
(4, '12345678904', 'Ana Costa', 'ana@secti.com', '11987654322',
  'Rua D, 321 - São Paulo, SP', '1992-11-08', 'Flutter Mobile', '8 anos em mobile development', 'ATIVO');

-- =====================================================
-- 6. POPULAÇÃO: RELAÇÃO INSTRUTOR ↔ TURMA
-- =====================================================
INSERT INTO instrutor_turma (id_instrutor, id_turma) VALUES
(1, 1),  -- Carlos Silva - React Turma A
(1, 2),  -- Carlos Silva - React Turma B
(2, 3),  -- Maria Santos - SQL e NoSQL
(3, 4),  -- João Oliveira - Python
(4, 5),  -- Ana Costa - Flutter
(3, 6),  -- João Oliveira - DevOps
(1, 7);  -- Carlos Silva - Git

-- =====================================================
-- 7. POPULAÇÃO: CANDIDATOS
-- =====================================================
INSERT INTO candidatos (id, nome, email, cpf, telefone, data_nascimento, endereco, status, opcao_curso_1, opcao_curso_2, createdAt, updatedAt) VALUES
(1, 'Pedro Silva', 'pedro.silva@email.com', '11122233344', '11999000001', '1995-04-12', 
  'Rua E, 100 - São Paulo', 'APROVADO', 1, 2, NOW(), NOW()),
(2, 'Julia Santos', 'julia.santos@email.com', '11122233345', '11999000002', '1998-07-23',
  'Rua F, 200 - São Paulo', 'APROVADO', 1, 3, NOW(), NOW()),
(3, 'Fernando Costa', 'fernando.costa@email.com', '11122233346', '11999000003', '1996-02-14',
  'Rua G, 300 - São Paulo', 'APROVADO', 2, 3, NOW(), NOW()),
(4, 'Lucia Martins', 'lucia.martins@email.com', '11122233347', '11999000004', '1994-09-30',
  'Rua H, 400 - São Paulo', 'PENDENTE', 1, 4, NOW(), NOW()),
(5, 'Ricardo Gomes', 'ricardo.gomes@email.com', '11122233348', '11999000005', '1997-12-05',
  'Rua I, 500 - São Paulo', 'PENDENTE', 3, 5, NOW(), NOW()),
(6, 'Beatriz Lima', 'beatriz.lima@email.com', '11122233349', '11999000006', '1999-01-18',
  'Rua J, 600 - São Paulo', 'REJEITADO', 2, 4, NOW(), NOW());

-- =====================================================
-- 8. POPULAÇÃO: ALUNOS
-- =====================================================
INSERT INTO alunos (id, matricula, cpf, nome, email, telefone, data_nascimento, endereco, candidato_id, usuario_id, turma_id, status) VALUES
(1, 'MAT001', '11122233344', 'Pedro Silva', 'pedro.silva@secti.com', '11999000001', 
  '1995-04-12', 'Rua E, 100 - São Paulo', 1, 6, 1, 'ativo'),
(2, 'MAT002', '11122233345', 'Julia Santos', 'julia.santos@secti.com', '11999000002',
  '1998-07-23', 'Rua F, 200 - São Paulo', 2, 7, 1, 'ativo'),
(3, 'MAT003', '11122233346', 'Fernando Costa', 'fernando.costa@secti.com', '11999000003',
  '1996-02-14', 'Rua G, 300 - São Paulo', 3, 8, 3, 'ativo'),
(4, 'MAT004', '11122233347', 'Lucia Martins', 'lucia.martins@secti.com', '11999000004',
  '1994-09-30', 'Rua H, 400 - São Paulo', 4, 9, 4, 'ativo'),
(5, 'MAT005', '11122233348', 'Ricardo Gomes', 'ricardo.gomes@secti.com', '11999000005',
  '1997-12-05', 'Rua I, 500 - São Paulo', 5, 10, 2, 'ativo');

-- =====================================================
-- 9. POPULAÇÃO: MATRÍCULAS
-- =====================================================
INSERT INTO matriculas (id_aluno, id_turma, data_matricula, status) VALUES
(1, 1, NOW(), 'ATIVA'),
(2, 1, NOW(), 'ATIVA'),
(3, 3, NOW(), 'ATIVA'),
(4, 4, NOW(), 'ATIVA'),
(5, 2, NOW(), 'ATIVA'),
(1, 2, NOW(), 'ATIVA'),
(2, 3, NOW(), 'ATIVA');

-- =====================================================
-- 10. POPULAÇÃO: PRESENÇA/FREQUÊNCIA
-- =====================================================
INSERT INTO presencas (id_aluno, id_turma, data_aula, presente) VALUES
(1, 1, '2025-01-15', 1),
(1, 1, '2025-01-17', 1),
(1, 1, '2025-01-20', 0),
(2, 1, '2025-01-15', 1),
(2, 1, '2025-01-17', 1),
(2, 1, '2025-01-20', 1),
(3, 3, '2025-01-20', 1),
(3, 3, '2025-01-22', 1),
(4, 4, '2025-02-10', 1),
(4, 4, '2025-02-12', 0);

-- =====================================================
-- 11. POPULAÇÃO: CURSOS DO ALUNO (Histórico)
-- =====================================================
INSERT INTO student_courses (student_id, course_id, turma_id, status, data_inicio, data_conclusao) VALUES
(1, 1, 1, 'EM_ANDAMENTO', '2025-01-15', NULL),
(1, 1, 2, 'EM_ANDAMENTO', '2025-02-01', NULL),
(2, 1, 1, 'EM_ANDAMENTO', '2025-01-15', NULL),
(3, 2, 3, 'EM_ANDAMENTO', '2025-01-20', NULL),
(4, 3, 4, 'EM_ANDAMENTO', '2025-02-10', NULL),
(5, 1, 2, 'EM_ANDAMENTO', '2025-02-01', NULL);

-- =====================================================
-- 12. POPULAÇÃO: EVENTOS DE CALENDÁRIO
-- =====================================================
INSERT INTO calendar_events (id, titulo, descricao, data_evento, tipo, id_turma, createdAt, updatedAt) VALUES
(1, 'Início - React Turma A', 'Primeira aula do curso de React', '2025-01-15', 'AULA', 1, NOW(), NOW()),
(2, 'Prova - SQL Turma A', 'Avaliação de SQL básico', '2025-03-20', 'AVALIACAO', 3, NOW(), NOW()),
(3, 'Formatura - React Turma A', 'Cerimônia de conclusão', '2025-05-15', 'EVENTO', 1, NOW(), NOW()),
(4, 'Workshop - DevOps', 'Workshop de DevOps com especialistas', '2025-04-10', 'WORKSHOP', 6, NOW(), NOW()),
(5, 'Revisão - Python', 'Revisão antes da prova final', '2025-05-20', 'AULA', 4, NOW(), NOW()),
(6, 'Projeto Final - Flutter', 'Apresentação do projeto final', '2025-07-01', 'EVENTO', 5, NOW(), NOW());

-- =====================================================
-- 13. POPULAÇÃO: NOTIFICAÇÕES
-- =====================================================
INSERT INTO notifications (id, usuario_id, titulo, mensagem, lida, tipo, createdAt, updatedAt) VALUES
(1, 6, 'Bem-vindo ao SECTI', 'Você foi inscrito com sucesso no curso de React', 0, 'INFO', NOW(), NOW()),
(2, 7, 'Nova aula disponível', 'A aula sobre Componentes React já está disponível', 0, 'INFO', NOW(), NOW()),
(3, 8, 'Avaliação pendente', 'Você ainda não enviou a avaliação do módulo 2', 1, 'AVISO', NOW(), NOW()),
(4, 9, 'Frequência baixa', 'Sua frequência está abaixo de 75%', 0, 'ALERTA', NOW(), NOW()),
(5, 10, 'Certificado disponível', 'Seu certificado já pode ser baixado', 0, 'SUCESSO', NOW(), NOW());

-- =====================================================
-- 14. POPULAÇÃO: LOGS DE AUDITORIA
-- =====================================================
INSERT INTO audit_logs (usuario_id, entidade, acao, descricao, valores_anteriores, valores_novos, ip_address, user_agent) VALUES
(1, 'usuarios', 'INSERT', 'Criação de novo usuário', NULL, 'admin@secti.com', '127.0.0.1', 'Mozilla/5.0'),
(1, 'cursos', 'INSERT', 'Novo curso criado', NULL, 'Desenvolvimento Web com React', '127.0.0.1', 'Mozilla/5.0'),
(1, 'turmas', 'INSERT', 'Nova turma criada', NULL, 'React - Turma A', '127.0.0.1', 'Mozilla/5.0'),
(1, 'alunos', 'INSERT', 'Novo aluno matriculado', NULL, 'MAT001 - Pedro Silva', '127.0.0.1', 'Mozilla/5.0'),
(2, 'presencas', 'INSERT', 'Frequência registrada', NULL, 'Aluno 1 - Presente', '127.0.0.1', 'Mozilla/5.0'),
(6, 'profile', 'UPDATE', 'Perfil do aluno atualizado', NULL, 'telefone', '127.0.0.1', 'Mozilla/5.0'),
(1, 'candidatos', 'UPDATE', 'Candidato aprovado', 'PENDENTE', 'APROVADO', '127.0.0.1', 'Mozilla/5.0'),
(3, 'alunos', 'INSERT', 'Novo aluno matriculado', NULL, 'MAT003 - Fernando Costa', '127.0.0.1', 'Mozilla/5.0');

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
SELECT '✅ SCRIPT DE POPULAÇÃO CONCLUÍDO COM SUCESSO!' as Status;

SELECT 
  'Resumo de dados inseridos:' as Informacao,
  CONCAT('Usuários: ', (SELECT COUNT(*) FROM usuarios)) as Total,
  CONCAT('Cursos: ', (SELECT COUNT(*) FROM cursos)) as Total2,
  CONCAT('Turmas: ', (SELECT COUNT(*) FROM turmas)) as Total3,
  CONCAT('Alunos: ', (SELECT COUNT(*) FROM alunos)) as Total4,
  CONCAT('Instrutores: ', (SELECT COUNT(*) FROM instrutores)) as Total5,
  CONCAT('Candidatos: ', (SELECT COUNT(*) FROM candidatos)) as Total6,
  CONCAT('Matrículas: ', (SELECT COUNT(*) FROM matriculas)) as Total7,
  CONCAT('Frequências: ', (SELECT COUNT(*) FROM presencas)) as Total8;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
