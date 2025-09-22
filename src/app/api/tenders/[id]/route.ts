import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tender = await prisma.tender.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!tender) {
      return NextResponse.json(
        { error: "Licitación no encontrada" },
        { status: 404 }
      );
    }

    // Calcular resumen
    const totalRevenue = tender.orders.reduce(
      (sum, order) => sum + order.product.salePrice * order.quantity,
      0
    );
    const totalCost = tender.orders.reduce(
      (sum, order) => sum + order.product.costPrice * order.quantity,
      0
    );
    const totalMargin = totalRevenue - totalCost;

    const tenderWithSummary = {
      ...tender,
      summary: {
        totalRevenue,
        totalCost,
        totalMargin,
        productCount: tender.orders.length,
      },
    };

    return NextResponse.json(tenderWithSummary);
  } catch (error) {
    console.error("Error fetching tender:", error);
    return NextResponse.json(
      { error: "Error al obtener licitación" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Verificar que la licitación existe
    const existingTender = await prisma.tender.findUnique({
      where: { id },
    });

    if (!existingTender) {
      return NextResponse.json(
        { error: "Licitación no encontrada" },
        { status: 404 }
      );
    }

    // Eliminar la licitación (las órdenes se eliminarán automáticamente por CASCADE)
    await prisma.tender.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Licitación eliminada exitosamente" });
  } catch (error) {
    console.error("Error deleting tender:", error);
    return NextResponse.json(
      { error: "Error al eliminar licitación" },
      { status: 500 }
    );
  }
}
