# Guia de Deployment - DigitalOcean

## 📋 Pré-requisitos

- Conta no DigitalOcean
- MySQL Database criado (Managed Database - MySQL)
- App Platform (para deploy de containers)
- Git repositório sincronizado

## 🗄️ Banco de Dados - DigitalOcean Managed Database

### 1. Informações da Conexão
```
Host: db-mysql-sukatech-do-user-30566063-0.h.db.ondigitalocean.com
Port: 25060
Username: doadmin
Database: defaultdb
```

### 2. Estrutura de Tabelas (Já Criada)
✅ alunos
✅ audit_logs
✅ candidatos
✅ cursos
✅ instrutor_turma
✅ instrutores
✅ matriculas
✅ password_reset_tokens
✅ presencas
✅ turmas
✅ usuarios

## 🚀 Deploy no DigitalOcean App Platform

### Opção 1: Usando app.yaml (Recomendado)

#### Passo 1: Configurar as Variáveis de Ambiente

No DigitalOcean App Platform, adicione as seguintes variáveis de ambiente:

**Para o Backend:**
```
NODE_ENV = production
DATABASE_HOST = db-mysql-sukatech-do-user-30566063-0.h.db.ondigitalocean.com
DATABASE_USER = doadmin
DATABASE_PASSWORD = [SUA_SENHA_DO_BANCO]
DATABASE_NAME = defaultdb
DATABASE_PORT = 25060
JWT_SECRET = [GERE_UMA_STRING_ALEATÓRIA_SEGURA]
JWT_EXPIRES_IN = 7d
APP_PORT = 3000
```

**Para o Frontend:**
```
VITE_API_URL = https://[seu-backend-url]/api
```

#### Passo 2: Deploy via GitHub

1. Conecte seu repositório GitHub ao DigitalOcean
2. Faça push da branch `main`
3. O DigitalOcean detectará automaticamente o `app.yaml`
4. Configure os nomes das aplicações:
   - Backend: `api-secti-backend`
   - Frontend: `api-secti-web`

#### Passo 3: Configurar o Banco de Dados

1. No painel do DigitalOcean, copie as credenciais do banco de dados gerenciado
2. Atualize as variáveis de ambiente com os dados reais
3. O backend irá conectar automaticamente na primeira execução

### Opção 2: Docker Compose (Local ou VPS)

Se preferir usar um VPS próprio:

```bash
# 1. SSH no servidor
ssh root@seu_servidor

# 2. Clone o repositório
git clone https://github.com/gsvirgilli/api-secti-go-privado.git
cd api-secti-go-privado

# 3. Crie o arquivo .env
cp backend/.env.example backend/.env

# 4. Edite o .env com suas credenciais do DigitalOcean
nano backend/.env

# 5. Inicie os containers
docker-compose up -d

# 6. Verifique os logs
docker-compose logs -f api
```

## 🔍 Verificações Pós-Deploy

### 1. Health Check do Backend

```bash
curl https://seu-backend-url/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "database": "connected"
}
```

### 2. Testar Endpoints Principais

```bash
# Login
curl -X POST https://seu-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","senha":"password"}'

# Listar Cursos
curl https://seu-backend-url/api/courses

# Inscrição Pública
curl -X POST https://seu-backend-url/api/candidates/public \
  -H "Content-Type: application/json" \
  -d '{"nome":"Test","cpf":"12345678901","email":"test@example.com","telefone":"11999999999","data_nascimento":"2000-01-01","curso_id":1,"turno":"MATUTINO"}'
```

### 3. Frontend

Acesse:
```
https://seu-frontend-url
```

Verifique:
- ✅ Página carrega normalmente
- ✅ API conecta (verificar console do browser)
- ✅ Login funciona
- ✅ Inscrição pública funciona

## 🔐 Variáveis de Segurança

### Gerar JWT_SECRET Seguro

```bash
# No Linux/Mac
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Ou use um gerador online:
# https://generate-random.org/
```

## 📊 Monitoramento

### Logs do Backend

No DigitalOcean App Platform:
- Acesse a aplicação
- Clique em "Logs"
- Filtre por "error" se necessário

### Banco de Dados

No DigitalOcean Databases:
- Monitorar conexões ativas
- Verificar CPU/Memory/Disk
- Configurar backups automáticos

## 🆘 Troubleshooting

### Erro: "Cannot connect to database"

1. Verifique as credenciais em `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_PASSWORD`
2. Confirme que o IP está autorizado (trusty)
3. Teste a conexão:
   ```bash
   mysql -h db-mysql-sukatech-do-user-30566063-0.h.db.ondigitalocean.com -P 25060 -u doadmin -p
   ```

### Erro: "CORS error"

1. Atualize `VITE_API_URL` com a URL correta do backend
2. Verifique CORS no backend em `src/server.ts`

### Erro: "File upload falha"

1. Confirme que a pasta `uploads/` existe e tem permissões de escrita
2. Para DigitalOcean Spaces, configure as credenciais:
   ```
   AWS_ACCESS_KEY_ID = [SUA_CHAVE]
   AWS_SECRET_ACCESS_KEY = [SUA_CHAVE_SECRETA]
   AWS_REGION = [REGIÃO]
   AWS_BUCKET_NAME = [NOME_DO_BUCKET]
   ```

## 📈 Próximos Passos

1. Configurar SSL/TLS (automático no App Platform)
2. Configurar domínio customizado
3. Configurar backup automático do banco de dados
4. Monitorar e escalar conforme necessário
5. Configurar CI/CD para auto-deploy em cada push

## 📞 Suporte

Para mais informações:
- Documentação DigitalOcean: https://docs.digitalocean.com/
- Repositório: https://github.com/gsvirgilli/api-secti-go-privado
