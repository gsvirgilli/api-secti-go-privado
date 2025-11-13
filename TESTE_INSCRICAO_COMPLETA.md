# 🧪 Teste de Inscrição Completa - Frontend ↔️ Backend

## 📋 Status da Implementação

### ✅ O que já está pronto:

#### Frontend (`/inscricao`)
- ✅ Formulário completo em 7 etapas
- ✅ Validação de todos os campos
- ✅ Busca de cursos da API pública (`/api/courses/public`)
- ✅ Busca de endereço por CEP (ViaCEP)
- ✅ Máscaras de CPF, telefone, CEP
- ✅ Envio para `CandidatesAPI.createPublic()`

#### Backend (`POST /api/candidates/public`)
- ✅ Endpoint público (sem autenticação)
- ✅ Rota: `/api/candidates/public`
- ✅ Model com 29 campos adicionais
- ✅ Service atualizado para salvar TODOS os campos
- ✅ Validações: CPF único, email único, curso existe

---

## 🧪 Teste Manual Completo

### 1. **Acessar Página de Inscrição**

**URL:** `http://localhost:8080/inscricao`

**O que deve acontecer:**
- ✅ Página carrega
- ✅ Logo e título aparecem
- ✅ Botão "Voltar" para página inicial
- ✅ Progresso "Etapa 1 de 7" aparece

---

### 2. **Etapa 1: Dados Pessoais**

**Preencher:**
- Nome completo: `Maria Silva Teste`
- CPF: `123.456.789-00` (será validado)
- RG: `1234567MG`
- Sexo: `FEMININO`
- Possui deficiência?: `NAO`
- Email: `maria.teste@email.com`
- Telefone: `(62) 99999-8888`
- Telefone 2: `(62) 98888-7777` (opcional)
- Data de nascimento: `15/05/2000`
- Idade: `24` (calculada automaticamente)
- Nome da mãe: `Ana Silva`

**Validações que devem ocorrer:**
- ✅ CPF: 11 dígitos numéricos
- ✅ Email: formato válido
- ✅ Telefone: 10 ou 11 dígitos
- ✅ Idade mínima: 13 anos

**Clicar:** "Próxima Etapa"

---

### 3. **Etapa 2: Endereço**

**Preencher:**
- CEP: `74000-000`
  - ✅ Deve buscar endereço automaticamente via ViaCEP
  - ✅ Preenche: rua, bairro, cidade, estado
- Número: `100`
- Complemento: `Apto 201` (opcional)

**O que deve acontecer:**
- ✅ Ao digitar CEP válido, campos são preenchidos automaticamente
- ✅ Loading spinner aparece durante busca

**Clicar:** "Próxima Etapa"

---

### 4. **Etapa 3: Responsável Legal** (Pular se maior de idade)

**Se menor de idade:**
- ✅ Checkbox "Sou menor de idade" marcado
- Nome do responsável: `José Silva`
- CPF do responsável: `987.654.321-00`

**Se maior de idade:**
- ✅ Etapa é pulada automaticamente

**Clicar:** "Próxima Etapa"

---

### 5. **Etapa 4: Seleção de Curso**

**Preencher:**
- Curso (1ª opção): `Desenvolvimento Web Full Stack`
- Turno (1ª opção): `MATUTINO`
- Curso (2ª opção): `Python para Ciência de Dados` (opcional)
- Turno (2ª opção): `VESPERTINO` (opcional)
- Local preferencial: `Campus 1` (opcional)

**O que deve acontecer:**
- ✅ Lista de cursos carregada da API
- ✅ Cursos aparecem no select
- ✅ Segunda opção é opcional

**Clicar:** "Próxima Etapa"

---

### 6. **Etapa 5: Questionário Social**

**Preencher:**
- Raça/Cor: `PARDO`
- Renda mensal familiar: `1_A_2_SM`
- Quantas pessoas dependem da renda?: `4`
- Tipo de residência: `PROPRIA_QUITADA`
- Itens que possui em casa: Marcar `TV`, `CELULAR`, `COMPUTADOR`, `INTERNET`

**Clicar:** "Próxima Etapa"

---

### 7. **Etapa 6: Programa Goianas na Ciência**

**Preencher:**
- Participou do Programa Goianas na Ciência?: `NAO`

**Clicar:** "Próxima Etapa"

---

### 8. **Etapa 7: Upload de Documentos** (Opcional)

**Documentos aceitos:**
- RG (frente e verso)
- CPF do aluno
- Comprovante de endereço
- Identidade do responsável (se menor)
- CPF do responsável (se menor)
- Comprovante de escolaridade
- Foto 3x4

**Ação:** Pode pular (todos opcionais por enquanto)

**Clicar:** "Enviar Inscrição"

---

### 9. **Envio e Confirmação**

**O que deve acontecer:**

#### 1. Loading
```
⏳ Enviando inscrição...
```

#### 2. Sucesso
```
✅ Inscrição realizada com sucesso!
Sua candidatura foi enviada e está em análise. Você receberá um retorno em breve.
```

#### 3. Redirecionamento
- Formulário é limpo
- Volta para etapa 1
- Dados são resetados

---

## 🧪 Teste via API (Backend)

### 1. **Verificar Cursos Públicos**

```bash
curl -X GET "http://localhost:3333/api/courses/public"
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "nome": "Desenvolvimento Web Full Stack",
        "carga_horaria": 160,
        "nivel": "INTERMEDIARIO",
        "status": "ATIVO"
      }
    ]
  }
}
```

---

### 2. **Criar Inscrição Completa**

```bash
curl -X POST "http://localhost:3333/api/candidates/public" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva Teste",
    "cpf": "12345678900",
    "email": "maria.teste@email.com",
    "telefone": "62999998888",
    "data_nascimento": "2000-05-15",
    "curso_id": 1,
    "turno": "MATUTINO",
    "rg": "1234567MG",
    "sexo": "FEMININO",
    "deficiencia": "NAO",
    "telefone2": "62988887777",
    "idade": 24,
    "nome_mae": "Ana Silva",
    "cep": "74000000",
    "rua": "Rua Teste",
    "numero": "100",
    "complemento": "Apto 201",
    "bairro": "Centro",
    "cidade": "Goiânia",
    "estado": "GO",
    "curso_id2": 2,
    "turno2": "VESPERTINO",
    "local_curso": "Campus 1",
    "raca_cor": "PARDO",
    "renda_mensal": "1_A_2_SM",
    "pessoas_renda": "4",
    "tipo_residencia": "PROPRIA_QUITADA",
    "itens_casa": "TV,CELULAR,COMPUTADOR,INTERNET",
    "goianas_ciencia": "NAO",
    "menor_idade": false
  }'
```

**Resposta esperada (sucesso):**
```json
{
  "message": "Candidatura enviada com sucesso",
  "data": {
    "id": 4,
    "nome": "Maria Silva Teste",
    "email": "maria.teste@email.com",
    "status": "pendente",
    "curso": {
      "id": 1,
      "nome": "Desenvolvimento Web Full Stack"
    },
    "turno": "MATUTINO",
    "createdAt": "2025-11-13T..."
  }
}
```

**Resposta esperada (CPF duplicado):**
```json
{
  "error": "Já existe uma candidatura com este CPF"
}
```

---

### 3. **Verificar Candidato no Banco**

```bash
docker exec sukatech_mysql mysql -u sukatech -psukatech123 -e "
SELECT 
  id, nome, cpf, email, sexo, raca_cor, 
  menor_idade, goianas_ciencia, status 
FROM sukatechdb.candidatos 
ORDER BY id DESC 
LIMIT 1;
"
```

**Resultado esperado:**
```
+----+-------------------+-------------+----------------------+----------+-----------+--------------+------------------+----------+
| id | nome              | cpf         | email                | sexo     | raca_cor  | menor_idade  | goianas_ciencia  | status   |
+----+-------------------+-------------+----------------------+----------+-----------+--------------+------------------+----------+
|  4 | Maria Silva Teste | 12345678900 | maria.teste@email.com| FEMININO | PARDO     |            0 | NAO              | pendente |
+----+-------------------+-------------+----------------------+----------+-----------+--------------+------------------+----------+
```

---

### 4. **Verificar Todos os 29 Campos Adicionais**

```bash
docker exec sukatech_mysql mysql -u sukatech -psukatech123 -e "
SELECT * FROM sukatechdb.candidatos WHERE id = 4\G
"
```

**Deve mostrar TODOS os campos:**
- ✅ rg, sexo, deficiencia, telefone2, idade, nome_mae
- ✅ curso_id2, turno2, local_curso
- ✅ raca_cor, renda_mensal, pessoas_renda, tipo_residencia, itens_casa
- ✅ goianas_ciencia
- ✅ menor_idade, nome_responsavel, cpf_responsavel

---

## 🎯 Checklist de Testes

### Frontend
- [ ] Acessa `/inscricao` com sucesso
- [ ] Cursos carregam da API pública
- [ ] Formulário em 7 etapas funciona
- [ ] Validações impedem envio com campos inválidos
- [ ] CEP busca endereço automaticamente
- [ ] Máscaras funcionam (CPF, telefone, CEP)
- [ ] Envio exibe loading
- [ ] Sucesso exibe toast verde
- [ ] Formulário limpa após envio

### Backend
- [ ] Endpoint `/api/courses/public` retorna cursos
- [ ] Endpoint `/api/candidates/public` aceita requisição
- [ ] Valida CPF único
- [ ] Valida email único
- [ ] Salva todos os 29 campos adicionais
- [ ] Retorna candidato criado com sucesso
- [ ] Status inicial = 'pendente'

### Banco de Dados
- [ ] Candidato salvo com todos os campos
- [ ] CPF armazenado sem máscara (11 dígitos)
- [ ] Telefones sem máscara
- [ ] Estado em maiúsculo (GO, SP, etc)
- [ ] itens_casa como string CSV
- [ ] menor_idade como boolean

---

## ⚠️ Possíveis Problemas

### 1. Cursos não aparecem no formulário
**Causa:** Endpoint `/api/courses/public` não configurado ou sem cursos ativos

**Solução:**
```bash
# Verificar cursos no banco
docker exec sukatech_mysql mysql -u sukatech -psukatech123 -e "SELECT id, nome, status FROM sukatechdb.cursos;"

# Criar curso se necessário
docker exec sukatech_mysql mysql -u sukatech -psukatech123 -e "UPDATE sukatechdb.cursos SET status='ATIVO' WHERE id=1;"
```

---

### 2. Erro "CPF já cadastrado"
**Causa:** Tentando cadastrar mesmo CPF duas vezes

**Solução:** Use CPF diferente ou delete o candidato anterior:
```bash
docker exec sukatech_mysql mysql -u sukatech -psukatech123 -e "DELETE FROM sukatechdb.candidatos WHERE cpf='12345678900';"
```

---

### 3. Campos não salvam no banco
**Causa:** Model não atualizado ou migrations não executadas

**Solução:**
```bash
# Executar migrations
docker exec app_backend npx sequelize-cli db:migrate

# Reiniciar backend
docker compose restart app_backend
```

---

### 4. Erro 500 ao enviar
**Causa:** Campo ENUM com valor inválido ou faltando campo obrigatório

**Verificar logs:**
```bash
docker logs app_backend --tail 50
```

---

## 📊 Resultado Esperado

Após completar todos os testes:

✅ **Frontend:**
- Formulário completo funciona
- Envia todos os 29 campos para API
- Mostra sucesso e limpa dados

✅ **Backend:**
- Recebe requisição pública (sem token)
- Valida dados
- Salva candidato com todos os campos
- Retorna resposta de sucesso

✅ **Banco de Dados:**
- Candidato criado com status `pendente`
- Todos os 29 campos adicionais salvos
- Pronto para aprovação via página admin

---

**Data:** 13/11/2025  
**Status:** ✅ Backend atualizado, pronto para testes
