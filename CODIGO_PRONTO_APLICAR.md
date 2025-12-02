# 🔧 CÓDIGO PRONTO PARA APLICAR

Este arquivo contém as correções recomendadas prontas para implementar.

---

## 1. CORS Seguro (backend/src/app.ts)

**Substitua:**
```typescript
const app = express();
app.use(cors());
app.use(express.json());
```

**Por:**
```typescript
const app = express();

// CORS configurado com segurança
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 horas
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

---

## 2. Pool de Conexões (backend/src/config/database.ts)

**Substitua:**
```typescript
export const sequelize = new Sequelize(
  env.DATABASE_NAME,
  env.DATABASE_USER,
  env.DATABASE_PASSWORD,
  {
    host: databaseHost,
    port: env.DATABASE_PORT,
    dialect: 'mysql', 
    logging: isTest ? false : console.log,
  }
);
```

**Por:**
```typescript
export const sequelize = new Sequelize(
  env.DATABASE_NAME,
  env.DATABASE_USER,
  env.DATABASE_PASSWORD,
  {
    host: databaseHost,
    port: env.DATABASE_PORT,
    dialect: 'mysql', 
    logging: isTest ? false : console.log,
    // Pool de conexões para melhor performance
    pool: {
      max: 5,           // Máximo de conexões simultâneas
      min: 0,           // Mínimo de conexões
      acquire: 30000,   // Timeout para adquirir conexão (ms)
      idle: 10000       // Timeout para conexão ociosa (ms)
    },
    // Reconnect automático
    dialect: 'mysql',
    retry: {
      max: 5,
      match: [
        /PROTOCOL_CONNECTION_LOST/,
        /PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR/,
        /PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR/,
        /ER_BAD_DB_ERROR/
      ]
    }
  }
);
```

---

## 3. TypeScript Strict Mode (backend/tsconfig.json)

**Substitua:**
```json
{
  "compilerOptions": {
    "strict": false,
```

**Por:**
```json
{
  "compilerOptions": {
    "strict": true,
```

---

## 4. .dockerignore (backend/.dockerignore - NOVO ARQUIVO)

```
node_modules
dist
.git
.env
.env.local
.env.production
test
coverage
*.log
logs/
.DS_Store
.vscode
.idea
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.next/
out/
build/
.cache/
.turbo/
```

---

## 5. Arquivo .env melhorado (backend/.env - EXEMPLO)

```env
# Servidor
APP_PORT=3333

# Banco de Dados
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=sua_senha_mysql
DATABASE_NAME=sukatechdb
DATABASE_PORT=3306

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_minimo_32_chars
JWT_EXPIRES_IN=7d

# Frontend (para CORS)
FRONTEND_URL=http://localhost:5173

# Environment
NODE_ENV=development

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_app
```

---

## 6. Script para Gerar JWT_SECRET Seguro

**Crie arquivo**: `backend/scripts/generate-jwt-secret.js`

```javascript
#!/usr/bin/env node

const crypto = require('crypto');

// Gerar JWT_SECRET seguro (32 bytes = 256 bits)
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Gerar Database Password seguro
const dbPassword = crypto.randomBytes(16).toString('hex');

console.log('\n🔐 JWT Secret (use em JWT_SECRET):');
console.log(jwtSecret);

console.log('\n🔐 Database Password (use em DATABASE_PASSWORD):');
console.log(dbPassword);

console.log('\n💡 Copie e cole no seu .env ou no Render Environment Variables');
```

**Use assim:**
```bash
node backend/scripts/generate-jwt-secret.js
```

---

## 7. Middleware de Segurança Global (backend/src/middlewares/security.middleware.ts - NOVO)

```typescript
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Rate limit global
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',
  standardHeaders: true, // Retorna informação de rate limit em `RateLimit-*` headers
  legacyHeaders: false, // Desabilita `X-RateLimit-*` headers
});

// Rate limit mais rigoroso para login
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Máximo 5 tentativas de login
  message: 'Muitas tentativas de login, tente novamente em 15 minutos.',
  skipSuccessfulRequests: true, // Não contar requisições bem-sucedidas
});

// Segurança - Headers
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
}
```

**Adicione em backend/src/app.ts:**
```typescript
import { securityHeaders, globalRateLimiter } from './middlewares/security.middleware.js';

// Depois de cors
app.use(securityHeaders);
app.use(globalRateLimiter);
```

---

## 8. Variáveis de Ambiente Validadas (backend/src/config/environment.ts - MELHORADO)

**Substitua por:**
```typescript
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  // Servidor
  APP_PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database
  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_USER: z.string().default('root'),
  DATABASE_PASSWORD: z.string().default(''),
  DATABASE_NAME: z.string().default('sukatechdb'),
  DATABASE_PORT: z.coerce.number().default(3306),

  // JWT
  JWT_SECRET: z.string()
    .min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres')
    .default('dev_jwt_secret_change_in_production_xxxxxxxxxxxxxxxx'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Frontend (CORS)
  FRONTEND_URL: z.string().default('http://localhost:5173'),
});

export const env = envSchema.parse(process.env);

// Validação em startup
if (env.NODE_ENV === 'production') {
  if (env.JWT_SECRET.length < 32) {
    throw new Error('❌ ERRO: JWT_SECRET é muito curto em produção (mínimo 32 caracteres)');
  }
  if (env.JWT_SECRET === 'dev_jwt_secret_change_in_production_xxxxxxxxxxxxxxxx') {
    throw new Error('❌ ERRO: JWT_SECRET padrão detectado em produção! Use um valor seguro.');
  }
}
```

---

## 9. Package.json com Scripts Adicionados

**Adicione à seção scripts:**
```json
"scripts": {
  "build": "tsc",
  "start": "node --import tsx/esm src/server.ts",
  "dev": "nodemon --ext ts,json --exec tsx src/server.ts",
  "migrate": "sequelize-cli db:migrate",
  "migrate:undo": "sequelize-cli db:migrate:undo",
  "test": "vitest run",
  "test:watch": "vitest",
  "generate-secrets": "node scripts/generate-jwt-secret.js",
  "audit:fix": "npm audit fix",
  "docker:build": "docker build -t api-secti .",
  "docker:up": "docker-compose up",
  "docker:down": "docker-compose down"
}
```

---

## 10. Render Configuration (.render.yaml - ATUALIZADO)

```yaml
buildCommand: cd backend && npm install && npm run build
startCommand: cd backend && node --import tsx/esm src/server.ts

services:
  - type: web
    name: api-secti-backend
    runtime: node
    plan: starter
    region: ohio
    numInstances: 1
    
    envVars:
      - key: NODE_ENV
        value: production
      - key: NODE_VERSION
        value: '20'
```

---

## 11. .gitignore atualizado (backend/.gitignore)

```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.production
.env.test

# Build output
dist/
build/
tsconfig.tsbuildinfo

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Database
mysql_data/
*.sql

# Cache
.turbo/
.next/
```

---

## Como Aplicar Estas Mudanças

### Opção 1: Manual (Recomendado - para revisar)

1. Abra cada arquivo mencionado
2. Substitua conforme indicado
3. Salve
4. Teste localmente: `npm run dev`
5. Execute testes: `npm test`
6. Build: `npm run build`

### Opção 2: Automático (Bash Script)

Crie arquivo `apply-fixes.sh`:

```bash
#!/bin/bash

echo "🔧 Aplicando correções..."

# 1. Criar .dockerignore
cat > backend/.dockerignore << 'EOF'
node_modules
dist
.git
.env
.env.local
test
coverage
*.log
EOF

# 2. Criar script de geração de secrets
mkdir -p backend/scripts
cat > backend/scripts/generate-jwt-secret.js << 'EOF'
#!/usr/bin/env node
const crypto = require('crypto');
const jwtSecret = crypto.randomBytes(32).toString('hex');
const dbPassword = crypto.randomBytes(16).toString('hex');
console.log('\n🔐 JWT Secret:');
console.log(jwtSecret);
console.log('\n🔐 Database Password:');
console.log(dbPassword);
EOF

chmod +x backend/scripts/generate-jwt-secret.js

echo "✅ Correções aplicadas!"
echo ""
echo "📝 Próximos passos:"
echo "1. Revise backend/src/app.ts (CORS)"
echo "2. Revise backend/src/config/database.ts (Pool)"
echo "3. Revise backend/tsconfig.json (strict mode)"
echo "4. Execute: npm run generate-secrets"
echo "5. Copie o JWT_SECRET para .env"
echo "6. Execute: npm run build"
echo "7. Faça commit e push"
```

**Use assim:**
```bash
chmod +x apply-fixes.sh
./apply-fixes.sh
```

---

## Resumo Final

| Arquivo | Mudança | Crítico |
|---------|---------|---------|
| app.ts | CORS com restrições | 🔴 SIM |
| database.ts | Pool de conexões | ⚠️ Sim |
| tsconfig.json | strict = true | ⚠️ Sim |
| .dockerignore | Novo arquivo | ✅ Não |
| environment.ts | Validação melhorada | ✅ Não |
| .env | Exemplo melhorado | ✅ Não |

---

**Pronto para copiar e colar! 🚀**
