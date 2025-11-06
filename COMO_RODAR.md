# 🚀 Como Rodar o Projeto G07-SECTI

Guia completo para clonar e executar o projeto do zero.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Git** (para clonar o repositório)
- **Docker** e **Docker Compose** (para rodar os containers)
- **Node.js 18+** (opcional, apenas se for rodar sem Docker)

### Verificar instalação:

```bash
git --version
docker --version
docker-compose --version
```

---

## 🔧 Passo a Passo

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/Residencia-em-TIC-Turma-1/G07-SECTI.git
cd G07-SECTI
```

### 2️⃣ Subir os Containers (Backend + Banco de Dados)

```bash
docker-compose up -d
```

**O que esse comando faz:**
- Cria e inicia o container do MySQL (banco de dados)
- Cria e inicia o container do Backend (API Node.js)
- Aguarda o banco ficar pronto antes de iniciar o backend
- **✨ Cria automaticamente todas as tabelas no banco** (via sync-db.ts no entrypoint)

**Aguarde ~15 segundos** para o backend terminar de criar as tabelas e iniciar.

**Verificar se os containers estão rodando:**

```bash
docker ps
```

Você deve ver dois containers:
- `app_backend` (porta 3333)
- `sukatech_mysql` (porta 3307)

**Verificar logs do backend (opcional):**

```bash
docker logs -f app_backend
```

Você deve ver:
```
Waiting for database to be ready...
Syncing database tables...
✅ Banco de dados sincronizado com sucesso!
📋 Tabelas criadas/atualizadas:
  - usuarios
  - cursos
  - turmas
  - candidatos
  - alunos
  - instrutores
  - instrutor_turma (relacionamento)
🚀 Servidor rodando na porta 3333
```

### 3️⃣ Criar Usuário Administrador

```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Admin Sistema",
    "email": "admin@secti.com",
    "senha": "admin123",
    "role": "ADMIN"
  }'
```

**Credenciais criadas:**
- **Email:** `admin@secti.com`
- **Senha:** `admin123`

### 4️⃣ Testar a API

**Fazer login e obter token:**

```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@secti.com",
    "senha": "admin123"
  }'
```

**Resposta:**
```json
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Testar endpoints com o token:**

```bash
# Substitua SEU_TOKEN pelo token recebido no login
TOKEN="seu_token_aqui"

# Listar cursos
curl http://localhost:3333/api/courses?page=1&limit=10 \
  -H "Authorization: Bearer $TOKEN"

# Listar instrutores
curl http://localhost:3333/api/instructors \
  -H "Authorization: Bearer $TOKEN"

# Listar turmas
curl http://localhost:3333/api/classes?limit=10&page=1 \
  -H "Authorization: Bearer $TOKEN"

# Listar alunos
curl http://localhost:3333/api/students?limit=10&page=1 \
  -H "Authorization: Bearer $TOKEN"
```

### 5️⃣ Rodar o Frontend (Opcional)

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

---

## 🔍 Comandos Úteis

### Ver logs do backend:
```bash
docker logs -f app_backend
```

### Ver logs do banco de dados:
```bash
docker logs -f sukatech_mysql
```

### Parar os containers:
```bash
docker-compose down
```

### Parar e remover volumes (⚠️ apaga o banco de dados):
```bash
docker-compose down -v
```

### Reiniciar apenas o backend:
```bash
docker-compose restart api
```

### Acessar o container do backend:
```bash
docker exec -it app_backend sh
```

### Acessar o MySQL diretamente:
```bash
docker exec -it sukatech_mysql mysql -usukatech_user -psukatech_password sukatechdb
```

---

## 🐛 Solução de Problemas

### Erro: "Table doesn't exist"

**Causa:** O entrypoint não executou o sync-db corretamente (primeira vez ou após limpar volumes).

**Solução 1 - Reiniciar o container (recomendado):**
```bash
docker-compose restart api
```

**Solução 2 - Executar manualmente:**
```bash
docker exec app_backend npx tsx sync-db.ts
```

### Erro: "Port 3333 already in use"

**Solução:** Outro serviço está usando a porta. Mate o processo ou altere a porta no `docker-compose.yml`:
```bash
# Encontrar o processo
lsof -i :3333

# Matar o processo (substitua PID)
kill -9 PID
```

### Erro: "Cannot connect to Docker daemon"

**Solução:** Certifique-se de que o Docker está rodando:
```bash
sudo systemctl start docker
```

### API retorna 401 Unauthorized

**Solução:** Você precisa estar autenticado. Faça login e use o token JWT:
```bash
# 1. Faça login
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@secti.com", "senha": "admin123"}'

# 2. Use o token nas requisições
curl http://localhost:3333/api/courses \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Backend não inicia / fica reiniciando

**Verificar logs:**
```bash
docker logs -f app_backend
```

**Possíveis causas:**
- Banco de dados não está pronto (aguarde alguns segundos)
- Erro de sintaxe no código TypeScript
- Variáveis de ambiente faltando

---

## 📦 Estrutura do Projeto

```
G07-SECTI/
├── backend/              # API Node.js + TypeScript
│   ├── src/
│   │   ├── modules/     # Módulos (students, courses, etc)
│   │   ├── config/      # Configurações (DB, JWT)
│   │   └── server.ts    # Entrada da aplicação
│   ├── sync-db.ts       # Script para criar tabelas
│   └── Dockerfile
├── frontend/            # Interface React + Vite
│   └── src/
├── docker-compose.yml   # Orquestração dos containers
└── mysql_data/          # Dados persistentes do MySQL
```

---

## 🔐 Endpoints Principais da API

Base URL: `http://localhost:3333/api`

### Autenticação
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Fazer login (retorna JWT)
- `POST /auth/logout` - Fazer logout

### Cursos
- `GET /courses` - Listar cursos
- `POST /courses` - Criar curso
- `PUT /courses/:id` - Atualizar curso
- `DELETE /courses/:id` - Deletar curso

### Turmas (Classes)
- `GET /classes` - Listar turmas
- `POST /classes` - Criar turma
- `PUT /classes/:id` - Atualizar turma
- `DELETE /classes/:id` - Deletar turma

### Instrutores
- `GET /instructors` - Listar instrutores
- `POST /instructors` - Criar instrutor
- `PUT /instructors/:id` - Atualizar instrutor
- `DELETE /instructors/:id` - Deletar instrutor

### Alunos
- `GET /students` - Listar alunos
- `POST /students` - Criar aluno
- `PUT /students/:id` - Atualizar aluno
- `DELETE /students/:id` - Deletar aluno

### Candidatos
- `GET /candidates` - Listar candidatos
- `POST /candidates` - Criar candidatura
- `PUT /candidates/:id/approve` - Aprovar candidato
- `PUT /candidates/:id/reject` - Reprovar candidato

**📝 Nota:** Todos os endpoints (exceto login/register) requerem autenticação via JWT.

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é parte da Residência em TIC - Turma 1.

---

## 💡 Dicas

- Use o **Postman** ou **Insomnia** para testar os endpoints
- Consulte a documentação Swagger em `http://localhost:3333/api/docs` (se disponível)
- Os dados são persistidos em `./mysql_data/` - faça backup se necessário
- Em produção, altere as senhas e secrets no arquivo `.env`

---

**✅ Pronto! Seu ambiente está configurado e rodando!** 🎉
