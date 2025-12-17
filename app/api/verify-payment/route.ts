import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { PaymentType } from "@prisma/client";
import { z } from "zod";
import { getMetadataObject, mapStripeToPaymentStatus } from "../helpers";

export const runtime = "nodejs";

export const BodySchema = z.object({
  sessionId: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = BodySchema.safeParse(await request.json());
    if (!body.success) {
      return NextResponse.json(
        { error: "Body inválido", details: body.error.flatten() },
        { status: 400 }
      );
    }

    const { sessionId } = body.data;

    logger.log("🔍 Verificando pago:", sessionId);

    // 1) Stripe
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });
    }

    // 2) Payment en BD
    const payment = await prisma.payment.findUnique({
      where: { stripe_session_id: sessionId },
      select: {
        id: true,
        payment_type: true,
        amount: true,
        currency: true,
        status: true,
        member_id: true,
        event_registration_id: true,
        order_id: true,
        metadata: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Pago no encontrado en base de datos" },
        { status: 404 }
      );
    }

    // 3) Sincroniza status con Stripe (si cambia)
    const stripeMappedStatus = mapStripeToPaymentStatus(session);

    // Si añadiste PaymentStatus.cancelled, aquí podrías mapear "canceled" si lo detectas por tu lógica.
    // Stripe no siempre lo marca como "canceled" en checkout, suele ser open/expired.

    if (payment.status !== stripeMappedStatus) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: stripeMappedStatus },
      });
    }

    // 4) Construir respuesta tipada (sin any)
    const uiType =
      payment.payment_type === PaymentType.order ? "shop" : payment.payment_type;
    const baseResponse = {
      sessionId,
      type: uiType,
      amount: payment.amount,
      currency: payment.currency,
      status: stripeMappedStatus,
      stripe: {
        status: session.status,
        payment_status: session.payment_status,
      },
      metadata: payment.metadata,
    };

    // MEMBERSHIP
    if (payment.payment_type === PaymentType.membership && payment.member_id) {
      const member = await prisma.member.findUnique({
        where: { id: payment.member_id },
        select: {
          id: true,
          member_number: true,
          first_name: true,
          last_name: true,
          email: true,
          membership_status: true,
          license_type: true,
        },
      });

      return NextResponse.json({
        ...baseResponse,
        type: PaymentType.membership, 
        firstName: member?.first_name ?? null,
        lastName: member?.last_name ?? null,
        email: member?.email ?? null,
        memberNumber: member?.member_number ?? null,
        licenseType: member?.license_type ?? null,
        member: member
          ? {
              id: member.id,
              memberNumber: member.member_number,
              firstName: member.first_name,
              lastName: member.last_name,
              email: member.email,
              membershipStatus: member.membership_status,
              licenseType: member.license_type,
            }
          : null,
      });
    }

    // EVENT
    if (payment.payment_type === PaymentType.event && payment.event_registration_id) {
      const registration = await prisma.eventRegistration.findUnique({
        where: { id: payment.event_registration_id },
        select: {
          id: true,
          participant_name: true,
          participant_email: true,
          event: {
            select: {
              id: true,
              name: true,
              slug: true,
              event_date: true,
              location: true,
              status: true,
            },
          },
        },
      });

      return NextResponse.json({
        ...baseResponse,
        type: PaymentType.event,                
        participantName: registration?.participant_name ?? null,
        participantEmail: registration?.participant_email ?? null,
        eventName: registration?.event?.name ?? null,
        eventSlug: registration?.event?.slug ?? null,
        eventDate: registration?.event?.event_date ?? null,
        eventLocation: registration?.event?.location ?? null,
        registrationId: registration?.id ?? null,
        registration: registration
          ? {
              id: registration.id,
              participantName: registration.participant_name,
              participantEmail: registration.participant_email,
              event: {
                id: registration.event.id,
                name: registration.event.name,
                slug: registration.event.slug,
                date: registration.event.event_date,
                location: registration.event.location,
                status: registration.event.status,
              },
            }
          : null,
      });
    }
    
    // ORDER
    if (payment.payment_type === PaymentType.order) {
      const metaObj = getMetadataObject(payment.metadata);
      const items = metaObj?.items ?? [];

      return NextResponse.json({
        ...baseResponse,
        type: PaymentType.order,
        order: {
          orderId: payment.order_id ?? null,
          items,
        },
      });
    }

    // Default
    return NextResponse.json(baseResponse);
  } catch (error: any) {
    logger.error("❌ Error verificando pago:", error);
    return NextResponse.json(
      { error: "Error al verificar el pago", details: error?.message },
      { status: 500 }
    );
  }
}
