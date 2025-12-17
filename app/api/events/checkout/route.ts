// ========================================
// API CHECKOUT CORREGIDO
// ✅ NO crea EventRegistration hasta pago exitoso
// ✅ Crea Payment pending con metadata
// ✅ Webhook completa el registro
// app/api/events/checkout/route.ts
// ========================================

import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { EventStatus, MembershipStatus, PaymentStatus, PaymentType } from "@prisma/client";
import { z } from "zod";

export const runtime = "nodejs";

const BodySchema = z.object({
  eventId: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  dni: z.string().min(5),
  shirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL"]).optional(),
  consents: z.object({
    privacy_accepted: z.boolean(),
    whatsapp_consent: z.boolean(),
    marketing_consent: z.boolean().optional(),
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
    const normalizedDni = dni.trim().toUpperCase();

    // Validación teléfono
    const phoneRegex = /^(\+?[1-9]\d{0,2})?\d{9}$/;
    if (!phoneRegex.test(normalizedPhone)) {
      return NextResponse.json(
        { error: "El teléfono debe tener 9 dígitos o un formato internacional válido" },
        { status: 400 }
      );
    }

    logger.apiStart("POST", "/api/events/checkout", { eventId, email: normalizedEmail });

    // ========================================
    // ✅ VALIDACIÓN RGPD
    // ========================================
    if (!consents.privacy_accepted) {
      return NextResponse.json(
        { error: "Debes aceptar la Política de Privacidad" },
        { status: 400 }
      );
    }
    if (!consents.whatsapp_consent) {
      return NextResponse.json(
        { error: "Debes aceptar compartir tus datos en WhatsApp" },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(request);

    // ========================================
    // 1) CARGAR EVENTO
    // ========================================
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

    if (event.status !== EventStatus.published && event.status !== EventStatus.draft) {
      return NextResponse.json(
        { error: "Este evento no está disponible para inscripciones" },
        { status: 400 }
      );
    }

    if (event.max_participants && event.current_participants >= event.max_participants) {
      return NextResponse.json(
        { error: "El evento está completo (plazas agotadas)" },
        { status: 400 }
      );
    }

    // ========================================
    // 2) VERIFICAR SI YA TIENE INSCRIPCIÓN
    // ========================================
    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        event_id: eventId,
        participant_dni: normalizedDni,
        status: { in: ['pending', 'confirmed'] }
      },
      select: { id: true, status: true }
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Ya existe una inscripción para este evento con ese DNI" },
        { status: 409 }
      );
    }

    // ========================================
    // 3) BUSCAR MIEMBRO
    // ========================================
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

    if (isMember) {
      logger.log("✅ Usuario es socio activo:", existingMember.member_number);
    }

    // ========================================
    // 4) PREPARAR METADATA
    // ========================================
    const customData: Record<string, any> = {};
    if (shirtSize) customData.shirt_size = shirtSize;
    if (custom_fields) Object.assign(customData, custom_fields);

    // ========================================
    // 5) CREAR SESIÓN STRIPE
    // ========================================
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
            },
            unit_amount: event.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${publicUrl}/pago-exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${publicUrl}/pago-cancelado?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        type: "event",
        event_id: eventId,
        event_slug: event.slug,
        member_id: memberId ?? "",
        is_member: isMember ? "true" : "false",
        
        // ✅ GUARDAR DATOS PARA EL WEBHOOK
        participant_name: name,
        participant_email: normalizedEmail,
        participant_phone: normalizedPhone,
        participant_dni: normalizedDni,
        shirt_size: shirtSize,
        custom_data: JSON.stringify(customData),
        
        // ✅ CONSENTIMIENTOS
        privacy_accepted: true,
        privacy_accepted_at: consents.privacy_accepted_at || new Date().toISOString(),
        whatsapp_consent: true,
        whatsapp_consent_at: consents.whatsapp_consent_at || new Date().toISOString(),
        marketing_consent: true,
        
        // ✅ WAIVER ACCEPTANCE ID
        waiver_acceptance_id: waiver_acceptance_id ?? "",
      },
    });

    logger.log("✅ Sesión de Stripe creada:", session.id);

    // ========================================
    // 6) CREAR PAYMENT PENDING
    // ========================================
    await prisma.payment.create({
      data: {
        payment_type: PaymentType.event,
        member_id: memberId,
        stripe_session_id: session.id,
        amount: event.price,
        currency: event.currency ?? "eur",
        status: PaymentStatus.pending,
        description: `${event.name} - ${name}${isMember ? " (Socio)" : ""}`,
        metadata: {
          event_id: eventId,
          event_slug: event.slug,
          participant_name: name,
          participant_email: normalizedEmail,
          participant_phone: normalizedPhone,
          participant_dni: normalizedDni,
          shirt_size: shirtSize,
          custom_data: customData,
          ip_address: clientIp,
          is_member: isMember,
          waiver_acceptance_id: waiver_acceptance_id,
          
          // ✅ Consentimientos en metadata
          privacy_accepted: true,
          privacy_accepted_at: consents.privacy_accepted_at || new Date().toISOString(),
          whatsapp_consent: true,
          whatsapp_consent_at: consents.whatsapp_consent_at || new Date().toISOString(),
          marketing_consent: true,
        },
      },
    });

    logger.log("✅ Payment creado (pending)");

    logger.apiSuccess("Checkout completado", {
      eventSlug: event.slug,
      session_id: session.id,
      is_member: isMember,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
    
  } catch (error: any) {
    logger.apiError("Error en checkout", error);

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
