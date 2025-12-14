# ⚠️ PROBLEMA CRÍTICO: Migration Não Executada em Produção

## Situação
- Erro 500 ao tentar criar inscrição em produção (Render)
- Provável causa: Colunas faltando na tabela `candidatos`
- Solução: Executar a migration SQL no banco de produção

## Passos para Corrigir (URGENTE)

### 1️⃣ Acessar o Painel do Render
1. Vá para https://dashboard.render.com
2. Clique no seu serviço MySQL
3. Copie as credenciais:
   - **Host**: `[seu-host].render.com`
   - **Port**: `3306`
   - **Database**: `[seu-banco]`
   - **Username**: `[seu-usuario]`
   - **Password**: `[sua-senha]`

### 2️⃣ Conectar ao Banco e Executar Migration

**Opção A: Via Terminal Local**
```bash
# Substituir pelos valores reais
mysql -h seu-host.render.com \
       -P 3306 \
       -u seu_usuario \
       -p"sua_senha" \
       seu_banco < backend/migrations/20251214_fix_candidate_columns.sql
```

**Opção B: Via MySQL Workbench ou DBeaver**
1. Criar nova conexão com as credenciais acima
2. Executar o arquivo: `backend/migrations/20251214_fix_candidate_columns.sql`

**Opção C: Via PHPMyAdmin**
1. Acessar phpMyAdmin (se Render oferece)
2. Colar conteúdo de: `backend/migrations/20251214_fix_candidate_columns.sql`
3. Executar

### 3️⃣ Verificar Sucesso
```sql
-- Execute no banco:
DESCRIBE candidatos;

-- Procure por estas colunas (devem estar presentes):
-- curso_id2, turno2, local_curso, renda_mensal, sexo, deficiencia, etc.
```

### 4️⃣ Reiniciar Backend
1. Painel Render
2. Seu serviço backend
3. "Manual Deploy" ou restart

### 5️⃣ Testar Novamente
```bash
node test-production.js
```

## Arquivo da Migration
Ver: `backend/migrations/20251214_fix_candidate_columns.sql`

## Script para Copiar Migration
```bash
# Copiar conteúdo da migration (Linux/Mac)
cat backend/migrations/20251214_fix_candidate_columns.sql

# No Windows PowerShell:
Get-Content backend/migrations/20251214_fix_candidate_columns.sql
```

## Status Atual
- ❌ Banco não tem as colunas necessárias
- ❌ Modelo Sequelize tenta usar colunas inexistentes
- ❌ API retorna 500 (Internal Server Error)

## Próximos Passos Após Migration
1. ✅ Colunas criadas no banco
2. ✅ Erro 500 desaparece
3. ✅ Inscrições funcionam em produção
