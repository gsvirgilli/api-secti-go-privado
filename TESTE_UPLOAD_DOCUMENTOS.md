# Teste de Upload de Documentos - Sistema de Inscrição

## Data: 13/11/2025

## Status da Implementação
✅ Backend configurado com multer
✅ Migration aplicada (9 colunas _url criadas)
✅ Frontend preparado para enviar FormData
✅ Rota /api/candidates/public aceita multipart/form-data

## Como Testar

### 1. Teste Manual via Interface
Acesse: http://localhost:8080/inscricao

Preencha todas as 7 etapas:
- **Etapa 1:** Dados Pessoais (nome, CPF, RG, etc.)
- **Etapa 2:** Endereço (CEP com ViaCEP)
- **Etapa 3:** Responsável Legal (se menor de idade)
- **Etapa 4:** Seleção de Curso (carrega da API)
- **Etapa 5:** Questionário Social
- **Etapa 6:** Programa Goianas na Ciência
- **Etapa 7:** Upload de Documentos (TESTE AQUI!)

**Documentos que podem ser enviados:**
- RG Frente (obrigatório)
- RG Verso
- CPF do Aluno
- Comprovante de Endereço
- Identidade Responsável Frente
- Identidade Responsável Verso
- CPF do Responsável
- Comprovante de Escolaridade
- Foto 3x4

### 2. Teste via CURL (linha de comando)

```bash
# Criar arquivos de teste
echo "RG FRENTE TESTE" > /tmp/rg_frente.txt
echo "RG VERSO TESTE" > /tmp/rg_verso.txt

# Enviar inscrição com documentos
curl -X POST http://localhost:3333/api/candidates/public \
  -F "nome=João Silva Teste" \
  -F "cpf=12345678901" \
  -F "email=joao.teste@email.com" \
  -F "telefone=62999887766" \
  -F "data_nascimento=2000-05-15" \
  -F "rg=1234567" \
  -F "sexo=MASCULINO" \
  -F "deficiencia=NAO" \
  -F "idade=25" \
  -F "nome_mae=Maria Silva" \
  -F "cep=74000000" \
  -F "rua=Rua Teste" \
  -F "numero=123" \
  -F "bairro=Centro" \
  -F "cidade=Goiânia" \
  -F "estado=GO" \
  -F "curso_id=1" \
  -F "turno=MATUTINO" \
  -F "raca_cor=PARDO" \
  -F "renda_mensal=1_A_2_SM" \
  -F "pessoas_renda=3" \
  -F "tipo_residencia=ALUGADA" \
  -F "goianas_ciencia=SIM" \
  -F "menor_idade=false" \
  -F "rg_frente=@/tmp/rg_frente.txt" \
  -F "rg_verso=@/tmp/rg_verso.txt"
```

### 3. Verificar Resultados

**No Banco de Dados:**
```bash
docker exec sukatech_mysql mysql -u root -proot_password_super_secreta -e \
"SELECT id, nome, email, rg_frente_url, rg_verso_url, status FROM sukatechdb.candidatos ORDER BY id DESC LIMIT 1;"
```

**Arquivos Salvos:**
```bash
ls -lh backend/uploads/documents/
```

**Via API (buscar último candidato):**
```bash
# Login como admin
TOKEN=$(curl -s -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@secti.com","password":"admin123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Listar candidatos
curl -s http://localhost:3333/api/candidates \
  -H "Authorization: Bearer $TOKEN" | jq '.data[-1]'
```

## Validações Esperadas

✅ Arquivos salvos em `backend/uploads/documents/` com nomes únicos
✅ Caminhos salvos no banco: `/uploads/documents/rg_frente-TIMESTAMP.ext`
✅ Candidato criado com status 'pendente'
✅ Validação de tipos de arquivo (apenas imagens e PDFs)
✅ Validação de tamanho (máx 5MB por arquivo)

## Possíveis Erros

❌ **"Tipo de arquivo não permitido"** - Enviar apenas JPG, PNG, GIF ou PDF
❌ **"File too large"** - Arquivos maiores que 5MB
❌ **"CPF já cadastrado"** - Usar CPF único em cada teste
❌ **"Curso não encontrado"** - Verificar se curso_id existe (1, 2 ou 3)
