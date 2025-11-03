# Sistema de Auditoria (Audit Logs)

Sistema completo de logs de auditoria para rastreabilidade e compliance.

## 📋 Sumário

- [Características](#características)
- [Estrutura](#estrutura)
- [Endpoints API](#endpoints-api)
- [Exemplos de Uso](#exemplos-de-uso)
- [Integração com Rotas](#integração-com-rotas)
- [Tipos de Ações](#tipos-de-ações)

## ✨ Características

- ✅ Registro automático de CREATE, UPDATE, DELETE
- ✅ Logs de LOGIN e LOGOUT
- ✅ Armazenamento de estado anterior/novo (JSON)
- ✅ Captura de IP e User Agent
- ✅ Filtros avançados (usuário, entidade, ação, data)
- ✅ Paginação em todos os endpoints
- ✅ Estatísticas agregadas
- ✅ Apenas administradores podem visualizar
- ✅ Documentação Swagger completa

## 📁 Estrutura

```
src/modules/audit/
├── audit-log.model.ts       # Modelo Sequelize
├── audit-log.service.ts     # Lógica de negócio
├── audit-log.controller.ts  # Controllers HTTP
└── audit-log.routes.ts      # Rotas e Swagger docs

src/middlewares/
├── audit.middleware.ts      # Middleware de auditoria automática
└── isAdmin.ts              # Middleware de verificação admin
```

## 🌐 Endpoints API

### 1. Listar Logs (com filtros)

```http
GET /api/audit-logs
```

**Query Parameters:**
- `page` (number): Número da página (default: 1)
- `limit` (number): Registros por página (default: 10)
- `usuario_id` (number): Filtrar por usuário
- `acao` (string): Filtrar por ação (CREATE, UPDATE, DELETE, LOGIN, LOGOUT, APPROVE, REJECT)
- `entidade` (string): Filtrar por entidade (turma, aluno, curso, etc)
- `entidade_id` (number): Filtrar por ID da entidade
- `data_inicio` (ISO 8601): Data inicial
- `data_fim` (ISO 8601): Data final

**Resposta:**
```json
{
  "data": [
    {
      "id": 1,
      "usuario_id": 13,
      "acao": "CREATE",
      "entidade": "turma",
      "entidade_id": 1,
      "dados_anteriores": null,
      "dados_novos": {"nome": "Turma Teste", "status": "ATIVA"},
      "ip": "192.168.1.100",
      "user_agent": "Mozilla/5.0...",
      "descricao": "Turma criada via teste",
      "createdAt": "2025-11-03T18:33:55.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 6,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### 2. Estatísticas

```http
GET /api/audit-logs/stats
```

**Query Parameters:**
- `data_inicio` (ISO 8601): Data inicial
- `data_fim` (ISO 8601): Data final

**Resposta:**
```json
{
  "total": 6,
  "por_acao": [
    {"acao": "CREATE", "total": 3},
    {"acao": "UPDATE", "total": 1},
    {"acao": "DELETE", "total": 1},
    {"acao": "LOGIN", "total": 1}
  ],
  "por_entidade": [
    {"entidade": "turma", "total": 3},
    {"entidade": "aluno", "total": 1},
    {"entidade": "auth", "total": 1}
  ]
}
```

### 3. Logs de um Usuário

```http
GET /api/audit-logs/user/:id
```

**Path Parameters:**
- `id` (number): ID do usuário

**Query Parameters:**
- `page` (number): Página
- `limit` (number): Registros por página

### 4. Logs de uma Entidade

```http
GET /api/audit-logs/entity/:type/:id
```

**Path Parameters:**
- `type` (string): Tipo da entidade (turma, aluno, curso, etc)
- `id` (number): ID da entidade

**Query Parameters:**
- `page` (number): Página
- `limit` (number): Registros por página

### 5. Log Específico

```http
GET /api/audit-logs/:id
```

**Path Parameters:**
- `id` (number): ID do log

## 🔧 Exemplos de Uso

### cURL

```bash
# Listar todos os logs
curl -X GET "http://localhost:3333/api/audit-logs?page=1&limit=10" \
  -H "Authorization: Bearer SEU_TOKEN"

# Estatísticas
curl -X GET "http://localhost:3333/api/audit-logs/stats" \
  -H "Authorization: Bearer SEU_TOKEN"

# Logs de uma turma específica
curl -X GET "http://localhost:3333/api/audit-logs/entity/turma/1" \
  -H "Authorization: Bearer SEU_TOKEN"

# Filtrar por ação
curl -X GET "http://localhost:3333/api/audit-logs?acao=CREATE&limit=5" \
  -H "Authorization: Bearer SEU_TOKEN"

# Filtrar por período
curl -X GET "http://localhost:3333/api/audit-logs?data_inicio=2025-11-01T00:00:00Z&data_fim=2025-11-30T23:59:59Z" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### JavaScript (Fetch)

```javascript
// Listar logs
const response = await fetch('http://localhost:3333/api/audit-logs?page=1&limit=10', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const { data, pagination } = await response.json();

// Estatísticas
const statsResponse = await fetch('http://localhost:3333/api/audit-logs/stats', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const stats = await statsResponse.json();
console.log(`Total de logs: ${stats.total}`);
```

### Axios

```javascript
import axios from 'axios';

// Listar logs de um usuário
const { data } = await axios.get(`http://localhost:3333/api/audit-logs/user/13`, {
  headers: {
    'Authorization': `Bearer ${token}`
  },
  params: {
    page: 1,
    limit: 20
  }
});

// Logs de uma entidade específica
const logs = await axios.get(`http://localhost:3333/api/audit-logs/entity/turma/5`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🔌 Integração com Rotas

### Middleware Automático

Use o middleware `auditMiddleware` para registrar automaticamente ações:

```typescript
import { auditMiddleware } from '../../middlewares/audit.middleware.js';

// Em suas rotas
router.post('/turmas', 
  isAuthenticated,
  auditMiddleware({
    entidade: 'turma',
    getEntityId: (req) => req.body.id,
  }),
  classController.create
);

router.put('/turmas/:id',
  isAuthenticated,
  auditMiddleware({
    entidade: 'turma',
    getEntityId: (req) => Number(req.params.id),
    getOldData: async (req) => {
      const turma = await Class.findByPk(req.params.id);
      return turma?.toJSON();
    }
  }),
  classController.update
);

router.delete('/turmas/:id',
  isAuthenticated,
  auditMiddleware({
    entidade: 'turma',
    getEntityId: (req) => Number(req.params.id),
    getOldData: async (req) => {
      const turma = await Class.findByPk(req.params.id);
      return turma?.toJSON();
    }
  }),
  classController.delete
);
```

### Login/Logout

```typescript
import { auditLogin, auditLogout } from '../../middlewares/audit.middleware.js';

// Registrar login
router.post('/auth/login', auditLogin, authController.login);

// Registrar logout
router.post('/auth/logout', isAuthenticated, auditLogout, authController.logout);
```

### Registro Manual

Para casos especiais, você pode registrar logs manualmente:

```typescript
import auditLogService from '../modules/audit/audit-log.service.js';

// Em um controller ou service
await auditLogService.createLog({
  usuario_id: req.user?.id,
  acao: 'APPROVE',
  entidade: 'candidato',
  entidade_id: candidatoId,
  dados_novos: { status: 'APROVADO' },
  ip: auditLogService.getIpFromRequest(req),
  user_agent: auditLogService.getUserAgentFromRequest(req),
  descricao: 'Candidato aprovado para matrícula'
});
```

## 📊 Tipos de Ações

| Ação | Descrição | Uso |
|------|-----------|-----|
| `CREATE` | Criação de registro | POST |
| `UPDATE` | Atualização de registro | PUT/PATCH |
| `DELETE` | Exclusão de registro | DELETE |
| `LOGIN` | Autenticação de usuário | Login |
| `LOGOUT` | Encerramento de sessão | Logout |
| `APPROVE` | Aprovação (ex: candidato) | Ação manual |
| `REJECT` | Rejeição (ex: candidato) | Ação manual |

## 🔒 Segurança

- ✅ Apenas administradores (`ADMIN`) podem visualizar logs
- ✅ Middleware `isAdmin` protege todos os endpoints
- ✅ Logs não podem ser deletados ou editados
- ✅ Captura automática de IP e User Agent
- ✅ Armazena estado antes/depois para auditoria completa

## 🧪 Testes Realizados

### ✅ Endpoints Testados

- [x] `GET /api/audit-logs` - Listagem com paginação
- [x] `GET /api/audit-logs/stats` - Estatísticas agregadas
- [x] `GET /api/audit-logs/entity/:type/:id` - Filtro por entidade
- [x] `GET /api/audit-logs/user/:id` - Filtro por usuário
- [x] Paginação funcionando corretamente
- [x] Filtros (ação, entidade, usuário, data) funcionando
- [x] Permissão admin validada

### Exemplo de Teste

```bash
# Resultado: 6 logs encontrados
GET /api/audit-logs
✅ Status: 200
✅ Dados: 6 registros
✅ Paginação: total=6, totalPages=1

# Resultado: Estatísticas corretas
GET /api/audit-logs/stats
✅ Total: 6
✅ Por ação: CREATE(3), UPDATE(1), DELETE(1), LOGIN(1)
✅ Por entidade: turma(3), aluno(1), auth(1), curso(1)

# Resultado: Filtro por entidade
GET /api/audit-logs/entity/turma/1
✅ Status: 200
✅ Dados: 3 registros da turma ID 1
```

## 📝 Próximos Passos

- [ ] Integrar middleware nas rotas existentes (classes, students, etc)
- [ ] Adicionar testes unitários
- [ ] Implementar política de retenção (limpeza automática de logs antigos)
- [ ] Adicionar export de logs (CSV/Excel)
- [ ] Dashboard visual de auditoria no frontend

## 🐛 Troubleshooting

### Erro: "Access denied. Admin privileges required."
- Verifique se o usuário tem role `ADMIN`
- Confirme que o token JWT está correto

### Tabela não existe
- Execute a migration: `backend/migrations/20251103_create_audit_logs.sql`
- Verifique se a tabela `audit_logs` existe no banco

### Logs não são registrados automaticamente
- Verifique se o middleware `auditMiddleware` está registrado nas rotas
- Confirme que a resposta é 2xx (sucesso)
- Veja logs do backend para erros de auditoria

## 📚 Referências

- [Modelo](./audit-log.model.ts)
- [Service](./audit-log.service.ts)
- [Controller](./audit-log.controller.ts)
- [Routes](./audit-log.routes.ts)
- [Middleware](../../middlewares/audit.middleware.ts)
- [Migration](../../migrations/20251103_create_audit_logs.sql)
