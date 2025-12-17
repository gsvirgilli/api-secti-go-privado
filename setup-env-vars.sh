#!/bin/bash

# Script para configurar variáveis de ambiente no DigitalOcean App Platform
# Execute este script para gerar um arquivo com todas as variáveis necessárias

echo "🔐 Gerador de Variáveis de Ambiente - DigitalOcean"
echo ""
echo "Este script ajudará você a configurar as variáveis de ambiente"
echo ""

# Função para gerar JWT Secret
generate_jwt_secret() {
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
}

# Coletar informações do usuário
read -p "📊 Digite o HOST do banco de dados (ex: db-mysql-xxxxx.h.db.ondigitalocean.com): " DB_HOST
read -p "👤 Digite o USUÁRIO do banco de dados (ex: doadmin): " DB_USER
read -sp "🔑 Digite a SENHA do banco de dados: " DB_PASSWORD
echo ""
read -p "💾 Digite o NOME do banco de dados (ex: defaultdb): " DB_NAME
read -p "🌐 Digite a URL de domínio do frontend (ex: https://seu-dominio.com): " FRONTEND_URL

# Gerar JWT Secret
echo ""
echo "🔐 Gerando JWT Secret..."
JWT_SECRET=$(generate_jwt_secret)

# Criar arquivo de configuração
cat > digitalocean-env-vars.txt << EOF
# Variáveis de Ambiente para DigitalOcean App Platform
# Copie essas variáveis para cada serviço no painel do DigitalOcean

## BACKEND

NODE_ENV=production
DATABASE_HOST=$DB_HOST
DATABASE_PORT=25060
DATABASE_USER=$DB_USER
DATABASE_PASSWORD=$DB_PASSWORD
DATABASE_NAME=$DB_NAME
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d
APP_PORT=3000

## FRONTEND

VITE_API_URL=$FRONTEND_URL/api

EOF

echo ""
echo "✅ Arquivo 'digitalocean-env-vars.txt' criado!"
echo ""
echo "📋 Variáveis Geradas:"
echo "================================"
cat digitalocean-env-vars.txt
echo "================================"
echo ""
echo "⚠️  IMPORTANTE:"
echo "1. Copie as variáveis acima"
echo "2. No DigitalOcean App Platform, vá em cada serviço"
echo "3. Clique em 'Settings' → 'Environment Variables'"
echo "4. Adicione cada variável"
echo "5. Faça deploy"
echo ""
echo "🔐 Segurança:"
echo "- NUNCA compartilhe o JWT_SECRET"
echo "- NUNCA comita o arquivo de variáveis no Git"
echo "- Use este arquivo apenas localmente como referência"
echo ""
