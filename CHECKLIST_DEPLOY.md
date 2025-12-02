# ✅ CHECKLIST DE DEPLOY - API SECTI GO

**Data**: 27 de Novembro de 2025  
**Responsável**: Time DevOps

---

## 🔴 CRÍTICO - FAZER AGORA

### 1. [ ] Gerar JWT_SECRET Seguro

```bash
# Execute este comando no terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copie o resultado (algo como: a1b2c3d4e5f6g7h8...)
# E adicione no Render em Environment Variables
```

**Onde usar:**
- Render > Environment Variables > `JWT_SECRET`

---

### 2. [ ] Corrigir CORS (Segurança Alta)

**Arquivo**: `backend/src/app.ts`

**Substituir:**
```typescript
app.use(cors()); // ❌ INSEGURO
```

**Por:**
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Depois adicionar no .env:**
```env
FRONTEND_URL=https://seu-frontend.com  # Para produção
# Deixe vazio ou localhost:5173 para dev
```

---

### 3. [ ] Executar npm audit fix

```bash
cd backend
npm audit fix
npm audit fix --force  # Se necessário
```

**Verificar problemas:**
```bash
npm audit
```

---

### 4. [ ] Criar .dockerignore

**Arquivo**: `backend/.dockerignore`

```
node_modules
dist
.git
.env
.env.local
test
coverage
*.log
.DS_Store
```

---

### 5. [ ] Configurar Variáveis no Render

Acesse: https://dashboard.render.com > seu serviço > Environment

```
APP_PORT=3333
JWT_SECRET=<valor gerado no passo 1>
DATABASE_HOST=<seu-mysql-produção>
DATABASE_USER=<seu-usuario>
DATABASE_PASSWORD=<sua-senha>
DATABASE_NAME=sukatechdb
DATABASE_PORT=3306
FRONTEND_URL=https://seu-frontend.com
NODE_ENV=production
```

---

## ⚠️ IMPORTANTE - FAZER ANTES DO DEPLOY

### 6. [ ] Ativar TypeScript Strict Mode

**Arquivo**: `backend/tsconfig.json`

**Mudar:**
```json
"strict": false
```

**Para:**
```json
"strict": true
```

**Depois corrigir erros que aparecerem:**
```bash
npm run build
```

---

### 7. [ ] Adicionar Pool de Conexões

**Arquivo**: `backend/src/config/database.ts`

**Adicionar dentro da config do Sequelize:**
```typescript
pool: {
  max: 5,           // Máximo de conexões
  min: 0,           // Mínimo de conexões
  acquire: 30000,   // Timeout para adquirir conexão (ms)
  idle: 10000       // Timeout para conexão ociosa (ms)
}
```

---

### 8. [ ] Revisar Endpoints de Segurança

**Verificar em**: `backend/src/routes/index.ts`

**Certifique-se que:**
- [ ] DELETE de usuários requer autenticação
- [ ] PUT de dados sensíveis requer autenticação
- [ ] Apenas admins podem criar instrutores
- [ ] Rate limiting está ativo em login

---

## ✅ FAZER ANTES DO COMMIT

### 9. [ ] Testar localmente

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Teste
curl http://localhost:3333/api/health

# Deve retornar:
# {"status":"ok","message":"SUKA TECH API is running!"}
```

---

### 10. [ ] Verificar se há erros de compilação

```bash
npm run build

# Deve compilar sem erros
# Se houver erros, corrija antes de fazer commit
```

---

### 11. [ ] Executar testes

```bash
npm test

# Todos devem passar
```

---

## 🚀 FAZER COMMIT E PUSH

### 12. [ ] Commit com mensagem descritiva

```bash
git add .
git commit -m "chore: preparar para produção

- Corrigir CORS com restrições
- Gerar JWT_SECRET seguro
- Adicionar .dockerignore
- Configurar pool de conexões
- Ativar TypeScript strict mode
- Executar npm audit fix"

git push origin main
```

---

## 🌐 CONFIGURAR NO RENDER

### 13. [ ] Configurar serviço no Render

1. Acesse https://render.com
2. Vá para seu serviço
3. Clique em "Manual Deploy" ou "Settings"
4. Confirme:
   - Build Command: `npm install && npm run build`
   - Start Command: `node --import tsx/esm src/server.ts`
   - Variáveis de ambiente: ✅ Configuradas (passo 5)

---

### 14. [ ] Acionar novo deploy

```bash
# Opção 1: Manual no dashboard do Render
# Clique em "Manual Deploy" → "Deploy latest commit"

# Opção 2: Faça push (se auto-deploy está ativado)
git push origin main
```

---

### 15. [ ] Monitorar o deploy

**No Render:**
1. Vá para "Logs"
2. Procure por: `🚀 Servidor rodando na porta 3333`
3. Verifique se não há erros

**Teste a API:**
```bash
curl https://seu-api.render.com/api/health

# Deve retornar:
# {"status":"ok","message":"SUKA TECH API is running!"}
```

---

## 🔍 TESTES PÓS-DEPLOY

### 16. [ ] Testar autenticação

```bash
# Login
curl -X POST https://seu-api.render.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@secti.com","senha":"admin123"}'

# Deve retornar token
```

---

### 17. [ ] Testar CORS

```bash
# Verificar se CORS está funcionando
curl -i -X OPTIONS https://seu-api.render.com/api/courses \
  -H "Origin: https://seu-frontend.com" \
  -H "Access-Control-Request-Method: GET"

# Deve retornar:
# Access-Control-Allow-Origin: https://seu-frontend.com
```

---

### 18. [ ] Verificar logs de erro

**No Render:**
1. Vá para "Logs"
2. Procure por `ERROR` ou `❌`
3. Se houver erros, analise e corrija

---

## 📊 PROBLEMAS COMUNS & SOLUÇÕES

### Problema: "ERR_MODULE_NOT_FOUND: Cannot find module"

**Causa**: Dependências não instaladas corretamente

**Solução**:
```bash
cd backend
rm -rf node_modules
npm install
npm run build
git add package-lock.json
git commit -m "fix: reinstalar dependências"
git push
```

---

### Problema: "Database connection refused"

**Causa**: Variáveis de DATABASE não estão corretas

**Solução**:
1. No Render > Environment > Verificar:
   - DATABASE_HOST
   - DATABASE_USER
   - DATABASE_PASSWORD
   - DATABASE_NAME
2. Se não tiver MySQL externo, configure no Render ou use serviço externo

---

### Problema: "401 Unauthorized em todos os endpoints"

**Causa**: JWT_SECRET diferente entre build/runtime

**Solução**:
1. Gerar novo JWT_SECRET
2. Adicionar no Render > Environment
3. Fazer novo deploy

---

### Problema: "CORS error no frontend"

**Causa**: FRONTEND_URL não está configurado corretamente

**Solução**:
1. Render > Environment > `FRONTEND_URL` = seu-frontend-url.com
2. Verificar que está sem `http://` ou `https://`
3. Fazer novo deploy

---

## 🎯 CHECKLIST FINAL

- [ ] JWT_SECRET seguro gerado
- [ ] CORS configurado
- [ ] npm audit fix executado
- [ ] .dockerignore criado
- [ ] TypeScript strict = true
- [ ] Pool de conexões configurado
- [ ] Endpoints revisados
- [ ] Testes passando
- [ ] Commit feito com mensagem descritiva
- [ ] Render configurado com variáveis
- [ ] Deploy realizado
- [ ] Health check respondendo
- [ ] Login testado
- [ ] CORS testado
- [ ] Logs sem erros

---

## 📝 NOTAS IMPORTANTES

### Antes do Deploy em Produção:

- **Backup do banco de dados**: ✅ Fazer sempre
- **DNS configurado**: ✅ Render fornece URL automática
- **SSL/TLS**: ✅ Render fornece certificado grátis
- **Monitoramento**: ⏳ Considere Sentry depois

### Depois do Deploy:

- Monitorar logs por 24h
- Testar todos os endpoints principais
- Verificar performance
- Configurar backups automáticos

---

## 💬 SUPORTE

Se algo não funcionar:

1. **Verificar logs**: `Render > Logs`
2. **Verificar variáveis**: `Render > Environment`
3. **Verificar build**: `Render > Build Logs`
4. **Reinstalar dependências**: `npm ci` (em vez de `npm install`)
5. **Fazer novo deploy**: Manual Deploy no Render

---

**Checklist atualizado em**: 27 de Novembro de 2025  
**Versão**: 1.0  
**Status**: ✅ Pronto para usar
