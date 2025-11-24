// app/success/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Mountain, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [memberData, setMemberData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No se encontró el ID de sesión');
      setLoading(false);
      return;
    }

    verifyPayment(sessionId);
  }, [sessionId]);

  const verifyPayment = async (sessionId: string) => {
    try {
      console.log('🔍 Verificando pago con sesión:', sessionId);

      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al verificar el pago');
      }

      console.log('✅ Pago verificado:', data);
      setMemberData(data);

    } catch (error: any) {
      console.error('❌ Error verificando pago:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Estado de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-3">
            Verificando tu pago...
          </h2>
          <p className="text-zinc-400">
            Esto solo tomará un momento
          </p>
          <div className="mt-6 bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <p className="text-zinc-500 text-sm">
              Estamos confirmando tu pago con Stripe y activando tu membresía
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Error al Verificar el Pago
            </h2>
            <p className="text-red-300 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Volver al Inicio
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasLicense = memberData?.licenseType && memberData.licenseType !== 'none';
  const amount = memberData?.amount ? (memberData.amount / 100).toFixed(2) : '50.00';

  // Pantalla de éxito
  return (
    <div className="min-h-screen bg-zinc-950 overflow-y-auto">
      <div className="container mx-auto px-4 max-w-2xl py-12 md:py-24">
        {/* Card principal de éxito */}
        <div className="bg-zinc-900 border-2 border-green-500 rounded-2xl p-6 md:p-8 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Checkmark animado */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300 delay-150">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          
          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center">
            ¡Pago Realizado con Éxito!
          </h1>
          
          <p className="text-zinc-400 text-center mb-6">
            Bienvenido a Proyecto Cumbre 🏔️
          </p>

          {/* Monto pagado */}
          <div className="bg-zinc-800 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-500 text-sm">Monto pagado</span>
              <span className="text-orange-500 text-3xl md:text-4xl font-bold">
                {amount}€
              </span>
            </div>
            {memberData && (
              <div className="border-t border-zinc-700 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Estado del pago:</span>
                  <span className="text-green-400 font-medium">✓ Completado</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">ID de transacción:</span>
                  <span className="text-zinc-400 font-mono text-xs">{sessionId?.slice(-12)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Info del socio */}
          {memberData && (
            <div className="bg-zinc-800/50 rounded-xl p-6 mb-6 animate-in fade-in duration-500 delay-300">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Tu Membresía
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-zinc-500">Socio:</span>
                  <span className="text-white font-medium text-right">
                    {memberData.firstName} {memberData.lastName}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-zinc-500">Email:</span>
                  <span className="text-zinc-300 text-right break-all">{memberData.email}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-zinc-500">Estado:</span>
                  <span className="text-green-400 font-bold">✓ ACTIVO</span>
                </div>
                {hasLicense && (
                  <div className="flex justify-between items-start">
                    <span className="text-zinc-500">Licencia FEDME:</span>
                    <span className="text-orange-400 font-medium">En tramitación</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Próximos pasos */}
          <div className="bg-zinc-800/30 rounded-xl p-6 animate-in fade-in duration-500 delay-500">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-orange-500" />
              Próximos Pasos
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-zinc-300">
                    Recibirás un <strong className="text-white">email de confirmación</strong> en los próximos minutos
                  </p>
                </div>
              </li>
              
              {hasLicense && (
                <li className="flex items-start gap-3 text-sm">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-500 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-zinc-300">
                      Tu <strong className="text-white">licencia federativa</strong> será procesada en 48-72 horas
                    </p>
                  </div>
                </li>
              )}
              
              <li className="flex items-start gap-3 text-sm">
                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-500 text-xs font-bold">{hasLicense ? '3' : '2'}</span>
                </div>
                <div>
                  <p className="text-zinc-300">
                    Te contactaremos para la <strong className="text-white">entrega del merchandising</strong> del club
                  </p>
                </div>
              </li>
              
              <li className="flex items-start gap-3 text-sm">
                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-500 text-xs font-bold">{hasLicense ? '4' : '3'}</span>
                </div>
                <div>
                  <p className="text-zinc-300">
                    Ya puedes <strong className="text-white">participar en todas las actividades</strong> del club
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Nota informativa */}
        {hasLicense && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-orange-300 font-medium mb-1">
                Sobre tu Licencia FEDME
              </p>
              <p className="text-orange-400/90 text-xs leading-relaxed">
                La licencia federativa será tramitada con la FEDME en los próximos días. Te notificaremos por email cuando esté lista y puedas descargarla.
              </p>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <Mountain className="w-5 h-5" />
            <span>Volver al Inicio</span>
          </button>

          <button
            onClick={() => window.print()}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-3 rounded-xl transition-colors"
          >
            Imprimir Confirmación
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            ¿Tienes alguna pregunta? Contáctanos en{' '}
            <a href="mailto:info@proyecto-cumbre.com" className="text-orange-500 hover:text-orange-400">
              info@proyecto-cumbre.es
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Wrapper con Suspense para useSearchParams
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
