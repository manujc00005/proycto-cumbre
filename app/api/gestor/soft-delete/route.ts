// ========================================
// API: Soft Delete Usuario
// Solo funciona para members
// app/api/gestor/rgpd/soft-delete/route.ts
// ========================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const { userId, reason } = await request.json(); // 🔧 Cambiado de memberId a userId

    if (!userId) {
      return NextResponse.json(
        { error: "userId es requerido" },
        { status: 400 },
      );
    }

    logger.log("📥 POST /api/gestor/rgpd/soft-delete", { userId, reason });

    // ========================================
    // VERIFICAR QUE ES UN MEMBER
    // ========================================

    const currentMember = await prisma.member.findUnique({
      where: { id: userId },
      select: {
        id: true,
        admin_notes: true,
        member_number: true,
        first_name: true,
        last_name: true,
        email: true,
        deleted_at: true,
      },
    });

    if (!currentMember) {
      return NextResponse.json(
        {
          error:
            "Solo se pueden eliminar miembros registrados. Los participantes de eventos no se pueden eliminar.",
        },
        { status: 400 },
      );
    }

    if (currentMember.deleted_at) {
      return NextResponse.json(
        { error: "Este usuario ya está eliminado" },
        { status: 400 },
      );
    }

    // ========================================
    // SOFT DELETE + ANONIMIZACIÓN
    // ========================================

    const timestamp = Date.now();
    const member = await prisma.member.update({
      where: { id: userId },
      data: {
        deleted_at: new Date(),

        // Anonimizar datos sensibles
        email: `deleted-${timestamp}@anonymous.local`,
        phone: "000000000",
        address: "DELETED",
        dni: null,

        // Revocar consentimientos automáticamente
        marketing_revoked_at: new Date(),
        whatsapp_revoked_at: new Date(),

        // Preservar notas anteriores + añadir razón de eliminación
        admin_notes: reason
          ? `DELETED: ${reason}. Previous notes: ${currentMember.admin_notes || "none"}`
          : `DELETED. Previous notes: ${currentMember.admin_notes || "none"}`,
      },
    });

    logger.log("🗑️ Usuario soft deleted:", {
      id: member.id,
      original_email: currentMember.email,
      member_number: currentMember.member_number,
      name: `${currentMember.first_name} ${currentMember.last_name}`,
      reason: reason || "No especificado",
      deleted_at: member.deleted_at,
    });

    return NextResponse.json({
      success: true,
      message:
        "Usuario eliminado correctamente. Los datos se conservan para cumplimiento legal.",
      member: {
        id: member.id,
        member_number: currentMember.member_number,
        deleted_at: member.deleted_at,
      },
    });
  } catch (error: any) {
    logger.error("❌ Error en soft delete:", error);

    // Error específico si el usuario no existe
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Error al eliminar usuario", details: error.message },
      { status: 500 },
    );
  }
}
