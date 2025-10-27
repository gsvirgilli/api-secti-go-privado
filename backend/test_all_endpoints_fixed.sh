#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3333/api"
TOKEN=""

echo "🧪 =========================================="
echo "🧪 TESTANDO TODOS OS ENDPOINTS (VERSÃO CORRIGIDA)"
echo "🧪 =========================================="
echo ""

# Teste 1: Health Check
echo "📋 TESTE 1: Health Check"
curl -s -w "\nStatus: %{http_code}\n" -X GET "$BASE_URL/health" > /dev/null
curl -s -w "\nStatus: %{http_code}\n" -X GET "$BASE_URL/ping" > /dev/null
echo ""

# Teste 2: Register User
echo "📋 TESTE 2: Autenticação - Register"
register_response=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Test User","email":"test'$(date +%s)'@example.com","senha":"senha123"}')
echo "Register: $register_response"
echo ""

# Teste 3: Login
echo "📋 TESTE 3: Login"
TEST_EMAIL="test$(date +%s)@example.com"
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Test User\",\"email\":\"$TEST_EMAIL\",\"senha\":\"senha123\"}" > /dev/null

login_response=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"senha\":\"senha123\"}")

TOKEN=$(echo $login_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token obtido: ${TOKEN:0:50}..."
echo ""

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Falha ao obter token${NC}"
  exit 1
fi

# Teste 4: Protected endpoints
echo "📋 TESTE 4: Endpoints Protegidos"
curl -s -w "\nStatus: %{http_code}\n" -X GET "$BASE_URL/users/me" \
  -H "Authorization: Bearer $TOKEN" > /dev/null
curl -s -w "\nStatus: %{http_code}\n" -X GET "$BASE_URL/me" \
  -H "Authorization: Bearer $TOKEN" > /dev/null
echo ""

# Teste 5: Courses
echo "📋 TESTE 5: Cursos"
curl -s -X GET "$BASE_URL/courses" \
  -H "Authorization: Bearer $TOKEN" | head -c 200
echo "..."

course_data='{"nome":"Test Course '$(date +%s)'","carga_horaria":40,"descricao":"Test Description"}'
create_response=$(curl -s -X POST "$BASE_URL/courses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$course_data")
COURSE_ID=$(echo $create_response | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)

curl -s -X GET "$BASE_URL/courses/$COURSE_ID" \
  -H "Authorization: Bearer $TOKEN" > /dev/null

curl -s -X GET "$BASE_URL/courses/statistics" \
  -H "Authorization: Bearer $TOKEN" | head -c 200
echo "..."
echo ""

# Teste 6: Classes
echo "📋 TESTE 6: Turmas"
curl -s -X GET "$BASE_URL/classes" \
  -H "Authorization: Bearer $TOKEN" > /dev/null

# Criar turma com dados corretos
class_data="{\"nome\":\"Turma Test $(date +%s)\",\"turno\":\"NOITE\",\"id_curso\":$COURSE_ID,\"data_inicio\":\"2024-01-15T00:00:00.000Z\",\"data_fim\":\"2024-06-15T00:00:00.000Z\"}"
create_class_response=$(curl -s -X POST "$BASE_URL/classes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$class_data")
echo "Create Class: $create_class_response"

curl -s -X GET "$BASE_URL/classes/statistics" \
  -H "Authorization: Bearer $TOKEN" | head -c 200
echo "..."
echo ""

# Teste 7: Candidates
echo "📋 TESTE 7: Candidatos"
curl -s -X GET "$BASE_URL/candidates" \
  -H "Authorization: Bearer $TOKEN" | head -c 200
echo "..."

# Criar candidato com data_nascimento
CPF=$(printf "%011d" $(date +%s | tail -c 10))
candidate_data="{\"nome\":\"Maria Silva $(date +%s)\",\"cpf\":\"$CPF\",\"email\":\"maria$(date +%s)@example.com\",\"data_nascimento\":\"1990-01-15\"}"
create_candidate_response=$(curl -s -X POST "$BASE_URL/candidates" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$candidate_data")
echo "Create Candidate: $create_candidate_response"

curl -s -X GET "$BASE_URL/candidates/statistics" \
  -H "Authorization: Bearer $TOKEN" | head -c 200
echo "..."
echo ""

# Teste 8: Students
echo "📋 TESTE 8: Alunos"
curl -s -X GET "$BASE_URL/students" \
  -H "Authorization: Bearer $TOKEN" > /dev/null
curl -s -X GET "$BASE_URL/students/statistics" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

echo "🧪 =========================================="
echo "🧪 TESTES CONCLUÍDOS"
echo "🧪 =========================================="
