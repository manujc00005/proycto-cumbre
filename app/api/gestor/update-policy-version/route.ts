// ========================================
// 4. API: Actualizar Versión de Política
// app/api/gestor/update-policy-version/route.ts
// ========================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const { newVersion } = await request.json();

    if (!newVersion) {
      return NextResponse.json(
        { error: "newVersion es requerida" },
        { status: 400 },
      );
    }

    // Validar formato de versión (ej: "2.0", "2.1")
    if (!/^\d+\.\d+$/.test(newVersion)) {
      return NextResponse.json(
        { error: "Formato de versión inválido. Usa formato X.Y (ej: 2.0)" },
        { status: 400 },
      );
    }

    // Actualizar SOLO usuarios activos (sin soft delete)
    const result = await prisma.member.updateMany({
      where: {
        deleted_at: null, // Solo activos
      },
      data: {
        privacy_policy_version: newVersion,
        // Opcional: Actualizar fecha de aceptación
        // privacy_accepted_at: new Date()
      },
    });

    logger.log("📋 Versión de política actualizada:", {
      newVersion,
      updated: result.count,
    });

    return NextResponse.json({
      success: true,
      message: `Versión actualizada a ${newVersion}`,
      updated: result.count,
    });
  } catch (error: any) {
    logger.error("❌ Error al actualizar versión:", error);
    return NextResponse.json(
      {
        error: "Error al actualizar versión de política",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
