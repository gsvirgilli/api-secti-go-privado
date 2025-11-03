#!/bin/bash

echo "======================================"
echo "VERIFICAÇÃO RÁPIDA DO SISTEMA"
echo "======================================"
echo ""

echo "1. Containers Docker:"
docker ps --format "{{.Names}}: {{.Status}}"
echo ""

echo "2. Health Check da API:"
curl -s http://localhost:3333/api/health
echo ""
echo ""

echo "3. Teste rápido - Listar cursos públicos:"
curl -s http://localhost:3333/api/courses/public | jq 'length'
echo " cursos encontrados"
echo ""

echo "4. Teste rápido - Health endpoint:"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3333/api/health)
echo "Status code: $STATUS"
echo ""

if [ "$STATUS" == "200" ]; then
    echo "✅ API está funcionando!"
else
    echo "❌ API não está respondendo corretamente"
fi
