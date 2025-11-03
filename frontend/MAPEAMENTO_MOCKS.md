# 📍 MAPEAMENTO DOS DADOS MOCKADOS (FAKE DATA)

## 🎯 **LOCALIZAÇÃO PRINCIPAL**

### **Arquivo Central:** `/frontend/src/contexts/AppContext.tsx`

Este arquivo contém **TODOS** os dados mockados (falsos) do sistema. Ele funciona como um "banco de dados falso" no frontend.

---

## 📊 **DADOS MOCKADOS POR CATEGORIA**

### 1️⃣ **ALUNOS (Students)** 
**Linhas: 108-215**

```typescript
const initialStudents: Student[] = [
  // 5 alunos mockados
]
```

**Dados incluem:**
- ✅ 5 alunos de exemplo
- Campos: id, name, cpf, email, phone, birthDate, address, enrollmentDate, status, course, class, progress, attendance, grades

**Alunos mockados:**
1. Maria Conceição de Melo (ID: 1) - Robótica
2. João Conceição de Melo (ID: 2) - Informática  
3. Ana Conceição de Melo (ID: 3) - Programação
4. Pedro Conceição de Melo (ID: 4) - Web Design (Inativo)
5. Carlos Silva Santos (ID: 5) - Robótica

---

### 2️⃣ **CURSOS (Courses)**
**Linhas: 217-283**

```typescript
const initialCourses: Course[] = [
  // 6 cursos mockados
]
```

**Cursos mockados:**
1. Robótica (120h, 35 alunos)
2. Informática (80h, 25 alunos)
3. Introdução à Informática (60h, 42 alunos)
4. Programação (100h, 18 alunos)
5. Web Design (90h, 28 alunos)
6. Python (70h, 22 alunos)

---

### 3️⃣ **TURMAS (Classes)**
**Linhas: 285-370**

```typescript
const initialClasses: Class[] = [
  // 5 turmas mockadas
]
```

**Turmas mockadas:**
1. TURMA A - Robótica (15/20 alunos)
2. TURMA B - Informática (18/25 alunos)
3. TURMA C - Programação (12/15 alunos)
4. TURMA D - Web Design (20/20 - Concluída)
5. TURMA E - Python (8/18 - Planejada)

---

### 4️⃣ **INSTRUTORES (Instructors)**
**Linhas: 372-450**

```typescript
const initialInstructors: Instructor[] = [
  // Múltiplos instrutores mockados
]
```

**Instrutores mockados:**
1. Instrutor A - Robótica e Automação (8 anos)
2. Instrutor B - Informática e Programação (12 anos)
3. Instrutor C - Web Design e UX/UI (6 anos)
4. E mais...

---

## 🔧 **OUTROS ARQUIVOS COM DADOS MOCKADOS**

### **Dashboard** (`/frontend/src/pages/Dashboard.tsx`)
**Linhas: 58-72**
- Widgets de estatísticas
- Gráficos e métricas falsas

### **Relatórios** (`/frontend/src/pages/Reports.tsx`)
**Linhas: 43-133**
- `monthlyEnrollments` - Matrículas mensais (linha 43)
- `attendanceData` - Dados de frequência (linha 62)
- `timeEvolutionData` - Evolução temporal (linha 72)
- `retentionData` - Retenção de alunos (linha 81)
- `reportTypes` - Tipos de relatórios (linha 133)

### **Calendário** (`/frontend/src/pages/Calendar.tsx`)
**Linhas: 26-40**
- `events` - Eventos do calendário

### **Notificações** (`/frontend/src/pages/Notifications.tsx`)
**Linhas: 9-80**
- `allNotifications` - Lista de notificações falsas

---

## 🔄 **COMO SUBSTITUIR PELOS DADOS REAIS DA API**

### **Exemplo 1: Substituir Alunos Mockados**

**❌ ANTES (Mockado):**
```typescript
// Em AppContext.tsx
const [students, setStudents] = useState<Student[]>(initialStudents);
```

**✅ DEPOIS (API Real):**
```typescript
import { StudentsAPI } from '@/lib/api';

const [students, setStudents] = useState<Student[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadStudents() {
    try {
      const response = await StudentsAPI.list();
      setStudents(response.data);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    } finally {
      setLoading(false);
    }
  }
  
  loadStudents();
}, []);
```

---

### **Exemplo 2: Substituir Cursos Mockados**

**❌ ANTES:**
```typescript
const [courses, setCourses] = useState<Course[]>(initialCourses);
```

**✅ DEPOIS:**
```typescript
import { CoursesAPI } from '@/lib/api';

const [courses, setCourses] = useState<Course[]>([]);

useEffect(() => {
  async function loadCourses() {
    try {
      const response = await CoursesAPI.list();
      setCourses(response.data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  }
  
  loadCourses();
}, []);
```

---

### **Exemplo 3: Substituir Dashboard Stats**

**❌ ANTES (Dashboard.tsx):**
```typescript
const [widgets, setWidgets] = useState([
  { id: 'students', title: 'Alunos', value: '156', ... },
  // dados mockados
]);
```

**✅ DEPOIS:**
```typescript
import { StudentsAPI, CoursesAPI, ClassesAPI } from '@/lib/api';

const [stats, setStats] = useState({
  students: 0,
  courses: 0,
  classes: 0
});

useEffect(() => {
  async function loadStats() {
    try {
      const [studentsRes, coursesRes, classesRes] = await Promise.all([
        StudentsAPI.list(),
        CoursesAPI.list(),
        ClassesAPI.list()
      ]);
      
      setStats({
        students: studentsRes.data.length,
        courses: coursesRes.data.length,
        classes: classesRes.data.length
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }
  
  loadStats();
}, []);
```

---

## 📝 **CHECKLIST DE SUBSTITUIÇÃO**

### **Prioridade ALTA:**
- [ ] `/contexts/AppContext.tsx` → Alunos (linha 108)
- [ ] `/contexts/AppContext.tsx` → Cursos (linha 217)
- [ ] `/contexts/AppContext.tsx` → Turmas (linha 285)
- [ ] `/contexts/AppContext.tsx` → Instrutores (linha 372)

### **Prioridade MÉDIA:**
- [ ] `/pages/Dashboard.tsx` → Widgets/Stats (linha 58)
- [ ] `/pages/Reports.tsx` → Dados de gráficos (linha 43+)

### **Prioridade BAIXA:**
- [ ] `/pages/Calendar.tsx` → Eventos (linha 26)
- [ ] `/pages/Notifications.tsx` → Notificações (linha 9)

---

## 🎯 **ESTRATÉGIA RECOMENDADA**

1. **Começar pelo AppContext.tsx**
   - Substituir `initialStudents`, `initialCourses`, `initialClasses`, `initialInstructors`
   - Adicionar loading states
   - Adicionar tratamento de erros

2. **Atualizar as páginas uma por uma**
   - Students → conectar com StudentsAPI
   - Courses → conectar com CoursesAPI  
   - Classes → conectar com ClassesAPI
   - Dashboard → usar APIs para estatísticas reais

3. **Adicionar features essenciais**
   - Loading spinners
   - Error handling com toasts
   - Refresh automático
   - Cache de dados

---

## 🚀 **BENEFÍCIOS DE REMOVER OS MOCKS**

✅ **Dados reais do banco de dados MySQL**
✅ **Sincronização entre backend e frontend**
✅ **CRUD funcionando de verdade**
✅ **Matrículas reais sendo criadas**
✅ **Sistema pronto para produção**

---

## ⚠️ **IMPORTANTE**

Os dados mockados são úteis para:
- ✅ Desenvolvimento inicial da interface
- ✅ Testes de layout e design
- ✅ Demonstrações sem backend

Mas **devem ser substituídos** para:
- ❌ Produção
- ❌ Testes reais
- ❌ Integração completa
