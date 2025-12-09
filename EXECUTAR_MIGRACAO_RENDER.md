# 🚀 Executar Migração no Render

## Passo 1: Acesse o Dashboard do Render
URL: https://dashboard.render.com/

## Passo 2: Abra o seu serviço de API
Clique em **"api-secti-go-privado"** (ou similar)

## Passo 3: Abra o Console (Shell)
No topo da página, você verá abas. Procure por:
- **"Shell"** ou
- **"Console"** 

Clique nela para abrir o terminal do seu servidor.

## Passo 4: Cole este comando

```bash
node /opt/render/project/src/backend/migrate.js
```

Ou se não souber o caminho exato:

```bash
cd src/backend && node migrate.js
```

## Passo 5: Pressione ENTER

O script vai:
1. ✅ Conectar ao banco Aiven automaticamente
2. ✅ Executar 8 comandos SQL
3. ✅ Criar as colunas `motivo_justificacao` e `id_usuario`
4. ✅ Mostrar "🎉 Migração concluída com sucesso!" quando terminar

---

## ⚡ Saída esperada

```
🔄 Conectando ao banco de dados...
✅ Conectado!

📝 Executando 8 comandos...

⏳ ALTER TABLE presenca ADD COLUMN IF NOT EXISTS...
✅ OK

⏳ ALTER TABLE presenca ADD COLUMN IF NOT EXISTS...
✅ OK

... (mais comandos) ...

🎉 Migração concluída com sucesso!
```

---

## ❓ Se der erro

Se aparecer erro, tire uma screenshot e envie. Provavelmente será um dos:

1. **"Arquivo não encontrado"** - Esperamos mais um pouco que o deploy termine
2. **"Conexão recusada"** - O banco Aiven está offline (raro)
3. **"Coluna já existe"** - Isso é OK! Significa que já foi executado

