import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";
import { EmailService } from "@/lib/mail/email-service";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { memberId, memberNumber } = await request.json();

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID es requerido" },
        { status: 400 },
      );
    }

    logger.log("📝 Procesando licencia para:", memberId);

    // Buscar el socio ANTES de actualizar para tener todos sus datos
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Socio no encontrado" },
        { status: 404 },
      );
    }

    // Extraer el año del member_number (MAL-2025-0001 -> 2025)
    let year = new Date().getFullYear();
    if (memberNumber) {
      const parts = memberNumber.split("-");
      if (parts.length >= 2) {
        const parsedYear = parseInt(parts[1], 10);
        if (!isNaN(parsedYear)) {
          year = parsedYear;
        }
      }
    }
    const membershipStartDate = new Date();

    const currentYear = membershipStartDate.getFullYear();
    const currentMonth = membershipStartDate.getMonth();
    const endYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const membershipEndDate = new Date(
      endYear,
      11, // diciembre
      31,
      23,
      59,
      59,
      999,
    );

    logger.log("📅 Inicio:", membershipStartDate.toISOString());
    logger.log("📅 Fin:", membershipEndDate.toISOString());
    logger.log("📅 Año calculado:", year);

    // Actualizar el socio
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        fedme_status: "active",
        membership_status: "active",
        membership_start_date: membershipStartDate,
        membership_end_date: membershipEndDate,
        updated_at: new Date(),
      },
    });

    logger.log("✅ Licencia procesada exitosamente");

    // 🔥 ENVIAR EMAIL DE LICENCIA ACTIVA (solo si tiene licencia)
    if (updatedMember.license_type && updatedMember.license_type !== "none") {
      try {
        await EmailService.sendLicenseActivated({
          email: updatedMember.email,
          firstName: updatedMember.first_name,
          memberNumber: updatedMember.member_number || "N/A",
          licenseType: updatedMember.license_type,
          validUntil: membershipEndDate,
        });
        logger.apiSuccess("Email de licencia activa enviado");
      } catch (emailError: any) {
        // No romper el proceso si falla el email
        logger.error("⚠️ Error enviando email de licencia activa:", emailError);
        // Registrar en admin_notes
        await prisma.member.update({
          where: { id: memberId },
          data: {
            admin_notes:
              `${member.admin_notes || ""}\n[${new Date().toISOString()}] Error enviando email de licencia activa: ${emailError.message}`.trim(),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Licencia marcada como procesada",
      member: updatedMember,
    });
  } catch (error: any) {
    logger.error("❌ Error procesando licencia:", error);
    return NextResponse.json(
      { error: "Error al procesar licencia", details: error.message },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
