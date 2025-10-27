# 🏫 Módulo de Turmas (Classes)

Módulo responsável por gerenciar turmas no sistema SUKATECH.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Dados](#estrutura-de-dados)
- [Endpoints](#endpoints)
- [Exemplos de Uso](#exemplos-de-uso)
- [Regras de Negócio](#regras-de-negócio)
- [Validações](#validações)

## 🎯 Visão Geral

Uma turma representa um grupo de alunos matriculados em um curso específico, com informações sobre período, turno e dados relacionados.

### Recursos Principais

- ✅ CRUD completo de turmas
- ✅ Filtros avançados (nome, curso, turno, período)
- ✅ Validação de datas
- ✅ Verificação de conflitos de horário
- ✅ Estatísticas de turmas
- ✅ Associação com cursos
- ✅ Autenticação obrigatória

## 📊 Estrutura de Dados

```typescript
{
  id: number;                  // ID único da turma
  nome: string;                // Nome da turma (3-100 caracteres)
  turno: string;              // MANHA | TARDE | NOITE | INTEGRAL
  data_inicio: Date | null;   // Data de início da turma
  data_fim: Date | null;      // Data de término da turma
  id_curso: number;           // ID do curso associado
  createdAt: Date;            // Data de criação
  updatedAt: Date;            // Data de atualização
  
  // Associação com curso (populated)
  curso?: {
    id: number;
    nome: string;
    carga_horaria: number;
    descricao?: string;
  }
}
```

## 🔌 Endpoints

### 1. Listar Turmas

```http
GET /api/classes
Authorization: Bearer <token>
```

**Query Parameters (opcionais):**

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `nome` | string | Busca parcial por nome | `?nome=Python` |
| `turno` | enum | Filtrar por turno | `?turno=MANHA` |
| `id_curso` | number | Filtrar por curso | `?id_curso=1` |
| `data_inicio_min` | datetime | Data início mínima | `?data_inicio_min=2024-01-01T00:00:00Z` |
| `data_inicio_max` | datetime | Data início máxima | `?data_inicio_max=2024-12-31T23:59:59Z` |
| `data_fim_min` | datetime | Data fim mínima | `?data_fim_min=2024-06-01T00:00:00Z` |
| `data_fim_max` | datetime | Data fim máxima | `?data_fim_max=2024-12-31T23:59:59Z` |

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

### 2. Buscar Turma por ID

```http
GET /api/classes/:id
Authorization: Bearer <token>
```

**Resposta (200):**

```json
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
    "carga_horaria": 40,
    "descricao": "Curso completo de Python"
  }
}
```

**Erros:**

- `404` - Turma não encontrada

### 3. Criar Turma

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
  "createdAt": "2024-06-01T10:00:00.000Z",
  "updatedAt": "2024-06-01T10:00:00.000Z",
  "curso": {
    "id": 2,
    "nome": "React Fundamentals",
    "carga_horaria": 45,
    "descricao": "Aprenda React do zero"
  }
}
```

**Erros:**

- `400` - Erro de validação (dados inválidos)
- `404` - Curso não encontrado

### 4. Atualizar Turma

```http
PUT /api/classes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Turma React 2024-2 - Avançado",
  "turno": "NOITE"
}
```

**Resposta (200):**

```json
{
  "id": 2,
  "nome": "Turma React 2024-2 - Avançado",
  "turno": "NOITE",
  "data_inicio": "2024-07-01T00:00:00.000Z",
  "data_fim": "2024-12-20T00:00:00.000Z",
  "id_curso": 2,
  "createdAt": "2024-06-01T10:00:00.000Z",
  "updatedAt": "2024-06-15T14:30:00.000Z",
  "curso": {
    "id": 2,
    "nome": "React Fundamentals",
    "carga_horaria": 45,
    "descricao": "Aprenda React do zero"
  }
}
```

**Erros:**

- `400` - Erro de validação
- `404` - Turma não encontrada
- `404` - Curso não encontrado (se id_curso foi alterado)

### 5. Deletar Turma

```http
DELETE /api/classes/:id
Authorization: Bearer <token>
```

**Resposta (200):**

```json
{
  "message": "Turma deletada com sucesso"
}
```

**Erros:**

- `404` - Turma não encontrada

### 6. Estatísticas de Turmas

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
    },
    {
      "turno": "TARDE",
      "quantidade": 6
    },
    {
      "turno": "NOITE",
      "quantidade": 4
    }
  ],
  "porCurso": [
    {
      "id_curso": 1,
      "quantidade": 3,
      "curso": {
        "nome": "Python Fundamentals"
      }
    },
    {
      "id_curso": 2,
      "quantidade": 5,
      "curso": {
        "nome": "React Fundamentals"
      }
    }
  ]
}
```

### 7. Verificar Conflito de Horário

```http
POST /api/classes/check-conflict
Authorization: Bearer <token>
Content-Type: application/json

{
  "turno": "MANHA",
  "data_inicio": "2024-07-01T00:00:00Z",
  "data_fim": "2024-12-20T00:00:00Z"
}

# Para verificar ao atualizar (excluindo a própria turma):
# ?excludeId=2
```

**Resposta (200):**

```json
{
  "hasConflict": false
}
```

## 💡 Exemplos de Uso

### JavaScript (Fetch API)

```javascript
const API_URL = 'http://localhost:3333/api';
const token = localStorage.getItem('token');

// Listar turmas do curso 1, turno manhã
async function listarTurmas() {
  const response = await fetch(
    `${API_URL}/classes?id_curso=1&turno=MANHA`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const turmas = await response.json();
  console.log(turmas);
}

// Criar nova turma
async function criarTurma() {
  const response = await fetch(`${API_URL}/classes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      nome: 'Turma Node.js 2024-1',
      turno: 'NOITE',
      data_inicio: '2024-08-01T00:00:00Z',
      data_fim: '2024-12-15T00:00:00Z',
      id_curso: 3
    })
  });
  
  const turma = await response.json();
  console.log('Turma criada:', turma);
}

// Buscar estatísticas
async function buscarEstatisticas() {
  const response = await fetch(`${API_URL}/classes/statistics`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const stats = await response.json();
  console.log('Estatísticas:', stats);
}
```

### React Hook

```typescript
import { useState, useEffect } from 'react';

function useTurmas(filters = {}) {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        const token = localStorage.getItem('token');
        const queryString = new URLSearchParams(filters).toString();
        
        const response = await fetch(
          `http://localhost:3333/api/classes?${queryString}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Erro ao buscar turmas');
        }
        
        const data = await response.json();
        setTurmas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTurmas();
  }, [filters]);
  
  return { turmas, loading, error };
}

// Uso:
function TurmasPage() {
  const { turmas, loading, error } = useTurmas({ 
    turno: 'MANHA',
    id_curso: 1 
  });
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <ul>
      {turmas.map(turma => (
        <li key={turma.id}>
          {turma.nome} - {turma.curso.nome}
        </li>
      ))}
    </ul>
  );
}
```

## 📋 Regras de Negócio

### Validações de Criação

1. **Nome:**
   - Obrigatório
   - Mínimo 3 caracteres
   - Máximo 100 caracteres

2. **Turno:**
   - Obrigatório
   - Valores permitidos: `MANHA`, `TARDE`, `NOITE`, `INTEGRAL`

3. **Datas:**
   - Opcionais
   - Formato ISO 8601 (ex: `2024-01-15T00:00:00Z`)
   - Data fim deve ser posterior à data início

4. **Curso:**
   - Obrigatório
   - Deve existir no banco de dados

### Validações de Atualização

- Todos os campos são opcionais
- Mesmas regras de validação quando fornecidos
- Não é possível remover curso (id_curso sempre requerido)

### Conflito de Horário

O sistema verifica se há conflito de turmas no mesmo turno e período:
- Turmas no mesmo turno
- Com sobreposição de datas (início ou fim)

## ✅ Validações

### Campos Obrigatórios (Criação)

- `nome`
- `turno`
- `id_curso`

### Campos Opcionais

- `data_inicio`
- `data_fim`

### Restrições

- Nome deve ter entre 3 e 100 caracteres
- Turno deve ser um dos valores: `MANHA`, `TARDE`, `NOITE`, `INTEGRAL`
- Data fim deve ser posterior à data início
- Curso deve existir

## 🏗️ Arquitetura

```
classes/
├── class.model.ts       # Modelo Sequelize com validações
├── class.service.ts     # Lógica de negócio e operações
├── class.controller.ts  # Handlers de requisições HTTP
├── class.routes.ts      # Definição de rotas Express
├── class.validator.ts   # Schemas de validação Zod
└── README.md           # Esta documentação
```

## 🧪 Testes

```bash
# Rodar testes do módulo
npm test -- classes

# Rodar testes com cobertura
npm run test:coverage
```

## 🔄 Próximas Funcionalidades

- [ ] Capacidade máxima de alunos por turma
- [ ] Lista de espera
- [ ] Vincular instrutores às turmas
- [ ] Filtro por status (ativa, encerrada, cancelada)
- [ ] Relatórios de frequência
- [ ] Integração com matrículas

## 📞 Suporte

Para dúvidas ou problemas:
- Consulte o [README principal](../../README.md)
- Verifique os [exemplos de uso](#exemplos-de-uso)
- Revise as [regras de negócio](#regras-de-negócio)
