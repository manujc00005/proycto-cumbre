// ========================================
// CALLBACKS GENÉRICOS PARA TODOS LOS EVENTOS
// ✅ Reutilizables y configurables
// lib/funnels/callbacks.ts
// ========================================

import { WaiverAcceptancePayload } from '@/lib/waivers/types';
import { logger } from '@/lib/logger';

// ========================================
// ✅ CALLBACK 1: onFormDraft (genérico)
// ========================================
export const handleFormDraft = (eventSlug: string) => (data: any) => {
  logger.log(`📝 [${eventSlug}] Borrador actualizado`, {
    fields: Object.keys(data),
    email: data.email || 'sin email',
  });
  
  // Aquí podrías añadir lógica adicional:
  // - Analytics
  // - Guardar en servidor
  // - etc.
};

// ========================================
// ✅ CALLBACK 2: onWaiverAccept (genérico)
// ========================================
export const handleWaiverAccept = (eventId: string) => async (
  payload: WaiverAcceptancePayload
): Promise<{ acceptanceId: string }> => {
  try {
    logger.log(`📋 [${eventId}] Enviando aceptación de pliego...`);
    
    const response = await fetch('/api/events/waiver-acceptance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        eventId, // ← UUID del evento
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al guardar aceptación');
    }
    
    const result = await response.json();
    
    logger.log(`✅ [${eventId}] Pliego aceptado: ${result.acceptanceId}`);
    
    return { acceptanceId: result.acceptanceId };
  } catch (error: any) {
    logger.error(`❌ [${eventId}] Error en waiver:`, error.message);
    throw error;
  }
};

// ========================================
// ✅ CALLBACK 3: onPaymentStart (genérico)
// ========================================
export const handlePaymentStart = (eventId: string) => async (
  data: any
): Promise<{ url: string }> => {
  try {
    logger.log(`💳 [${eventId}] Iniciando pago...`, {
      email: data.email,
      hasDiscount: data.discount?.applied || false,
    });
    
    const response = await fetch('/api/events/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        eventId, // ← UUID del evento
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al procesar el pago');
    }
    
    const result = await response.json();
    
    logger.log(`✅ [${eventId}] Sesión creada: ${result.sessionId}`);
    
    return result;
  } catch (error: any) {
    logger.error(`❌ [${eventId}] Error en pago:`, error.message);
    throw error;
  }
};

// ========================================
// ✅ FACTORY: Crear callbacks para un evento
// ========================================
export function createEventCallbacks(eventId: string, eventSlug: string) {
  return {
    onFormDraft: handleFormDraft(eventSlug),
    onWaiverAccept: handleWaiverAccept(eventId),
    onPaymentStart: handlePaymentStart(eventId),
  };
}
