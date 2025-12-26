// ========================================
// COMPONENTE PRINCIPAL: EventFunnelModal (REFACTORIZADO)
// ✅ Usa pricing unificado y callbacks genéricos
// components/EventFunnelModal/EventFunnelModal.tsx
// ========================================

'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EventFunnelConfig } from '@/lib/funnels/types';
import { useFunnelState } from './hooks/useFunnelState';
import { useFormDraft } from './hooks/useFormDraft';
import { useMemberDiscount } from './hooks/useMemberDiscount';
import StepperHeader from './StepperHeader';
import StepperFooter from './StepperFooter';
import FormStep from './Step/FormStep';
import RulesStep from './Step/RulesStep';
import WaiverStep from './Step/WaiverStep';
import PaymentStep from './Step/PaymentStep';
import { WaiverAcceptancePayload } from '@/lib/waivers/types';
import { createEventCallbacks } from '@/lib/funnels/callbacks';

interface EventFunnelModalProps {
  config: EventFunnelConfig & {
    // Callbacks (ahora opcionales)
    onFormDraft?: (data: any) => void;
    onWaiverAccept?: (payload: WaiverAcceptancePayload) => Promise<{ acceptanceId: string }>;
    onPaymentStart?: (data: any) => Promise<{ url: string }>;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function EventFunnelModal({
  config,
  isOpen,
  onClose,
}: EventFunnelModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [attemptedNext, setAttemptedNext] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    state,
    steps,
    currentStepIndex,
    progress,
    goToNext,
    goToPrevious,
    updateFormData,
    setWaiverAccepted,
    setRulesAccepted,
    canGoNext,
    canGoBack,
  } = useFunnelState(!!config.rules);

  const { loadDraft, clearDraft } = useFormDraft(
    config.eventSlug,
    state.formData,
    state.currentStep === 'form'
  );

  // ✅ ACTUALIZADO: Usa pricing directamente
  const discount = useMemberDiscount(
    config.pricing,
    state.formData.email,
    state.formData.dni
  );

  // ✅ Callbacks genéricos (usa los del config o crea nuevos)
  const callbacks = config.onWaiverAccept && config.onPaymentStart
    ? {
        onFormDraft: config.onFormDraft,
        onWaiverAccept: config.onWaiverAccept,
        onPaymentStart: config.onPaymentStart,
      }
    : createEventCallbacks(config.eventId, config.eventSlug);

  // Cargar borrador al abrir
  useEffect(() => {
    if (isOpen) {
      const draft = loadDraft();
      if (draft) {
        updateFormData(draft);
      }
    }
  }, [isOpen]);

  // Bloquear scroll del body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset scroll al cambiar de paso
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [state.currentStep]);

  // Confirmación al cerrar
  const handleClose = () => {
    if (Object.keys(state.formData).length > 0 && state.currentStep !== 'payment') {
      const confirmed = window.confirm(
        '¿Seguro que quieres salir? Tus datos se guardarán automáticamente.'
      );
      if (confirmed) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Handler para avanzar
  const handleNext = () => {
    if (state.currentStep === 'form') {
      setAttemptedNext(true);
      
      setTimeout(() => {
        if (canGoNext()) {
          goToNext();
          setAttemptedNext(false);
        }
      }, 100);
    } else {
      if (canGoNext()) {
        goToNext();
      }
    }
  };

  // Handler para waiver
  const handleWaiverAccept = async (
    payload: WaiverAcceptancePayload
  ): Promise<{ acceptanceId: string }> => {
    setIsSubmitting(true);
    setError("");

    try {
      const result = await callbacks.onWaiverAccept?.(payload);

      if (!result?.acceptanceId) {
        throw new Error("No se recibió acceptanceId");
      }

      setWaiverAccepted(result.acceptanceId);
      goToNext();

      return { acceptanceId: result.acceptanceId };
    } catch (err: any) {
      setError(err.message || "Error al guardar la aceptación del pliego");
      console.error("Error en waiver:", err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ ACTUALIZADO: Handler de pago con descuento
  const handlePayment = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      const result = await callbacks.onPaymentStart?.({
        ...state.formData,
        waiver_acceptance_id: state.waiverAcceptanceId,
        // ✅ Información de descuento
        discount: discount.isMember ? {
          applied: true,
          percent: discount.discountPercent,
          amount: discount.discountAmount,
          finalAmount: discount.finalAmount,
          memberNumber: discount.memberInfo?.memberNumber,
        } : {
          applied: false,
        },
      });

      if (result?.url) {
        clearDraft();
        window.location.href = result.url;
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago');
      console.error('Error en pago:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar paso actual
  const renderStep = () => {
    switch (state.currentStep) {
      case 'form':
        return (
          <FormStep
            fields={config.formFields}
            data={state.formData}
            onChange={updateFormData}
            gdpr={config.gdpr}
            attemptedNext={attemptedNext}
          />
        );

      case 'waiver':
        return (
          <WaiverStep
            event={config.waiver.event}
            participant={{
              fullName: state.formData.name || '',
              documentId: state.formData.dni || '',
              birthDateISO: state.formData.birthDate,
            }}
            onAccept={handleWaiverAccept}
          />
        );

      case 'rules':
        return config.rules ? (
          <RulesStep
            url={config.rules.url}
            text={config.rules.text}
            requireAcceptance={config.rules.requireAcceptance}
            onAccept={() => {
              setRulesAccepted(true);
              goToNext();
            }}
          />
        ) : null;

      case 'payment':
        return (
          <PaymentStep
            eventSlug={config.eventSlug}
            data={state.formData}
            pricing={config.pricing}
            onPay={handlePayment}
            isSubmitting={isSubmitting}
          />
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-5xl max-h-[calc(100dvh-1.5rem)] flex flex-col overflow-hidden">
            
            {/* HEADER */}
            <StepperHeader
              eventName={config.eventName}
              steps={steps}
              currentStep={state.currentStep}
              progress={progress}
              onClose={handleClose}
            />

            {/* BODY */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-6 overscroll-contain"
            >
              {error && (
                <div className="mb-6 max-w-2xl mx-auto bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={state.currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* FOOTER */}
            {state.currentStep !== 'waiver' && (
              <StepperFooter
                canGoBack={canGoBack()}
                canGoNext={canGoNext()}
                isLastStep={state.currentStep === 'payment'}
                onBack={goToPrevious}
                onNext={state.currentStep === 'payment' ? handlePayment : handleNext}
                isSubmitting={isSubmitting}
                paymentAmount={config.pricing.amount}
                discountAmount={discount.discountAmount}
                finalAmount={discount.finalAmount}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
