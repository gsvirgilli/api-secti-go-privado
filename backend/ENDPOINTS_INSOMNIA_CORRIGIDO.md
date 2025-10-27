# 🔧 Endpoints CORRIGIDOS - Guia Completo para Insomnia

## ⚠️ CORREÇÕES REALIZADAS

1. **Candidato**: Campo `id_turma_desejada` → `turma_id`
2. **Candidato**: Campo `data_nascimento` agora é opcional
3. **Status**: Valores alterados de UPPERCASE para lowercase: `pendente`, `aprovado`, `reprovado`
4. **Aprovação**: Agora cria automaticamente um usuário para o aluno
5. **Rejeição**: Requer `motivo` no body com mínimo 10 caracteres

---

## 🚀 Configuração Inicial

**Base URL:** `http://localhost:3333/api`

---

## 🔐 **1. AUTENTICAÇÃO**

### 1.1. Registrar Usuário
- **Método:** `POST`
- **URL:** `http://localhost:3333/api/auth/register`
- **Body (JSON):**
```json
{
  "nome": "Admin Teste",
  "email": "admin@teste.com",
  "senha": "senha123",
  "role": "INSTRUTOR"
}
```

### 1.2. Login
- **Método:** `POST`
- **URL:** `http://localhost:3333/api/auth/login`
- **Body (JSON):**
```json
{
  "email": "admin@teste.com",
  "senha": "senha123"
}
```
**⚠️ COPIE O TOKEN DA RESPOSTA!**

---

## 📚 **2. CURSOS** (Requer Token)

### 2.1. Criar Curso
- **Método:** `POST`
- **URL:** `http://localhost:3333/api/courses`
- **Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```
- **Body (JSON):**
```json
{
  "nome": "Curso de JavaScript",
  "carga_horaria": 60,
  "descricao": "Curso completo de JavaScript"
}
```

### 2.2. Listar Cursos
- **Método:** `GET`
- **URL:** `http://localhost:3333/api/courses`
- **Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 🎓 **3. TURMAS** (Requer Token)

### 3.1. Criar Turma
- **Método:** `POST`
- **URL:** `http://localhost:3333/api/classes`
- **Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```
- **Body (JSON):**
```json
{
  "nome": "Turma JS - Noturna 2024",
  "turno": "NOITE",
  "data_inicio": "2024-11-01",
  "data_fim": "2025-05-01",
  "id_curso": 1
}
```
**⚠️ ANOTE O ID DA TURMA CRIADA!**

### 3.2. Listar Turmas
- **Método:** `GET`
- **URL:** `http://localhost:3333/api/classes`
- **Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 👥 **4. CANDIDATOS** (Requer Token)

### 4.1. ✅ Criar Candidato (CORRIGIDO)
- **Método:** `POST`
- **URL:** `http://localhost:3333/api/candidates`
- **Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```
- **Body (JSON):**
```json
{
  "nome": "Maria Silva Santos",
  "cpf": "12345678901",
  "email": "maria@email.com",
  "telefone": "11999887766",
  "turma_id": 1
}
```
**⚠️ MUDANÇAS:**
- `id_turma_desejada` → `turma_id`
- `data_nascimento` não é mais obrigatório
- `status` usa lowercase: `pendente`, `aprovado`, `reprovado`

### 4.2. Listar Candidatos
- **Método:** `GET`
- **URL:** `http://localhost:3333/api/candidates`
- **Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

### 4.3. Buscar Candidato por ID
- **Método:** `GET`
- **URL:** `http://localhost:3333/api/candidates/1`
- **Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

### 4.4. ✅ Atualizar Candidato (CORRIGIDO)
- **Método:** `PUT`
- **URL:** `http://localhost:3333/api/candidates/1`
- **Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```
- **Body (JSON):**
```json
{
  "nome": "Maria Silva Santos Atualizada",
  "email": "maria.nova@email.com",
  "telefone": "11988776655",
  "turma_id": 1
}
```
**⚠️ Use `turma_id` ao invés de `id_turma_desejada`**

### 4.5. ✅ Aprovar Candidato (CORRIGIDO)
- **Método:** `POST`
- **URL:** `http://localhost:3333/api/candidates/1/approve`
- **Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```
- **Body:** Vazio (não precisa enviar nada)

**✨ O QUE ACONTECE:**
1. Cria um usuário automaticamente com role `ALUNO`
2. Senha temporária = CPF do candidato
3. Cria o registro de aluno vinculado
4. Gera matrícula automaticamente (formato: ANO + sequência)
5. Status do candidato muda para `aprovado`

**⚠️ IMPORTANTE:** O candidato PRECISA ter `turma_id` para ser aprovado!

### 4.6. ✅ Rejeitar Candidato (CORRIGIDO)
- **Método:** `POST`
- **URL:** `http://localhost:3333/api/candidates/1/reject`
- **Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```
- **Body (JSON):**
```json
{
  "motivo": "Documentação incompleta ou outro motivo válido aqui"
}
```
**⚠️ OBRIGATÓRIO:**
- Campo `motivo` é obrigatório
- Mínimo 10 caracteres

### 4.7. Deletar Candidato
- **Método:** `DELETE`
- **URL:** `http://localhost:3333/api/candidates/1`
- **Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```
**⚠️ NÃO pode deletar candidatos aprovados!**

### 4.8. Estatísticas de Candidatos
- **Método:** `GET`
- **URL:** `http://localhost:3333/api/candidates/statistics`
- **Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 🎓 **5. ALUNOS** (Requer Token)

### 5.1. Listar Alunos
- **Método:** `GET`
- **URL:** `http://localhost:3333/api/students`
- **Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```
- **Query Params (opcionais):**
  - `?search=Maria`
  - `?page=1&limit=10`

### 5.2. Buscar Aluno por ID
- **Método:** `GET`
- **URL:** `http://localhost:3333/api/students/1`
- **Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

### 5.3. Buscar Aluno por Matrícula
- **Método:** `GET`
- **URL:** `http://localhost:3333/api/students/matricula/20240001`
- **Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 🏥 **6. HEALTH CHECK** (Público)

### 6.1. Health Check
- **Método:** `GET`
- **URL:** `http://localhost:3333/api/health`

### 6.2. Ping
- **Método:** `GET`
- **URL:** `http://localhost:3333/api/ping`

---

## 🎯 **FLUXO DE TESTE COMPLETO**

### Passo 1: Autenticação
```
1. POST /api/auth/register (criar usuário)
2. POST /api/auth/login (pegar token)
```

### Passo 2: Criar Estrutura
```
3. POST /api/courses (criar curso)
4. POST /api/classes (criar turma com id_curso)
```

### Passo 3: Candidatos
```
5. POST /api/candidates (criar candidato com turma_id)
6. GET /api/candidates (ver candidatos)
```

### Passo 4: Aprovação
```
7. POST /api/candidates/1/approve (aprovar candidato)
   - Isso cria automaticamente:
     ✓ Usuário (email do candidato, senha = CPF)
     ✓ Aluno (com matrícula gerada)
     ✓ Status do candidato = 'aprovado'
```

### Passo 5: Verificar
```
8. GET /api/students (ver alunos criados)
9. GET /api/candidates/statistics (ver estatísticas)
```

---

## 📋 **EXEMPLO COMPLETO DE REQUISIÇÕES**

### 1. Login
```bash
POST http://localhost:3333/api/auth/login
Content-Type: application/json

{
  "email": "admin@teste.com",
  "senha": "senha123"
}

# Resposta: { "token": "eyJ..." }
```

### 2. Criar Curso
```bash
POST http://localhost:3333/api/courses
Authorization: Bearer eyJ...
Content-Type: application/json

{
  "nome": "JavaScript Básico",
  "carga_horaria": 40,
  "descricao": "Curso de JS"
}

# Resposta: { "id": 1, ... }
```

### 3. Criar Turma
```bash
POST http://localhost:3333/api/classes
Authorization: Bearer eyJ...
Content-Type: application/json

{
  "nome": "Turma JS - Noite",
  "turno": "NOITE",
  "data_inicio": "2024-11-01",
  "data_fim": "2025-05-01",
  "id_curso": 1
}

# Resposta: { "id": 1, ... }
```

### 4. Criar Candidato
```bash
POST http://localhost:3333/api/candidates
Authorization: Bearer eyJ...
Content-Type: application/json

{
  "nome": "João da Silva",
  "cpf": "12345678901",
  "email": "joao@email.com",
  "telefone": "11987654321",
  "turma_id": 1
}

# Resposta: { "id": 1, "status": "pendente", ... }
```

### 5. Aprovar Candidato
```bash
POST http://localhost:3333/api/candidates/1/approve
Authorization: Bearer eyJ...

# Sem body necessário!

# Resposta:
{
  "candidate": { "id": 1, "status": "aprovado", ... },
  "student": { "id": 1, "matricula": "20240001", ... },
  "usuario": { "id": 2, "email": "joao@email.com", ... },
  "message": "Candidato aprovado e convertido em aluno com sucesso",
  "senhaTemporaria": "12345678901"
}
```

### 6. Ver Alunos
```bash
GET http://localhost:3333/api/students
Authorization: Bearer eyJ...

# Resposta: [ { "id": 1, "matricula": "20240001", ... } ]
```

---

## ⚠️ **ERROS COMUNS RESOLVIDOS**

### ❌ Antes:
```json
{
  "error": "Erro ao criar candidato",
  "details": "id_turma_desejada não existe"
}
```

### ✅ Agora:
Use `turma_id` ao invés de `id_turma_desejada`

---

### ❌ Antes:
```json
{
  "error": "Erro ao aprovar candidato",
  "details": "usuario_id é obrigatório"
}
```

### ✅ Agora:
Usuário é criado automaticamente na aprovação!

---

### ❌ Antes:
```json
{
  "error": "Motivo é obrigatório"
}
```

### ✅ Agora:
Ao rejeitar, envie:
```json
{
  "motivo": "Documentação incompleta - mínimo 10 caracteres"
}
```

---

## 🎉 **RESUMO DAS CORREÇÕES**

✅ `id_turma_desejada` → `turma_id`
✅ `data_nascimento` não é mais obrigatório
✅ Status em lowercase: `pendente`, `aprovado`, `reprovado`
✅ Aprovação cria usuário automaticamente
✅ Senha temporária = CPF do candidato
✅ Rejeição requer motivo (min 10 chars)
✅ Matrícula gerada automaticamente (formato: 20240001)

---

## 🔒 **INFORMAÇÕES IMPORTANTES**

1. **Senha padrão dos alunos**: CPF (deve ser alterada no primeiro acesso)
2. **Role dos alunos**: `ALUNO`
3. **Status inicial dos alunos**: `ativo`
4. **Matrícula**: Gerada automaticamente no formato ANOSEQUENCIA (ex: 20240001)
5. **Candidato aprovado**: Não pode ser deletado ou rejeitado
6. **Turma obrigatória**: Candidato precisa ter turma para ser aprovado

---

Agora todos os endpoints de candidatos estão funcionando corretamente! 🚀
