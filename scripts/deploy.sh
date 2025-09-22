#!/bin/bash

echo "🚀 Desplegando Public Tenders a producción..."

# Verificar que estamos en la rama correcta
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "⚠️  Advertencia: No estás en la rama main/master"
    read -p "¿Continuar de todos modos? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Verificar que no hay cambios sin commitear
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Hay cambios sin commitear. Por favor, haz commit de todos los cambios primero."
    exit 1
fi

echo "✅ Verificaciones completadas"

# Opciones de despliegue
echo ""
echo "🌐 Selecciona la plataforma de despliegue:"
echo "1) Vercel (recomendado para Next.js)"
echo "2) Railway (PostgreSQL incluido)"
echo "3) DigitalOcean App Platform"
echo "4) Docker (genérico)"

read -p "Ingresa tu opción (1-4): " choice

case $choice in
    1)
        echo "🚀 Desplegando a Vercel..."
        echo "1. Instala Vercel CLI: npm i -g vercel"
        echo "2. Ejecuta: vercel"
        echo "3. Configura DATABASE_URL en las variables de entorno"
        echo "4. Recomendamos usar PlanetScale o Neon para la base de datos"
        ;;
    2)
        echo "🚀 Desplegando a Railway..."
        echo "1. Instala Railway CLI: npm i -g @railway/cli"
        echo "2. Ejecuta: railway login"
        echo "3. Ejecuta: railway up"
        echo "4. Railway configurará PostgreSQL automáticamente"
        ;;
    3)
        echo "🚀 Desplegando a DigitalOcean..."
        echo "1. Crea una App en DigitalOcean"
        echo "2. Conecta tu repositorio GitHub"
        echo "3. Configura las variables de entorno"
        echo "4. Usa PostgreSQL como base de datos"
        ;;
    4)
        echo "🐳 Desplegando con Docker..."
        echo "1. Build de la imagen: docker build -f Dockerfile.prod -t public-tenders ."
        echo "2. Ejecutar: docker run -p 3000:3000 -e DATABASE_URL=tu_url public-tenders"
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "📋 Pasos adicionales:"
echo "1. Configura la variable DATABASE_URL con tu base de datos de producción"
echo "2. Ejecuta las migraciones: npx prisma db push"
echo "3. Pobla con datos: npm run seed (opcional)"
echo ""
echo "🎉 ¡Despliegue configurado!"
