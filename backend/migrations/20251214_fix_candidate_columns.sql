-- Adicionar colunas faltantes à tabela candidatos (migration corrigida)
-- Esta migração adiciona TODAS as colunas necessárias que podem estar faltando

-- Antes de cada adição, verifica se a coluna não existe já
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS rg VARCHAR(20) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS sexo ENUM('FEMININO', 'MASCULINO', 'OUTRO', 'PREFIRO_NAO_INFORMAR') NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS deficiencia ENUM('NAO', 'AUDITIVA', 'VISUAL', 'FISICA', 'INTELECTUAL', 'MULTIPLA') NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS telefone2 VARCHAR(20) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS idade INT NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS nome_mae VARCHAR(100) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS cidade_nascimento VARCHAR(100) NULL;

-- Campos de endereço
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS cep VARCHAR(8) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS rua VARCHAR(200) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS numero VARCHAR(20) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS complemento VARCHAR(100) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS bairro VARCHAR(100) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS cidade VARCHAR(100) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS estado VARCHAR(2) NULL;

-- Curso e turno desejados
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS curso_id INT NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS turno VARCHAR(20) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS curso_id2 INT NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS turno2 VARCHAR(20) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS local_curso VARCHAR(100) NULL;

-- Questionário Social
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS raca_cor ENUM('BRANCO', 'PARDO', 'NEGRO', 'INDIGENA', 'AMARELO') NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS renda_mensal ENUM('SEM_RENDA', 'ATE_MEIO_SM', 'ATE_1_SM', '1_A_2_SALARIOS', '2_A_3_SALARIOS', '3_A_4_SALARIOS', 'ACIMA_5_SALARIOS') NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS pessoas_renda INT NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS tipo_residencia ENUM('PROPRIA_QUITADA', 'PROPRIA_FINANCIADA', 'ALUGADA', 'HERDADA', 'CEDIDA') NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS itens_casa VARCHAR(500) NULL;

-- Programa Goianas
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS goianas_ciencia ENUM('SIM', 'NAO') NULL;

-- Responsável Legal
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS menor_idade BOOLEAN NULL DEFAULT FALSE;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS nome_responsavel VARCHAR(100) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS cpf_responsavel VARCHAR(11) NULL;

-- Documentos (URL/path dos arquivos)
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS rg_frente_url VARCHAR(255) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS rg_verso_url VARCHAR(255) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS cpf_aluno_url VARCHAR(255) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS comprovante_endereco_url VARCHAR(255) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS identidade_responsavel_frente_url VARCHAR(255) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS identidade_responsavel_verso_url VARCHAR(255) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS cpf_responsavel_url VARCHAR(255) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS comprovante_escolaridade_url VARCHAR(255) NULL;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS foto_3x4_url VARCHAR(255) NULL;

-- Adicionar indices para melhor performance
ALTER TABLE candidatos ADD INDEX IF NOT EXISTS idx_candidatos_cpf (cpf);
ALTER TABLE candidatos ADD INDEX IF NOT EXISTS idx_candidatos_email (email);
ALTER TABLE candidatos ADD INDEX IF NOT EXISTS idx_candidatos_status (status);
ALTER TABLE candidatos ADD INDEX IF NOT EXISTS idx_candidatos_curso_id (curso_id);
ALTER TABLE candidatos ADD INDEX IF NOT EXISTS idx_candidatos_curso_id2 (curso_id2);
