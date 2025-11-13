# 🧪 História de Usuário - Administrador do Sistema SECTI

## 👤 Persona: Maria Silva - Administradora do Sistema

**Contexto:** Maria é responsável por gerenciar todo o sistema educacional da SECTI, desde a criação de cursos até a aprovação de candidatos e geração de relatórios.

---

## 📋 Cenário de Teste Completo

### 🎯 **História 1: Login e Acesso ao Dashboard**

**Como** administradora do sistema  
**Quero** fazer login e visualizar o dashboard  
**Para que** eu possa ter uma visão geral do sistema

#### Passos:
1. Acesse: `http://localhost:8080/`
2. Você será redirecionado para `/login`
3. Faça login com:
   - **Email:** `admin@secti.com`
   - **Senha:** `admin123`
4. Clique em "Entrar"

#### ✅ Resultado Esperado:
- ✅ Login bem-sucedido
- ✅ Redirecionamento para `/dashboard`
- ✅ Menu lateral visível com todas as opções
- ✅ Cards de estatísticas exibindo:
  - Total de Alunos
  - Alunos Ativos
  - Taxa de Atividade
  - Cursos Ativos
- ✅ Gráficos de dados
- ✅ Nome do usuário "Admin SECTI" no canto superior direito

---

### 🎯 **História 2: Criar um Novo Curso**

**Como** administradora  
**Quero** cadastrar um novo curso  
**Para que** possa oferecer novas opções de capacitação

#### Passos:
1. No menu lateral, clique em **"Cursos"**
2. Clique no botão **"+ Cadastrar Curso"** (canto superior direito)
3. Preencha o formulário:
   - **Nome:** "Desenvolvimento Mobile com React Native"
   - **Descrição:** "Aprenda a criar aplicativos mobile multiplataforma"
   - **Duração:** "120 horas"
   - **Carga Horária:** 120
   - **Nível:** Intermediário
   - **Status:** Ativo
4. Clique em **"Salvar"**

#### ✅ Resultado Esperado:
- ✅ Toast de sucesso: "Curso criado com sucesso"
- ✅ Novo curso aparece na lista de cursos
- ✅ Card do curso exibe todas as informações corretas
- ✅ Status "Ativo" visível no badge verde

---

### 🎯 **História 3: Criar uma Nova Turma**

**Como** administradora  
**Quero** criar uma turma para o novo curso  
**Para que** possa matricular alunos

#### Passos:
1. No menu lateral, clique em **"Turmas"**
2. Clique no botão **"+ Nova Turma"**
3. Preencha o formulário:
   - **Nome:** "Mobile 2025.1 - Manhã"
   - **Curso:** Selecione "Desenvolvimento Mobile com React Native"
   - **Instrutor:** Selecione um instrutor disponível
   - **Turno:** Manhã
   - **Capacidade:** 30
   - **Data Início:** 15/01/2025
   - **Data Fim:** 15/06/2025
   - **Horário:** 08:00 - 12:00
   - **Status:** Planejada
4. Clique em **"Salvar"**

#### ✅ Resultado Esperado:
- ✅ Toast: "Turma criada com sucesso"
- ✅ Nova turma aparece na lista
- ✅ Status "Planejada" (badge amarelo)
- ✅ Capacidade: 0/30 alunos
- ✅ 30 vagas disponíveis

---

### 🎯 **História 4: Aprovar Candidatos**

**Como** administradora  
**Quero** analisar e aprovar candidatos  
**Para que** eles possam se tornar alunos

#### Passos:
1. No menu lateral, clique em **"Cadastro"** (ou "Candidatos")
2. Visualize a lista de candidatos pendentes
3. Selecione um candidato com status "Pendente"
4. Clique em **"Ver Detalhes"** ou ícone de olho
5. Analise as informações:
   - Dados pessoais
   - CPF, Email, Telefone
   - Endereço
   - Curso desejado
6. Clique em **"Aprovar"**
7. Confirme a aprovação

#### ✅ Resultado Esperado:
- ✅ Toast: "Candidato aprovado com sucesso"
- ✅ Status do candidato muda para "Aprovado"
- ✅ Candidato agora aparece na lista de **Alunos**
- ✅ Total de alunos incrementado no dashboard

---

### 🎯 **História 5: Matricular Aluno em Turma**

**Como** administradora  
**Quero** matricular um aluno aprovado em uma turma  
**Para que** ele possa começar o curso

#### Passos:
1. No menu lateral, clique em **"Alunos"**
2. Localize o aluno recém-aprovado
3. Clique no ícone de **"Editar"** (lápis)
4. No formulário de edição:
   - **Turma:** Selecione "Mobile 2025.1 - Manhã"
   - **Status:** Ativo
5. Clique em **"Salvar"**

#### ✅ Resultado Esperado:
- ✅ Toast: "Aluno atualizado com sucesso"
- ✅ Aluno aparece vinculado à turma
- ✅ Turma agora mostra 1/30 alunos matriculados
- ✅ 29 vagas disponíveis

**Alternativa (se houver matrícula direta):**
1. Clique em **"Turmas"**
2. Selecione a turma "Mobile 2025.1 - Manhã"
3. Clique em **"Adicionar Aluno"** ou **"Matricular"**
4. Selecione o aluno da lista
5. Confirme a matrícula

---

### 🎯 **História 6: Gerar Relatório de Alunos**

**Como** administradora  
**Quero** exportar relatório de alunos  
**Para que** possa analisar dados offline

#### Passos:
1. No menu lateral, clique em **"Alunos"**
2. No canto superior direito, clique em **"Exportar PDF"**
3. Aguarde o download
4. Abra o arquivo `relatorio-alunos.pdf`

#### ✅ Resultado Esperado:
- ✅ Toast: "PDF gerado com sucesso!"
- ✅ Arquivo baixado automaticamente
- ✅ PDF contém:
  - Cabeçalho "Relatório de Alunos"
  - Data de geração
  - Tabela com: ID, Nome, CPF, Email, Status
  - Todos os alunos cadastrados
  - Formatação profissional

#### Teste Excel:
5. Clique em **"Exportar Excel"**
6. Abra o arquivo `relatorio-alunos.xlsx`

#### ✅ Resultado Esperado:
- ✅ Toast: "Excel gerado com sucesso!"
- ✅ Planilha Excel formatada
- ✅ Cabeçalhos em negrito com fundo azul
- ✅ Dados organizados em colunas
- ✅ Compatível com Excel/LibreOffice

---

### 🎯 **História 7: Visualizar Dashboard de Relatórios**

**Como** administradora  
**Quero** visualizar estatísticas e gráficos  
**Para que** possa tomar decisões estratégicas

#### Passos:
1. No menu lateral, clique em **"Relatórios"**
2. Observe os cards de estatísticas (devem ter badge "API")
3. Aplique filtros (opcional):
   - **Data Início:** 01/01/2025
   - **Data Fim:** 31/12/2025
   - **Curso:** Selecione um curso específico
4. Clique em **"Aplicar Filtros"**
5. Aguarde loading spinners
6. Analise os gráficos:
   - Alunos por Curso (gráfico de barras)
   - Distribuição de Desempenho (pizza)
   - Matrículas Mensais (linha)
   - Taxa de Frequência (barras)

#### ✅ Resultado Esperado:
- ✅ Cards mostram badges "API" (dados reais do backend)
- ✅ Loading spinners aparecem durante carregamento
- ✅ Dados atualizados após filtros
- ✅ Gráficos interativos (hover mostra detalhes)
- ✅ Tooltips com informações detalhadas
- ✅ Dados consistentes com o que foi cadastrado

---

### 🎯 **História 8: Gerenciar Turmas**

**Como** administradora  
**Quero** visualizar e gerenciar turmas  
**Para que** possa acompanhar o progresso

#### Passos:
1. No menu lateral, clique em **"Turmas"**
2. Aplique filtros:
   - **Status:** Ativo
   - **Curso:** Selecione um curso
3. Clique em uma turma para ver detalhes
4. No modal de detalhes, verifique:
   - Lista de alunos matriculados
   - Instrutor responsável
   - Horários e local
   - Progresso da turma
5. Exporte relatório da turma:
   - Clique em **"Exportar PDF"** no topo da página
   - Verifique o arquivo `relatorio-turmas.pdf`

#### ✅ Resultado Esperado:
- ✅ Filtros funcionam corretamente
- ✅ Detalhes completos da turma visíveis
- ✅ Lista de alunos atualizada
- ✅ PDF com dados corretos da turma
- ✅ Capacidade e vagas corretas

---

### 🎯 **História 9: Acessar Página de Processo Seletivo**

**Como** administradora  
**Quero** visualizar a página pública de processo seletivo  
**Para que** possa verificar como os candidatos veem

#### Passos:
1. No navegador, acesse: `http://localhost:8080/processo-seletivo`
2. Navegue pela página pública
3. Verifique seções:
   - Banner principal
   - Cursos oferecidos
   - Cronograma
   - Como se inscrever
   - FAQ

#### ✅ Resultado Esperado:
- ✅ Página carrega sem erros
- ✅ Design responsivo e profissional
- ✅ Informações claras e organizadas
- ✅ Botões de ação funcionais

---

### 🎯 **História 10: Página Sobre Institucional**

**Como** administradora  
**Quero** visualizar a página institucional  
**Para que** possa verificar informações da SECTI

#### Passos:
1. No menu lateral, clique em **"Sobre"**
2. Ou acesse: `http://localhost:8080/sobre`
3. Navegue pelas seções:
   - Missão, Visão, Valores
   - História
   - Equipe
   - Contato

#### ✅ Resultado Esperado:
- ✅ Página carrega corretamente
- ✅ Conteúdo institucional visível
- ✅ Design alinhado com o sistema
- ✅ Informações relevantes

---

## 📊 Checklist Final de Testes

### Login e Autenticação
- [ ] Login com credenciais corretas funciona
- [ ] Login com credenciais incorretas falha com mensagem
- [ ] Logout funciona e redireciona para login
- [ ] Token JWT é armazenado no localStorage
- [ ] Rotas protegidas redirecionam não autenticados

### CRUD de Cursos
- [ ] Listar todos os cursos
- [ ] Criar novo curso
- [ ] Editar curso existente
- [ ] Excluir curso (com confirmação)
- [ ] Filtrar cursos por status
- [ ] Pesquisar cursos por nome

### CRUD de Turmas
- [ ] Listar todas as turmas
- [ ] Criar nova turma
- [ ] Editar turma existente
- [ ] Excluir turma (com confirmação)
- [ ] Filtrar por curso, status, instrutor
- [ ] Visualizar detalhes da turma
- [ ] Ver lista de alunos matriculados

### CRUD de Alunos
- [ ] Listar todos os alunos
- [ ] Criar novo aluno (se permitido)
- [ ] Editar aluno existente
- [ ] Excluir aluno (com confirmação)
- [ ] Filtrar por status, turma
- [ ] Pesquisar por nome, CPF, email
- [ ] Paginação funciona

### Candidatos
- [ ] Listar candidatos pendentes
- [ ] Visualizar detalhes do candidato
- [ ] Aprovar candidato
- [ ] Rejeitar candidato (com motivo)
- [ ] Candidato aprovado vira aluno

### Relatórios
- [ ] Dashboard carrega dados da API
- [ ] Cards mostram badges "API"
- [ ] Loading states funcionam
- [ ] Filtros aplicam corretamente
- [ ] Exportar PDF de alunos
- [ ] Exportar Excel de alunos
- [ ] Exportar PDF de turmas
- [ ] Exportar Excel de turmas
- [ ] Exportar PDF de cursos
- [ ] Gráficos interativos funcionam
- [ ] Tooltips mostram dados corretos

### Páginas Novas
- [ ] Processo Seletivo carrega
- [ ] Inscrição carrega
- [ ] Sobre carrega
- [ ] Navegação entre páginas funciona

### Responsividade
- [ ] Desktop (1920x1080) - layout correto
- [ ] Tablet (768x1024) - menu adaptado
- [ ] Mobile (375x667) - menu hamburger

### Performance
- [ ] Tempo de carregamento inicial < 3s
- [ ] Navegação entre páginas fluida
- [ ] Exportação de relatórios < 5s
- [ ] Gráficos renderizam rapidamente

---

## 🐛 Problemas Encontrados

Anote aqui qualquer problema encontrado durante os testes:

1. **Problema:**  
   **Onde:** (página/componente)  
   **Ação:** (o que você fez)  
   **Esperado:** (o que deveria acontecer)  
   **Atual:** (o que aconteceu)  
   **Severidade:** (Crítico/Alto/Médio/Baixo)

2. ...

---

## ✅ Resultado Final

- **Data do Teste:** 13/11/2025
- **Testador:** Maria Silva (Admin)
- **Navegador:** Chrome/Firefox/Safari
- **Sistema Operacional:** Linux/Windows/Mac
- **Funcionalidades Testadas:** ___/35
- **Sucesso:** ___%
- **Problemas Críticos:** ___
- **Problemas Menores:** ___

---

## 📝 Observações

(Adicione comentários gerais sobre a experiência de uso)

---

**Gerado em:** 13/11/2025  
**Versão do Sistema:** 1.0.0  
**Branch:** main
