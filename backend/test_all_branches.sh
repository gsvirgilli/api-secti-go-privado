#!/bin/bash

# Script mestre para executar todos os testes das branches implementadas
# Ordem: Branch 1 (Candidatura) → Branch 2 (Cursos Públicos) → Branch 3 (Gerenciamento Vagas)

BASE_URL="http://localhost:3333/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "========================================="
echo "🧪 TESTES COMPLETOS - TODAS AS BRANCHES"
echo "========================================="
echo ""

# Verificar se a API está respondendo
echo "${BLUE}[CHECK]${NC} Verificando se a API está online..."
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")

if [ "$HEALTH" != "200" ]; then
    echo "${RED}❌ API não está respondendo. Verifique se o Docker está rodando.${NC}"
    echo "Execute: docker compose up -d"
    exit 1
fi

echo "${GREEN}✅ API está online!${NC}"
echo ""

# Contador de testes
TOTAL_PASSED=0
TOTAL_FAILED=0

# ===========================================
# BRANCH 1: Candidatura Pública
# ===========================================
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}📋 BRANCH 1: Candidatura Pública${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -f "test_candidatura_publica.sh" ]; then
    bash test_candidatura_publica.sh
    if [ $? -eq 0 ]; then
        echo "${GREEN}✅ Branch 1: Todos os testes passaram${NC}"
        ((TOTAL_PASSED++))
    else
        echo "${RED}❌ Branch 1: Alguns testes falharam${NC}"
        ((TOTAL_FAILED++))
    fi
else
    echo "${YELLOW}⚠ Script de teste da Branch 1 não encontrado${NC}"
fi

echo ""
echo ""

# ===========================================
# BRANCH 2: Cursos Públicos
# ===========================================
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}📚 BRANCH 2: Cursos Públicos${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -f "test_cursos_publicos.sh" ]; then
    bash test_cursos_publicos.sh
    if [ $? -eq 0 ]; then
        echo "${GREEN}✅ Branch 2: Todos os testes passaram${NC}"
        ((TOTAL_PASSED++))
    else
        echo "${RED}❌ Branch 2: Alguns testes falharam${NC}"
        ((TOTAL_FAILED++))
    fi
else
    echo "${YELLOW}⚠ Script de teste da Branch 2 não encontrado${NC}"
fi

echo ""
echo ""

# ===========================================
# BRANCH 3: Gerenciamento de Vagas
# ===========================================
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${BLUE}🎫 BRANCH 3: Gerenciamento Automático de Vagas${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "${YELLOW}[INFO]${NC} Branch 3 está em feature/gerenciamento-vagas"
echo "${YELLOW}[INFO]${NC} Testes para esta branch serão implementados após merge${NC}"
echo ""

# ===========================================
# RESUMO FINAL
# ===========================================
echo ""
echo "========================================="
echo "📊 RESUMO FINAL - TODAS AS BRANCHES"
echo "========================================="
echo -e "${GREEN}✅ Branches com testes passando: $TOTAL_PASSED${NC}"
echo -e "${RED}❌ Branches com testes falhando: $TOTAL_FAILED${NC}"
echo "Total de branches testadas: $((TOTAL_PASSED + TOTAL_FAILED))"
echo ""

if [ $TOTAL_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCESSO! Todos os testes das branches mergeadas passaram!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Algumas branches têm testes falhando. Verifique os logs acima.${NC}"
    exit 1
fi
