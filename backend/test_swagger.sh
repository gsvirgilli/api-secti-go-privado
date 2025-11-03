#!/bin/bash

echo "🧪 Testando Swagger..."
echo ""

# Aguardar container
echo "⏳ Aguardando container iniciar..."
sleep 5

# Testar Health
echo "1️⃣ Testando Health..."
HEALTH=$(curl -s http://localhost:3333/api/health)
echo "   $HEALTH"
echo ""

# Testar Swagger JSON
echo "2️⃣ Testando Swagger JSON..."
SWAGGER=$(curl -s http://localhost:3333/api-docs.json | jq -r '.info.title' 2>/dev/null)
if [ "$SWAGGER" = "SUKATECH API - Sistema de Gestão de Cursos" ]; then
  echo "   ✅ Swagger JSON disponível!"
else
  echo "   ❌ Swagger JSON não disponível"
  echo "   Resposta: $SWAGGER"
fi
echo ""

# Testar Swagger UI
echo "3️⃣ Testando Swagger UI..."
UI_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3333/api-docs/)
if [ "$UI_STATUS" = "200" ]; then
  echo "   ✅ Swagger UI disponível em: http://localhost:3333/api-docs/"
else
  echo "   ❌ Swagger UI retornou: $UI_STATUS"
fi
echo ""

echo "📄 URLs Disponíveis:"
echo "   - Documentação Swagger: http://localhost:3333/api-docs/"
echo "   - JSON da API: http://localhost:3333/api-docs.json"
echo "   - Health Check: http://localhost:3333/api/health"
