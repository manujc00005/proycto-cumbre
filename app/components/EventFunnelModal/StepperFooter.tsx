// ========================================
// COMPONENTE: StepperFooter
// Botones de navegación
// components/EventFunnelModal/StepperFooter.tsx
// ========================================

"use client";

interface StepperFooterProps {
  canGoBack: boolean;
  canGoNext: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
  isSubmitting: boolean;
  paymentAmount?: number;
}

export default function StepperFooter({
  canGoBack,
  canGoNext,
  isLastStep,
  onBack,
  onNext,
  isSubmitting,
  paymentAmount,
}: StepperFooterProps) {
  const formatAmount = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-900/50 backdrop-blur p-6">
      {/* Botones de navegación */}
      <div className="flex items-center justify-between gap-4">
        {/* Botón Atrás */}
        {canGoBack ? (
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-800/50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Atrás
          </button>
        ) : (
          <div /> // Spacer
        )}

        {/* Botón Siguiente/Pagar */}
        <button
          onClick={onNext}
          disabled={!canGoNext || isSubmitting}
          className={`
            flex items-center justify-center gap-2 px-8 py-3 font-bold rounded-xl transition-all
            disabled:cursor-not-allowed disabled:opacity-50
            ${
              isLastStep
                ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30"
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30"
            }
          `}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Procesando...
            </>
          ) : isLastStep ? (
            <>
              Pagar ahora ·
              {paymentAmount && (
                <span className="text-2xl font-black">
                  {formatAmount(paymentAmount)}€
                </span>
              )}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </>
          ) : (
            <>
              Siguiente
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Badge de seguridad */}
      {/* {isLastStep && (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-green-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Pago 100% seguro con Stripe</span>
        </div>
      )} */}
    </div>
  );
}
