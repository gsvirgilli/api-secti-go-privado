# Backend - SUKATECH

Sistema de Controle de Cursos desenvolvido pela Sukatech, uma solução robusta para gerenciamento de cursos, alunos e instrutores.

## 🚀 Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- MySQL
- Sequelize (ORM)
- Docker & Docker Compose
- JWT para autenticação

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- Docker e Docker Compose
- npm ou yarn

## 🔧 Instalação e Configuração

1. **Clone o repositório**
```bash
git clone https://github.com/Residencia-em-TIC-Turma-1/G07-SECTI.git
cd G07-SECTI/backend
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
- Copie o arquivo `.env.example` para `.env`
- Preencha as variáveis com suas configurações

4. **Inicie o ambiente Docker**
```bash
docker-compose up -d
```

5. **Execute as migrações do banco de dados**
```bash
npm run migrate
# ou
yarn migrate
```

## 🏃‍♂️ Executando o Projeto

### Ambiente de Desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

### Ambiente de Produção
```bash
npm run build
npm start
# ou
yarn build
yarn start
```

## 📁 Estrutura do Projeto

```
src/
├── app.ts              # Configuração do Express
├── server.ts           # Ponto de entrada da aplicação
├── config/             # Configurações do projeto
├── database/           # Migrações e configurações do banco
├── middlewares/        # Middlewares da aplicação
├── modules/           # Módulos do sistema
│   ├── users/
│   ├── courses/
│   ├── classes/
│   ├── students/
│   └── ...
├── routes/            # Rotas da API
└── utils/             # Utilitários e helpers
```

## 🛣️ Principais Rotas da API

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
 