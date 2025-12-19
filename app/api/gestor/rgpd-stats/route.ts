// ========================================
// API: Estadísticas RGPD ACTUALIZADA
// Incluye members + event_registrations
// app/api/gestor/rgpd-stats/route.ts
// ========================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    // ========================================
    // 1️⃣ ESTADÍSTICAS DE MEMBERS
    // ========================================

    const totalActiveMembers = await prisma.member.count({
      where: { deleted_at: null },
    });

    const totalDeletedMembers = await prisma.member.count({
      where: { deleted_at: { not: null } },
    });

    const membersByPolicyVersion = await prisma.member.groupBy({
      by: ["privacy_policy_version"],
      where: { deleted_at: null },
      _count: true,
    });

    const membersWithWhatsApp = await prisma.member.count({
      where: {
        deleted_at: null,
        whatsapp_consent: true,
        whatsapp_revoked_at: null,
      },
    });

    const membersWhatsAppRevoked = await prisma.member.count({
      where: {
        deleted_at: null,
        whatsapp_revoked_at: { not: null },
      },
    });

    const membersWithMarketing = await prisma.member.count({
      where: {
        deleted_at: null,
        marketing_consent: true,
        marketing_revoked_at: null,
      },
    });

    const membersMarketingRevoked = await prisma.member.count({
      where: {
        deleted_at: null,
        marketing_revoked_at: { not: null },
      },
    });

    // ========================================
    // 2️⃣ ESTADÍSTICAS DE EVENT REGISTRATIONS
    // ========================================

    const totalEventRegistrations = await prisma.eventRegistration.count();

    const eventRegsByPolicyVersion = await prisma.eventRegistration.groupBy({
      by: ["privacy_policy_version"],
      _count: true,
    });

    const eventRegsWithWhatsApp = await prisma.eventRegistration.count({
      where: {
        whatsapp_consent: true,
      },
    });

    const eventRegsWithoutWhatsApp = await prisma.eventRegistration.count({
      where: {
        whatsapp_consent: false,
      },
    });

    // ========================================
    // 3️⃣ TOTALES COMBINADOS
    // ========================================

    const totalUsers = totalActiveMembers + totalEventRegistrations;
    const totalWhatsAppConsent = membersWithWhatsApp + eventRegsWithWhatsApp;
    const totalWhatsAppRevoked =
      membersWhatsAppRevoked + eventRegsWithoutWhatsApp;

    const stats = {
      // Totales generales
      total: {
        active: totalActiveMembers,
        deleted: totalDeletedMembers,
        event_registrations: totalEventRegistrations,
        combined: totalUsers,
      },

      // Members
      members: {
        policy_versions: membersByPolicyVersion,
        whatsapp: {
          active: membersWithWhatsApp,
          revoked: membersWhatsAppRevoked,
          percentage:
            totalActiveMembers > 0
              ? Math.round((membersWithWhatsApp / totalActiveMembers) * 100)
              : 0,
        },
        marketing: {
          active: membersWithMarketing,
          revoked: membersMarketingRevoked,
          percentage:
            totalActiveMembers > 0
              ? Math.round((membersWithMarketing / totalActiveMembers) * 100)
              : 0,
        },
      },

      // Event Registrations
      event_registrations: {
        total: totalEventRegistrations,
        policy_versions: eventRegsByPolicyVersion,
        whatsapp: {
          active: eventRegsWithWhatsApp,
          revoked: eventRegsWithoutWhatsApp,
          percentage:
            totalEventRegistrations > 0
              ? Math.round(
                  (eventRegsWithWhatsApp / totalEventRegistrations) * 100,
                )
              : 0,
        },
      },

      // Combinado (para mostrar en UI)
      combined: {
        whatsapp: {
          active: totalWhatsAppConsent,
          revoked: totalWhatsAppRevoked,
          percentage:
            totalUsers > 0
              ? Math.round((totalWhatsAppConsent / totalUsers) * 100)
              : 0,
        },
      },
    };

    logger.log("📊 Stats RGPD obtenidas (members + events):", stats);

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    logger.error("❌ Error al obtener stats RGPD:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas", details: error.message },
      { status: 500 },
    );
  }
}
