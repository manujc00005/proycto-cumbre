// ========================================
// API CHECKOUT MEMBRESÍAS - CON BYPASS STRIPE
// ✅ Detecta emails en allowlist
// ✅ Crea Payment completed + Activa Member directamente
// ✅ Devuelve redirect a /pago-exito
// app/api/checkout/route.ts
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PaymentStatus, MembershipStatus } from '@prisma/client';
import { getLicensePrice, LICENSE_TYPES, MEMBERSHIP_FEE } from '@/lib/constants';
import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { isTestUserEmail } from '../helpers';

// ========================================
// FUNCIÓN: Activar membresía sin Stripe
// ========================================
async function activateMembershipDirectly(params: {
  memberId: string;
  memberData: any;
  total: number;
}) {
  const { memberId, memberData, total } = params;
  const testAmount = parseInt(process.env.TEST_PAYMENT_AMOUNT || '500');
  const fakeSessionId = `test_${crypto.randomBytes(16).toString('hex')}`;

  logger.log('🧪 MODO TEST - Activando membresía directamente');
  logger.log(`   Email: ${memberData.email}`);
  logger.log(`   Monto original: ${total}€`);
  logger.log(`   Monto de test: ${testAmount / 100}€`);

  const now = new Date();
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(now.getFullYear() + 1);

  // Transacción: Payment + Member update
  const result = await prisma.$transaction(async (tx) => {
    // 1) Crear Payment COMPLETED
    const payment = await tx.payment.create({
      data: {
        payment_type: 'membership',
        member_id: memberId,
        stripe_session_id: fakeSessionId,
        amount: testAmount,
        currency: 'eur',
        status: PaymentStatus.completed,
        description: `🧪 TEST - Membresía - Licencia ${memberData.licenseType}`,
        metadata: {
          is_test_payment: true,
          license_type: memberData.licenseType,
          age_category: memberData.ageCategory || 'unknown',
        },
      },
    });

    // 2) Actualizar Member a ACTIVE
    const updatedMember = await tx.member.update({
      where: { id: memberId },
      data: {
        membership_status: MembershipStatus.active,
        membership_start_date: now,
        membership_end_date: oneYearFromNow,
        admin_notes: `🧪 TEST - Pago completado el ${now.toISOString()}. Session: ${fakeSessionId}`,
        updated_at: now,
      },
    });

    return { payment, member: updatedMember };
  });

  logger.log('✅ Membresía activada directamente');
  logger.log('   Payment ID:', result.payment.id);
  logger.log('   Member status:', result.member.membership_status);

  return result;
}

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

    // ========================================
    // 🎯 DETECTAR MODO TEST
    // ========================================
    const isTestUser = isTestUserEmail(memberData.email);

    if (isTestUser) {
      // ========================================
      // 🧪 FLUJO TEST: Sin Stripe
      // ========================================
      const result = await activateMembershipDirectly({
        memberId,
        memberData,
        total,
      });

      const publicUrl = process.env.NEXT_PUBLIC_URL;
      
      return NextResponse.json({
        success: true,
        isTest: true,
        sessionId: result.payment.stripe_session_id,
        url: `${publicUrl}/pago-exito?session_id=${result.payment.stripe_session_id}`,
        payment: {
          id: result.payment.id,
          status: result.payment.status,
          amount: result.payment.amount,
        },
        member: {
          id: result.member.id,
          membership_status: result.member.membership_status,
        },
      });
    }

    // ========================================
    // 💳 FLUJO NORMAL: Con Stripe
    // ========================================
    const stripe = getStripe();

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

    // Crear line items (modo normal)
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
        type: 'membership', 
        memberId: memberId,
        email: memberData.email,
        licenseType: memberData.licenseType,
        ageCategory: memberData.ageCategory || 'unknown',
      },
      customer_email: memberData.email,
    });

    logger.log('✅ Sesión de Stripe creada:', session.id);

    // ✅ CREAR PAYMENT EN BD
    try {
      const payment = await prisma.payment.create({
        data: {
          payment_type: 'membership',
          member_id: memberId,
          stripe_session_id: session.id,
          stripe_payment_id: session.payment_intent as string || null,
          amount: total * 100,
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
      if (paymentError.code === 'P2002') {
        logger.log('⚠️ Payment ya existe para esta sesión, continuando...');
      } else {
        logger.error('❌ Error creando payment:', paymentError);
      }
    }

    return NextResponse.json({
      success: true,
      isTest: false,
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    logger.error('❌ Error en checkout:', error);
    
    return NextResponse.json(
      { error: error.message || 'Error al crear sesión de pago' },
      { status: 500 }
    );
  }
}
