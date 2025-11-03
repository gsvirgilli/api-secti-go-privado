#!/bin/bash

# Script de testes para endpoints públicos de cursos
# Testa GET /api/courses/public e GET /api/courses/:id/public

BASE_URL="http://localhost:3333/api"

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contador de testes
PASSED=0
FAILED=0

echo "======================================"
echo "🧪 TESTANDO ENDPOINTS PÚBLICOS DE CURSOS"
echo "======================================"
echo ""

# Função para fazer requisição e verificar status
test_endpoint() {
  local test_name="$1"
  local method="$2"
  local endpoint="$3"
  local expected_status="$4"
  local data="$5"

  echo -e "${BLUE}Teste: ${test_name}${NC}"
  echo "Endpoint: ${method} ${endpoint}"

  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" -X GET "${BASE_URL}${endpoint}")
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)

  echo "Status: ${http_code}"
  echo "$body" | jq '.' 2>/dev/null || echo "$body"

  if [ "$http_code" = "$expected_status" ]; then
    echo -e "${GREEN}✅ PASSOU${NC}"
    ((PASSED++))
  else
    echo -e "${RED}❌ FALHOU (esperado: ${expected_status}, recebido: ${http_code})${NC}"
    ((FAILED++))
  fi

  echo ""
  echo "--------------------------------------"
  echo ""
}

echo "======================================"
echo "🎯 TESTES DE ENDPOINTS PÚBLICOS"
echo "======================================"
echo ""

# Teste 1: Listar todos os cursos (público)
test_endpoint \
  "Listar todos os cursos (público)" \
  "GET" \
  "/courses/public" \
  "200"

# Teste 2: Buscar curso específico por ID (público)
test_endpoint \
  "Buscar curso por ID (público)" \
  "GET" \
  "/courses/1/public" \
  "200"

# Teste 3: Buscar curso inexistente (deve falhar)
test_endpoint \
  "Buscar curso inexistente (deve falhar)" \
  "GET" \
  "/courses/99999/public" \
  "404"

# Teste 4: ID inválido (não numérico)
test_endpoint \
  "ID inválido não numérico (deve falhar)" \
  "GET" \
  "/courses/abc/public" \
  "400"

echo "======================================"
echo "📊 RESUMO DOS TESTES"
echo "======================================"
echo -e "${GREEN}✅ Testes passados: ${PASSED}${NC}"
echo -e "${RED}❌ Testes falhados: ${FAILED}${NC}"
echo "Total: $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 Todos os testes passaram!${NC}"
  exit 0
else
  echo -e "${RED}⚠️  Alguns testes falharam${NC}"
  exit 1
fi
