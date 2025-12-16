// ========================================
// API UNIFICADA: Revocar Consentimientos
// Maneja WhatsApp y Marketing
// app/api/gestor/revoke-consent/route.ts
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { userId, consentType } = await request.json();

    // ========================================
    // VALIDACIONES
    // ========================================
    
    if (!userId || !consentType) {
      return NextResponse.json(
        { error: 'userId y consentType son requeridos' },
        { status: 400 }
      );
    }

    if (!['whatsapp', 'marketing'].includes(consentType)) {
      return NextResponse.json(
        { error: 'consentType debe ser "whatsapp" o "marketing"' },
        { status: 400 }
      );
    }

    logger.log('📥 POST /api/gestor/revoke-consent', { userId, consentType });

    // ========================================
    // INTENTAR COMO MEMBER PRIMERO
    // ========================================
    
    const member = await prisma.member.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        email: true,
        member_number: true,
        whatsapp_consent: true,
        whatsapp_revoked_at: true,
        marketing_consent: true,
        marketing_revoked_at: true
      }
    });

    if (member) {
      // Verificar si ya está revocado
      if (consentType === 'whatsapp' && member.whatsapp_revoked_at) {
        return NextResponse.json(
          { error: 'WhatsApp ya está revocado para este usuario' },
          { status: 400 }
        );
      }

      if (consentType === 'marketing' && member.marketing_revoked_at) {
        return NextResponse.json(
          { error: 'Marketing ya está revocado para este usuario' },
          { status: 400 }
        );
      }

      // Verificar que tenía el consentimiento
      if (consentType === 'whatsapp' && !member.whatsapp_consent) {
        return NextResponse.json(
          { error: 'Este usuario nunca aceptó WhatsApp' },
          { status: 400 }
        );
      }

      if (consentType === 'marketing' && !member.marketing_consent) {
        return NextResponse.json(
          { error: 'Este usuario nunca aceptó marketing' },
          { status: 400 }
        );
      }

      // Preparar datos de actualización
      let updateData: any = {};

      if (consentType === 'whatsapp') {
        updateData = {
          whatsapp_revoked_at: new Date()
        };
      } else if (consentType === 'marketing') {
        updateData = {
          marketing_revoked_at: new Date()
        };
      }

      // Actualizar member
      const updatedMember = await prisma.member.update({
        where: { id: userId },
        data: updateData
      });

      logger.log(`✅ Consentimiento ${consentType} revocado para member:`, {
        id: userId,
        email: member.email,
        member_number: member.member_number
      });

      return NextResponse.json({
        success: true,
        message: `Consentimiento de ${consentType} revocado correctamente`,
        userType: 'member',
        member: {
          id: updatedMember.id,
          whatsapp_consent: updatedMember.whatsapp_consent,
          whatsapp_revoked_at: updatedMember.whatsapp_revoked_at,
          marketing_consent: updatedMember.marketing_consent,
          marketing_revoked_at: updatedMember.marketing_revoked_at
        }
      });
    }

    // ========================================
    // INTENTAR COMO EVENT_REGISTRATION
    // ========================================
    
    const eventReg = await prisma.eventRegistration.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        participant_email: true,
        whatsapp_consent: true,
        marketing_consent: true,
        marketing_revoked_at: true,
        event: { select: { name: true } }
      }
    });

    if (!eventReg) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // ========================================
    // REVOCAR EN EVENT_REGISTRATION
    // ========================================

    // WhatsApp NO se puede revocar individualmente en eventos
    if (consentType === 'whatsapp') {
      return NextResponse.json(
        { 
          error: 'Los participantes de eventos no tienen opción de revocar WhatsApp individual. Deben contactar con el club.',
          userType: 'event_only'
        },
        { status: 400 }
      );
    }

    // Marketing SÍ se puede revocar
    if (consentType === 'marketing') {
      if (eventReg.marketing_revoked_at) {
        return NextResponse.json(
          { error: 'Marketing ya está revocado' },
          { status: 400 }
        );
      }

      if (!eventReg.marketing_consent) {
        return NextResponse.json(
          { error: 'Este participante nunca aceptó marketing' },
          { status: 400 }
        );
      }

      const updatedEventReg = await prisma.eventRegistration.update({
        where: { id: userId },
        data: {
          marketing_revoked_at: new Date()
        }
      });

      logger.log('✅ Marketing revocado para event_registration:', { 
        id: userId, 
        email: eventReg.participant_email,
        event: eventReg.event.name
      });

      return NextResponse.json({
        success: true,
        message: 'Consentimiento de marketing revocado correctamente',
        userType: 'event_only',
        registration: {
          id: updatedEventReg.id,
          marketing_consent: updatedEventReg.marketing_consent,
          marketing_revoked_at: updatedEventReg.marketing_revoked_at
        }
      });
    }

  } catch (error: any) {
    logger.error('❌ Error revocando consentimiento:', error);
    return NextResponse.json(
      { error: 'Error al revocar consentimiento', details: error.message },
      { status: 500 }
    );
  }
}
