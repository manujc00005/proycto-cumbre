// app/api/misa/checkout/route.ts - VERSIÓN CORREGIDA

import { NextRequest, NextResponse } from 'next/server';
import { PaymentStatus } from '@prisma/client';
import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';  // 👈 Usar singleton

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const body = await req.json();
    const { name, email, phone, shirtSize } = body;

    logger.log('💳 [MISA] Procesando checkout:', { name, email, phone, shirtSize });

    // Validaciones
    if (!name || !email || !phone || !shirtSize) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // 1. Buscar el evento MISA
    const misaEvent = await prisma.event.findUnique({
      where: { slug: 'misa-2026' }
    });

    if (!misaEvent || misaEvent.status !== 'published') {
      return NextResponse.json(
        { error: 'Evento no disponible' },
        { status: 404 }
      );
    }

    // 2. Verificar plazas disponibles
    if (misaEvent.max_participants && 
        misaEvent.current_participants >= misaEvent.max_participants) {
      return NextResponse.json(
        { error: 'No quedan plazas disponibles' },
        { status: 409 }
      );
    }

    // 3. Verificar si ya está registrado
    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        event_id: misaEvent.id,
        participant_email: email.toLowerCase(),
        status: 'confirmed'
      }
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Ya existe una reserva con este email' },
        { status: 409 }
      );
    }

    // 4. Crear el registro del evento (pendiente)
    const registration = await prisma.eventRegistration.create({
      data: {
        event_id: misaEvent.id,
        participant_name: name,
        participant_email: email.toLowerCase(),
        participant_phone: phone,
        custom_data: { shirt_size: shirtSize },
        status: 'pending'
      }
    });

    logger.log('✅ [MISA] Registro creado:', registration.id);

    // 5. Crear sesión de Stripe CON METADATA COMPLETO
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: misaEvent.name,
            description: `Plaza para ${name} - Camiseta talla ${shirtSize}`,
            images: [
              misaEvent.image_url 
                ? `${process.env.NEXT_PUBLIC_URL}${misaEvent.image_url}`
                : `${process.env.NEXT_PUBLIC_URL}/misa3.png`
            ]
          },
          unit_amount: misaEvent.price,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/misa/confirmacion?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/misa?canceled=true`,
      metadata: {
        // 👇 IMPORTANTE: Estos valores se usan en el webhook
        type: 'event',
        event_registration_id: registration.id,
        event_id: misaEvent.id,
        name: name,
        email: email,
        phone: phone,
        shirtSize: shirtSize,
      },
      customer_email: email,
    });

    logger.log('✅ [MISA] Sesión de Stripe creada:', session.id);

    // 6. Crear payment asociado al registro
    await prisma.payment.create({
      data: {
        payment_type: 'event',
        event_registration_id: registration.id,
        stripe_session_id: session.id,
        amount: misaEvent.price,
        currency: 'eur',
        status: 'pending' as PaymentStatus,
        description: `${misaEvent.name} - ${name}`,
        metadata: {
          event_slug: misaEvent.slug,
          participant_name: name,
          participant_email: email,
          participant_phone: phone,
          shirt_size: shirtSize,
        }
      }
    });

    logger.log('✅ [MISA] Payment creado en BD');

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    logger.error('❌ [MISA] Error en checkout:', error);
    
    return NextResponse.json(
      { error: error.message || 'Error al crear sesión de pago' },
      { status: 500 }
    );
  }
  // 👈 NO HAY finally con $disconnect()
}