#!/bin/bash

# Script para iniciar Backend e Frontend em terminais separados
# Com auto-restart em caso de falha

set -e

BACKEND_DIR="/home/guidev/projetos/api-secti-go-privado/backend"
FRONTEND_DIR="/home/guidev/projetos/api-secti-go-privado/frontend"

echo "🚀 Iniciando Backend e Frontend..."
echo ""

# Iniciar Backend em novo terminal
echo "📦 Iniciando Backend na porta 3000..."
gnome-terminal --title="Backend - SUKATECH" -- bash -c "cd $BACKEND_DIR && npm run dev; exec bash" &
BACKEND_PID=$!

sleep 2

# Iniciar Frontend em novo terminal  
echo "⚛️  Iniciando Frontend na porta 8080..."
gnome-terminal --title="Frontend - SUKATECH" -- bash -c "cd $FRONTEND_DIR && npm run dev; exec bash" &
FRONTEND_PID=$!

echo ""
echo "✅ Servidores iniciados!"
echo ""
echo "📡 Backend:  http://localhost:3000"
echo "🌐 Frontend: http://localhost:8080"
echo ""
echo "Feche os terminais para parar os servidores."
echo ""

# Aguardar ambos os processos
wait $BACKEND_PID $FRONTEND_PID
