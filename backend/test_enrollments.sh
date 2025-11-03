#!/bin/bash

echo "==================================="
echo "TESTE DO SISTEMA DE MATRÍCULAS"
echo "==================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3333/api"

# 1. Verificar health
echo -e "${BLUE}1. Testando Health Check...${NC}"
curl -s "$BASE_URL/health" | jq
echo ""

# 2. Login para obter token
echo -e "${BLUE}2. Fazendo login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sukatech.com",
    "senha": "admin123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo "Token obtido: ${TOKEN:0:20}..."
echo ""

# 3. Listar alunos disponíveis
echo -e "${BLUE}3. Listando alunos...${NC}"
curl -s -X GET "$BASE_URL/students" \
  -H "Authorization: Bearer $TOKEN" | jq '.data | .[:3]'
echo ""

# 4. Listar turmas disponíveis
echo -e "${BLUE}4. Listando turmas...${NC}"
curl -s -X GET "$BASE_URL/classes" \
  -H "Authorization: Bearer $TOKEN" | jq '.data | .[:3]'
echo ""

# 5. Criar matrícula
echo -e "${BLUE}5. Criando matrícula (Aluno 1 na Turma 5)...${NC}"
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/enrollments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_aluno": 1,
    "id_turma": 5
  }')
echo $CREATE_RESPONSE | jq
echo ""

# 6. Listar matrículas
echo -e "${BLUE}6. Listando todas as matrículas...${NC}"
curl -s -X GET "$BASE_URL/enrollments" \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

# 7. Buscar matrícula específica
echo -e "${BLUE}7. Buscando matrícula do aluno 1...${NC}"
curl -s -X GET "$BASE_URL/enrollments/student/1" \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

# 8. Listar matrículas de uma turma
echo -e "${BLUE}8. Listando matrículas da turma 5...${NC}"
curl -s -X GET "$BASE_URL/enrollments/class/5" \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

# 9. Atualizar status da matrícula
echo -e "${BLUE}9. Atualizando status da matrícula para 'trancado'...${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/enrollments/1/5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "trancado",
    "data_fim": "2025-12-31"
  }')
echo $UPDATE_RESPONSE | jq
echo ""

# 10. Reativar matrícula
echo -e "${BLUE}10. Reativando matrícula...${NC}"
REACTIVATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/enrollments/1/5/reactivate" \
  -H "Authorization: Bearer $TOKEN")
echo $REACTIVATE_RESPONSE | jq
echo ""

# 11. Transferir aluno para outra turma
echo -e "${BLUE}11. Transferindo aluno 1 da turma 5 para turma 6...${NC}"
TRANSFER_RESPONSE=$(curl -s -X POST "$BASE_URL/enrollments/1/transfer" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nova_turma_id": 6,
    "motivo": "Transferência por mudança de horário"
  }')
echo $TRANSFER_RESPONSE | jq
echo ""

# 12. Cancelar matrícula
echo -e "${BLUE}12. Cancelando matrícula do aluno 1 na turma 6...${NC}"
CANCEL_RESPONSE=$(curl -s -X PUT "$BASE_URL/enrollments/1/6/cancel" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "motivo": "Teste de cancelamento"
  }')
echo $CANCEL_RESPONSE | jq
echo ""

echo -e "${GREEN}==================================="
echo "TESTES CONCLUÍDOS!"
echo -e "===================================${NC}"
