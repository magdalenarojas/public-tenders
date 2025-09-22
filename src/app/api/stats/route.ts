import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Obtener todas las licitaciones con sus órdenes y productos
    const tenders = await prisma.tender.findMany({
      include: {
        orders: {
          include: {
            product: true,
          },
        },
      },
    });

    // Calcular estadísticas generales
    const totalTenders = tenders.length;
    const totalProducts = await prisma.product.count();

    let totalRevenue = 0;
    let totalCost = 0;
    let totalMargin = 0;

    tenders.forEach((tender) => {
      tender.orders.forEach((order) => {
        const revenue = order.product.salePrice * order.quantity;
        const cost = order.product.costPrice * order.quantity;
        totalRevenue += revenue;
        totalCost += cost;
        totalMargin += revenue - cost;
      });
    });

    // Calcular estadísticas por licitación
    const tenderStats = tenders
      .map((tender) => {
        const revenue = tender.orders.reduce(
          (sum, order) => sum + order.product.salePrice * order.quantity,
          0
        );
        const cost = tender.orders.reduce(
          (sum, order) => sum + order.product.costPrice * order.quantity,
          0
        );
        const margin = revenue - cost;

        return {
          id: tender.id,
          client: tender.client,
          awardDate: tender.awardDate,
          revenue,
          cost,
          margin,
          productCount: tender.orders.length,
        };
      })
      .sort((a, b) => b.margin - a.margin); // Ordenar por margen descendente

    const stats = {
      overview: {
        totalTenders,
        totalProducts,
        totalRevenue,
        totalCost,
        totalMargin,
        averageMarginPerTender:
          totalTenders > 0 ? totalMargin / totalTenders : 0,
      },
      tenderRanking: tenderStats.slice(0, 10), // Top 10 licitaciones por margen
      recentTenders: tenders
        .sort(
          (a, b) =>
            new Date(b.awardDate).getTime() - new Date(a.awardDate).getTime()
        )
        .slice(0, 5)
        .map((tender) => ({
          id: tender.id,
          client: tender.client,
          awardDate: tender.awardDate,
          productCount: tender.orders.length,
        })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
