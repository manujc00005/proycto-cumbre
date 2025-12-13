// ========================================
// API: Obtener TODOS los usuarios con consentimientos RGPD
// Incluye: members + event_registrations (unificados sin duplicados)
// app/api/gestor/rgpd-users/route.ts
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

interface RGPDUser {
  id: string;
  name: string;
  email: string;
  type: 'member' | 'event_only' | 'both'; // 🆕
  member_id?: string | null;
  member_number?: string | null;
  privacy_policy_version: string;
  whatsapp_consent: boolean;
  whatsapp_revoked_at: Date | null;
  marketing_consent: boolean | null;
  marketing_revoked_at: Date | null;
  event_registrations?: Array<{
    event_name: string;
    event_slug: string;
    registered_at: Date;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    logger.log('📥 GET /api/gestor/rgpd-users - Obteniendo usuarios RGPD...');

    // ========================================
    // 1️⃣ OBTENER TODOS LOS MEMBERS (activos)
    // ========================================
    
    const members = await prisma.member.findMany({
      where: {
        deleted_at: null
      },
      select: {
        id: true,
        member_number: true,
        first_name: true,
        last_name: true,
        email: true,
        privacy_policy_version: true,
        whatsapp_consent: true,
        whatsapp_revoked_at: true,
        marketing_consent: true,
        marketing_revoked_at: true,
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // ========================================
    // 2️⃣ OBTENER TODAS LAS EVENT REGISTRATIONS
    // ========================================
    
    const eventRegistrations = await prisma.eventRegistration.findMany({
      include: {
        event: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // ========================================
    // 3️⃣ CREAR MAPA DE MEMBERS POR EMAIL
    // ========================================
    
    const membersByEmail = new Map<string, typeof members[0]>();
    members.forEach(member => {
      membersByEmail.set(member.email.toLowerCase(), member);
    });

    // ========================================
    // 4️⃣ PROCESAR Y UNIFICAR USUARIOS
    // ========================================
    
    const unifiedUsers: RGPDUser[] = [];
    const processedEmails = new Set<string>();

    // 4.1 - Procesar MEMBERS primero
    members.forEach(member => {
      const email = member.email.toLowerCase();
      
      // Buscar si tiene event_registrations
      const userEventRegs = eventRegistrations.filter(
        reg => reg.participant_email.toLowerCase() === email
      );

      unifiedUsers.push({
        id: member.id,
        name: `${member.first_name} ${member.last_name}`,
        email: member.email,
        type: userEventRegs.length > 0 ? 'both' : 'member',
        member_id: member.id,
        member_number: member.member_number,
        privacy_policy_version: member.privacy_policy_version || '1.0',
        whatsapp_consent: member.whatsapp_consent || false,
        whatsapp_revoked_at: member.whatsapp_revoked_at,
        marketing_consent: member.marketing_consent,
        marketing_revoked_at: member.marketing_revoked_at,
        event_registrations: userEventRegs.map(reg => ({
          event_name: reg.event.name,
          event_slug: reg.event.slug,
          registered_at: reg.registered_at || reg.created_at
        }))
      });

      processedEmails.add(email);
    });

    // 4.2 - Procesar EVENT_REGISTRATIONS que NO son members
    eventRegistrations.forEach(reg => {
      const email = reg.participant_email.toLowerCase();
      
      // Si ya procesamos este email (es member), skip
      if (processedEmails.has(email)) {
        return;
      }

      // Verificar si ya agregamos este email como event_only
      const existingEventOnly = unifiedUsers.find(
        u => u.email.toLowerCase() === email && u.type === 'event_only'
      );

      if (existingEventOnly) {
        // Agregar este evento a la lista
        existingEventOnly.event_registrations?.push({
          event_name: reg.event.name,
          event_slug: reg.event.slug,
          registered_at: reg.registered_at || reg.created_at
        });
      } else {
        // Crear nuevo usuario event_only
        unifiedUsers.push({
          id: reg.id,
          name: reg.participant_name,
          email: reg.participant_email,
          type: 'event_only',
          member_id: null,
          member_number: null,
          privacy_policy_version: reg.privacy_policy_version || '1.0',
          whatsapp_consent: reg.whatsapp_consent || false,
          whatsapp_revoked_at: null, // event_registrations no tiene revoke
          marketing_consent: null, // event_registrations no tiene marketing
          marketing_revoked_at: null,
          event_registrations: [{
            event_name: reg.event.name,
            event_slug: reg.event.slug,
            registered_at: reg.registered_at || reg.created_at
          }]
        });

        processedEmails.add(email);
      }
    });

    // ========================================
    // 5️⃣ ESTADÍSTICAS
    // ========================================
    
    const stats = {
      total: unifiedUsers.length,
      members_only: unifiedUsers.filter(u => u.type === 'member').length,
      events_only: unifiedUsers.filter(u => u.type === 'event_only').length,
      both: unifiedUsers.filter(u => u.type === 'both').length,
      whatsapp_active: unifiedUsers.filter(u => 
        u.whatsapp_consent && !u.whatsapp_revoked_at
      ).length,
      marketing_active: unifiedUsers.filter(u => 
        u.marketing_consent && !u.marketing_revoked_at
      ).length
    };

    logger.log('📋 Usuarios RGPD unificados obtenidos:', stats);

    return NextResponse.json({
      success: true,
      users: unifiedUsers,
      stats
    });

  } catch (error: any) {
    logger.error('❌ Error al obtener usuarios RGPD:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios', details: error.message },
      { status: 500 }
    );
  }
}
