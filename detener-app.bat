@echo off
REM Script para detener todos los procesos de Node.js (servidor de desarrollo)

title Detener GorilApp

echo ========================================
echo   Deteniendo servidor de GorilApp...
echo ========================================
echo.

taskkill /F /IM node.exe

if %errorLevel% equ 0 (
    echo.
    echo Servidor detenido correctamente
) else (
    echo.
    echo No hay ningun servidor corriendo
)

echo.
pause
