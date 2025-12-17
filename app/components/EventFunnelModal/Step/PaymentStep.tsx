// ========================================
// COMPONENTE: PaymentStep
// Resumen final y botón de pago
// components/EventFunnelModal/steps/PaymentStep.tsx
// ========================================

'use client';

interface PaymentStepProps {
  data: Record<string, any>;
  amount: number; // en céntimos
  eventSlug: string;
  currency: string;
  description: string;
  onPay: () => void;
  isSubmitting: boolean;
}

export default function PaymentStep({
  eventSlug,
  data,
  amount,
  currency,
  description,
}: PaymentStepProps) {
  const formatAmount = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const formatCurrency = (curr: string) => {
    return curr.toUpperCase();
  };

  const waiverHref = `/${eventSlug}/descargo`;
  const termsHref = `/${eventSlug}/terminos-y-condiciones`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          Confirma tu inscripción
        </h3>
        <p className="text-sm text-white/60">
          Revisa tus datos antes de proceder al pago
        </p>
      </div>

      <div className="space-y-6">
        {/* Resumen del evento */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-white mb-1">
                {description}
              </h4>
              <p className="text-sm text-white/70">
                Inscripción al evento deportivo
              </p>
            </div>
          </div>
        </div>

        {/* Resumen de datos */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
          <h5 className="text-sm font-semibold text-white/90 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Datos del participante
          </h5>
          
          <div className="space-y-3">
            {data.name && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Nombre:</span>
                <span className="text-white font-medium">{data.name}</span>
              </div>
            )}
            {data.email && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Email:</span>
                <span className="text-white font-medium">{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Teléfono:</span>
                <span className="text-white font-medium">{data.phone}</span>
              </div>
            )}
            {data.dni && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">DNI/NIE:</span>
                <span className="text-white font-medium font-mono">{data.dni}</span>
              </div>
            )}
            {data.shirtSize && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Talla:</span>
                <span className="text-white font-medium">{data.shirtSize}</span>
              </div>
            )}
          </div>
        </div>

        {/* Confirmación legal */}
        <div className="text-xs text-zinc-400 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-green-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>

          <span>
            Has aceptado el{" "}
            <a
              href={waiverHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 underline underline-offset-2"
            >
              descargo de responsabilidad
            </a>
            {" "}y los{" "}
            <a
              href={termsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 underline underline-offset-2"
            >
              términos y condiciones
            </a>
            .
          </span>
        </div>

        {/* Total a pagar */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-2 border-green-500/40 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400 mb-1">Total a pagar</p>
              <p className="text-4xl font-black text-green-400">
                {formatAmount(amount)} {formatCurrency(currency)}
              </p>
            </div>
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          
          <p className="text-xs text-zinc-400 mt-3">
            Pago único por persona. Incluye inscripción y material del evento.
          </p>
        </div>

        {/* Información de seguridad */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-white/90 font-medium mb-1">
                Pago 100% seguro
              </p>
              <p className="text-xs text-zinc-500">
                Tu pago está protegido por Stripe. Tus datos bancarios nunca pasan por nuestros servidores.
              </p>
            </div>
          </div>
        </div>

        {/* Política de cancelación */}
        <div className="text-xs text-zinc-500 text-center">
          Al confirmar el pago aceptas los términos y condiciones del evento. Consulta la{' '}
          <a href={termsHref} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">
            política de cancelación
          </a>
          .
        </div>
      </div>
    </div>
  );
}
