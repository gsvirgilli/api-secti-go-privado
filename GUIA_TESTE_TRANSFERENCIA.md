# 🧪 Guia de Teste - Transferência Bidirecional para Lista de Espera

## ✅ Status do Ambiente

**Backend**: ✅ Rodando em `http://localhost:3333`  
**Frontend**: Precisa iniciar (veja abaixo)  
**Database**: ✅ MySQL rodando (porta 3307)

---

## 🚀 Como Iniciar o Sistema

### 1. Backend (já está rodando no Docker)
```bash
# Se precisar reiniciar:
cd /home/gsvirgilli/Github/BRISA/Teste_clone\ /G07-SECTI
docker compose restart app_backend
```

### 2. Frontend
```bash
# Terminal separado:
cd /home/gsvirgilli/Github/BRISA/Teste_clone\ /G07-SECTI/frontend
npm run dev
```

Acesse: **http://localhost:5173**

---

## 🔐 Credenciais de Teste

**Admin**:
- Email: `admin@secti.com`
- Senha: `admin123`

---

## 📋 Fluxo de Teste Completo

### **Cenário 1: Aprovar Candidato → Transferir para Lista de Espera**

#### Passo 1: Login
1. Acesse `http://localhost:5173`
2. Faça login com `admin@secti.com` / `admin123`

#### Passo 2: Verificar Candidatos na Lista de Espera
1. Navegue para **"Candidatos"**
2. Filtre por status: **"Lista de Espera"**
3. Anote um candidato disponível (exemplo: "Carlos Mendes")

#### Passo 3: Aprovar Candidato
1. Clique no botão **"Aprovar"** do candidato
2. Confirme a aprovação
3. ✅ Candidato deve:
   - Desaparecer da lista de candidatos (ou mudar status para "Aprovado")
   - Aparecer em **"Alunos"** com matrícula gerada (formato: YYYYNNNN)

#### Passo 4: Verificar Aluno Criado
1. Navegue para **"Alunos"**
2. Encontre o aluno recém-aprovado
3. Verifique:
   - ✅ Tem matrícula visível (ex: 20250005)
   - ✅ Está vinculado a uma turma
   - ✅ Status: "Ativo"

#### Passo 5: Transferir Aluno para Lista de Espera
1. Na lista de **"Alunos"**, encontre o aluno que acabou de aprovar
2. Clique no botão **"Transferir para Lista de Espera"** (ícone com setas ⇄)
   - **Desktop**: Botão na linha da tabela
   - **Mobile**: Menu dropdown de ações
3. **Prompt aparecerá perguntando o motivo** (opcional)
   - Digite algo como: "Desistência do curso"
4. **Confirme a ação**

#### Passo 6: Validar Transferência
1. ✅ Toast de sucesso deve aparecer
2. ✅ Aluno deve **desaparecer** da lista de "Alunos"
3. Navegue para **"Candidatos"**
4. Filtre por **"Lista de Espera"**
5. ✅ O candidato deve **reaparecer** na lista com status "Lista de Espera"
6. Navegue para a **turma** que o aluno estava vinculado
7. ✅ **Vaga deve ter sido liberada** (contador de alunos deve diminuir)

---

## 🔄 Cenário 2: Re-aprovar Candidato

Após transferir o aluno para lista de espera:

1. Navegue para **"Candidatos"** → **"Lista de Espera"**
2. Encontre o candidato que foi transferido
3. Clique em **"Aprovar"** novamente
4. ✅ Deve criar um **novo aluno** (com nova matrícula)
5. ✅ Candidato volta para "Alunos"
6. ✅ Vaga é ocupada novamente

---

## 🧩 Teste de Validações

### Teste A: Tentar transferir aluno SEM candidato_id
1. Navegue para **"Alunos"**
2. Encontre um aluno que foi criado **manualmente** (não via aprovação)
3. Tente transferir para lista de espera
4. ✅ Deve aparecer erro: **"Este aluno não possui candidatura vinculada..."**

### Teste B: Verificar Auditoria
1. Após transferir um aluno
2. Navegue para **"Logs de Auditoria"** (se disponível na UI)
3. ✅ Deve aparecer registro da transferência com:
   - Ação: transferência para lista de espera
   - Dados anteriores: informações do aluno
   - Motivo: texto que você digitou

---

## 📊 Dados de Teste Disponíveis

O sistema foi populado com:
- **4 candidatos** (alguns em lista de espera)
- **5 alunos** (alguns com candidato_id)
- **6 turmas** disponíveis
- **3 cursos** ativos

---

## 🐛 Troubleshooting

### Frontend não inicia
```bash
cd frontend
npm install  # Reinstalar dependências
npm run dev
```

### Backend não responde
```bash
# Verificar logs:
docker logs app_backend --tail 50

# Reiniciar:
docker compose restart app_backend
```

### Erro de CORS
Verifique se o backend está permitindo `http://localhost:5173` nas configurações de CORS.

---

## 📝 Checklist de Funcionalidades

- [x] Login funcionando
- [x] Listar candidatos
- [x] Aprovar candidato → cria aluno
- [x] Aluno aparece com matrícula
- [ ] Botão de transferência visível em Students
- [ ] Modal de confirmação aparece
- [ ] Prompt para motivo funciona
- [ ] Aluno removido da lista
- [ ] Candidato volta para lista de espera
- [ ] Vaga liberada na turma
- [ ] Toast de sucesso aparece
- [ ] Auditoria registrada
- [ ] Re-aprovação funciona

---

## 🎯 Resultado Esperado Final

1. ✅ Fluxo bidirecional completo funcional
2. ✅ UI responsiva (desktop + mobile)
3. ✅ Validações corretas
4. ✅ Auditoria completa
5. ✅ Nenhum erro no console

---

## 🚀 Próximos Passos (Após Teste)

Se tudo funcionar:
1. Commit final
2. Merge para main
3. Deploy (se aplicável)

Se houver problemas:
1. Anotar comportamento inesperado
2. Reportar para ajustes
3. Iterar até funcionar 100%

---

**Boa sorte com os testes!** 🎉
