# Sistema de Lista de Espera e Gestão de Vagas

## Data: 13/11/2025

## 🎯 Implementação Completa

### ✅ O que foi implementado:

1. **Status "lista_espera" para candidatos**
   - Migration aplicada: `20251113120000_add_lista_espera_status.sql`
   - Model atualizado com novo status

2. **Lógica de verificação de vagas**
   - Ao criar inscrição, sistema conta quantos alunos já estão na turma
   - Compara com campo `vagas` da turma
   - Se vagas disponíveis > 0 → status: `pendente`
   - Se vagas disponíveis = 0 → status: `lista_espera`

3. **Aprovação com escolha de curso**
   - Admin pode escolher aprovar 1ª ou 2ª opção de curso
   - Sistema verifica vagas antes de aprovar
   - Se não houver vagas, retorna erro

4. **Decrementação automática de vagas**
   - Ao aprovar, conta alunos na turma
   - Valida se ainda há vagas
   - Impede aprovação se turma estiver cheia

---

## 🔄 Fluxo Completo

### 1️⃣ **Inscrição do Candidato**

```
Candidato preenche formulário
    ↓
Escolhe 2 cursos:
  - Curso 1: Web Full Stack + Turno MATUTINO
  - Curso 2: Python + Turno VESPERTINO
    ↓
Backend busca turmas:
  - Turma 1: Web Full Stack - MANHA (30 vagas)
  - Turma 2: Python - TARDE (25 vagas)
    ↓
Conta alunos matriculados:
  - Turma 1: 28 alunos → 2 vagas disponíveis ✅
  - Turma 2: 25 alunos → 0 vagas disponíveis ❌
    ↓
Define status:
  - Pelo menos 1 turma tem vaga → STATUS: PENDENTE
  - Nenhuma turma tem vaga → STATUS: LISTA_ESPERA
    ↓
Salva candidatura com status definido
```

### 2️⃣ **Visualização pelo Admin**

```
Admin acessa /processo-seletivo-admin
    ↓
Vê lista de candidatos com badges de status:
  - 🟡 PENDENTE (tem vaga em pelo menos 1 curso)
  - 🔴 LISTA_ESPERA (sem vagas nos 2 cursos)
  - 🟢 APROVADO
  - ⚫ REPROVADO
```

### 3️⃣ **Aprovação do Candidato**

```
Admin clica em "Ver Detalhes"
    ↓
Modal mostra:
  - 1ª Opção: Web Full Stack - MATUTINO (2 vagas disponíveis)
  - 2ª Opção: Python - VESPERTINO (0 vagas disponíveis)
    ↓
Admin escolhe qual curso aprovar:
  - Botão "Aprovar 1ª Opção" → opcaoCurso = 1
  - Botão "Aprovar 2ª Opção" → opcaoCurso = 2
    ↓
Backend valida:
  ✅ Turma existe?
  ✅ Ainda tem vagas?
  ❌ Não tem vagas → Erro: "Não há mais vagas nesta turma"
    ↓
Se tudo OK:
  ✅ Cria aluno na turma escolhida
  ✅ Atualiza candidato: status = "aprovado"
  ✅ Decrementa vaga (próxima consulta vai mostrar 1 vaga a menos)
```

---

## 📊 Exemplos de Cenários

### **Cenário 1: Candidato com Vaga nas 2 Opções**
```
Inscrição:
  - Curso 1: Web (30 vagas / 10 alunos) → 20 disponíveis
  - Curso 2: Mobile (20 vagas / 5 alunos) → 15 disponíveis
  
Status: PENDENTE ✅

Aprovação:
  - Admin pode escolher qualquer uma das 2 opções
  - Ambas têm vagas disponíveis
```

### **Cenário 2: Candidato com Vaga em 1 Opção**
```
Inscrição:
  - Curso 1: Web (30 vagas / 30 alunos) → 0 disponíveis
  - Curso 2: Mobile (20 vagas / 5 alunos) → 15 disponíveis
  
Status: PENDENTE ✅ (porque pelo menos 1 tem vaga)

Aprovação:
  - Admin tenta aprovar Curso 1 → ❌ ERRO: "Não há vagas"
  - Admin aprova Curso 2 → ✅ SUCESSO
```

### **Cenário 3: Candidato SEM Vaga nas 2 Opções**
```
Inscrição:
  - Curso 1: Web (30 vagas / 30 alunos) → 0 disponíveis
  - Curso 2: Mobile (20 vagas / 20 alunos) → 0 disponíveis
  
Status: LISTA_ESPERA 🔴

Aprovação:
  - Admin tenta qualquer opção → ❌ ERRO: "Não há vagas"
  - Candidato fica aguardando abertura de vaga ou reprovação de outro
```

### **Cenário 4: Vaga Liberada por Reprovação**
```
Admin reprova um aluno da turma Web:
  - Vagas disponíveis: 0 → 1 ✅
  
Candidatos em lista_espera para Web:
  - Agora podem ser aprovados!
  - Admin altera status de "lista_espera" para "pendente"
  - Depois aprova normalmente
```

---

## 🛠️ Modificações no Frontend Necessárias

### **ProcessoSeletivo.tsx - Modal de Detalhes**

Adicionar botões para escolher qual curso aprovar:

```tsx
{selectedCandidate && (
  <div className="mt-4 space-y-2">
    <h4 className="font-semibold">Opções de Curso:</h4>
    
    {/* 1ª Opção */}
    <div className="p-3 border rounded flex justify-between items-center">
      <div>
        <p className="font-medium">1ª Opção: {selectedCandidate.curso?.nome}</p>
        <p className="text-sm text-muted-foreground">
          Turno: {selectedCandidate.turno}
        </p>
      </div>
      <Button 
        onClick={() => handleApprove(selectedCandidate.id, 1)}
        disabled={selectedCandidate.status === 'aprovado'}
      >
        Aprovar 1ª Opção
      </Button>
    </div>
    
    {/* 2ª Opção (se existir) */}
    {selectedCandidate.curso_id2 && (
      <div className="p-3 border rounded flex justify-between items-center">
        <div>
          <p className="font-medium">2ª Opção: {curso2Nome}</p>
          <p className="text-sm text-muted-foreground">
            Turno: {selectedCandidate.turno2}
          </p>
        </div>
        <Button 
          onClick={() => handleApprove(selectedCandidate.id, 2)}
          disabled={selectedCandidate.status === 'aprovado'}
        >
          Aprovar 2ª Opção
        </Button>
      </div>
    )}
  </div>
)}
```

### **API Call Atualizada**

```typescript
// api.ts
approve: (id: number, opcaoCurso?: 1 | 2) => 
  api.post(`/candidates/${id}/approve`, { opcaoCurso }),
```

### **Badge de Status**

```tsx
{candidate.status === 'lista_espera' && (
  <Badge className="bg-orange-500">Lista de Espera</Badge>
)}
```

---

## 🎯 Benefícios da Implementação

1. ✅ **Controle de Vagas**: Nunca aprova mais alunos do que a turma suporta
2. ✅ **Transparência**: Candidato sabe se está em lista de espera
3. ✅ **Flexibilidade**: Admin escolhe qual curso aprovar
4. ✅ **Automatização**: Sistema calcula disponibilidade automaticamente
5. ✅ **Gestão de Demanda**: Identifica cursos mais procurados

---

## 📝 Próximos Passos

- [ ] Atualizar frontend com botões de escolha de curso
- [ ] Adicionar badge "LISTA_ESPERA" na interface
- [ ] Mostrar quantidade de vagas disponíveis no modal
- [ ] Criar relatório de vagas por turma
- [ ] Notificar candidatos quando abrir vaga

