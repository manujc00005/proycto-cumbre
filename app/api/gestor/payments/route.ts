// app/api/gestor/payments/route.ts - ACTUALIZADO

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

const prisma = new PrismaClient();

export async function GET() {
  try {
    logger.log("📥 GET /api/gestor/payments - Obteniendo pagos...");

    const payments = await prisma.payment.findMany({
      orderBy: { created_at: "desc" },
      include: {
        // 🆕 Incluir relaciones opcionales
        member: {
          select: {
            member_number: true,
            first_name: true,
            last_name: true,
          },
        },
        eventRegistration: {
          select: {
            participant_name: true,
            participant_email: true,
            event: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        order: {
          select: {
            order_number: true,
            customer_name: true,
          },
        },
      },
    });

    logger.log(`✅ Se encontraron ${payments.length} pagos`);

    // 🆕 Mapear para tener un formato consistente
    const formattedPayments = payments.map((payment) => ({
      ...payment,
      // Determinar el "sujeto" del pago
      subject:
        payment.payment_type === "membership"
          ? `${payment.member?.first_name} ${payment.member?.last_name}`
          : payment.payment_type === "event"
            ? payment.eventRegistration?.participant_name
            : payment.payment_type === "order"
              ? payment.order?.customer_name
              : "N/A",

      // Información adicional
      reference:
        payment.payment_type === "membership"
          ? payment.member?.member_number
          : payment.payment_type === "event"
            ? payment.eventRegistration?.event.name
            : payment.payment_type === "order"
              ? payment.order?.order_number
              : null,
    }));

    return NextResponse.json({
      success: true,
      payments: formattedPayments,
    });
  } catch (error: any) {
    logger.error("❌ Error obteniendo pagos:", error);
    return NextResponse.json(
      { error: "Error al obtener pagos", details: error.message },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
