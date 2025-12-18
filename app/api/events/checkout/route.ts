// ========================================
// API CHECKOUT EVENTOS - CON EMAILS TEST
// ✅ Envía emails inmediatamente para test users
// ✅ Usuarios normales esperan al webhook
// app/api/events/checkout/route.ts
// ========================================

import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { EventStatus, MembershipStatus, PaymentStatus, PaymentType, RegistrationStatus } from "@prisma/client";
import { z } from "zod";
import crypto from "crypto";
import { isTestUserEmail } from "../../helpers";
import { EmailService } from "@/lib/email-service";

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

// ========================================
// FUNCIÓN: Crear registro COMPLETO sin Stripe
// ========================================
async function createDirectRegistration(params: {
  event: any;
  memberId: string | null;
  isMember: boolean;
  name: string;
  email: string;
  phone: string;
  dni: string;
  shirtSize?: string;
  customData: Record<string, any>;
  consents: any;
  waiverAcceptanceId?: string;
  clientIp: string;
}) {
  const {
    event,
    memberId,
    isMember,
    name,
    email,
    phone,
    dni,
    shirtSize,
    customData,
    consents,
    waiverAcceptanceId,
    clientIp,
  } = params;

  const fakeSessionId = `test_${crypto.randomBytes(16).toString('hex')}`;
  const testAmount = parseInt(process.env.TEST_PAYMENT_AMOUNT || '500');

  logger.log('🧪 MODO TEST - Creando registro directo');
  logger.log(`   Email: ${email}`);
  logger.log(`   Evento: ${event.name}`);
  logger.log(`   Monto: ${testAmount / 100}€`);

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        payment_type: PaymentType.event,
        member_id: memberId,
        stripe_session_id: fakeSessionId,
        amount: testAmount,
        currency: event.currency ?? "eur",
        status: PaymentStatus.completed,
        description: `🧪 TEST - ${event.name} - ${name}${isMember ? " (Socio)" : ""}`,
        metadata: {
          event_id: event.id,
          event_slug: event.slug,
          participant_name: name,
          participant_email: email,
          participant_phone: phone,
          participant_dni: dni,
          shirt_size: shirtSize,
          custom_data: customData,
          ip_address: clientIp,
          is_member: isMember,
          waiver_acceptance_id: waiverAcceptanceId,
          is_test_payment: true,
          
          privacy_accepted: true,
          privacy_accepted_at: consents.privacy_accepted_at || new Date().toISOString(),
          whatsapp_consent: true,
          whatsapp_consent_at: consents.whatsapp_consent_at || new Date().toISOString(),
          marketing_consent: consents.marketing_consent || false,
        },
      },
    });

    const registration = await tx.eventRegistration.create({
      data: {
        event_id: event.id,
        member_id: memberId,
        participant_name: name,
        participant_email: email,
        participant_phone: phone,
        participant_dni: dni,
        shirt_size: shirtSize,
        status: RegistrationStatus.confirmed,
        
        privacy_accepted: true,
        privacy_accepted_at: new Date(consents.privacy_accepted_at || new Date()),
        whatsapp_consent: true,
        whatsapp_consent_at: new Date(consents.whatsapp_consent_at || new Date()),
        marketing_consent: consents.marketing_consent || false,
        
        custom_data: customData,
        ip_address: clientIp,
      },
    });

    await tx.payment.update({
      where: { id: payment.id },
      data: { event_registration_id: registration.id },
    });

    if (waiverAcceptanceId) {
      await tx.waiverAcceptance.update({
        where: { id: waiverAcceptanceId },
        data: { 
          event_registration_id: registration.id,
          member_id: memberId,
        },
      });
    }

    await tx.event.update({
      where: { id: event.id },
      data: { current_participants: { increment: 1 } },
    });

    return { payment, registration };
  });

  logger.log('✅ Registro directo completado');
  logger.log('   Payment ID:', result.payment.id);
  logger.log('   Registration ID:', result.registration.id);

  // ========================================
  // 📧 ENVIAR EMAIL INMEDIATAMENTE (TEST USER)
  // ========================================
  try {
    logger.log('📧 Enviando email de confirmación (test user)...');
    
    // Detectar evento específico
    if (event.slug === 'misa') {
      await EmailService.sendMisaConfirmation({
        email: email,
        name: name,
        phone: phone,
        shirtSize: shirtSize || 'N/A',
        amount: testAmount,
      });
    } else {
      // Email genérico para otros eventos
      logger.log(`⚠️ [TEST] Email genérico no implementado para: ${event.slug}`);
      // TODO: await EmailService.sendEventConfirmation(...)
    }
    
    logger.log('✅ Email enviado correctamente');
  } catch (emailError: any) {
    // No es crítico, pero logueamos el error
    logger.error('[TEST] Error enviando email:', emailError.message);
  }

  return result;
}

// ========================================
// HANDLER PRINCIPAL
// ========================================
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

    const phoneRegex = /^(\+?[1-9]\d{0,2})?\d{9}$/;
    if (!phoneRegex.test(normalizedPhone)) {
      return NextResponse.json(
        { error: "El teléfono debe tener 9 dígitos o un formato internacional válido" },
        { status: 400 }
      );
    }

    logger.apiStart("POST", "/api/events/checkout", { eventId, email: normalizedEmail });

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

    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        event_id: eventId,
        participant_dni: normalizedDni,
        status: { in: [RegistrationStatus.pending, RegistrationStatus.confirmed] }
      },
      select: { id: true, status: true }
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Ya existe una inscripción para este evento con ese DNI" },
        { status: 409 }
      );
    }

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

    const customData: Record<string, any> = {};
    if (shirtSize) customData.shirt_size = shirtSize;
    if (custom_fields) Object.assign(customData, custom_fields);

    const isTestUser = isTestUserEmail(normalizedEmail);

    if (isTestUser) {
      const result = await createDirectRegistration({
        event,
        memberId,
        isMember,
        name,
        email: normalizedEmail,
        phone: normalizedPhone,
        dni: normalizedDni,
        shirtSize,
        customData,
        consents,
        waiverAcceptanceId: waiver_acceptance_id,
        clientIp,
      });

      logger.apiSuccess("Checkout TEST completado", {
        eventSlug: event.slug,
        payment_id: result.payment.id,
        registration_id: result.registration.id,
        email_sent: true,
      });

      const publicUrl = process.env.NEXT_PUBLIC_URL;
      return NextResponse.json({
        success: true,
        isTest: true,
        sessionId: result.payment.stripe_session_id,
        url: `${publicUrl}/pago-exito?session_id=${result.payment.stripe_session_id}`,
        registration: {
          id: result.registration.id,
          status: result.registration.status,
        },
        payment: {
          id: result.payment.id,
          status: result.payment.status,
          amount: result.payment.amount,
        },
      });
    }

    // ========================================
    // 💳 FLUJO NORMAL: Con Stripe
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

    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment', // ✅ OBLIGATORIO
        payment_method_types: ["card"],
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
          
          participant_name: name,
          participant_email: normalizedEmail,
          participant_phone: normalizedPhone,
          participant_dni: normalizedDni,
          shirt_size: shirtSize ?? "",
          custom_data: JSON.stringify(customData),
          
          privacy_accepted: "true",
          privacy_accepted_at: consents.privacy_accepted_at || new Date().toISOString(),
          whatsapp_consent: "true",
          whatsapp_consent_at: consents.whatsapp_consent_at || new Date().toISOString(),
          marketing_consent: "true",
          
          waiver_acceptance_id: waiver_acceptance_id ?? "",
        },
      },
      { apiVersion: "2023-10-16" }
    );

    logger.log("✅ Sesión de Stripe creada:", session.id);

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
      isTest: false,
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
