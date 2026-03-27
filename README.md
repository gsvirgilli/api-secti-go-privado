# 🎓 SUKATECH - Sistema de Controle de Cursos

<div align="center">

![Express.js](https://img.shields.io/badge/Express.js-5.1.0-black?logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)
![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)
![JWT](https://img.shields.io/badge/JWT-Authentication-green)
![Vitest](https://img.shields.io/badge/Vitest-Tests-yellow)
![License](https://img.shields.io/badge/License-ISC-blue)

**A Enterprise-Grade Platform for Course Management & Technology Education**

[🚀 Deploy](#-deployment) • [📚 API Docs](#-api-endpoints) • [🏗️ Architecture](#️-arquitetura-do-sistema) • [🧪 Tests](#-testes) • [👥 Team](#-equipe)

</div>

---

## 📖 Sobre o Projeto

**SUKATECH** é uma plataforma completa de gerenciamento de cursos desenvolvida para o **Governo de Goiás**. O sistema integra sustentabilidade e desenvolvimento social, oferecendo cursos **gratuitos de tecnologia** e **recondicionamento de equipamentos eletrônicos**.

### 🎯 Objetivo
Facilitar o controle integrado de cursos para **estudantes, instrutores e administradores**, com funcionalidades avançadas de:
- ✅ Gestão de matrículas
- ✅ Controle de frequência automático
- ✅ Geração de relatórios (PDF/Excel)
- ✅ Autenticação segura com JWT
- ✅ Auditoria completa de operações
- ✅ Notificações por email
- ✅ API REST documentada com Swagger

---

## ⭐ Features Principais

| Funcionalidade | Descrição | Impacto |
|----------------|-----------|--------|
| 🔐 **Autenticação JWT** | Segurança em camadas com Bearer token | Controle de acesso granular |
| 📊 **Dashboard Dinâmico** | Estatísticas em tempo real | Tomada de decisão rápida |
| 👥 **Gestão de Usuários** | 4 tipos (Admin, Instrutor, Coordenador, Aluno) | Papéis bem definidos |
| 📚 **Sistema de Cursos** | Criação, edição, listagem com filtros | Flexibilidade total |
| 🏫 **Controle de Turmas** | Horários, instrutores, vagas | Otimização de recursos |
| 👤 **Matrículas Inteligentes** | Decremento automático de vagas | Evita overbooking |
| 📝 **Frequência Automática** | Registro em lote, estatísticas | Conformidade com requisitos |
| 📑 **Relatórios Avançados** | PDF, Excel, Dashboard customizável | Análises profundas |
| 📧 **Notificações Email** | Sistema integrado com Nodemailer | Comunicação eficaz |
| 🔍 **Auditoria Completa** | Logs de todas as operações | Rastreabilidade total |
| 🐳 **Docker Ready** | Containerização completa | Deploy pronto para produção |
| 🧪 **Testes Automatizados** | Vitest com cobertura | Qualidade garantida |

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 20+
- MySQL 8.0+
- npm ou yarn

### Instalação (5 minutos)

```bash
# 1. Clone o repositório
git clone https://github.com/gsvirgilli/api-secti-go-privado.git
cd api-secti-go-privado/backend

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações (DB_HOST, DB_USER, JWT_SECRET, etc)

# 4. Execute migrations
npm run migrate

# 5. Inicie o servidor
npm run dev
```

**Servidor estará em:** `http://localhost:3000`

**Swagger UI:** `http://localhost:3000/api-docs`

---

## 📚 API Endpoints

A API utiliza **JWT Bearer Token** para autenticação. Obtenha o token via `/auth/login` e inclua no header:

```bash
Authorization: Bearer <seu_token_jwt>
```

### 🔐 Autenticação (Sem autenticação)

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "João Silva"
  }
}
```

### 📚 Cursos

```http
GET /courses                          # Lista todos os cursos (autenticado)
GET /courses/public                   # Lista públicos (sem autenticação)
GET /courses/:id                      # Busca por ID
POST /courses                         # Cria novo curso
PUT /courses/:id                      # Atualiza curso
GET /courses/statistics               # Estatísticas de cursos
```

**Exemplo:**
```bash
curl -X GET http://localhost:3000/courses \
  -H "Authorization: Bearer $TOKEN"
```

### 👥 Classes (Turmas)

```http
GET /classes                          # Lista turmas com paginação
POST /classes                         # Cria nova turma
GET /classes/:id                      # Busca turma
PUT /classes/:id                      # Atualiza turma
GET /classes/statistics               # Estatísticas
POST /classes/check-conflict          # Verifica conflito de horário
```

### 👤 Alunos (Students)

```http
GET /students                         # Lista com filtros (nome, CPF, email)
POST /students                        # Cria novo aluno
GET /students/:id                     # Busca por ID
GET /students/cpf/:cpf                # Busca por CPF
GET /students/class/:classId          # Alunos de uma turma
GET /students/statistics              # Estatísticas
```

### 📝 Matrículas (Enrollments)

```http
GET /enrollments                      # Lista todas
POST /enrollments                     # Cria matrícula (decrementa vagas)
GET /enrollments/:id_aluno/:id_turma  # Matrícula específica
DELETE /enrollments/:id_aluno/:id_turma  # Remove (incrementa vagas)
PATCH /enrollments/:id/:turma/cancel  # Cancela matrícula
```

### 📊 Frequência (Attendance)

```http
POST /attendances/bulk                # Registra presença em lote
GET /attendances/stats/:id_aluno/:id_turma  # Estatísticas
GET /attendances/report/:id_turma/:data     # Relatório diário
GET /attendances                      # Lista com filtros
```

### 📑 Relatórios (Reports)

```http
GET /reports/dashboard                # Dashboard com estatísticas
GET /reports/students/pdf             # Alunos em PDF
GET /reports/students/excel           # Alunos em Excel
GET /reports/classes/pdf              # Turmas em PDF
GET /reports/classes/excel            # Turmas em Excel
```

> ✅ **13+ módulos** com endpoints completos • 📖 [Documentação Swagger Completa](http://localhost:3000/api-docs)

---

## 🏗️ Arquitetura do Sistema

### Arquitetura em Camadas

```
┌─────────────────────────────────────┐
│         Cliente (Frontend)          │
│  React/TypeScript (src/frontend)    │
└──────────────┬──────────────────────┘
               │ HTTP/REST
┌──────────────▼──────────────────────┐
│     API Gateway & Middleware        │
│  - JWT Authentication               │
│  - Rate Limiting                    │
│  - CORS & Helmet (Segurança)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Business Logic Layer          │
│  - Controllers (validação)          │
│  - Services (lógica de negócio)     │
│  - Middlewares (autorização)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Data Access Layer             │
│  - Sequelize ORM                    │
│  - Models & Associations            │
│  - Database Migrations              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Banco de Dados (MySQL 8.0)       │
│  - Pool: 20 conexões máx            │
│  - Backup automático em produção    │
└─────────────────────────────────────┘
```

### Stack Utilizado

| Camada | Tecnologias |
|--------|-------------|
| **Backend** | Express.js 5.1, TypeScript, Node.js 20+ |
| **Autenticação** | JWT (jsonwebtoken 9.0), bcryptjs 3.0 |
| **Banco de Dados** | MySQL 8.0, Sequelize ORM 6.37 |
| **Validação** | Zod 4.1 (type-safe validation) |
| **Relatórios** | ExcelJS 4.4, PDFKit 0.17 |
| **Email** | Nodemailer 7.0 |
| **Segurança** | Helmet 8.1, CORS, Express Rate Limit |
| **Documentação** | Swagger JSDoc 6.2, Swagger UI 5.0 |
| **Upload de Arquivos** | Multer 2.0 |
| **Compressão** | gzip na resposta |
| **Testes** | Vitest |

---

## 📁 Estrutura do Projeto

```
api-secti-go-privado/
├── backend/                          # Aplicação Express
│   ├── src/
│   │   ├── modules/                  # 13 módulos especializados
│   │   │   ├── auth/                 # Autenticação JWT
│   │   │   ├── users/                # Gerenciamento de usuários
│   │   │   ├── courses/              # Gestão de cursos
│   │   │   ├── classes/              # Gestão de turmas
│   │   │   ├── students/             # Dados de alunos
│   │   │   ├── instructors/          # Dados de instrutores
│   │   │   ├── enrollments/          # Matrículas
│   │   │   ├── attendances/          # Frequência
│   │   │   ├── reports/              # Geração de relatórios
│   │   │   ├── candidates/           # Candidaturas
│   │   │   ├── calendar/             # Eventos
│   │   │   ├── notifications/        # Email
│   │   │   └── audit/                # Logs de auditoria
│   │   ├── middlewares/              # JWT, validação, erro
│   │   ├── utils/                    # Funções utilitárias
│   │   ├── routes/                   # Definição de rotas
│   │   ├── config/                   # Configurações (DB, JWT)
│   │   ├── database/                 # Models Sequelize
│   │   └── server.ts                 # Inicialização
│   ├── test/                         # Testes unitários
│   ├── migrations/                   # Database migrations
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/                         # React + TypeScript
├── documentação/                     # Docs do projeto
└── docker-compose.yml                # Containerização

```

---

## 🧪 Testes

```bash
# Rodas todos os testes
npm run test

# Modo watch (desenvolvimento)
npm run test:watch
```

**Cobertura de testes:**
- ✅ Candidates module
- ✅ Classes module
- ✅ Courses module
- ✅ Instructors module
- ✅ Students module
- ✅ Health check

---

## 🔐 Segurança & Autenticação

### JWT (JSON Web Token)

```
1. Usuário faz login → Servidor gera JWT
2. Token é armazenado no cliente
3. Cliente inclui no header de cada requisição
4. Servidor valida JWT antes de processar
5. Token expira após X horas (configurável)
```

**Exemplo de fluxo:**

```javascript
// Login
POST /auth/login
Response: { token: "eyJhbGciOiJIUzI1NiIs..." }

// Usar em requisições
GET /courses
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Bcrypt para Senhas

```javascript
// Senhas armazenadas com hash bcrypt (nunca em plain text)
password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Fm"
```

### Rate Limiting

```
- POST /auth/login: 10 tentativas por 15 minutos
- POST /auth/forgot-password: 5 tentativas por 15 minutos
```

---

## 🚢 Deployment

### DigitalOcean (Atual)

```
Host: db-mysql-sukatech-do-user-30566063-0.h.db.ondigitalocean.com
Database: defaultdb
Status: ✅ Em produção
```

Para instruções completas de deployment, consulte [DEPLOYMENT.md](./DEPLOYMENT.md)

### Docker

```bash
# Build da imagem
docker build -t sukatech-backend -f Dockerfile .

# Rodar container
docker run -p 3000:3000 --env-file .env sukatech-backend

# Com docker-compose
docker-compose up -d
```

---

## 📊 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| **Endpoints** | 40+ |
| **Módulos** | 13 |
| **Modelos de BD** | 10 |
| **Testes** | 30+ |
| **Linhas de Código** | 5000+ |
| **Documentação** | Completa (Swagger + Wiki) |

---

## 👥 Equipe

| Nome | GitHub | Função |
| :--- | :--- | :--- |
| Delvo | [@delvoresende1](https://github.com/delvoresende1) | Backend/DevOps |
| **Guilherme Silva Virgilli** | [@gsvirgilli](https://github.com/gsvirgilli) | **Full-Stack & Arquitetura** |
| Joyce Beatriz | [@joycebeatriz](https://github.com/joycebeatriz) | Frontend |
| Mariana | [@landimariana](https://github.com/landimariana) | QA/Testes |
| Ubiratan | [@ubiratanpaniago](https://github.com/ubiratanpaniago) | Backend/DB |

---

## 🎓 Contatos & Orientação

- **Professor Orientador UFG:** Dr. Jacson Rodrigues
- **Contato Principal Sukatech:** Thiago Angelino (Secti), Vinícius (Programando o Futuro), Elisabeth Lemos (Sukatech)

---

## 📄 License

Este projeto está licenciado sob a licença **ISC**.

---

## 🚀 Próximos Passos

- [ ] Implementar webhooks para notificações real-time
- [ ] Dashboard mobile (React Native)
- [ ] Integração com SSO (Google, Azure AD)
- [ ] Analytics avançados com ElasticSearch
- [ ] Backup automático e disaster recovery

---

<div align="center">

**Made with ❤️ by [SUKATECH Team](https://github.com/gsvirgilli)**

[⬆ Voltar ao Topo](#-sukatech---sistema-de-controle-de-cursos)

</div>


