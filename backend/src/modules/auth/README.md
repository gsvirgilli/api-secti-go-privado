# 🔐 Auth Module - Módulo de Autenticação

Este módulo é responsável por toda a lógica de autenticação e autorização do sistema SUKATECH.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Estrutura do Módulo](#-estrutura-do-módulo)
- [Funcionalidades](#-funcionalidades)
- [API Endpoints](#-api-endpoints)
- [Fluxos de Autenticação](#-fluxos-de-autenticação)
- [Modelos de Dados](#-modelos-de-dados)
- [Validações](#-validações)
- [Segurança](#-segurança)
- [Exemplos de Uso](#-exemplos-de-uso)

## 🎯 Visão Geral

O módulo de autenticação implementa um sistema robusto baseado em **JWT (JSON Web Tokens)** com as seguintes características:

- ✅ Registro de novos usuários
- ✅ Login seguro com validação de credenciais
- ✅ Hash de senhas com bcrypt
- ✅ Geração e validação de tokens JWT
- ✅ Sistema de roles e permissões
- ✅ Middleware de autenticação
- ✅ Validação rigorosa de dados de entrada

## 📁 Estrutura do Módulo

```
src/modules/auth/
├── 📄 auth.controller.ts    # Controladores HTTP
├── 📄 auth.service.ts       # Lógica de negócio
├── 📄 auth.routes.ts        # Definição de rotas
└── 📄 auth.validator.ts     # Validação de dados
```

### Arquitetura em Camadas

```
┌─────────────────┐
│ auth.routes.ts  │ ← Definição de rotas HTTP
└─────────────────┘
         │
         ▼
┌─────────────────┐
│auth.controller.ts│ ← Controladores HTTP
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ auth.service.ts │ ← Lógica de negócio
└─────────────────┘
         │
         ▼
┌─────────────────┐
│auth.validator.ts│ ← Validação de dados
└─────────────────┘
```

## ⚡ Funcionalidades

### 🆕 Registro de Usuários (`register`)

**Responsabilidade**: Criar novos usuários no sistema

**Processo**:
1. Validação dos dados de entrada
2. Verificação de email único
3. Hash da senha com bcrypt
4. Criação do usuário no banco
5. Retorno dos dados (sem senha)

**Validações**:
- Email válido e único
- Senha com mínimo de 8 caracteres
- Role válido (ADMIN, INSTRUTOR, COORDENADOR)

### 🔑 Login de Usuários (`login`)

**Responsabilidade**: Autenticar usuários existentes

**Processo**:
1. Validação dos dados de entrada
2. Busca do usuário por email
3. Verificação da senha com bcrypt
4. Geração do token JWT
5. Retorno do token e dados do usuário

**Validações**:
- Email e senha obrigatórios
- Credenciais válidas
- Usuário ativo no sistema

## 🛣️ API Endpoints

### POST `/api/auth/register`

**Descrição**: Cadastro de novo usuário

**Request Body**:
```json
{
  "email": "usuario@exemplo.com",
  "senha": "minhasenha123",
  "role": "INSTRUTOR"
}
```

**Response (201)**:
```json
{
  "id": 1,
  "email": "usuario@exemplo.com",
  "role": "INSTRUTOR",
  "createdAt": "2024-10-06T10:00:00.000Z",
  "updatedAt": "2024-10-06T10:00:00.000Z"
}
```

**Possíveis Erros**:
- `400` - Dados inválidos
- `409` - Email já existe

### POST `/api/auth/login`

**Descrição**: Autenticação de usuário

**Request Body**:
```json
{
  "email": "usuario@exemplo.com",
  "senha": "minhasenha123"
}
```

**Response (200)**:
```json
{
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "role": "INSTRUTOR"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Possíveis Erros**:
- `400` - Dados inválidos
- `401` - Credenciais incorretas

## 🔄 Fluxos de Autenticação

### Fluxo de Registro

```mermaid
sequenceDiagram
    participant C as Cliente
    participant AC as AuthController
    participant AS as AuthService
    participant V as Validator
    participant D as Database

    C->>AC: POST /auth/register
    AC->>V: validate(data)
    V-->>AC: validated data
    AC->>AS: register(userData)
    AS->>D: checkEmailExists()
    D-->>AS: email available
    AS->>AS: hashPassword()
    AS->>D: createUser()
    D-->>AS: user created
    AS-->>AC: user data
    AC-->>C: 201 {user}
```

### Fluxo de Login

```mermaid
sequenceDiagram
    participant C as Cliente
    participant AC as AuthController
    participant AS as AuthService
    participant V as Validator
    participant D as Database
    participant J as JWT Utils

    C->>AC: POST /auth/login
    AC->>V: validate(credentials)
    V-->>AC: validated data
    AC->>AS: login(credentials)
    AS->>D: findUserByEmail()
    D-->>AS: user data
    AS->>AS: validatePassword()
    AS->>J: generateToken()
    J-->>AS: JWT token
    AS-->>AC: {user, token}
    AC-->>C: 200 {user, token}
```

## 📊 Modelos de Dados

### Usuário (User)

```typescript
interface User {
  id: number;                    // ID único do usuário
  email: string;                 // Email único (login)
  senha_hash: string;            // Senha hashada com bcrypt
  role: UserRole;                // Papel do usuário no sistema
  createdAt: Date;               // Data de criação
  updatedAt: Date;               // Data de atualização
}

enum UserRole {
  ADMIN = 'ADMIN',               // Administrador do sistema
  INSTRUTOR = 'INSTRUTOR',       // Professor/Instrutor
  COORDENADOR = 'COORDENADOR'    // Coordenador de cursos
}
```

### DTOs (Data Transfer Objects)

```typescript
// Registro de usuário
interface RegisterDTO {
  email: string;
  senha: string;
  role: UserRole;
}

// Login de usuário
interface LoginDTO {
  email: string;
  senha: string;
}

// Resposta de autenticação
interface AuthResponse {
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
  token: string;
}

// Usuário autenticado (payload do JWT)
interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}
```

## ✅ Validações

### Schema de Registro

```typescript
const registerSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
  
  senha: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
  
  role: z
    .enum(['ADMIN', 'INSTRUTOR', 'COORDENADOR'])
    .default('INSTRUTOR')
});
```

### Schema de Login

```typescript
const loginSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
  
  senha: z
    .string()
    .min(1, 'Senha é obrigatória')
});
```

## 🛡️ Segurança

### Hash de Senhas

- **Algoritmo**: bcrypt com salt rounds = 12
- **Nunca** armazenar senhas em texto plano
- **Nunca** retornar senhas nas respostas da API

```typescript
import bcrypt from 'bcryptjs';

// Hash da senha
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verificação da senha
const isValid = await bcrypt.compare(password, hashedPassword);
```

### JWT Tokens

- **Algoritmo**: HS256
- **Payload**: ID do usuário e role
- **Expiração**: Configurável via ENV (padrão: 1 dia)
- **Secret**: Obrigatório via variável de ambiente

```typescript
// Geração do token
const token = jwt.sign(
  { sub: user.id, email: user.email, role: user.role },
  JWT_SECRET,
  { expiresIn: JWT_EXPIRES_IN }
);

// Verificação do token
const payload = jwt.verify(token, JWT_SECRET);
```

### Middleware de Autenticação

```typescript
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Unauthorized', 401);
  }

  const token = authHeader.replace('Bearer ', '').trim();
  
  try {
    const payload = verifyJwt<{ sub: string }>(token);
    req.user = { id: payload.sub, ...payload } as AuthUser;
    return next();
  } catch {
    throw new AppError('Invalid token', 401);
  }
}
```

## 📝 Exemplos de Uso

### Registrar Novo Usuário

```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "instrutor@sukatech.com",
    "senha": "senhaSegura123",
    "role": "INSTRUTOR"
  }'
```

### Fazer Login

```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "instrutor@sukatech.com",
    "senha": "senhaSegura123"
  }'
```

### Usar Token em Rota Protegida

```bash
curl -X GET http://localhost:3333/api/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Exemplo em JavaScript/TypeScript

```typescript
// Cliente exemplo
class AuthClient {
  private baseUrl = 'http://localhost:3333/api';
  private token: string | null = null;

  async register(userData: RegisterDTO) {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error('Erro no registro');
    }
    
    return response.json();
  }

  async login(credentials: LoginDTO) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      throw new Error('Erro no login');
    }
    
    const data = await response.json();
    this.token = data.token; // Armazenar token para uso futuro
    return data;
  }

  async getProfile() {
    if (!this.token) {
      throw new Error('Usuário não autenticado');
    }

    const response = await fetch(`${this.baseUrl}/me`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar perfil');
    }
    
    return response.json();
  }
}
```

## 🔧 Configuração

### Variáveis de Ambiente Necessárias

```env
# JWT Configuration
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_min_32_chars
JWT_EXPIRES_IN=1d

# Database (para acesso aos usuários)
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=sukatechdb
DATABASE_PORT=3306
```

### Configuração de Desenvolvimento

```typescript
// config/environment.ts
const envSchema = z.object({
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres'),
  
  JWT_EXPIRES_IN: z
    .string()
    .default('1d'),
    
  // ... outras configurações
});
```

## 🧪 Testes

### Estrutura de Testes

```
test/modules/auth/
├── auth.controller.test.ts
├── auth.service.test.ts
└── auth.integration.test.ts
```

### Exemplo de Teste

```typescript
describe('Auth Controller', () => {
  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
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
      expect(response.body).not.toHaveProperty('senha_hash');
    });

    it('should return 400 for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        senha: 'password123',
        role: 'INSTRUTOR'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });
  });
});
```

## 🚀 Melhorias Futuras

### Funcionalidades Planejadas

- [ ] 🔐 Autenticação via OAuth (Google, Microsoft)
- [ ] 📧 Confirmação de email no registro
- [ ] 🔄 Refresh tokens
- [ ] 🔒 Reset de senha via email
- [ ] 📱 Autenticação de dois fatores (2FA)
- [ ] 📊 Log de tentativas de login
- [ ] ⏰ Sessões com timeout configurável
- [ ] 🚫 Bloqueio temporário após tentativas falhas

### Melhorias Técnicas

- [ ] 🧪 Testes unitários completos
- [ ] 📝 Rate limiting específico para auth
- [ ] 🔍 Auditoria de segurança
- [ ] 💾 Cache de tokens válidos
- [ ] 📈 Métricas de autenticação

---

**Módulo desenvolvido com ❤️ pela equipe SUKATECH**

> 💡 **Dica**: Este módulo é fundamental para a segurança do sistema. Sempre mantenha as dependências atualizadas e siga as melhores práticas de segurança.