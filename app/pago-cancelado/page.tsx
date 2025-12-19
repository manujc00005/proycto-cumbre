// ========================================
// PÁGINA GENÉRICA: PAGO CANCELADO
// app/pago-cancelado/page.tsx
// ========================================

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  XCircle,
  Mountain,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { logger } from "@/lib/logger";

// ========================================
// COMPONENT CONTENT
// ========================================

function PagoCanceladoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<
    "membership" | "event" | "shop" | null
  >(null);

  useEffect(() => {
    const handleCancellation = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        logger.log("⚠️ No se encontró session_id en la URL");
        setIsProcessing(false);
        return;
      }

      try {
        logger.log("🚫 Procesando cancelación del pago...");
        logger.log("Session ID:", sessionId);

        // Llamar a la API para marcar el pago como cancelado
        const response = await fetch("/api/payment-cancelled", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al procesar la cancelación");
        }

        logger.log("✅ Pago marcado como cancelado");

        // Guardar tipo de pago si viene en la respuesta
        if (data.type) {
          setPaymentType(data.type);
        }
      } catch (error: any) {
        logger.error("❌ Error al procesar cancelación:", error);
        setError(error.message);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCancellation();
  }, [searchParams]);

  // ========================================
  // LOADING STATE
  // ========================================

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Procesando cancelación...</p>
        </div>
      </div>
    );
  }

  // ========================================
  // MAIN CONTENT
  // ========================================

  return (
    <div className="min-h-screen bg-zinc-950 overflow-y-auto">
      <div className="container mx-auto px-4 max-w-lg py-12 md:py-24">
        <div className="bg-zinc-900 border-2 border-yellow-500 rounded-2xl p-6 md:p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-yellow-500/20 border-2 border-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-yellow-500" strokeWidth={2} />
          </div>

          {/* Título */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Pago Cancelado
          </h2>

          <p className="text-zinc-400 mb-6">
            No se completó el proceso de pago
          </p>

          {/* Mensaje de error si existe */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-red-400 text-sm font-medium mb-1">
                    Error al procesar la cancelación
                  </p>
                  <p className="text-red-300/90 text-xs">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Información sobre qué sucedió */}
          <div className="text-left bg-zinc-800/50 rounded-xl p-6 mb-6">
            <p className="text-zinc-300 text-sm mb-3">
              <strong className="text-white">¿Qué sucedió?</strong>
            </p>
            <p className="text-zinc-400 text-sm mb-3">
              Cancelaste el proceso de pago o cerraste la ventana de Stripe
              antes de completarlo.
              {!error &&
                " Tus datos siguen guardados y puedes intentar el pago nuevamente cuando quieras."}
            </p>

            {!error && (
              <div className="mt-4 pt-4 border-t border-zinc-700">
                <p className="text-zinc-500 text-xs space-y-1">
                  <span className="block">
                    ✓ Tu información ha sido guardada
                  </span>
                  <span className="block">
                    ✓ No se ha realizado ningún cargo
                  </span>
                  <span className="block">
                    ✓ Puedes completar el pago cuando estés listo
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Razones comunes */}
          <details className="text-left bg-zinc-800/30 rounded-xl p-4 mb-6 cursor-pointer">
            <summary className="text-white text-sm font-medium flex items-center justify-between">
              <span>¿Por qué se canceló mi pago?</span>
              <svg
                className="w-4 h-4 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="mt-3 text-zinc-400 text-xs space-y-2">
              <p>• Cerraste la ventana de pago antes de completarlo</p>
              <p>• Usaste el botón "Atrás" del navegador</p>
              <p>• Se agotó el tiempo de la sesión (30 minutos)</p>
              <p>• Decidiste no completar el pago en este momento</p>
            </div>
          </details>

          {/* Botones de acción según tipo */}
          <div className="space-y-3">
            {paymentType === "membership" && (
              <button
                onClick={() => router.push("/membership")}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Completar Membresía</span>
              </button>
            )}

            {paymentType === "event" && (
              <button
                onClick={() => router.back()}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver al Evento</span>
              </button>
            )}

            {paymentType === "shop" && (
              <button
                onClick={() => router.push("/tienda")}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver a la Tienda</span>
              </button>
            )}

            {/* Si no se conoce el tipo o hubo error, botón genérico */}
            {(!paymentType || error) && (
              <button
                onClick={() => router.back()}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver e Intentar de Nuevo</span>
              </button>
            )}

            <button
              onClick={() => router.push("/")}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Mountain className="w-5 h-5" />
              <span>Ir al Inicio</span>
            </button>
          </div>

          {/* Contacto */}
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-zinc-500 text-sm">
              ¿Necesitas ayuda?{" "}
              <a
                href="mailto:info@proyecto-cumbre.es"
                className="text-orange-500 hover:text-orange-400 underline"
              >
                Contáctanos
              </a>
            </p>
          </div>

          {/* Garantía de seguridad */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Pagos 100% seguros con Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// MAIN COMPONENT WITH SUSPENSE
// ========================================

export default function PagoCanceladoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        </div>
      }
    >
      <PagoCanceladoContent />
    </Suspense>
  );
}
