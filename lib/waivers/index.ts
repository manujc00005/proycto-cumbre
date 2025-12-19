// ========================================
// INDEX FINAL (combina ambos sistemas)
// ========================================

import { WAIVER_REGISTRY_BY_EVENT_ID } from "../events/registry";

// 1️⃣ TYPES
export type { EventMeta, WaiverDefinition } from "./types";

// 2️⃣ REGISTRY (no duplica, importa todo)
export {
  WAIVER_REGISTRY,
  WAIVER_REGISTRY_BY_EVENT_ID, // ← Del registry
  SLUG_TO_EVENT_ID, // ← Del registry
  // ... todos los helpers
} from "../events/registry";

// 3️⃣ EVENTOS ESPECÍFICOS
export {
  MISA_META,
  MISA_WAIVER_V1,
  MISA_TERMS_V1,
  MISA_EVENT_v1,
} from "./pliegos/misa.v1";

// 4️⃣ HELPERS ADICIONALES (arreglados)
export function getWaiverOrThrow(eventId: string, version?: string) {
  const event = WAIVER_REGISTRY_BY_EVENT_ID[eventId]; // ✅ Funciona
  if (!event) throw new Error(`No waiver for event ${eventId}`);

  if (version && event.waiver.version !== version) {
    throw new Error(`Waiver version ${version} not found`);
  }

  return event.waiver;
}

export function getTermsOrThrow(eventId: string, version?: string) {
  const event = WAIVER_REGISTRY_BY_EVENT_ID[eventId];
  if (!event) throw new Error(`No terms for event ${eventId}`);

  if (version && event.terms.version !== version) {
    throw new Error(`Terms version ${version} not found`);
  }

  return event.terms;
}
