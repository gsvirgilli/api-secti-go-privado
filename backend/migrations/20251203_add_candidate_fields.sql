-- Adicionar campos faltantes à tabela candidatos
-- Esta migração adiciona todos os campos necessários para o modelo Candidate

ALTER TABLE candidatos ADD COLUMN rg VARCHAR(20) NULL AFTER data_nascimento;
ALTER TABLE candidatos ADD COLUMN sexo ENUM('FEMININO', 'MASCULINO', 'OUTRO', 'PREFIRO_NAO_INFORMAR') NULL AFTER rg;
ALTER TABLE candidatos ADD COLUMN deficiencia ENUM('NAO', 'AUDITIVA', 'VISUAL', 'FISICA', 'INTELECTUAL', 'MULTIPLA') NULL AFTER sexo;
ALTER TABLE candidatos ADD COLUMN telefone2 VARCHAR(20) NULL AFTER deficiencia;
ALTER TABLE candidatos ADD COLUMN idade INT NULL AFTER telefone2;
ALTER TABLE candidatos ADD COLUMN nome_mae VARCHAR(100) NULL AFTER idade;

-- Campos de endereço
ALTER TABLE candidatos ADD COLUMN cep VARCHAR(8) NULL AFTER nome_mae;
ALTER TABLE candidatos ADD COLUMN rua VARCHAR(200) NULL AFTER cep;
ALTER TABLE candidatos ADD COLUMN numero VARCHAR(20) NULL AFTER rua;
ALTER TABLE candidatos ADD COLUMN complemento VARCHAR(100) NULL AFTER numero;
ALTER TABLE candidatos ADD COLUMN bairro VARCHAR(100) NULL AFTER complemento;
ALTER TABLE candidatos ADD COLUMN cidade VARCHAR(100) NULL AFTER bairro;
ALTER TABLE candidatos ADD COLUMN estado VARCHAR(2) NULL AFTER cidade;

-- Curso e turno desejados
ALTER TABLE candidatos ADD COLUMN curso_id INT NULL AFTER estado;
ALTER TABLE candidatos ADD COLUMN turno VARCHAR(20) NULL AFTER curso_id;
ALTER TABLE candidatos ADD COLUMN curso_id2 INT NULL AFTER turno;
ALTER TABLE candidatos ADD COLUMN turno2 VARCHAR(20) NULL AFTER curso_id2;
ALTER TABLE candidatos ADD COLUMN local_curso VARCHAR(100) NULL AFTER turno2;

-- Questionário Social
ALTER TABLE candidatos ADD COLUMN raca_cor ENUM('BRANCO', 'PARDO', 'NEGRO', 'INDIGENA', 'AMARELO') NULL AFTER local_curso;
ALTER TABLE candidatos ADD COLUMN renda_mensal ENUM('SEM_RENDA', 'ATE_MEIO_SM', 'ATE_1_SM', '1_A_2_SM', '2_A_3_SM', '3_A_4_SM', 'ACIMA_5_SM') NULL AFTER raca_cor;
ALTER TABLE candidatos ADD COLUMN pessoas_renda VARCHAR(20) NULL AFTER renda_mensal;
ALTER TABLE candidatos ADD COLUMN tipo_residencia ENUM('PROPRIA_QUITADA', 'PROPRIA_FINANCIADA', 'ALUGADA', 'HERDADA', 'CEDIDA') NULL AFTER pessoas_renda;
ALTER TABLE candidatos ADD COLUMN itens_casa VARCHAR(200) NULL AFTER tipo_residencia;

-- Programa Goianas
ALTER TABLE candidatos ADD COLUMN goianas_ciencia ENUM('SIM', 'NAO') NULL AFTER itens_casa;

-- Responsável Legal
ALTER TABLE candidatos ADD COLUMN menor_idade BOOLEAN NOT NULL DEFAULT FALSE AFTER goianas_ciencia;
ALTER TABLE candidatos ADD COLUMN nome_responsavel VARCHAR(100) NULL AFTER menor_idade;
ALTER TABLE candidatos ADD COLUMN cpf_responsavel VARCHAR(11) NULL AFTER nome_responsavel;

-- Documentos
ALTER TABLE candidatos ADD COLUMN rg_frente_url VARCHAR(255) NULL AFTER cpf_responsavel;
ALTER TABLE candidatos ADD COLUMN rg_verso_url VARCHAR(255) NULL AFTER rg_frente_url;
ALTER TABLE candidatos ADD COLUMN cpf_aluno_url VARCHAR(255) NULL AFTER rg_verso_url;
ALTER TABLE candidatos ADD COLUMN comprovante_endereco_url VARCHAR(255) NULL AFTER cpf_aluno_url;
ALTER TABLE candidatos ADD COLUMN identidade_responsavel_frente_url VARCHAR(255) NULL AFTER comprovante_endereco_url;
ALTER TABLE candidatos ADD COLUMN identidade_responsavel_verso_url VARCHAR(255) NULL AFTER identidade_responsavel_frente_url;
ALTER TABLE candidatos ADD COLUMN cpf_responsavel_url VARCHAR(255) NULL AFTER identidade_responsavel_verso_url;
ALTER TABLE candidatos ADD COLUMN comprovante_escolaridade_url VARCHAR(255) NULL AFTER cpf_responsavel_url;
ALTER TABLE candidatos ADD COLUMN foto_3x4_url VARCHAR(255) NULL AFTER comprovante_escolaridade_url;

-- Adicionar foreign keys se não existirem
ALTER TABLE candidatos ADD CONSTRAINT fk_candidatos_curso_id FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE SET NULL;
ALTER TABLE candidatos ADD CONSTRAINT fk_candidatos_curso_id2 FOREIGN KEY (curso_id2) REFERENCES cursos(id) ON DELETE SET NULL;

-- Atualizar o status padrão
ALTER TABLE candidatos MODIFY COLUMN status VARCHAR(50) DEFAULT 'PENDENTE';
