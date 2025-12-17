// app/api/gestor/misa-registrations/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { MISA_SLUG } from '@/lib/funnels/configs/misa';

export async function GET() {
  try {
    // Buscar el evento MISA
    const misaEvent = await prisma.event.findUnique({
      where: { slug: MISA_SLUG }
    });

    if (!misaEvent) {
      return NextResponse.json(
        { success: false, error: 'Evento MISA no encontrado' },
        { status: 404 }
      );
    }

    // Obtener todas las inscripciones
    const registrations = await prisma.eventRegistration.findMany({
      where: {
        event_id: misaEvent.id
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Obtener todos los pagos asociados a estas inscripciones
    const registrationIds = registrations.map(r => r.id);
    const payments = await prisma.payment.findMany({
      where: {
        event_registration_id: {
          in: registrationIds
        }
      },
      select: {
        event_registration_id: true,
        status: true,
        amount: true,
        stripe_session_id: true,
        created_at: true
      }
    });

    // Crear un mapa de pagos por registration_id
    const paymentMap = new Map(
      payments.map(p => [p.event_registration_id, p])
    );

    logger.log(`✅ [GESTOR] ${registrations.length} inscripciones MISA obtenidas`);

    return NextResponse.json({
      success: true,
      registrations: registrations.map(reg => ({
        id: reg.id,
        participant_name: reg.participant_name,
        participant_email: reg.participant_email,
        participant_phone: reg.participant_phone,
        custom_data: reg.custom_data,
        status: reg.status,
        registered_at: reg.created_at,
        payment: paymentMap.get(reg.id) || null
      }))
    });

  } catch (error: any) {
    logger.error('❌ [GESTOR] Error obteniendo inscripciones MISA:', error);
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
