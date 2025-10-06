# Guia de Tipos (Types)

## AuthUser e req.user

- `AuthUser` representa o usuário autenticado anexado ao `Request` após o middleware `isAuthenticated`.
- O campo `id` é `string` pois vem do `sub` do JWT (por padrão, `sub` é uma string).
- Quando você precisar do ID numérico (ex.: consultas ao banco), converta explicitamente.

### Convenção adotada
- Mantenha `req.user.id` como `string`.
- Converta para `number` apenas no ponto de uso.

```ts
import { getUserIdNumber } from '../utils/user';

export async function handler(req, res) {
  const userId = getUserIdNumber(req.user); // lança erro se inválido
  // ... usar userId em consultas
}
```

### Helper disponível
- `src/utils/user.ts` expõe `getUserIdNumber(user)` para conversão segura e validada.

### Benefícios
- Evita conflitos de tipos com Express/JWT.
- Torna explícito e seguro o ponto de conversão.
- Facilita manutenção e leitura do código.
# Types - Sistema de Tipos TypeScript

Esta pasta contém todos os tipos TypeScript do projeto, organizados por camadas e funcionalidades.

## 📁 Estrutura

```
src/types/
├── index.ts                    # Re-exporta todos os tipos
├── common/                     # Tipos comuns e utilitários
│   └── index.ts
├── entities/                   # Tipos das entidades do banco
│   ├── index.ts
│   ├── user.entity.ts
│   ├── student.entity.ts
│   ├── instructor.entity.ts
│   ├── course.entity.ts
│   ├── class.entity.ts
│   ├── candidate.entity.ts
│   ├── enrollment.entity.ts
│   └── attendance.entity.ts
├── dtos/                       # Data Transfer Objects (API)
│   ├── index.ts
│   ├── auth.dto.ts
│   ├── user.dto.ts
│   ├── student.dto.ts
│   ├── instructor.dto.ts
│   ├── course.dto.ts
│   ├── class.dto.ts
│   ├── candidate.dto.ts
│   ├── enrollment.dto.ts
│   └── attendance.dto.ts
├── api/                        # Tipos da camada de API
│   ├── index.ts
│   ├── request.types.ts
│   ├── response.types.ts
│   └── middleware.types.ts
└── services/                   # Tipos da camada de serviços
    ├── index.ts
    ├── base.service.types.ts
    ├── auth.service.types.ts
    ├── user.service.types.ts
    ├── student.service.types.ts
    ├── instructor.service.types.ts
    ├── course.service.types.ts
    ├── class.service.types.ts
    ├── candidate.service.types.ts
    ├── enrollment.service.types.ts
    └── attendance.service.types.ts
```

## 🚀 Como Usar

### Importação Simples
```typescript
import { User, Student, LoginRequest, ApiResponse } from '../types/index.js';
```

### Importação Específica
```typescript
import { User } from '../types/entities/user.entity.js';
import { LoginRequest } from '../types/dtos/auth.dto.js';
import { UserServiceInterface } from '../types/services/user.service.types.js';
```

### Exemplos de Uso

#### 1. Em Controllers
```typescript
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { CreateStudentRequest, StudentResponse } from '../types/dtos/student.dto.js';

export class StudentController {
  async create(req: AuthenticatedRequest, res: Response) {
    const data: CreateStudentRequest = req.body;
    // ... lógica
    const response: ApiResponse<StudentResponse> = {
      success: true,
      data: student
    };
    res.json(response);
  }
}
```

#### 2. Em Services
```typescript
import { StudentServiceInterface } from '../types/services/student.service.types.js';
import { CreateStudentRequest, StudentResponse } from '../types/dtos/student.dto.js';

export class StudentService implements StudentServiceInterface {
  async create(data: CreateStudentRequest): Promise<CreateResult<StudentResponse>> {
    // ... implementação
  }
}
```

#### 3. Em Middlewares
```typescript
import { AuthenticatedRequest, MiddlewareFunction } from '../types/api/middleware.types.js';

export const authMiddleware: MiddlewareFunction = (req: AuthenticatedRequest, res, next) => {
  // ... lógica de autenticação
};
```

## 📋 Tipos Principais

### Entities (Entidades do Banco)
- Representam exatamente a estrutura das tabelas
- Incluem timestamps e relacionamentos
- Exemplo: `User`, `Student`, `Course`

### DTOs (Data Transfer Objects)
- Para requisições e respostas da API
- Validação de dados de entrada
- Formatação de dados de saída
- Exemplo: `LoginRequest`, `StudentResponse`

### API Types
- Tipos para requests e responses HTTP
- Middlewares e validação
- Paginação e filtros

### Service Types
- Interfaces para camada de serviços
- Tipos de retorno padronizados
- Operações CRUD e específicas

## 🔧 Convenções

1. **Naming**: PascalCase para interfaces, camelCase para propriedades
2. **Sufixos**: 
   - `Request` para dados de entrada
   - `Response` para dados de saída
   - `Interface` para contratos de serviços
3. **Imports**: Sempre use `.js` no final para compatibilidade ESM
4. **Generics**: Use `<T>` para tipos genéricos quando apropriado

## 🎯 Benefícios

- **Type Safety**: Prevenção de erros em tempo de compilação
- **IntelliSense**: Autocompletar e documentação no IDE
- **Refatoração**: Mudanças seguras em todo o código
- **Documentação**: Tipos servem como documentação viva
- **Manutenibilidade**: Código mais fácil de manter e entender
