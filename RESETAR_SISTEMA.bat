@echo off
chcp 65001 > nul
color 0C
title 🔴 Sistema SECTI - RESETAR (CUIDADO!)

cls
echo.
echo ============================================================
echo        ⚠️  RESETAR BANCO DE DADOS (DELETA TUDO!)
echo ============================================================
echo.

echo CUIDADO: Esta ação vai:
echo  ❌ Deletar TODOS os dados do banco de dados
echo  ❌ Deletar TODOS os usuários, cursos, turmas, etc.
echo  ❌ Não há volta - você terá que reinserir tudo!
echo.

set /p confirm="Você tem certeza? Digite 'SIM' para confirmar: "
if /i not "%confirm%"=="SIM" (
    echo Operação cancelada.
    pause
    exit /b 0
)

echo.
echo Aguarde...
echo.

echo [1/3] Parando e removendo containers...
docker compose down -v

if %errorlevel% neq 0 (
    color 0C
    echo ❌ ERRO ao resetar
    pause
    exit /b 1
)

echo ✅ Containers removidos

echo [2/3] Deletando dados persistentes...
if exist mysql_data (
    rmdir /s /q mysql_data
    echo ✅ Dados deletados
) else (
    echo ℹ️  Pasta mysql_data não encontrada
)

echo [3/3] Reiniciando sistema...
docker compose up -d
timeout /t 15 /nobreak > nul

color 0A
echo.
echo ============================================================
echo        ✅ BANCO DE DADOS RESETADO!
echo ============================================================
echo.
echo O banco foi restaurado para o estado padrão.
echo Execute INICIAR_SISTEMA.bat para começar.
echo.
pause
