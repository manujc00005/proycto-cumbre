// app/api/verify-payment/route.ts - VERSIÓN CORREGIDA FINAL

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    logger.log('🔍 Verificando pago para session:', sessionId);

    // 1. Obtener información de la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    logger.log('📋 Sesión de Stripe:', {
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_email,
    });

    // 2. Buscar payment en base de datos CON TODAS LAS RELACIONES
    const payment = await prisma.payment.findUnique({
      where: { stripe_session_id: sessionId },
      include: {
        member: {
          select: {
            id: true,
            member_number: true,
            email: true,
            first_name: true,
            last_name: true,
            membership_status: true,
            fedme_status: true,
            license_type: true,
          }
        },
        eventRegistration: {  // 👈 camelCase, no snake_case
          select: {
            participant_name: true,
            participant_email: true,
            participant_phone: true,
            custom_data: true,
            event: {
              select: {
                name: true,
                slug: true,
              }
            }
          }
        },
        order: {
          select: {
            order_number: true,
            customer_name: true,
            customer_email: true,
            total: true,
          }
        }
      }
    });

    if (!payment) {
      logger.warn('⚠️ No se encontró el pago en BD');
      return NextResponse.json({
        success: false,
        error: 'Payment not found',
        stripeStatus: session.payment_status,
      }, { status: 404 });
    }

    logger.log('💾 Pago en BD:', {
      id: payment.id,
      type: payment.payment_type,
      status: payment.status,
    });

    // 3. ✅ Devolver datos según el tipo de pago
    const baseResponse = {
      success: true,
      amount: payment.amount,
      currency: payment.currency,
      paymentStatus: payment.status,
      paymentType: payment.payment_type,
      sessionId: session.id,
      stripeStatus: session.status,
      stripePaymentStatus: session.payment_status,
    };

    // Añadir datos específicos según el tipo
    if (payment.payment_type === 'membership' && payment.member) {
      return NextResponse.json({
        ...baseResponse,
        firstName: payment.member.first_name,
        lastName: payment.member.last_name,
        email: payment.member.email,
        memberNumber: payment.member.member_number,
        membershipStatus: payment.member.membership_status,
        fedmeStatus: payment.member.fedme_status,
        licenseType: payment.member.license_type,
      });
    }

    if (payment.payment_type === 'event' && payment.eventRegistration) {
      const participantName = payment.eventRegistration.participant_name || '';
      const nameParts = participantName.split(' ');
      return NextResponse.json({
        ...baseResponse,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: payment.eventRegistration.participant_email,
        phone: payment.eventRegistration.participant_phone,
        eventName: payment.eventRegistration.event.name,
        eventSlug: payment.eventRegistration.event.slug,
        customData: payment.eventRegistration.custom_data,
      });
    }

    if (payment.payment_type === 'order' && payment.order) {
      return NextResponse.json({
        ...baseResponse,
        orderNumber: payment.order.order_number,
        customerName: payment.order.customer_name,
        email: payment.order.customer_email,
        total: payment.order.total,
      });
    }

    // Fallback genérico si no coincide ningún tipo
    return NextResponse.json(baseResponse);

  } catch (error: any) {
    logger.error('❌ Error verificando pago:', error);
    
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({
        error: 'Invalid Stripe session ID',
        details: error.message
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Error verifying payment',
      details: error.message
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
