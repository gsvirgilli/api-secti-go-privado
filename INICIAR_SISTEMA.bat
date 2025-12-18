@echo off
chcp 65001 > nul
color 0A
title 🚀 Sistema SECTI - Inicializador

cls
echo.
echo ============================================================
echo        INICIALIZADOR DO SISTEMA SECTI
echo ============================================================
echo.

echo [1/4] Verificando Docker...
docker --version > nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ❌ ERRO: Docker não está instalado ou não está no PATH
    echo.
    echo Solução:
    echo 1. Instale o Docker Desktop de: https://www.docker.com/products/docker-desktop
    echo 2. Após instalar, reinicie este script
    echo.
    pause
    exit /b 1
)
echo ✅ Docker encontrado

echo.
echo [2/4] Iniciando containers (MySQL, Backend, Frontend)...
docker compose up -d

if %errorlevel% neq 0 (
    color 0C
    echo ❌ ERRO ao iniciar containers
    echo.
    echo Dicas de solução:
    echo 1. Verifique se o Docker Desktop está aberto
    echo 2. Tente: docker compose down -v
    echo 3. Depois: docker compose up -d
    echo.
    pause
    exit /b 1
)

echo ✅ Containers iniciados com sucesso

echo.
echo [3/4] Aguardando serviços ficarem prontos (15 segundos)...
echo Isso é normal demora um pouco na primeira execução...
for /L %%A in (15,-1,1) do (
    cls
    echo.
    echo ============================================================
    echo        SISTEMA SECTI - INICIALIZADOR
    echo ============================================================
    echo.
    echo [3/4] Aguardando serviços ficarem prontos (%%A segundos)...
    echo.
    echo 🔄 Iniciando:
    echo    - MySQL 8.0
    echo    - Backend Node.js (porta 5000)
    echo    - Frontend React (porta 3000)
    echo.
    timeout /t 1 /nobreak > nul
)

echo.
echo [4/4] Abrindo sistema no navegador...
timeout /t 2 /nobreak > nul
start http://localhost:3000

cls
echo.
echo ============================================================
echo        ✅ SISTEMA RODANDO COM SUCESSO!
echo ============================================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔌 Backend:  http://localhost:5000
echo 📚 API Docs: http://localhost:5000/api-docs
echo.
echo 🔐 Credenciais de Teste:
echo    Email: teste@example.com
echo    Senha: Teste123!
echo.
echo 💡 NÃO FECHE ESTA JANELA - apenas minimize
echo    Para parar o sistema, execute: PARAR_SISTEMA.bat
echo.
echo 📝 Ver logs do backend:
echo    docker compose logs -f back
echo.
echo ============================================================
echo.
pause
