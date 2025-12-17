# 🚀 Checklist de Deployment - DigitalOcean

## ✅ Configurações Já Completadas

- ✅ Backend Dockerfile otimizado para production
- ✅ Frontend Dockerfile com multi-stage build
- ✅ app.yaml configurado para DigitalOcean App Platform
- ✅ Database schema criado no DigitalOcean Managed Database
- ✅ Scripts de validação e setup preparados
- ✅ Documentação de deployment completa

## 📋 Próximos Passos (Passo a Passo)

### Passo 1: Preparar DigitalOcean

1. **Criar/Confirmar Managed Database (MySQL)**
   - Acesse: https://cloud.digitalocean.com/databases
   - Crie um novo MySQL 8.0 ou use o existente
   - Copie as credenciais:
     ```
     Host: db-mysql-sukatech-do-user-xxxxx.h.db.ondigitalocean.com
     Port: 25060
     Username: doadmin
     Database: defaultdb
     ```

2. **Criar App Platform**
   - Acesse: https://cloud.digitalocean.com/apps
   - Clique "Create App"
   - Selecione "GitHub"
   - Autentique com GitHub
   - Selecione: `gsvirgilli/api-secti-go-privado`
   - Branch: `main`

### Passo 2: Configurar Variáveis de Ambiente

**No seu terminal local, execute:**
```bash
cd ~/projetos/api-secti-go-privado
bash setup-env-vars.sh
```

Isso gerará um arquivo `digitalocean-env-vars.txt` com todas as variáveis necessárias.

**No DigitalOcean App Platform:**

Para cada serviço (backend e web):
1. Clique no serviço
2. Vá em "Settings" 
3. Clique em "Environment Variables"
4. Adicione as variáveis do arquivo gerado

**Variáveis do Backend:**
```
NODE_ENV = production
DATABASE_HOST = [seu-host]
DATABASE_PORT = 25060
DATABASE_USER = doadmin
DATABASE_PASSWORD = [sua-senha]
DATABASE_NAME = defaultdb
JWT_SECRET = [gerado automaticamente]
JWT_EXPIRES_IN = 7d
APP_PORT = 3000
```

**Variáveis do Frontend:**
```
VITE_API_URL = https://[seu-backend-url]/api
```

### Passo 3: Deploy

1. **Opção A: Auto-Deploy (Recomendado)**
   - O app.yaml está configurado no repositório
   - Qualquer push para `main` dispara deploy automático
   - Basta fazer: `git push origin main`

2. **Opção B: Deploy Manual**
   - No DigitalOcean App Platform
   - Clique "Trigger Deploy"
   - Aguarde a compilação (5-10 minutos)

### Passo 4: Verificar Deploy

1. **Aguarde a compilação**
   - Logs estão em "Activity" na App Platform

2. **Teste o Backend**
   ```bash
   curl https://seu-backend-url/api/health
   ```
   
   Resposta esperada:
   ```json
   {"status":"ok","database":"connected"}
   ```

3. **Teste o Frontend**
   - Acesse: `https://seu-frontend-url`
   - Abra DevTools (F12)
   - Verifique se não há erros de conexão com API

## 🔍 Monitoramento

### Logs em Tempo Real
- DigitalOcean → App Platform → Seu App → "Logs"

### Banco de Dados
- DigitalOcean → Databases → Seu Banco → "Metrics"

### Performance
- DigitalOcean → App Platform → Seu App → "Analytics"

## 🆘 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| "Cannot connect to database" | Verifique DATABASE_HOST, USER, PASSWORD |
| "CORS error" | Atualize VITE_API_URL no frontend |
| "Files upload fails" | Configure DigitalOcean Spaces (opcional) |
| "Build fails" | Verifique logs em Activity → Deploy |
| "Static files 404" | Certifique que Dockerfile.frontend está correto |

## 📞 URLs Importantes

- GitHub Repo: https://github.com/gsvirgilli/api-secti-go-privado
- DigitalOcean App Platform: https://cloud.digitalocean.com/apps
- DigitalOcean Databases: https://cloud.digitalocean.com/databases
- DigitalOcean Docs: https://docs.digitalocean.com/

## 🎉 Depois do Deploy

1. Configure domínio customizado
2. Configure HTTPS/SSL (automático)
3. Configure backups do banco de dados
4. Monitore performance e custos
5. Configure alertas de erro

---

**Pronto para começar?**
```bash
bash setup-env-vars.sh
```

Boa sorte! 🚀
