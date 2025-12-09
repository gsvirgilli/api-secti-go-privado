-- Migração: Adicionar campos faltantes na tabela de Presença/Attendance
-- Data: 2025-12-08
-- Descrição: Adiciona campos para motivo de justificação e rastreamento do usuário que registrou

-- Adicionar campos na tabela presenca
ALTER TABLE presenca ADD motivo_justificacao TEXT COMMENT 'Motivo da justificação';
ALTER TABLE presenca ADD id_usuario INT COMMENT 'ID do usuário que registrou a frequência';
ALTER TABLE presenca ADD CONSTRAINT fk_presenca_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL;
ALTER TABLE presenca ADD INDEX idx_presenca_usuario (id_usuario);

-- Adicionar campos na tabela attendance
ALTER TABLE attendance ADD motivo_justificacao TEXT COMMENT 'Motivo da justificação';
ALTER TABLE attendance ADD id_usuario INT COMMENT 'ID do usuário que registrou a frequência';
ALTER TABLE attendance ADD CONSTRAINT fk_attendance_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL;
ALTER TABLE attendance ADD INDEX idx_attendance_usuario (id_usuario);

-- Remover coluna observacoes se existir (será substituída por motivo_justificacao)
ALTER TABLE presenca DROP COLUMN IF EXISTS observacoes;
ALTER TABLE attendance DROP COLUMN IF EXISTS observacoes;
