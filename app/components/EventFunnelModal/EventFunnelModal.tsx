// ========================================
// COMPONENTE PRINCIPAL: EventFunnelModal
// Orquestador del funnel stepper
// components/EventFunnelModal/EventFunnelModal.tsx
// ========================================

'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EventFunnelConfig } from '@/lib/funnels/types';
import { useFunnelState } from './hooks/useFunnelState';
import { useFormDraft } from './hooks/useFormDraft';
import StepperHeader from './StepperHeader';
import StepperFooter from './StepperFooter';
import FormStep from './Step/FormStep';
import RulesStep from './Step/RulesStep';
import WaiverStep from './Step/WaiverStep';
import PaymentStep from './Step/PaymentStep';
import { WaiverAcceptancePayload } from '@/lib/waivers/types';

interface EventFunnelModalProps {
  config: EventFunnelConfig;
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

  // Cargar borrador al abrir
  useEffect(() => {
    if (isOpen) {
      const draft = loadDraft();
      if (draft) {
        updateFormData(draft);
      }
    }
  }, [isOpen]);

  // Bloquear scroll del body cuando modal está abierto
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

  // Confirmación al cerrar si hay datos
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

  // Handler para intentar avanzar (con validación)
  const handleNext = () => {
    if (state.currentStep === 'form') {
      setAttemptedNext(true);
      
      // Esperar un tick para que se actualicen los errores
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

  // Handler para aceptación del pliego
  const handleWaiverAccept = async (
    payload: WaiverAcceptancePayload
  ): Promise<{ acceptanceId: string }> => {
    setIsSubmitting(true);
    setError("");

    try {
      const result = await config.onWaiverAccept?.(payload);

      if (!result?.acceptanceId) {
        throw new Error("No se recibió acceptanceId");
      }

      setWaiverAccepted(result.acceptanceId);
      goToNext();

      return { acceptanceId: result.acceptanceId };
    } catch (err: any) {
      setError(err.message || "Error al guardar la aceptación del pliego");
      console.error("Error en waiver:", err);
      throw err; // importante: mantiene el contrato Promise<{ acceptanceId }>
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler para pago final
  const handlePayment = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      const result = await config.onPaymentStart?.({
        ...state.formData,
        waiver_acceptance_id: state.waiverAcceptanceId,
      });

      if (result?.url) {
        // Limpiar borrador antes de redirigir
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
            amount={config.payment.amount}
            currency={config.payment.currency}
            description={config.payment.description}
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
            <div className="flex-1 overflow-y-auto p-6 overscroll-contain">
              {/* Error global */}
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

            {/* FOOTER - Oculto en paso waiver porque ya tiene su propio botón */}
            {state.currentStep !== 'waiver' && (
              <StepperFooter
                canGoBack={canGoBack()}
                canGoNext={canGoNext()}
                isLastStep={state.currentStep === 'payment'}
                onBack={goToPrevious}
                onNext={state.currentStep === 'payment' ? handlePayment : handleNext}
                isSubmitting={isSubmitting}
                paymentAmount={config.payment.amount}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
