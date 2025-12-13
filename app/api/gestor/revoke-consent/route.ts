// ========================================
// 3. API: Revocar Consentimientos
// app/api/gestor/revoke-consent/route.ts
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { memberId, consentType } = await request.json();

    if (!memberId || !consentType) {
      return NextResponse.json(
        { error: 'memberId y consentType son requeridos' },
        { status: 400 }
      );
    }

    if (!['whatsapp', 'marketing'].includes(consentType)) {
      return NextResponse.json(
        { error: 'consentType debe ser "whatsapp" o "marketing"' },
        { status: 400 }
      );
    }

    let updateData: any = {};

    if (consentType === 'whatsapp') {
      updateData = {
        whatsapp_consent: false,
        whatsapp_revoked_at: new Date()
      };
    } else if (consentType === 'marketing') {
      updateData = {
        marketing_consent: false,
        marketing_revoked_at: new Date()
      };
    }

    const member = await prisma.member.update({
      where: { id: memberId },
      data: updateData
    });

    logger.log(`❌ Consentimiento ${consentType} revocado:`, {
      id: member.id,
      member_number: member.member_number,
      revoked_at: consentType === 'whatsapp' 
        ? member.whatsapp_revoked_at 
        : member.marketing_revoked_at
    });

    return NextResponse.json({
      success: true,
      message: `Consentimiento de ${consentType} revocado correctamente`,
      member: {
        id: member.id,
        whatsapp_consent: member.whatsapp_consent,
        whatsapp_revoked_at: member.whatsapp_revoked_at,
        marketing_consent: member.marketing_consent,
        marketing_revoked_at: member.marketing_revoked_at
      }
    });

  } catch (error: any) {
    logger.error('❌ Error al revocar consentimiento:', error);
    return NextResponse.json(
      { error: 'Error al revocar consentimiento', details: error.message },
      { status: 500 }
    );
  }
}
