import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateTender } from "@/lib/validations";
import { TenderFormData } from "@/types";

export async function GET() {
  try {
    const tenders = await prisma.tender.findMany({
      include: {
        orders: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { awardDate: "desc" },
    });

    // Calcular resúmenes para cada licitación
    const tendersWithSummary = tenders.map((tender) => {
      const totalRevenue = tender.orders.reduce(
        (sum, order) => sum + order.product.salePrice * order.quantity,
        0
      );
      const totalCost = tender.orders.reduce(
        (sum, order) => sum + order.product.costPrice * order.quantity,
        0
      );
      const totalMargin = totalRevenue - totalCost;

      return {
        ...tender,
        summary: {
          totalRevenue,
          totalCost,
          totalMargin,
          productCount: tender.orders.length,
        },
      };
    });

    return NextResponse.json(tendersWithSummary);
  } catch (error) {
    console.error("Error fetching tenders:", error);
    return NextResponse.json(
      { error: "Error al obtener licitaciones" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: TenderFormData = await request.json();

    const errors = validateTender(data);
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Verificar que todos los productos existen
    const productIds = data.products.map((p) => p.productId);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (existingProducts.length !== productIds.length) {
      return NextResponse.json(
        {
          errors: ["Uno o más productos no existen"],
        },
        { status: 400 }
      );
    }

    // Crear la licitación y las órdenes en una transacción
    const result = await prisma.$transaction(async (tx) => {
      const tender = await tx.tender.create({
        data: {
          client: data.client,
          awardDate: new Date(data.awardDate),
          deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
          deliveryAddress: data.deliveryAddress || null,
          contactPhone: data.contactPhone || null,
          contactEmail: data.contactEmail || null,
          margin: data.margin || 0.4,
        },
      });

      const orders = await Promise.all(
        data.products.map((product) =>
          tx.order.create({
            data: {
              tenderId: tender.id,
              productId: product.productId,
              quantity: product.quantity,
              price: product.price || 0,
              observation: product.observation || "",
            },
          })
        )
      );

      return { tender, orders };
    });

    // Obtener la licitación completa con sus relaciones
    const tenderWithDetails = await prisma.tender.findUnique({
      where: { id: result.tender.id },
      include: {
        orders: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(tenderWithDetails, { status: 201 });
  } catch (error) {
    console.error("Error creating tender:", error);
    return NextResponse.json(
      { error: "Error al crear licitación" },
      { status: 500 }
    );
  }
}
