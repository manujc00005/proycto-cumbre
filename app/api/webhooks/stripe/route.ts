// /api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const prisma = new PrismaClient();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    // Verificar el webhook de Stripe
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Manejar el evento
  console.log('✅ Webhook recibido:', event.type);

  try {
    switch (event.type) {
      // 🎯 EVENTO PRINCIPAL: Checkout completado
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('💳 Pago completado:', session.id);
        console.log('📧 Customer email:', session.customer_email);
        console.log('🆔 Member ID:', session.metadata?.memberId);
        console.log('💰 Amount:', session.amount_total);

        const memberId = session.metadata?.memberId;

        if (!memberId) {
          console.error('❌ No se encontró memberId en los metadatos');
          return NextResponse.json({ error: 'No memberId found' }, { status: 400 });
        }

        // 1️⃣ CREAR REGISTRO DE PAGO (estado: pending inicialmente)
        await createPaymentRecord(session, memberId);

        // 2️⃣ ACTUALIZAR ESTADO DEL SOCIO A "ACTIVE"
        await updateMemberToActive(memberId, session);

        // 3️⃣ ACTUALIZAR ESTADO DEL PAGO A "COMPLETED"
        await updatePaymentToCompleted(session.id);

        break;
      }

      // 🎯 Pago exitoso (confirmación adicional)
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('✅ PaymentIntent succeeded:', paymentIntent.id);
        
        // Buscar el pago por stripe_payment_id y actualizar
        if (paymentIntent.id) {
          await prisma.payment.updateMany({
            where: { stripe_payment_id: paymentIntent.id },
            data: { 
              status: 'completed',
              updated_at: new Date()
            }
          });
        }
        
        break;
      }

      // ❌ Pago fallido
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('❌ Payment failed:', paymentIntent.id);
        
        // Actualizar pago a failed
        if (paymentIntent.id) {
          await prisma.payment.updateMany({
            where: { stripe_payment_id: paymentIntent.id },
            data: { 
              status: 'failed',
              updated_at: new Date()
            }
          });
        }

        // Opcional: Actualizar el estado del socio a 'failed'
        const memberId = paymentIntent.metadata?.memberId;
        if (memberId) {
          await prisma.member.update({
            where: { id: memberId },
            data: { 
              membership_status: 'failed',
              admin_notes: `Pago fallido el ${new Date().toISOString()}. Payment Intent: ${paymentIntent.id}`,
              updated_at: new Date()
            }
          });
        }
        
        break;
      }

      // ⚠️ Otros eventos (no críticos)
      case 'charge.updated':
      case 'charge.succeeded':
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

// 1️⃣ Crear registro de pago (inicialmente pending)
async function createPaymentRecord(session: Stripe.Checkout.Session, memberId: string) {
  try {
    console.log('📝 Creando registro de pago...');

    const payment = await prisma.payment.create({
      data: {
        member_id: memberId,
        stripe_session_id: session.id,
        stripe_payment_id: session.payment_intent as string || null,
        amount: session.amount_total || 0,
        currency: session.currency || 'eur',
        status: 'pending', // Inicialmente pending
        description: `Pago de membresía - ${session.customer_email}`,
      }
    });

    console.log('✅ Pago creado:', payment.id);
    return payment;
  } catch (error: any) {
    // Si ya existe (duplicate key), solo loggeamos
    if (error.code === 'P2002') {
      console.log('ℹ️ El pago ya existe, continuando...');
      return null;
    }
    throw error;
  }
}

// 2️⃣ Actualizar socio a ACTIVE
async function updateMemberToActive(memberId: string, session: Stripe.Checkout.Session) {
  console.log('🔄 Actualizando socio a ACTIVE:', memberId);

  const now = new Date();
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(now.getFullYear() + 1);

  try {
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        membership_status: 'active',          // ✅ ACTIVE después del pago
        membership_start_date: now,           // Fecha de inicio
        membership_end_date: oneYearFromNow,  // Fecha de fin (1 año)
        admin_notes: `Pago completado el ${now.toISOString()}. Stripe Session: ${session.id}`,
        updated_at: now,
      },
    });

    console.log('✅ Socio actualizado a ACTIVE:', updatedMember.id);
    console.log('📅 Start date:', now.toISOString());
    console.log('📅 End date:', oneYearFromNow.toISOString());
    
    return updatedMember;
  } catch (error: any) {
    console.error('❌ Error actualizando socio:', error);
    throw error;
  }
}

// 3️⃣ Actualizar pago a COMPLETED
async function updatePaymentToCompleted(sessionId: string) {
  console.log('🔄 Actualizando pago a COMPLETED:', sessionId);

  try {
    const updatedPayment = await prisma.payment.update({
      where: { stripe_session_id: sessionId },
      data: { 
        status: 'completed',  // ✅ COMPLETED
        updated_at: new Date()
      }
    });

    console.log('✅ Pago actualizado a COMPLETED:', updatedPayment.id);
    return updatedPayment;
  } catch (error: any) {
    console.error('❌ Error actualizando pago:', error);
    throw error;
  }
}

// ℹ️ IMPORTANTE: Configurar el webhook en Stripe Dashboard
// 1. Ir a https://dashboard.stripe.com/webhooks
// 2. Click en "Add endpoint"
// 3. URL: https://tu-dominio.com/api/webhooks/stripe
// 4. Eventos a escuchar:
//    - checkout.session.completed ← MÁS IMPORTANTE
//    - payment_intent.succeeded
//    - payment_intent.payment_failed
// 5. Copiar el "Signing secret" a .env como STRIPE_WEBHOOK_SECRET
