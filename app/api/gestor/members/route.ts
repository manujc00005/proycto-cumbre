import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDeleted = searchParams.get('includeDeleted'); // 🆕 Parámetro opcional

    // Query base
    const whereClause = includeDeleted === 'true' 
      ? {} // Incluir todos (para pestaña RGPD)
      : { deleted_at: null }; // Solo activos (para pestaña Members normal)

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
        email: true, // 🆕 Para RGPD
        phone: true,
        license_type: true,
        fedme_status: true,
        membership_status: true,
        
        // 🆕 CAMPOS RGPD
        privacy_policy_version: true,
        marketing_consent: true,
        marketing_revoked_at: true,
        whatsapp_consent: true,
        whatsapp_revoked_at: true,
        deleted_at: true,
      }
    });

    logger.log(`📋 ${members.length} miembros obtenidos (includeDeleted: ${includeDeleted})`);

    return NextResponse.json({
      success: true,
      count: members.length,
      members
    });

  } catch (error: any) {
    logger.error('❌ Error al obtener miembros:', error);
    return NextResponse.json(
      { error: 'Error al obtener miembros', details: error.message },
      { status: 500 }
    );
  }
}
