// ========================================
// REGISTRY CENTRALIZADO - ÚNICA FUENTE DE VERDAD
// lib/waivers/registry.ts
// ========================================

import { MISA_EVENT_ID, MISA_SLUG } from "../funnels/configs/misa";
import { MISA_META, MISA_TERMS_V1, MISA_WAIVER_V1 } from "../waivers/pliegos/misa.v1";
import { WaiverRegistryItem } from "../waivers/types";



// ========================================
// ARRAY PRINCIPAL - ÚNICA FUENTE DE VERDAD
// ========================================
export const WAIVER_REGISTRY: Array<WaiverRegistryItem & { eventId: string; slug: string }> = [
  {
    eventId: MISA_EVENT_ID,
    slug: MISA_SLUG,
    meta: MISA_META,
    waiver: MISA_WAIVER_V1,
    terms: MISA_TERMS_V1,
  },
  // Añadir más eventos aquí...
  // {
  //   eventId: 'otro-uuid',
  //   slug: 'otro-evento',
  //   meta: OTRO_META,
  //   waiver: OTRO_WAIVER,
  //   terms: OTRO_TERMS,
  // },
];

// ========================================
// MAPAS DERIVADOS (auto-generados)
// ========================================

/**
 * Buscar evento por UUID
 * @example WAIVER_REGISTRY_BY_EVENT_ID['ba063181-9a20-466d-9400-246842b547a0']
 */
export const WAIVER_REGISTRY_BY_EVENT_ID: Record<string, WaiverRegistryItem> =
  Object.fromEntries(
    WAIVER_REGISTRY.map((item) => [
      item.eventId,
      {
        meta: item.meta,
        waiver: item.waiver,
        terms: item.terms,
      },
    ])
  );

/**
 * Convertir slug → eventId
 * @example SLUG_TO_EVENT_ID['misa'] → 'ba063181-...'
 */
export const SLUG_TO_EVENT_ID: Record<string, string> =
  Object.fromEntries(
    WAIVER_REGISTRY.map((item) => [item.slug, item.eventId])
  );

/**
 * Convertir eventId → slug
 * @example EVENT_ID_TO_SLUG['ba063181-...'] → 'misa'
 */
export const EVENT_ID_TO_SLUG: Record<string, string> =
  Object.fromEntries(
    WAIVER_REGISTRY.map((item) => [item.eventId, item.slug])
  );

/**
 * Buscar evento por slug
 * @example WAIVER_REGISTRY_BY_SLUG['misa']
 */
export const WAIVER_REGISTRY_BY_SLUG: Record<string, WaiverRegistryItem> =
  Object.fromEntries(
    WAIVER_REGISTRY.map((item) => [
      item.slug,
      {
        meta: item.meta,
        waiver: item.waiver,
        terms: item.terms,
      },
    ])
  );

// ========================================
// HELPERS
// ========================================

/**
 * Obtener evento completo por slug
 */
export function getEventBySlug(slug: string): WaiverRegistryItem | null {
  return WAIVER_REGISTRY_BY_SLUG[slug] || null;
}

/**
 * Obtener evento completo por eventId
 */
export function getEventById(eventId: string): WaiverRegistryItem | null {
  return WAIVER_REGISTRY_BY_EVENT_ID[eventId] || null;
}

/**
 * Obtener slug desde eventId
 */
export function getSlugFromEventId(eventId: string): string | null {
  return EVENT_ID_TO_SLUG[eventId] || null;
}

/**
 * Obtener eventId desde slug
 */
export function getEventIdFromSlug(slug: string): string | null {
  return SLUG_TO_EVENT_ID[slug] || null;
}

/**
 * Verificar si un slug existe
 */
export function slugExists(slug: string): boolean {
  return slug in WAIVER_REGISTRY_BY_SLUG;
}

/**
 * Verificar si un eventId existe
 */
export function eventIdExists(eventId: string): boolean {
  return eventId in WAIVER_REGISTRY_BY_EVENT_ID;
}

/**
 * Obtener todos los slugs registrados
 */
export function getAllSlugs(): string[] {
  return WAIVER_REGISTRY.map((item) => item.slug);
}

/**
 * Obtener todos los eventIds registrados
 */
export function getAllEventIds(): string[] {
  return WAIVER_REGISTRY.map((item) => item.eventId);
}
