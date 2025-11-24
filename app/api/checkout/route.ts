import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { getLicensePrice, MEMBERSHIP_FEE, LICENSE_TYPES } from '@/lib/constants';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { memberId, total, memberData } = body;

    console.log('💳 Procesando checkout:', { memberId, total, memberData });

    if (!memberId || !total || !memberData) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
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
      // Cuota de socio
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Cuota de Socio Anual - Proyecto Cumbre',
            description: 'Membresía anual del club de montaña',
          },
          unit_amount: MEMBERSHIP_FEE * 100, // Stripe usa centavos
        },
        quantity: 1,
      },
    ];

    // Solo agregar licencia si tiene costo
    if (licensePrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Licencia FEDME - ${selectedLicense.name}`,
            description: selectedLicense.coverage,
          },
          unit_amount: Math.round(licensePrice * 100), // Stripe usa centavos
        },
        quantity: 1,
      });
    }

    // Crear sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/pago-exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pago-cancelado?canceled=true`,
      metadata: {
        memberId: memberId,
        email: memberData.email,
        licenseType: memberData.licenseType,
        ageCategory: memberData.ageCategory || 'unknown',
      },
      customer_email: memberData.email,
    });

    console.log('✅ Sesión de Stripe creada:', session.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('❌ Error en checkout:', error);
    
    return NextResponse.json(
      { error: error.message || 'Error al crear sesión de pago' },
      { status: 500 }
    );
  }
}
