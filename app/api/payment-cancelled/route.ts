// ========================================
// API ENDPOINT: PAYMENT CANCELLED (GENÉRICO)
// app/api/payment-cancelled/route.ts
// ========================================

import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID requerido" },
        { status: 400 },
      );
    }

    logger.log("🚫 Procesando cancelación de pago:", sessionId);

    // ========================================
    // 1) BUSCAR SESIÓN EN STRIPE
    // ========================================

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Sesión no encontrada" },
        { status: 404 },
      );
    }

    // ========================================
    // 2) BUSCAR PAYMENT EN BD
    // ========================================

    const payment = await prisma.payment.findUnique({
      where: { stripe_session_id: sessionId },
      select: {
        id: true,
        payment_type: true,
        status: true,
      },
    });

    if (!payment) {
      // Si no existe el payment, es normal (el usuario canceló antes de que se creara)
      logger.log(
        "⚠️ Payment no encontrado en BD (normal si canceló inmediatamente)",
      );

      return NextResponse.json({
        success: true,
        message: "Cancelación procesada (sin payment en BD)",
        type: session.metadata?.type || null,
      });
    }

    // ========================================
    // 3) ACTUALIZAR PAYMENT A FAILED
    // ========================================

    if (payment.status === "pending") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.failed,
          updated_at: new Date(),
        },
      });

      logger.log("✅ Payment marcado como failed:", payment.id);
    } else {
      logger.log(`⚠️ Payment ya estaba en estado: ${payment.status}`);
    }

    // ========================================
    // 4) ACTUALIZAR EVENT_REGISTRATION SI APLICA
    // ========================================

    if (payment.payment_type === "event") {
      const registration = await prisma.eventRegistration.findFirst({
        where: {
          id: { not: undefined },
          // Buscar por payment_id o session_id en metadata
        },
        select: { id: true, status: true },
      });

      if (registration && registration.status === "pending") {
        await prisma.eventRegistration.update({
          where: { id: registration.id },
          data: {
            status: "cancelled",
            updated_at: new Date(),
          },
        });

        logger.log("✅ EventRegistration marcado como cancelled");
      }
    }

    return NextResponse.json({
      success: true,
      message: "Pago cancelado exitosamente",
      type: payment.payment_type,
    });
  } catch (error: any) {
    logger.error("❌ Error procesando cancelación:", error);

    return NextResponse.json(
      { error: "Error al procesar la cancelación", details: error.message },
      { status: 500 },
    );
  }
}
