#!/bin/bash

# Script de Testes Manuais da API - Candidatos e Alunos
# Testa todas as rotas criadas com chamadas reais ao backend

API_URL="http://localhost:3333/api"
TOKEN=""
CANDIDATE_ID=""
STUDENT_ID=""
TEST_CPF="12345678901"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Testes de Integração - Candidatos e Alunos${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Função para fazer requisições e mostrar resultado
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=$5
    
    echo -e "${YELLOW}Testando: ${name}${NC}"
    
    if [ -z "$data" ]; then
        if [ -z "$TOKEN" ]; then
            response=$(curl -s -w "\n%{http_code}" -X ${method} "${API_URL}${endpoint}")
        else
            response=$(curl -s -w "\n%{http_code}" -X ${method} "${API_URL}${endpoint}" \
                -H "Authorization: Bearer ${TOKEN}" \
                -H "Content-Type: application/json")
        fi
    else
        response=$(curl -s -w "\n%{http_code}" -X ${method} "${API_URL}${endpoint}" \
            -H "Authorization: Bearer ${TOKEN}" \
            -H "Content-Type: application/json" \
            -d "${data}")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ Status: ${status_code}${NC}"
        echo -e "${GREEN}Response: ${body}${NC}"
        echo "$body"
    else
        echo -e "${RED}✗ Status esperado: ${expected_status}, recebido: ${status_code}${NC}"
        echo -e "${RED}Response: ${body}${NC}"
        echo ""
    fi
    echo ""
}

# 1. HEALTH CHECK
echo -e "${BLUE}1. Health Check${NC}"
test_endpoint "Health Check" "GET" "/health" "" "200"

# 2. AUTENTICAÇÃO
echo -e "${BLUE}2. Autenticação${NC}"
echo "Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@sukatech.com","senha":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}Erro ao obter token. Tentando criar usuário admin...${NC}"
    
    REGISTER_RESPONSE=$(curl -s -X POST "${API_URL}/auth/register" \
        -H "Content-Type: application/json" \
        -d '{"nome":"Admin","email":"admin@sukatech.com","senha":"admin123","role":"ADMIN"}')
    
    echo "Registro: $REGISTER_RESPONSE"
    
    # Tentar login novamente
    LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@sukatech.com","senha":"admin123"}')
    
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
    echo -e "${RED}Não foi possível obter token de autenticação!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Token obtido: ${TOKEN:0:20}...${NC}"
echo ""

# 3. TESTES DE CANDIDATOS
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}3. Testes de Candidatos${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# 3.1. Criar Candidato
echo -e "${BLUE}3.1. Criar Candidato${NC}"

# Primeiro, vamos buscar uma turma disponível
TURMAS_RESPONSE=$(curl -s -X GET "${API_URL}/courses" \
    -H "Authorization: Bearer ${TOKEN}")
# Como não temos endpoint de turmas, vamos criar uma turma primeiro ou usar ID fixo
# Por enquanto vamos usar turma_id = 1 (assumindo que existe)

CREATE_CANDIDATE=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/candidates" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{
        "nome": "João da Silva Teste",
        "cpf": "11122233344",
        "email": "joao.teste@example.com",
        "telefone": "11999999999",
        "data_nascimento": "1990-01-15",
        "turma_id": 1
    }')

status=$(echo "$CREATE_CANDIDATE" | tail -n1)
body=$(echo "$CREATE_CANDIDATE" | sed '$d')

if [ "$status" = "201" ]; then
    echo -e "${GREEN}✓ Candidato criado com sucesso!${NC}"
    CANDIDATE_ID=$(echo $body | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    echo -e "Response: ${body}"
    echo -e "Candidate ID: ${CANDIDATE_ID}"
else
    echo -e "${YELLOW}⚠ Status: ${status} (pode já existir)${NC}"
    echo -e "Response: ${body}"
    # Tentar pegar ID de candidato existente
    LIST_RESPONSE=$(curl -s -X GET "${API_URL}/candidates" \
        -H "Authorization: Bearer ${TOKEN}")
    CANDIDATE_ID=$(echo $LIST_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
fi
echo ""

# 3.2. Listar Candidatos
test_endpoint "Listar Candidatos" "GET" "/candidates" "" "200"

# 3.3. Buscar Candidato por ID
if [ ! -z "$CANDIDATE_ID" ]; then
    test_endpoint "Buscar Candidato por ID" "GET" "/candidates/${CANDIDATE_ID}" "" "200"
fi

# 3.4. Listar com Filtros
test_endpoint "Listar Candidatos (filtro: status=PENDENTE)" "GET" "/candidates?status=PENDENTE" "" "200"

# 3.5. Estatísticas de Candidatos
test_endpoint "Estatísticas de Candidatos" "GET" "/candidates/statistics" "" "200"

# 3.6. Atualizar Candidato
if [ ! -z "$CANDIDATE_ID" ]; then
    echo -e "${BLUE}3.6. Atualizar Candidato${NC}"
    UPDATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "${API_URL}/candidates/${CANDIDATE_ID}" \
        -H "Authorization: Bearer ${TOKEN}" \
        -H "Content-Type: application/json" \
        -d '{"telefone": "11988888888"}')
    
    status=$(echo "$UPDATE_RESPONSE" | tail -n1)
    body=$(echo "$UPDATE_RESPONSE" | sed '$d')
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✓ Candidato atualizado!${NC}"
        echo -e "Response: ${body}"
    else
        echo -e "${YELLOW}⚠ Status: ${status}${NC}"
        echo -e "Response: ${body}"
    fi
    echo ""
fi

# 3.7. Aprovar Candidato (converte em aluno)
if [ ! -z "$CANDIDATE_ID" ]; then
    echo -e "${BLUE}3.7. Aprovar Candidato (Converte em Aluno)${NC}"
    APPROVE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/candidates/${CANDIDATE_ID}/approve" \
        -H "Authorization: Bearer ${TOKEN}")
    
    status=$(echo "$APPROVE_RESPONSE" | tail -n1)
    body=$(echo "$APPROVE_RESPONSE" | sed '$d')
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✓ Candidato aprovado e convertido em aluno!${NC}"
        echo -e "Response: ${body}"
        STUDENT_ID=$(echo $body | grep -o '"id":[0-9]*' | tail -1 | cut -d':' -f2)
        echo -e "Student ID criado: ${STUDENT_ID}"
    else
        echo -e "${YELLOW}⚠ Status: ${status} (pode já estar aprovado)${NC}"
        echo -e "Response: ${body}"
    fi
    echo ""
fi

# 4. TESTES DE ALUNOS
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}4. Testes de Alunos${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# 4.1. Listar Alunos
test_endpoint "Listar Alunos" "GET" "/students" "" "200"

# 4.2. Buscar Aluno por ID
if [ ! -z "$STUDENT_ID" ]; then
    test_endpoint "Buscar Aluno por ID" "GET" "/students/${STUDENT_ID}" "" "200"
fi

# 4.3. Buscar Aluno por CPF
test_endpoint "Buscar Aluno por CPF" "GET" "/students/cpf/11122233344" "" "200"

# 4.4. Buscar Aluno por Matrícula
echo -e "${BLUE}4.4. Buscar Aluno por Matrícula${NC}"
LIST_STUDENTS=$(curl -s -X GET "${API_URL}/students" \
    -H "Authorization: Bearer ${TOKEN}")
MATRICULA=$(echo $LIST_STUDENTS | grep -o '"matricula":"[^"]*' | head -1 | cut -d'"' -f4)

if [ ! -z "$MATRICULA" ]; then
    test_endpoint "Buscar Aluno por Matrícula" "GET" "/students/matricula/${MATRICULA}" "" "200"
else
    echo -e "${YELLOW}⚠ Nenhuma matrícula encontrada para testar${NC}"
    echo ""
fi

# 4.5. Estatísticas de Alunos
test_endpoint "Estatísticas de Alunos" "GET" "/students/statistics" "" "200"

# 4.6. Atualizar Aluno
if [ ! -z "$STUDENT_ID" ]; then
    echo -e "${BLUE}4.6. Atualizar Aluno${NC}"
    UPDATE_STUDENT=$(curl -s -w "\n%{http_code}" -X PUT "${API_URL}/students/${STUDENT_ID}" \
        -H "Authorization: Bearer ${TOKEN}" \
        -H "Content-Type: application/json" \
        -d '{"telefone": "11977777777"}')
    
    status=$(echo "$UPDATE_STUDENT" | tail -n1)
    body=$(echo "$UPDATE_STUDENT" | sed '$d')
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✓ Aluno atualizado!${NC}"
        echo -e "Response: ${body}"
    else
        echo -e "${YELLOW}⚠ Status: ${status}${NC}"
        echo -e "Response: ${body}"
    fi
    echo ""
fi

# 5. TESTE DE REJEIÇÃO
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}5. Teste de Rejeição de Candidato${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Criar outro candidato para testar rejeição
echo -e "${BLUE}5.1. Criar Candidato para Rejeição${NC}"
CREATE_REJECT=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/candidates" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{
        "nome": "Maria Santos Teste",
        "cpf": "99988877766",
        "email": "maria.teste@example.com",
        "telefone": "11888888888"
    }')

status=$(echo "$CREATE_REJECT" | tail -n1)
body=$(echo "$CREATE_REJECT" | sed '$d')

if [ "$status" = "201" ]; then
    echo -e "${GREEN}✓ Candidato criado!${NC}"
    REJECT_CANDIDATE_ID=$(echo $body | grep -o '"id":[0-9]*' | cut -d':' -f2)
    echo -e "Candidate ID: ${REJECT_CANDIDATE_ID}"
    echo ""
    
    # Rejeitar candidato
    echo -e "${BLUE}5.2. Rejeitar Candidato${NC}"
    REJECT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/candidates/${REJECT_CANDIDATE_ID}/reject" \
        -H "Authorization: Bearer ${TOKEN}" \
        -H "Content-Type: application/json" \
        -d '{"motivo": "Documentação incompleta - falta comprovante de residência"}')
    
    status=$(echo "$REJECT_RESPONSE" | tail -n1)
    body=$(echo "$REJECT_RESPONSE" | sed '$d')
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✓ Candidato rejeitado!${NC}"
        echo -e "Response: ${body}"
    else
        echo -e "${RED}✗ Status: ${status}${NC}"
        echo -e "Response: ${body}"
    fi
else
    echo -e "${YELLOW}⚠ Não foi possível criar candidato para teste de rejeição${NC}"
    echo -e "Response: ${body}"
fi
echo ""

# RESUMO FINAL
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Resumo dos Testes${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}Endpoints testados:${NC}"
echo -e "  ✓ Health Check"
echo -e "  ✓ Autenticação"
echo -e "  ✓ Candidatos: Criar, Listar, Buscar, Atualizar, Aprovar, Rejeitar, Estatísticas"
echo -e "  ✓ Alunos: Listar, Buscar (ID/CPF/Matrícula), Atualizar, Estatísticas"
echo ""
echo -e "${GREEN}Token usado: ${TOKEN:0:30}...${NC}"
echo -e "${GREEN}Candidate ID: ${CANDIDATE_ID}${NC}"
echo -e "${GREEN}Student ID: ${STUDENT_ID}${NC}"
echo ""
echo -e "${BLUE}Testes concluídos!${NC}"
