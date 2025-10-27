#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3333/api"
TOKEN=""

echo "🧪 =========================================="
echo "🧪 TESTANDO TODOS OS ENDPOINTS"
echo "🧪 =========================================="
echo ""

# Função para fazer requests
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${YELLOW}Testing: $description${NC}"
    echo "  $method $endpoint"
    
    if [ -n "$data" ]; then
        if [ "$method" = "POST" ] || [ "$method" = "PUT" ]; then
            if [ -n "$TOKEN" ]; then
                response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
                    -H "Content-Type: application/json" \
                    -H "Authorization: Bearer $TOKEN" \
                    -d "$data")
            else
                response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
                    -H "Content-Type: application/json" \
                    -d "$data")
            fi
        else
            if [ -n "$TOKEN" ]; then
                response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
                    -H "Authorization: Bearer $TOKEN")
            else
                response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint")
            fi
        fi
    else
        if [ -n "$TOKEN" ]; then
            response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
                -H "Authorization: Bearer $TOKEN")
        else
            response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint")
        fi
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    echo "  Status: $http_code"
    echo "  Response: $body"
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ PASSED${NC}"
    else
        echo -e "${RED}❌ FAILED${NC}"
    fi
    echo ""
}

# Teste 1: Health Check
echo "📋 TESTE 1: Health Check"
test_endpoint "GET" "/health" "" "Health check endpoint"
test_endpoint "GET" "/ping" "" "Ping endpoint"
echo ""

# Teste 2: Register User
echo "📋 TESTE 2: Autenticação - Register"
register_data='{"nome":"Test User","email":"test@example.com","senha":"senha123"}'
test_endpoint "POST" "/auth/register" "$register_data" "Register new user"

# Verificar se temos o token
echo "🔑 Tentando fazer login para obter token..."
login_response=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","senha":"senha123"}')

TOKEN=$(echo $login_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✅ Token obtido com sucesso${NC}"
    echo "Token: ${TOKEN:0:50}..."
else
    echo -e "${RED}❌ Falha ao obter token${NC}"
    echo "Response: $login_response"
fi
echo ""

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Não foi possível obter token. Abortando testes que requerem autenticação.${NC}"
    exit 1
fi

# Teste 3: Endpoints Protegidos
echo "📋 TESTE 3: Endpoints Protegidos"

test_endpoint "GET" "/users/me" "" "Get current user"
test_endpoint "GET" "/me" "" "Alternative me endpoint"
echo ""

# Teste 4: Courses
echo "📋 TESTE 4: Cursos"

# List courses
test_endpoint "GET" "/courses" "" "List all courses"

# Create course
course_data='{"nome":"JavaScript Basics","carga_horaria":40,"descricao":"Curso básico de JavaScript"}'
test_endpoint "POST" "/courses" "$course_data" "Create new course"

# Get course by ID
test_endpoint "GET" "/courses/1" "" "Get course by ID"

# Get statistics
test_endpoint "GET" "/courses/statistics" "" "Get course statistics"
echo ""

# Teste 5: Classes
echo "📋 TESTE 5: Turmas"

# List classes
test_endpoint "GET" "/classes" "" "List all classes"

# Check conflict
check_conflict_data='{"data_inicio":"2024-01-15","data_fim":"2024-06-15","turno":"NOITE"}'
test_endpoint "POST" "/classes/check-conflict" "$check_conflict_data" "Check class conflict"

# Create class
class_data='{"nome":"Turma A - JavaScript","turno":"NOITE","id_curso":1,"data_inicio":"2024-01-15","data_fim":"2024-06-15"}'
test_endpoint "POST" "/classes" "$class_data" "Create new class"

# Get statistics
test_endpoint "GET" "/classes/statistics" "" "Get class statistics"
echo ""

# Teste 6: Candidates
echo "📋 TESTE 6: Candidatos"

# List candidates
test_endpoint "GET" "/candidates" "" "List all candidates"

# Create candidate
candidate_data='{"nome":"Maria Silva","cpf":"12345678901","email":"maria@example.com","id_turma_desejada":1}'
test_endpoint "POST" "/candidates" "$candidate_data" "Create new candidate"

# Get statistics
test_endpoint "GET" "/candidates/statistics" "" "Get candidate statistics"
echo ""

# Teste 7: Students
echo "📋 TESTE 7: Alunos"

# List students
test_endpoint "GET" "/students" "" "List all students"

# Get statistics
test_endpoint "GET" "/students/statistics" "" "Get student statistics"

echo ""
echo "🧪 =========================================="
echo "🧪 TESTES CONCLUÍDOS"
echo "🧪 =========================================="
