// ========================================
// CONFIGURACIÓN FUNNEL PARA MISA 2026
// ✅ Refactorizado con pricing y callbacks genéricos
// ========================================

import { EventFunnelConfig } from '../types';
import { MISA_EVENT_v1 } from '@/lib/waivers/pliegos/misa.v1';
import { createEventCallbacks } from '../callbacks';

export const MISA_EVENT_ID = 'ba063181-9a20-466d-9400-246842b547a0';
export const MISA_SLUG = 'misa';
export const MISA_NAME = 'MISA - Ritual Furtivo';

// ========================================
// ✅ CONFIGURACIÓN PRINCIPAL (SOLO DATOS)
// ========================================
export const MISA_FUNNEL: EventFunnelConfig = {
  eventId: MISA_EVENT_ID,
  eventSlug: MISA_SLUG,
  eventName: MISA_NAME,

  // ✅ NUEVO: Pricing unificado
  pricing: {
    amount: 2000, // 20€
    currency: 'EUR',
    description: 'MISA - Ritual Furtivo 2026',
    
    // ✅ Descuento para socios
    memberDiscount: {
      discountPercent: 20,
      requiresActiveMembership: true,
      description: 'Descuento para socios del club',
    },
  },
  
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
      validation: (value) => {
        if (!value || value.trim().length < 6) {
          return 'El nombre y apellidos debe tener al menos 6 caracteres';
        }
        return null;
      }
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
    event: MISA_EVENT_v1,
    required: true,
  },
  
  // ========================================
  // RGPD
  // ========================================
  gdpr: {
    includeWhatsApp: true,
    whatsappRequired: true,
    whatsappContext: 'event',
  },
};

// ========================================
// ✅ EXPORTAR CON CALLBACKS GENÉRICOS
// ========================================
export const MISA_FUNNEL_WITH_CALLBACKS = {
  ...MISA_FUNNEL,
  ...createEventCallbacks(MISA_EVENT_ID, MISA_SLUG),
  // Backward compatibility para "payment"
  payment: {
    amount: MISA_FUNNEL.pricing.amount,
    currency: MISA_FUNNEL.pricing.currency,
    description: MISA_FUNNEL.pricing.description,
    checkoutUrl: '/api/events/checkout',
  },
};
