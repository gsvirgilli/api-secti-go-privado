# 🚀 Backend SUKATECH - Sistema de Controle de Cursos

Este é o backend da aplicação SUKATECH, um sistema completo para gerenciamento de cursos técnicos, desenvolvido com **Node.js**, **TypeScript**, **Express** e **Sequelize ORM** com banco de dados **MySQL**.

## 📋 Índice

- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Configuração e Instalação](#-configuração-e-instalação)
- [Banco de Dados](#-banco-de-dados)
- [Módulos e Funcionalidades](#-módulos-e-funcionalidades)
- [Middlewares](#-middlewares)
- [Autenticação e Autorização](#-autenticação-e-autorização)
- [API Endpoints](#-api-endpoints)
- [Testes](#-testes)
- [Docker](#-docker)
- [Scripts Disponíveis](#-scripts-disponíveis)

## 🏗️ Arquitetura do Sistema

O backend segue uma **arquitetura modular baseada em camadas**, com separação clara de responsabilidades:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │───▶│    Services     │───▶│     Models      │
│  (HTTP Layer)   │    │ (Business Logic)│    │ (Data Access)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Validators    │    │   Middlewares   │    │    Database     │
│ (Data Validation)│    │  (Cross-cutting)│    │     (MySQL)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Princípios Arquiteturais:

- **Separação de Responsabilidades**: Cada camada tem uma responsabilidade específica
- **Inversão de Dependência**: Uso de interfaces e injeção de dependência
- **Modularidade**: Cada funcionalidade é um módulo independente
- **Reutilização**: Middlewares e utilitários compartilhados
- **Escalabilidade**: Estrutura preparada para crescimento

## �️ Tecnologias Utilizadas

### Core Technologies
- **Node.js 18+** - Runtime JavaScript
- **TypeScript 5.9+** - Superset tipado do JavaScript
- **Express 5.1+** - Framework web minimalista
- **Sequelize 6.37+** - ORM para JavaScript

### Database & Storage
- **MySQL 8.0** - Banco de dados relacional
- **Sequelize CLI** - Migrações e seeders

### Security & Authentication
- **JWT (jsonwebtoken)** - Autenticação baseada em tokens
- **bcryptjs** - Hash de senhas
- **express-rate-limit** - Rate limiting para proteção contra ataques

### Validation & Environment
- **Zod** - Validação de schemas e variáveis de ambiente
- **dotenv** - Gerenciamento de variáveis de ambiente
- **cors** - Cross-Origin Resource Sharing

### Development & Testing
- **Vitest** - Framework de testes rápido
- **tsx** - TypeScript execution engine
- **nodemon** - Hot reload durante desenvolvimento
- **supertest** - Testes de API

## 📁 Estrutura de Pastas

```
backend/
├── 📁 src/                          # Código fonte principal
│   ├── 📄 app.ts                    # Configuração do Express
│   ├── 📄 server.ts                 # Inicialização do servidor
│   │
│   ├── 📁 config/                   # Configurações do sistema
│   │   ├── 📄 database.ts           # Configuração do Sequelize
│   │   ├── 📄 environment.ts        # Validação de variáveis de ambiente
│   │   └── 📄 sequelize-config.cjs  # Config para Sequelize CLI
│   │
│   ├── 📁 database/                 # Estrutura do banco de dados
│   │   └── 📁 migrations/           # Scripts de migração
│   │       └── 📄 20250918234918-create-initial-schema.cjs
│   │
│   ├── 📁 middlewares/              # Middlewares globais
│   │   ├── � errorHandler.ts       # Tratamento de erros
│   │   ├── 📄 isAuthenticated.ts    # Autenticação JWT
│   │   └── 📄 validateRequest.ts    # Validação de requests
│   │
│   ├── 📁 modules/                  # Módulos de funcionalidades
│   │   ├── 📁 auth/                 # Autenticação e autorização
│   │   ├── 📁 users/                # Gestão de usuários
│   │   ├── 📁 courses/              # Gestão de cursos
│   │   ├── 📁 classes/              # Gestão de turmas
│   │   ├── 📁 students/             # Gestão de alunos
│   │   ├── 📁 instructors/          # Gestão de instrutores
│   │   ├── � enrollments/          # Matrículas
│   │   ├── 📁 Candidates/           # Candidatos
│   │   ├── 📁 presenca/             # Controle de presença
│   │   └── 📁 dashboard/            # Dashboard e estatísticas
│   │
│   ├── 📁 routes/                   # Definição de rotas
│   │   └── 📄 index.ts              # Router principal
│   │
│   ├── 📁 types/                    # Definições de tipos TypeScript
│   │   └── 📁 dtos/                 # Data Transfer Objects
│   │
│   └── 📁 utils/                    # Utilitários e helpers
│       ├── 📄 AppError.ts           # Classe customizada de erro
│       └── 📄 jwt.ts                # Utilitários JWT
│
├── 📁 test/                         # Testes
│   └── 📄 health.test.ts            # Teste de health check
│
├── 📄 package.json                  # Dependências e scripts
├── 📄 tsconfig.json                 # Configuração TypeScript
├── 📄 Dockerfile                    # Container Docker
├── 📄 entrypoint.sh                 # Script de inicialização
└── 📄 README.md                     # Esta documentação
```

## ⚙️ Configuração e Instalação

### Pré-requisitos

- **Node.js 18+**
- **npm** ou **yarn**
- **MySQL 8.0+**
- **Docker** (opcional)

### 1. Clonar e Instalar Dependências

```bash
# Navegar para o diretório do backend
cd backend

# Instalar dependências
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend:

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
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=1d
```

### 3. Configurar Banco de Dados

```bash
# Executar migrações
npm run migrate

# Para reverter migrações (se necessário)
npm run migrate:undo
```

### 4. Executar o Servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start

# Testes
npm test
npm run test:watch
```

## 🗄️ Banco de Dados

### Schema do Banco de Dados

O sistema utiliza **MySQL** com as seguintes entidades principais:

#### 📊 Tabelas Principais

1. **usuarios** - Sistema de autenticação
   - `id`, `email`, `senha_hash`, `role`

2. **cursos** - Catálogo de cursos
   - `id`, `nome`, `carga_horaria`, `descricao`

3. **turmas** - Turmas específicas de cursos
   - `id`, `nome`, `turno`, `id_curso`

4. **alunos** - Estudantes matriculados
   - `id`, `matricula`, `cpf`, `nome`, `email`

5. **instrutores** - Professores do sistema
   - `id`, `cpf`, `nome`, `email`, `especialidade`

6. **candidatos** - Candidatos aguardando matrícula
   - `id`, `nome`, `cpf`, `email`, `status`, `id_turma_desejada`

#### � Tabelas de Relacionamento

- **matriculas** - Relaciona alunos com turmas
- **instrutor_turma** - Relaciona instrutores com turmas
- **presenca** - Controle de presença dos alunos

## 🧩 Módulos e Funcionalidades

### 🔐 Auth Module (`src/modules/auth/`)

**Responsabilidade**: Autenticação e autorização de usuários

```typescript
// Estrutura do módulo
auth/
├── auth.controller.ts  # Controladores HTTP
├── auth.service.ts     # Lógica de negócio
├── auth.routes.ts      # Definição de rotas
└── auth.validator.ts   # Validação de dados
```

**Funcionalidades**:
- ✅ Registro de novos usuários
- ✅ Login com email e senha
- ✅ Geração de tokens JWT
- ✅ Validação de credenciais
- ✅ Hash de senhas com bcrypt

**Endpoints**:
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Autenticação

### 👥 Users Module (`src/modules/users/`)

**Responsabilidade**: Gestão de usuários do sistema

**Funcionalidades**:
- ✅ CRUD de usuários
- ✅ Gestão de perfis e roles
- ✅ Atualização de dados pessoais

### 📚 Outros Módulos

- **Courses** - Gestão do catálogo de cursos
- **Classes** - Gestão de turmas
- **Students** - Gestão de alunos
- **Instructors** - Gestão de instrutores
- **Enrollments** - Gestão de matrículas
- **Candidates** - Gestão de candidatos
- **Presenca** - Controle de presença
- **Dashboard** - Estatísticas e relatórios

## 🛡️ Middlewares

### 🚫 Error Handler (`middlewares/errorHandler.ts`)

**Função**: Tratamento centralizado de erros

```typescript
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (isAppError(err)) {
    return res.status(err.statusCode).json({ 
      message: err.message, 
      details: err.details 
    });
  }
  
  // Fallback para erros inesperados
  console.error('[ERROR]', err);
  return res.status(500).json({ message: 'Internal server error' });
}
```

### 🔒 Is Authenticated (`middlewares/isAuthenticated.ts`)

**Função**: Verificação de autenticação JWT

```typescript
export function isAuthenticated(req: Request, _res: Response, next: NextFunction) {
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

## 🔐 Autenticação e Autorização

### Sistema de Roles

```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  INSTRUTOR = 'INSTRUTOR',
  COORDENADOR = 'COORDENADOR'
}
```

**Hierarquia de Permissões**:
- 👑 **ADMIN**: Acesso total ao sistema
- 👨‍🏫 **INSTRUTOR**: Gestão de turmas e presença
- 📋 **COORDENADOR**: Gestão de cursos e matrículas

## 🛣️ API Endpoints

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de novo usuário

### Usuários
- `GET /users` - Lista todos os usuários
- `GET /users/:id` - Busca usuário por ID
- `PUT /users/:id` - Atualiza usuário
- `DELETE /users/:id` - Remove usuário

### Cursos
- `GET /courses` - Lista todos os cursos
- `POST /courses` - Cria novo curso
- `GET /courses/:id` - Busca curso por ID
- `PUT /courses/:id` - Atualiza curso
- `DELETE /courses/:id` - Remove curso

### Turmas
- `GET /classes` - Lista todas as turmas
- `POST /classes` - Cria nova turma
- `GET /classes/:id` - Busca turma por ID
- `PUT /classes/:id` - Atualiza turma
- `DELETE /classes/:id` - Remove turma

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Token) para autenticação. Para acessar rotas protegidas, inclua o token no header da requisição:

```
Authorization: Bearer <seu-token>
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento
- `npm run build` - Compila o projeto
- `npm start` - Inicia o servidor em modo de produção
- `npm run migrate` - Executa as migrações do banco de dados
- `npm run migrate:undo` - Reverte a última migração
- `npm test` - Executa os testes

## 📝 Logs e Monitoramento

Os logs da aplicação são armazenados em:
- Desenvolvimento: `logs/development.log`
- Produção: `logs/production.log`

## 🐛 Resolução de Problemas

### Problemas Comuns

1. **Erro de conexão com o banco**
   - Verifique se o Docker está rodando
   - Confirme as credenciais no arquivo `.env`
   - Verifique se a porta 3306 está disponível

2. **Erro nas migrações**
   - Verifique se o banco existe
   - Tente reverter as migrações e executá-las novamente

## 🧪 Testes

### Estrutura de Testes

```
test/
└── health.test.ts             # Teste de health check
```

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar em modo watch
npm run test:watch

# Executar com coverage
npm run test:coverage
```

### Exemplo de Teste

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Health Check', () => {
  it('should return OK status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body).toEqual({
      status: 'ok',
      message: 'SUKA TECH API is running!'
    });
  });
});
```

## 🐳 Docker

### Dockerfile

O projeto inclui um `Dockerfile` otimizado para desenvolvimento:

```dockerfile
FROM node:18-alpine

RUN apk add --no-cache curl

WORKDIR /usr/app
COPY package*.json ./
RUN npm i
COPY . .
COPY entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh
EXPOSE 3333

ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm","run","dev"]
```

### Usar com Docker Compose

```bash
# Na raiz do projeto (onde está o docker-compose.yml)
docker-compose up backend
```

## 🔧 Configurações Avançadas

### TypeScript Configuration

O projeto usa configuração TypeScript moderna com:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Environment Validation

Todas as variáveis de ambiente são validadas com Zod:

```typescript
const envSchema = z.object({
  APP_PORT: z.coerce.number().default(3333),
  DATABASE_HOST: z.string().default('localhost'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters'),
  // ... outras validações
});
```

## 🚀 Próximos Passos

### Funcionalidades Planejadas

- [ ] 📧 Sistema de emails (notificações)
- [ ] 📱 API para mobile
- [ ] 📊 Relatórios avançados
- [ ] 🔔 Sistema de notificações
- [ ] 📤 Exportação de dados
- [ ] 🔍 Sistema de busca avançada
- [ ] 📋 Logs de auditoria
- [ ] 🔐 Autenticação via OAuth
- [ ] 💾 Cache com Redis
- [ ] 📈 Métricas e monitoring

### Melhorias Técnicas

- [ ] 🧪 Aumentar cobertura de testes
- [ ] 📝 Documentação automática com Swagger
- [ ] 🚀 CI/CD Pipeline
- [ ] 🔍 Rate limiting mais granular
- [ ] 🛡️ Validação de entrada mais robusta
- [ ] 📊 Logging estruturado
- [ ] 🐳 Otimização de containers

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `package.json` para mais detalhes.

---

**Desenvolvido com ❤️ pela equipe SUKATECH - G07-SECTI**

> 💡 **Dica**: Para documentação específica de cada módulo, consulte os READMEs individuais em `src/modules/*/README.md`