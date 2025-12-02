// app/api/webhooks/stripe/route.ts - VERSIÓN FINAL

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient, MembershipStatus, PaymentStatus } from '@prisma/client';
import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { EmailService } from '@/lib/email-service';


const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

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
          memberId: session.metadata?.memberId,
          amount: session.amount_total
        });

        const memberId = session.metadata?.memberId;

        if (!memberId) {
          logger.apiError('No se encontró memberId en metadatos');
          return NextResponse.json({ error: 'No memberId found' }, { status: 400 });
        }

        // ✅ El payment ya existe, solo actualizarlo
        await processCompletedPayment(session, memberId);

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
          await prisma.payment.updateMany({
            where: { stripe_payment_id: paymentIntent.id },
            data: { 
              status: 'failed' as PaymentStatus,
              updated_at: new Date()
            }
          });
        }

        const memberId = paymentIntent.metadata?.memberId;
        if (memberId) {
          await prisma.member.update({
            where: { id: memberId },
            data: { 
              membership_status: 'failed' as MembershipStatus,
              admin_notes: `Pago fallido el ${new Date().toISOString()}`,
              updated_at: new Date()
            }
          });
        }
        
        break;
      }

      case 'charge.succeeded':
      case 'charge.updated':
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

// ✅ Procesar pago completado (con reintentos)
async function processCompletedPayment(
  session: Stripe.Checkout.Session, 
  memberId: string,
  maxRetries = 3
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.log(`🔄 Procesando pago - Intento ${attempt} de ${maxRetries}`);

      // 1. Buscar el payment existente
      const payment = await prisma.payment.findUnique({
        where: { stripe_session_id: session.id }
      });

      if (!payment) {
        logger.apiError('Payment no encontrado', session.id);
        throw new Error('Payment not found');
      }

      logger.db('Payment encontrado', {
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

      logger.apiSuccess('Pago procesado exitosamente');

      // 🎯 4. ENVIAR EMAIL UNIFICADO (después de todo lo demás)
      await sendMemberEmail(updatedMember, session);
      
      return; // ✅ Éxito
      
    } catch (error: any) {
      logger.apiError(`Error en intento ${attempt}`, error.message);
      
      if (attempt === maxRetries) {
        logger.error('❌ Máximo de reintentos alcanzado');
        throw error;
      }
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Actualizar member a ACTIVE
async function updateMemberToActive(memberId: string, session: Stripe.Checkout.Session) {
  logger.db('Actualizando member a ACTIVE', memberId);

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

    logger.apiSuccess('Member actualizado a ACTIVE', {
      id: updatedMember.id,
      status: updatedMember.membership_status,
      start: updatedMember.membership_start_date?.toISOString()
    });

    return updatedMember;
    
  } catch (error: any) {
    logger.apiError('Error actualizando member', error);
    throw error;
  }
}

// 🎯 Enviar email unificado al miembro
async function sendMemberEmail(
  member: any,
  session: Stripe.Checkout.Session
) {
  try {
    logger.log('📧 Iniciando envío de email unificado...');

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

    logger.apiSuccess('✅ Email de bienvenida con confirmación de pago enviado');

  } catch (emailError: any) {
    // ⚠️ NO fallar el webhook si falla el email
    logger.apiError('❌ Error enviando email (no crítico)', emailError.message);
    
    // Registrar en admin_notes que faltó enviar el email
    await prisma.member.update({
      where: { id: member.id },
      data: {
        admin_notes: `${member.admin_notes}\n[ERROR] Email no enviado: ${emailError.message}`,
        updated_at: new Date()
      }
    }).catch(err => logger.error('Error actualizando admin_notes', err));
  }
}