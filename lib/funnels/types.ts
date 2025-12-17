// ========================================
// TIPOS PARA EVENT FUNNEL STEPPER
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

export interface FunnelStep {
  id: string;
  title: string;
  description?: string;
  canSkip?: boolean;
  validate?: () => Promise<boolean>;
  onComplete?: () => Promise<void>;
}

export interface EventFunnelConfig {
  eventId: string;           // UUID del evento
  eventSlug: string;         // Slug para URLs (ej: 'misa')
  eventName: string;         // Nombre mostrado en UI
  
  // Paso 1: Formulario
  formFields: FormField[];
  
  // Paso 2: Pliego (siempre obligatorio)
  waiver: {
    event: WaiverEvent;
    required: true;
  };
  
  // Paso 3: Reglamento (opcional)
  rules?: {
    url: string;
    requireAcceptance: boolean;
    text?: string;
  };
  
  // Paso 4: Pago
  payment: {
    amount: number;
    currency: string;
    description: string;
    checkoutUrl: string;
  };
  
  // Configuración RGPD
  gdpr: {
    includeWhatsApp: boolean;
    whatsappRequired: boolean;
    whatsappContext: 'club' | 'event';
  };
  
  // Callbacks
  onFormDraft?: (data: any) => void;
  onWaiverAccept?: (payload: WaiverAcceptancePayload) => Promise<{ acceptanceId: string }>;
  onPaymentStart?: (data: any) => Promise<{ url: string }>;
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
