import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    logger.log('📝 Guardando aceptación de pliego:', {
      eventId: payload.eventId,
      participant: payload.participantFullName,
      version: payload.waiverVersion
    });

    // ========================================
    // VALIDACIONES
    // ========================================

    if (!payload.eventId || !payload.waiverVersion || !payload.participantFullName || 
        !payload.participantDocumentId || !payload.waiverTextHash || !payload.acceptedAtISO) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // ========================================
    // OBTENER METADATA (IP + USER-AGENT)
    // ========================================

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    const userAgent = request.headers.get('user-agent') || '';

    logger.log('🔍 Metadata de aceptación:', {
      ip: clientIp,
      userAgent: userAgent.substring(0, 50) + '...'
    });

    // ========================================
    // GUARDAR EN BASE DE DATOS
    // ========================================

    const acceptance = await prisma.waiverAcceptance.create({
      data: {
        event_id: payload.eventId,
        waiver_version: payload.waiverVersion,
        participant_full_name: payload.participantFullName,
        participant_document_id: payload.participantDocumentId,
        participant_birth_date: payload.participantBirthDateISO 
          ? new Date(payload.participantBirthDateISO) 
          : null,
        waiver_text_hash: payload.waiverTextHash,
        accepted_at: new Date(payload.acceptedAtISO),
        ip_address: clientIp,
        user_agent: userAgent,
        // Las relaciones event_registration_id y member_id se vincularán después
      }
    });

    logger.log('✅ Aceptación guardada exitosamente:', {
      id: acceptance.id,
      eventId: acceptance.event_id,
      participant: acceptance.participant_full_name,
      acceptedAt: acceptance.accepted_at
    });

    return NextResponse.json({ 
      success: true, 
      acceptanceId: acceptance.id,
      message: 'Pliego de descargo aceptado correctamente'
    });

  } catch (error: any) {
    logger.error('❌ Error al guardar aceptación:', error);
    
    // Error específico de Prisma
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe una aceptación para este participante' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al guardar aceptación', details: error.message },
      { status: 500 }
    );
  }
}