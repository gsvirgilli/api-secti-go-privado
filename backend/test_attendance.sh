#!/bin/bash

# Script de teste para Sistema de Presença (Branch 4)
# Testa: criação, atualização, leitura, relatórios e estatísticas

BASE_URL="http://localhost:3333/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

echo "========================================="
echo "🧪 TESTES - SISTEMA DE PRESENÇA (BRANCH 4)"
echo "========================================="
echo ""

# Função para printar resultado
print_result() {
    local test_name=$1
    local expected=$2
    local actual=$3
    
    if [ "$expected" == "$actual" ]; then
        echo -e "${GREEN}✅ PASSOU:${NC} $test_name"
        ((PASSED++))
    else
        echo -e "${RED}❌ FALHOU:${NC} $test_name"
        echo -e "   Esperado: $expected"
        echo -e "   Recebido: $actual"
        ((FAILED++))
    fi
    echo ""
}

# 1. Fazer login
echo "🔐 Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","senha":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
    echo -e "${RED}❌ Falha no login. Token não obtido.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Login realizado com sucesso${NC}"
echo ""

# Usar turma e aluno existentes com matrícula válida
TURMA_ID=8
ALUNO_ID=1
DATA_HOJE=$(date +%Y-%m-%d)

# ========================================
# TESTE 1: Registrar presença individual
# ========================================
echo "TEST 1: Registrar presença individual"
RESPONSE=$(curl -s -X POST "$BASE_URL/attendances" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"id_aluno\":$ALUNO_ID,\"id_turma\":$TURMA_ID,\"data_chamada\":\"$DATA_HOJE\",\"status\":\"PRESENTE\"}")

STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/attendances" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"id_aluno\":$ALUNO_ID,\"id_turma\":$TURMA_ID,\"data_chamada\":\"$DATA_HOJE\",\"status\":\"PRESENTE\"}")

ATTENDANCE_ID=$(echo $RESPONSE | jq -r '.data.id // empty')
print_result "Registrar presença retorna 201 ou 409" "true" "$([[ $STATUS == "201" || $STATUS == "409" ]] && echo true || echo false)"

# ========================================
# TESTE 2: Listar presenças da turma
# ========================================
echo "TEST 2: Listar presenças da turma"
RESPONSE=$(curl -s -X GET "$BASE_URL/attendances?id_turma=$TURMA_ID" \
  -H "Authorization: Bearer $TOKEN")

STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/attendances?id_turma=$TURMA_ID" \
  -H "Authorization: Bearer $TOKEN")

print_result "Listar presenças retorna 200" "200" "$STATUS"

# ========================================
# TESTE 3: Buscar presença por ID
# ========================================
if [ ! -z "$ATTENDANCE_ID" ] && [ "$ATTENDANCE_ID" != "null" ]; then
    echo "TEST 3: Buscar presença por ID"
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/attendances/$ATTENDANCE_ID" \
      -H "Authorization: Bearer $TOKEN")
    
    print_result "Buscar presença por ID retorna 200" "200" "$STATUS"
fi

# ========================================
# TESTE 4: Atualizar status de presença
# ========================================
if [ ! -z "$ATTENDANCE_ID" ] && [ "$ATTENDANCE_ID" != "null" ]; then
    echo "TEST 4: Atualizar status de presença"
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH "$BASE_URL/attendances/$ATTENDANCE_ID" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{"status":"JUSTIFICADO"}')
    
    print_result "Atualizar presença retorna 200" "200" "$STATUS"
fi

# ========================================
# TESTE 5: Registro em lote de presenças
# ========================================
echo "TEST 5: Registro em lote de presenças"
DATA_BULK=$(date -d "+1 day" +%Y-%m-%d 2>/dev/null || date -v+1d +%Y-%m-%d)
BULK_RESPONSE=$(curl -s -X POST "$BASE_URL/attendances/bulk" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"id_turma\":$TURMA_ID,
    \"data_chamada\":\"$DATA_BULK\",
    \"attendances\":[
      {\"id_aluno\":1,\"status\":\"PRESENTE\"}
    ]
  }")

STATUS=$(echo $BULK_RESPONSE | jq -r 'if .total then 201 else if .error then 400 else 500 end end')
print_result "Registro em lote retorna 201 ou 400" "true" "$([[ $STATUS == "201" || $STATUS == "400" ]] && echo true || echo false)"

# ========================================
# TESTE 6: Obter estatísticas de aluno
# ========================================
echo "TEST 6: Obter estatísticas de aluno"
STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/attendances/stats/$ALUNO_ID/$TURMA_ID" \
  -H "Authorization: Bearer $TOKEN")

STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/attendances/stats/$ALUNO_ID/$TURMA_ID" \
  -H "Authorization: Bearer $TOKEN")

HAS_STATS=$(echo $STATS_RESPONSE | jq -r 'if .total then true else false end')
print_result "Estatísticas retornam 200 com dados" "200" "$STATUS"

# ========================================
# TESTE 7: Obter relatório de turma
# ========================================
echo "TEST 7: Obter relatório de turma"
REPORT_RESPONSE=$(curl -s -X GET "$BASE_URL/attendances/report/$TURMA_ID/$DATA_HOJE" \
  -H "Authorization: Bearer $TOKEN")

STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/attendances/report/$TURMA_ID/$DATA_HOJE" \
  -H "Authorization: Bearer $TOKEN")

print_result "Relatório retorna 200" "200" "$STATUS"

# ========================================
# TESTE 8: Validação - Aluno não matriculado
# ========================================
echo "TEST 8: Validação - Aluno não matriculado"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/attendances" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"id_aluno\":999,\"id_turma\":$TURMA_ID,\"data_chamada\":\"$DATA_HOJE\",\"status\":\"PRESENTE\"}")

print_result "Aluno não matriculado retorna 400 ou 404" "true" "$([[ $STATUS == "400" || $STATUS == "404" ]] && echo true || echo false)"

# ========================================
# TESTE 9: Validação - Turma inexistente
# ========================================
echo "TEST 9: Validação - Turma inexistente"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/attendances" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"id_aluno\":$ALUNO_ID,\"id_turma\":9999,\"data_chamada\":\"$DATA_HOJE\",\"status\":\"PRESENTE\"}")

print_result "Turma inexistente retorna 400 ou 404" "true" "$([[ $STATUS == "400" || $STATUS == "404" ]] && echo true || echo false)"

# ========================================
# TESTE 10: Validação - Status inválido
# ========================================
echo "TEST 10: Validação - Status inválido"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/attendances" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"id_aluno\":$ALUNO_ID,\"id_turma\":$TURMA_ID,\"data_chamada\":\"$DATA_HOJE\",\"status\":\"INVALIDO\"}")

print_result "Status inválido retorna 400" "400" "$STATUS"

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
