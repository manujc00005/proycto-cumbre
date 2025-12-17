// ========================================
// API ENDPOINT: CHECKOUT GENÉRICO PARA EVENTOS
// app/api/events/checkout/route.ts
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { EventStatus } from '@prisma/client';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      eventId,           // UUID del evento
      name, 
      email, 
      phone, 
      dni, 
      shirtSize,         // Opcional según evento
      consents, 
      waiver_acceptance_id 
    } = body;

    logger.apiStart('POST', '/api/events/checkout', { eventId, email });

    // ========================================
    // VALIDACIONES BÁSICAS
    // ========================================
    
    if (!eventId || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios (eventId, name, email, phone)' },
        { status: 400 }
      );
    }

    // Validar consentimientos RGPD
    if (!consents?.privacy_accepted) {
      return NextResponse.json(
        { error: 'Debes aceptar la Política de Privacidad' },
        { status: 400 }
      );
    }

    if (!consents?.whatsapp_consent) {
      return NextResponse.json(
        { error: 'Debes aceptar compartir tus datos en WhatsApp para participar' },
        { status: 400 }
      );
    }

    // Validar formato de email
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Validar teléfono
    const normalizedPhone = phone.replace(/\s/g, '');
    const phoneRegex = /^(\+?[1-9]\d{0,2})?\d{9}$/;

    if (!phoneRegex.test(normalizedPhone)) {
      return NextResponse.json(
        { error: 'El teléfono debe tener 9 dígitos o un formato internacional válido' },
        { status: 400 }
      );
    }

    // ========================================
    // BUSCAR EVENTO POR UUID
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
      }
    });

    if (!event) {
      return NextResponse.json(
        { error: `Evento no encontrado: ${eventId}` },
        { status: 404 }
      );
    }

    // Verificar que el evento esté activo
    if (event.status !== EventStatus.published && event.status !== EventStatus.draft) {
      return NextResponse.json(
        { error: "Este evento no está disponible para inscripciones" },
        { status: 400 }
      );
    }

    // Verificar disponibilidad
    if (event.max_participants && 
        event.current_participants >= event.max_participants) {
      return NextResponse.json(
        { error: 'El evento está completo (plazas agotadas)' },
        { status: 400 }
      );
    }

    // ========================================
    // BUSCAR SI ES MIEMBRO EXISTENTE
    // ========================================
    
    const existingMember = await prisma.member.findUnique({
      where: { email: email.toLowerCase() },
      select: { 
        id: true, 
        member_number: true,
        membership_status: true,
        first_name: true,
        last_name: true
      }
    });

    const memberId = existingMember?.id || null;
    const isMember = !!existingMember && existingMember.membership_status === 'active';

    if (isMember) {
      logger.log('✅ Usuario es socio activo:', {
        member_number: existingMember.member_number,
        name: `${existingMember.first_name} ${existingMember.last_name}`
      });
    }

    // ========================================
    // OBTENER IP DEL CLIENTE
    // ========================================
    
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // ========================================
    // PREPARAR CUSTOM DATA (FLEXIBLE)
    // ========================================
    
    const customData: Record<string, any> = {};
    
    if (shirtSize) {
      customData.shirt_size = shirtSize;
      
      // Validar talla si se proporciona
      const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      if (!validSizes.includes(shirtSize)) {
        return NextResponse.json(
          { error: 'Talla inválida' },
          { status: 400 }
        );
      }
    }

    // Añadir otros campos custom según sea necesario
    if (body.custom_fields) {
      Object.assign(customData, body.custom_fields);
    }

    // ========================================
    // CREAR INSCRIPCIÓN
    // ========================================
    
    const registration = await prisma.eventRegistration.create({
      data: {
        event_id: event.id,
        member_id: memberId,
        participant_name: name,
        participant_email: email.toLowerCase(),
        participant_phone: phone,
        participant_dni: dni || null,
        custom_data: customData,
        status: 'pending',
        
        // CAMPOS RGPD
        privacy_accepted: consents.privacy_accepted,
        privacy_accepted_at: new Date(consents.privacy_accepted_at || new Date()),
        privacy_policy_version: "1.0",
        whatsapp_consent: consents.whatsapp_consent,
        whatsapp_consent_at: new Date(consents.whatsapp_consent_at || new Date()),
        marketing_consent: consents.marketing_consent || false,
        marketing_consent_at: consents.marketing_consent ? new Date() : null,
      }
    });

    logger.log('✅ Inscripción creada:', {
      id: registration.id,
      eventSlug: event.slug,
      email: registration.participant_email,
      member_id: memberId,
      is_member: isMember,
    });

    // ========================================
    // VINCULAR ACEPTACIÓN DEL PLIEGO
    // ========================================
    
    if (waiver_acceptance_id) {
      await prisma.waiverAcceptance.update({
        where: { id: waiver_acceptance_id },
        data: {
          event_registration_id: registration.id,
          member_id: memberId
        }
      });
      
      logger.log('🔗 Pliego vinculado a inscripción:', {
        waiverAcceptanceId: waiver_acceptance_id,
        registrationId: registration.id
      });
    }

    // ========================================
    // CREAR SESIÓN DE STRIPE
    // ========================================
    
    const stripe = getStripe();
    
    // Construir descripción con datos relevantes
    let productDescription = `Inscripción para ${name}`;
    if (shirtSize) productDescription += ` - Talla: ${shirtSize}`;
    if (isMember) productDescription += ' (Socio)';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: event.currency || 'eur',
            product_data: {
              name: event.name,
              description: productDescription,
              images: [`${process.env.NEXT_PUBLIC_URL}/events/${event.slug}/cover.jpg`],
            },
            unit_amount: event.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/pago-exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pago-cancelado?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: email,
      metadata: {
        type: 'event',
        event_registration_id: registration.id,
        event_id: event.id,
        event_slug: event.slug,
        member_id: memberId || '',
        is_member: isMember ? 'true' : 'false',
        name,
        email,
        phone,
        ...(shirtSize && { shirtSize }),
        privacy_accepted: 'true',
        whatsapp_consent: 'true',
      },
    });

    logger.log('✅ Sesión de Stripe creada:', {
      sessionId: session.id,
      eventSlug: event.slug,
      amount: event.price,
    });

    // ========================================
    // CREAR PAYMENT
    // ========================================
    
    await prisma.payment.create({
      data: {
        payment_type: 'event',
        member_id: memberId,
        event_registration_id: registration.id,
        stripe_session_id: session.id,
        amount: event.price,
        currency: event.currency || 'eur',
        status: 'pending',
        description: `${event.name} - ${name}${isMember ? ' (Socio)' : ''}`,
        metadata: {
          ...(shirtSize && { shirt_size: shirtSize }),
          phone,
          ip_address: clientIp,
          is_member: isMember,
          event_slug: event.slug,
        },
      },
    });

    logger.apiSuccess('Checkout completado', {
      eventSlug: event.slug,
      registration_id: registration.id,
      session_id: session.id,
      is_member: isMember,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    logger.apiError('Error en checkout', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe una inscripción con este email para este evento' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al procesar la inscripción', details: error.message },
      { status: 500 }
    );
  }
}
