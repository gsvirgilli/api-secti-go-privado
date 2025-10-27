# 🚀 SUKATECH API - Backend

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-black.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/Tests-Passing-green.svg)](./test/)

API REST completa para o sistema de gestão de cursos da **SUKATECH**, desenvolvida com Node.js, TypeScript, Express e MySQL.

## 📋 Índice

- [🚀 Quick Start](#-quick-start)
- [🔐 Autenticação](#-autenticação)
- [📊 Endpoints Completos](#-endpoints-completos)
- [🌐 Integração Frontend](#-integração-frontend)
- [🚨 Tratamento de Erros](#-tratamento-de-erros)
- [🧪 Testes](#-testes)
- [🐳 Docker](#-docker)
- [🗄️ Acesso ao Banco de Dados](#️-acesso-ao-banco-de-dados)

## 🚀 Quick Start

### Para o Frontend - Setup Rápido

```bash
# 1. Certifique-se que a API está rodando
# Backend disponível em: http://localhost:3333

# 2. Teste a conexão
curl http://localhost:3333/api/health

# 3. Resposta esperada:
# {"status":"ok","message":"SUKA TECH API is running!"}
```

### Base URL e Headers
```javascript
const API_BASE_URL = 'http://localhost:3333/api';

// Headers para todas as requisições
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <JWT_TOKEN>' // Após login
};
```

## 🔐 Autenticação

### 1. Registro de Usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@exemplo.com", 
  "senha": "minhasenha123",
  "role": "ADMIN" // ADMIN | INSTRUTOR | COORDENADOR
}
```

**Resposta (201):**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "role": "ADMIN",
  "createdAt": "2025-10-06T22:13:42.195Z",
  "updatedAt": "2025-10-06T22:13:42.195Z"
}
```

### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@exemplo.com",
  "senha": "minhasenha123"
}
```

**Resposta (200):**
```json
{
  "user": {
    "id": 1,
    "nome": "João Silva", 
    "email": "joao@exemplo.com",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Validar Token
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@exemplo.com", 
  "role": "ADMIN"
}
```

## 📊 Endpoints Completos

### 🏥 Health Check
```http
GET /api/health
```

### 📚 Cursos

#### Listar Cursos
```http
GET /api/courses
Authorization: Bearer <token>

# Com filtros (opcionais):
GET /api/courses?nome=React&carga_horaria_min=30&carga_horaria_max=60
```

#### Buscar Curso
```http
GET /api/courses/:id
Authorization: Bearer <token>
```

#### Criar Curso
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "React Fundamentals",
  "carga_horaria": 40,
  "descricao": "Curso completo de React"
}
```

#### Atualizar Curso
```http
PUT /api/courses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "React Fundamentals - Updated",
  "carga_horaria": 45,
  "descricao": "Curso atualizado"
}
```

#### Deletar Curso
```http
DELETE /api/courses/:id
Authorization: Bearer <token>
```

#### Estatísticas de Cursos
```http
GET /api/courses/statistics
Authorization: Bearer <token>
```

### 👥 Usuários

#### Listar Usuários
```http
GET /api/users
Authorization: Bearer <token>
```

#### Buscar Usuário
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Atualizar Usuário
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "João Silva Updated",
  "email": "joao.updated@exemplo.com"
}
```

#### Deletar Usuário
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

### 🏫 Turmas (Classes)

#### Listar Turmas
```http
GET /api/classes
Authorization: Bearer <token>

# Com filtros opcionais:
GET /api/classes?nome=Python&turno=MANHA&id_curso=1
GET /api/classes?data_inicio_min=2024-01-01T00:00:00Z&data_inicio_max=2024-12-31T23:59:59Z
```

**Resposta (200):**
```json
[
  {
    "id": 1,
    "nome": "Turma Python 2024-1",
    "turno": "MANHA",
    "data_inicio": "2024-01-15T00:00:00.000Z",
    "data_fim": "2024-06-30T00:00:00.000Z",
    "id_curso": 1,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z",
    "curso": {
      "id": 1,
      "nome": "Python Fundamentals",
      "carga_horaria": 40
    }
  }
]
```

#### Buscar Turma
```http
GET /api/classes/:id
Authorization: Bearer <token>
```

#### Criar Turma
```http
POST /api/classes
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Turma React 2024-2",
  "turno": "TARDE",
  "data_inicio": "2024-07-01T00:00:00Z",
  "data_fim": "2024-12-20T00:00:00Z",
  "id_curso": 2
}
```

**Resposta (201):**
```json
{
  "id": 2,
  "nome": "Turma React 2024-2",
  "turno": "TARDE",
  "data_inicio": "2024-07-01T00:00:00.000Z",
  "data_fim": "2024-12-20T00:00:00.000Z",
  "id_curso": 2,
  "curso": {
    "id": 2,
    "nome": "React Fundamentals",
    "carga_horaria": 45
  }
}
```

#### Atualizar Turma
```http
PUT /api/classes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Turma React 2024-2 - Avançado",
  "turno": "NOITE"
}
```

#### Deletar Turma
```http
DELETE /api/classes/:id
Authorization: Bearer <token>
```

#### Estatísticas de Turmas
```http
GET /api/classes/statistics
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "total": 15,
  "ativas": 8,
  "encerradas": 7,
  "porTurno": [
    {
      "turno": "MANHA",
      "quantidade": 5
    }
  ],
  "porCurso": [
    {
      "id_curso": 1,
      "quantidade": 3,
      "curso": {
        "nome": "Python Fundamentals"
      }
    }
  ]
}
```

#### Verificar Conflito de Horário
```http
POST /api/classes/check-conflict
Authorization: Bearer <token>
Content-Type: application/json

{
  "turno": "MANHA",
  "data_inicio": "2024-07-01T00:00:00Z",
  "data_fim": "2024-12-20T00:00:00Z"
}
```

**Resposta (200):**
```json
{
  "hasConflict": false
}
```

#### Criar Turma
```http
POST /api/classes
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Turma React 2025.1",
  "turno": "MANHA", // MANHA | TARDE | NOITE
  "id_curso": 1,
  "data_inicio": "2025-01-15",
  "data_fim": "2025-03-15"
}
```

#### Buscar Turma
```http
GET /api/classes/:id
Authorization: Bearer <token>
```

#### Atualizar Turma
```http
PUT /api/classes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Turma React 2025.1 - Updated",
  "turno": "TARDE"
}
```

#### Deletar Turma
```http
DELETE /api/classes/:id
Authorization: Bearer <token>
```

#### Estatísticas de Turmas
```http
GET /api/classes/statistics
Authorization: Bearer <token>
```

#### Verificar Conflito de Turmas
```http
POST /api/classes/check-conflict
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_curso": 1,
  "data_inicio": "2025-01-15",
  "data_fim": "2025-03-15"
}
```

� **[Documentação Completa de Turmas →](./src/modules/classes/README.md)**

---

### 🎓 Candidatos e Alunos

O sistema gerencia o fluxo completo desde a candidatura até a matrícula:
1. **Candidato** se inscreve para uma turma (status: PENDENTE)
2. **Aprovação** converte automaticamente candidato em aluno (matrícula gerada)
3. **Rejeição** registra motivo e mantém histórico

#### Candidatos - Listar
```http
GET /api/candidates
Authorization: Bearer <token>

# Com filtros:
GET /api/candidates?status=PENDENTE&nome=João&id_turma_desejada=1
```

#### Candidatos - Criar
```http
POST /api/candidates
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Maria Santos",
  "cpf": "98765432100",
  "email": "maria@example.com",
  "telefone": "11988888888",
  "id_turma_desejada": 1
}
```

#### Candidatos - Aprovar (Converte em Aluno)
```http
POST /api/candidates/:id/approve
Authorization: Bearer <token>
```
**Resposta:**
```json
{
  "candidate": { "id": 1, "status": "APROVADO" },
  "student": { "id": 1, "matricula": "2024001", "nome": "Maria Santos" },
  "message": "Candidato aprovado e convertido em aluno com sucesso"
}
```

#### Candidatos - Rejeitar
```http
POST /api/candidates/:id/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "motivo": "Documentação incompleta - falta comprovante de residência"
}
```

#### Candidatos - Estatísticas
```http
GET /api/candidates/statistics
Authorization: Bearer <token>
```

### �👨‍🎓 Alunos

#### Listar Alunos
```http
GET /api/students
Authorization: Bearer <token>

# Com filtros:
GET /api/students?nome=João&matricula=2024
```

#### Buscar Aluno por ID
```http
GET /api/students/:id
Authorization: Bearer <token>
```

#### Buscar Aluno por CPF
```http
GET /api/students/cpf/:cpf
Authorization: Bearer <token>
```

#### Buscar Aluno por Matrícula
```http
GET /api/students/matricula/:matricula
Authorization: Bearer <token>
```

#### Atualizar Aluno
```http
PUT /api/students/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "João dos Santos Atualizado",
  "email": "joao.novo@exemplo.com",
  "telefone": "(11) 99999-8888"
}
```

#### Deletar Aluno
```http
DELETE /api/students/:id
Authorization: Bearer <token>
```

#### Estatísticas de Alunos
```http
GET /api/students/statistics
Authorization: Bearer <token>
```

📖 **[Documentação Completa de Candidatos e Alunos →](./src/modules/Candidates/README.md)**

---

### 👨‍🏫 Instrutores

#### Listar Instrutores
```http
GET /api/instructors
Authorization: Bearer <token>
```

#### Criar Instrutor
```http
POST /api/instructors
Authorization: Bearer <token>
Content-Type: application/json

{
  "cpf": "12345678901",
  "nome": "Prof. Maria Silva",
  "email": "maria.silva@sukatech.com",
  "especialidade": "Frontend Development",
  "telefone": "(11) 98765-4321"
}
```

### 📝 Matrículas

#### Listar Matrículas
```http
GET /api/enrollments
Authorization: Bearer <token>

# Com filtros:
GET /api/enrollments?aluno_id=1&turma_id=1&status=ATIVA
```

#### Criar Matrícula
```http
POST /api/enrollments
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_aluno": 1,
  "id_turma": 1,
  "data_matricula": "2025-01-10",
  "status": "ATIVA" // ATIVA | CANCELADA | CONCLUIDA
}
```

### 🎯 Candidatos

#### Listar Candidatos
```http
GET /api/candidates
Authorization: Bearer <token>

# Com filtros:
GET /api/candidates?status=AGUARDANDO&turma_desejada=1
```

#### Criar Candidato
```http
POST /api/candidates
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Ana Costa",
  "cpf": "98765432100",
  "email": "ana.costa@exemplo.com",
  "telefone": "(11) 91234-5678",
  "id_turma_desejada": 1,
  "status": "AGUARDANDO" // AGUARDANDO | APROVADO | REJEITADO
}
```

### ✅ Presença

#### Marcar Presença
```http
POST /api/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_aluno": 1,
  "id_turma": 1,
  "data": "2025-01-15",
  "presente": true,
  "observacoes": "Participou ativamente da aula"
}
```

#### Listar Presenças
```http
GET /api/attendance
Authorization: Bearer <token>

# Com filtros:
GET /api/attendance?aluno_id=1&turma_id=1&data_inicio=2025-01-01&data_fim=2025-01-31
```

## 🚨 Tratamento de Erros

### Códigos de Status HTTP

| Código | Descrição | Quando Ocorre |
|--------|-----------|---------------|
| `200` | Sucesso | Operação realizada com sucesso |
| `201` | Criado | Recurso criado com sucesso |
| `400` | Dados Inválidos | Validação falhou ou dados malformados |
| `401` | Não Autorizado | Token ausente, inválido ou expirado |
| `403` | Proibido | Usuário sem permissão para a operação |
| `404` | Não Encontrado | Recurso não existe |
| `409` | Conflito | Dados duplicados (ex: email já existe) |
| `422` | Entidade Não Processável | Dados válidos mas regra de negócio violada |
| `429` | Muitas Requisições | Rate limit excedido |
| `500` | Erro Interno | Erro no servidor |

### Exemplos de Respostas de Erro

#### 400 - Validação
```json
{
  "message": "Erro de validação: nome: Nome é obrigatório"
}
```

#### 401 - Não Autorizado
```json
{
  "message": "Unauthorized"
}
```

#### 404 - Não Encontrado
```json
{
  "message": "Curso não encontrado"
}
```

#### 409 - Conflito
```json
{
  "message": "Já existe um curso com este nome"
}
```

## 🌐 Integração Frontend

### Classe JavaScript Completa

```javascript
// api.js
class SukatechAPI {
  constructor() {
    this.baseURL = 'http://localhost:3333/api';
    this.token = localStorage.getItem('sukatech_token');
  }

  // Headers padrão
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Fazer requisição com tratamento de erro
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      
      // Token expirado - redirecionar para login
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        this.logout();
        window.location.href = '/login';
      }
      
      throw error;
    }
  }

  // Autenticação
  async login(email, senha) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha })
    });
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('sukatech_token', data.token);
    }
    
    return data;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async validateToken() {
    return this.request('/auth/me');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('sukatech_token');
  }

  // Cursos
  async getCourses(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/courses?${params}`);
  }

  async getCourse(id) {
    return this.request(`/courses/${id}`);
  }

  async createCourse(courseData) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
  }

  async updateCourse(id, courseData) {
    return this.request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData)
    });
  }

  async deleteCourse(id) {
    return this.request(`/courses/${id}`, {
      method: 'DELETE'
    });
  }

  async getCourseStatistics() {
    return this.request('/courses/statistics');
  }

  // Usuários
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE'
    });
  }

  // Turmas
  async getClasses(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/classes?${params}`);
  }

  async createClass(classData) {
    return this.request('/classes', {
      method: 'POST',
      body: JSON.stringify(classData)
    });
  }

  // Alunos
  async getStudents(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/students?${params}`);
  }

  async createStudent(studentData) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  }

  // Instrutores
  async getInstructors() {
    return this.request('/instructors');
  }

  async createInstructor(instructorData) {
    return this.request('/instructors', {
      method: 'POST',
      body: JSON.stringify(instructorData)
    });
  }

  // Matrículas
  async getEnrollments(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/enrollments?${params}`);
  }

  async createEnrollment(enrollmentData) {
    return this.request('/enrollments', {
      method: 'POST',
      body: JSON.stringify(enrollmentData)
    });
  }

  // Candidatos
  async getCandidates(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/candidates?${params}`);
  }

  async createCandidate(candidateData) {
    return this.request('/candidates', {
      method: 'POST',
      body: JSON.stringify(candidateData)
    });
  }

  // Presença
  async markAttendance(attendanceData) {
    return this.request('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData)
    });
  }

  async getAttendance(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/attendance?${params}`);
  }
}

// Exportar instância
const api = new SukatechAPI();
export default api;
```

### Hook React Customizado

```jsx
// hooks/useApi.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await api.validateToken();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, senha) => {
    const data = await api.login(email, senha);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return { user, loading, login, logout, checkAuth };
};

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await api.getCourses(filters);
      setCourses(response.data);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData) => {
    const response = await api.createCourse(courseData);
    await fetchCourses(); // Recarregar lista
    return response;
  };

  const updateCourse = async (id, courseData) => {
    const response = await api.updateCourse(id, courseData);
    await fetchCourses(); // Recarregar lista
    return response;
  };

  const deleteCourse = async (id) => {
    await api.deleteCourse(id);
    await fetchCourses(); // Recarregar lista
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};
```

### Exemplo de Uso em React

```jsx
// components/CourseList.jsx
import React from 'react';
import { useCourses } from '../hooks/useApi';

export default function CourseList() {
  const { courses, loading, createCourse, deleteCourse } = useCourses();

  const handleCreate = async () => {
    try {
      await createCourse({
        nome: 'Novo Curso',
        carga_horaria: 40,
        descricao: 'Descrição do curso'
      });
      alert('Curso criado com sucesso!');
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Confirma exclusão?')) return;
    
    try {
      await deleteCourse(id);
      alert('Curso deletado com sucesso!');
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Cursos</h1>
      <button onClick={handleCreate}>Criar Curso</button>
      
      {courses.map(course => (
        <div key={course.id}>
          <h3>{course.nome}</h3>
          <p>Carga horária: {course.carga_horaria}h</p>
          <p>{course.descricao}</p>
          <button onClick={() => handleDelete(course.id)}>
            Deletar
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 🧪 Testes

### Executar Testes
```bash
# Todos os testes
npm test

# Testes específicos
npm test courses-final.test.ts
npm test health.test.ts
```

### Cobertura
- ✅ **Health Check** - 100%
- ✅ **Autenticação** - 100%
- ✅ **CRUD Cursos** - 100%
- ✅ **Validações** - 100%
- ✅ **Filtros** - 100%

## 🐳 Docker

### Desenvolvimento com Docker

```bash
# Iniciar apenas o banco
docker compose up -d mysql

# Iniciar todos os serviços
docker compose up -d
```

## 🗄️ Acesso ao Banco de Dados

### Via Terminal (Docker)

A forma mais rápida de acessar o banco de dados MySQL:

```bash
# Acessar o MySQL via container Docker
docker exec -it g07-secti-db-1 mysql -u sukatech_user -p

# Quando pedir a senha, digite:
# sukatech_password

# Comandos úteis dentro do MySQL:
USE sukatech_db;
SHOW TABLES;
SELECT * FROM usuarios;
SELECT * FROM cursos;
SELECT * FROM turmas;
DESC usuarios;  # Ver estrutura da tabela
```

**Acesso direto (uma linha):**
```bash
docker exec -it g07-secti-db-1 mysql -u sukatech_user -psukatech_password sukatech_db
```

### Via Cliente Gráfico (MySQL Workbench, DBeaver, etc.)

**Credenciais de conexão:**

| Campo | Valor |
|-------|-------|
| **Host** | `localhost` |
| **Porta** | `3307` |
| **Database** | `sukatech_db` |
| **Usuário** | `sukatech_user` |
| **Senha** | `sukatech_password` |

**Clientes recomendados:**
- **MySQL Workbench** (oficial da Oracle)
- **DBeaver** (gratuito, multiplataforma) ⭐ Recomendado
- **TablePlus** (macOS/Windows)
- **HeidiSQL** (Windows)
- **DataGrip** (JetBrains, pago)

### Via VSCode Extension

**Extensão:** "MySQL" by Jun Han

**Configuração na extensão:**
```json
{
  "host": "localhost",
  "port": 3307,
  "user": "sukatech_user",
  "password": "sukatech_password",
  "database": "sukatech_db"
}
```

### Via MySQL Client (Terminal Local)

Se você tiver o cliente MySQL instalado localmente:

```bash
mysql -h localhost -P 3307 -u sukatech_user -p sukatech_db
# Senha: sukatech_password
```

### Comandos Úteis do Banco de Dados

```sql
-- Ver todas as tabelas
SHOW TABLES;

-- Ver estrutura de uma tabela
DESC usuarios;
DESC cursos;
DESC turmas;

-- Contar registros
SELECT COUNT(*) FROM usuarios;
SELECT COUNT(*) FROM cursos;

-- Ver últimos registros criados
SELECT * FROM cursos ORDER BY createdAt DESC LIMIT 5;
SELECT * FROM usuarios ORDER BY createdAt DESC LIMIT 5;

-- Limpar uma tabela (cuidado!)
TRUNCATE TABLE cursos;

-- Backup de uma tabela
CREATE TABLE cursos_backup AS SELECT * FROM cursos;
```

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `APP_PORT` | Porta da aplicação | `3333` |
| `JWT_SECRET` | Chave secreta JWT | `jwt_secret` |
| `DATABASE_HOST` | Host do banco | `localhost` |
| `DATABASE_PORT` | Porta do banco | `3307` |
| `DATABASE_USER` | Usuário do banco | `sukatech_user` |
| `DATABASE_PASSWORD` | Senha do banco | `sukatech_password` |
| `DATABASE_NAME` | Nome do banco | `sukatechdb` |

## ⚙️ Configuração

### Arquivo .env
```env
APP_PORT=3333
JWT_SECRET=jwt_secret
DATABASE_USER=sukatech_user
DATABASE_PASSWORD=sukatech_password
DATABASE_HOST=localhost
DATABASE_PORT=3307
DATABASE_NAME=sukatechdb
```

### Para Produção
```env
APP_PORT=3333
JWT_SECRET=your_super_secret_jwt_key_here
DATABASE_HOST=your_production_host
DATABASE_PORT=3306
DATABASE_USER=production_user
DATABASE_PASSWORD=production_password
DATABASE_NAME=sukatechdb
```

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/           # Configurações (DB, JWT, etc.)
│   ├── middlewares/      # Middlewares (auth, validation, etc.)
│   ├── modules/          # Módulos da aplicação
│   │   ├── auth/         # Autenticação
│   │   ├── courses/      # Cursos
│   │   └── users/        # Usuários
│   ├── routes/           # Definição de rotas
│   ├── types/            # Tipos TypeScript
│   ├── utils/            # Utilitários
│   ├── app.ts            # Configuração do Express
│   └── server.ts         # Entrada da aplicação
├── test/                 # Testes automatizados
├── .env                  # Variáveis de ambiente
├── package.json          # Dependências
├── tsconfig.json         # Configuração TypeScript
└── README.md            # Este arquivo
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor em modo dev
npm run build           # Compila TypeScript
npm start              # Inicia servidor compilado

# Banco de dados
npm run migrate        # Executa migrações
npm run migrate:undo   # Desfaz última migração

# Testes
npm test              # Executa todos os testes
npm run test:watch    # Testes em modo watch
```

## 📞 Suporte e Contato

- **Documentação**: Este README
- **Issues**: [GitHub Issues](https://github.com/Residencia-em-TIC-Turma-1/G07-SECTI/issues)
- **Wiki**: [GitHub Wiki](https://github.com/Residencia-em-TIC-Turma-1/G07-SECTI/wiki)

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

---

**Desenvolvido com ❤️ pela equipe SUKATECH - Residência TIC Turma 1**

🚀 **Happy Coding!**
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