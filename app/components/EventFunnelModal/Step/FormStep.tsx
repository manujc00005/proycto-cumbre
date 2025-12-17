// ========================================
// COMPONENTE: FormStep
// Renderiza campos dinámicos con validación
// components/EventFunnelModal/steps/FormStep.tsx
// ========================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FormField } from '@/lib/funnels/types';
import { useStepValidation } from '../hooks/useStepValidation';
import GDPRConsentEvent from '../../gdpr/gdpr-consent-event';

interface FormStepProps {
  fields: FormField[];
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  gdpr: {
    includeWhatsApp: boolean;
    whatsappRequired: boolean;
    whatsappContext: 'club' | 'event';
  };
  attemptedNext?: boolean;
}

export default function FormStep({ fields, data, onChange, gdpr, attemptedNext: attemptedNextProp }: FormStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [consents, setConsents] = useState({ privacyPolicy: false, whatsapp: false });
  const [attemptedNext, setAttemptedNext] = useState(false);
  
  // Usar refs para evitar loops infinitos
  const prevConsentsRef = useRef({ privacyPolicy: false, whatsapp: false });
  const isUpdatingRef = useRef(false);
  
  const { validateField, validateAll } = useStepValidation(fields);

  // Sincronizar con prop externa
  useEffect(() => {
    if (attemptedNextProp && !attemptedNext) {
      setAttemptedNext(true);
    }
  }, [attemptedNextProp, attemptedNext]);

  // Actualizar consentimientos en formData (optimizado para evitar loops)
  useEffect(() => {
    // Evitar loops si ya estamos actualizando
    if (isUpdatingRef.current) {
      return;
    }

    // Solo actualizar si los valores booleanos cambiaron
    const privacyChanged = prevConsentsRef.current.privacyPolicy !== consents.privacyPolicy;
    const whatsappChanged = prevConsentsRef.current.whatsapp !== consents.whatsapp;

    if (!privacyChanged && !whatsappChanged) {
      return; // No hay cambios reales
    }

    // Marcar que estamos actualizando
    isUpdatingRef.current = true;
    prevConsentsRef.current = { ...consents };

    const prev = data.consents || {};
    const privacyAccepted = consents.privacyPolicy;
    const whatsappAccepted = consents.whatsapp;

    const nextConsents = {
      privacy_accepted: privacyAccepted,
      privacy_accepted_at: privacyAccepted 
        ? (prev.privacy_accepted_at || new Date().toISOString()) 
        : null,
      whatsapp_consent: whatsappAccepted,
      whatsapp_consent_at: whatsappAccepted 
        ? (prev.whatsapp_consent_at || new Date().toISOString()) 
        : null,
    };

    onChange({ ...data, consents: nextConsents });
    
    // Limpiar flag después de actualizar
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);
  }, [consents.privacyPolicy, consents.whatsapp]); // Solo depender de los valores booleanos

  // Validar cuando el usuario intenta avanzar
  useEffect(() => {
    if (attemptedNext) {
      const newErrors = validateAll(data);
      setErrors(newErrors);
      
      // Marcar todos los campos como tocados
      const allTouched: Record<string, boolean> = {};
      fields.forEach(field => {
        allTouched[field.id] = true;
      });
      setTouched(allTouched);
    }
  }, [attemptedNext, data, fields, validateAll]);

  const handleChange = (field: FormField, value: any) => {
    if (attemptedNext) {
      setAttemptedNext(false);
    }

    const newData = { ...data, [field.id]: value };
    onChange(newData);

    if (touched[field.id]) {
      const error = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [field.id]: error || '',
      }));
    }
  };

  const handleBlur = (field: FormField) => {
    setTouched((prev) => ({ ...prev, [field.id]: true }));
    
    const error = validateField(field, data[field.id]);
    setErrors((prev) => ({
      ...prev,
      [field.id]: error || '',
    }));
  };

  const handleConsentChange = useCallback(
    (next: { privacyPolicy: boolean; whatsapp: boolean }) => {
      setConsents(prev =>
        prev.privacyPolicy === next.privacyPolicy && prev.whatsapp === next.whatsapp
          ? prev
          : next
      );
    },
    []
  );

  const renderField = (field: FormField) => {
    const value = data[field.id] || '';
    const error = errors[field.id];
    const showError = touched[field.id] && error;

    switch (field.type) {
      case 'select':
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-semibold text-white/80 mb-2">
              {field.label} {field.required && <span className="text-orange-400">*</span>}
            </label>
            <select
              id={field.id}
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
              required={field.required}
              className={`
                w-full px-4 py-3 bg-black/50 border rounded-lg text-white
                focus:outline-none focus:border-orange-500 transition
                ${showError ? 'border-red-500' : 'border-white/20'}
              `}
            >
              <option value="">Selecciona una opción</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {field.helperText && !showError && (
              <p className="text-xs text-zinc-500 mt-1">{field.helperText}</p>
            )}
            {showError && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
          </div>
        );

      default:
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-semibold text-white/80 mb-2">
              {field.label} {field.required && <span className="text-orange-400">*</span>}
            </label>
            <input
              type={field.type === 'dni' ? 'text' : field.type}
              id={field.id}
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
              required={field.required}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              pattern={field.pattern}
              className={`
                w-full px-4 py-3 bg-black/50 border rounded-lg text-white placeholder-white/40
                focus:outline-none focus:border-orange-500 transition
                ${field.type === 'dni' ? 'uppercase' : ''}
                ${showError ? 'border-red-500' : 'border-white/20'}
              `}
            />
            {field.helperText && !showError && (
              <p className="text-xs text-zinc-500 mt-1">{field.helperText}</p>
            )}
            {showError && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          Completa tus datos
        </h3>
        <p className="text-sm text-white/60">
          Necesitamos esta información para gestionar tu inscripción
        </p>
      </div>

      {/* Banner de error de consentimientos */}
      {attemptedNext && (!consents.privacyPolicy || !consents.whatsapp) && (
        <div className="mb-6 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold mb-1">Faltan consentimientos obligatorios</p>
            <ul className="text-xs space-y-1 ml-4 list-disc">
              {!consents.privacyPolicy && <li>Debes aceptar la Política de Privacidad</li>}
              {!consents.whatsapp && <li>Debes aceptar el consentimiento de WhatsApp</li>}
            </ul>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {fields.map((field) => renderField(field))}

        {/* RGPD */}
        <div className="pt-4 border-t border-white/10">
          <GDPRConsentEvent
            onConsentChange={handleConsentChange}
            includeWhatsApp={gdpr.includeWhatsApp}
            whatsappRequired={gdpr.whatsappRequired}
            whatsappContext={gdpr.whatsappContext}
            compactWhatsApp={true}
            showFooterNote={false}
            showWhatsAppDetails={false}
          />
        </div>

        {/* Indicador de guardado automático */}
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Guardado automático activado</span>
        </div>
      </div>
    </div>
  );
}
