// ========================================
// COMPONENTE: FormStep (SOLUCIÓN COMPLETA)
// ✅ Ambos useEffect controlados correctamente
// ✅ Sin infinite loops
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
  
  const { validateField, validateAll } = useStepValidation(fields);
  
  // ✅ Ref para evitar validación en mount inicial
  const isInitialMount = useRef(true);

  // Sincronizar con prop externa
  useEffect(() => {
    if (attemptedNextProp && !attemptedNext) {
      setAttemptedNext(true);
    }
  }, [attemptedNextProp, attemptedNext]);

  // ✅ FIX: Validar SOLO cuando attemptedNext cambia, NO cuando data cambia
  useEffect(() => {
    // Ignorar en mount inicial
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (attemptedNext) {
      const newErrors = validateAll(data);
      setErrors(newErrors);
      
      const allTouched: Record<string, boolean> = {};
      fields.forEach(field => {
        allTouched[field.id] = true;
      });
      setTouched(allTouched);
    }
  }, [attemptedNext]); // ✅ SOLO attemptedNext en deps

  const handleChange = (field: FormField, value: any) => {
    if (attemptedNext) {
      setAttemptedNext(false);
    }

    const newData = { ...data, [field.id]: value };
    onChange(newData);

    // ✅ Validar inline si el campo ya fue tocado
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

  // ✅ Manejar consentimientos sin useEffect
  const handleConsentChange = useCallback(
    (next: { privacyPolicy: boolean; whatsapp: boolean }) => {
      setConsents(next);
      
      const prev = data.consents || {};
      
      const nextConsents = {
        privacy_accepted: next.privacyPolicy,
        privacy_accepted_at: next.privacyPolicy 
          ? (prev.privacy_accepted_at || new Date().toISOString()) 
          : null,
        whatsapp_consent: next.whatsapp,
        whatsapp_consent_at: next.whatsapp 
          ? (prev.whatsapp_consent_at || new Date().toISOString()) 
          : null,
        marketing_consent: false,
        marketing_consent_at: null,
      };

      const hasChanges = 
        prev.privacy_accepted !== nextConsents.privacy_accepted ||
        prev.whatsapp_consent !== nextConsents.whatsapp_consent;

      if (hasChanges) {
        onChange({ ...data, consents: nextConsents });
      }
    },
    [data, onChange]
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
          👉 Estás a un paso de participar
        </h3>
        <p className="text-sm text-white/60">
          Completa tus datos para reservar tu plaza
        </p>
      </div>

      {/* Banner de error */}
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

        {/* Indicador de guardado */}
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Tus datos se guardan automáticamente en este dispositivo</span>
        </div>
      </div>
    </div>
  );
}
