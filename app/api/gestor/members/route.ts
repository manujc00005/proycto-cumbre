import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { logger } from '@/lib/logger';

const prisma = new PrismaClient();

export async function GET() {
  try {
    logger.log('📥 GET /api/gestor/members - Obteniendo socios...');
    
    const members = await prisma.member.findMany({
      where: { deleted_at: null },
      orderBy: [
        { fedme_status: 'asc' },
        { created_at: 'desc' }
      ],
      select: {
        id: true,
        member_number: true,
        first_name: true,
        last_name: true,
        phone: true,
        license_type: true,
        fedme_status: true,
        membership_status: true,
      }
    });

    logger.log(`✅ Se encontraron ${members.length} socios`);

    return NextResponse.json({
      success: true,
      members,
    });
  } catch (error: any) {
    logger.error('❌ Error obteniendo socios:', error);
    return NextResponse.json(
      { error: 'Error al obtener socios', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}