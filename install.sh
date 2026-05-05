#!/bin/bash

# Script de instalación automática - Sistema de Gestión de Clínica
# Para Mac y Linux

echo ""
echo "======================================"
echo "  Sistema de Gestión de Clínica"
echo "  Script de Instalación Automática"
echo "======================================"
echo ""

# Verificar si Node.js está instalado
echo "[1/4] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js no está instalado."
    echo "Descárgalo en: https://nodejs.org/"
    echo ""
    exit 1
fi
echo "✓ Node.js $(node --version) instalado"

echo ""

# Verificar si npm está instalado
echo "[2/4] Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ ERROR: npm no está instalado."
    exit 1
fi
echo "✓ npm $(npm --version) instalado"

echo ""

# Instalar dependencias del Backend
echo "[3/4] Instalando dependencias del Backend..."
cd BackEnd
npm install
if [ $? -ne 0 ]; then
    echo "❌ ERROR: No se pudieron instalar las dependencias del Backend."
    cd ..
    exit 1
fi
echo "✓ Backend instalado correctamente"
cd ..

echo ""

# Instalar dependencias del Frontend
echo "[4/4] Instalando dependencias del Frontend..."
cd FrontEnd
npm install
if [ $? -ne 0 ]; then
    echo "❌ ERROR: No se pudieron instalar las dependencias del Frontend."
    cd ..
    exit 1
fi
echo "✓ Frontend instalado correctamente"
cd ..

echo ""
echo "======================================"
echo "   ✓ Instalación completada!"
echo "======================================"
echo ""
echo "Próximos pasos:"
echo ""
echo "1. Configura las variables de entorno:"
echo "   - Abre BackEnd/.env y completa los valores"
echo "   - Abre FrontEnd/.env y completa los valores"
echo ""
echo "2. Crea la base de datos MySQL"
echo ""
echo "3. Ejecuta el proyecto:"
echo "   npm run dev"
echo ""
echo "Para más información, consulta el README.md"
echo ""
