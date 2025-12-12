// app/api/webhooks/stripe/route.ts - VERSIÓN CON EVENTOS INFORMATIVOS COMPLETOS

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
        
        logger.stripe('Pago completado', {
          sessionId: session.id,
          type: session.metadata?.type || 'member',
          memberId: session.metadata?.memberId,
          amount: session.amount_total
        });

        // 🎯 DETECTAR TIPO DE PAGO
        const paymentType = session.metadata?.type || 'membership';

        if (paymentType === 'event' || paymentType === 'misa') {
          // ✅ Procesar pago de MISA
          await processMisaPayment(session);
        } else {
          // ✅ Procesar pago de membresía
          const memberId = session.metadata?.memberId;

          if (!memberId) {
            logger.apiError('No se encontró memberId en metadatos');
            return NextResponse.json({ error: 'No memberId found' }, { status: 400 });
          }

          await processCompletedPayment(session, memberId);
        }

        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.stripe('PaymentIntent succeeded', paymentIntent.id);
        
        if (paymentIntent.id) {
          await prisma.payment.updateMany({
            where: { stripe_payment_id: paymentIntent.id },
            data: { 
              status: 'completed' as PaymentStatus,
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
          // Actualizar payment a failed
          await prisma.payment.updateMany({
            where: { stripe_payment_id: paymentIntent.id },
            data: { 
              status: 'failed' as PaymentStatus,
              updated_at: new Date()
            }
          });
        }

        // Si es un pago de member, actualizar el member también
        const memberId = paymentIntent.metadata?.memberId;
        if (memberId) {
          await prisma.member.update({
            where: { id: memberId },
            data: { 
              membership_status: 'failed' as MembershipStatus,
              admin_notes: `Pago fallido el ${new Date().toISOString()}`,
              updated_at: new Date()
            }
          }).catch(err => {
            logger.apiError('Error actualizando member a failed', err);
          });
        }
        
        break;
      }

      // 🆕 Eventos informativos que se ignoran (NO son errores)
      case 'charge.succeeded':
      case 'charge.updated':
      case 'payment_intent.created':        // 🆕 AÑADIDO
      case 'payment_intent.processing':     // 🆕 AÑADIDO (por si acaso)
      case 'charge.pending':                // 🆕 AÑADIDO (por si acaso)
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
// 🎯 PROCESAR PAGO DE MISA
// ========================================
async function processMisaPayment(
  session: Stripe.Checkout.Session,
  maxRetries = 3
) {
  const eventRegistrationId = session.metadata?.event_registration_id;
  
  logger.log('🎉 [MISA] Iniciando procesamiento de pago', {
    sessionId: session.id,
    eventRegistrationId: eventRegistrationId,
    metadata: session.metadata
  });

  // Validar que existe el event_registration_id
  if (!eventRegistrationId) {
    logger.apiError('[MISA] Falta event_registration_id en metadata', session.metadata);
    throw new Error('MISA metadata incompleta: falta event_registration_id');
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.log(`🔄 [MISA] Procesando - Intento ${attempt} de ${maxRetries}`);

      // 1. Buscar el payment existente
      const payment = await prisma.payment.findUnique({
        where: { stripe_session_id: session.id },
        include: {
          eventRegistration: {
            include: {
              event: true
            }
          }
        }
      });

      if (!payment) {
        logger.apiError('[MISA] Payment no encontrado en BD', session.id);
        throw new Error('Payment not found');
      }

      if (!payment.eventRegistration) {
        logger.apiError('[MISA] EventRegistration no encontrado', payment.id);
        throw new Error('EventRegistration not found');
      }

      logger.db('[MISA] Payment encontrado', {
        id: payment.id,
        currentStatus: payment.status,
        registrationId: payment.eventRegistration.id,
        eventName: payment.eventRegistration.event.name
      });

      // 2. Actualizar payment a completed
      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: { 
          stripe_payment_id: session.payment_intent as string,
          status: 'completed' as PaymentStatus,
          updated_at: new Date()
        }
      });

      logger.apiSuccess('[MISA] Payment actualizado a completed', {
        id: updatedPayment.id,
        status: updatedPayment.status
      });

      // 3. Actualizar el event_registration a confirmed
      await prisma.eventRegistration.update({
        where: { id: payment.eventRegistration.id },
        data: {
          status: 'confirmed',
          updated_at: new Date()
        }
      });

      logger.apiSuccess('[MISA] EventRegistration actualizado a confirmed');

      // 4. Incrementar contador de participantes del evento
      await prisma.event.update({
        where: { id: payment.eventRegistration.event.id },
        data: {
          current_participants: {
            increment: 1
          }
        }
      });

      logger.apiSuccess('[MISA] Contador de participantes incrementado');

      // 5. Enviar email de confirmación
      try {
        const reg = payment.eventRegistration;
        const shirtSize = (reg.custom_data as any)?.shirt_size || 'N/A';
        
        await EmailService.sendMisaConfirmation({
          email: reg.participant_email,
          name: reg.participant_name,
          phone: reg.participant_phone,
          shirtSize: shirtSize,
          amount: updatedPayment.amount,
        });
        
        logger.apiSuccess('[MISA] Email de confirmación enviado', { 
          email: reg.participant_email 
        });
      } catch (emailError: any) {
        // ⚠️ NO fallar el webhook si falla el email
        logger.apiError('[MISA] Error enviando email (no crítico)', {
          error: emailError.message,
          email: payment.eventRegistration.participant_email
        });
        
        // Registrar el fallo en la descripción del payment
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            description: `${payment.description}\n[ERROR EMAIL] No enviado: ${emailError.message}`,
            updated_at: new Date()
          }
        }).catch(err => logger.error('[MISA] Error actualizando descripción', err));
      }

      logger.log('✅ [MISA] Pago procesado exitosamente');
      return; // ✅ Éxito
      
    } catch (error: any) {
      logger.apiError(`[MISA] Error en intento ${attempt}`, {
        error: error.message,
        sessionId: session.id
      });
      
      if (attempt === maxRetries) {
        logger.error('❌ [MISA] Máximo de reintentos alcanzado');
        
        // Registrar fallo crítico
        try {
          await prisma.payment.updateMany({
            where: { stripe_session_id: session.id },
            data: {
              description: `ERROR CRÍTICO: No se pudo procesar el pago después de ${maxRetries} intentos`,
              updated_at: new Date()
            }
          });
        } catch (dbError) {
          logger.error('[MISA] Error registrando fallo en BD', dbError);
        }
        
        throw error;
      }
      
      // Esperar antes del siguiente intento (backoff exponencial)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// ========================================
// 🧑‍🤝‍🧑 PROCESAR PAGO DE MEMBRESÍA
// ========================================
async function processCompletedPayment(
  session: Stripe.Checkout.Session, 
  memberId: string,
  maxRetries = 3
) {
  logger.log('🧑‍🤝‍🧑 [MEMBER] Iniciando procesamiento de pago', {
    sessionId: session.id,
    memberId
  });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.log(`🔄 [MEMBER] Procesando - Intento ${attempt} de ${maxRetries}`);

      // 1. Buscar el payment existente
      const payment = await prisma.payment.findUnique({
        where: { stripe_session_id: session.id }
      });

      if (!payment) {
        logger.apiError('[MEMBER] Payment no encontrado', session.id);
        throw new Error('Payment not found');
      }

      logger.db('[MEMBER] Payment encontrado', {
        id: payment.id,
        status: payment.status
      });

      // 2. Actualizar member a ACTIVE
      const updatedMember = await updateMemberToActive(memberId, session);
      
      // 3. Actualizar payment a COMPLETED
      await prisma.payment.update({
        where: { id: payment.id },
        data: { 
          status: 'completed' as PaymentStatus,
          stripe_payment_id: session.payment_intent as string || payment.stripe_payment_id,
          updated_at: new Date()
        }
      });

      logger.apiSuccess('[MEMBER] Pago procesado exitosamente');

      // 4. Enviar email unificado
      await sendMemberEmail(updatedMember, session);
      
      return; // ✅ Éxito
      
    } catch (error: any) {
      logger.apiError(`[MEMBER] Error en intento ${attempt}`, {
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n')
      });
      
      if (attempt === maxRetries) {
        logger.error('❌ [MEMBER] Máximo de reintentos alcanzado');
        throw error;
      }
      
      // Esperar antes del siguiente intento (backoff exponencial)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// ========================================
// ACTUALIZAR MEMBER A ACTIVE
// ========================================
async function updateMemberToActive(memberId: string, session: Stripe.Checkout.Session) {
  logger.db('[MEMBER] Actualizando member a ACTIVE', memberId);

  const now = new Date();
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(now.getFullYear() + 1);

  try {
    // Verificar que existe
    const existingMember = await prisma.member.findUnique({
      where: { id: memberId }
    });

    if (!existingMember) {
      throw new Error(`Member ${memberId} not found`);
    }

    // Actualizar
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        membership_status: 'active' as MembershipStatus,
        membership_start_date: now,
        membership_end_date: oneYearFromNow,
        admin_notes: `Pago completado el ${now.toISOString()}. Stripe Session: ${session.id}`,
        updated_at: now,
      },
    });

    logger.apiSuccess('[MEMBER] Member actualizado a ACTIVE', {
      id: updatedMember.id,
      status: updatedMember.membership_status,
      start: updatedMember.membership_start_date?.toISOString()
    });

    return updatedMember;
    
  } catch (error: any) {
    logger.apiError('[MEMBER] Error actualizando member', error);
    throw error;
  }
}

// ========================================
// ENVIAR EMAIL A MIEMBRO
// ========================================
async function sendMemberEmail(
  member: any,
  session: Stripe.Checkout.Session
) {
  try {
    logger.log('📧 [MEMBER] Iniciando envío de email unificado...');

    // Email unificado de bienvenida + confirmación de pago
    await EmailService.sendWelcomeWithPaymentStatus({
      email: member.email,
      firstName: member.first_name,
      lastName: member.last_name,
      memberNumber: member.member_number,
      licenseType: member.license_type || 'none',
      paymentStatus: 'success',
      amount: session.amount_total || 0,
      currency: session.currency || 'eur',
    });

    logger.apiSuccess('✅ [MEMBER] Email de bienvenida con confirmación de pago enviado');

  } catch (emailError: any) {
    // ⚠️ NO fallar el webhook si falla el email
    logger.apiError('❌ [MEMBER] Error enviando email (no crítico)', emailError.message);
    
    // Registrar en admin_notes que faltó enviar el email
    await prisma.member.update({
      where: { id: member.id },
      data: {
        admin_notes: `${member.admin_notes}\n[ERROR] Email no enviado: ${emailError.message}`,
        updated_at: new Date()
      }
    }).catch(err => logger.error('[MEMBER] Error actualizando admin_notes', err));
  }
}