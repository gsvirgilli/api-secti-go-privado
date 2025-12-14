# 🚀 Instruções para Corrigir no Render (Production)

## Problema
```
SequelizeDatabaseError: Unknown column 'curso_id2' in 'field list'
```

## Solução Passo-a-Passo

### 1️⃣ Acessar o Banco de Dados do Render

**Opção A: Via Painel do Render (Recomendado)**
1. Acesse https://dashboard.render.com
2. Selecione seu serviço MySQL
3. Vá para a aba "Connect"
4. Você encontrará as credenciais do banco:
   - External Database URL
   - Host
   - Port
   - Database
   - User
   - Password

**Opção B: Linha de Comando**
```bash
# Obter as credenciais do seu banco Render
mysql -h <host> -u <user> -p<password> <database>
```

### 2️⃣ Executar a Migration

**Via PHPMyAdmin (Se disponível):**
1. Acesse phpMyAdmin do seu Render
2. Selecione o banco de dados
3. Vá para "SQL"
4. Copie e cole todo o conteúdo de:
   ```
   /backend/migrations/20251214_fix_candidate_columns.sql
   ```
5. Clique em "Executar" ou "Run"

**Via MySQL CLI:**
```bash
# Conectar ao banco
mysql -h seu-host.render.com -P 3306 -u seu_usuario -p'sua_senha' seu_banco

# Depois copie linha por linha do arquivo SQL
# Ou use redirect:
mysql -h seu-host.render.com -u seu_usuario -p'sua_senha' seu_banco < caminho/para/20251214_fix_candidate_columns.sql
```

**Via SSH no Render:**
1. Abra um shell SSH no Render (se disponível)
2. Execute:
```bash
cd /opt/render/project/src/backend
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < migrations/20251214_fix_candidate_columns.sql
```

### 3️⃣ Verificar se Funcionou

```sql
-- Conecte ao banco e execute:
DESCRIBE candidatos;

-- Procure por estas colunas (devem estar presentes):
-- - curso_id2
-- - turno2
-- - local_curso
-- - renda_mensal
-- - sexo
-- - deficiencia
-- etc.
```

### 4️⃣ Reiniciar o Serviço

1. No painel do Render
2. Vá para "Services"
3. Selecione seu serviço backend
4. Clique em "Manual Deploy" ou reinicie

### 5️⃣ Testar

Tente:
1. Criar uma nova candidatura: POST `/api/candidates/public`
2. Editar um candidato: PUT `/api/candidates/{id}`
3. Ver lista de candidatos: GET `/api/candidates`

Se nenhum erro de "Unknown column", está funcionando! ✅

## Conteúdo da Migration

A migration adiciona todas estas colunas (se ainda não existirem):

```
✅ Dados pessoais: rg, sexo, deficiencia, idade, nome_mae, cidade_nascimento
✅ Endereço: cep, rua, numero, complemento, bairro, cidade, estado
✅ Cursos: curso_id, turno, curso_id2, turno2, local_curso
✅ Social: raca_cor, renda_mensal, pessoas_renda, tipo_residencia, itens_casa
✅ Programa: goianas_ciencia
✅ Responsável: menor_idade, nome_responsavel, cpf_responsavel
✅ Documentos: rg_frente_url, rg_verso_url, cpf_aluno_url, comprovante_endereco_url, etc.
✅ Índices: Criados para melhor performance
```

## Se Usar GitHub Actions / Deploy Automático

Adicione um passo no seu `.github/workflows/deploy.yml`:

```yaml
- name: Execute Database Migrations
  run: |
    cd backend
    mysql -h ${{ secrets.DB_HOST }} \
          -u ${{ secrets.DB_USER }} \
          -p${{ secrets.DB_PASSWORD }} \
          ${{ secrets.DB_NAME }} \
          < migrations/20251214_fix_candidate_columns.sql
```

## Troubleshooting

### Erro: "Access denied"
- Verifique as credenciais (host, user, password)
- Certifique-se que o IP do seu cliente está autorizado

### Erro: "Unknown database"
- Verifique se o nome do banco está correto
- Case-sensitive!

### Erro: "Syntax error"
- Copie a migration linha por linha em vez de tudo de uma vez
- Ou execute via arquivo: `mysql ... < migration.sql`

### Erro: "Column 'xyz' already exists"
- Normal! A migration usa `IF NOT EXISTS`
- Significa que a coluna já foi criada anteriormente
- Continue normalmente

### Página ainda mostra erro após migration
1. Limpe o cache do backend
2. Reinicie o serviço
3. Tente novamente em uma aba anônima do navegador

## Suporte

Se tiver dúvidas:
1. Verifique o log do Render: https://dashboard.render.com → Services → seu-servico → Logs
2. Procure por erros de "Unknown column"
3. Verifique as credenciais do banco

## Documentação Relacionada

- [MIGRATION_FIX.md](../MIGRATION_FIX.md) - Instruções gerais
- [migrations/20251214_fix_candidate_columns.sql](../migrations/20251214_fix_candidate_columns.sql) - Migration SQL
