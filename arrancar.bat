@echo off
title GorilApp 🦍 - Servidor Local
color 0C

echo ===================================================
echo             GORILAPP - MODO ENTRENAMIENTO
echo ===================================================
echo.

cd /d "%~dp0"

REM Verificar dependencias
if not exist "node_modules\" (
    echo [1/3] Instalando dependencias necesarias...
    call npm install
)

echo [2/3] Abriendo navegador en http://localhost:3000...
start "" http://localhost:3000

echo [3/3] Iniciando servidor de desarrollo...
echo.
echo Presiona Ctrl+C en esta ventana para detener la app.
echo ===================================================
echo.

call npm run dev

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] El servidor se detuvo con errores.
    pause
)
