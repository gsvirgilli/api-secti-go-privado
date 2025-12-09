# 📍 Onde a Frequência Aparece no Sistema

## 1️⃣ **Registrando Frequência** (Frontend)

### Acesso:
```
Menu Lateral (esquerda)
  ↓
"Frequência" (Ícone de calendário)
  ↓
Página: https://api-secti-go-privado.vercel.app/frequencia
```

### Interface:
1. **Seletar Turma** - Dropdown com todas as turmas disponíveis
2. **Seletar Data** - Campo de data para qual dia você quer registrar a frequência
3. **Lista de Alunos** - Todos os alunos da turma aparecem com 3 opções:
   - ✅ **PRESENTE** (botão verde)
   - ❌ **AUSENTE** (botão vermelho)  
   - ⚠️ **JUSTIFICADO** (botão amarelo)

4. **Se marcar JUSTIFICADO:**
   - Aparece um **textarea** abaixo do aluno
   - Campo obrigatório para descrever o motivo
   - Limite: **500 caracteres**
   - Mostra **contador de caracteres**

5. **Informações Automaticamente Capturadas:**
   - 👤 **Nome do usuário** que está registrando (do token JWT)
   - 🔐 **ID do usuário** que está registrando
   - 📅 **Data do registro** (createdAt)

6. **Salvar:**
   - Clique em **"Salvar Frequência"** (botão azul)
   - Sistema envia para backend
   - Dados armazenados no banco

---

## 2️⃣ **Visualizando Frequência Registrada** (Backend/Banco)

### Tabelas no Banco de Dados:

#### Tabela `presenca` (também `attendance`):
```sql
SELECT * FROM presenca WHERE id_turma = 2;
```

Colunas relevantes:
- `id` - ID único da frequência
- `id_aluno` - ID do aluno (FK)
- `id_turma` - ID da turma (FK)
- `data_chamada` - Data da frequência
- `status` - PRESENTE, AUSENTE ou JUSTIFICADO
- **`motivo_justificacao`** ← NOVO: Texto da justificação
- **`id_usuario`** ← NOVO: Quem registrou (instrutor/admin)
- `createdAt` - Data/hora do registro
- `updatedAt` - Data/hora da última atualização

---

## 3️⃣ **Fluxo Completo de Dados**

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND - Página de Frequência                                 │
│ (https://api-secti-go-privado.vercel.app/frequencia)           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Usuário preenche:
                         │ - Turma
                         │ - Data
                         │ - Status do aluno (Presente/Ausente/Justificado)
                         │ - Motivo (se justificado)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND - API (https://api-secti-go-privado.onrender.com)      │
│ POST /api/attendance                                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Middleware extrai JWT token:
                         │ - Obtém id_usuario (quem está fazendo)
                         │ - Valida permissões
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ BANCO DE DADOS - Aiven MySQL                                    │
│ Tabela: presenca / attendance                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Insere:
                         │ - id_aluno
                         │ - id_turma
                         │ - data_chamada
                         │ - status
                         │ - motivo_justificacao (texto)
                         │ - id_usuario (de quem registrou)
                         │ - createdAt, updatedAt (automáticos)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ VISUALIZANDO OS DADOS                                            │
├─────────────────────────────────────────────────────────────────┤
│ Opção 1: Via API GET /api/attendance?id_turma=2                │
│ Opção 2: SQL Query na tabela presenca                           │
│ Opção 3: Relatórios (futuramente)                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4️⃣ **Exemplo Prático de um Registro**

Após registrar frequência, aqui está como aparece no banco:

```sql
SELECT 
  id,
  id_aluno,
  id_turma,
  data_chamada,
  status,
  motivo_justificacao,
  id_usuario,
  createdAt,
  updatedAt
FROM presenca
WHERE id_turma = 2 AND id_aluno = 5;
```

**Resultado esperado:**
```
| id | id_aluno | id_turma | data_chamada | status     | motivo_justificacao              | id_usuario | createdAt           | updatedAt           |
|----|----------|----------|--------------|------------|----------------------------------|------------|---------------------|---------------------|
| 42 | 5        | 2        | 2025-12-08   | JUSTIFICADO| Atestado médico - Consulta       | 1          | 2025-12-08 14:30:00 | 2025-12-08 14:30:00 |
```

**Significado:**
- Aluno #5 estava ausente na turma #2 em 08/12/2025
- Motivo: "Atestado médico - Consulta"
- Registrado por usuário #1 (ex: João - Instrutor)
- Registrado às 14:30 em 08/12/2025

---

## 5️⃣ **Como Consultar via API (GET)**

```bash
curl -X GET "https://api-secti-go-privado.onrender.com/api/attendance?id_turma=2" \
  -H "Authorization: Bearer {seu-token-jwt}"
```

**Resposta (JSON):**
```json
{
  "data": [
    {
      "id": 42,
      "id_aluno": 5,
      "id_turma": 2,
      "data_chamada": "2025-12-08",
      "status": "JUSTIFICADO",
      "motivo_justificacao": "Atestado médico - Consulta",
      "id_usuario": 1,
      "createdAt": "2025-12-08T14:30:00Z",
      "updatedAt": "2025-12-08T14:30:00Z",
      "aluno": {
        "id": 5,
        "nome": "Carlos Silva",
        "matricula": "2025001"
      },
      "usuario": {
        "id": 1,
        "nome": "João Instrutor",
        "email": "joao@example.com"
      }
    }
  ]
}
```

---

## 6️⃣ **Usuários que Podem Registrar Frequência**

- ✅ **Admin** (Administrador)
- ✅ **Instrutor** (Professor da turma)
- ❌ Aluno (Sem permissão)

O `id_usuario` armazenado será o ID do Admin ou Instrutor que fez o registro.

---

## 7️⃣ **Próximos Passos (Futuro)**

- 📊 Relatório de Frequência (PDF/Excel)
- 📈 Gráficos de Assiduidade
- 🔔 Notificações para alunos com muitas faltas
- 📝 Edição de frequências já registradas
- 🗑️ Exclusão de frequências (com auditoria)

---

## 🎯 Resumo Rápido

| Pergunta | Resposta |
|----------|----------|
| **Onde registro frequência?** | Menu → Frequência (ou `/frequencia`) |
| **Onde aparece os dados registrados?** | Banco de dados (tabela `presenca`), API GET, Relatórios (futuro) |
| **Quem pode registrar?** | Admin e Instrutor |
| **Como saber quem registrou?** | Campo `id_usuario` + JOIN com tabela `usuarios` |
| **Como saber o motivo?** | Campo `motivo_justificacao` (texto livre até 500 chars) |
| **Como editar depois?** | API PUT /api/attendance/:id (futuro) |

