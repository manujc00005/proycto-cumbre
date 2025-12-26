// ========================================
// TIPOS PARA EVENT FUNNEL STEPPER
// ✅ Refactorizado para ser genérico y reutilizable
// lib/funnels/types.ts
// ========================================

import { WaiverEvent, WaiverAcceptancePayload } from '@/lib/waivers/types';

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'dni'
  | 'select'
  | 'date'
  | 'checkbox';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: (value: any) => string | null;
  helperText?: string;
  maxLength?: number;
  pattern?: string;
}

// ========================================
// ✅ NUEVO: Configuración de pricing
// ========================================
export interface PricingConfig {
  amount: number;           // Precio en centavos
  currency: string;         // 'EUR', 'USD', etc
  description: string;      // Descripción para Stripe
  
  // Descuento para socios (opcional)
  memberDiscount?: {
    discountPercent: number;          // 20 para 20%
    requiresActiveMembership: boolean; // Solo socios activos
    description?: string;              // Ej: "Descuento para socios"
  };
}

export interface FunnelStep {
  id: string;
  title: string;
  description?: string;
  canSkip?: boolean;
  validate?: () => Promise<boolean>;
  onComplete?: () => Promise<void>;
}

// ========================================
// ✅ ACTUALIZADO: Config simplificada
// ========================================
export interface EventFunnelConfig {
  // Identificadores del evento
  eventId: string;           // UUID del evento
  eventSlug: string;         // Slug para URLs (ej: 'misa')
  eventName: string;         // Nombre mostrado en UI

  // ✅ NUEVO: Pricing unificado
  pricing: PricingConfig;

  // Paso 1: Formulario
  formFields: FormField[];

  // Paso 2: Pliego (siempre obligatorio)
  waiver: {
    event: WaiverEvent;
    required: true;
  };

  // Paso 3: Reglamento (opcional)
  rules?: {
    url?: string;
    text?: string;
    requireAcceptance: boolean;
  };

  // Configuración RGPD
  gdpr: {
    includeWhatsApp: boolean;
    whatsappRequired: boolean;
    whatsappContext: 'club' | 'event';
  };

  // ❌ ELIMINADO: Callbacks específicos (ahora son genéricos)
  // ❌ ELIMINADO: payment.checkoutUrl (ahora es genérico)
}

// ========================================
// ✅ NUEVO: Backward compatibility
// ========================================
export interface EventFunnelConfigWithPayment extends EventFunnelConfig {
  payment: {
    amount: number;
    currency: string;
    description: string;
    checkoutUrl?: string; // Opcional para backward compatibility
  };
}

export type StepId = 'form' | 'waiver' | 'rules' | 'payment';

export interface FunnelState {
  currentStep: StepId;
  completedSteps: StepId[];
  formData: Record<string, any>;
  waiverAccepted: boolean;
  waiverAcceptanceId: string | null;
  rulesAccepted: boolean;
}
