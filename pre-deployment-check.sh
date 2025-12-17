#!/bin/bash

# Script de Verificação Pré-Deployment
# Execute este script antes de fazer deploy no DigitalOcean

set -e

echo "🔍 Verificando ambiente para deployment..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
ERRORS=0
WARNINGS=0

# Função para verificar comando
check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 instalado"
        return 0
    else
        echo -e "${RED}✗${NC} $1 NÃO encontrado"
        ((ERRORS++))
        return 1
    fi
}

# Função para verificar arquivo
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 existe"
        return 0
    else
        echo -e "${RED}✗${NC} $1 NÃO encontrado"
        ((ERRORS++))
        return 1
    fi
}

# Função para verificar variável de ambiente
check_env() {
    if [ -z "${!1}" ]; then
        echo -e "${YELLOW}⚠${NC} $1 não definida (será necessária no deploy)"
        ((WARNINGS++))
        return 1
    else
        echo -e "${GREEN}✓${NC} $1 definida"
        return 0
    fi
}

echo "📋 Verificando ferramentas..."
check_command "node"
check_command "npm"
check_command "git"
echo ""

echo "📁 Verificando estrutura de arquivos..."
check_file "backend/package.json"
check_file "backend/src/server.ts"
check_file "frontend/package.json"
check_file "frontend/src/main.tsx"
check_file "app.yaml"
check_file "backend/Dockerfile"
check_file "Dockerfile.frontend"
check_file "DEPLOYMENT.md"
echo ""

echo "🔨 Compilando Backend..."
cd backend
if npm run build 2>&1 | grep -q "error"; then
    echo -e "${RED}✗${NC} Backend compilation falhou"
    ((ERRORS++))
else
    echo -e "${GREEN}✓${NC} Backend compiled com sucesso"
fi
cd ..
echo ""

echo "🔨 Compilando Frontend..."
cd frontend
if npm run build 2>&1 | grep -q "error"; then
    echo -e "${RED}✗${NC} Frontend compilation falhou"
    ((ERRORS++))
else
    echo -e "${GREEN}✓${NC} Frontend compiled com sucesso"
fi
cd ..
echo ""

echo "🌍 Verificando Git..."
if git status &> /dev/null; then
    echo -e "${GREEN}✓${NC} Repositório Git válido"
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${GREEN}✓${NC} Working directory limpo"
    else
        echo -e "${YELLOW}⚠${NC} Há mudanças não commitadas"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}✗${NC} Não é um repositório Git válido"
    ((ERRORS++))
fi
echo ""

echo "📝 Verificando variáveis de ambiente necessárias..."
check_env "DATABASE_HOST"
check_env "DATABASE_USER"
check_env "DATABASE_PASSWORD"
check_env "DATABASE_NAME"
check_env "JWT_SECRET"
echo ""

echo "📊 Resumo da Verificação:"
echo -e "${GREEN}✓ Sucessos${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Sem erros${NC}"
else
    echo -e "${RED}✗ $ERRORS erro(s) encontrado(s)${NC}"
fi

if [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ Sem avisos${NC}"
else
    echo -e "${YELLOW}⚠ $WARNINGS aviso(s)${NC}"
fi
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Aplicação pronta para deploy!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "1. Configure as variáveis de ambiente no DigitalOcean:"
    echo "   - DATABASE_HOST"
    echo "   - DATABASE_USER"
    echo "   - DATABASE_PASSWORD"
    echo "   - JWT_SECRET"
    echo "2. Faça git push para a branch main"
    echo "3. DigitalOcean detectará automaticamente o app.yaml"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Corrija os erros acima antes de fazer deploy${NC}"
    exit 1
fi
