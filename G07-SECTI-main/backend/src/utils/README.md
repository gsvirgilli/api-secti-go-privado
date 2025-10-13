# 🛠️ Utils Module - Módulo de Utilitários

Este módulo contém funções utilitárias e helpers que são reutilizados em todo o sistema SUKATECH.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Estrutura do Módulo](#-estrutura-do-módulo)
- [AppError - Gerenciamento de Erros](#-apperror---gerenciamento-de-erros)
- [JWT Utils - Utilitários JWT](#-jwt-utils---utilitários-jwt)
- [User Utils - Utilitários de Usuário](#-user-utils---utilitários-de-usuário)
- [Melhores Práticas](#-melhores-práticas)
- [Exemplos de Uso](#-exemplos-de-uso)

## 🎯 Visão Geral

O módulo de utilitários centraliza funcionalidades comuns que são utilizadas em múltiplos pontos da aplicação, promovendo:

- 🔄 **Reutilização de Código** - Evita duplicação
- 🧹 **Código Limpo** - Funções focadas e específicas
- 🛡️ **Tipo-Segurança** - Utilitários totalmente tipados
- ⚡ **Performance** - Implementações otimizadas
- 🧪 **Testabilidade** - Funções puras e isoladas

## 📁 Estrutura do Módulo

```
src/utils/
├── 📄 AppError.ts          # Classe customizada de erro
├── 📄 jwt.ts               # Utilitários para JWT
└── 📄 user.ts              # Utilitários específicos de usuário
```

## ❌ AppError - Gerenciamento de Erros

### Propósito
Classe customizada para gerenciamento consistente de erros na aplicação.

### Implementação

```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
```

### Características

- ✅ **Status Code Customizável** - Define códigos HTTP específicos
- ✅ **Detalhes Adicionais** - Inclui contexto extra nos erros
- ✅ **Stack Trace** - Mantém rastreamento de pilha
- ✅ **Type Guard** - Função para verificar tipo de erro
- ✅ **Serialização** - Compatível com JSON

### Exemplos de Uso

```typescript
// Erro básico
throw new AppError('Usuário não encontrado', 404);

// Erro com detalhes
throw new AppError('Dados inválidos', 400, {
  email: 'Email é obrigatório',
  senha: 'Senha deve ter pelo menos 8 caracteres'
});

// Verificação de tipo
try {
  // alguma operação
} catch (error) {
  if (isAppError(error)) {
    console.log(`Erro controlado: ${error.message} (${error.statusCode})`);
  } else {
    console.log('Erro inesperado:', error);
  }
}
```

### Códigos de Status Comuns

| Código | Significado | Uso Típico |
|--------|-------------|------------|
| 400 | Bad Request | Dados inválidos, validação falhou |
| 401 | Unauthorized | Token inválido, não autenticado |
| 403 | Forbidden | Sem permissão para acessar recurso |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Email já existe, CPF duplicado |
| 422 | Unprocessable Entity | Regra de negócio violada |
| 500 | Internal Server Error | Erro interno não tratado |

## 🔐 JWT Utils - Utilitários JWT

### Propósito
Funções para criação, verificação e gerenciamento de tokens JWT.

### Implementação

```typescript
import jwt from 'jsonwebtoken';
import { env } from '../config/environment.js';

export function generateJwt(payload: Record<string, unknown>, options?: jwt.SignOptions) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
    algorithm: 'HS256',
    ...options
  });
}

export function verifyJwt<T = any>(token: string): T {
  try {
    return jwt.verify(token, env.JWT_SECRET) as T;
  } catch (error) {
    throw new AppError('Token inválido', 401);
  }
}

export function decodeJwt(token: string) {
  return jwt.decode(token);
}
```

### Características

- ✅ **Geração Segura** - Usa secret do ambiente
- ✅ **Verificação Robusta** - Trata erros automaticamente
- ✅ **Tipagem Genérica** - Suporte a tipos customizados
- ✅ **Configuração Flexível** - Opções customizáveis
- ✅ **Algoritmo Seguro** - HS256 por padrão

### Exemplos de Uso

```typescript
// Gerar token para usuário
const token = generateJwt({
  sub: user.id,
  email: user.email,
  role: user.role
});

// Verificar token com tipo
interface AuthPayload {
  sub: string;
  email: string;
  role: string;
}

const payload = verifyJwt<AuthPayload>(token);

// Token com expiração customizada
const refreshToken = generateJwt(
  { sub: user.id, type: 'refresh' },
  { expiresIn: '7d' }
);

// Decodificar sem verificar (para debug)
const decoded = decodeJwt(token);
console.log('Token expira em:', new Date(decoded.exp * 1000));
```

### Estrutura do Payload

```typescript
interface JWTPayload {
  sub: string;          // Subject (ID do usuário)
  email: string;        // Email do usuário
  role: string;         // Role do usuário
  iat: number;          // Issued at (timestamp)
  exp: number;          // Expires at (timestamp)
}
```

## 👤 User Utils - Utilitários de Usuário

### Propósito
Funções auxiliares específicas para operações com usuários.

### Implementação Sugerida

```typescript
import bcrypt from 'bcryptjs';

/**
 * Gera hash da senha usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verifica se a senha está correta
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Gera matrícula única para aluno
 */
export function generateMatricula(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}${random}`;
}

/**
 * Valida formato de CPF
 */
export function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }
  
  let checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  if (checkDigit !== parseInt(cleaned[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }
  
  checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  if (checkDigit !== parseInt(cleaned[10])) return false;
  
  return true;
}

/**
 * Formata CPF para exibição
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Sanitiza dados do usuário para resposta da API
 */
export function sanitizeUser(user: any) {
  const { senha_hash, ...sanitized } = user;
  return sanitized;
}

/**
 * Gera senha temporária
 */
export function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
```

### Características

- ✅ **Hash Seguro** - bcrypt com salt rounds altos
- ✅ **Validação de CPF** - Algoritmo completo
- ✅ **Formatação** - Padronização de dados
- ✅ **Sanitização** - Remove dados sensíveis
- ✅ **Geração Automática** - Matrículas e senhas

### Exemplos de Uso

```typescript
// Hash da senha na criação do usuário
const hashedPassword = await hashPassword('minhasenha123');

// Verificação no login
const isValid = await verifyPassword('minhasenha123', user.senha_hash);

// Validação de CPF
if (!isValidCPF('12345678901')) {
  throw new AppError('CPF inválido', 400);
}

// Geração de matrícula
const matricula = generateMatricula(); // "20241234"

// Sanitização para API
const safeUser = sanitizeUser(user); // Remove senha_hash
```

## 🛡️ Melhores Práticas

### Tratamento de Erros

```typescript
// ✅ Use AppError para erros controlados
throw new AppError('Recurso não encontrado', 404);

// ✅ Inclua contexto útil
throw new AppError('Validação falhou', 400, validationErrors);

// ❌ Evite throw de strings
throw 'Erro genérico'; // ❌
```

### JWT

```typescript
// ✅ Sempre use variáveis de ambiente
const secret = env.JWT_SECRET; // ✅

// ❌ Nunca hardcode secrets
const secret = 'mysecret'; // ❌

// ✅ Use tipos específicos
const payload = verifyJwt<AuthPayload>(token);

// ✅ Trate erros de token
try {
  const payload = verifyJwt(token);
} catch (error) {
  throw new AppError('Token inválido', 401);
}
```

### Validação

```typescript
// ✅ Valide antes de processar
if (!isValidCPF(cpf)) {
  throw new AppError('CPF inválido', 400);
}

// ✅ Sanitize dados de saída
const response = sanitizeUser(user);

// ✅ Use funções puras quando possível
const formatted = formatCPF(cpf); // Não modifica o original
```

## 📝 Exemplos de Uso Completos

### Registro de Usuário

```typescript
// auth.service.ts
import { hashPassword, generateMatricula, isValidCPF } from '../utils/user.js';
import { AppError } from '../utils/AppError.js';

export async function registerUser(userData: RegisterDTO) {
  // Validar CPF se fornecido
  if (userData.cpf && !isValidCPF(userData.cpf)) {
    throw new AppError('CPF inválido', 400);
  }
  
  // Hash da senha
  const senha_hash = await hashPassword(userData.senha);
  
  // Gerar matrícula se for aluno
  const matricula = userData.role === 'ALUNO' ? generateMatricula() : null;
  
  // Criar usuário
  const user = await User.create({
    ...userData,
    senha_hash,
    matricula
  });
  
  // Retornar dados sanitizados
  return sanitizeUser(user.toJSON());
}
```

### Middleware de Autenticação

```typescript
// isAuthenticated.ts
import { verifyJwt } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Token de autorização obrigatório', 401);
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    const payload = verifyJwt<AuthPayload>(token);
    req.user = payload;
    next();
  } catch (error) {
    throw new AppError('Token inválido', 401);
  }
}
```

## 🧪 Testes

### Estrutura de Testes Sugerida

```
test/utils/
├── AppError.test.ts
├── jwt.test.ts
└── user.test.ts
```

### Exemplo de Teste

```typescript
// test/utils/user.test.ts
import { describe, it, expect } from 'vitest';
import { isValidCPF, formatCPF, hashPassword, verifyPassword } from '../src/utils/user.js';

describe('User Utils', () => {
  describe('isValidCPF', () => {
    it('should validate correct CPF', () => {
      expect(isValidCPF('11144477735')).toBe(true);
    });
    
    it('should reject invalid CPF', () => {
      expect(isValidCPF('12345678901')).toBe(false);
      expect(isValidCPF('11111111111')).toBe(false);
    });
  });
  
  describe('password hashing', () => {
    it('should hash and verify password', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);
      
      expect(hash).not.toBe(password);
      expect(await verifyPassword(password, hash)).toBe(true);
      expect(await verifyPassword('wrongpassword', hash)).toBe(false);
    });
  });
});
```

## 🚀 Expansões Futuras

### Utilitários Planejados

```typescript
// date.ts - Utilitários de data
export function formatDate(date: Date, format: string): string;
export function isWeekend(date: Date): boolean;
export function addBusinessDays(date: Date, days: number): Date;

// validation.ts - Validações gerais
export function isValidEmail(email: string): boolean;
export function isValidPhone(phone: string): boolean;
export function sanitizeString(input: string): string;

// crypto.ts - Criptografia adicional
export function generateSecureToken(): string;
export function encrypt(data: string): string;
export function decrypt(encrypted: string): string;

// pdf.ts - Geração de PDFs
export function generateCertificate(student: Student, course: Course): Buffer;
export function generateReport(data: any[]): Buffer;
```

### Melhorias Técnicas

- [ ] 🧪 Cobertura de testes completa
- [ ] 📝 JSDoc para todas as funções
- [ ] 🔍 Validação de entrada mais robusta
- [ ] ⚡ Cache para operações custosas
- [ ] 📊 Métricas de performance

---

**Módulo desenvolvido com ❤️ pela equipe SUKATECH**

> 💡 **Dica**: Mantenha as funções utilitárias pequenas, focadas e testáveis. Sempre documente o propósito e os parâmetros de cada função.