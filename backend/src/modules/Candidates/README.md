# Módulo de Candidatos e Alunos

Sistema de gerenciamento de candidatos e sua conversão em alunos.

## Visão Geral

Este módulo é responsável por:
- Gerenciar candidatos às turmas dos cursos
- Aprovar/Rejeitar candidatos
- Converter candidatos aprovados em alunos
- Gerenciar cadastro de alunos
- Fornecer estatísticas de candidatos e alunos

## Fluxo de Trabalho

1. **Candidato é criado** com dados pessoais e turma desejada
2. **Status inicial**: PENDENTE
3. **Aprovação**: Candidato é aprovado e automaticamente convertido em aluno (Status: APROVADO)
4. **Rejeição**: Candidato é rejeitado com motivo (Status: REJEITADO)
5. **Aluno criado**: Recebe matrícula única automática

## Endpoints - Candidatos

### 1. Listar Candidatos
```http
GET /api/candidates
```

#### Query Parameters (Filtros)
- `nome` (string): Filtrar por nome parcial
- `cpf` (string): Filtrar por CPF
- `email` (string): Filtrar por email parcial  
- `status` (string): PENDENTE | APROVADO | REJEITADO
- `id_turma_desejada` (number): Filtrar por turma desejada

#### Exemplo de Requisição
```bash
curl -X GET "http://localhost:3000/api/candidates?status=PENDENTE&nome=João" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

#### Resposta de Sucesso (200)
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "cpf": "12345678901",
    "email": "joao@example.com",
    "telefone": "11999999999",
    "status": "PENDENTE",
    "id_turma_desejada": 1,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z",
    "turma_desejada": {
      "id": 1,
      "nome": "Turma Python 2024-1",
      "turno": "MANHA"
    }
  }
]
```

---

### 2. Buscar Candidato por ID
```http
GET /api/candidates/:id
```

#### Exemplo de Requisição
```bash
curl -X GET "http://localhost:3000/api/candidates/1" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

#### Resposta de Sucesso (200)
```json
{
  "id": 1,
  "nome": "João Silva",
  "cpf": "12345678901",
  "email": "joao@example.com",
  "telefone": "11999999999",
  "status": "PENDENTE",
  "id_turma_desejada": 1,
  "turma_desejada": {
    "id": 1,
    "nome": "Turma Python 2024-1",
    "turno": "MANHA",
    "data_inicio": "2024-01-15",
    "data_fim": "2024-06-30"
  }
}
```

#### Erro (404)
```json
{
  "error": "Candidato não encontrado"
}
```

---

### 3. Criar Candidato
```http
POST /api/candidates
```

#### Body Parameters
- `nome` (string, obrigatório): Nome completo (mín 3, máx 100 caracteres)
- `cpf` (string, obrigatório): CPF com 11 dígitos numéricos
- `email` (string, obrigatório): Email válido
- `telefone` (string, opcional): Telefone de contato
- `id_turma_desejada` (number, opcional): ID da turma desejada

#### Exemplo de Requisição
```bash
curl -X POST "http://localhost:3000/api/candidates" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "cpf": "98765432100",
    "email": "maria@example.com",
    "telefone": "11988888888",
    "id_turma_desejada": 1
  }'
```

#### Resposta de Sucesso (201)
```json
{
  "id": 2,
  "nome": "Maria Santos",
  "cpf": "98765432100",
  "email": "maria@example.com",
  "telefone": "11988888888",
  "status": "PENDENTE",
  "id_turma_desejada": 1,
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

#### Erros Possíveis
- **400 - Validação**: Dados inválidos
- **409 - Conflito**: CPF já cadastrado como candidato ou aluno
- **404**: Turma não encontrada

---

### 4. Atualizar Candidato
```http
PUT /api/candidates/:id
```

#### Body Parameters (todos opcionais)
- `nome` (string): Nome completo
- `email` (string): Email válido
- `telefone` (string): Telefone
- `status` (string): PENDENTE | APROVADO | REJEITADO
- `id_turma_desejada` (number): ID da turma

⚠️ **Importante**: Não é possível alterar dados de candidato aprovado

#### Exemplo de Requisição
```bash
curl -X PUT "http://localhost:3000/api/candidates/1" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva Atualizado",
    "telefone": "11977777777"
  }'
```

#### Resposta de Sucesso (200)
```json
{
  "id": 1,
  "nome": "João Silva Atualizado",
  "cpf": "12345678901",
  "email": "joao@example.com",
  "telefone": "11977777777",
  "status": "PENDENTE",
  "id_turma_desejada": 1
}
```

---

### 5. Deletar Candidato
```http
DELETE /api/candidates/:id
```

⚠️ **Importante**: Não é possível deletar candidato aprovado

#### Exemplo de Requisição
```bash
curl -X DELETE "http://localhost:3000/api/candidates/1" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

#### Resposta de Sucesso (200)
```json
{
  "message": "Candidato deletado com sucesso"
}
```

---

### 6. Aprovar Candidato
```http
POST /api/candidates/:id/approve
```

✨ **Ação Especial**: Converte automaticamente o candidato em aluno com matrícula única

#### Exemplo de Requisição
```bash
curl -X POST "http://localhost:3000/api/candidates/1/approve" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

#### Resposta de Sucesso (200)
```json
{
  "candidate": {
    "id": 1,
    "nome": "João Silva",
    "status": "APROVADO"
  },
  "student": {
    "id": 1,
    "matricula": "2024001",
    "nome": "João Silva",
    "cpf": "12345678901",
    "email": "joao@example.com",
    "telefone": "11999999999"
  },
  "message": "Candidato aprovado e convertido em aluno com sucesso"
}
```

#### Erros Possíveis
- **404**: Candidato não encontrado
- **400**: Candidato já foi aprovado

---

### 7. Rejeitar Candidato
```http
POST /api/candidates/:id/reject
```

#### Body Parameters
- `motivo` (string, obrigatório): Motivo da rejeição (mín 10 caracteres)

⚠️ **Importante**: Não é possível rejeitar candidato aprovado

#### Exemplo de Requisição
```bash
curl -X POST "http://localhost:3000/api/candidates/1/reject" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "motivo": "Documentação incompleta - falta comprovante de residência"
  }'
```

#### Resposta de Sucesso (200)
```json
{
  "candidate": {
    "id": 1,
    "nome": "João Silva",
    "status": "REJEITADO"
  },
  "message": "Candidato rejeitado: Documentação incompleta - falta comprovante de residência"
}
```

---

### 8. Estatísticas de Candidatos
```http
GET /api/candidates/statistics
```

#### Exemplo de Requisição
```bash
curl -X GET "http://localhost:3000/api/candidates/statistics" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

#### Resposta de Sucesso (200)
```json
{
  "total": 150,
  "porStatus": {
    "PENDENTE": 60,
    "APROVADO": 70,
    "REJEITADO": 20
  },
  "porTurma": [
    {
      "id_turma": 1,
      "nome_turma": "Turma Python 2024-1",
      "total": 80
    },
    {
      "id_turma": 2,
      "nome_turma": "Turma Java 2024-1",
      "total": 70
    }
  ]
}
```

---

## Endpoints - Alunos

### 1. Listar Alunos
```http
GET /api/students
```

#### Query Parameters (Filtros)
- `nome` (string): Filtrar por nome parcial
- `cpf` (string): Filtrar por CPF
- `matricula` (string): Filtrar por matrícula parcial
- `email` (string): Filtrar por email parcial

#### Exemplo de Requisição
```bash
curl -X GET "http://localhost:3000/api/students?nome=João" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

#### Resposta de Sucesso (200)
```json
[
  {
    "id": 1,
    "matricula": "2024001",
    "nome": "João Silva",
    "cpf": "12345678901",
    "email": "joao@example.com",
    "telefone": "11999999999",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
]
```

---

### 2. Buscar Aluno por ID
```http
GET /api/students/:id
```

#### Exemplo
```bash
curl -X GET "http://localhost:3000/api/students/1" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

---

### 3. Buscar Aluno por CPF
```http
GET /api/students/cpf/:cpf
```

#### Exemplo
```bash
curl -X GET "http://localhost:3000/api/students/cpf/12345678901" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

---

### 4. Buscar Aluno por Matrícula
```http
GET /api/students/matricula/:matricula
```

#### Exemplo
```bash
curl -X GET "http://localhost:3000/api/students/matricula/2024001" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

---

### 5. Atualizar Aluno
```http
PUT /api/students/:id
```

#### Body Parameters (todos opcionais)
- `nome` (string): Nome completo
- `email` (string): Email válido
- `telefone` (string): Telefone

⚠️ **Importante**: CPF e matrícula não podem ser alterados

#### Exemplo de Requisição
```bash
curl -X PUT "http://localhost:3000/api/students/1" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva Junior",
    "email": "joao.junior@example.com"
  }'
```

---

### 6. Deletar Aluno
```http
DELETE /api/students/:id
```

#### Exemplo
```bash
curl -X DELETE "http://localhost:3000/api/students/1" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

---

### 7. Estatísticas de Alunos
```http
GET /api/students/statistics
```

#### Resposta de Sucesso (200)
```json
{
  "total": 100,
  "porAno": {
    "2024": 80,
    "2023": 20
  },
  "recentes": 15
}
```

---

## Validações

### CPF
- Deve conter exatamente 11 dígitos numéricos
- Validação de dígitos verificadores implementada
- Não pode haver duplicação entre candidatos ou alunos

### Email
- Deve ser um email válido
- Convertido automaticamente para minúsculas

### Nome
- Mínimo: 3 caracteres
- Máximo: 100 caracteres

### Telefone
- Máximo: 20 caracteres
- Campo opcional

### Motivo de Rejeição
- Mínimo: 10 caracteres
- Obrigatório ao rejeitar candidato

---

## Regras de Negócio

1. **CPF Único**: Um CPF não pode estar cadastrado como candidato e aluno simultaneamente
2. **Aprovação Irreversível**: Candidato aprovado não pode ser editado, rejeitado ou deletado
3. **Matrícula Automática**: Ao aprovar candidato, matrícula é gerada automaticamente no formato YYYYNNN
4. **Status Imutável**: Ao aprovar, status passa para APROVADO automaticamente
5. **Turma Desejada**: Deve existir no sistema antes de associar ao candidato

---

## Códigos de Status HTTP

- **200**: Sucesso (GET, PUT, DELETE, POST approve/reject)
- **201**: Criado com sucesso (POST create)
- **400**: Erro de validação ou regra de negócio
- **401**: Não autenticado
- **404**: Recurso não encontrado
- **409**: Conflito (CPF duplicado)
- **500**: Erro interno do servidor

---

## Exemplos de Uso Completo

### Fluxo Completo: Da Candidatura à Matrícula

```bash
# 1. Criar candidato
curl -X POST "http://localhost:3000/api/candidates" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Carlos Souza",
    "cpf": "11122233344",
    "email": "carlos@example.com",
    "telefone": "11966666666",
    "id_turma_desejada": 1
  }'

# Resposta: { "id": 5, "status": "PENDENTE", ... }

# 2. Listar candidatos pendentes
curl -X GET "http://localhost:3000/api/candidates?status=PENDENTE" \
  -H "Authorization: Bearer $TOKEN"

# 3. Aprovar candidato (converte em aluno)
curl -X POST "http://localhost:3000/api/candidates/5/approve" \
  -H "Authorization: Bearer $TOKEN"

# Resposta: 
# {
#   "candidate": { "id": 5, "status": "APROVADO" },
#   "student": { "id": 3, "matricula": "2024003", "nome": "Carlos Souza", ... }
# }

# 4. Buscar aluno criado
curl -X GET "http://localhost:3000/api/students/matricula/2024003" \
  -H "Authorization: Bearer $TOKEN"

# 5. Ver estatísticas
curl -X GET "http://localhost:3000/api/candidates/statistics" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Testes

O módulo possui **47 testes automatizados**:
- **28 testes de Candidatos**: Cobertura completa de CRUD, aprovação, rejeição e estatísticas
- **19 testes de Alunos**: Cobertura de listagem, busca, atualização e estatísticas

Para executar:
```bash
npm test
```

---

## Estrutura de Arquivos

```
backend/src/modules/
├── Candidates/
│   ├── candidate.model.ts      # Modelo Sequelize com validações
│   ├── candidate.service.ts    # Lógica de negócio
│   ├── candidate.controller.ts # Manipulação de requisições
│   ├── candidate.routes.ts     # Definição de rotas
│   └── candidate.validator.ts  # Schemas de validação Zod
└── students/
    ├── student.model.ts        # Modelo Sequelize
    ├── student.service.ts      # Lógica de negócio
    ├── student.controller.ts   # Manipulação de requisições
    ├── student.routes.ts       # Definição de rotas
    └── student.validator.ts    # Schemas de validação Zod
```

---

## Tecnologias Utilizadas

- **TypeScript**: Tipagem estática
- **Express.js**: Framework web
- **Sequelize**: ORM para MySQL
- **Zod**: Validação de schemas
- **JWT**: Autenticação
- **Vitest**: Testes automatizados

---

## Próximos Passos

- [ ] Adicionar notificações por email ao aprovar/rejeitar
- [ ] Implementar histórico de alterações de status
- [ ] Adicionar upload de documentos do candidato
- [ ] Criar dashboard com métricas de aprovação
- [ ] Implementar paginação nas listagens

---

**Desenvolvido por**: Equipe SUKATECH  
**Última atualização**: Janeiro 2025
