#!/bin/bash
# Script simples para testar login

BASE_URL="http://localhost:3333/api"

echo "Tentando registrar admin..."
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Admin Teste","email":"admin@test.com","senha":"admin123","role":"ADMIN"}'

echo ""
echo ""
echo "Tentando fazer login..."
curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","senha":"admin123"}'

echo ""
