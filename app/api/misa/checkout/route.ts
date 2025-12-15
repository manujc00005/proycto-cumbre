// app/api/misa/checkout/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, dni, shirtSize, consents, waiver_acceptance_id } = body; // 🆕 Añadir dni y waiver_acceptance_id


    logger.apiStart('POST', '/api/misa/checkout', { email, shirtSize });

    // ========================================
    // VALIDACIONES
    // ========================================
    
    if (!name || !email || !phone || !shirtSize) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
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

    // Validar talla
    const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    if (!validSizes.includes(shirtSize)) {
      return NextResponse.json(
        { error: 'Talla inválida' },
        { status: 400 }
      );
    }

    // ========================================
    // BUSCAR EVENTO MISA
    // ========================================
    
    const misaEvent = await prisma.event.findUnique({
      where: { slug: 'misa-2026' }
    });

    if (!misaEvent) {
      return NextResponse.json(
        { error: 'Evento MISA no encontrado' },
        { status: 404 }
      );
    }

    // Verificar disponibilidad
    if (misaEvent.max_participants && 
        misaEvent.current_participants >= misaEvent.max_participants) {
      return NextResponse.json(
        { error: 'El evento está agotado' },
        { status: 400 }
      );
    }

    // ========================================
    // 🆕 BUSCAR SI ES MIEMBRO EXISTENTE
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
    // CREAR INSCRIPCIÓN
    // ========================================
    
    const registration = await prisma.eventRegistration.create({
      data: {
        event_id: misaEvent.id,
        member_id: memberId, // 🆕 Vincular si es miembro
        participant_name: name,
        participant_email: email.toLowerCase(),
        participant_phone: phone,
        custom_data: { shirt_size: shirtSize },
        status: 'pending',
        
        // CAMPOS RGPD
        privacy_accepted: consents.privacy_accepted,
        privacy_accepted_at: new Date(),
        privacy_policy_version: "1.0",
        whatsapp_consent: consents.whatsapp_consent,
        whatsapp_consent_at: new Date(),
        marketing_consent: true,
        marketing_consent_at: new Date(),
        marketing_revoked_at: null,
      }
    });

    logger.log('✅ Inscripción creada:', {
      id: registration.id,
      email: registration.participant_email,
      member_id: memberId,
      is_member: isMember,
      privacy_accepted: registration.privacy_accepted,
      whatsapp_consent: registration.whatsapp_consent,
    });

    // 🆕 VINCULAR ACEPTACIÓN DEL PLIEGO (si existe)
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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'MISA - Ritual Furtivo',
              description: `Inscripción para ${name} - Talla: ${shirtSize}${isMember ? ' (Socio)' : ''}`,
              images: ['https://proyecto-cumbre.es/misa-cover.jpg'],
            },
            unit_amount: misaEvent.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/misa/confirmacion?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/misa?cancelled=true`,
      customer_email: email,
      metadata: {
        type: 'event',
        event_registration_id: registration.id,
        event_id: misaEvent.id,
        member_id: memberId || '',
        is_member: isMember ? 'true' : 'false',
        name,
        email,
        phone,
        shirtSize,
        privacy_accepted: 'true',
        whatsapp_consent: 'true',
      },
    });

    logger.log('✅ Sesión de Stripe creada:', session.id);

    // ========================================
    // CREAR PAYMENT
    // ========================================
    
    await prisma.payment.create({
      data: {
        payment_type: 'event',
        member_id: memberId, // 🆕 Vincular si es miembro
        event_registration_id: registration.id,
        stripe_session_id: session.id,
        amount: misaEvent.price,
        currency: 'eur',
        status: 'pending',
        description: `MISA 2026 - ${name}${isMember ? ' (Socio)' : ''}`,
        metadata: {
          shirt_size: shirtSize,
          phone,
          ip_address: clientIp,
          is_member: isMember,
        },
      },
    });

    logger.apiSuccess('Checkout MISA completado', {
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
    logger.apiError('Error en checkout MISA', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe una inscripción con este email' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al procesar la inscripción', details: error.message },
      { status: 500 }
    );
  }
}
