@echo off
REM Script para ejecutar el proyecto - Sistema de Gestión de Clínica

echo.
echo ======================================
echo   Sistema de Gestión de Clínica
echo   Iniciando proyecto...
echo ======================================
echo.

REM Verificar si Node.js está instalado
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ ERROR: Node.js no está instalado.
    echo Descárgalo en: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si mysql está disponible
where mysql >nul 2>nul
if errorlevel 1 (
    echo ⚠️  ADVERTENCIA: MySQL no parece estar en el PATH.
    echo Asegúrate de que MySQL esté corriendo.
    echo.
)

echo.
echo Iniciando servidores...
echo.
echo ✓ Backend: http://localhost:3000
echo ✓ Frontend: http://localhost:5173
echo.
echo Presiona Ctrl+C en cualquier momento para detener.
echo.

REM Iniciar el proyecto
call npm run dev

pause
