# ⚙️ Config Module - Módulo de Configurações

Este módulo contém todas as configurações centralizadas do sistema SUKATECH, incluindo configuração do banco de dados, validação de variáveis de ambiente e configurações do Sequelize.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Estrutura do Módulo](#-estrutura-do-módulo)
- [Arquivos de Configuração](#-arquivos-de-configuração)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Configuração do Banco](#-configuração-do-banco)
- [Validação com Zod](#-validação-com-zod)
- [Sequelize CLI](#-sequelize-cli)
- [Exemplos de Uso](#-exemplos-de-uso)

## 🎯 Visão Geral

O módulo de configurações centraliza todas as configurações do sistema, garantindo:

- ✅ Validação rigorosa de variáveis de ambiente
- ✅ Configuração segura do banco de dados
- ✅ Defaults inteligentes para desenvolvimento
- ✅ Tipo-segurança com TypeScript
- ✅ Configuração do Sequelize CLI
- ✅ Testes de conectividade

## 📁 Estrutura do Módulo

```
src/config/
├── 📄 database.ts           # Configuração do Sequelize
├── 📄 environment.ts        # Validação de variáveis de ambiente
└── 📄 sequelize-config.cjs  # Configuração para Sequelize CLI
```

## 📄 Arquivos de Configuração

### 🗄️ database.ts

**Responsabilidade**: Configuração e inicialização do Sequelize ORM

```typescript
import { Sequelize } from 'sequelize';
import { env } from './environment.js';

export const sequelize = new Sequelize(
  env.DATABASE_NAME,
  env.DATABASE_USER,
  env.DATABASE_PASSWORD,
  {
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    dialect: 'mysql', 
    logging: console.log, // Logs SQL em desenvolvimento
  }
);

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
  }
};
```

**Características**:
- 🔌 Conexão configurada com MySQL
- 🔍 Logging de consultas SQL habilitado
- ✅ Função de teste de conectividade
- 🛡️ Uso de variáveis de ambiente validadas

### 🌍 environment.ts

**Responsabilidade**: Validação e tipagem de variáveis de ambiente

```typescript
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  APP_PORT: z.coerce.number().default(3333),

  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_USER: z.string().default('root'),
  DATABASE_PASSWORD: z.string().default(''),
  DATABASE_NAME: z.string().default('sukatechdb'),
  DATABASE_PORT: z.coerce.number().default(3306),

  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters').default('jwt_secret'),
  JWT_EXPIRES_IN: z.string().default('1d'),
});

export const env = envSchema.parse(process.env);
```

**Características**:
- 🛡️ Validação com Zod para tipo-segurança
- 🔧 Defaults inteligentes para desenvolvimento
- ⚠️ Validações obrigatórias para produção
- 📝 Mensagens de erro descritivas

### ⚙️ sequelize-config.cjs

**Responsabilidade**: Configuração para Sequelize CLI (migrações e seeders)

```javascript
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'sukatechdb',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 3306,
    dialect: 'mysql',
    logging: console.log,
  },
  
  test: {
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME + '_test' || 'sukatechdb_test',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  },
  
  production: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000
    }
  }
};
```

**Características**:
- 🔧 Configurações específicas por ambiente
- 🏊 Pool de conexões para produção
- 🧪 Banco separado para testes
- 📊 Logging configurável por ambiente

## 🌍 Variáveis de Ambiente

### Estrutura do .env

```env
# Configurações do Servidor
APP_PORT=3333

# Configurações do Banco de Dados
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=sua_senha_mysql
DATABASE_NAME=sukatechdb
DATABASE_PORT=3306

# Configurações JWT
JWT_SECRET=seu_jwt_secret_super_seguro_com_pelo_menos_32_caracteres
JWT_EXPIRES_IN=1d
```

### Validação das Variáveis

| Variável | Tipo | Obrigatório | Default | Validação |
|----------|------|-------------|---------|-----------|
| `APP_PORT` | number | ❌ | 3333 | Número válido |
| `DATABASE_HOST` | string | ❌ | localhost | String não vazia |
| `DATABASE_USER` | string | ❌ | root | String não vazia |
| `DATABASE_PASSWORD` | string | ❌ | "" | Qualquer string |
| `DATABASE_NAME` | string | ❌ | sukatechdb | String não vazia |
| `DATABASE_PORT` | number | ❌ | 3306 | Número válido |
| `JWT_SECRET` | string | ✅ | jwt_secret | Min. 8 caracteres |
| `JWT_EXPIRES_IN` | string | ❌ | 1d | Formato de tempo válido |

### Exemplo de Validação

```typescript
// Validação com erro detalhado
try {
  const env = envSchema.parse(process.env);
  console.log('✅ Configurações validadas com sucesso');
} catch (error) {
  console.error('❌ Erro nas configurações:', error.issues);
  process.exit(1);
}
```

## 🗄️ Configuração do Banco

### Inicialização do Sequelize

```typescript
import { sequelize } from './config/database.js';

// Testar conexão na inicialização
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Banco de dados conectado');
    
    // Sincronizar modelos em desenvolvimento (cuidado!)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('🔄 Modelos sincronizados');
    }
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
    process.exit(1);
  }
};
```

### Configuração de Pool

Para produção, configure um pool de conexões otimizado:

```typescript
const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: 'mysql',
  pool: {
    max: 20,      // Máximo de conexões
    min: 5,       // Mínimo de conexões
    acquire: 30000, // Tempo limite para obter conexão
    idle: 10000   // Tempo para fechar conexão inativa
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});
```

## ✅ Validação com Zod

### Schema de Validação

```typescript
import { z } from 'zod';

const envSchema = z.object({
  // Servidor
  APP_PORT: z
    .coerce
    .number()
    .min(1, 'Porta deve ser maior que 0')
    .max(65535, 'Porta deve ser menor que 65536')
    .default(3333),

  // Banco de Dados
  DATABASE_HOST: z
    .string()
    .min(1, 'Host do banco é obrigatório')
    .default('localhost'),
    
  DATABASE_USER: z
    .string()
    .min(1, 'Usuário do banco é obrigatório')
    .default('root'),
    
  DATABASE_PASSWORD: z
    .string()
    .default(''),
    
  DATABASE_NAME: z
    .string()
    .min(1, 'Nome do banco é obrigatório')
    .default('sukatechdb'),
    
  DATABASE_PORT: z
    .coerce
    .number()
    .min(1, 'Porta do banco deve ser maior que 0')
    .max(65535, 'Porta do banco deve ser menor que 65536')
    .default(3306),

  // JWT
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres para segurança')
    .default('jwt_secret_development_only'),
    
  JWT_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]$/, 'JWT_EXPIRES_IN deve estar no formato: 30s, 15m, 2h, 7d')
    .default('1d'),
});
```

### Tipos TypeScript Automáticos

```typescript
// Tipos gerados automaticamente pelo Zod
type Environment = z.infer<typeof envSchema>;

// Uso com tipo-segurança
const config: Environment = {
  APP_PORT: 3333,
  DATABASE_HOST: 'localhost',
  // ... outros campos
};
```

## 🔧 Sequelize CLI

### Comandos Disponíveis

```bash
# Criar migração
npx sequelize-cli migration:generate --name create-users-table

# Executar migrações
npm run migrate

# Reverter migração
npm run migrate:undo

# Status das migrações
npx sequelize-cli db:migrate:status

# Criar seeder
npx sequelize-cli seed:generate --name demo-users

# Executar seeders
npx sequelize-cli db:seed:all
```

### Configuração Personalizada

```javascript
// .sequelizerc
const path = require('path');

module.exports = {
  'config': path.resolve('src/config', 'sequelize-config.cjs'),
  'models-path': path.resolve('src/models'),
  'seeders-path': path.resolve('src/database/seeders'),
  'migrations-path': path.resolve('src/database/migrations'),
};
```

## 📝 Exemplos de Uso

### Inicialização Básica

```typescript
// server.ts
import { env } from './config/environment.js';
import { testConnection } from './config/database.js';

const startServer = async () => {
  // Testar conexão com banco
  await testConnection();
  
  // Iniciar servidor
  app.listen(env.APP_PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${env.APP_PORT}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️ Banco: ${env.DATABASE_NAME}@${env.DATABASE_HOST}:${env.DATABASE_PORT}`);
  });
};

startServer().catch(console.error);
```

### Uso em Modelos

```typescript
// models/User.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class User extends Model {
  public id!: number;
  public email!: string;
  // ... outros campos
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  // ... outros campos
}, {
  sequelize,           // ← Instância configurada
  tableName: 'usuarios',
  timestamps: true,
});

export default User;
```

### Configuração de Ambiente Específico

```typescript
// config/environment.ts
const getEnvironmentConfig = () => {
  const env = envSchema.parse(process.env);
  
  // Configurações específicas por ambiente
  const configs = {
    development: {
      ...env,
      logLevel: 'debug',
      enableCors: true,
    },
    
    test: {
      ...env,
      DATABASE_NAME: env.DATABASE_NAME + '_test',
      logLevel: 'error',
    },
    
    production: {
      ...env,
      logLevel: 'info',
      enableCors: false,
    }
  };
  
  const currentEnv = process.env.NODE_ENV || 'development';
  return configs[currentEnv] || configs.development;
};

export const config = getEnvironmentConfig();
```

## 🛡️ Segurança e Melhores Práticas

### Variáveis Sensíveis

```bash
# ❌ NUNCA faça isso
JWT_SECRET=123456

# ✅ Use secrets seguros
JWT_SECRET=super_secret_key_with_at_least_32_characters_for_production

# ✅ Use geradores de secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Configuração de Produção

```typescript
// Configuração otimizada para produção
const productionConfig = {
  database: {
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000
    },
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  
  jwt: {
    secret: process.env.JWT_SECRET, // Obrigatório em produção
    expiresIn: '24h',
    algorithm: 'HS256'
  }
};
```

### Validação de Ambiente

```typescript
// Verificação obrigatória para produção
if (process.env.NODE_ENV === 'production') {
  const requiredVars = ['JWT_SECRET', 'DATABASE_PASSWORD'];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      console.error(`❌ Variável obrigatória ${varName} não definida`);
      process.exit(1);
    }
  }
}
```

## 🧪 Testes de Configuração

### Teste de Conexão

```typescript
// test/config/database.test.ts
describe('Database Configuration', () => {
  it('should connect to database successfully', async () => {
    await expect(testConnection()).resolves.not.toThrow();
  });
  
  it('should have valid connection parameters', () => {
    expect(env.DATABASE_HOST).toBeDefined();
    expect(env.DATABASE_PORT).toBeGreaterThan(0);
    expect(env.DATABASE_NAME).toBeDefined();
  });
});
```

### Teste de Validação

```typescript
// test/config/environment.test.ts
describe('Environment Validation', () => {
  it('should validate environment variables', () => {
    const mockEnv = {
      APP_PORT: '3333',
      DATABASE_HOST: 'localhost',
      JWT_SECRET: 'test_secret_with_32_characters_min'
    };
    
    expect(() => envSchema.parse(mockEnv)).not.toThrow();
  });
  
  it('should fail with invalid JWT_SECRET', () => {
    const mockEnv = {
      JWT_SECRET: '123' // Muito curto
    };
    
    expect(() => envSchema.parse(mockEnv)).toThrow();
  });
});
```

## 🚀 Melhorias Futuras

### Funcionalidades Planejadas

- [ ] 📊 Configuração de logs estruturados
- [ ] 🔄 Hot reload de configurações
- [ ] 🌐 Suporte a múltiplos bancos
- [ ] 🔐 Integração com AWS Secrets Manager
- [ ] 📱 Configurações específicas para mobile API
- [ ] 🐳 Configuração otimizada para containers
- [ ] 📈 Métricas de configuração

### Melhorias Técnicas

- [ ] 🧪 Testes de configuração completos
- [ ] 📝 Validação de esquemas de banco
- [ ] 🔍 Monitoramento de saúde da conexão
- [ ] 💾 Cache de configurações
- [ ] 🔧 CLI para gerenciar configurações

---

**Módulo desenvolvido com ❤️ pela equipe SUKATECH**

> 💡 **Dica**: Sempre mantenha suas configurações atualizadas e use variáveis de ambiente para dados sensíveis. Em produção, nunca use defaults para informações críticas como JWT_SECRET.