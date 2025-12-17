// ========================================
// CONFIGURACIÓN FUNNEL PARA MISA 2026
// lib/funnels/configs/misa-2026.ts
// ========================================

import { EventFunnelConfig } from '../types';
import { MISA_2026_EVENT_v1 } from '@/lib/waivers/pliegos/misa-2026.v1';


export const MISA_2026_EVENT_ID = 'ba063181-9a20-466d-9400-246842b547a0';
export const MISA_2026_SLUG = 'misa-2026';
export const MISA_2026_NAME = 'MISA - Ritual Furtivo';

export const MISA_2026_FUNNEL: EventFunnelConfig = {
  eventId: MISA_2026_EVENT_ID,
  eventSlug: MISA_2026_SLUG,
  eventName: MISA_2026_NAME,
  
  // ========================================
  // PASO 1: FORMULARIO
  // ========================================
  formFields: [
    {
      id: 'name',
      type: 'text',
      label: 'Nombre completo',
      placeholder: 'Tu nombre',
      required: true,
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'tu@email.com',
      required: true,
      validation: (value) => {
        if (!/\S+@\S+\.\S+/.test(value)) {
          return 'Email inválido';
        }
        return null;
      },
    },
    {
      id: 'phone',
      type: 'tel',
      label: 'Móvil',
      placeholder: '+34 600 000 000',
      required: true,
    },
    {
      id: 'dni',
      type: 'dni',
      label: 'DNI/NIE',
      placeholder: '12345678A',
      required: true,
      validation: (value) => {
        const dniRegex = /^[0-9]{8}[A-Za-z]$/;
        const nieRegex = /^[XYZ][0-9]{7}[A-Za-z]$/;
        const upperValue = value.toUpperCase();
        if (!dniRegex.test(upperValue) && !nieRegex.test(upperValue)) {
          return 'DNI/NIE inválido (ej: 12345678A)';
        }
        return null;
      },
      helperText: 'Formato válido: 12345678A',
      maxLength: 9,
    },
    {
      id: 'shirtSize',
      type: 'select',
      label: 'Talla de camiseta',
      required: true,
      options: [
        { value: 'XS', label: 'XS' },
        { value: 'S', label: 'S' },
        { value: 'M', label: 'M' },
        { value: 'L', label: 'L' },
        { value: 'XL', label: 'XL' },
        { value: 'XXL', label: 'XXL' },
      ],
    },
  ],
  
  // ========================================
  // PASO 2: PLIEGO (OBLIGATORIO)
  // ========================================
  waiver: {
    event: MISA_2026_EVENT_v1,
    required: true,
  },
  
  // ========================================
  // PASO 3: PAGO
  // ========================================
  payment: {
    amount: 2000, // 20€ en céntimos
    currency: 'EUR',
    description: 'MISA - Ritual Furtivo 2026',
    checkoutUrl: '/api/events/checkout', // ← Ruta genérica
  },
  
  // ========================================
  // RGPD
  // ========================================
  gdpr: {
    includeWhatsApp: true,
    whatsappRequired: true,
    whatsappContext: 'event',
  },
  
  // ========================================
  // CALLBACKS
  // ========================================
  onFormDraft: (data) => {
    console.log('📝 Borrador actualizado', Object.keys(data));
  },
  
  onWaiverAccept: async (payload) => {
    const response = await fetch('/api/events/waiver-acceptance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        eventId: 'ba063181-9a20-466d-9400-246842b547a0', // UUID del evento
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al guardar aceptación');
    }
    
    const result = await response.json();
    return { acceptanceId: result.acceptanceId };
  },
  
  onPaymentStart: async (data) => {
    const response = await fetch('/api/events/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        eventId: 'ba063181-9a20-466d-9400-246842b547a0', // UUID del evento
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al procesar el pago');
    }
    
    return response.json();
  },
};
