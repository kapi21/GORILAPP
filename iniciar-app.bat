@echo off
REM Script para iniciar GorilApp en modo desarrollo
REM Ejecutar este archivo para arrancar la aplicación

title GorilApp - Servidor de Desarrollo

echo ========================================
echo        GORILAPP - GYM TRACKER
echo ========================================
echo.
echo Iniciando servidor de desarrollo...
echo.
echo La aplicacion estara disponible en:
echo   - Local:    http://localhost:3000
echo   - Red:      http://192.168.1.4:3000
echo   - Internet: http://gorilapp.duckdns.org:3000
echo.
echo Presiona Ctrl+C para detener el servidor
echo ========================================
echo.

REM Cambiar al directorio del proyecto
cd /d "%~dp0"

REM Iniciar el servidor de desarrollo
npm run dev

pause
