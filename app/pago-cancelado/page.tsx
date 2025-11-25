'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, Mountain, ArrowLeft } from 'lucide-react';
import { logger } from '@/lib/logger';

function PagoCanceladoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCancellation = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        logger.log('⚠️ No se encontró session_id en la URL');
        setIsProcessing(false);
        return;
      }

      try {
        logger.log('🚫 Procesando cancelación del pago...');
        logger.log('Session ID:', sessionId);
        
        // Llamar a la API para marcar el pago como cancelado
        const response = await fetch('/api/payment-cancelled', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al procesar la cancelación');
        }

        logger.log('✅ Pago marcado como cancelado');
        
      } catch (error: any) {
        logger.error('❌ Error al procesar cancelación:', error);
        setError(error.message);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCancellation();
  }, [searchParams]);

  // Pantalla de carga mientras procesa
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Procesando cancelación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 overflow-y-auto">
      <div className="container mx-auto px-4 max-w-lg py-24">
        <div className="bg-zinc-900 border-2 border-yellow-500 rounded-2xl p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-yellow-500/20 border-2 border-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-yellow-500" strokeWidth={2} />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3">
            Pago Cancelado
          </h2>
          
          <p className="text-zinc-400 mb-6">
            No se completó el proceso de pago
          </p>

          {/* Mensaje de error si existe */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          <div className="text-left bg-zinc-800/50 rounded-lg p-6 mb-6">
            <p className="text-zinc-300 text-sm mb-3">
              <strong className="text-white">¿Qué sucedió?</strong>
            </p>
            <p className="text-zinc-400 text-sm mb-3">
              Cancelaste el proceso de pago o cerraste la ventana de Stripe antes de completarlo. 
              Tus datos siguen guardados y puedes intentar el pago nuevamente cuando quieras.
            </p>
            
            {!error && (
              <div className="mt-4 pt-4 border-t border-zinc-700">
                <p className="text-zinc-500 text-xs">
                  ✓ Tu información ha sido guardada<br/>
                  ✓ No se ha realizado ningún cargo<br/>
                  ✓ Puedes completar el pago cuando estés listo
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/membership')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a Intentar</span>
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Mountain className="w-5 h-5" />
              <span>Ir al Inicio</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-zinc-500 text-sm">
              ¿Necesitas ayuda?{' '}
              <a 
                href="mailto:info@proyecto-cumbre.es" 
                className="text-orange-500 hover:text-orange-400 underline"
              >
                Contáctanos
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PagoCanceladoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Cargando...</p>
        </div>
      </div>
    }>
      <PagoCanceladoContent />
    </Suspense>
  );
}