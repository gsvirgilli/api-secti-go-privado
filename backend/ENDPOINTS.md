# 📋 Endpoints da API - SUKA TECH

## 🚀 Base URL
```
http://localhost:3333/api
```

## 🔐 Autenticação

### POST `/auth/register` (Público)
Cadastro de novo usuário

**Request Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "role": "INSTRUTOR" // opcional, default: "INSTRUTOR"
}
```

**Response (201):**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "role": "INSTRUTOR",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### POST `/auth/login` (Público)
Login de usuário (Rate Limited: 10 tentativas / 15 minutos)

**Request Body:**
```json
{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "INSTRUTOR",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 👤 Usuários (Requer Autenticação)

**Token:** `Authorization: Bearer <token>`

### GET `/users/me`
Obter informações do usuário autenticado

**Response (200):**
```json
{
  "id": "1",
  "role": "INSTRUTOR"
}
```

---

### GET `/me`
Endpoint alternativo para informações do usuário

---

## 📚 Cursos (Requer Autenticação)

### GET `/courses` 
Listar todos os cursos com filtros opcionais

**Query Params:**
- `search` - Buscar por nome
- `minHours` - Carga horária mínima
- `maxHours` - Carga horária máxima
- `page` - Número da página
- `limit` - Itens por página

### GET `/courses/:id`
Buscar curso específico por ID

### POST `/courses`
Criar novo curso

**Request Body:**
```json
{
  "nome": "Curso de JavaScript",
  "carga_horaria": 40,
  "descricao": "Descrição do curso"
}
```

### PUT `/courses/:id`
Atualizar curso

### DELETE `/courses/:id`
Deletar curso

### GET `/courses/statistics`
Obter estatísticas dos cursos

---

## 🎓 Turmas (Requer Autenticação)

### GET `/classes`
Listar todas as turmas

**Query Params:**
- `search` - Buscar por nome
- `turno` - Filtrar por turno
- `id_curso` - Filtrar por curso

### GET `/classes/:id`
Buscar turma específica por ID

### POST `/classes`
Criar nova turma

**Request Body:**
```json
{
  "nome": "Turma A - JavaScript",
  "turno": "NOITE",
  "data_inicio": "2024-01-15",
  "data_fim": "2024-06-15",
  "id_curso": 1
}
```

### PUT `/classes/:id`
Atualizar turma

### DELETE `/classes/:id`
Deletar turma

### GET `/classes/statistics`
Obter estatísticas das turmas

### POST `/classes/check-conflict`
Verificar conflito de horário

---

## 👥 Candidatos (Requer Autenticação)

### GET `/candidates`
Listar todos os candidatos

**Query Params:**
- `search` - Buscar por nome/email/CPF
- `status` - Filtrar por status
- `id_turma_desejada` - Filtrar por turma

### GET `/candidates/:id`
Buscar candidato específico por ID

### POST `/candidates`
Criar novo candidato

**Request Body:**
```json
{
  "nome": "Maria Santos",
  "cpf": "12345678901",
  "email": "maria@email.com",
  "id_turma_desejada": 1
}
```

### PUT `/candidates/:id`
Atualizar candidato

### DELETE `/candidates/:id`
Deletar candidato

### POST `/candidates/:id/approve`
Aprovar candidato (converte em aluno)

### POST `/candidates/:id/reject`
Rejeitar candidato

### GET `/candidates/statistics`
Obter estatísticas dos candidatos

---

## 🎓 Alunos (Requer Autenticação)

### GET `/students`
Listar todos os alunos

**Query Params:**
- `search` - Buscar por nome/email/CPF/matrícula
- `page` - Número da página
- `limit` - Itens por página

### GET `/students/:id`
Buscar aluno por ID

### GET `/students/cpf/:cpf`
Buscar aluno por CPF

### GET `/students/matricula/:matricula`
Buscar aluno por matrícula

### PUT `/students/:id`
Atualizar aluno

**Request Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "matricula": "2024001"
}
```

### DELETE `/students/:id`
Deletar aluno

### GET `/students/statistics`
Obter estatísticas dos alunos

---

## 🏥 Health Check

### GET `/api/health`
Verificar se a API está rodando

**Response (200):**
```json
{
  "status": "ok",
  "message": "SUKA TECH API is running!"
}
```

### GET `/ping`
Endpoint de ping

**Response (200):**
```json
{
  "status": "ok"
}
```

---

## ⚠️ Erros Comuns

### 401 - Unauthorized
```json
{
  "message": "Unauthorized",
  "details": null
}
```

### 400 - Validation Error
```json
{
  "message": "Validation failed",
  "details": [
    {
      "path": ["body", "email"],
      "message": "Email é obrigatório"
    }
  ]
}
```

### 409 - Conflict
```json
{
  "message": "Este email já está em uso.",
  "details": null
}
```

---

## 📝 Como Testar

### 1. Inicie o servidor
```bash
cd backend
npm run dev
```

### 2. Teste de Registro
```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Admin",
    "email": "admin@test.com",
    "senha": "senha123"
  }'
```

### 3. Teste de Login
```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "senha": "senha123"
  }'
```

### 4. Usar Token
```bash
export TOKEN="seu_token_aqui"

curl -X GET http://localhost:3333/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔒 Segurança

- **Rate Limiting**: Login limitado a 10 tentativas por 15 minutos
- **JWT Authentication**: Token expira em 1 dia
- **Password Hashing**: Senhas hash com bcrypt (8 rounds)
- **CORS**: Configurado para aceitar requisições de qualquer origem (desenvolvimento)

---

## 📊 Estrutura de Respostas

Todas as respostas seguem o padrão:

```json
{
  "success": true,
  "data": { /* dados */ },
  "message": "opcional"
}
```

Respostas de erro:

```json
{
  "message": "Mensagem de erro",
  "details": [ /* detalhes de validação opcionais */ ]
}
```
