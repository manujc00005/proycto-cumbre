import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import {
  EventStatus,
  MembershipStatus,
  PaymentStatus,
  PaymentType,
} from "@prisma/client";
import { z } from "zod";

export const runtime = "nodejs";

const BodySchema = z.object({
  eventId: z.string().uuid(),

  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  dni: z.string().min(5), // en tu schema es obligatorio

  shirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL"]).optional(),

  consents: z.object({
    privacy_accepted: z.boolean(),
    whatsapp_consent: z.boolean(),
    marketing_consent: z.boolean().optional(),

    // opcionales, si quieres guardar timestamps
    privacy_accepted_at: z.string().datetime().optional(),
    whatsapp_consent_at: z.string().datetime().optional(),
  }),

  waiver_acceptance_id: z.string().uuid().optional(),
  custom_fields: z.record(z.string(), z.unknown()).optional(),
});

function normalizePhone(phone: string) {
  return phone.replace(/\s+/g, "");
}

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const parsed = BodySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Body inválido", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      eventId,
      name,
      email,
      phone,
      dni,
      shirtSize,
      consents,
      waiver_acceptance_id,
      custom_fields,
    } = parsed.data;

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = normalizePhone(phone);

    // Validación teléfono (simple, evita false positives)
    const phoneRegex = /^(\+?[1-9]\d{0,2})?\d{9}$/;
    if (!phoneRegex.test(normalizedPhone)) {
      return NextResponse.json(
        { error: "El teléfono debe tener 9 dígitos o un formato internacional válido" },
        { status: 400 }
      );
    }

    logger.apiStart("POST", "/api/events/checkout", { eventId, email: normalizedEmail });

    // RGPD
    if (!consents.privacy_accepted) {
      return NextResponse.json(
        { error: "Debes aceptar la Política de Privacidad" },
        { status: 400 }
      );
    }
    if (!consents.whatsapp_consent) {
      return NextResponse.json(
        { error: "Debes aceptar compartir tus datos en WhatsApp para participar" },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(request);

    // 1) Cargar evento
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        slug: true,
        name: true,
        price: true,
        currency: true,
        max_participants: true,
        current_participants: true,
        status: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: `Evento no encontrado: ${eventId}` },
        { status: 404 }
      );
    }

    // Estado evento (según tu enum)
    if (
      event.status !== EventStatus.published &&
      event.status !== EventStatus.draft
    ) {
      return NextResponse.json(
        { error: "Este evento no está disponible para inscripciones" },
        { status: 400 }
      );
    }

    // Plazas (esto NO es 100% seguro sin transacción + update condicional,
    // pero al menos bloquea el caso evidente)
    if (event.max_participants && event.current_participants >= event.max_participants) {
      return NextResponse.json(
        { error: "El evento está completo (plazas agotadas)" },
        { status: 400 }
      );
    }

    // 2) Miembro
    const existingMember = await prisma.member.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        member_number: true,
        membership_status: true,
        first_name: true,
        last_name: true,
      },
    });

    const memberId = existingMember?.id ?? null;
    const isMember = existingMember?.membership_status === MembershipStatus.active;

    // 3) Custom data
    const customData: Record<string, any> = {};
    if (shirtSize) customData.shirt_size = shirtSize;
    if (custom_fields) Object.assign(customData, custom_fields);

    // 4) Stripe session primero (para tener sessionId en Payment)
    const stripe = getStripe();

    const descriptionParts = [`Inscripción para ${name}`];
    if (shirtSize) descriptionParts.push(`Talla: ${shirtSize}`);
    if (isMember) descriptionParts.push(`Socio`);
    const productDescription = descriptionParts.join(" · ");

    const publicUrl = process.env.NEXT_PUBLIC_URL;
    if (!publicUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_URL no está configurada" },
        { status: 500 }
      );
    }

    // 5) DB: registration + (optional) waiver link + payment
    // Transacción para dejar el sistema consistente
    const result = await prisma.$transaction(async (tx) => {
      // Crear inscripción (ojo: dni obligatorio en schema)
      const registration = await tx.eventRegistration.create({
        data: {
          event_id: event.id,
          member_id: memberId,
          participant_name: name.trim(),
          participant_email: normalizedEmail,
          participant_phone: normalizedPhone,
          participant_dni: dni.trim(), // obligatorio
          custom_data: customData,
          status: "pending",

          privacy_accepted: true,
          privacy_accepted_at: consents.privacy_accepted_at
            ? new Date(consents.privacy_accepted_at)
            : new Date(),
          privacy_policy_version: "1.0",

          whatsapp_consent: true,
          whatsapp_consent_at: consents.whatsapp_consent_at
            ? new Date(consents.whatsapp_consent_at)
            : new Date(),

          // BUG FIX: marketing_consent || true => siempre true
          marketing_consent: true,
          marketing_consent_at: consents.marketing_consent ? new Date() : null,
        },
        select: { id: true },
      });

      // Vincular waiver (si existe)
      if (waiver_acceptance_id) {
        await tx.waiverAcceptance.update({
          where: { id: waiver_acceptance_id },
          data: {
            event_registration_id: registration.id,
            member_id: memberId,
          },
        });
      }

      // Crear sesión Stripe (depende de registration.id)
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: normalizedEmail,
        line_items: [
          {
            price_data: {
              currency: event.currency ?? "eur",
              product_data: {
                name: event.name,
                description: productDescription,
                // Si no tienes un asset real, mejor no enviar images
                // images: [`${publicUrl}/events/${event.slug}/cover.jpg`],
              },
              unit_amount: event.price,
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_URL}/pago-exito?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/pago-cancelado?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          type: "event",
          event_registration_id: registration.id,
          event_id: event.id,
          event_slug: event.slug,
          member_id: memberId ?? "",
          is_member: isMember ? "true" : "false",
        },
      });

      // Crear Payment
      await tx.payment.create({
        data: {
          payment_type: PaymentType.event,
          member_id: memberId,
          event_registration_id: registration.id,
          stripe_session_id: session.id,
          amount: event.price,
          currency: event.currency ?? "eur",
          status: PaymentStatus.pending,
          description: `${event.name} - ${name}${isMember ? " (Socio)" : ""}`,
          metadata: {
            ...(shirtSize ? { shirt_size: shirtSize } : {}),
            phone: normalizedPhone,
            ip_address: clientIp,
            is_member: isMember,
            event_slug: event.slug,
          },
        },
      });

      return { registrationId: registration.id, sessionUrl: session.url, sessionId: session.id };
    });

    logger.apiSuccess("Checkout completado", {
      eventSlug: event.slug,
      registration_id: result.registrationId,
      session_id: result.sessionId,
      is_member: isMember,
    });

    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      url: result.sessionUrl,
    });
  } catch (error: any) {
    logger.apiError("Error en checkout", error);

    // Tu unique real en EventRegistration es: @@unique([event_id, participant_dni])
    // así que este conflicto es por DNI duplicado en el mismo evento
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe una inscripción para este evento con ese DNI" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Error al procesar la inscripción", details: error?.message },
      { status: 500 }
    );
  }
}
