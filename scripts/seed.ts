import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Función para leer archivos JSON
function readSeedFile(filename: string): any[] {
  const filePath = path.join(process.cwd(), "seed", filename);
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`❌ Error leyendo archivo ${filename}:`, error);
    return [];
  }
}

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Limpiar la base de datos primero
  console.log("🧹 Limpiando base de datos existente...");
  await prisma.order.deleteMany();
  await prisma.tender.deleteMany();
  await prisma.product.deleteMany();
  console.log("✅ Base de datos limpiada");

  // Leer datos de los archivos JSON
  const productsData = readSeedFile("products.json");
  const tendersData = readSeedFile("tenders.json");
  const ordersData = readSeedFile("orders.json");

  if (productsData.length === 0) {
    console.error("❌ No se encontraron datos de productos en products.json");
    return;
  }

  if (tendersData.length === 0) {
    console.error("❌ No se encontraron datos de licitaciones en tenders.json");
    return;
  }

  console.log(
    `📁 Cargados ${productsData.length} productos desde products.json`
  );
  console.log(
    `📁 Cargadas ${tendersData.length} licitaciones desde tenders.json`
  );
  console.log(`📁 Cargadas ${ordersData.length} órdenes desde orders.json`);

  // Crear productos
  const products = await Promise.all(
    productsData.map((productData) =>
      prisma.product.create({
        data: {
          name: productData.name,
          sku: productData.sku,
          description: productData.description || "",
          salePrice: productData.salePrice,
          costPrice: productData.costPrice,
        },
      })
    )
  );

  console.log(`✅ Creados ${products.length} productos`);

  // Crear licitaciones
  const tenders = await Promise.all(
    tendersData.map((tenderData) =>
      prisma.tender.create({
        data: {
          client: tenderData.client,
          awardDate: new Date(tenderData.awardDate),
          deliveryDate: tenderData.deliveryDate
            ? new Date(tenderData.deliveryDate)
            : null,
          deliveryAddress: tenderData.deliveryAddress || null,
          contactPhone: tenderData.contactPhone || null,
          contactEmail: tenderData.contactEmail || null,
          margin: tenderData.margin || 0.4,
        },
      })
    )
  );

  console.log(`✅ Creadas ${tenders.length} licitaciones`);

  // Crear órdenes
  const orders = await Promise.all(
    ordersData.map((orderData) =>
      prisma.order.create({
        data: {
          tenderId: tenders[orderData.tenderIndex].id,
          productId: products[orderData.productIndex].id,
          quantity: orderData.quantity,
          price: orderData.price || 0,
          observation: orderData.observation || "",
        },
      })
    )
  );

  console.log(`✅ Creadas ${orders.length} órdenes`);

  // Validaciones adicionales
  console.log("\n🔍 Validando datos...");

  // Verificar que todas las órdenes tengan índices válidos
  const invalidOrders = ordersData.filter(
    (order) =>
      order.tenderIndex >= tenders.length ||
      order.productIndex >= products.length
  );

  if (invalidOrders.length > 0) {
    console.warn(
      `⚠️  ${invalidOrders.length} órdenes tienen índices inválidos`
    );
  }

  // Verificar SKUs únicos
  const skus = productsData.map((p) => p.sku);
  const uniqueSkus = new Set(skus);
  if (skus.length !== uniqueSkus.size) {
    console.warn("⚠️  Hay SKUs duplicados en products.json");
  }

  // Verificar precios válidos
  const invalidPrices = productsData.filter((p) => p.salePrice <= p.costPrice);
  if (invalidPrices.length > 0) {
    console.warn(
      `⚠️  ${invalidPrices.length} productos tienen precio de venta <= costo`
    );
  }

  // Calcular y mostrar estadísticas
  const totalTenders = await prisma.tender.count();
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();

  console.log("\n📊 Estadísticas del seed:");
  console.log(`- Licitaciones: ${totalTenders}`);
  console.log(`- Productos: ${totalProducts}`);
  console.log(`- Órdenes: ${totalOrders}`);

  // Calcular estadísticas financieras
  const allTenders = await prisma.tender.findMany({
    include: {
      orders: {
        include: {
          product: true,
        },
      },
    },
  });

  let totalRevenue = 0;
  let totalCost = 0;
  let totalMargin = 0;

  allTenders.forEach((tender) => {
    tender.orders.forEach((order) => {
      const revenue = order.product.salePrice * order.quantity;
      const cost = order.product.costPrice * order.quantity;
      totalRevenue += revenue;
      totalCost += cost;
      totalMargin += revenue - cost;
    });
  });

  console.log("\n💰 Estadísticas financieras:");
  console.log(`- Ingresos totales: $${totalRevenue.toLocaleString("es-CL")}`);
  console.log(`- Costos totales: $${totalCost.toLocaleString("es-CL")}`);
  console.log(`- Margen total: $${totalMargin.toLocaleString("es-CL")}`);
  console.log(
    `- Margen promedio por licitación: $${Math.round(
      totalMargin / totalTenders
    ).toLocaleString("es-CL")}`
  );

  console.log("\n🎉 Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
