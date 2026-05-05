@echo off
REM Script de instalación automática - Sistema de Gestión de Clínica
REM Este script instala todas las dependencias automáticamente

echo.
echo ======================================
echo   Sistema de Gestión de Clínica
echo   Script de Instalación Automática
echo ======================================
echo.

REM Verificar si Node.js está instalado
echo [1/4] Verificando Node.js...
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ ERROR: Node.js no está instalado.
    echo Descárgalo en: https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do echo ✓ Node.js %%i instalado
)

echo.

REM Verificar si npm está instalado
echo [2/4] Verificando npm...
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ ERROR: npm no está instalado.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do echo ✓ npm %%i instalado
)

echo.

REM Instalar dependencias del Backend
echo [3/4] Instalando dependencias del Backend...
cd BackEnd
call npm install
if errorlevel 1 (
    echo ❌ ERROR: No se pudieron instalar las dependencias del Backend.
    cd ..
    pause
    exit /b 1
)
echo ✓ Backend instalado correctamente
cd ..

echo.

REM Instalar dependencias del Frontend
echo [4/4] Instalando dependencias del Frontend...
cd FrontEnd
call npm install
if errorlevel 1 (
    echo ❌ ERROR: No se pudieron instalar las dependencias del Frontend.
    cd ..
    pause
    exit /b 1
)
echo ✓ Frontend instalado correctamente
cd ..

echo.
echo ======================================
echo   ✓ Instalación completada!
echo ======================================
echo.
echo Próximos pasos:
echo.
echo 1. Configura las variables de entorno:
echo    - Abre BackEnd\.env y completa los valores
echo    - Abre FrontEnd\.env y completa los valores
echo.
echo 2. Crea la base de datos MySQL
echo.
echo 3. Ejecuta el proyecto:
echo    npm run dev
echo.
echo Para más información, consulta el README.md
echo.
pause
