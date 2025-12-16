#!/bin/bash

# Script alternativo: Rodar Backend e Frontend em paralelo no mesmo terminal
# Ambos ficam rodando continuamente

cd /home/guidev/projetos/api-secti-go-privado

echo "🚀 SUKATECH - Iniciando Desenvolvimento"
echo "======================================"
echo ""
echo "📡 Backend:  http://localhost:3000"
echo "🌐 Frontend: http://localhost:8080"
echo ""

# Iniciar Backend
(
  echo "[Backend] Iniciando..."
  cd backend
  npm run dev
) &
BACKEND_PID=$!

# Aguardar 2 segundos
sleep 2

# Iniciar Frontend
(
  echo "[Frontend] Iniciando..."
  cd frontend
  npm run dev
) &
FRONTEND_PID=$!

echo ""
echo "✅ Ambos os servidores estão rodando!"
echo "Pressione Ctrl+C para parar."
echo ""

# Aguardar sinais de parada
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

wait
