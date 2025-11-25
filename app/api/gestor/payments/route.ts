import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { logger } from '@/lib/logger';

const prisma = new PrismaClient();

export async function GET() {
  try {
    logger.log('📥 GET /api/gestor/payments - Obteniendo pagos...');
    
    const payments = await prisma.payment.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        member: {
          select: {
            member_number: true,
            first_name: true,
            last_name: true,
          }
        }
      }
    });

    logger.log(`✅ Se encontraron ${payments.length} pagos`);

    return NextResponse.json({
      success: true,
      payments,
    });
  } catch (error: any) {
    logger.error('❌ Error obteniendo pagos:', error);
    return NextResponse.json(
      { error: 'Error al obtener pagos', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}