# 🔧 Como Corrigir o Erro de Colunas Faltantes

## Problema
```
SequelizeDatabaseError: Unknown column 'curso_id2' in 'field list'
```

Este erro ocorre quando o modelo Sequelize tenta acessar colunas que não foram criadas no banco de dados. Isso acontece quando as migrations não foram executadas corretamente.

## Solução

### 1️⃣ Execute a Nova Migration (Recomendado)

A migration mais recente `20251214_fix_candidate_columns.sql` adiciona TODAS as colunas faltantes de forma segura usando `IF NOT EXISTS`.

**No Render (Production):**
- Acesse o Dashboard do Render
- Vá para "Settings" > "Environment"
- Você precisará executar um comando SQL direto no seu banco de dados MySQL
- Copie todo o conteúdo de `/migrations/20251214_fix_candidate_columns.sql`
- Execute via phpMyAdmin ou MySQL client

**Localmente (Development):**
```bash
cd backend
./run-all-migrations.sh
```

### 2️⃣ Se Usar npm Script

Se tiver um script npm configurado:
```bash
cd backend
npm run migrate
```

### 3️⃣ Executar Manualmente

Se preferir executar arquivo por arquivo:
```bash
# Local
mysql -u root -p secti_db < migrations/20251214_fix_candidate_columns.sql

# Com variáveis de ambiente
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < migrations/20251214_fix_candidate_columns.sql
```

### 4️⃣ No Render - Via Conectar ao Banco

Se tiver acesso SSH ou conexão direta:
```bash
# Conectar ao banco remoto
mysql -h [DB_HOST] -u [DB_USER] -p[DB_PASSWORD] [DB_NAME]

# Depois copie e execute:
# Conteúdo do arquivo 20251214_fix_candidate_columns.sql
```

## O que a Migration Faz

✅ Adiciona TODAS as colunas necessárias ao modelo Candidate:
- Dados pessoais: `rg`, `sexo`, `deficiencia`, `idade`, `nome_mae`
- Endereço: `cep`, `rua`, `numero`, `complemento`, `bairro`, `cidade`, `estado`
- **Cursos: `curso_id`, `turno`, `curso_id2`, `turno2`, `local_curso`** (corrige o erro)
- Social: `raca_cor`, `renda_mensal`, `pessoas_renda`, `tipo_residencia`, `itens_casa`
- Programa: `goianas_ciencia`
- Responsável: `menor_idade`, `nome_responsavel`, `cpf_responsavel`
- Documentos: URLs para todos os arquivos

## Verificar se Funcionou

Depois de executar a migration, tente:

1. Acessar a página de inscrição do candidato
2. Submeter um formulário de candidatura
3. Editar um candidato existente
4. Ver se o erro desaparece

Se ainda houver problemas, verifique:
```sql
DESCRIBE candidatos;
-- Procure por: curso_id2, turno2, e outras colunas listadas acima
```

## Referência de Colunas

| Campo | Tipo | Null | Default |
|-------|------|------|---------|
| curso_id2 | INT | YES | NULL |
| turno2 | VARCHAR(20) | YES | NULL |
| local_curso | VARCHAR(100) | YES | NULL |
| renda_mensal | ENUM('SEM_RENDA',...) | YES | NULL |
| ... | ... | ... | ... |

## Suporte

Se o erro persistir:
1. Verifique se a migration foi executada: `SHOW TABLES;` → `DESCRIBE candidatos;`
2. Confirme que o banco de produção está correto
3. Reinicie o servidor: `npm start` ou `npm run dev`
4. Limpe o cache se necessário
