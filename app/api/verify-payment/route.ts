// app/api/verify-payment/route.ts - VERSIÓN CORREGIDA

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { logger } from '@/lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
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

    // 2. Buscar payment en base de datos
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
      status: payment.status,
      member_status: payment.member.membership_status,
    });

    // 3. ✅ Devolver datos en el formato que espera el componente
    return NextResponse.json({
      success: true,
      // Datos del payment
      amount: payment.amount, // Ya está en centavos
      currency: payment.currency,
      paymentStatus: payment.status,
      
      // Datos del member (formato que espera el componente)
      firstName: payment.member.first_name,
      lastName: payment.member.last_name,
      email: payment.member.email,
      memberNumber: payment.member.member_number,
      membershipStatus: payment.member.membership_status,
      fedmeStatus: payment.member.fedme_status,
      licenseType: payment.member.license_type,
      
      // Datos de Stripe
      sessionId: session.id,
      stripeStatus: session.status,
      stripePaymentStatus: session.payment_status,
    });

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