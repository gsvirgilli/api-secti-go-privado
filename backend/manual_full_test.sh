#!/bin/bash

API_URL="http://localhost:3333/api"
EMAIL="teste@sukatech.com"
PASSWORD="123456"
NOME="Usuário Teste"


# 1. Criar usuário via /auth/register
echo "Criando usuário..."
CREATE_USER=$(curl -s -X POST "$API_URL/auth/register" -H "Content-Type: application/json" -d "{\"nome\":\"$NOME\",\"email\":\"$EMAIL\",\"senha\":\"$PASSWORD\"}")
echo "Resposta criação de usuário: $CREATE_USER"

# 2. Login para obter token
echo "\nRealizando login..."
LOGIN=$(curl -s -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"'$EMAIL'","senha":"'$PASSWORD'"}')
TOKEN=$(echo $LOGIN | grep -oP '"token"\s*:\s*"\K[^"]+')
echo "Token obtido: $TOKEN"

if [ -z "$TOKEN" ]; then
  echo "\nNão foi possível obter o token. Verifique se o backend está rodando e se o usuário foi criado corretamente."
  exit 1
fi

# 3. Testar endpoints principais
HEADER="Authorization: Bearer $TOKEN"

echo "\nTestando endpoints principais..."
curl -s -H "$HEADER" "$API_URL/classes" -o /dev/null -w "GET /classes: %{http_code}\n"
curl -s -H "$HEADER" "$API_URL/students" -o /dev/null -w "GET /students: %{http_code}\n"
curl -s -H "$HEADER" "$API_URL/candidates" -o /dev/null -w "GET /candidates: %{http_code}\n"
curl -s -H "$HEADER" "$API_URL/courses" -o /dev/null -w "GET /courses: %{http_code}\n"
curl -s -H "$HEADER" "$API_URL/users" -o /dev/null -w "GET /users: %{http_code}\n"

echo "\nTestes manuais finalizados. Verifique os códigos de resposta acima."
