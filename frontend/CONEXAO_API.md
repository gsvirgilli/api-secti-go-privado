# 🔌 Conexão Backend ↔️ Frontend

## ✅ **STATUS: CONFIGURADO**

O frontend agora está **conectado ao backend** através do arquivo `/src/lib/api.ts`.

---

## 📡 **CONFIGURAÇÃO**

### **Base URL:** `http://localhost:3333/api`

### **Autenticação:** JWT Token (Bearer)
- Token salvo em: `localStorage.getItem('@sukatech:token')`
- Automaticamente incluído em todas as requisições

---

## 🚀 **COMO USAR A API NOS COMPONENTES**

### **1. Login de Usuário**

```typescript
import { AuthAPI } from "@/lib/api";

async function handleLogin() {
  try {
    const response = await AuthAPI.login({
      email: "admin@teste.com",
      senha: "senha123"
    });
    
    // Salvar token
    localStorage.setItem('@sukatech:token', response.data.token);
    localStorage.setItem('@sukatech:user', JSON.stringify(response.data.user));
    
    console.log('Login realizado:', response.data);
  } catch (error) {
    console.error('Erro no login:', error);
  }
}
```

---

### **2. Listar Alunos**

```typescript
import { StudentsAPI } from "@/lib/api";

async function loadStudents() {
  try {
    const response = await StudentsAPI.list({
      status: 'ativo',
      page: 1,
      limit: 10
    });
    
    console.log('Alunos:', response.data);
  } catch (error) {
    console.error('Erro ao carregar alunos:', error);
  }
}
```

---

### **3. Criar Matrícula**

```typescript
import { EnrollmentsAPI } from "@/lib/api";

async function createEnrollment() {
  try {
    const response = await EnrollmentsAPI.create({
      id_aluno: 1,
      id_turma: 5,
      observacoes: "Matrícula regular"
    });
    
    console.log('Matrícula criada:', response.data);
  } catch (error) {
    console.error('Erro ao criar matrícula:', error);
  }
}
```

---

### **4. Aprovar Candidato**

```typescript
import { CandidatesAPI } from "@/lib/api";

async function approveCandidate(id: number) {
  try {
    const response = await CandidatesAPI.approve(id);
    console.log('Candidato aprovado:', response.data);
  } catch (error) {
    console.error('Erro ao aprovar candidato:', error);
  }
}
```

---

### **5. Transferir Aluno**

```typescript
import { EnrollmentsAPI } from "@/lib/api";

async function transferStudent() {
  try {
    const response = await EnrollmentsAPI.transfer(
      1, // id_aluno
      6, // nova_turma_id
      "Mudança de horário"
    );
    
    console.log('Aluno transferido:', response.data);
  } catch (error) {
    console.error('Erro ao transferir:', error);
  }
}
```

---

## 🔐 **TRATAMENTO DE ERROS**

O axios já está configurado para:

1. **Adicionar token automaticamente** em todas requisições
2. **Redirecionar para login** se token expirar (401)
3. **Timeout de 10 segundos** nas requisições

---

## 📋 **APIS DISPONÍVEIS**

- ✅ `AuthAPI` - Autenticação (login, register, me)
- ✅ `CandidatesAPI` - Candidatos (CRUD + approve/reject)
- ✅ `StudentsAPI` - Alunos (CRUD)
- ✅ `CoursesAPI` - Cursos (CRUD)
- ✅ `ClassesAPI` - Turmas (CRUD)
- ✅ `EnrollmentsAPI` - Matrículas (CRUD + transfer/cancel/reactivate)
- ✅ `HealthAPI` - Health check

---

## 🎯 **PRÓXIMOS PASSOS**

Para conectar as páginas ao backend:

1. Substituir dados mockados por chamadas à API
2. Adicionar loading states
3. Adicionar tratamento de erros
4. Implementar refresh de token
5. Criar contexto de autenticação

---

## 🔧 **VARIÁVEIS DE AMBIENTE (Opcional)**

Crie um arquivo `.env` na raiz do frontend:

```env
VITE_API_URL=http://localhost:3333/api
```

E atualize o `api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

export const api = axios.create({
  baseURL: API_URL,
  ...
});
```
