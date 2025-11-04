#!/bin/bash

echo "=== Testando API de Instrutores ==="

# Fazer login (tente diferentes credenciais)
echo -e "\n1. Tentando login..."
LOGIN_RESPONSE=$(curl -s http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","senha":"admin123"}')

echo "Resposta do login: $LOGIN_RESPONSE"

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token // .data.token // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "❌ Falha no login. Tentando criar admin..."
  
  # Criar admin se não existir
  docker exec app_backend node -e "
    const bcrypt = require('bcrypt');
    const { Sequelize, DataTypes } = require('sequelize');
    
    const sequelize = new Sequelize('sukatech', 'root', 'rootpassword', {
      host: 'sukatech_mysql',
      dialect: 'mysql',
      logging: false
    });
    
    const Usuario = sequelize.define('usuarios', {
      nome: DataTypes.STRING,
      email: DataTypes.STRING,
      senha: DataTypes.STRING,
      tipo: DataTypes.STRING
    }, { timestamps: false });
    
    async function createAdmin() {
      try {
        await sequelize.authenticate();
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await Usuario.create({
          nome: 'Admin',
          email: 'admin@example.com',
          senha: hashedPassword,
          tipo: 'ADMIN'
        });
        console.log('✅ Admin criado com sucesso');
      } catch (error) {
        console.log('Erro ao criar admin:', error.message);
      }
      process.exit();
    }
    
    createAdmin();
  "
  
  # Tentar login novamente
  LOGIN_RESPONSE=$(curl -s http://localhost:3333/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","senha":"admin123"}')
  
  TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token // .data.token // empty')
fi

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "❌ Não foi possível obter token"
  exit 1
fi

echo "✅ Token obtido: ${TOKEN:0:20}..."

# Listar instrutores
echo -e "\n2. Listando instrutores..."
INSTRUCTORS=$(curl -s http://localhost:3333/api/instructors \
  -H "Authorization: Bearer $TOKEN")

echo "Resposta: $INSTRUCTORS"

COUNT=$(echo $INSTRUCTORS | jq -r '.data | length // 0')
echo "Total de instrutores: $COUNT"

if [ "$COUNT" -eq "0" ]; then
  echo -e "\n3. Criando instrutores de exemplo..."
  
  # Criar 3 instrutores
  for i in 1 2 3; do
    RESULT=$(curl -s http://localhost:3333/api/instructors \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"nome\": \"Instrutor $i\",
        \"email\": \"instrutor$i@example.com\",
        \"cpf\": \"$(printf '%011d' $i)\",
        \"especialidade\": \"Tecnologia\"
      }")
    
    echo "Instrutor $i criado: $(echo $RESULT | jq -r '.id // "erro"')"
  done
  
  echo -e "\n4. Listando instrutores novamente..."
  INSTRUCTORS=$(curl -s http://localhost:3333/api/instructors \
    -H "Authorization: Bearer $TOKEN")
  echo $INSTRUCTORS | jq '.'
fi

echo -e "\n✅ Teste concluído!"
