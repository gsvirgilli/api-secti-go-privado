# 📚 Módulo de Cursos

O módulo de cursos é responsável pelo gerenciamento completo dos cursos oferecidos pela Sukatech, incluindo operações CRUD, validações, filtros e estatísticas.

## 🏗️ Estrutura do Módulo

```
src/modules/courses/
├── course.model.ts      # Modelo Sequelize do curso
├── course.service.ts    # Lógica de negócio e operações de dados
├── course.controller.ts # Controladores das rotas HTTP
├── course.routes.ts     # Definição das rotas da API
├── course.validator.ts  # Validações com Zod
└── README.md           # Esta documentação
```

## 📊 Modelo de Dados

### Curso (Table: `cursos`)

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| id | INTEGER | PK, AUTO_INCREMENT | Identificador único |
| nome | VARCHAR(100) | NOT NULL, UNIQUE | Nome do curso |
| carga_horaria | INTEGER | NOT NULL | Carga horária em horas |
| descricao | TEXT | NULLABLE | Descrição detalhada do curso |
| createdAt | DATETIME | NOT NULL | Data de criação |
| updatedAt | DATETIME | NOT NULL | Data da última atualização |

### Validações do Modelo

- **Nome**: Entre 3 e 100 caracteres, obrigatório
- **Carga Horária**: Entre 1 e 1000 horas, obrigatório
- **Descrição**: Máximo 1000 caracteres, opcional

## 🛣️ Rotas da API

### Base URL: `/api/courses`

#### GET `/api/courses`
Lista todos os cursos com filtros opcionais.

**Query Parameters:**
- `nome` (string): Filtro por nome (busca parcial)
- `carga_horaria_min` (number): Carga horária mínima
- `carga_horaria_max` (number): Carga horária máxima

**Exemplo:**
```bash
GET /api/courses?nome=JavaScript&carga_horaria_min=20
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "JavaScript Avançado",
      "carga_horaria": 40,
      "descricao": "Curso completo de JavaScript",
      "createdAt": "2024-12-19T10:00:00.000Z",
      "updatedAt": "2024-12-19T10:00:00.000Z"
    }
  ],
  "message": "Cursos listados com sucesso"
}
```

#### GET `/api/courses/:id`
Busca um curso específico por ID.

**Parâmetros:**
- `id` (number): ID do curso

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "JavaScript Avançado",
    "carga_horaria": 40,
    "descricao": "Curso completo de JavaScript"
  },
  "message": "Curso encontrado com sucesso"
}
```

#### POST `/api/courses`
Cria um novo curso.

**Body:**
```json
{
  "nome": "React Fundamentals",
  "carga_horaria": 30,
  "descricao": "Introdução ao React" // opcional
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "nome": "React Fundamentals",
    "carga_horaria": 30,
    "descricao": "Introdução ao React",
    "createdAt": "2024-12-19T10:00:00.000Z",
    "updatedAt": "2024-12-19T10:00:00.000Z"
  },
  "message": "Curso criado com sucesso"
}
```

#### PUT `/api/courses/:id`
Atualiza um curso existente (atualização parcial permitida).

**Body:**
```json
{
  "nome": "React Advanced", // opcional
  "carga_horaria": 50,      // opcional
  "descricao": "..."        // opcional
}
```

#### DELETE `/api/courses/:id`
Remove um curso.

**Resposta:**
```json
{
  "success": true,
  "message": "Curso deletado com sucesso"
}
```

#### GET `/api/courses/statistics`
Retorna estatísticas dos cursos.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "total": 15,
    "carga_horaria": {
      "media": 42,
      "maxima": 120,
      "minima": 20
    }
  },
  "message": "Estatísticas obtidas com sucesso"
}
```

## 🔒 Autenticação e Autorização

Todas as rotas requerem autenticação via JWT:

```bash
Authorization: Bearer <jwt_token>
```

**Permissões por Tipo de Usuário:**
- **ADMIN**: Todas as operações (CRUD completo)
- **COORDENADOR**: Todas as operações (CRUD completo)
- **INSTRUTOR**: Apenas leitura (GET)

> **Nota**: A implementação de autorização por roles será adicionada na próxima fase.

## ⚠️ Códigos de Erro

| Código | Descrição | Exemplo |
|--------|-----------|---------|
| 400 | Dados inválidos | Nome muito curto, carga horária negativa |
| 401 | Não autenticado | Token JWT ausente ou inválido |
| 403 | Sem permissão | Instrutor tentando criar curso |
| 404 | Curso não encontrado | ID inexistente |
| 409 | Conflito | Nome do curso já existe |
| 500 | Erro interno | Falha na conexão com banco |

## 🧪 Testes

Execute os testes do módulo:

```bash
npm test -- courses.test.ts
```

**Cobertura de Testes:**
- ✅ Criação de curso
- ✅ Listagem com filtros
- ✅ Busca por ID
- ✅ Atualização (completa e parcial)
- ✅ Remoção
- ✅ Estatísticas
- ✅ Validações de entrada
- ✅ Casos de erro

## 🔄 Relacionamentos Futuros

O módulo de cursos se relacionará com:

- **Turmas**: Um curso pode ter várias turmas
- **Instrutores**: Cursos podem ter instrutores especializados
- **Matrículas**: Através das turmas

```typescript
// Relacionamentos que serão implementados:
Course.hasMany(Turma, { foreignKey: 'curso_id' });
Course.belongsToMany(Instrutor, { 
  through: 'instrutor_cursos', 
  foreignKey: 'curso_id' 
});
```

## 📝 Service Layer

### CourseService

Principais métodos disponíveis:

```typescript
// Buscar todos com filtros
await CourseService.findAll(filters);

// Buscar por ID
await CourseService.findById(id);

// Criar novo curso
await CourseService.create(courseData);

// Atualizar curso
await CourseService.update(id, updateData);

// Deletar curso
await CourseService.delete(id);

// Verificar existência
await CourseService.exists(id);

// Obter estatísticas
await CourseService.getStatistics();
```

## 🏷️ Validações

### Zod Schemas

- `createCourseSchema`: Validação para criação
- `updateCourseSchema`: Validação para atualização
- `getCourseSchema`: Validação de parâmetros
- `getCourseFiltersSchema`: Validação de filtros

### Middleware de Validação

```typescript
import { validateCreateCourse } from './course.validator.js';

router.post('/', validateCreateCourse, CourseController.store);
```

## 📈 Performance e Otimização

- **Índices**: Criados em `nome` e `carga_horaria`
- **Paginação**: Implementar quando necessário
- **Cache**: Considerar para estatísticas frequentes
- **Ordenação**: Por nome (ASC) por padrão

## 🚀 Uso em Produção

### Criação de Curso via API

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nome": "TypeScript Masterclass",
    "carga_horaria": 60,
    "descricao": "Curso completo de TypeScript para desenvolvedores"
  }'
```

### Listagem com Filtros

```bash
curl "http://localhost:3000/api/courses?nome=TypeScript&carga_horaria_min=40" \
  -H "Authorization: Bearer <token>"
```

## 🔧 Configuração de Desenvolvimento

1. **Model**: Define a estrutura da tabela e validações
2. **Service**: Implementa a lógica de negócio
3. **Controller**: Gerencia requisições HTTP
4. **Routes**: Define endpoints da API
5. **Validator**: Valida dados de entrada

## 📚 Exemplo de Integração

```typescript
import CourseService from './course.service.js';

// Em outro módulo
const courses = await CourseService.findAll({
  carga_horaria_min: 20,
  nome: 'JavaScript'
});

// Verificar se curso existe antes de criar turma
const courseExists = await CourseService.exists(courseId);
if (!courseExists) {
  throw new AppError('Curso não encontrado', 404);
}
```

---

**Status**: ✅ **Implementado e Testado**  
**Próximo**: Implementar módulo de Turmas  
**Dependências**: Auth, Users (implementados)