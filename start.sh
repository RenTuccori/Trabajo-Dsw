#!/bin/bash

# Script para ejecutar el proyecto - Sistema de Gestión de Clínica

echo ""
echo "======================================"
echo "  Sistema de Gestión de Clínica"
echo "  Iniciando proyecto..."
echo "======================================"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js no está instalado."
    echo "Descárgalo en: https://nodejs.org/"
    exit 1
fi

# Advertencia si MySQL no está disponible
if ! command -v mysql &> /dev/null; then
    echo "⚠️  ADVERTENCIA: MySQL no parece estar disponible."
    echo "Asegúrate de que MySQL esté corriendo."
    echo ""
fi

echo ""
echo "Iniciando servidores..."
echo ""
echo "✓ Backend: http://localhost:3000"
echo "✓ Frontend: http://localhost:5173"
echo ""
echo "Presiona Ctrl+C en cualquier momento para detener."
echo ""

# Iniciar el proyecto
npm run dev
