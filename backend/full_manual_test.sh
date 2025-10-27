#!/bin/bash

API_URL="http://localhost:3333/api"
EMAIL="teste@sukatech.com"
PASSWORD="123456"
NOME="Usuário Teste"

echo "=========================================="
echo "TESTE MANUAL DE TODOS OS ENDPOINTS"
echo "=========================================="

# 1. Login para obter token
echo -e "\n\n1️⃣ AUTENTICAÇÃO - LOGIN"
echo "=================================================="
LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"senha\":\"$PASSWORD\"}")
TOKEN=$(echo $LOGIN | grep -oP '"token"\s*:\s*"\K[^"]+')
echo "Request: POST /auth/login"
echo "Response: $LOGIN"
echo "Token obtido: ${TOKEN:0:50}..."

if [ -z "$TOKEN" ]; then
  echo "❌ Erro: Token não foi obtido!"
  exit 1
fi

HEADER="Authorization: Bearer $TOKEN"

# 2. TURMAS (CLASSES)
echo -e "\n\n2️⃣ TURMAS (CLASSES)"
echo "=================================================="
echo -e "\n📋 GET /classes - Listar turmas"
curl -s -H "$HEADER" "$API_URL/classes" | jq '.' | head -20

echo -e "\n\n📌 GET /classes/1 - Buscar turma por ID"
curl -s -H "$HEADER" "$API_URL/classes/1" | jq '.' | head -20

echo -e "\n\n📊 GET /classes/statistics - Estatísticas"
curl -s -H "$HEADER" "$API_URL/classes/statistics" | jq '.' | head -20

# 3. ALUNOS (STUDENTS)
echo -e "\n\n3️⃣ ALUNOS (STUDENTS)"
echo "=================================================="
echo -e "\n📋 GET /students - Listar alunos"
curl -s -H "$HEADER" "$API_URL/students" | jq '.' | head -20

echo -e "\n\n📌 GET /students/1 - Buscar aluno por ID"
curl -s -H "$HEADER" "$API_URL/students/1" | jq '.' | head -20

# 4. CANDIDATOS (CANDIDATES)
echo -e "\n\n4️⃣ CANDIDATOS (CANDIDATES)"
echo "=================================================="
echo -e "\n📋 GET /candidates - Listar candidatos"
curl -s -H "$HEADER" "$API_URL/candidates" | jq '.' | head -20

echo -e "\n\n📌 GET /candidates/1 - Buscar candidato por ID"
curl -s -H "$HEADER" "$API_URL/candidates/1" | jq '.' | head -20

# 5. CURSOS (COURSES)
echo -e "\n\n5️⃣ CURSOS (COURSES)"
echo "=================================================="
echo -e "\n📋 GET /courses - Listar cursos"
curl -s -H "$HEADER" "$API_URL/courses" | jq '.' | head -20

echo -e "\n\n📌 GET /courses/1 - Buscar curso por ID"
curl -s -H "$HEADER" "$API_URL/courses/1" | jq '.' | head -20

# 6. USUÁRIOS (USERS)
echo -e "\n\n6️⃣ USUÁRIOS (USERS)"
echo "=================================================="
echo -e "\n👤 GET /users/me - Dados do usuário autenticado"
curl -s -H "$HEADER" "$API_URL/users/me" | jq '.' | head -20

# 7. SAÚDE (HEALTH)
echo -e "\n\n7️⃣ SAÚDE (HEALTH)"
echo "=================================================="
echo -e "\n💓 GET /health - Status do servidor"
curl -s "$API_URL/health" | jq '.' | head -20

echo -e "\n\n8️⃣ PING"
echo "=================================================="
echo -e "\n🏓 GET /ping - Verificar servidor ativo"
curl -s "$API_URL/ping" | jq '.'

echo -e "\n\n=========================================="
echo "✅ TESTES MANUAIS CONCLUÍDOS!"
echo "=========================================="
