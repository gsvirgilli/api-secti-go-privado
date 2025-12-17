#!/bin/bash

# Script para iniciar o backend com debug

cd /home/guidev/projetos/api-secti-go-privado/backend

echo "🚀 Iniciando Backend SECTI..."
echo "================================"

# Limpar portas se necessário
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "📍 Diretório: $(pwd)"
echo "📝 Node version: $(node --version)"
echo "📦 npm version: $(npm --version)"
echo ""

echo "⏳ Instalando dependências se necessário..."
npm install --legacy-peer-deps --no-save > /dev/null 2>&1

echo "🔨 Compilando TypeScript..."
npm run build > /dev/null 2>&1

echo ""
echo "🎯 Iniciando servidor..."
echo "================================"
echo ""

npm run dev
