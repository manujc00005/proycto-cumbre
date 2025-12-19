// ========================================
// TYPES CENTRALIZADOS - WAIVERS Y TÉRMINOS
// lib/waivers/types.ts
// ========================================

// ========================================
// META INFORMACIÓN DEL EVENTO
// ========================================

export interface EventMeta {
  eventId: string; // UUID del evento
  eventName: string; // Nombre completo
  eventDateISO: string; // Fecha ISO: "2026-01-23"
  eventLocation: string; // Ubicación: "Málaga, Andalucía"
  modalityName: string; // Modalidad: "11K Trail Nocturno"
  rulesUrl?: string; // URL opcional al reglamento PDF
}

// ========================================
// DESCARGO DE RESPONSABILIDAD (WAIVER)
// ========================================

export interface WaiverDefinition {
  id: string; // ID del waiver (normalmente igual a eventId)
  title: string; // Título del documento
  version: string; // Versión: "v1.0"
  effectiveFromISO: string; // Fecha efectiva: "2024-12-13"
  text: string; // Texto completo del descargo
}

// ========================================
// TÉRMINOS Y CONDICIONES
// ========================================

export interface TermsDefinition {
  id: string; // ID de los términos (normalmente igual a eventId)
  title: string; // Título del documento
  version: string; // Versión: "v1.0"
  effectiveFromISO: string; // Fecha efectiva: "2024-12-13"
  lastUpdatedText?: string; // Texto opcional: "13 de diciembre de 2024"
  text: string; // Texto completo de los términos
}

// ========================================
// EVENTO COMPLETO (con waiver inline)
// ========================================

export interface WaiverEvent extends EventMeta {
  waiverVersion: string; // Versión del waiver asociado
  waiverText: string; // Texto completo del waiver
}

// ========================================
// ITEM DEL REGISTRY (COMPLETO)
// ========================================

export interface WaiverRegistryItem {
  meta: EventMeta; // Información del evento
  waiver: WaiverDefinition; // Descargo de responsabilidad
  terms: TermsDefinition; // Términos y condiciones
}

// ========================================
// PAYLOAD DE ACEPTACIÓN
// ========================================

export interface WaiverAcceptancePayload {
  eventId: string;
  waiverVersion: string;
  acceptedAtISO: string;
  participantFullName: string;
  participantDocumentId: string;
  participantBirthDateISO?: string;
  waiverTextHash: string;
}

// ========================================
// PROPS PARA COMPONENTE WAIVERACCEP TANCE
// ========================================

export interface WaiverAcceptanceProps {
  event: WaiverEvent;
  participant: {
    fullName: string;
    documentId: string;
    birthDateISO?: string;
  };
  onAccept: (
    payload: WaiverAcceptancePayload,
  ) => Promise<{ acceptanceId: string }>;
  className?: string;
  organizer?: {
    name: string;
    nif?: string;
    address?: string;
    privacyEmail?: string;
    phone?: string;
  };
  ui?: {
    showRulesButton?: boolean;
    requireRules?: boolean;
  };
}

// ========================================
// HELPERS
// ========================================

export type WaiverVersionMap = Record<string, WaiverDefinition>;
export type WaiverRegistry = Record<string, WaiverVersionMap>;
