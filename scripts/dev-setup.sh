#!/bin/bash

echo "🚀 Configurando entorno de desarrollo para Public Tenders..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Crear directorio para datos
mkdir -p data/postgres

# Iniciar solo PostgreSQL
echo "🐘 Iniciando PostgreSQL..."
docker-compose up -d postgres

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 10

# Verificar conexión
echo "🔍 Verificando conexión a la base de datos..."
docker-compose exec postgres pg_isready -U postgres

if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL está listo!"
    
    # Ejecutar migraciones
    echo "📊 Ejecutando migraciones de base de datos..."
    npx prisma db push
    
    # Ejecutar seed
    echo "🌱 Ejecutando seed de datos..."
    npm run seed
    
    echo ""
    echo "🎉 ¡Configuración completada!"
    echo ""
    echo "📋 Información de la base de datos:"
    echo "  - Host: localhost"
    echo "  - Puerto: 5432"
    echo "  - Base de datos: public_tenders"
    echo "  - Usuario: postgres"
    echo "  - Contraseña: postgres123"
    echo ""
    echo "💾 Los datos se almacenan en: ./data/postgres"
    echo ""
    echo "🚀 Para iniciar la aplicación:"
    echo "  npm run dev"
    echo ""
    echo "🛑 Para detener PostgreSQL:"
    echo "  docker-compose down"
else
    echo "❌ Error: No se pudo conectar a PostgreSQL"
    exit 1
fi
