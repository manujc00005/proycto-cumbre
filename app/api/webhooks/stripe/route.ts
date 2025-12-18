// ========================================
// WEBHOOK STRIPE - 100% GENÉRICO
// Procesa: membership, event, shop
// app/api/webhooks/stripe/route.ts
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { MembershipStatus, PaymentStatus } from '@prisma/client';
import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { EmailService } from '@/lib/email-service';
import { prisma } from '@/lib/prisma';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    logger.apiError('Webhook signature verification failed', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  logger.stripe(`Webhook recibido: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // ========================================
        // DETECTAR TIPO Y PROCESAR
        // ========================================
        const paymentType = session.metadata?.type || 'membership';

        logger.stripe('Pago completado', {
          sessionId: session.id,
          type: paymentType,
          amount: session.amount_total
        });

        // ✅ ROUTER GENÉRICO
        await processPayment(session, paymentType);

        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.stripe('PaymentIntent succeeded', paymentIntent.id);
        
        if (paymentIntent.id) {
          await prisma.payment.updateMany({
            where: { stripe_payment_id: paymentIntent.id },
            data: { 
              status: PaymentStatus.completed,
              updated_at: new Date()
            }
          });
        }
        
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.apiError('PaymentIntent failed', paymentIntent.id);
        
        if (paymentIntent.id) {
          await prisma.payment.updateMany({
            where: { stripe_payment_id: paymentIntent.id },
            data: { 
              status: PaymentStatus.failed,
              updated_at: new Date()
            }
          });
        }

        // Si es membership, actualizar member
        const memberId = paymentIntent.metadata?.memberId;
        if (memberId) {
          await prisma.member.update({
            where: { id: memberId },
            data: { 
              membership_status: MembershipStatus.failed,
              admin_notes: `Pago fallido el ${new Date().toISOString()}`,
              updated_at: new Date()
            }
          }).catch(err => {
            logger.apiError('Error actualizando member a failed', err);
          });
        }
        
        break;
      }

      case 'charge.succeeded':
      case 'charge.updated':
      case 'payment_intent.created':
      case 'payment_intent.processing':
      case 'charge.pending':
        logger.log(`ℹ️ Evento informativo: ${event.type}`);
        break;

      default:
        logger.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
    
  } catch (error: any) {
    logger.apiError('Error processing webhook', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ========================================
// PROCESADOR GENÉRICO DE PAGOS
// ========================================
async function processPayment(
  session: Stripe.Checkout.Session,
  paymentType: string,
  maxRetries = 3
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.log(`🔄 [${paymentType.toUpperCase()}] Intento ${attempt}/${maxRetries}`);

      switch (paymentType) {
        case 'membership':
          await processMembershipPayment(session);
          break;
        
        case 'event':
          await processEventPayment(session);
          break;
        
        case 'shop':
          await processShopPayment(session);
          break;
        
        default:
          throw new Error(`Tipo de pago desconocido: ${paymentType}`);
      }

      logger.log(`✅ [${paymentType.toUpperCase()}] Pago procesado exitosamente`);
      return;
      
    } catch (error: any) {
      logger.apiError(`[${paymentType.toUpperCase()}] Error en intento ${attempt}`, error.message);
      
      if (attempt === maxRetries) {
        logger.error(`❌ [${paymentType.toUpperCase()}] Máximo de reintentos alcanzado`);
        throw error;
      }
      
      // Backoff exponencial
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// ========================================
// MEMBERSHIP
// ========================================
async function processMembershipPayment(session: Stripe.Checkout.Session) {
  const memberId = session.metadata?.memberId;
  
  if (!memberId) {
    throw new Error('Falta memberId en metadata');
  }

  logger.log('🧑‍🤝‍🧑 [MEMBERSHIP] Procesando pago', { memberId });

  // 1. Buscar payment
  const payment = await prisma.payment.findUnique({
    where: { stripe_session_id: session.id }
  });

  if (!payment) {
    throw new Error('Payment not found');
  }

  // 2. Actualizar member a active
  const now = new Date();
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(now.getFullYear() + 1);

  const updatedMember = await prisma.member.update({
    where: { id: memberId },
    data: {
      membership_status: MembershipStatus.active,
      membership_start_date: now,
      membership_end_date: oneYearFromNow,
      admin_notes: `Pago completado el ${now.toISOString()}. Session: ${session.id}`,
      updated_at: now,
    },
  });

  logger.log('✅ [MEMBERSHIP] Member actualizado a active');

  // 3. Actualizar payment a completed
  await prisma.payment.update({
    where: { id: payment.id },
    data: { 
      status: PaymentStatus.completed,
      stripe_payment_id: session.payment_intent as string || payment.stripe_payment_id,
      updated_at: new Date()
    }
  });

  logger.log('✅ [MEMBERSHIP] Payment actualizado');

  // 4. Enviar email
  try {
    await EmailService.sendWelcomeWithPaymentStatus({
      email: updatedMember.email,
      firstName: updatedMember.first_name,
      lastName: updatedMember.last_name,
      memberNumber: updatedMember.member_number || 'none' ,
      licenseType: updatedMember.license_type || 'none',
      paymentStatus: 'success',
      amount: session.amount_total || 0,
      currency: session.currency || 'eur',
    });
    
    logger.log('✅ [MEMBERSHIP] Email enviado');
  } catch (emailError: any) {
    logger.apiError('[MEMBERSHIP] Error enviando email (no crítico)', emailError.message);
  }
}

// ========================================
// EVENT
// ========================================
async function processEventPayment(session: Stripe.Checkout.Session) {
  const eventId = session.metadata?.event_id;
  const participantName = session.metadata?.participant_name;
  const participantEmail = session.metadata?.participant_email;
  const participantPhone = session.metadata?.participant_phone;
  const participantDni = session.metadata?.participant_dni;
  
  if (!eventId || !participantName || !participantEmail || !participantPhone || !participantDni) {
    throw new Error('EVENT metadata incompleta');
  }

  logger.log('🎉 [EVENT] Procesando pago', { eventId, participantName });

  // 1. Parsear custom_data
  let customData: Record<string, any> = {};
  const customDataStr = session.metadata?.custom_data;
  if (customDataStr && customDataStr !== '{}') {
    try {
      customData = JSON.parse(customDataStr);
    } catch (e) {
      logger.error('[EVENT] Error parseando custom_data');
    }
  }

  if (session.metadata?.shirt_size) {
    customData.shirt_size = session.metadata.shirt_size;
  }

  // 2. TRANSACCIÓN: Payment + EventRegistration + WaiverAcceptance
  await prisma.$transaction(async (tx) => {
    // A) Actualizar Payment a completed
    const payment = await tx.payment.update({
      where: { stripe_session_id: session.id },
      data: {
        status: PaymentStatus.completed,
        stripe_payment_id: session.payment_intent as string || null,
        updated_at: new Date(),
      },
      select: { id: true }
    });

    logger.log('✅ [EVENT] Payment actualizado');

    // B) Crear EventRegistration
    const registration = await tx.eventRegistration.create({
      data: {
        event_id: eventId,
        member_id: session.metadata?.member_id || null,
        participant_name: participantName,
        participant_email: participantEmail,
        participant_phone: participantPhone,
        participant_dni: participantDni,
        custom_data: customData,
        status: 'confirmed',
        
        // RGPD desde metadata
        privacy_accepted: session.metadata?.privacy_accepted === 'true',
        privacy_accepted_at: session.metadata?.privacy_accepted_at 
          ? new Date(session.metadata.privacy_accepted_at)
          : new Date(),
        privacy_policy_version: '1.0',
        
        whatsapp_consent: session.metadata?.whatsapp_consent === 'true',
        whatsapp_consent_at: session.metadata?.whatsapp_consent_at
          ? new Date(session.metadata.whatsapp_consent_at)
          : new Date(),
        
        marketing_consent: true,
        marketing_consent_at: session.metadata?.marketing_consent === 'true'
          ? new Date()
          : null,
      },
      select: { id: true, event: { select: { name: true, slug: true } } }
    });

    logger.log('✅ [EVENT] EventRegistration creado');

    // C) Vincular Payment a Registration
    await tx.payment.update({
      where: { id: payment.id },
      data: { event_registration_id: registration.id },
    });

    // D) Vincular WaiverAcceptance si existe
    const waiverAcceptanceId = session.metadata?.waiver_acceptance_id;
    if (waiverAcceptanceId && waiverAcceptanceId !== '') {
      await tx.waiverAcceptance.update({
        where: { id: waiverAcceptanceId },
        data: {
          event_registration_id: registration.id,
          member_id: session.metadata?.member_id || null,
        },
      });

      logger.log('✅ [EVENT] WaiverAcceptance vinculado');
    }

    // E) Incrementar current_participants
    await tx.event.update({
      where: { id: eventId },
      data: { current_participants: { increment: 1 } },
    });

    logger.log('✅ [EVENT] current_participants incrementado');

    // F) Enviar email (dentro de transacción para tener eventSlug)
    try {
      const eventSlug = registration.event.slug;
      const shirtSize = customData.shirt_size || 'N/A';
      
      // TODO: Crear EmailService.sendEventConfirmation genérico
      // Por ahora, detectar evento específico
      if (eventSlug === 'misa') {
        await EmailService.sendMisaConfirmation({
          email: participantEmail,
          name: participantName,
          phone: participantPhone,
          shirtSize: shirtSize,
          amount: session.amount_total || 0,
        });
      } else {
        // Email genérico para otros eventos
        logger.log(`⚠️ [EVENT] Email genérico no implementado para: ${eventSlug}`);
        // TODO: await EmailService.sendEventConfirmation(...)
      }
      
      logger.log('✅ [EVENT] Email enviado');
    } catch (emailError: any) {
      logger.apiError('[EVENT] Error enviando email (no crítico)', emailError.message);
    }
  });
}

// ========================================
// SHOP (preparado para futuro)
// ========================================
async function processShopPayment(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id;
  
  if (!orderId) {
    throw new Error('Falta order_id en metadata');
  }

  logger.log('🛒 [SHOP] Procesando pago', { orderId });

  // TODO: Implementar cuando tengas modelo de Shop/Order
  // 1. Actualizar Payment
  // 2. Actualizar Order status
  // 3. Enviar email
  
  logger.log('⚠️ [SHOP] Implementación pendiente');
  throw new Error('Shop payment not implemented yet');
}