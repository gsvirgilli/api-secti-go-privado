# Feature: Candidatura Pública

## 📋 Descrição

Implementação de endpoint público para candidatura de alunos sem necessidade de autenticação.

## 🚀 O que foi implementado

### 1. **Endpoint Público**
- `POST /api/candidates/public` - Criar candidatura sem autenticação

### 2. **Validações**
- ✅ CPF único (não pode haver duplicatas)
- ✅ Email único (não pode haver duplicatas)
- ✅ CPF válido (formato e dígitos verificadores)
- ✅ Curso existe no sistema
- ✅ Turno disponível para o curso escolhido

### 3. **Novos Campos no Model Candidate**
- **Endereço:**
  - `cep` (8 dígitos)
  - `rua`
  - `numero`
  - `complemento`
  - `bairro`
  - `cidade`
  - `estado` (2 letras - UF)

- **Curso e Turno:**
  - `curso_id` (referência para `cursos.id`)
  - `turno` (ENUM: 'MATUTINO' | 'VESPERTINO' | 'NOTURNO')

### 4. **Migration**
- Arquivo: `20241103000001_add_public_candidate_fields.js`
- Adiciona os novos campos na tabela `candidatos`

## 📝 Como usar

### Request

```bash
POST /api/candidates/public
Content-Type: application/json

{
  "nome": "João Silva",
  "cpf": "12345678900",
  "email": "joao@email.com",
  "telefone": "11999999999",
  "data_nascimento": "1990-01-15",
  "cep": "01234567",
  "rua": "Rua Exemplo",
  "numero": "123",
  "complemento": "Apto 45",
  "bairro": "Centro",
  "cidade": "São Paulo",
  "estado": "SP",
  "curso_id": 1,
  "turno": "MATUTINO"
}
```

### Response Success (201)

```json
{
  "message": "Candidatura enviada com sucesso",
  "data": {
    "id": 123,
    "nome": "João Silva",
    "email": "joao@email.com",
    "status": "pendente",
    "curso": {
      "id": 1,
      "nome": "Python Básico"
    },
    "turno": "MATUTINO",
    "createdAt": "2025-11-03T10:30:00.000Z"
  }
}
```

### Response Error (400 - CPF inválido)

```json
{
  "error": "CPF inválido"
}
```

### Response Error (409 - CPF já cadastrado)

```json
{
  "error": "Já existe uma candidatura com este CPF"
}
```

### Response Error (404 - Curso não encontrado)

```json
{
  "error": "Curso não encontrado ou inativo"
}
```

### Response Error (400 - Turno não disponível)

```json
{
  "error": "Não há turmas disponíveis no turno selecionado para este curso"
}
```

## 🧪 Como testar

### 1. Rodar a migration

```bash
cd backend
npm run migrate
```

### 2. Testar com curl

```bash
curl -X POST http://localhost:3333/api/candidates/public \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "cpf": "12345678900",
    "email": "joao@email.com",
    "telefone": "11999999999",
    "data_nascimento": "1990-01-15",
    "curso_id": 1,
    "turno": "MATUTINO"
  }'
```

### 3. Testar com Insomnia/Postman

Importar requisição:
- Method: POST
- URL: `http://localhost:3333/api/candidates/public`
- Headers: `Content-Type: application/json`
- Body: ver exemplo acima

## 📂 Arquivos Modificados

```
backend/src/modules/Candidates/
├── candidate.controller.ts    (+ método createPublic)
├── candidate.service.ts       (+ método createPublic)
├── candidate.model.ts         (+ campos de endereço, curso_id, turno)
├── candidate.routes.ts        (+ rota POST /public)
└── candidate.validator.ts     (+ publicCandidateSchema)

backend/src/database/migrations/
└── 20241103000001_add_public_candidate_fields.js (nova)
```

## ✅ Checklist de Implementação

- [x] Schema de validação para candidatura pública
- [x] Método `createPublic` no controller
- [x] Método `createPublic` no service com validações
- [x] Novos campos no model (endereço + curso/turno)
- [x] Rota pública `POST /public` sem autenticação
- [x] Migration para adicionar campos no banco
- [x] Validação de CPF único
- [x] Validação de email único
- [x] Verificação de curso existente
- [x] Verificação de turno disponível

## 🔄 Próximos Passos

1. Rodar a migration no ambiente de desenvolvimento
2. Testar endpoint manualmente
3. Criar testes automatizados (opcional)
4. Fazer commit e push da branch
5. Criar Pull Request

## 🐛 Possíveis Melhorias Futuras

- [ ] Adicionar recaptcha para evitar spam
- [ ] Enviar email de confirmação ao candidato
- [ ] Limitar número de candidaturas por CPF
- [ ] Adicionar campo de anexo de documentos
- [ ] Validação de idade mínima (baseada em data_nascimento)
