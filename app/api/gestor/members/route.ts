import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDeleted = searchParams.get('includeDeleted');

    const whereClause = includeDeleted === 'true' 
      ? {} 
      : { deleted_at: null };

    const members = await prisma.member.findMany({
      where: whereClause,
      orderBy: [
        { fedme_status: 'asc' },
        { created_at: 'desc' }
      ],
      select: {
        id: true,
        member_number: true,
        first_name: true,
        last_name: true,
        dni: true,
        birth_date: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        province: true,
        postal_code: true,
        license_type: true,
        fedme_status: true,
        fedme_license_number: true,
        membership_status: true,
        membership_start_date: true,
        membership_end_date: true,
        privacy_policy_version: true,
        marketing_consent: true,
        marketing_revoked_at: true,
        whatsapp_consent: true,
        whatsapp_revoked_at: true,
        deleted_at: true,
        created_at: true,
        // 🆕 INCLUIR EL PAGO MÁS RECIENTE
        payments: {
          where: {
            payment_type: 'membership',
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
          select: {
            id: true,
            status: true,
            amount: true,
            created_at: true,
          },
        },
      }
    });

    // 🆕 TRANSFORMAR DATOS PARA INCLUIR ÚLTIMO PAGO
    const membersWithPaymentStatus = members.map(member => ({
      ...member,
      latestPayment: member.payments[0] || null,
      payments: undefined, // Eliminar array de payments del output
    }));

    logger.log(`📋 ${members.length} miembros obtenidos (con estado de pago)`);

    return NextResponse.json({
      success: true,
      count: members.length,
      members: membersWithPaymentStatus
    });

  } catch (error: any) {
    logger.error('❌ Error al obtener miembros:', error);
    return NextResponse.json(
      { error: 'Error al obtener miembros', details: error.message },
      { status: 500 }
    );
  }
}
