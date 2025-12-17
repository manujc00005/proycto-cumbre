// ========================================
// COMPONENTE: StepperHeader
// Muestra progreso y paso actual
// components/EventFunnelModal/StepperHeader.tsx
// ========================================

'use client';

import { StepId } from '@/lib/funnels/types';

interface StepperHeaderProps {
  eventName: string;
  steps: StepId[];
  currentStep: StepId;
  progress: number;
  onClose: () => void;
}

const STEP_LABELS: Record<StepId, string> = {
  form: 'Datos',
  waiver: 'Descargo',
  rules: 'Reglamento', // Raramente usado
  payment: 'Pago',
};

const STEP_ICONS: Record<StepId, string> = {
  form: '📝',
  waiver: '📋',
  rules: '📖',
  payment: '💳',
};

export default function StepperHeader({
  eventName,
  steps,
  currentStep,
  progress,
  onClose,
}: StepperHeaderProps) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
      {/* Header principal */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-xl font-bold text-white truncate flex-1">
          {eventName}
        </h2>
        
        <button
          onClick={onClose}
          className="ml-4 p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-white"
          aria-label="Cerrar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Stepper visual */}
      <div className="px-6 pb-4">
        {/* Desktop: Stepper horizontal completo */}
        <div className="hidden md:flex items-center gap-2">
          {steps.map((step, index) => {
            const isActive = step === currentStep;
            const isCompleted = index < currentIndex;
            const isDisabled = index > currentIndex;

            return (
              <div key={step} className="flex items-center flex-1">
                {/* Círculo del paso */}
                <div className="flex flex-col items-center w-full">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                      ${isCompleted ? 'bg-green-500 text-white' : ''}
                      ${isActive ? 'bg-orange-500 text-white ring-4 ring-orange-500/30' : ''}
                      ${isDisabled ? 'bg-zinc-700 text-zinc-500' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{STEP_ICONS[step]}</span>
                    )}
                  </div>
                  
                  <span
                    className={`
                      mt-2 text-xs font-medium whitespace-nowrap
                      ${isActive ? 'text-orange-400' : ''}
                      ${isCompleted ? 'text-green-400' : ''}
                      ${isDisabled ? 'text-zinc-500' : ''}
                    `}
                  >
                    {STEP_LABELS[step]}
                  </span>
                </div>

                {/* Línea conectora - Solo si NO es el último paso */}
                {index < steps.length - 1 && (
                  <div className="flex-1 min-w-[40px] max-w-[120px] mx-4">
                    <div
                      className={`
                        h-1 rounded-full transition-all
                        ${isCompleted ? 'bg-green-500' : 'bg-zinc-700'}
                      `}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile: Indicador simple */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">
              Paso {currentIndex + 1} de {steps.length}
            </span>
            <span className="text-sm font-medium text-orange-400">
              {STEP_ICONS[currentStep]} {STEP_LABELS[currentStep]}
            </span>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
