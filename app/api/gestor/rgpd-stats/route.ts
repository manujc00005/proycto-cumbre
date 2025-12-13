// ========================================
// 5. API: Estadísticas RGPD
// app/api/gestor/rgpd-stats/route.ts
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Total usuarios activos
    const totalActive = await prisma.member.count({
      where: { deleted_at: null }
    });

    // Total soft deleted
    const totalDeleted = await prisma.member.count({
      where: { deleted_at: { not: null } }
    });

    // Por versión de política
    const byPolicyVersion = await prisma.member.groupBy({
      by: ['privacy_policy_version'],
      where: { deleted_at: null },
      _count: true
    });

    // WhatsApp activo (consent true Y NO revocado)
    const withWhatsApp = await prisma.member.count({
      where: {
        deleted_at: null,
        whatsapp_consent: true,
        whatsapp_revoked_at: null
      }
    });

    // WhatsApp revocados
    const whatsappRevoked = await prisma.member.count({
      where: {
        deleted_at: null,
        whatsapp_revoked_at: { not: null }
      }
    });

    // Marketing activo (consent true Y NO revocado)
    const withMarketing = await prisma.member.count({
      where: {
        deleted_at: null,
        marketing_consent: true,
        marketing_revoked_at: null
      }
    });

    // Marketing revocado
    const marketingRevoked = await prisma.member.count({
      where: {
        deleted_at: null,
        marketing_revoked_at: { not: null }
      }
    });

    const stats = {
      total: {
        active: totalActive,
        deleted: totalDeleted
      },
      policy_versions: byPolicyVersion,
      whatsapp: {
        active: withWhatsApp,
        revoked: whatsappRevoked,
        percentage: totalActive > 0 ? Math.round((withWhatsApp / totalActive) * 100) : 0
      },
      marketing: {
        active: withMarketing,
        revoked: marketingRevoked,
        percentage: totalActive > 0 ? Math.round((withMarketing / totalActive) * 100) : 0
      }
    };

    logger.log('📊 Stats RGPD obtenidas:', stats);

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error: any) {
    logger.error('❌ Error al obtener stats RGPD:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas', details: error.message },
      { status: 500 }
    );
  }
}