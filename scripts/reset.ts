import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Limpiando base de datos...");

  try {
    // Eliminar en orden correcto debido a las foreign keys
    await prisma.order.deleteMany();
    console.log("✅ Órdenes eliminadas");

    await prisma.tender.deleteMany();
    console.log("✅ Licitaciones eliminadas");

    await prisma.product.deleteMany();
    console.log("✅ Productos eliminados");

    console.log("\n🎉 Base de datos limpiada exitosamente!");
  } catch (error) {
    console.error("❌ Error limpiando la base de datos:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Error durante la limpieza:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
