// ========================================
// COMPONENTE: PaymentStep (REFACTORIZADO)
// ✅ Usa PricingConfig
// ✅ Muestra datos correctamente
// ✅ Descuento alineado con botón
// components/EventFunnelModal/steps/PaymentStep.tsx
// ========================================

'use client';

import { useMemberDiscount } from '../hooks/useMemberDiscount';
import { Loader2 } from 'lucide-react';
import { PricingConfig } from '@/lib/funnels/types';

interface PaymentStepProps {
  data: Record<string, any>;
  pricing: PricingConfig; // ✅ NUEVO
  eventSlug: string;
  onPay: () => void;
  isSubmitting: boolean;
}

export default function PaymentStep({
  eventSlug,
  data,
  pricing,
}: PaymentStepProps) {
  const waiverHref = `/${eventSlug}/descargo`;
  const termsHref = `/${eventSlug}/terminos-y-condiciones`;

  // ✅ ACTUALIZADO: Usa pricing directamente
  const discount = useMemberDiscount(
    pricing,
    data.email,
    data.dni
  );

  const formatAmount = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-white mb-1">
          Estás a un paso de confirmar tu plaza
        </h3>
        <p className="text-xs text-white/60">
          Revisa tus datos antes de confirmar el pago
        </p>
      </div>

      <div className="space-y-4">
        {/* Resumen del evento */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-base font-bold text-white mb-0.5">
                {pricing.description}
              </h4>
              <p className="text-xs text-white/70">
                Inscripción completa al evento deportivo
              </p>
            </div>
          </div>
        </div>

        {/* Badge de verificación de socio */}
        {discount.isChecking && (
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
              <span className="text-sm text-white/70">
                Verificando membresía...
              </span>
            </div>
          </div>
        )}

        {discount.isMember && !discount.isChecking && (
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-green-400 mb-0.5">
                  🎉 ¡Descuento aplicado!
                </h4>
                <p className="text-xs text-white/70">
                  Socio del club · {discount.discountPercent}% de descuento
                </p>
                {discount.memberInfo?.memberNumber && (
                  <p className="text-xs text-white/50 mt-1 font-mono">
                    Nº Socio: {discount.memberInfo.memberNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Desglose de precios */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
          <h5 className="text-xs font-semibold text-white/90 mb-3 flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Desglose del pago
          </h5>
          
          <div className="space-y-2">
            {/* Precio original */}
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Precio de inscripción:</span>
              <span className={`font-medium ${discount.isMember ? 'line-through text-zinc-500' : 'text-white'}`}>
                {formatAmount(discount.originalAmount)}€
              </span>
            </div>

            {/* Descuento aplicado */}
            {discount.isMember && discount.discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-400">
                  Descuento socio ({discount.discountPercent}%):
                </span>
                <span className="font-medium text-green-400">
                  -{formatAmount(discount.discountAmount)}€
                </span>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between text-base pt-2 border-t border-zinc-700">
              <span className="text-white font-bold">Total a pagar:</span>
              <span className="text-white font-bold text-lg">
                {formatAmount(discount.finalAmount)}€
              </span>
            </div>
          </div>

        </div>

        {/* Resumen de datos */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
          <h5 className="text-xs font-semibold text-white/90 mb-3 flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Tus datos
          </h5>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Nombre:</span>
              <span className="text-white font-medium">{data.name || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Email:</span>
              <span className="text-white font-medium truncate ml-2 max-w-[220px]">
                {data.email || 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Móvil:</span>
              <span className="text-white font-medium">{data.phone || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">DNI/NIE:</span>
              <span className="text-white font-medium font-mono">
                {data.dni || 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Talla:</span>
              <span className="text-white font-medium">{data.shirtSize || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Confirmación legal */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>

            <div className="flex-1">
              <p className="text-xs text-white/90 font-medium mb-1">
                Documentos aceptados
              </p>
              <div className="text-[10px] text-zinc-400 space-y-0.5">
                <p>
                  ✓{" "}
                  <a
                    href={waiverHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 underline underline-offset-2"
                  >
                    Descargo de responsabilidad
                  </a>
                </p>
                <p>
                  ✓{" "}
                  <a
                    href={termsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 underline underline-offset-2"
                  >
                    Términos y condiciones
                  </a>
                </p>
                <p className="text-zinc-500 mt-1 italic">
                  💡 Documentos estándar en eventos deportivos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información de seguridad */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div className="flex-1">
              <p className="text-xs text-white/90 font-medium mb-1">
                Pago 100% seguro
              </p>
              <p className="text-[10px] text-zinc-500">
                Tu pago está protegido por Stripe. Tus datos bancarios nunca pasan por nuestros servidores.
              </p>
            </div>
          </div>
        </div>

        {/* Política de cancelación */}
        <div className="text-[10px] text-zinc-500 text-center">
          Consulta la{' '}
          <a href={termsHref} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">
            política de cancelación
          </a>
        </div>
      </div>
    </div>
  );
}
