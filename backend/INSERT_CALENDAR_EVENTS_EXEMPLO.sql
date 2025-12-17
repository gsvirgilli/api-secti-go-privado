-- ============================================================================
-- INSERIR EVENTOS DE EXEMPLO NO CALENDÁRIO
-- ============================================================================

-- Limpar eventos antigos (opcional - descomente se quiser)
-- DELETE FROM calendar_events;

-- Eventos de Aula
INSERT INTO calendar_events (titulo, descricao, data_inicio, data_fim, tipo, status, turma_id, cor) VALUES
('Aula de Introdução ao Python', 'Primeiro encontro da turma. Apresentação do curso e ambiente de desenvolvimento.', '2025-01-06', '2025-01-06', 'AULA', 'PLANEJADO', 1, '#3B82F6'),
('Aula Prática - Variáveis e Tipos', 'Exercícios práticos sobre variáveis, tipos de dados e operadores básicos.', '2025-01-08', '2025-01-08', 'AULA', 'PLANEJADO', 1, '#3B82F6'),
('Aula - Estruturas de Controle', 'Condicionais (if, else) e loops (for, while).', '2025-01-10', '2025-01-10', 'AULA', 'PLANEJADO', 1, '#3B82F6'),
('Aula - Funções em Python', 'Criação, chamada e escopo de funções. Parâmetros e retorno.', '2025-01-13', '2025-01-13', 'AULA', 'PLANEJADO', 1, '#3B82F6'),
('Aula - Tratamento de Exceções', 'Try, except, finally. Tratamento de erros em Python.', '2025-01-15', '2025-01-15', 'AULA', 'PLANEJADO', 1, '#3B82F6'),

-- Eventos de Prova
('Prova 1 - Conceitos Básicos', 'Avaliação sobre os primeiros tópicos do curso: variáveis, tipos e controle.', '2025-01-17', '2025-01-17', 'PROVA', 'PLANEJADO', 1, '#EF4444'),
('Prova 2 - Funções e Exceções', 'Avaliação sobre funções, escopos e tratamento de exceções.', '2025-02-07', '2025-02-07', 'PROVA', 'PLANEJADO', 1, '#EF4444'),
('Prova Final', 'Avaliação final do curso com questões práticas e teóricas.', '2025-02-28', '2025-02-28', 'PROVA', 'PLANEJADO', 1, '#EF4444'),

-- Eventos de Entrega
('Entrega do Projeto 1', 'Projeto inicial: Calculadora Simples em Python.', '2025-01-24', '2025-01-24', 'ENTREGA', 'PLANEJADO', 1, '#F59E0B'),
('Entrega do Projeto 2', 'Projeto intermediário: Sistema de Gerenciamento de Tarefas.', '2025-02-14', '2025-02-14', 'ENTREGA', 'PLANEJADO', 1, '#F59E0B'),
('Entrega do Projeto Final', 'Projeto final: Aplicação Web com Django.', '2025-03-07', '2025-03-07', 'ENTREGA', 'PLANEJADO', 1, '#F59E0B'),

-- Eventos - Feriado
('Feriado - Carnaval', 'Ponto facultativo - sem aulas.', '2025-02-04', '2025-02-04', 'FERIADO', 'PLANEJADO', NULL, '#10B981'),
('Feriado - Páscoa', 'Feriado prolongado.', '2025-04-20', '2025-04-20', 'FERIADO', 'PLANEJADO', NULL, '#10B981'),

-- Eventos - Inscrição
('Período de Inscrição - Banco de Dados', 'Inscrições abertas para o curso de Banco de Dados.', '2025-01-02', '2025-01-15', 'INSCRICAO', 'EM_ANDAMENTO', 2, '#8B5CF6'),
('Período de Inscrição - DevOps', 'Inscrições abertas para o curso de DevOps e Cloud.', '2025-01-05', '2025-01-20', 'INSCRICAO', 'PLANEJADO', 3, '#8B5CF6'),

-- Eventos - Formaturas
('Formatura - Turma Python 2024', 'Cerimônia de formatura da turma de Python.', '2025-03-15', '2025-03-15', 'FORMATURAS', 'PLANEJADO', 1, '#06B6D4'),

-- Eventos - Outros
('Workshop: Git e GitHub', 'Workshop prático sobre versionamento de código com Git.', '2025-01-25', '2025-01-25', 'EVENTO', 'PLANEJADO', NULL, '#EC4899'),
('Palestra: Mercado de Trabalho', 'Palestra com profissionais da área sobre oportunidades no mercado.', '2025-02-01', '2025-02-01', 'EVENTO', 'PLANEJADO', NULL, '#EC4899'),
('Hackathon Interno', 'Competição de desenvolvimento de soluções. Equipes e prêmios!', '2025-02-22', '2025-02-23', 'EVENTO', 'PLANEJADO', NULL, '#EC4899'),
('Reunião de Mentoria', 'Sessão de mentoria com instrutores. Respostas a dúvidas.', '2025-01-18', '2025-01-18', 'EVENTO', 'PLANEJADO', 1, '#A78BFA'),
('Aula de Reforço - Python Avançado', 'Aula extra para alunos que tiveram dificuldades.', '2025-01-20', '2025-01-20', 'EVENTO', 'PLANEJADO', 1, '#A78BFA');

-- ============================================================================
-- Verificar dados inseridos
-- ============================================================================
SELECT 'Eventos inseridos com sucesso!' as resultado;
SELECT COUNT(*) as total_eventos FROM calendar_events;
SELECT tipo, COUNT(*) as quantidade FROM calendar_events GROUP BY tipo;
