#!/bin/bash

echo "🐳 Configurando entorno Docker para Public Tenders..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Iniciar contenedores
echo "🚀 Iniciando contenedores..."
docker-compose up -d

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 10

# Ejecutar migraciones
echo "📊 Ejecutando migraciones de base de datos..."
npx prisma db push

# Ejecutar seed
echo "🌱 Ejecutando seed de datos..."
npm run seed

echo "✅ ¡Configuración completada!"
echo ""
echo "🌐 Servicios disponibles:"
echo "  - Aplicación: http://localhost:3000"
echo "  - pgAdmin: http://localhost:8080 (admin@admin.com / admin123)"
echo "  - PostgreSQL: localhost:5432"
echo ""
echo "📋 Comandos útiles:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Detener: docker-compose down"
echo "  - Reiniciar: docker-compose restart"
