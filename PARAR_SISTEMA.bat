@echo off
chcp 65001 > nul
color 0C
title 🛑 Sistema SECTI - Parar

cls
echo.
echo ============================================================
echo        PARANDO SISTEMA SECTI
echo ============================================================
echo.

echo Parando containers...
docker compose stop

if %errorlevel% equ 0 (
    color 0A
    echo.
    echo ✅ SISTEMA PARADO COM SUCESSO
    echo.
    echo Informações:
    echo - Os dados foram salvos e persistem
    echo - Para reiniciar: execute INICIAR_SISTEMA.bat
    echo - Para deletar dados: execute RESETAR_SISTEMA.bat
    echo.
) else (
    color 0C
    echo.
    echo ❌ ERRO ao parar o sistema
    echo.
)

pause
