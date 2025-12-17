-- ============================================================================
-- INSERIR EVENTOS NO CALENDÁRIO
-- ============================================================================

-- Aulas
INSERT IGNORE INTO calendar_events (titulo, descricao, data_inicio, data_fim, tipo, status, turma_id, curso_id, cor) VALUES
('Aula 1 - Web A', 'Introdução a HTML e CSS', '2025-01-15 08:00:00', '2025-01-15 10:00:00', 'AULA', 'PLANEJADO', 1, 1, '#3B82F6'),
('Aula 2 - Web A', 'JavaScript Básico', '2025-01-17 08:00:00', '2025-01-17 10:00:00', 'AULA', 'PLANEJADO', 1, 1, '#3B82F6'),
('Aula 1 - Web B', 'Introdução a HTML e CSS', '2025-02-01 14:00:00', '2025-02-01 16:00:00', 'AULA', 'PLANEJADO', 2, 1, '#3B82F6'),
('Aula 1 - BD A', 'SQL Fundamentos', '2025-01-20 20:00:00', '2025-01-20 22:00:00', 'AULA', 'PLANEJADO', 3, 2, '#3B82F6'),
('Aula 1 - Python A', 'Variáveis e Tipos', '2025-02-10 08:00:00', '2025-02-10 10:00:00', 'AULA', 'PLANEJADO', 4, 3, '#3B82F6');

-- Provas
INSERT IGNORE INTO calendar_events (titulo, descricao, data_inicio, data_fim, tipo, status, turma_id, curso_id, cor) VALUES
('Prova 1 - Web A', 'Avaliação de HTML, CSS e JavaScript', '2025-03-15 08:00:00', '2025-03-15 10:00:00', 'PROVA', 'PLANEJADO', 1, 1, '#EF4444'),
('Prova 1 - Web B', 'Avaliação de HTML, CSS e JavaScript', '2025-03-20 14:00:00', '2025-03-20 16:00:00', 'PROVA', 'PLANEJADO', 2, 1, '#EF4444'),
('Prova 1 - BD A', 'Avaliação de SQL e Modelagem', '2025-03-10 20:00:00', '2025-03-10 22:00:00', 'PROVA', 'PLANEJADO', 3, 2, '#EF4444'),
('Prova Final - Python A', 'Avaliação Final de Python', '2025-06-10 08:00:00', '2025-06-10 10:00:00', 'PROVA', 'PLANEJADO', 4, 3, '#EF4444');

-- Entregas
INSERT IGNORE INTO calendar_events (titulo, descricao, data_inicio, data_fim, tipo, status, turma_id, curso_id, cor) VALUES
('Entrega - Projeto Web A', 'Entregar projeto final de website', '2025-05-15 23:59:00', '2025-05-15 23:59:00', 'ENTREGA', 'PLANEJADO', 1, 1, '#F59E0B'),
('Entrega - Projeto Web B', 'Entregar projeto final de website', '2025-06-01 23:59:00', '2025-06-01 23:59:00', 'ENTREGA', 'PLANEJADO', 2, 1, '#F59E0B'),
('Entrega - Trabalho BD A', 'Entregar modelo de banco de dados', '2025-04-10 23:59:00', '2025-04-10 23:59:00', 'ENTREGA', 'PLANEJADO', 3, 2, '#F59E0B');

-- Feriados
INSERT IGNORE INTO calendar_events (titulo, descricao, data_inicio, data_fim, tipo, status, curso_id, cor) VALUES
('Carnaval', 'Feriado - Sem aulas', '2025-03-04 00:00:00', '2025-03-04 23:59:00', 'FERIADO', 'PLANEJADO', NULL, '#8B5CF6'),
('Sexta-feira Santa', 'Feriado - Sem aulas', '2025-04-18 00:00:00', '2025-04-18 23:59:00', 'FERIADO', 'PLANEJADO', NULL, '#8B5CF6'),
('Tiradentes', 'Feriado - Sem aulas', '2025-04-21 00:00:00', '2025-04-21 23:59:00', 'FERIADO', 'PLANEJADO', NULL, '#8B5CF6'),
('Dia do Trabalho', 'Feriado - Sem aulas', '2025-05-01 00:00:00', '2025-05-01 23:59:00', 'FERIADO', 'PLANEJADO', NULL, '#8B5CF6'),
('Corpus Christi', 'Feriado - Sem aulas', '2025-06-19 00:00:00', '2025-06-19 23:59:00', 'FERIADO', 'PLANEJADO', NULL, '#8B5CF6');

-- Período de Inscrição
INSERT IGNORE INTO calendar_events (titulo, descricao, data_inicio, data_fim, tipo, status, curso_id, cor) VALUES
('Período de Inscrição 2025', 'Inscrições abertas para todos os cursos', '2024-12-01 00:00:00', '2025-01-10 23:59:00', 'INSCRICAO', 'EM_ANDAMENTO', NULL, '#10B981');

-- Formaturas
INSERT IGNORE INTO calendar_events (titulo, descricao, data_inicio, data_fim, tipo, status, turma_id, curso_id, cor) VALUES
('Cerimônia de Formatura - Web A', 'Formatura da turma Web A', '2025-06-28 18:00:00', '2025-06-28 21:00:00', 'FORMATURAS', 'PLANEJADO', 1, 1, '#EC4899'),
('Cerimônia de Formatura - Web B', 'Formatura da turma Web B', '2025-07-05 18:00:00', '2025-07-05 21:00:00', 'FORMATURAS', 'PLANEJADO', 2, 1, '#EC4899');

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================
SELECT 'OK - Eventos de calendário inseridos!' as Status;
SELECT COUNT(*) as total_eventos FROM calendar_events;
SELECT tipo, COUNT(*) as quantidade FROM calendar_events GROUP BY tipo;
