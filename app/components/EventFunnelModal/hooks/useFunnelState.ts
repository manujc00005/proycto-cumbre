// ========================================
// HOOK: useFunnelState
// Gestiona la navegación entre pasos
// components/EventFunnelModal/hooks/useFunnelState.ts
// ========================================

import { useState, useCallback } from 'react';
import { StepId, FunnelState } from '@/lib/funnels/types';

export function useFunnelState(hasRules: boolean) {
  const [state, setState] = useState<FunnelState>({
    currentStep: 'form',
    completedSteps: [],
    formData: {},
    waiverAccepted: false,
    waiverAcceptanceId: null,
    rulesAccepted: false,
  });

  // Definir pasos según configuración
  const steps: StepId[] = [
    'form',
    'waiver',
    ...(hasRules ? ['rules' as StepId] : []),
    'payment',
  ];

  const currentStepIndex = steps.indexOf(state.currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Navegar al siguiente paso
  const goToNext = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      const nextStep = steps[nextIndex];
      setState((prev) => ({
        ...prev,
        currentStep: nextStep,
        completedSteps: [...prev.completedSteps, prev.currentStep],
      }));
    }
  }, [currentStepIndex, steps]);

  // Navegar al paso anterior
  const goToPrevious = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setState((prev) => ({
        ...prev,
        currentStep: steps[prevIndex],
      }));
    }
  }, [currentStepIndex, steps]);

  // Actualizar datos del formulario
  const updateFormData = useCallback((data: Record<string, any>) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, ...data },
    }));
  }, []);

  // Marcar waiver como aceptado
  const setWaiverAccepted = useCallback((acceptanceId: string) => {
    setState((prev) => ({
      ...prev,
      waiverAccepted: true,
      waiverAcceptanceId: acceptanceId,
    }));
  }, []);

  // Marcar reglas como aceptadas
  const setRulesAccepted = useCallback((accepted: boolean) => {
    setState((prev) => ({
      ...prev,
      rulesAccepted: accepted,
    }));
  }, []);

  // Verificar si puede avanzar
  const canGoNext = useCallback(() => {
    switch (state.currentStep) {
      case 'form':
        // ✅ Validar campos obligatorios específicos
        const hasRequiredFields = !!(
          state.formData.name &&
          state.formData.email &&
          state.formData.phone &&
          state.formData.dni &&
          state.formData.shirtSize // ← Validar talla de camiseta
        );
        
        // ✅ Validar consentimientos
        const hasConsents = 
          state.formData.consents?.privacy_accepted === true && 
          state.formData.consents?.whatsapp_consent === true;
        
        return hasRequiredFields && hasConsents;
      
      case 'waiver':
        return state.waiverAccepted;
      
      case 'rules':
        return state.rulesAccepted;
      
      case 'payment':
        return true;
      
      default:
        return false;
    }
  }, [state.currentStep, state.formData, state.waiverAccepted, state.rulesAccepted]);

  // Verificar si puede retroceder
  const canGoBack = useCallback(() => {
    // No se puede retroceder desde el waiver una vez aceptado
    if (state.currentStep === 'payment' && state.waiverAccepted) {
      return false;
    }
    return currentStepIndex > 0;
  }, [state.currentStep, state.waiverAccepted, currentStepIndex]);

  return {
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
  };
}
