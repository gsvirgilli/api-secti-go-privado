#!/bin/bash

# Script para rodar migrações antes de iniciar a aplicação

echo "🔄 Executando migrações do banco de dados..."

# Rodar migrações com timeout de 60 segundos
timeout 60 node /opt/render/project/src/backend/run-migrations.js

if [ $? -eq 0 ]; then
  echo "✅ Migrações completadas com sucesso!"
else
  echo "⚠️  Aviso: Migrações tiveram erro ou timeout (continuando)"
fi

echo "🚀 Iniciando aplicação..."
exec npm start
