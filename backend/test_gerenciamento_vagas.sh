#!/bin/bash

# Script de teste para gerenciamento automático de vagas em matrículas
# Testa: criação de matrícula (decrementa vagas), cancelamento (incrementa vagas), remoção

BASE_URL="http://localhost:3333/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

echo "========================================="
echo "🧪 TESTES - GERENCIAMENTO DE VAGAS"
echo "========================================="
echo ""

# Função para printar resultado
print_result() {
    local test_name=$1
    local expected=$2
    local actual=$3
    local response=$4
    
    if [ "$expected" == "$actual" ]; then
        echo -e "${GREEN}✅ PASSOU:${NC} $test_name"
        echo -e "   Status: $actual"
        ((PASSED++))
    else
        echo -e "${RED}❌ FALHOU:${NC} $test_name"
        echo -e "   Esperado: $expected"
        echo -e "   Recebido: $actual"
        echo -e "   Response: $response"
        ((FAILED++))
    fi
    echo ""
}

# 1. Fazer login e obter token
echo "🔐 Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","senha":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token // .data.token // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
    echo -e "${YELLOW}⚠ Falha no login. Tentando criar usuário...${NC}"
    
    # Registrar novo admin
    curl -s -X POST "$BASE_URL/auth/register" \
      -H "Content-Type: application/json" \
      -d '{"nome":"Admin Teste","email":"admin@test.com","senha":"admin123","role":"ADMIN"}' > /dev/null
    
    # Tentar login novamente
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d '{"email":"admin@test.com","senha":"admin123"}')
    
    TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token // .data.token // empty')
    
    if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
        echo -e "${RED}❌ Falha no login. Token não obtido.${NC}"
        echo "Response: $LOGIN_RESPONSE"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Login realizado com sucesso${NC}"
echo ""

# 2. Criar um curso de teste
echo "📚 Criando curso de teste..."
TIMESTAMP=$(date +%s)
COURSE_RESPONSE=$(curl -s -X POST "$BASE_URL/courses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"nome\":\"Curso Teste Vagas $TIMESTAMP\",\"descricao\":\"Curso para testar gerenciamento de vagas\",\"carga_horaria\":40}")

COURSE_ID=$(echo $COURSE_RESPONSE | jq -r '.data.id // .id // empty')
echo "Curso criado com ID: $COURSE_ID"
echo ""

# 3. Criar uma turma com 5 vagas
echo "🏫 Criando turma com 5 vagas..."
CLASS_RESPONSE=$(curl -s -X POST "$BASE_URL/classes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"nome\":\"Turma Teste Vagas $TIMESTAMP\",\"turno\":\"MANHA\",\"id_curso\":$COURSE_ID,\"vagas\":5}")

CLASS_ID=$(echo $CLASS_RESPONSE | jq -r '.id // empty')
INITIAL_VAGAS=$(echo $CLASS_RESPONSE | jq -r '.vagas // empty')
echo "Turma criada com ID: $CLASS_ID"
echo "Vagas iniciais: $INITIAL_VAGAS"
echo ""

# 4. Criar um aluno de teste via inserção no banco
echo "👤 Criando aluno de teste no banco de dados..."
STUDENT_CPF="999$(date +%H%M%S)001"
docker exec $(docker ps -q -f name=mysql) mysql -usukatech_user -psukatech_password -Dsukatechdb -e "INSERT INTO alunos (nome, email, cpf, matricula, createdAt, updatedAt) VALUES ('Aluno Teste Vagas', 'aluno$TIMESTAMP@test.com', '$STUDENT_CPF', 'TEST$TIMESTAMP', NOW(), NOW());" 2>&1 > /dev/null

STUDENT_ID=$(docker exec $(docker ps -q -f name=mysql) mysql -usukatech_user -psukatech_password -Dsukatechdb -se "SELECT id FROM alunos WHERE cpf='$STUDENT_CPF' LIMIT 1;")
echo "Aluno criado com ID: $STUDENT_ID"
echo ""

# ========================================
# TESTE 1: Verificar vagas antes de criar matrícula
# ========================================
echo "TEST 1: Verificar vagas iniciais da turma"
RESPONSE=$(curl -s -X GET "$BASE_URL/classes/$CLASS_ID" \
  -H "Authorization: Bearer $TOKEN")
STATUS=$(echo $RESPONSE | jq -r 'if .id then 200 else if .message then 404 else 500 end end')
VAGAS_ANTES=$(echo $RESPONSE | jq -r '.vagas // empty')

echo "Vagas antes: $VAGAS_ANTES"
print_result "Verificar vagas iniciais (5)" "5" "$VAGAS_ANTES" "$RESPONSE"

# ========================================
# TESTE 2: Criar matrícula e verificar decremento de vagas
# ========================================
echo "TEST 2: Criar matrícula (deve decrementar vagas)"
ENROLL_RESPONSE=$(curl -s -X POST "$BASE_URL/enrollments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"id_aluno\":$STUDENT_ID,\"id_turma\":$CLASS_ID}")

ENROLL_STATUS=$(echo $ENROLL_RESPONSE | jq -r 'if .id then 201 else if .message then 400 else 500 end end')
echo "Response matrícula: $ENROLL_RESPONSE"

# Verificar vagas após criar matrícula
sleep 1
RESPONSE_AFTER=$(curl -s -X GET "$BASE_URL/classes/$CLASS_ID" \
  -H "Authorization: Bearer $TOKEN")
VAGAS_DEPOIS=$(echo $RESPONSE_AFTER | jq -r '.vagas // empty')

echo "Vagas depois de criar matrícula: $VAGAS_DEPOIS"
print_result "Criar matrícula decrementa vagas (4)" "4" "$VAGAS_DEPOIS" "$RESPONSE_AFTER"

# ========================================
# TESTE 3: Cancelar matrícula e verificar incremento de vagas
# ========================================
echo "TEST 3: Cancelar matrícula (deve incrementar vagas)"
CANCEL_RESPONSE=$(curl -s -X PATCH "$BASE_URL/enrollments/$STUDENT_ID/$CLASS_ID/cancel" \
  -H "Authorization: Bearer $TOKEN")

CANCEL_STATUS=$(echo $CANCEL_RESPONSE | jq -r 'if .message then 200 else 500 end')
echo "Response cancelamento: $CANCEL_RESPONSE"

# Verificar vagas após cancelar
sleep 1
RESPONSE_CANCEL=$(curl -s -X GET "$BASE_URL/classes/$CLASS_ID" \
  -H "Authorization: Bearer $TOKEN")
VAGAS_APOS_CANCEL=$(echo $RESPONSE_CANCEL | jq -r '.vagas // empty')

echo "Vagas depois de cancelar matrícula: $VAGAS_APOS_CANCEL"
print_result "Cancelar matrícula incrementa vagas (5)" "5" "$VAGAS_APOS_CANCEL" "$RESPONSE_CANCEL"

# ========================================
# TESTE 4: Criar matrícula novamente
# ========================================
echo "TEST 4: Criar matrícula novamente"
ENROLL2_RESPONSE=$(curl -s -X POST "$BASE_URL/enrollments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"id_aluno\":$STUDENT_ID,\"id_turma\":$CLASS_ID}")

sleep 1
RESPONSE_AFTER2=$(curl -s -X GET "$BASE_URL/classes/$CLASS_ID" \
  -H "Authorization: Bearer $TOKEN")
VAGAS_DEPOIS2=$(echo $RESPONSE_AFTER2 | jq -r '.vagas // empty')

echo "Vagas depois de criar matrícula novamente: $VAGAS_DEPOIS2"
print_result "Segunda matrícula decrementa vagas (4)" "4" "$VAGAS_DEPOIS2" "$RESPONSE_AFTER2"

# ========================================
# TESTE 5: Deletar matrícula e verificar incremento
# ========================================
echo "TEST 5: Deletar matrícula completamente (deve incrementar vagas)"
DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/enrollments/$STUDENT_ID/$CLASS_ID" \
  -H "Authorization: Bearer $TOKEN")

DELETE_STATUS=$(echo $DELETE_RESPONSE | jq -r 'if .message then 200 else 500 end')
echo "Response deleção: $DELETE_RESPONSE"

# Verificar vagas após deletar
sleep 1
RESPONSE_DELETE=$(curl -s -X GET "$BASE_URL/classes/$CLASS_ID" \
  -H "Authorization: Bearer $TOKEN")
VAGAS_APOS_DELETE=$(echo $RESPONSE_DELETE | jq -r '.vagas // empty')

echo "Vagas depois de deletar matrícula: $VAGAS_APOS_DELETE"
print_result "Deletar matrícula incrementa vagas (5)" "5" "$VAGAS_APOS_DELETE" "$RESPONSE_DELETE"

# ========================================
# TESTE 6: Tentar matricular em turma sem vagas
# ========================================
echo "TEST 6: Tentar matricular em turma SEM vagas"

# Primeiro, reduzir vagas da turma para 0
docker exec $(docker ps -q -f name=mysql) mysql -usukatech_user -psukatech_password -Dsukatechdb -e "UPDATE turmas SET vagas = 0 WHERE id = $CLASS_ID;" 2>&1 > /dev/null

sleep 1

# Tentar criar matrícula
NO_VAGAS_RESPONSE=$(curl -s -X POST "$BASE_URL/enrollments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"id_aluno\":$STUDENT_ID,\"id_turma\":$CLASS_ID}")

NO_VAGAS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/enrollments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"id_aluno\":$STUDENT_ID,\"id_turma\":$CLASS_ID}")

echo "Status ao tentar matricular sem vagas: $NO_VAGAS_STATUS"
echo "Response: $NO_VAGAS_RESPONSE"
print_result "Matrícula sem vagas retorna 400" "400" "$NO_VAGAS_STATUS" "$NO_VAGAS_RESPONSE"

# ========================================
# TESTE 7: Verificar mensagem de erro ao tentar matricular sem vagas
# ========================================
echo "TEST 7: Verificar mensagem de erro correta"
ERROR_MSG=$(echo $NO_VAGAS_RESPONSE | jq -r '.message // empty')
EXPECTED_MSG="Não há vagas disponíveis nesta turma"

if echo "$ERROR_MSG" | grep -q "vaga"; then
    echo -e "${GREEN}✅ PASSOU:${NC} Mensagem de erro contém 'vaga'"
    ((PASSED++))
else
    echo -e "${RED}❌ FALHOU:${NC} Mensagem de erro não menciona vagas"
    echo "Mensagem recebida: $ERROR_MSG"
    ((FAILED++))
fi
echo ""

# ========================================
# RESULTADOS
# ========================================
echo "========================================="
echo "📊 RESULTADOS DOS TESTES"
echo "========================================="
echo -e "${GREEN}✅ Testes passados: $PASSED${NC}"
echo -e "${RED}❌ Testes falhados: $FAILED${NC}"
echo "Total: $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Todos os testes passaram!${NC}"
    exit 0
else
    echo -e "${RED}❌ Alguns testes falharam.${NC}"
    exit 1
fi
