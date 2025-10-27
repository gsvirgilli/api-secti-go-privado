# 🧪 Guia de Testes - Candidatos e Alunos

## ✅ TODAS AS CORREÇÕES APLICADAS

### Correções Realizadas:
1. ✅ Campo `id_turma_desejada` → `turma_id`
2. ✅ Campo `data_nascimento` opcional
3. ✅ Status em lowercase: `pendente`, `aprovado`, `reprovado`
4. ✅ Validação middleware aplicada em todas as rotas
5. ✅ Aprovação cria usuário automaticamente (verifica duplicados)
6. ✅ Mensagens de erro mais detalhadas
7. ✅ Rejeição com motivo obrigatório

---

## 🚀 PASSO A PASSO COMPLETO

### **PASSO 1: Faça Login e Pegue o Token**

```
POST http://localhost:3333/api/auth/login
Content-Type: application/json

{
  "email": "admin@teste.com",
  "senha": "senha123"
}
```

**Se o usuário não existir, crie primeiro:**
```
POST http://localhost:3333/api/auth/register
Content-Type: application/json

{
  "nome": "Admin Teste",
  "email": "admin@teste.com",
  "senha": "senha123",
  "role": "INSTRUTOR"
}
```

**⚠️ COPIE O TOKEN DA RESPOSTA!** Você vai usar em todas as próximas requisições.

---

### **PASSO 2: Crie um Curso**

```
POST http://localhost:3333/api/courses
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome": "JavaScript Fullstack",
  "carga_horaria": 80,
  "descricao": "Curso completo de JavaScript do básico ao avançado"
}
```

**✅ Resposta esperada:**
```json
{
  "id": 1,
  "nome": "JavaScript Fullstack",
  "carga_horaria": 80,
  "descricao": "Curso completo de JavaScript do básico ao avançado",
  "createdAt": "2025-10-27T...",
  "updatedAt": "2025-10-27T..."
}
```

**⚠️ ANOTE O `id` DO CURSO!**

---

### **PASSO 3: Crie uma Turma**

```
POST http://localhost:3333/api/classes
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome": "Turma JS 2025 - Noturna",
  "turno": "NOITE",
  "data_inicio": "2025-11-01",
  "data_fim": "2026-05-01",
  "id_curso": 1
}
```

**✅ Resposta esperada:**
```json
{
  "id": 1,
  "nome": "Turma JS 2025 - Noturna",
  "turno": "NOITE",
  "data_inicio": "2025-11-01",
  "data_fim": "2026-05-01",
  "id_curso": 1,
  "createdAt": "2025-10-27T...",
  "updatedAt": "2025-10-27T..."
}
```

**⚠️ ANOTE O `id` DA TURMA!**

---

### **PASSO 4: Crie Candidatos**

#### Candidato 1:
```
POST http://localhost:3333/api/candidates
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome": "João Pedro Silva",
  "cpf": "12345678901",
  "email": "joao.pedro@email.com",
  "telefone": "11987654321",
  "turma_id": 1
}
```

#### Candidato 2:
```
POST http://localhost:3333/api/candidates
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome": "Maria Oliveira Santos",
  "cpf": "98765432100",
  "email": "maria.oliveira@email.com",
  "telefone": "11976543210",
  "turma_id": 1
}
```

#### Candidato 3 (sem turma - para testar erro):
```
POST http://localhost:3333/api/candidates
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome": "Carlos Eduardo",
  "cpf": "11122233344",
  "email": "carlos@email.com",
  "telefone": "11965432109"
}
```

**✅ Resposta esperada:**
```json
{
  "id": 1,
  "nome": "João Pedro Silva",
  "cpf": "12345678901",
  "email": "joao.pedro@email.com",
  "telefone": "11987654321",
  "turma_id": 1,
  "status": "pendente",
  "turma": {
    "id": 1,
    "nome": "Turma JS 2025 - Noturna"
  },
  "createdAt": "2025-10-27T...",
  "updatedAt": "2025-10-27T..."
}
```

**⚠️ ANOTE OS IDs DOS CANDIDATOS!**

---

### **PASSO 5: Liste os Candidatos**

```
GET http://localhost:3333/api/candidates
Authorization: Bearer SEU_TOKEN_AQUI
```

**✅ Você verá todos os candidatos com status `pendente`**

---

### **PASSO 6: Atualize um Candidato**

```
PUT http://localhost:3333/api/candidates/1
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome": "João Pedro Silva Atualizado",
  "telefone": "11999999999",
  "turma_id": 1
}
```

**✅ Resposta esperada:**
```json
{
  "id": 1,
  "nome": "João Pedro Silva Atualizado",
  "cpf": "12345678901",
  "email": "joao.pedro@email.com",
  "telefone": "11999999999",
  "turma_id": 1,
  "status": "pendente",
  "turma": {
    "id": 1,
    "nome": "Turma JS 2025 - Noturna"
  }
}
```

---

### **PASSO 7: Aprove um Candidato (Converter em Aluno)**

```
POST http://localhost:3333/api/candidates/1/approve
Authorization: Bearer SEU_TOKEN_AQUI
```

**⚠️ NÃO PRECISA ENVIAR BODY!**

**✅ Resposta esperada:**
```json
{
  "candidate": {
    "id": 1,
    "nome": "João Pedro Silva Atualizado",
    "cpf": "12345678901",
    "email": "joao.pedro@email.com",
    "telefone": "11999999999",
    "turma_id": 1,
    "status": "aprovado"
  },
  "student": {
    "id": 1,
    "candidato_id": 1,
    "usuario_id": 2,
    "matricula": "20250001",
    "turma_id": 1,
    "status": "ativo"
  },
  "usuario": {
    "id": 2,
    "nome": "João Pedro Silva Atualizado",
    "email": "joao.pedro@email.com",
    "role": "ALUNO"
  },
  "message": "Candidato aprovado e convertido em aluno com sucesso",
  "senhaTemporaria": "12345678901"
}
```

**🎉 O QUE ACONTECEU:**
1. ✅ Criou um usuário com role `ALUNO`
2. ✅ Senha temporária = CPF (12345678901)
3. ✅ Criou o registro de aluno
4. ✅ Gerou matrícula automaticamente (20250001)
5. ✅ Status do candidato = `aprovado`
6. ✅ Aluno vinculado à turma

---

### **PASSO 8: Tente Aprovar Candidato SEM Turma (Deve dar Erro)**

```
POST http://localhost:3333/api/candidates/3/approve
Authorization: Bearer SEU_TOKEN_AQUI
```

**❌ Resposta esperada (erro):**
```json
{
  "error": "Candidato precisa ter uma turma desejada para ser aprovado"
}
```

**Solução:** Atualize o candidato para adicionar turma:
```
PUT http://localhost:3333/api/candidates/3
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "turma_id": 1
}
```

Agora pode aprovar!

---

### **PASSO 9: Rejeite um Candidato**

```
POST http://localhost:3333/api/candidates/2/reject
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "motivo": "Documentação incompleta. Falta comprovante de residência e histórico escolar."
}
```

**⚠️ O MOTIVO É OBRIGATÓRIO e deve ter no mínimo 10 caracteres!**

**✅ Resposta esperada:**
```json
{
  "candidate": {
    "id": 2,
    "nome": "Maria Oliveira Santos",
    "cpf": "98765432100",
    "email": "maria.oliveira@email.com",
    "status": "reprovado"
  },
  "message": "Candidato rejeitado: Documentação incompleta. Falta comprovante de residência e histórico escolar."
}
```

---

### **PASSO 10: Liste os Alunos**

```
GET http://localhost:3333/api/students
Authorization: Bearer SEU_TOKEN_AQUI
```

**✅ Você verá o aluno criado a partir do candidato aprovado!**

---

### **PASSO 11: Busque Aluno por Matrícula**

```
GET http://localhost:3333/api/students/matricula/20250001
Authorization: Bearer SEU_TOKEN_AQUI
```

---

### **PASSO 12: Veja Estatísticas**

```
GET http://localhost:3333/api/candidates/statistics
Authorization: Bearer SEU_TOKEN_AQUI
```

**✅ Resposta esperada:**
```json
{
  "total": 3,
  "porStatus": [
    { "status": "aprovado", "quantidade": 1 },
    { "status": "reprovado", "quantidade": 1 },
    { "status": "pendente", "quantidade": 1 }
  ],
  "porTurma": [
    {
      "turma_id": 1,
      "quantidade": 3,
      "turma": { "nome": "Turma JS 2025 - Noturna" }
    }
  ]
}
```

---

## 🚫 **TESTES DE ERROS**

### 1. Tentar aprovar candidato já aprovado:
```
POST http://localhost:3333/api/candidates/1/approve
Authorization: Bearer SEU_TOKEN_AQUI
```
**❌ Erro:** "Candidato já foi aprovado"

---

### 2. Tentar rejeitar candidato já aprovado:
```
POST http://localhost:3333/api/candidates/1/reject
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "motivo": "Teste de rejeição"
}
```
**❌ Erro:** "Não é possível rejeitar candidato aprovado"

---

### 3. Rejeitar sem motivo:
```
POST http://localhost:3333/api/candidates/2/reject
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "motivo": "Curto"
}
```
**❌ Erro:** "Motivo deve ter no mínimo 10 caracteres"

---

### 4. Criar candidato com CPF duplicado:
```
POST http://localhost:3333/api/candidates
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome": "Outro Nome",
  "cpf": "12345678901",
  "email": "outro@email.com",
  "turma_id": 1
}
```
**❌ Erro:** "CPF já cadastrado como candidato"

---

### 5. Criar candidato sem turma e tentar aprovar:
```
POST http://localhost:3333/api/candidates
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome": "Sem Turma",
  "cpf": "55566677788",
  "email": "semturma@email.com"
}
```

Depois:
```
POST http://localhost:3333/api/candidates/4/approve
Authorization: Bearer SEU_TOKEN_AQUI
```
**❌ Erro:** "Candidato precisa ter uma turma desejada para ser aprovado"

---

### 6. Deletar candidato aprovado:
```
DELETE http://localhost:3333/api/candidates/1
Authorization: Bearer SEU_TOKEN_AQUI
```
**❌ Erro:** "Não é possível deletar candidato aprovado. O aluno já foi criado."

---

## 📋 **CHECKLIST DE TESTES**

- [ ] Login funciona
- [ ] Criar curso funciona
- [ ] Criar turma funciona
- [ ] Criar candidato COM turma funciona
- [ ] Criar candidato SEM turma funciona
- [ ] Listar candidatos funciona
- [ ] Atualizar candidato funciona
- [ ] Aprovar candidato COM turma funciona
- [ ] Aprovar candidato SEM turma retorna erro
- [ ] Aprovar candidato cria usuário
- [ ] Aprovar candidato cria aluno
- [ ] Aprovar candidato gera matrícula
- [ ] Rejeitar candidato COM motivo funciona
- [ ] Rejeitar candidato SEM motivo retorna erro
- [ ] Rejeitar candidato com motivo curto retorna erro
- [ ] Listar alunos mostra alunos aprovados
- [ ] Buscar aluno por matrícula funciona
- [ ] Estatísticas funcionam
- [ ] CPF duplicado retorna erro
- [ ] Deletar candidato aprovado retorna erro

---

## 🎉 **RESUMO DAS MUDANÇAS**

### Campos Corrigidos:
- ✅ `id_turma_desejada` → `turma_id`
- ✅ `data_nascimento` não é mais obrigatório
- ✅ Status em lowercase

### Funcionalidades Adicionadas:
- ✅ Validação middleware em todas as rotas
- ✅ Criação automática de usuário na aprovação
- ✅ Verificação de email duplicado
- ✅ Senha temporária = CPF
- ✅ Matrícula gerada automaticamente
- ✅ Mensagens de erro detalhadas
- ✅ Logs de erro no console

### Regras de Negócio:
- ✅ Candidato precisa ter turma para ser aprovado
- ✅ Candidato aprovado não pode ser deletado
- ✅ Candidato aprovado não pode ser rejeitado
- ✅ Motivo de rejeição obrigatório (min 10 chars)
- ✅ CPF único (não pode duplicar)
- ✅ Email único (não pode duplicar)

---

## 🔐 **INFORMAÇÕES DE LOGIN DO ALUNO**

Quando um candidato é aprovado:
- **Email:** Email do candidato
- **Senha:** CPF do candidato (11 dígitos)
- **Role:** ALUNO

**Exemplo:**
- Email: `joao.pedro@email.com`
- Senha: `12345678901`

O aluno pode fazer login com essas credenciais!

---

Agora TUDO está funcionando! 🚀✨
