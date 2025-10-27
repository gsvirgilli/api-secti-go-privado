#!/bin/bash

echo "=========================================="
echo "TESTE RÁPIDO DE ENDPOINTS"
echo "=========================================="
echo ""

echo "1. TESTANDO HEALTH CHECK..."
curl -s http://localhost:3333/api/health
echo ""
echo ""

echo "2. TESTANDO LOGIN..."
TOKEN=$(curl -s -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token obtido: $TOKEN"
echo ""
echo ""

if [ -z "$TOKEN" ]; then
  echo "Erro: Não conseguiu obter token"
  exit 1
fi

echo "3. TESTANDO GET /api/users/me..."
curl -s -X GET http://localhost:3333/api/users/me \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

echo "4. TESTANDO GET /api/courses..."
curl -s http://localhost:3333/api/courses
echo ""
echo ""

echo "5. TESTANDO GET /api/classes..."
curl -s http://localhost:3333/api/classes
echo ""
echo ""

echo "6. TESTANDO GET /api/students..."
curl -s http://localhost:3333/api/students
echo ""
echo ""

echo "7. TESTANDO GET /api/candidates..."
curl -s http://localhost:3333/api/candidates
echo ""
echo ""

echo "=========================================="
echo "TESTE CONCLUÍDO"
echo "=========================================="
