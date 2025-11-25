// app/api/checkout/route.ts - VERSIÓN CORREGIDA

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient, PaymentStatus } from '@prisma/client';
import { getLicensePrice, LICENSE_TYPES, MEMBERSHIP_FEE } from '@/lib/constants';
import { logger } from '@/lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { memberId, total, memberData } = body;

    logger.log('💳 Procesando checkout:', { memberId, total, memberData });

    if (!memberId || !total || !memberData) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el member existe
    const member = await prisma.member.findUnique({
      where: { id: memberId }
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Miembro no encontrado' },
        { status: 404 }
      );
    }

    // Buscar información de la licencia
    const selectedLicense = LICENSE_TYPES.find(l => l.id === memberData.licenseType);
    
    if (!selectedLicense) {
      return NextResponse.json(
        { error: 'Licencia no encontrada' },
        { status: 400 }
      );
    }

    // Calcular el precio de la licencia según la categoría
    const licensePrice = memberData.ageCategory 
      ? getLicensePrice(selectedLicense, memberData.ageCategory)
      : 0;

    // Crear line items para Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Cuota de Socio Anual - Proyecto Cumbre',
            description: 'Membresía anual del club de montaña',
          },
          unit_amount: MEMBERSHIP_FEE * 100,
        },
        quantity: 1,
      },
    ];

    if (licensePrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Licencia FEDME - ${selectedLicense.name}`,
            description: selectedLicense.coverage,
          },
          unit_amount: Math.round(licensePrice * 100),
        },
        quantity: 1,
      });
    }

    // ✅ CREAR SESIÓN DE STRIPE
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/pago-exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pago-cancelado?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        memberId: memberId,
        email: memberData.email,
        licenseType: memberData.licenseType,
        ageCategory: memberData.ageCategory || 'unknown',
      },
      customer_email: memberData.email,
    });

    logger.log('✅ Sesión de Stripe creada:', session.id);

    // ✅ CREAR PAYMENT EN BD INMEDIATAMENTE (estado: pending)
    try {
      const payment = await prisma.payment.create({
        data: {
          member_id: memberId,
          stripe_session_id: session.id,
          stripe_payment_id: session.payment_intent as string || null,
          amount: total * 100, // Convertir a centavos
          currency: 'eur',
          status: 'pending' as PaymentStatus,
          description: `Membresía - Licencia ${memberData.licenseType}`,
        }
      });

      logger.log('✅ Payment creado en BD:', payment.id);
      logger.log('📊 Estado actual:');
      logger.log('   - Payment ID:', payment.id);
      logger.log('   - Status:', payment.status);
      logger.log('   - Amount:', payment.amount / 100, '€');
      logger.log('   - Stripe Session:', session.id);

    } catch (paymentError: any) {
      // Si el payment ya existe (por alguna razón), continuar
      if (paymentError.code === 'P2002') {
        logger.log('⚠️ Payment ya existe para esta sesión, continuando...');
      } else {
        logger.error('❌ Error creando payment:', paymentError);
        // No fallar el checkout por esto
      }
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    logger.error('❌ Error en checkout:', error);
    
    return NextResponse.json(
      { error: error.message || 'Error al crear sesión de pago' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
