#!/bin/bash

# Script para setup completo do Docker em um computador novo
# Uso: ./setup-docker.sh

set -e

echo "🚀 INICIANDO SETUP DO SISTEMA..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Build e start dos containers
echo -e "${BLUE}1️⃣ Iniciando Docker containers...${NC}"
docker compose up --build -d

# 2. Aguardar MySQL estar pronto
echo -e "${BLUE}2️⃣ Aguardando MySQL inicializar (20 segundos)...${NC}"
sleep 20

# 3. Criar tabelas
echo -e "${BLUE}3️⃣ Criando tabelas do banco de dados...${NC}"
docker cp backend/create-all-tables.sql app_mysql:/tmp/ 2>/dev/null || true
docker exec app_mysql sh -c "mysql -u devuser -pdevpass defaultdb < /tmp/create-all-tables.sql" 2>&1 | grep -v "Warning" || true

# 4. Inserir dados iniciais
echo -e "${BLUE}4️⃣ Inserindo dados de exemplo...${NC}"
docker cp backend/insert-dados.sql app_mysql:/tmp/ 2>/dev/null || true
docker exec app_mysql sh -c "mysql -u devuser -pdevpass defaultdb < /tmp/insert-dados.sql" 2>&1 | grep -v "Warning" || true

# 5. Criar usuário de teste
echo -e "${BLUE}5️⃣ Criando usuário de teste...${NC}"
docker exec app_mysql mysql -u devuser -pdevpass defaultdb -e \
  "INSERT INTO usuarios (nome, email, senha_hash, role, ativo) VALUES ('Usuário Teste', 'teste@example.com', '\$2b\$10\$RNoM5x2pA6wVhoFi2ox4Te7etuB1KAKR3cikdgGzFhyyGGt87Y0US', 'ADMIN', 1);" 2>&1 | grep -v "Warning" || echo "Usuário de teste já existe"

# 6. Reiniciar backend
echo -e "${BLUE}6️⃣ Reiniciando backend...${NC}"
docker compose restart back
sleep 3

# 7. Verificação final
echo -e "${BLUE}7️⃣ Verificando status...${NC}"
docker compose ps

# Sucesso
echo -e "\n${GREEN}✅ SETUP CONCLUÍDO COM SUCESSO!${NC}\n"
echo -e "${YELLOW}📋 Credenciais de Teste:${NC}"
echo "   Email: teste@example.com"
echo "   Senha: Teste123!"
echo ""
echo -e "${YELLOW}🌐 Acessar:${NC}"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   API Docs: http://localhost:5000/api-docs"
echo ""
echo -e "${YELLOW}💡 Comandos úteis:${NC}"
echo "   docker compose logs -f back     (ver logs do backend)"
echo "   docker compose logs -f front    (ver logs do frontend)"
echo "   docker compose restart          (reiniciar tudo)"
echo "   docker compose down              (parar tudo)"
echo "   docker compose down -v           (parar e limpar volumes - CUIDADO: perde dados!)"
