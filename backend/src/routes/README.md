# 🛣️ Routes Module - Sistema de Rotas

Este módulo centraliza todo o sistema de roteamento da API SUKATECH, organizando e distribuindo as requisições HTTP para os controladores apropriados.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Estrutura do Módulo](#-estrutura-do-módulo)
- [Router Principal](#-router-principal)
- [Organização de Rotas](#-organização-de-rotas)
- [Middlewares de Rota](#-middlewares-de-rota)
- [Versionamento de API](#-versionamento-de-api)
- [Melhores Práticas](#-melhores-práticas)
- [Exemplos de Uso](#-exemplos-de-uso)

## 🎯 Visão Geral

O sistema de rotas do SUKATECH é responsável por:

- 🛣️ **Roteamento Centralizado** - Organização hierárquica de rotas
- 🔒 **Aplicação de Middlewares** - Autenticação, validação e logging
- 📝 **Padronização de Endpoints** - Convenções REST consistentes
- ⚡ **Performance Otimizada** - Roteamento eficiente
- 🧪 **Facilidade de Teste** - Rotas isoladas e testáveis

## 📁 Estrutura do Módulo

```
src/routes/
├── 📄 index.ts             # Router principal (distribuidor)
└── 📄 README.md            # Esta documentação
```

### Estrutura Completa Prevista

```
src/routes/
├── 📄 index.ts             # Router principal
├── 📄 v1.ts                # Rotas da versão 1 da API
├── 📄 health.ts            # Rotas de health check
├── 📄 public.ts            # Rotas públicas (sem auth)
└── 📄 protected.ts         # Rotas protegidas (com auth)
```

## 🎯 Router Principal

### Implementação Atual

```typescript
// src/routes/index.ts
import { Router } from 'express';
import authRouter from '../modules/auth/auth.routes.js';
import usersRouter from '../modules/users/user.routes.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();

// Rotas de autenticação (públicas)
router.use('/auth', authRouter);

// Rotas de usuários (protegidas)
router.use('/users', usersRouter);

// Health check adicional
router.get('/ping', (_req, res) => {
  return res.json({ status: 'ok' });
});

// Rota protegida de exemplo
router.get('/me', isAuthenticated, (req, res) => {
  return res.json({ user: req.user });
});

export default router;
```

### Características

- ✅ **Modularidade** - Cada módulo possui suas próprias rotas
- ✅ **Middleware por Rota** - Aplicação seletiva de middlewares
- ✅ **Prefixos Organizados** - Agrupamento lógico por funcionalidade
- ✅ **Extensibilidade** - Fácil adição de novas rotas

## 🗺️ Organização de Rotas

### Estrutura Hierárquica

```
/api
├── /auth                   # Autenticação (público)
│   ├── POST /register      # Cadastro
│   └── POST /login         # Login
│
├── /users                  # Gestão de usuários
│   ├── GET /               # Listar usuários
│   ├── GET /:id            # Buscar por ID
│   ├── PUT /:id            # Atualizar usuário
│   └── DELETE /:id         # Deletar usuário
│
├── /courses               # Gestão de cursos
│   ├── GET /               # Listar cursos
│   ├── POST /              # Criar curso
│   ├── GET /:id            # Buscar curso
│   ├── PUT /:id            # Atualizar curso
│   └── DELETE /:id         # Deletar curso
│
├── /classes               # Gestão de turmas
│   ├── GET /               # Listar turmas
│   ├── POST /              # Criar turma
│   ├── GET /:id            # Buscar turma
│   ├── PUT /:id            # Atualizar turma
│   └── DELETE /:id         # Deletar turma
│
├── /students              # Gestão de alunos
│   ├── GET /               # Listar alunos
│   ├── POST /              # Criar aluno
│   ├── GET /:id            # Buscar aluno
│   ├── PUT /:id            # Atualizar aluno
│   └── DELETE /:id         # Deletar aluno
│
├── /instructors           # Gestão de instrutores
│   ├── GET /               # Listar instrutores
│   ├── POST /              # Criar instrutor
│   ├── GET /:id            # Buscar instrutor
│   ├── PUT /:id            # Atualizar instrutor
│   └── DELETE /:id         # Deletar instrutor
│
├── /enrollments           # Gestão de matrículas
│   ├── GET /               # Listar matrículas
│   ├── POST /              # Criar matrícula
│   ├── GET /:id            # Buscar matrícula
│   └── PUT /:id            # Atualizar status
│
├── /candidates            # Gestão de candidatos
│   ├── GET /               # Listar candidatos
│   ├── POST /              # Criar candidatura
│   ├── GET /:id            # Buscar candidato
│   └── PUT /:id/status     # Atualizar status
│
├── /attendance            # Controle de presença
│   ├── GET /class/:id      # Presenças da turma
│   ├── POST /class/:id     # Registrar presença
│   └── GET /student/:id    # Histórico do aluno
│
├── /dashboard             # Dashboard e relatórios
│   ├── GET /stats          # Estatísticas gerais
│   ├── GET /reports        # Relatórios disponíveis
│   └── GET /metrics        # Métricas do sistema
│
└── /health                # Health checks
    ├── GET /               # Status básico
    ├── GET /detailed       # Status detalhado
    └── GET /database       # Status do banco
```

### Convenções REST

| Método | Padrão | Descrição | Exemplo |
|--------|--------|-----------|---------|
| GET | `/resource` | Listar todos | `GET /api/users` |
| GET | `/resource/:id` | Buscar por ID | `GET /api/users/123` |
| POST | `/resource` | Criar novo | `POST /api/users` |
| PUT | `/resource/:id` | Atualizar completo | `PUT /api/users/123` |
| PATCH | `/resource/:id` | Atualizar parcial | `PATCH /api/users/123` |
| DELETE | `/resource/:id` | Deletar | `DELETE /api/users/123` |

## 🔒 Middlewares de Rota

### Aplicação de Middlewares

```typescript
// Exemplo de router completo com middlewares
import { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { rateLimit } from '../middlewares/rateLimit.js';

const router = Router();

// Rotas públicas (sem autenticação)
router.use('/auth', 
  rateLimit.auth,  // Rate limiting específico para auth
  authRouter
);

router.use('/public', publicRouter);

// Middleware de autenticação para todas as rotas abaixo
router.use(isAuthenticated);

// Rotas protegidas (requer autenticação)
router.use('/profile', profileRouter);
router.use('/courses', coursesRouter);

// Rotas administrativas (requer role ADMIN)
router.use('/admin', 
  authorize(['ADMIN']),
  adminRouter
);

// Rotas de instrutor (requer role INSTRUTOR ou ADMIN)
router.use('/instructor', 
  authorize(['INSTRUTOR', 'ADMIN']),
  instructorRouter
);
```

### Tipos de Middleware

#### 🔐 Autenticação
```typescript
// Verificar se o usuário está logado
router.use('/protected', isAuthenticated, protectedRouter);
```

#### 👮 Autorização
```typescript
// Verificar se o usuário tem permissão
router.use('/admin', authorize(['ADMIN']), adminRouter);
```

#### ✅ Validação
```typescript
// Validar dados de entrada
router.post('/users', 
  validateRequest(createUserSchema),
  createUser
);
```

#### 🚦 Rate Limiting
```typescript
// Limitar número de requisições
router.use('/auth/login', 
  rateLimit({ max: 5, windowMs: 15 * 60 * 1000 }),
  loginController
);
```

## 📊 Versionamento de API

### Estrutura de Versões

```typescript
// src/routes/v1.ts
import { Router } from 'express';

const v1Router = Router();

// Rotas da versão 1
v1Router.use('/auth', authV1Router);
v1Router.use('/users', usersV1Router);

export default v1Router;

// src/routes/index.ts
import v1Router from './v1.js';

const router = Router();

// Versão atual (sem prefixo para compatibilidade)
router.use('/', v1Router);

// Versão explícita
router.use('/v1', v1Router);

// Futuras versões
// router.use('/v2', v2Router);
```

### Headers de Versionamento

```typescript
// Middleware para detectar versão
export function apiVersion(req: Request, res: Response, next: NextFunction) {
  const version = req.headers['api-version'] || 'v1';
  req.apiVersion = version;
  res.setHeader('API-Version', version);
  next();
}
```

## 🛡️ Melhores Práticas

### Organização de Código

```typescript
// ✅ Agrupe rotas relacionadas
router.use('/auth', authRouter);
router.use('/users', usersRouter);

// ✅ Use middlewares específicos por grupo
router.use('/admin', isAuthenticated, authorize(['ADMIN']), adminRouter);

// ✅ Mantenha rotas RESTful
router.get('/users');        // GET /api/users
router.post('/users');       // POST /api/users
router.get('/users/:id');    // GET /api/users/123
```

### Tratamento de Erros

```typescript
// ✅ Use middleware de erro global
router.use(errorHandler);

// ✅ Valide parâmetros
router.get('/users/:id', 
  validateParams(idSchema),
  getUserById
);

// ✅ Retorne status codes apropriados
router.post('/users', (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user); // 201 Created
});
```

### Documentação

```typescript
// ✅ Documente rotas complexas
/**
 * POST /api/enrollments
 * Matricula um aluno em uma turma
 * 
 * @body {object} enrollment - Dados da matrícula
 * @body {number} enrollment.id_aluno - ID do aluno
 * @body {number} enrollment.id_turma - ID da turma
 * 
 * @returns {201} Matrícula criada com sucesso
 * @returns {400} Dados inválidos
 * @returns {409} Aluno já matriculado na turma
 */
router.post('/enrollments', 
  isAuthenticated,
  validateRequest(enrollmentSchema),
  createEnrollment
);
```

## 📝 Exemplos de Uso

### Router Básico de Módulo

```typescript
// src/modules/courses/course.routes.ts
import { Router } from 'express';
import { CourseController } from './course.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createCourseSchema, updateCourseSchema } from './course.validator.js';

const router = Router();
const courseController = new CourseController();

// Listar cursos (público)
router.get('/', courseController.list);

// Buscar curso por ID (público)
router.get('/:id', courseController.getById);

// Criar curso (protegido - ADMIN apenas)
router.post('/', 
  validateRequest(createCourseSchema),
  courseController.create
);

// Atualizar curso (protegido - ADMIN apenas)
router.put('/:id',
  validateRequest(updateCourseSchema),
  courseController.update
);

// Deletar curso (protegido - ADMIN apenas)
router.delete('/:id', courseController.delete);

export default router;
```

### Router com Middlewares Específicos

```typescript
// src/routes/instructor.ts
import { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { authorize } from '../middlewares/authorize.js';
import classesRouter from '../modules/classes/class.routes.js';
import attendanceRouter from '../modules/attendance/attendance.routes.js';

const router = Router();

// Middleware de autenticação para todas as rotas
router.use(isAuthenticated);

// Middleware de autorização para instrutores
router.use(authorize(['INSTRUTOR', 'ADMIN']));

// Rotas específicas para instrutores
router.use('/classes', classesRouter);
router.use('/attendance', attendanceRouter);

// Dashboard do instrutor
router.get('/dashboard', (req, res) => {
  // Lógica específica do dashboard do instrutor
});

export default router;
```

### Router de Health Check

```typescript
// src/routes/health.ts
import { Router } from 'express';
import { testConnection } from '../config/database.js';

const router = Router();

// Health check básico
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Health check detalhado
router.get('/detailed', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }
  };

  try {
    await testConnection();
    health.services.database = 'connected';
  } catch (error) {
    health.services.database = 'disconnected';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

export default router;
```

## 🧪 Testando Rotas

### Estrutura de Testes

```
test/routes/
├── auth.routes.test.ts
├── users.routes.test.ts
├── courses.routes.test.ts
└── health.routes.test.ts
```

### Exemplo de Teste

```typescript
// test/routes/users.routes.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Users Routes', () => {
  let authToken: string;

  beforeEach(async () => {
    // Setup: fazer login para obter token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });
    
    authToken = loginResponse.body.token;
  });

  describe('GET /api/users', () => {
    it('should list users when authenticated', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    it('should return 401 when not authenticated', async () => {
      await request(app)
        .get('/api/users')
        .expect(401);
    });
  });
});
```

## 🚀 Expansões Futuras

### Funcionalidades Planejadas

- [ ] 🔄 Rate limiting avançado por usuário
- [ ] 📊 Métricas de uso de rotas
- [ ] 🔍 Logging estruturado de requests
- [ ] 📝 Documentação automática (Swagger)
- [ ] 🌐 CORS configurável por rota
- [ ] 🚀 Cache de responses
- [ ] 📱 Rotas específicas para mobile

### Melhorias Técnicas

- [ ] 🧪 Testes de integração completos
- [ ] 📈 Performance monitoring
- [ ] 🔐 Auditoria de acessos
- [ ] 🛡️ Proteção contra ataques
- [ ] 📋 Validação de headers

---

**Módulo desenvolvido com ❤️ pela equipe SUKATECH**

> 💡 **Dica**: Mantenha as rotas organizadas, use middlewares apropriados e sempre documente endpoints complexos. A estrutura de rotas é a interface da sua API!