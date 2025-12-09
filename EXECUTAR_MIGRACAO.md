# 🗄️ Como Executar a Migração no Aiven

## Problema Atual
O backend foi atualizado para usar as colunas `motivo_justificacao` e `id_usuario`, mas essas colunas ainda não existem no banco de dados Aiven.

**Erro:** `Unknown column 'Attendance.motivo_justificacao' in 'field list'`

## Solução: Executar a Migração SQL

### Opção 1: Via Aiven Web Console (Recomendado - Mais Fácil)

1. **Acesse o Aiven:**
   - Vá para https://aiven.io
   - Faça login na sua conta
   - Navegue até o serviço MySQL

2. **Abra o SQL Editor:**
   - No dashboard do MySQL, procure por "Query Editor" ou similar
   - Ou use "Tools" → "Web Query Editor"

3. **Execute o SQL:**
   - Cole o seguinte comando:

```sql
-- Tabela PRESENCA
ALTER TABLE presenca ADD COLUMN IF NOT EXISTS motivo_justificacao TEXT COMMENT 'Motivo da justificação';
ALTER TABLE presenca ADD COLUMN IF NOT EXISTS id_usuario INT COMMENT 'ID do usuário que registrou a frequência';
ALTER TABLE presenca ADD CONSTRAINT fk_presenca_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL;
ALTER TABLE presenca ADD INDEX IF NOT EXISTS idx_presenca_usuario (id_usuario);

-- Tabela ATTENDANCE
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS motivo_justificacao TEXT COMMENT 'Motivo da justificação';
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS id_usuario INT COMMENT 'ID do usuário que registrou a frequência';
ALTER TABLE attendance ADD CONSTRAINT fk_attendance_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL;
ALTER TABLE attendance ADD INDEX IF NOT EXISTS idx_attendance_usuario (id_usuario);

-- Remover coluna observacoes (será substituída)
ALTER TABLE presenca DROP COLUMN IF EXISTS observacoes;
ALTER TABLE attendance DROP COLUMN IF EXISTS observacoes;
```

4. **Clique em "Execute" ou "Run"**

5. **Pronto!** A migração foi executada com sucesso.

---

### Opção 2: Via MySQL Client (Terminal)

Se você tiver MySQL client instalado localmente:

```bash
mysql -h <seu-host-aiven> -u <seu-user> -p <seu-banco> < backend/migrations/20251208_add_attendance_fields.sql
```

Substitua:
- `<seu-host-aiven>` = seu host do Aiven (ex: `mysql-xxxxx.aivencloud.com`)
- `<seu-user>` = seu usuário do banco
- `<seu-banco>` = seu nome de banco de dados

---

### Opção 3: Via DBeaver ou MySQL Workbench

1. Conecte-se ao Aiven usando suas credenciais
2. Abra a query editor
3. Copie e cole todo o conteúdo de `backend/migrations/20251208_add_attendance_fields.sql`
4. Execute (Ctrl+Enter ou clique em Execute)

---

## ✅ Verificação

Após executar, você pode verificar se as colunas foram criadas:

```sql
DESCRIBE presenca;
DESCRIBE attendance;
```

Você deve ver:
- `motivo_justificacao` (TEXT)
- `id_usuario` (INT)

---

## 🔄 Após a Migração

Uma vez que a migração foi executada:

1. **Sem fazer nada mais**, o backend Render já está funcionando com o código correto
2. **Acesse** https://api-secti-go-privado.vercel.app
3. **Vá para "Frequência"** no menu lateral
4. **Teste** a funcionalidade - agora funcionará sem erros!

