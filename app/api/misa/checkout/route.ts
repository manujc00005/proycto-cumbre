// app/api/misa/checkout/route.ts - VERSIÓN CON SINGLETON Y RGPD

import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma'; // 👈 Usar singleton

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, shirtSize, consents } = body;

    logger.apiStart('POST', '/api/misa/checkout', { email, shirtSize });

    // Validaciones
    if (!name || !email || !phone || !shirtSize) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    // 🆕 Validar consentimiento de privacidad (obligatorio)
    // if (!consents?.privacy_accepted) {
    //   return NextResponse.json(
    //     { error: 'Debes aceptar la Política de Privacidad' },
    //     { status: 400 }
    //   );
    // }

    // Validar formato de email
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Validar teléfono (9 dígitos)
    const normalizedPhone = phone.replace(/\s/g, '');
    const phoneRegex = /^(\+?[1-9]\d{0,2})?\d{9}$/;

    if (!phoneRegex.test(normalizedPhone)) {
      return NextResponse.json(
        { error: 'El teléfono debe tener 9 dígitos o un formato internacional válido (+XX...)' },
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

    // Buscar evento MISA
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

    // 🆕 Obtener IP del cliente
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Crear inscripción con campos RGPD
    const registration = await prisma.eventRegistration.create({
      data: {
        event_id: misaEvent.id,
        participant_name: name,
        participant_email: email.toLowerCase(),
        participant_phone: phone,
        custom_data: { shirt_size: shirtSize },
        status: 'pending',
        
        // 🆕 CAMPOS RGPD
        privacy_accepted: consents.privacy_accepted,
        privacy_accepted_at: new Date(),
        whatsapp_consent: consents.whatsapp_consent || false,
        whatsapp_consent_at: consents.whatsapp_consent ? new Date() : null,
      }
    });

    logger.log('✅ Inscripción creada:', {
      id: registration.id,
      email: registration.participant_email,
      privacy_accepted: registration.privacy_accepted,
      whatsapp_consent: registration.whatsapp_consent,
    });

    // Crear sesión de Stripe
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'MISA - Ritual Furtivo',
              description: `Inscripción para ${name} - Talla: ${shirtSize}`,
              images: ['https://proyecto-cumbre.es/misa-cover.jpg'], // Opcional
            },
            unit_amount: misaEvent.price, // Ya está en centavos
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
        name,
        email,
        phone,
        shirtSize,
        privacy_accepted: consents.privacy_accepted ? 'true' : 'false',
        whatsapp_consent: consents.whatsapp_consent ? 'true' : 'false',
      },
    });

    logger.log('✅ Sesión de Stripe creada:', session.id);

    // Crear payment
    await prisma.payment.create({
      data: {
        payment_type: 'event',
        event_registration_id: registration.id,
        stripe_session_id: session.id,
        amount: misaEvent.price,
        currency: 'eur',
        status: 'pending',
        description: `MISA 2026 - ${name}`,
        metadata: {
          shirt_size: shirtSize,
          phone,
          ip_address: clientIp,
        },
      },
    });

    logger.apiSuccess('Checkout MISA completado', {
      registration_id: registration.id,
      session_id: session.id,
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