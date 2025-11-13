# 🧪 Teste: Sistema de Lista de Espera e Gestão de Vagas

## Data: 13/11/2025

---

## 📋 Pré-requisitos

✅ Backend rodando na porta 3333
✅ Frontend rodando na porta 8080
✅ Banco de dados com turmas configuradas

---

## 🧪 Cenários de Teste

### **Teste 1: Inscrição com Vagas Disponíveis**

**Objetivo:** Verificar se candidato vai para status "PENDENTE" quando há vagas

**Passos:**
1. Acesse http://localhost:8080/inscricao
2. Preencha todos os dados obrigatórios
3. Escolha 2 cursos com turmas que tenham vagas disponíveis
4. Faça upload dos documentos
5. Submeta a inscrição

**Resultado Esperado:**
- ✅ Inscrição criada com sucesso
- ✅ Status: `PENDENTE`
- ✅ Mensagem: "Inscrição realizada com sucesso!"

---

### **Teste 2: Inscrição SEM Vagas (Lista de Espera)**

**Objetivo:** Verificar se candidato vai para status "LISTA_ESPERA" quando não há vagas

**Passos:**
1. Primeiro, preencha as turmas até o limite de vagas:
   - Aprove candidatos até a turma ficar cheia
   - Verifique no admin quantas vagas ainda há
2. Faça uma nova inscrição escolhendo apenas turmas cheias
3. Submeta a inscrição

**Resultado Esperado:**
- ✅ Inscrição criada com sucesso
- ✅ Status: `LISTA_ESPERA`
- ✅ Candidato aparece no painel admin com badge laranja "Lista de Espera"

---

### **Teste 3: Aprovação - Escolhendo 1ª Opção**

**Objetivo:** Aprovar candidato para a 1ª opção de curso

**Passos:**
1. Faça login como admin: http://localhost:8080/login
2. Acesse: Processo Seletivo Admin
3. Clique em "Ver Detalhes" de um candidato com status PENDENTE
4. Na seção "Aprovar Candidato", clique em **"Aprovar 1ª Opção"**

**Resultado Esperado:**
- ✅ Mensagem: "Candidato aprovado!"
- ✅ Status muda para: `APROVADO`
- ✅ Aluno criado na turma da 1ª opção
- ✅ Modal fecha automaticamente
- ✅ Lista de candidatos atualiza

---

### **Teste 4: Aprovação - Escolhendo 2ª Opção**

**Objetivo:** Aprovar candidato para a 2ª opção de curso

**Passos:**
1. No painel admin, clique em "Ver Detalhes" de um candidato
2. Na seção "Aprovar Candidato", clique em **"Aprovar 2ª Opção"**

**Resultado Esperado:**
- ✅ Mensagem: "Candidato aprovado!"
- ✅ Aluno criado na turma da 2ª opção (não da 1ª!)

---

### **Teste 5: Tentativa de Aprovação SEM Vagas**

**Objetivo:** Verificar se sistema bloqueia aprovação quando turma está cheia

**Passos:**
1. Aprove candidatos até preencher todas as vagas de uma turma
2. Tente aprovar mais um candidato para a mesma turma cheia

**Resultado Esperado:**
- ❌ Erro exibido: "Não há mais vagas nesta turma"
- ❌ Candidato permanece com status PENDENTE ou LISTA_ESPERA
- ❌ Aluno NÃO é criado

---

### **Teste 6: Badge "Lista de Espera" na Interface**

**Objetivo:** Verificar exibição correta do novo status

**Passos:**
1. Acesse o painel admin
2. Localize candidatos com diferentes status

**Resultado Esperado:**
- 🟡 PENDENTE = Badge amarelo
- 🟠 LISTA_ESPERA = Badge laranja "Lista de Espera"
- 🟢 APROVADO = Badge verde
- 🔴 REPROVADO = Badge vermelho

---

### **Teste 7: Edição de Status Manual**

**Objetivo:** Verificar se admin pode mudar status manualmente

**Passos:**
1. Clique em "Ver Detalhes" de um candidato
2. Clique em "Editar"
3. No campo "Status Atual", altere para "Lista de Espera"
4. Clique em "Salvar Alterações"

**Resultado Esperado:**
- ✅ Status atualizado com sucesso
- ✅ Badge na lista muda para laranja

---

### **Teste 8: Liberação de Vaga (Reprovar Aluno)**

**Objetivo:** Verificar se reprovar um aluno libera vaga

**Passos:**
1. Vá para Alunos (se houver a tela)
2. OU altere status de um candidato APROVADO para REPROVADO
3. Verifique se a vaga foi liberada
4. Tente aprovar um candidato da lista de espera

**Resultado Esperado:**
- ✅ Vaga liberada
- ✅ Candidato em lista de espera pode ser aprovado agora

---

## 🔍 Verificações no Backend

### Via Terminal (Verificar logs)

```bash
# Ver logs do backend
docker logs app_backend -f

# Buscar por erros de vaga
docker logs app_backend | grep "vagas"
```

### Via SQL (Verificar banco de dados)

```sql
-- Ver candidatos por status
SELECT id, nome, status, curso_id, curso_id2 
FROM candidatos 
ORDER BY createdAt DESC;

-- Ver alunos por turma
SELECT t.nome as turma, COUNT(a.id) as alunos, t.vagas
FROM turmas t
LEFT JOIN alunos a ON a.turma_id = t.id
GROUP BY t.id, t.nome, t.vagas;

-- Verificar vagas disponíveis
SELECT 
  t.nome as turma,
  t.vagas as total_vagas,
  COUNT(a.id) as alunos_matriculados,
  (t.vagas - COUNT(a.id)) as vagas_disponiveis
FROM turmas t
LEFT JOIN alunos a ON a.turma_id = t.id
GROUP BY t.id, t.nome, t.vagas;
```

---

## ✅ Checklist Final

- [ ] Status "PENDENTE" quando há vagas
- [ ] Status "LISTA_ESPERA" quando sem vagas
- [ ] Badge laranja aparece corretamente
- [ ] Botão "Aprovar 1ª Opção" funciona
- [ ] Botão "Aprovar 2ª Opção" funciona
- [ ] Erro ao tentar aprovar sem vagas
- [ ] Aluno criado na turma correta
- [ ] Vagas decrementam automaticamente
- [ ] Admin pode alterar status manualmente
- [ ] Interface mostra todas as opções de status

---

## 🐛 Problemas Conhecidos a Verificar

1. **Nome do Curso na 2ª Opção**: Atualmente mostra "Curso ID: X" - seria melhor buscar o nome
2. **Contador de Vagas**: Interface não mostra quantas vagas restam (pode adicionar depois)
3. **Notificação**: Não há notificação quando candidato sai da lista de espera

---

## 📊 Dados de Teste Sugeridos

### Turmas para Criar:
```
Turma 1: Web Full Stack - MANHA (30 vagas)
Turma 2: Python - TARDE (25 vagas)
Turma 3: Mobile - NOITE (20 vagas)
```

### Fluxo de Teste Completo:
1. Criar 3 inscrições com vagas disponíveis → Status PENDENTE
2. Aprovar 30 candidatos para Turma 1 → Turma cheia
3. Criar nova inscrição só para Turma 1 → Status LISTA_ESPERA
4. Reprovar 1 aluno da Turma 1 → Libera vaga
5. Aprovar candidato da lista de espera → Status APROVADO

---

## 🎯 Próximas Melhorias Sugeridas

- [ ] Mostrar contador de vagas disponíveis na interface
- [ ] Buscar nome do curso da 2ª opção (não só ID)
- [ ] Adicionar filtro por "lista_espera" na lista de candidatos
- [ ] Criar relatório de vagas por turma
- [ ] Notificar candidatos quando vaga abrir
- [ ] Histórico de mudanças de status

