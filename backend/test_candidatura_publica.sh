#!/bin/bash

echo "======================================"
echo "🧪 TESTANDO ENDPOINT DE CANDIDATURA PÚBLICA"
echo "======================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:3333/api"

# Função para testar endpoint
test_endpoint() {
  local test_name=$1
  local method=$2
  local endpoint=$3
  local data=$4
  local expected_status=$5
  
  echo -e "${YELLOW}Teste: ${test_name}${NC}"
  echo "Endpoint: ${method} ${endpoint}"
  
  if [ -n "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X ${method} \
      -H "Content-Type: application/json" \
      -d "${data}" \
      "${API_URL}${endpoint}")
  else
    response=$(curl -s -w "\n%{http_code}" -X ${method} \
      -H "Content-Type: application/json" \
      "${API_URL}${endpoint}")
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  echo "Status: ${http_code}"
  echo "Response: ${body}" | jq '.' 2>/dev/null || echo "${body}"
  
  if [ "$http_code" == "$expected_status" ]; then
    echo -e "${GREEN}✅ PASSOU${NC}"
  else
    echo -e "${RED}❌ FALHOU (esperado: ${expected_status}, recebido: ${http_code})${NC}"
  fi
  
  echo ""
  echo "--------------------------------------"
  echo ""
}

# 1. Verificar se há cursos disponíveis (SKIP - rota protegida)
# echo "======================================"
# echo "📚 PRÉ-REQUISITO: Verificar Cursos"
# echo "======================================"
# echo ""
# 
# test_endpoint \
#   "Listar cursos disponíveis" \
#   "GET" \
#   "/courses" \
#   "" \
#   "200"

# 2. Usar curso e turma já existentes no banco
echo "======================================"
echo "📝 PRÉ-REQUISITOS"
echo "======================================"
echo ""
echo "ℹ️  Usando curso ID 1 (Python para Iniciantes)"
echo "ℹ️  Usando turma ID 1 (Turma Python 2025-1 - Matutino)"
echo ""

COURSE_ID=1

# 3. Testar candidatura pública
echo "======================================"
echo "🎯 TESTES DE CANDIDATURA PÚBLICA"
echo "======================================"
echo ""

# Teste 1: Candidatura válida completa
CANDIDATE_DATA="{
  \"nome\": \"João da Silva Teste\",
  \"cpf\": \"12345678901\",
  \"email\": \"joao.teste.$(date +%s)@email.com\",
  \"telefone\": \"11999887766\",
  \"data_nascimento\": \"1995-05-15\",
  \"cep\": \"01310100\",
  \"rua\": \"Avenida Paulista\",
  \"numero\": \"1578\",
  \"complemento\": \"Apto 101\",
  \"bairro\": \"Bela Vista\",
  \"cidade\": \"São Paulo\",
  \"estado\": \"SP\",
  \"curso_id\": ${COURSE_ID},
  \"turno\": \"MATUTINO\"
}"

test_endpoint \
  "Candidatura pública válida (com endereço)" \
  "POST" \
  "/candidates/public" \
  "${CANDIDATE_DATA}" \
  "201"

# Teste 2: CPF inválido
INVALID_CPF_DATA="{
  \"nome\": \"Maria Santos\",
  \"cpf\": \"111\",
  \"email\": \"maria.$(date +%s)@email.com\",
  \"telefone\": \"11988776655\",
  \"data_nascimento\": \"1998-03-20\",
  \"curso_id\": ${COURSE_ID},
  \"turno\": \"NOTURNO\"
}"

test_endpoint \
  "CPF inválido (deve falhar)" \
  "POST" \
  "/candidates/public" \
  "${INVALID_CPF_DATA}" \
  "400"

# Teste 3: Email inválido
INVALID_EMAIL_DATA="{
  \"nome\": \"Carlos Oliveira\",
  \"cpf\": \"98765432109\",
  \"email\": \"email-invalido\",
  \"telefone\": \"11977665544\",
  \"data_nascimento\": \"1992-08-10\",
  \"curso_id\": ${COURSE_ID},
  \"turno\": \"VESPERTINO\"
}"

test_endpoint \
  "Email inválido (deve falhar)" \
  "POST" \
  "/candidates/public" \
  "${INVALID_EMAIL_DATA}" \
  "400"

# Teste 4: CPF duplicado
DUPLICATE_CPF_DATA="{
  \"nome\": \"Pedro Duplicado\",
  \"cpf\": \"12345678901\",
  \"email\": \"pedro.$(date +%s)@email.com\",
  \"telefone\": \"11966554433\",
  \"data_nascimento\": \"1990-12-01\",
  \"curso_id\": ${COURSE_ID},
  \"turno\": \"MATUTINO\"
}"

test_endpoint \
  "CPF duplicado (deve falhar)" \
  "POST" \
  "/candidates/public" \
  "${DUPLICATE_CPF_DATA}" \
  "409"

# Teste 5: Curso inexistente
INVALID_COURSE_DATA="{
  \"nome\": \"Ana Costa\",
  \"cpf\": \"11122233344\",
  \"email\": \"ana.$(date +%s)@email.com\",
  \"telefone\": \"11955443322\",
  \"data_nascimento\": \"1996-07-25\",
  \"curso_id\": 99999,
  \"turno\": \"MATUTINO\"
}"

test_endpoint \
  "Curso inexistente (deve falhar)" \
  "POST" \
  "/candidates/public" \
  "${INVALID_COURSE_DATA}" \
  "404"

# Teste 6: Turno não disponível
INVALID_SHIFT_DATA="{
  \"nome\": \"Roberto Lima\",
  \"cpf\": \"55566677788\",
  \"email\": \"roberto.$(date +%s)@email.com\",
  \"telefone\": \"11944332211\",
  \"data_nascimento\": \"1993-11-30\",
  \"curso_id\": ${COURSE_ID},
  \"turno\": \"VESPERTINO\"
}"

test_endpoint \
  "Turno não disponível para o curso (pode falhar)" \
  "POST" \
  "/candidates/public" \
  "${INVALID_SHIFT_DATA}" \
  "400"

# Teste 7: Candidatura mínima (sem endereço)
MINIMAL_CANDIDATE_DATA="{
  \"nome\": \"Fernanda Alves\",
  \"cpf\": \"99988877766\",
  \"email\": \"fernanda.$(date +%s)@email.com\",
  \"telefone\": \"11933221100\",
  \"data_nascimento\": \"1997-04-18\",
  \"curso_id\": ${COURSE_ID},
  \"turno\": \"MATUTINO\"
}"

test_endpoint \
  "Candidatura mínima (sem endereço)" \
  "POST" \
  "/candidates/public" \
  "${MINIMAL_CANDIDATE_DATA}" \
  "201"

echo "======================================"
echo "✅ TESTES CONCLUÍDOS!"
echo "======================================"
