// /api/members/route.ts - VERSIÓN FINAL CON RGPD

import { NextRequest, NextResponse } from "next/server";
import {
  LicenseType,
  FedmeStatus,
  Sex,
  MembershipStatus,
} from "@prisma/client";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma"; // 👈 Usar singleton

// ✅ NO HAY MAPPING - Los IDs ya coinciden entre frontend y BD
const VALID_LICENSE_TYPES: LicenseType[] = [
  "none",
  "a",
  "a_plus",
  "a_nac",
  "a_nac_plus",
  "b",
  "b_plus",
  "c",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { overwrite, consents, ...formData } = body;

    // 🆕 CAPTURAR IP
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");

    const ipAddress = forwardedFor?.split(",")[0].trim() || realIp || "unknown";

    logger.apiStart("POST", "/api/members", {
      email: formData.email,
      dni: formData.dni,
      licenseType: formData.licenseType,
      hasConsents: !!consents,
      ip: ipAddress,
    });

    // 🆕 LOG DE CONSENTIMIENTOS RECIBIDOS
    if (consents) {
      logger.log("📋 Consentimientos RGPD recibidos:", {
        privacy: consents.privacy_accepted,
        marketing: consents.marketing_consent || true,
        whatsapp: consents.whatsapp_consent || false,
      });
    }

    // Validaciones
    const errors: Record<string, string> = {};

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido";
    }

    if (
      !formData.dni ||
      !/^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/i.test(formData.dni)
    ) {
      errors.dni = "Formato de DNI/NIE inválido";
    }

    if (
      !formData.phone ||
      !/^[0-9]{9}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      errors.phone = "El teléfono debe tener 9 dígitos";
    }

    if (!["M", "F", "O"].includes(formData.sex)) {
      errors.sex = "Sexo inválido";
    }

    // ✅ Validar licenseType
    if (!formData.licenseType) {
      errors.licenseType = "Debes seleccionar una modalidad de licencia";
    } else if (
      !VALID_LICENSE_TYPES.includes(formData.licenseType as LicenseType)
    ) {
      errors.licenseType = "Tipo de licencia inválido";
      logger.error(`❌ Licencia inválida recibida: "${formData.licenseType}"`);
    }

    // 🆕 VALIDAR CONSENTIMIENTOS RGPD
    if (!consents || !consents.privacy_accepted) {
      errors.privacy = "Debes aceptar la Política de Privacidad para continuar";
    }

    if (Object.keys(errors).length > 0) {
      logger.apiError("Errores de validación", errors);
      return NextResponse.json(
        { error: "Errores de validación", errors },
        { status: 400 },
      );
    }

    // Buscar socio existente
    const existingMember = await prisma.member.findFirst({
      where: {
        OR: [{ email: formData.email }, { dni: formData.dni }],
      },
    });

    if (existingMember && !overwrite) {
      return NextResponse.json(
        {
          error: "Ya existe un socio registrado con estos datos",
          errors: {
            email:
              existingMember.email === formData.email
                ? "Este email ya está registrado"
                : "",
            dni:
              existingMember.dni === formData.dni
                ? "Este DNI ya está registrado"
                : "",
          },
          existingMemberId: existingMember.id,
        },
        { status: 409 },
      );
    }

    // Obtener sede
    const headquarters = await prisma.headquarters.findUnique({
      where: { code: "MAL" },
    });

    if (!headquarters) {
      return NextResponse.json(
        { error: "No se encontró la sede de Málaga (MAL)" },
        { status: 400 },
      );
    }

    // Generar número de socio
    const memberNumber = await generateMemberNumber(headquarters.code);

    // ✅ Tipar correctamente con enums de Prisma
    const licenseType = formData.licenseType as LicenseType;
    const fedmeStatus: FedmeStatus =
      licenseType === "none" ? "none" : "pending";
    const membershipStatus: MembershipStatus = "pending";

    logger.log("✅ Tipo de licencia:", licenseType);

    // Preparar datos del member
    const memberData = {
      headquarters_id: headquarters.id,
      member_number: memberNumber,
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      birth_date: new Date(formData.birthDate),
      dni: formData.dni.toUpperCase(),
      sex: formData.sex as Sex,
      phone: formData.phone,
      emergency_phone: formData.emergencyPhone || null,
      emergency_contact_name: formData.emergencyContactName || null,
      province: formData.province,
      city: formData.city || null,
      address: formData.address,
      postal_code: formData.postalCode || null,
      shirt_size: formData.shirtSize || null,
      hoodie_size: formData.hoodieSize || null,
      pants_size: formData.pantsSize || null,
      license_type: licenseType,
      fedme_status: fedmeStatus,
      membership_status: membershipStatus,
      membership_start_date: null,
      membership_end_date: null,

      // 🆕 CAMPOS RGPD
      privacy_accepted: consents.privacy_accepted,
      privacy_accepted_at: consents.privacy_accepted_at
        ? new Date(consents.privacy_accepted_at)
        : new Date(),
      privacy_accepted_ip: ipAddress,
      privacy_policy_version: "1.0",

      whatsapp_consent: consents.whatsapp_consent || false,
      whatsapp_consent_at:
        consents.whatsapp_consent && consents.whatsapp_consent_at
          ? new Date(consents.whatsapp_consent_at)
          : null,
      whatsapp_revoked_at: null,
      marketing_consent: true,
      marketing_consent_at: new Date(),
      marketing_revoked_at: null,
    };

    logger.log("📦 Guardando:", {
      license_type: memberData.license_type,
      fedme_status: memberData.fedme_status,
      privacy_accepted: memberData.privacy_accepted,
      whatsapp_consent: memberData.whatsapp_consent,
      ip: memberData.privacy_accepted_ip,
    });

    let member;

    if (existingMember && overwrite) {
      // Para UPDATE, no incluir headquarters_id (es una relación)
      const { headquarters_id, ...updateData } = memberData;

      member = await prisma.member.update({
        where: { id: existingMember.id },
        data: { ...updateData, updated_at: new Date() },
      });
      logger.log("✅ Socio actualizado con RGPD");
    } else {
      member = await prisma.member.create({
        data: memberData,
      });
      logger.apiSuccess("Socio creado con RGPD", {
        id: member.id,
        license_type: member.license_type,
        fedme_status: member.fedme_status,
        privacy_accepted: member.privacy_accepted,
        whatsapp_consent: member.whatsapp_consent,
        ip: member.privacy_accepted_ip,
      });
    }

    logger.log("✅ Guardado en BD con RGPD:", {
      id: member.id,
      email: member.email,
      license_type: member.license_type,
      fedme_status: member.fedme_status,
      privacy_accepted: member.privacy_accepted,
      privacy_accepted_at: member.privacy_accepted_at?.toISOString(),
      privacy_accepted_ip: member.privacy_accepted_ip,
      marketing_consent: member.marketing_consent,
      whatsapp_consent: member.whatsapp_consent,
    });

    return NextResponse.json(
      {
        success: true,
        message: existingMember ? "Socio actualizado" : "Socio creado",
        member: {
          id: member.id,
          member_number: member.member_number,
          email: member.email,
          first_name: member.first_name,
          last_name: member.last_name,
          license_type: member.license_type,
          membership_status: member.membership_status,
          fedme_status: member.fedme_status,
          // 🆕 Incluir info RGPD en respuesta
          privacy_accepted: member.privacy_accepted,
          whatsapp_consent: member.whatsapp_consent,
        },
      },
      { status: existingMember ? 200 : 201 },
    );
  } catch (error: any) {
    logger.error("❌ Error en /api/members:", {
      message: error.message,
      code: error.code,
      stack: error.stack?.split("\n").slice(0, 3).join("\n"),
    });

    if (error.code === "P2007") {
      return NextResponse.json(
        { error: "Tipo de dato inválido", details: error.message },
        { status: 400 },
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe un registro con estos datos", details: error.meta },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 },
    );
  }
  // 👈 SIN finally con $disconnect (usamos singleton)
}

async function generateMemberNumber(headquartersCode: string): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `${headquartersCode}-${currentYear}`;

  const lastMember = await prisma.member.findFirst({
    where: {
      member_number: {
        startsWith: prefix,
      },
    },
    orderBy: {
      member_number: "desc",
    },
  });

  let nextNumber = 1;

  if (lastMember && lastMember.member_number) {
    const parts = lastMember.member_number.split("-");
    const lastSequence = parseInt(parts[2], 10);
    nextNumber = lastSequence + 1;
  }

  const sequenceFormatted = nextNumber.toString().padStart(4, "0");
  return `${prefix}-${sequenceFormatted}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const checkOnly = searchParams.get("check"); // 🆕 Nuevo parámetro

  // CASO 1: Verificación rápida (eventos)
  if (email && checkOnly === "true") {
    const member = await prisma.member.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        member_number: true,
        membership_status: true,
        deleted_at: true,
      },
    });

    const isMember =
      !!member &&
      member.membership_status === "active" &&
      member.deleted_at === null;

    return NextResponse.json({
      isMember,
      memberNumber: isMember ? member.member_number : null,
    });
  }

  // CASO 2: Consulta completa
  if (email) {
    const member = await prisma.member.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!member || member.deleted_at !== null) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, member });
  }

  // CASO 3: Lista de todos los miembros
  const members = await prisma.member.findMany({
    where: { deleted_at: null },
  });
  return NextResponse.json({ success: true, count: members.length, members });
}
