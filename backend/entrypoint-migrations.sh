#!/bin/bash
set -e

echo "📋 Iniciando aplicação com setup do banco de dados..."

# Verificar se estamos em produção (Render)
if [ ! -z "$RENDER" ]; then
  echo "🔄 Rodando em produção - executando migrações..."
  
  # Rodar migrações
  timeout 120 node run-migrations.js || {
    echo "⚠️  Aviso: Migrações falharam ou timeout (continuando mesmo assim)"
  }
fi

echo "🚀 Iniciando servidor..."
exec npm start
