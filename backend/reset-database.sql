-- ============================================================================
-- Script para limpar TODAS as tabelas do banco de dados
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Drop all tables
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS presencas;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS student_courses;
DROP TABLE IF EXISTS calendar_events;
DROP TABLE IF EXISTS matriculas;
DROP TABLE IF EXISTS instrutor_turma;
DROP TABLE IF EXISTS alunos;
DROP TABLE IF EXISTS instrutores;
DROP TABLE IF EXISTS turmas;
DROP TABLE IF EXISTS candidatos;
DROP TABLE IF EXISTS cursos;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- Confirmação
-- ============================================================================
-- Todas as tabelas foram removidas com sucesso.
