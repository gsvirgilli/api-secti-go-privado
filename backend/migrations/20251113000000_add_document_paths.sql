-- Migration: Adicionar campos para armazenar caminhos dos documentos
-- Data: 2025-11-13

ALTER TABLE candidatos 
ADD COLUMN IF NOT EXISTS rg_frente_url VARCHAR(255) DEFAULT NULL COMMENT 'Caminho do arquivo RG frente',
ADD COLUMN IF NOT EXISTS rg_verso_url VARCHAR(255) DEFAULT NULL COMMENT 'Caminho do arquivo RG verso',
ADD COLUMN IF NOT EXISTS cpf_aluno_url VARCHAR(255) DEFAULT NULL COMMENT 'Caminho do arquivo CPF do aluno',
ADD COLUMN IF NOT EXISTS comprovante_endereco_url VARCHAR(255) DEFAULT NULL COMMENT 'Caminho do comprovante de endereço',
ADD COLUMN IF NOT EXISTS identidade_responsavel_frente_url VARCHAR(255) DEFAULT NULL COMMENT 'Caminho RG responsável frente',
ADD COLUMN IF NOT EXISTS identidade_responsavel_verso_url VARCHAR(255) DEFAULT NULL COMMENT 'Caminho RG responsável verso',
ADD COLUMN IF NOT EXISTS cpf_responsavel_url VARCHAR(255) DEFAULT NULL COMMENT 'Caminho CPF do responsável',
ADD COLUMN IF NOT EXISTS comprovante_escolaridade_url VARCHAR(255) DEFAULT NULL COMMENT 'Caminho do comprovante de escolaridade',
ADD COLUMN IF NOT EXISTS foto_3x4_url VARCHAR(255) DEFAULT NULL COMMENT 'Caminho da foto 3x4';

