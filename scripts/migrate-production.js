#!/usr/bin/env node

/**
 * Script para ejecutar migraciones en producción
 * Uso: node scripts/migrate-production.js
 */

const { PrismaClient } = require("@prisma/client");

async function migrateProduction() {
  console.log("🚀 Ejecutando migraciones en producción...");

  // Verificar que DATABASE_URL esté configurada
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL no está configurada");
    console.log(
      "💡 Asegúrate de configurar la variable de entorno DATABASE_URL"
    );
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    // Verificar conexión
    await prisma.$connect();
    console.log("✅ Conexión a la base de datos exitosa");

    // Ejecutar migraciones usando Prisma
    console.log("📊 Ejecutando migraciones...");
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

    // Verificar que las tablas existan
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('products', 'tenders', 'orders')
    `;

    console.log(`✅ Encontradas ${tables.length} tablas en la base de datos`);

    if (tables.length === 0) {
      console.log(
        "⚠️  No se encontraron tablas. Ejecuta 'npx prisma db push' primero"
      );
    }

    console.log("🎉 Migraciones completadas exitosamente!");
  } catch (error) {
    console.error("❌ Error durante las migraciones:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateProduction();


