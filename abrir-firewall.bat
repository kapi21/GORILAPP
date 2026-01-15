@echo off
REM Script para abrir el puerto 3000 en el Firewall de Windows para GorilApp
REM Debe ejecutarse como Administrador

echo ========================================
echo  Configurando Firewall para GorilApp
echo ========================================
echo.

REM Verificar si se está ejecutando como administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Este script debe ejecutarse como Administrador
    echo.
    echo Haz clic derecho en el archivo y selecciona "Ejecutar como administrador"
    echo.
    pause
    exit /b 1
)

echo Abriendo puerto 3000 TCP en el Firewall de Windows...
echo.

REM Eliminar regla existente si existe (para evitar duplicados)
netsh advfirewall firewall delete rule name="GorilApp - Puerto 3000" >nul 2>&1

REM Crear nueva regla de entrada para el puerto 3000
netsh advfirewall firewall add rule name="GorilApp - Puerto 3000" dir=in action=allow protocol=TCP localport=3000

if %errorLevel% equ 0 (
    echo.
    echo ========================================
    echo  EXITO: Firewall configurado correctamente
    echo ========================================
    echo.
    echo Puerto 3000 TCP abierto para GorilApp
    echo Ahora puedes acceder desde:
    echo   - http://gorilapp.duckdns.org:3000
    echo   - http://192.168.1.4:3000
    echo.
) else (
    echo.
    echo ========================================
    echo  ERROR: No se pudo configurar el Firewall
    echo ========================================
    echo.
    echo Verifica que tienes permisos de administrador
    echo.
)

pause
