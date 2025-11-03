#!/bin/bash

echo "🔍 Diagnóstico do Container app_backend"
echo "========================================"
echo ""

echo "1️⃣ Status do Container:"
docker ps -a --filter name=app_backend --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "2️⃣ Health Check Status:"
docker inspect app_backend | jq '.[0].State.Health.Status'
echo ""

echo "3️⃣ Últimos 50 logs:"
echo "--------------------"
docker logs app_backend --tail 50
echo ""

echo "4️⃣ Verificando se a porta 3333 está ouvindo:"
docker exec app_backend netstat -tulpn 2>/dev/null | grep 3333 || echo "❌ Porta 3333 não está ouvindo"
echo ""

echo "5️⃣ Verificando processo node:"
docker exec app_backend ps aux | grep node || echo "❌ Nenhum processo node encontrado"
