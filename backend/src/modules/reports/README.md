# 📊 Módulo de Relatórios

Sistema completo de geração de relatórios em PDF e Excel para a plataforma SUKATECH.

## 📋 Índice

- [Funcionalidades](#funcionalidades)
- [Endpoints Disponíveis](#endpoints-disponíveis)
- [Tipos de Relatórios](#tipos-de-relatórios)
- [Como Usar](#como-usar)
- [Exemplos](#exemplos)
- [Tecnologias](#tecnologias)

## ✨ Funcionalidades

- 📄 Geração de relatórios em **PDF** e **Excel**
- 📊 **Dashboard** com estatísticas em tempo real
- 🎨 Templates responsivos e customizados
- 🔍 Filtros avançados por data, curso, turma, status
- 📈 Gráficos e métricas consolidadas
- 🔐 Autenticação obrigatória
- 📦 Download direto do arquivo

## 🎯 Endpoints Disponíveis

### Dashboard

#### `GET /api/reports/dashboard`
Retorna estatísticas gerais do sistema.

**Parâmetros de Query (opcionais):**
- `data_inicio`: Data inicial (formato: YYYY-MM-DD)
- `data_fim`: Data final (formato: YYYY-MM-DD)
- `id_curso`: ID do curso para filtrar
- `id_turma`: ID da turma para filtrar

**Resposta:**
```json
{
  "total_alunos": 150,
  "alunos_ativos": 120,
  "taxa_atividade": 80,
  "cursos_ativos": 10,
  "total_turmas": 25,
  "turmas_ativas": 18,
  "total_matriculas": 200,
  "taxa_aprovacao_candidatos": 75,
  "alunos_por_curso": [
    { "curso": "JavaScript", "total": 45 },
    { "curso": "Python", "total": 38 }
  ],
  "matriculas_mensais": [
    { "mes": "jan/2024", "total": 15 },
    { "mes": "fev/2024", "total": 22 }
  ]
}
```

---

### Relatórios de Alunos

#### `GET /api/reports/students/pdf`
Gera relatório de alunos em PDF.

**Parâmetros:**
- `id_turma` (opcional): Filtrar por turma específica

**Retorna:** Arquivo PDF para download

#### `GET /api/reports/students/excel`
Gera relatório de alunos em Excel.

**Parâmetros:**
- `id_turma` (opcional): Filtrar por turma específica

**Retorna:** Arquivo Excel (.xlsx) para download

---

### Relatórios de Turmas

#### `GET /api/reports/classes/pdf`
Gera relatório de turmas em PDF.

**Parâmetros:**
- `id_curso` (opcional): Filtrar por curso
- `status` (opcional): Filtrar por status (ATIVA, ENCERRADA, CANCELADA)

**Retorna:** Arquivo PDF para download

#### `GET /api/reports/classes/excel`
Gera relatório de turmas em Excel.

**Parâmetros:**
- `id_curso` (opcional): Filtrar por curso
- `status` (opcional): Filtrar por status

**Retorna:** Arquivo Excel (.xlsx) para download

---

### Relatórios de Frequência

#### `GET /api/reports/attendance/pdf`
Gera relatório de frequência em PDF.

**Parâmetros:**
- `id_turma` **(obrigatório)**: ID da turma
- `data_inicio` (opcional): Data inicial do período
- `data_fim` (opcional): Data final do período

**Retorna:** Arquivo PDF para download

#### `GET /api/reports/attendance/excel`
Gera relatório de frequência em Excel.

**Parâmetros:**
- `id_turma` **(obrigatório)**: ID da turma
- `data_inicio` (opcional): Data inicial do período
- `data_fim` (opcional): Data final do período

**Retorna:** Arquivo Excel (.xlsx) para download

---

### Relatórios de Cursos

#### `GET /api/reports/courses/pdf`
Gera relatório de cursos em PDF.

**Retorna:** Arquivo PDF para download

---

## 📊 Tipos de Relatórios

### 1. Relatório de Alunos
**Conteúdo:**
- Dados pessoais (nome, CPF, email, matrícula)
- Data de nascimento
- Turmas matriculadas
- Curso associado

**Formatos:** PDF e Excel

### 2. Relatório de Turmas
**Conteúdo:**
- Informações da turma (nome, turno, status)
- Curso associado
- Período (data início e fim)
- Instrutor responsável
- Vagas totais e disponíveis
- Alunos matriculados

**Estatísticas gerais:**
- Total de turmas
- Turmas ativas
- Total de alunos matriculados

**Formatos:** PDF e Excel

### 3. Relatório de Frequência
**Conteúdo:**
- Lista de presenças por aluno
- Estatísticas individuais:
  - Total de aulas
  - Presenças
  - Ausências
  - Faltas justificadas
  - Percentual de presença
- Filtro por período (datas)

**Formatos:** PDF e Excel
**Excel:** Status com cores (verde=presente, vermelho=ausente, amarelo=justificado)

### 4. Relatório de Cursos
**Conteúdo:**
- Lista de todos os cursos
- Carga horária
- Descrição
- Número de turmas
- Total de alunos

**Formatos:** PDF

### 5. Dashboard de Estatísticas
**Métricas:**
- Total de alunos (ativos e inativos)
- Taxa de atividade
- Cursos e turmas ativas
- Total de matrículas
- Taxa de aprovação de candidatos
- Distribuição de alunos por curso
- Evolução de matrículas mensais (últimos 12 meses)

**Formato:** JSON (para consumo do frontend)

---

## 🚀 Como Usar

### 1. Com cURL

```bash
# Login primeiro
TOKEN=$(curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","senha":"senha123"}' \
  | jq -r '.token')

# Dashboard
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3333/api/reports/dashboard

# Relatório de alunos em PDF
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3333/api/reports/students/pdf \
  --output relatorio-alunos.pdf

# Relatório de alunos de uma turma específica em Excel
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3333/api/reports/students/excel?id_turma=1" \
  --output relatorio-alunos-turma-1.xlsx

# Relatório de frequência
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3333/api/reports/attendance/pdf?id_turma=1&data_inicio=2024-01-01&data_fim=2024-12-31" \
  --output relatorio-frequencia.pdf
```

### 2. Com JavaScript/TypeScript

```typescript
const token = 'SEU_TOKEN_AQUI';

// Dashboard
const response = await fetch('http://localhost:3333/api/reports/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const stats = await response.json();
console.log(stats);

// Download de PDF
const pdfResponse = await fetch(
  'http://localhost:3333/api/reports/students/pdf?id_turma=1',
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
const blob = await pdfResponse.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'relatorio-alunos.pdf';
a.click();
```

### 3. Com Axios

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Dashboard
const { data: stats } = await api.get('/reports/dashboard');

// Download PDF
const { data: pdf } = await api.get('/reports/students/pdf', {
  responseType: 'blob',
  params: { id_turma: 1 }
});

// Salvar arquivo
const url = window.URL.createObjectURL(new Blob([pdf]));
const link = document.createElement('a');
link.href = url;
link.setAttribute('download', 'relatorio-alunos.pdf');
document.body.appendChild(link);
link.click();
```

---

## 📝 Exemplos de Uso

### Exemplo 1: Gerar relatório de todas as turmas ativas

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3333/api/reports/classes/pdf?status=ATIVA" \
  --output turmas-ativas.pdf
```

### Exemplo 2: Relatório de frequência com filtro de período

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3333/api/reports/attendance/excel?id_turma=5&data_inicio=2024-01-01&data_fim=2024-03-31" \
  --output frequencia-q1-2024.xlsx
```

### Exemplo 3: Dashboard com filtros

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3333/api/reports/dashboard?id_curso=2&data_inicio=2024-01-01&data_fim=2024-12-31"
```

---

## 🛠️ Tecnologias

### Bibliotecas Utilizadas

- **pdfkit**: Geração de PDFs
  - Suporte a múltiplas páginas
  - Formatação de texto e cores
  - Headers e footers personalizados
  
- **exceljs**: Geração de planilhas Excel
  - Formatação de células (cores, bordas, fontes)
  - Múltiplas colunas e linhas
  - Exportação em formato .xlsx

### Stack

- **Backend**: Node.js + TypeScript
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: MySQL
- **Documentação**: Swagger/OpenAPI

---

## 📐 Arquitetura

```
reports/
├── report.service.ts      # Lógica de negócio e geração de relatórios
├── report.controller.ts   # Controllers HTTP
├── report.routes.ts       # Definição de rotas
└── README.md             # Esta documentação
```

### Fluxo de Geração

1. **Request** → Cliente faz requisição com filtros
2. **Auth** → Middleware valida autenticação
3. **Controller** → Extrai parâmetros da requisição
4. **Service** → Busca dados no banco com Sequelize
5. **Generator** → Gera PDF ou Excel com os dados
6. **Response** → Retorna arquivo para download

---

## 🎨 Customização de PDFs

Os PDFs gerados seguem um padrão visual:

- **Header**: Título do relatório em roxo (#667eea)
- **Subheader**: Data de geração
- **Conteúdo**: Dados formatados com hierarquia visual
- **Footer**: Numeração de páginas e nome do sistema

### Cores utilizadas:
- Primária: `#667eea` (roxo)
- Secundária: `#764ba2` (roxo escuro)
- Texto: `#333` (cinza escuro)
- Texto secundário: `#666` (cinza médio)
- Texto terciário: `#999` (cinza claro)

---

## ⚡ Performance

- Queries otimizadas com `include` do Sequelize
- Geração assíncrona de arquivos
- Suporte a grandes volumes de dados
- Paginação automática em PDFs longos

---

## 🔐 Segurança

- ✅ Autenticação obrigatória em todas as rotas
- ✅ Validação de parâmetros
- ✅ Controle de acesso por usuário
- ✅ Sanitização de inputs
- ✅ Erro handling centralizado

---

## 📖 Documentação API

A documentação completa está disponível no Swagger:
```
http://localhost:3333/api-docs
```

Procure pela tag **Reports** para ver todos os endpoints documentados.

---

## 🐛 Troubleshooting

### Erro: "ID da turma é obrigatório"
**Solução:** Certifique-se de passar o parâmetro `id_turma` ao gerar relatórios de frequência.

### Erro: "Not authenticated"
**Solução:** Verifique se o token JWT está sendo enviado no header `Authorization: Bearer TOKEN`.

### Arquivo PDF/Excel corrompido
**Solução:** Verifique se está salvando o arquivo em modo binário e não tentando processar como texto.

### Dashboard retorna dados zerados
**Solução:** Verifique se existem dados no banco. O dashboard usa contagens diretas sem filtros por padrão.

---

## 🚧 Melhorias Futuras

- [ ] Agendamento de relatórios (cron jobs)
- [ ] Envio de relatórios por email
- [ ] Templates customizáveis por usuário
- [ ] Gráficos no PDF (Chart.js + Canvas)
- [ ] Relatório de desempenho acadêmico
- [ ] Relatório financeiro completo
- [ ] Cache de relatórios gerados
- [ ] Histórico de downloads
- [ ] Exportação em CSV
- [ ] Comparativo entre períodos

---

## 📄 Licença

Este módulo faz parte do sistema SUKATECH - Gestão Educacional.

---

**Desenvolvido com ❤️ pela equipe SUKATECH - G07-SECTI**
