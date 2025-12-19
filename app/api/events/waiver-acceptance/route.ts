import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import crypto from "crypto";
import { getWaiverOrThrow } from "@/lib/waivers";

// Canoniza para que el hash sea estable (CRLF vs LF, etc.)
function canonicalizeText(input: string) {
  return input.replace(/\r\n/g, "\n").trim();
}

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

function getClientIp(request: NextRequest) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // ========================================
    // 1) VALIDACIONES MINIMAS (NO confiar en hash/version/timestamp del cliente)
    // ========================================
    // Recomendado: que el cliente mande email para poder linkar member_id
    if (
      !payload?.eventId ||
      !payload?.participantFullName ||
      !payload?.participantDocumentId
    ) {
      return NextResponse.json(
        {
          error:
            "Faltan campos obligatorios (eventId, participantFullName, participantDocumentId)",
        },
        { status: 400 },
      );
    }

    // ========================================
    // 2.5) RESOLVER UUID DEL EVENTO (slug -> uuid)
    // ========================================
    logger.log("🧪 WAIVER ACCEPTANCE");
    logger.log(`   EventId: ${payload.eventId}`);
    logger.log(`   EventSlug: ${payload.eventSlug}`);
    logger.log(`   Participante: ${payload.participantFullName}`);
    const eventRow = await prisma.event.findUnique({
      where: { id: payload.eventId },
      select: { id: true, slug: true },
    });

    if (!eventRow) {
      return NextResponse.json(
        { error: `Evento no encontrado: ${payload.eventSlug}` },
        { status: 404 },
      );
    }

    const eventUuid = eventRow.id;

    // ========================================
    // 2) FUENTE DE VERDAD DEL PLIEGO (SERVER-SIDE)
    // ========================================
    let waiver;
    try {
      waiver = getWaiverOrThrow(payload.eventId, payload.waiverVersion);
    } catch (e: any) {
      return NextResponse.json(
        {
          error:
            e?.message ??
            "Pliego no encontrado evento=" +
              payload.eventName +
              ", version=" +
              payload.waiverVersion,
        },
        { status: 400 },
      );
    }

    // 📌 Resumen rápido (qué usar y cuándo)
    // Campo	Qué es	Para qué lo usas
    // waiverTextRaw	Texto original	Mostrar, PDF, prueba humana
    // waiverTextCanonical	Texto normalizado	Solo para hashing
    // waiverTextHash	Huella SHA-256	Auditoría, prueba legal, integridad
    const waiverVersion = waiver.version;
    const waiverTextRaw = waiver.text;

    const waiverTextCanonical = canonicalizeText(waiverTextRaw);
    const waiverTextHash = sha256Hex(waiverTextCanonical);

    // ========================================
    // 3) METADATA (SERVER-SIDE)
    // ========================================
    const clientIp = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "";
    const acceptedAt = new Date();

    logger.log("📝 Guardando aceptación de pliego (server-side truth):", {
      eventSlug: payload.eventId,
      eventUuid,
      participant: payload.participantFullName,
      version: waiverVersion,
      hash: waiverTextHash,
      ip: clientIp,
      ua: userAgent?.slice(0, 60),
      acceptedAt: acceptedAt.toISOString(),
    });

    // ========================================
    // 4) RESOLVER member_id + event_registration_id
    // ========================================
    let memberId: string | null = null;
    let eventRegistrationId: string | null = null;

    const email = payload.participantEmail?.toLowerCase?.().trim();
    const documentId = String(payload.participantDocumentId)
      .trim()
      .toUpperCase();

    // 4.1) member por email
    if (email) {
      const member = await prisma.member.findUnique({
        where: { email },
        select: { id: true },
      });
      memberId = member?.id ?? null;
    }

    // 4.2) member por DNI (fallback)
    if (!memberId) {
      const memberByDni = await prisma.member.findFirst({
        where: { dni: documentId },
        select: { id: true },
      });
      memberId = memberByDni?.id ?? null;
    }

    // 4.3) buscar EventRegistration del mismo evento (por email o DNI)
    const registration = await prisma.eventRegistration.findFirst({
      where: {
        event_id: eventUuid,
        OR: [
          ...(email ? [{ participant_email: email }] : []),
          { participant_dni: documentId },
        ],
      },
      select: { id: true, member_id: true },
    });

    eventRegistrationId = registration?.id ?? null;

    // 4.4) si EventRegistration ya tiene member_id, úsalo como fallback final
    if (!memberId && registration?.member_id) {
      memberId = registration.member_id;
    }

    // ========================================
    // 5) GUARDAR EN BD
    // ========================================
    const acceptance = await prisma.waiverAcceptance.create({
      data: {
        event_id: eventUuid,
        participant_full_name: payload.participantFullName,
        participant_document_id: payload.participantDocumentId,
        participant_birth_date: payload.participantBirthDateISO
          ? new Date(payload.participantBirthDateISO)
          : null,
        waiver_version: waiverVersion,
        waiver_text: waiverTextRaw,
        waiver_text_canonical: waiverTextCanonical,
        waiver_text_hash: waiverTextHash,
        accepted_at: acceptedAt,
        ip_address: clientIp,
        user_agent: userAgent,
        event_registration_id: eventRegistrationId,
        member_id: memberId, // 👈 VINCULACIÓN
      },
    });

    logger.log("✅ Aceptación guardada:", {
      id: acceptance.id,
      eventId: acceptance.event_id,
      version: acceptance.waiver_version,
      hash: acceptance.waiver_text_hash,
      memberId: acceptance.member_id,
      acceptedAt: acceptance.accepted_at.toISOString(),
    });

    return NextResponse.json({
      success: true,
      acceptanceId: acceptance.id,

      // útil para auditoría / debugging (no es sensible)
      waiverVersion: acceptance.waiver_version,
      waiverTextHash: acceptance.waiver_text_hash,
      acceptedAtISO: acceptance.accepted_at.toISOString(),
      memberId: acceptance.member_id,
      eventRegistrationId,
    });
  } catch (error: any) {
    logger.error("❌ Error al guardar aceptación:", error);

    if (error?.code === "P2002") {
      return NextResponse.json(
        {
          error:
            "Ya existe una aceptación para este participante en esta versión del pliego",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Error al guardar aceptación", details: error.message },
      { status: 500 },
    );
  }
}
