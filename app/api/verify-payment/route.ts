// /api/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID es requerido' },
        { status: 400 }
      );
    }

    console.log('🔍 Verificando sesión de Stripe:', sessionId);

    // Obtener la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('✅ Sesión encontrada:', {
      id: session.id,
      payment_status: session.payment_status,
      customer_email: session.customer_email,
    });

    // Verificar que el pago fue exitoso
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'El pago no ha sido completado' },
        { status: 400 }
      );
    }

    // Obtener datos del miembro desde metadata
    const memberId = session.metadata?.memberId;
    const licenseType = session.metadata?.licenseType;

    // Opcional: Obtener los datos del socio de la BD
    // const member = await prisma.member.findUnique({ where: { id: memberId } });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      amount: session.amount_total,
      currency: session.currency,
      email: session.customer_email,
      firstName: session.metadata?.firstName,
      lastName: session.metadata?.lastName,
      licenseType: licenseType,
      memberId: memberId,
      paymentStatus: session.payment_status,
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error verificando pago:', error);
    return NextResponse.json(
      { error: 'Error al verificar el pago', details: error.message },
      { status: 500 }
    );
  }
}
