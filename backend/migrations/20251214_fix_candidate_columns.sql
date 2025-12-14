-- Adicionar colunas faltantes à tabela candidatos
-- Esta migração adiciona TODAS as colunas necessárias para o modelo Candidate
-- 
-- Nota: Se alguma coluna já existe, o erro será ignorado pelo migration runner
-- ou você pode comentar as linhas das colunas que já existem

-- Dados pessoais básicos
ALTER TABLE candidatos ADD COLUMN rg VARCHAR(20) NULL;
ALTER TABLE candidatos ADD COLUMN sexo ENUM('FEMININO', 'MASCULINO', 'OUTRO', 'PREFIRO_NAO_INFORMAR') NULL;
ALTER TABLE candidatos ADD COLUMN deficiencia ENUM('NAO', 'AUDITIVA', 'VISUAL', 'FISICA', 'INTELECTUAL', 'MULTIPLA') NULL;
ALTER TABLE candidatos ADD COLUMN telefone2 VARCHAR(20) NULL;
ALTER TABLE candidatos ADD COLUMN idade INT NULL;
ALTER TABLE candidatos ADD COLUMN nome_mae VARCHAR(100) NULL;
ALTER TABLE candidatos ADD COLUMN cidade_nascimento VARCHAR(100) NULL;

-- Campos de endereço
ALTER TABLE candidatos ADD COLUMN cep VARCHAR(8) NULL;
ALTER TABLE candidatos ADD COLUMN rua VARCHAR(200) NULL;
ALTER TABLE candidatos ADD COLUMN numero VARCHAR(20) NULL;
ALTER TABLE candidatos ADD COLUMN complemento VARCHAR(100) NULL;
ALTER TABLE candidatos ADD COLUMN bairro VARCHAR(100) NULL;
ALTER TABLE candidatos ADD COLUMN cidade VARCHAR(100) NULL;
ALTER TABLE candidatos ADD COLUMN estado VARCHAR(2) NULL;

-- Curso e turno desejados
ALTER TABLE candidatos ADD COLUMN curso_id INT NULL;
ALTER TABLE candidatos ADD COLUMN turno VARCHAR(20) NULL;
ALTER TABLE candidatos ADD COLUMN curso_id2 INT NULL;
ALTER TABLE candidatos ADD COLUMN turno2 VARCHAR(20) NULL;
ALTER TABLE candidatos ADD COLUMN local_curso VARCHAR(100) NULL;

-- Questionário Social
ALTER TABLE candidatos ADD COLUMN raca_cor ENUM('BRANCO', 'PARDO', 'NEGRO', 'INDIGENA', 'AMARELO') NULL;
ALTER TABLE candidatos ADD COLUMN renda_mensal ENUM('SEM_RENDA', 'ATE_MEIO_SM', 'ATE_1_SM', '1_A_2_SALARIOS', '2_A_3_SALARIOS', '3_A_4_SALARIOS', 'ACIMA_5_SALARIOS') NULL;
ALTER TABLE candidatos ADD COLUMN pessoas_renda INT NULL;
ALTER TABLE candidatos ADD COLUMN tipo_residencia ENUM('PROPRIA_QUITADA', 'PROPRIA_FINANCIADA', 'ALUGADA', 'HERDADA', 'CEDIDA') NULL;
ALTER TABLE candidatos ADD COLUMN itens_casa VARCHAR(500) NULL;

-- Programa Goianas
ALTER TABLE candidatos ADD COLUMN goianas_ciencia ENUM('SIM', 'NAO') NULL;

-- Responsável Legal
ALTER TABLE candidatos ADD COLUMN menor_idade BOOLEAN NULL DEFAULT FALSE;
ALTER TABLE candidatos ADD COLUMN nome_responsavel VARCHAR(100) NULL;
ALTER TABLE candidatos ADD COLUMN cpf_responsavel VARCHAR(11) NULL;

-- Documentos (URL/path dos arquivos)
ALTER TABLE candidatos ADD COLUMN rg_frente_url VARCHAR(255) NULL;
ALTER TABLE candidatos ADD COLUMN rg_verso_url VARCHAR(255) NULL;
ALTER TABLE candidatos ADD COLUMN cpf_aluno_url VARCHAR(255) NULL;
ALTER TABLE candidatos ADD COLUMN comprovante_endereco_url VARCHAR(255) NULL;
ALTER TABLE candidatos ADD COLUMN identidade_responsavel_frente_url VARCHAR(255) NULL;
ALTER TABLE candidatos ADD COLUMN identidade_responsavel_verso_url VARCHAR(255) NULL;
ALTER TABLE candidatos ADD COLUMN cpf_responsavel_url VARCHAR(255) NULL;
ALTER TABLE candidatos ADD COLUMN comprovante_escolaridade_url VARCHAR(255) NULL;
ALTER TABLE candidatos ADD COLUMN foto_3x4_url VARCHAR(255) NULL;

-- Adicionar indices para melhor performance
ALTER TABLE candidatos ADD INDEX idx_candidatos_cpf (cpf);
ALTER TABLE candidatos ADD INDEX idx_candidatos_email (email);
ALTER TABLE candidatos ADD INDEX idx_candidatos_status (status);
ALTER TABLE candidatos ADD INDEX idx_candidatos_curso_id (curso_id);
ALTER TABLE candidatos ADD INDEX idx_candidatos_curso_id2 (curso_id2);
