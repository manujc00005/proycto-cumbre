// app/api/webhooks/stripe/route.ts - VERSIÓN FINAL

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient, MembershipStatus, PaymentStatus } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  console.log('✅ Webhook recibido:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('💳 Pago completado:', session.id);
        console.log('🆔 Member ID:', session.metadata?.memberId);

        const memberId = session.metadata?.memberId;

        if (!memberId) {
          console.error('❌ No se encontró memberId en los metadatos');
          return NextResponse.json({ error: 'No memberId found' }, { status: 400 });
        }

        // ✅ El payment ya existe, solo actualizarlo
        await processCompletedPayment(session, memberId);

        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('✅ PaymentIntent succeeded:', paymentIntent.id);
        
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
        console.error('❌ Payment failed:', paymentIntent.id);
        
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
        console.log(`ℹ️ Evento informativo: ${event.type}`);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
    
  } catch (error: any) {
    console.error('❌ Error processing webhook:', error);
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
      console.log(`🔄 Procesando pago - Intento ${attempt} de ${maxRetries}`);

      // 1. Buscar el payment existente
      const payment = await prisma.payment.findUnique({
        where: { stripe_session_id: session.id }
      });

      if (!payment) {
        console.error('❌ Payment no encontrado para session:', session.id);
        throw new Error('Payment not found');
      }

      console.log('📦 Payment encontrado:', payment.id, '- Status:', payment.status);

      // 2. Actualizar member a ACTIVE
      await updateMemberToActive(memberId, session);
      
      // 3. Actualizar payment a COMPLETED
      await prisma.payment.update({
        where: { id: payment.id },
        data: { 
          status: 'completed' as PaymentStatus,
          stripe_payment_id: session.payment_intent as string || payment.stripe_payment_id,
          updated_at: new Date()
        }
      });

      console.log('✅ Pago procesado exitosamente');
      return; // ✅ Éxito
      
    } catch (error: any) {
      console.error(`❌ Error en intento ${attempt}:`, error.message);
      
      if (attempt === maxRetries) {
        console.error('❌ Máximo de reintentos alcanzado');
        throw error;
      }
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Actualizar member a ACTIVE
async function updateMemberToActive(memberId: string, session: Stripe.Checkout.Session) {
  console.log('🔄 Actualizando socio a ACTIVE:', memberId);

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

    console.log('✅ Socio actualizado a ACTIVE');
    console.log('   - Member:', updatedMember.id);
    console.log('   - Status:', updatedMember.membership_status);
    console.log('   - Start:', updatedMember.membership_start_date?.toISOString());
    console.log('   - End:', updatedMember.membership_end_date?.toISOString());
    
    return updatedMember;
    
  } catch (error: any) {
    console.error('❌ Error actualizando socio:', error);
    throw error;
  }
}