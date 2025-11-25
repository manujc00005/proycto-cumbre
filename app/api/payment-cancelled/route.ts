import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { logger } from '@/lib/logger';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID es requerido' },
        { status: 400 }
      );
    }

    logger.log('🚫 Buscando pago con session_id:', sessionId);

    // Buscar el pago por session_id
    const payment = await prisma.payment.findUnique({
      where: {
        stripe_session_id: sessionId
      },
      include: {
        member: true
      }
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'No se encontró el pago asociado a esta sesión' },
        { status: 404 }
      );
    }

    // Solo actualizar si el pago está en estado "pending"
    if (payment.status !== 'pending') {
      logger.log('⚠️ El pago ya tiene estado:', payment.status);
      return NextResponse.json({
        success: true,
        message: 'El pago ya fue procesado previamente',
        currentStatus: payment.status
      });
    }

    logger.log('📝 Actualizando estado del pago a "failed"...');

    // Actualizar el estado del pago a "failed" (cancelado)
    await prisma.payment.update({
      where: {
        id: payment.id
      },
      data: {
        status: 'failed',
        updated_at: new Date()
      }
    });

    // Actualizar el estado de la membresía del socio
    await prisma.member.update({
      where: {
        id: payment.member_id
      },
      data: {
        membership_status: 'failed',
        updated_at: new Date()
      }
    });

    logger.log('✅ Pago marcado como cancelado');

    return NextResponse.json({
      success: true,
      message: 'Pago cancelado exitosamente',
      memberId: payment.member_id
    });

  } catch (error: any) {
    logger.error('❌ Error al procesar cancelación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}