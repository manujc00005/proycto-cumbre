// ========================================
// CALLBACKS GENÉRICOS PARA TODOS LOS EVENTOS
// ✅ Reutilizables y configurables con LOGS DETALLADOS
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
        eventId,
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
// ✅ CALLBACK 3: onPaymentStart (CON LOGS DETALLADOS)
// ========================================
export const handlePaymentStart = (eventId: string, eventSlug: string) => async (
  data: any
): Promise<{ url: string }> => {
  try {
    console.log('='.repeat(80));
    console.log('🚀 INICIO handlePaymentStart');
    console.log('='.repeat(80));
    
    // 🔍 LOG CRÍTICO: Ver TODO el objeto data RAW
    console.log('📥 DATA RAW COMPLETO:');
    console.log(JSON.stringify(data, null, 2));
    
    console.log('🔍 CAMPOS ESPECÍFICOS:');
    console.log({
      name: data.name,
      nameType: typeof data.name,
      nameLength: data.name?.length,
      email: data.email,
      phone: data.phone,
      dni: data.dni,
      shirtSize: data.shirtSize,
      waiverAcceptanceId: data.waiver_acceptance_id,
      hasDiscount: !!data.discount,
    });
    
    // 🔍 Ver si los campos de consentimiento existen
    console.log('🔍 CONSENTIMIENTOS:');
    console.log({
      privacy_accepted: data.privacy_accepted,
      whatsapp_consent: data.whatsapp_consent,
      marketing_consent: data.marketing_consent,
    });
    
    // 2️⃣ Construir payload estructurado
    const payload = {
      eventId,
      
      // Datos del participante
      name: data.name,
      email: data.email,
      phone: data.phone,
      dni: data.dni,
      ...(data.shirtSize && { shirtSize: data.shirtSize }),
      
      // Consentimientos (REQUERIDO por el schema)
      consents: {
        privacy_accepted: data.privacy_accepted ?? true,
        whatsapp_consent: data.whatsapp_consent ?? true,
        marketing_consent: data.marketing_consent ?? false,
        privacy_accepted_at: data.privacy_accepted_at || new Date().toISOString(),
        whatsapp_consent_at: data.whatsapp_consent_at || new Date().toISOString(),
      },
      
      // Waiver acceptance
      ...(data.waiver_acceptance_id && { 
        waiver_acceptance_id: data.waiver_acceptance_id 
      }),
      
      // Descuento
      ...(data.discount && { discount: data.discount }),
      
      // Campos custom
      ...(data.custom_fields && { custom_fields: data.custom_fields }),
    };
    
    // 3️⃣ Log del payload completo
    console.log('📤 PAYLOAD A ENVIAR:');
    console.log(JSON.stringify(payload, null, 2));
    
    console.log('📊 ESTRUCTURA DEL PAYLOAD:');
    console.log({
      keys: Object.keys(payload),
      hasEventId: !!payload.eventId,
      hasName: !!payload.name,
      hasEmail: !!payload.email,
      hasPhone: !!payload.phone,
      hasDni: !!payload.dni,
      hasConsents: !!payload.consents,
      consentsKeys: payload.consents ? Object.keys(payload.consents) : [],
      hasWaiverAcceptance: !!(payload as any).waiver_acceptance_id,
      hasDiscount: !!(payload as any).discount,
    });
    
    // 4️⃣ Hacer el fetch
    console.log('🌐 Llamando a /api/events/checkout...');
    
    const response = await fetch('/api/events/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    // 5️⃣ Log de respuesta
    console.log('📨 RESPUESTA RECIBIDA:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    });
    
    // 6️⃣ Parsear respuesta
    const result = await response.json();
    
    console.log('📄 BODY DE RESPUESTA:');
    console.log(JSON.stringify(result, null, 2));
    
    if (!response.ok) {
      console.error('❌ ERROR EN RESPUESTA:', {
        status: response.status,
        error: result.error,
        details: result.details,
        received: result.received,
      });
      
      throw new Error(result.error || 'Error al procesar el pago');
    }
    
    // 7️⃣ Success
    console.log('✅ PAGO INICIADO CON ÉXITO:', {
      sessionId: result.sessionId,
      isTest: result.isTest,
      hasUrl: !!result.url,
    });
    
    console.log('='.repeat(80));
    console.log('🏁 FIN handlePaymentStart');
    console.log('='.repeat(80));
    
    logger.log(`✅ [${eventId}] Sesión creada: ${result.sessionId}`);
    
    return result;
    
  } catch (error: any) {
    console.error('='.repeat(80));
    console.error('💥 ERROR CAPTURADO EN handlePaymentStart');
    console.error('='.repeat(80));
    console.error('Error object:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    logger.error(`❌ [${eventId}] Error en pago:`, error.message);
    throw error;
  }
};

// ========================================
// ✅ FACTORY: Crear callbacks para un evento
// ========================================
export function createEventCallbacks(eventId: string, eventSlug: string) {
  console.log('🏭 Creando callbacks para evento:', { eventId, eventSlug });
  
  return {
    onFormDraft: handleFormDraft(eventSlug),
    onWaiverAccept: handleWaiverAccept(eventId),
    onPaymentStart: handlePaymentStart(eventId, eventSlug), // ← Ahora recibe eventSlug
  };
}