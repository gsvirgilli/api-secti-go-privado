# 🗺️ MAPA DE PROBLEMAS E SOLUÇÕES

Guia visual de todos os problemas encontrados no projeto e suas soluções.

---

## 🔴 CRÍTICOS (AGORA)

### Problema 1: JWT_SECRET Fraco

```
🔴 SEVERIDADE: CRÍTICA
⚠️ RISCO: Senhas podem ser quebradas em horas
📍 ARQUIVO: .env
⏱️ TEMPO: 5 minutos
```

**Problema:**
```env
JWT_SECRET=jwt_secret  # ❌ Muito fraco!
```

**Solução:**
```bash
# Gerar chave segura
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Resultado:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Adicionar em .env:
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

**Status**: ✅ FÁCIL DE CORRIGIR

---

### Problema 2: CORS Sem Restrição

```
🔴 SEVERIDADE: CRÍTICA
⚠️ RISCO: Qualquer site pode acessar sua API
📍 ARQUIVO: backend/src/app.ts
⏱️ TEMPO: 5 minutos
```

**Problema:**
```typescript
app.use(cors()); // ❌ Aceita requisições de QUALQUER origem
```

**Solução:**
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Status**: ✅ FÁCIL DE CORRIGIR

---

### Problema 3: npm audit Vulnerabilidades

```
🔴 SEVERIDADE: MÉDIA-ALTA
⚠️ RISCO: 6 vulnerabilidades conhecidas (1 baixa, 3 média, 2 alta)
📍 ARQUIVO: package.json
⏱️ TEMPO: 5 minutos
```

**Problema:**
```
npm audit
# 6 vulnerabilities (1 low, 3 moderate, 2 high)
```

**Solução:**
```bash
cd backend
npm audit fix
npm audit fix --force  # Se necessário
npm audit             # Verificar se resolveu
```

**Status**: ✅ AUTOMÁTICO

---

### Problema 4: Variáveis de Ambiente Faltando

```
🔴 SEVERIDADE: ALTA
⚠️ RISCO: Deploy no Render vai falhar
📍 ARQUIVO: Render Dashboard
⏱️ TEMPO: 5 minutos
```

**Problema:**
```
Deploy no Render: "DATABASE_HOST is required"
```

**Solução:**
1. Acessar: https://dashboard.render.com
2. Seu serviço > Environment
3. Adicionar:
```env
APP_PORT=3333
JWT_SECRET=<seu_secret>
DATABASE_HOST=<seu_host>
DATABASE_USER=<seu_user>
DATABASE_PASSWORD=<sua_senha>
DATABASE_NAME=sukatechdb
DATABASE_PORT=3306
FRONTEND_URL=<seu_frontend>
```

**Status**: ✅ FÁCIL DE CORRIGIR

---

## ⚠️ IMPORTANTES (ESTA SEMANA)

### Problema 5: TypeScript Sem Strict Mode

```
⚠️ SEVERIDADE: MÉDIA
⚠️ RISCO: Erros de tipo não detectados em tempo de compile
📍 ARQUIVO: backend/tsconfig.json
⏱️ TEMPO: 10 minutos
```

**Problema:**
```json
"strict": false  // ❌ Permite erros de tipo
```

**Solução:**
```json
"strict": true   // ✅ Força tipagem correta
```

**Efeito:**
```
npm run build
# Pode gerar erros que precisam ser corrigidos
# Mas isso é BOM - melhor descobrir agora do que em produção
```

**Status**: ✅ RECOMENDADO

---

### Problema 6: Sem Pool de Conexões

```
⚠️ SEVERIDADE: MÉDIA
⚠️ RISCO: Em alta carga, conexões ao DB podem esgotar
📍 ARQUIVO: backend/src/config/database.ts
⏱️ TEMPO: 5 minutos
```

**Problema:**
```typescript
// Sem pool de conexões = limite de 10 conexões padrão
new Sequelize(..., { host, port, dialect })
```

**Solução:**
```typescript
new Sequelize(..., {
  host, port, dialect,
  pool: {
    max: 5,           // Máximo simultâneo
    min: 0,           // Mínimo
    acquire: 30000,   // Timeout
    idle: 10000       // Timeout ociosa
  }
})
```

**Status**: ✅ RECOMENDADO

---

### Problema 7: Falta .dockerignore

```
⚠️ SEVERIDADE: BAIXA-MÉDIA
⚠️ RISCO: Imagem Docker fica grande (~400MB)
📍 ARQUIVO: backend/.dockerignore (novo)
⏱️ TEMPO: 2 minutos
```

**Problema:**
```dockerfile
COPY . .  # Copia TUDO, incluindo node_modules
# Imagem final: ~400MB
```

**Solução:**
Criar `backend/.dockerignore`:
```
node_modules
dist
.git
.env
test
coverage
*.log
```

**Resultado:**
```
Imagem final: ~200MB (50% menor!)
```

**Status**: ✅ RECOMENDADO

---

## ℹ️ RECOMENDADOS (DEPOIS)

### Problema 8: Sem Logger Estruturado

```
ℹ️ SEVERIDADE: BAIXA
ℹ️ RISCO: Logs usando console.log (não ideal para produção)
📍 ARQUIVO: Múltiplos arquivos
⏱️ TEMPO: 1-2 horas
```

**Problema:**
```typescript
console.log('Erro:', error);  // ❌ Não estruturado
```

**Solução:**
```bash
npm install winston
```

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.error('Erro importante', { error });
```

**Status**: ⏳ FUTURO

---

### Problema 9: Sem Monitoring (Sentry)

```
ℹ️ SEVERIDADE: BAIXA
ℹ️ RISCO: Erros em produção não são capturados automaticamente
📍 ARQUIVO: backend/src/app.ts
⏱️ TEMPO: 1 hora
```

**Problema:**
```
Erro em produção → Ninguém sabe que aconteceu
```

**Solução:**
```bash
npm install @sentry/node
```

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.errorHandler());
```

**Status**: ⏳ FUTURO

---

### Problema 10: Sem CI/CD Pipeline

```
ℹ️ SEVERIDADE: BAIXA
ℹ️ RISCO: Deploy manual é propenso a erros
📍 ARQUIVO: .github/workflows/deploy.yml
⏱️ TEMPO: 2 horas
```

**Problema:**
```
Deploy manual → Fácil esquecer passo
```

**Solução:**
Criar GitHub Actions:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
      - run: npm test
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm run build
      # Deploy automático
```

**Status**: ⏳ FUTURO

---

## 📊 TABELA RESUMIDA

| # | Problema | Severidade | Tempo | Status |
|---|----------|-----------|-------|--------|
| 1 | JWT_SECRET fraco | 🔴 Crítica | 5 min | ✅ Fazer hoje |
| 2 | CORS sem restrição | 🔴 Crítica | 5 min | ✅ Fazer hoje |
| 3 | npm audit vulns | 🔴 Alta | 5 min | ✅ Fazer hoje |
| 4 | Vars de ambiente | 🔴 Alta | 5 min | ✅ Fazer hoje |
| 5 | TypeScript strict | ⚠️ Média | 10 min | ✅ Esta semana |
| 6 | Pool conexões | ⚠️ Média | 5 min | ✅ Esta semana |
| 7 | .dockerignore | ⚠️ Média | 2 min | ✅ Esta semana |
| 8 | Logger | ℹ️ Baixa | 1h | ⏳ Depois |
| 9 | Monitoring | ℹ️ Baixa | 1h | ⏳ Depois |
| 10 | CI/CD | ℹ️ Baixa | 2h | ⏳ Depois |

---

## ✅ CHECKLIST DE CORREÇÃO

### 🔴 CRÍTICOS
- [ ] Gerar JWT_SECRET (node command)
- [ ] Adicionar JWT_SECRET no .env
- [ ] Corrigir CORS em app.ts
- [ ] Executar npm audit fix
- [ ] Adicionar vars no Render Dashboard

### ⚠️ IMPORTANTES
- [ ] Mudar tsconfig strict para true
- [ ] Adicionar pool em database.ts
- [ ] Criar .dockerignore
- [ ] Testar npm run build
- [ ] Testar npm run dev

### ℹ️ FUTUROS
- [ ] Adicionar Winston logger
- [ ] Configurar Sentry
- [ ] Criar CI/CD com GitHub Actions
- [ ] Adicionar Swagger docs
- [ ] Configurar backups

---

## 🎯 PRÓXIMOS PASSOS

1. **Agora**: Leia `GUIA_RAPIDO_30MIN.md`
2. **Hoje**: Implemente os 4 críticos
3. **Esta semana**: Implemente os 3 importantes
4. **Este mês**: Implemente futuros

---

**Mapa atualizado**: 27 de Novembro de 2025
