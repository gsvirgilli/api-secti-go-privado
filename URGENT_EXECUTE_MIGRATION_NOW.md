# ⚠️ URGENTE: Execute a Migration Agora!

## Erro
```
Unknown column 'curso_id2' in 'field list'
```

## Causa
A migration SQL **NÃO foi executada** no banco de dados do Render. O Sequelize está tentando acessar colunas que não existem.

## Solução Imediata (5 minutos)

### Opção A: Via MySQL CLI (Recomendado)

```bash
# Copie suas credenciais do banco Render
# Dashboard → Services → seu-mysql → Connect

# Execute o comando (tudo em uma linha):
mysql -h seu-host.render.com -u seu_usuario -p'sua_senha' seu_banco < backend/migrations/20251214_fix_candidate_columns.sql
```

### Opção B: Via phpMyAdmin

1. Acesse o phpMyAdmin do seu Render
2. Selecione o banco `seu_banco`
3. Vá para aba "SQL"
4. Copie todo o conteúdo de: `backend/migrations/20251214_fix_candidate_columns.sql`
5. Cole no editor SQL
6. Clique em "Executar"

### Opção C: Via Render Shell

1. No painel Render → seu-mysql → Shell
2. Execute:
```bash
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < /opt/render/project/src/backend/migrations/20251214_fix_candidate_columns.sql
```

## Depois de Executar

1. **Espere 30 segundos**
2. **Reinicie o backend**: Render Dashboard → seu backend → Manual Deploy
3. **Aguarde 2-3 minutos** pelo redeploy
4. **Tente novamente** na aplicação

## Verificar se Funcionou

```sql
-- No phpMyAdmin ou mysql cli:
DESCRIBE candidatos;

-- Procure por estas colunas (devem aparecer):
-- curso_id2
-- turno2
-- local_curso
-- renda_mensal
-- sexo
-- deficiencia
-- etc.
```

Se aparecerem todas, está pronto! ✅

## ⏰ Tempo Estimado
- Executar migration: 30 segundos
- Reiniciar backend: 2-3 minutos
- **Total: ~5 minutos**

## Documentação
Ver [RENDER_MIGRATION_FIX.md](RENDER_MIGRATION_FIX.md) para instruções detalhadas.
