# 🧪 Test Module - Módulo de Testes

Este módulo contém toda a estrutura de testes do backend SUKATECH, garantindo qualidade e confiabilidade do código.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Estrutura de Testes](#-estrutura-de-testes)
- [Tecnologias de Teste](#-tecnologias-de-teste)
- [Tipos de Teste](#-tipos-de-teste)
- [Configuração](#-configuração)
- [Executando Testes](#-executando-testes)
- [Escrevendo Testes](#-escrevendo-testes)
- [Mocks e Fixtures](#-mocks-e-fixtures)
- [Coverage e Relatórios](#-coverage-e-relatórios)
- [CI/CD](#-cicd)

## 🎯 Visão Geral

O sistema de testes do SUKATECH garante:

- ✅ **Qualidade do Código** - Detecta bugs antes da produção
- 🔄 **Refatoração Segura** - Permite mudanças com confiança
- 📋 **Documentação Viva** - Testes servem como especificação
- 🚀 **Deploy Confiável** - Validação automática antes do deploy
- 🛡️ **Regressão Zero** - Previne quebras em funcionalidades existentes

## 📁 Estrutura de Testes

### Estrutura Atual

```
test/
├── 📄 health.test.ts        # Teste de health check
└── 📄 README.md             # Esta documentação
```

### Estrutura Completa Planejada

```
test/
├── 📁 unit/                 # Testes unitários
│   ├── 📁 utils/
│   │   ├── AppError.test.ts
│   │   ├── jwt.test.ts
│   │   └── user.test.ts
│   │
│   ├── 📁 modules/
│   │   ├── 📁 auth/
│   │   │   ├── auth.service.test.ts
│   │   │   └── auth.controller.test.ts
│   │   │
│   │   └── 📁 users/
│   │       ├── user.service.test.ts
│   │       ├── user.controller.test.ts
│   │       └── user.model.test.ts
│   │
│   └── 📁 middlewares/
│       ├── errorHandler.test.ts
│       ├── isAuthenticated.test.ts
│       └── validateRequest.test.ts
│
├── 📁 integration/          # Testes de integração
│   ├── 📁 routes/
│   │   ├── auth.routes.test.ts
│   │   ├── users.routes.test.ts
│   │   └── health.routes.test.ts
│   │
│   └── 📁 database/
│       ├── migrations.test.ts
│       └── models.test.ts
│
├── 📁 e2e/                  # Testes end-to-end
│   ├── auth.e2e.test.ts
│   ├── users.e2e.test.ts
│   └── complete-flow.e2e.test.ts
│
├── 📁 fixtures/             # Dados de teste
│   ├── users.json
│   ├── courses.json
│   └── database-seed.sql
│
├── 📁 helpers/              # Utilitários de teste
│   ├── setup.ts
│   ├── database.ts
│   ├── auth.ts
│   └── factories.ts
│
├── 📄 health.test.ts        # Teste básico de saúde
├── 📄 setup.ts              # Configuração global
└── 📄 README.md             # Esta documentação
```

## 🛠️ Tecnologias de Teste

### Framework Principal: Vitest

```json
// package.json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  },
  "devDependencies": {
    "vitest": "^3.2.4",
    "@vitest/ui": "^3.2.4",
    "supertest": "^7.1.4",
    "@types/supertest": "^6.0.3"
  }
}
```

### Bibliotecas Utilizadas

- **Vitest** - Framework de testes rápido e moderno
- **Supertest** - Testes de API HTTP
- **c8** - Coverage de código
- **@vitest/ui** - Interface visual para testes

### Configuração do Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.test.ts'],
    exclude: ['node_modules/**', 'dist/**'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  }
});
```

## 🔬 Tipos de Teste

### 1. Testes Unitários

**Objetivo**: Testar unidades isoladas de código

```typescript
// test/unit/utils/AppError.test.ts
import { describe, it, expect } from 'vitest';
import { AppError, isAppError } from '../../../src/utils/AppError.js';

describe('AppError', () => {
  it('should create error with message and status code', () => {
    const error = new AppError('Test error', 400);
    
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe('AppError');
  });
  
  it('should create error with details', () => {
    const details = { field: 'email', code: 'invalid' };
    const error = new AppError('Validation error', 400, details);
    
    expect(error.details).toEqual(details);
  });
  
  it('should be identified by type guard', () => {
    const error = new AppError('Test', 400);
    const regularError = new Error('Regular');
    
    expect(isAppError(error)).toBe(true);
    expect(isAppError(regularError)).toBe(false);
  });
});
```

### 2. Testes de Integração

**Objetivo**: Testar interação entre componentes

```typescript
// test/integration/routes/auth.routes.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../../../src/app.js';
import { setupTestDatabase, cleanupTestDatabase } from '../../helpers/database.js';

describe('Auth Routes Integration', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });
  
  afterEach(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('should register new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        senha: 'password123',
        role: 'INSTRUTOR'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
      expect(response.body.role).toBe(userData.role);
      expect(response.body).not.toHaveProperty('senha_hash');
    });

    it('should reject duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        senha: 'password123',
        role: 'INSTRUTOR'
      };

      // Primeiro registro
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Segundo registro com mesmo email
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);
    });
  });
});
```

### 3. Testes End-to-End

**Objetivo**: Testar fluxos completos de usuário

```typescript
// test/e2e/complete-flow.e2e.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';

describe('Complete User Flow E2E', () => {
  it('should complete full user journey', async () => {
    // 1. Registrar usuário
    const registerData = {
      email: 'instructor@test.com',
      senha: 'password123',
      role: 'INSTRUTOR'
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(registerData)
      .expect(201);

    const userId = registerResponse.body.id;

    // 2. Fazer login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: registerData.email,
        senha: registerData.senha
      })
      .expect(200);

    const token = loginResponse.body.token;

    // 3. Acessar perfil
    const profileResponse = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(profileResponse.body.user.id).toBe(userId);

    // 4. Atualizar dados
    await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'new-email@test.com' })
      .expect(200);

    // 5. Verificar atualização
    const updatedProfile = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(updatedProfile.body.user.email).toBe('new-email@test.com');
  });
});
```

## ⚙️ Configuração

### Setup Global

```typescript
// test/setup.ts
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { setupTestDatabase, cleanupTestDatabase } from './helpers/database.js';

// Configuração antes de todos os testes
beforeAll(async () => {
  console.log('🔧 Configurando ambiente de teste...');
  await setupTestDatabase();
});

// Limpeza após todos os testes
afterAll(async () => {
  console.log('🧹 Limpando ambiente de teste...');
  await cleanupTestDatabase();
});

// Limpeza entre cada teste
beforeEach(async () => {
  // Limpar dados de teste específicos se necessário
});

afterEach(async () => {
  // Cleanup pós-teste se necessário
});
```

### Helper de Banco de Dados

```typescript
// test/helpers/database.ts
import { sequelize } from '../../src/config/database.js';

export async function setupTestDatabase() {
  // Configurar banco de teste
  await sequelize.authenticate();
  await sequelize.sync({ force: true }); // Recriar tabelas
  
  // Inserir dados de teste básicos
  await seedTestData();
}

export async function cleanupTestDatabase() {
  // Limpar dados de teste
  await sequelize.truncate({ cascade: true });
}

export async function seedTestData() {
  // Inserir dados necessários para testes
  const User = (await import('../../src/modules/users/user.model.js')).default;
  
  await User.create({
    email: 'admin@test.com',
    senha_hash: 'hashed_password',
    role: 'ADMIN'
  });
}
```

### Factory de Dados

```typescript
// test/helpers/factories.ts
import { faker } from '@faker-js/faker';

export const UserFactory = {
  create: (overrides = {}) => ({
    email: faker.internet.email(),
    senha: 'password123',
    role: 'INSTRUTOR',
    ...overrides
  }),

  createAdmin: (overrides = {}) => ({
    ...UserFactory.create(),
    role: 'ADMIN',
    ...overrides
  }),

  createMultiple: (count: number, overrides = {}) => {
    return Array.from({ length: count }, () => 
      UserFactory.create(overrides)
    );
  }
};

export const CourseFactory = {
  create: (overrides = {}) => ({
    nome: faker.lorem.words(3),
    carga_horaria: faker.number.int({ min: 20, max: 200 }),
    descricao: faker.lorem.paragraph(),
    ...overrides
  })
};
```

## 🏃‍♂️ Executando Testes

### Comandos Básicos

```bash
# Executar todos os testes
npm test

# Executar em modo watch
npm run test:watch

# Executar com coverage
npm run test:coverage

# Executar interface visual
npm run test:ui

# Executar testes específicos
npm test -- auth

# Executar testes de um arquivo
npm test -- test/unit/utils/AppError.test.ts
```

### Filtros e Padrões

```bash
# Executar apenas testes unitários
npm test -- unit/

# Executar apenas testes de integração
npm test -- integration/

# Executar testes com pattern
npm test -- --grep "should create user"

# Executar testes de um módulo específico
npm test -- modules/auth/
```

### Debugging

```bash
# Executar com debug
npm test -- --inspect-brk

# Executar com logs detalhados
npm test -- --verbose

# Executar um teste isoladamente
npm test -- --run --no-coverage single-test.test.ts
```

## 📝 Escrevendo Testes

### Estrutura de Teste

```typescript
describe('Nome do módulo/função', () => {
  // Setup antes de cada teste
  beforeEach(() => {
    // Preparação
  });

  // Cleanup após cada teste
  afterEach(() => {
    // Limpeza
  });

  describe('Cenário específico', () => {
    it('should comportamento esperado', () => {
      // Arrange (preparar)
      const input = 'test input';
      
      // Act (executar)
      const result = functionUnderTest(input);
      
      // Assert (verificar)
      expect(result).toBe('expected output');
    });
  });
});
```

### Convenções

```typescript
// ✅ Nomes descritivos
describe('UserService.createUser', () => {
  it('should create user with valid data', () => {
    // teste
  });
  
  it('should throw error with invalid email', () => {
    // teste
  });
});

// ✅ Testes isolados
it('should hash password correctly', async () => {
  const password = 'test123';
  const hashed = await hashPassword(password);
  
  expect(hashed).not.toBe(password);
  expect(await verifyPassword(password, hashed)).toBe(true);
});

// ✅ Assertions específicas
expect(user.email).toBe('test@example.com'); // ✅
expect(user).toBeTruthy(); // ❌ muito genérico
```

### Testando Erros

```typescript
it('should throw AppError for invalid input', () => {
  expect(() => {
    validateInput('invalid');
  }).toThrow(AppError);
  
  expect(() => {
    validateInput('invalid');
  }).toThrow('Invalid input data');
});

// Para funções async
it('should reject with error for invalid data', async () => {
  await expect(asyncFunction('invalid')).rejects.toThrow(AppError);
});
```

## 🎭 Mocks e Fixtures

### Mockando Dependências

```typescript
// test/unit/auth/auth.service.test.ts
import { vi, describe, it, expect } from 'vitest';
import { AuthService } from '../../../src/modules/auth/auth.service.js';

// Mock do modelo User
vi.mock('../../../src/modules/users/user.model.js', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn()
  }
}));

describe('AuthService', () => {
  it('should create user successfully', async () => {
    const mockCreate = vi.fn().mockResolvedValue({
      id: 1,
      email: 'test@example.com'
    });
    
    User.create = mockCreate;
    
    const authService = new AuthService();
    const result = await authService.register({
      email: 'test@example.com',
      senha: 'password'
    });
    
    expect(mockCreate).toHaveBeenCalledWith({
      email: 'test@example.com',
      senha_hash: expect.any(String)
    });
    expect(result.email).toBe('test@example.com');
  });
});
```

### Fixtures de Dados

```json
// test/fixtures/users.json
{
  "admin": {
    "email": "admin@test.com",
    "senha": "admin123",
    "role": "ADMIN"
  },
  "instructor": {
    "email": "instructor@test.com",
    "senha": "instructor123", 
    "role": "INSTRUTOR"
  },
  "coordinator": {
    "email": "coordinator@test.com",
    "senha": "coordinator123",
    "role": "COORDENADOR"
  }
}
```

```typescript
// test/helpers/fixtures.ts
import usersData from '../fixtures/users.json';

export function getTestUser(type: 'admin' | 'instructor' | 'coordinator') {
  return { ...usersData[type] };
}

export function createTestUsers() {
  return Object.values(usersData);
}
```

## 📊 Coverage e Relatórios

### Configuração de Coverage

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/types/**',
        'src/**/*.types.ts'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
});
```

### Relatórios

```bash
# Gerar relatório de coverage
npm run test:coverage

# Visualizar relatório HTML
open coverage/index.html

# Coverage por arquivo
npm run test:coverage -- --reporter=text
```

### Metas de Coverage

| Métrica | Meta Mínima | Meta Ideal |
|---------|-------------|------------|
| Lines | 80% | 90% |
| Functions | 80% | 95% |
| Branches | 70% | 85% |
| Statements | 80% | 90% |

## 🔄 CI/CD

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: test
          MYSQL_DATABASE: sukatechdb_test
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:coverage
      env:
        DATABASE_HOST: localhost
        DATABASE_USER: root
        DATABASE_PASSWORD: test
        DATABASE_NAME: sukatechdb_test
        JWT_SECRET: test_secret_key_32_characters
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

### Scripts de Pre-commit

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test",
      "pre-push": "npm run test:coverage"
    }
  }
}
```

## 🚀 Melhorias Futuras

### Funcionalidades Planejadas

- [ ] 🎯 Testes de performance
- [ ] 🔄 Testes de stress
- [ ] 📱 Testes específicos para API mobile
- [ ] 🌐 Testes de compatibilidade de browser
- [ ] 🧪 Testes de mutação
- [ ] 📊 Dashboard de métricas de teste
- [ ] 🤖 Geração automática de testes

### Melhorias Técnicas

- [ ] 🔧 Setup de CI/CD completo
- [ ] 📈 Monitoramento de coverage trends
- [ ] 🎨 Testes visuais/screenshot
- [ ] 🚀 Paralelização de testes
- [ ] 💾 Cache de dependências de teste

---

**Módulo desenvolvido com ❤️ pela equipe SUKATECH**

> 💡 **Dica**: Testes são investimento, não custo. Escreva testes descritivos, mantenha-os simples e sempre rode os testes antes de fazer commit!