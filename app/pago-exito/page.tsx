// ========================================
// PÁGINA GENÉRICA: PAGO EXITOSO
// app/pago-exito/page.tsx
// ========================================

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Mountain, AlertCircle, Loader2, ArrowRight, Download, Calendar } from 'lucide-react';
import { logger } from '@/lib/logger';

// ========================================
// TYPES
// ========================================

interface PaymentData {
  type: 'membership' | 'event' | 'shop';
  amount: number;
  status: string;
  
  // Member data (if type === 'membership')
  firstName?: string;
  lastName?: string;
  email?: string;
  memberNumber?: string;
  licenseType?: string;
  
  // Event data (if type === 'event')
  eventName?: string;
  eventSlug?: string;
  eventDate?: string;
  participantName?: string;
  
  // Shop data (if type === 'shop')
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  
  // Metadata adicional
  metadata?: Record<string, any>;
}

// ========================================
// COMPONENT CONTENT
// ========================================

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
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
      logger.log('🔍 Verificando pago con sesión:', sessionId);

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

      logger.log('✅ Pago verificado:', data);
      setPaymentData(data);

    } catch (error: any) {
      logger.error('❌ Error verificando pago:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOADING STATE
  // ========================================
  
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
              Estamos confirmando tu pago con Stripe y procesando tu compra
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================
  
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

  if (!paymentData) return null;

  const amount = (paymentData.amount / 100).toFixed(2);

  // ========================================
  // SUCCESS STATE
  // ========================================
  
  return (
    <div className="min-h-screen bg-zinc-950 overflow-y-auto">
      <div className="container mx-auto px-4 max-w-2xl py-12 md:py-24">
        
        {/* Card principal de éxito */}
        <div className="bg-zinc-900 border-2 border-green-500 rounded-2xl p-6 md:p-8 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Checkmark animado */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300 delay-150">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          
          {/* Título dinámico según tipo */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center">
            {paymentData.type === 'membership' && '¡Bienvenido a Proyecto Cumbre!'}
            {paymentData.type === 'event' && '¡Inscripción Confirmada!'}
            {paymentData.type === 'shop' && '¡Pedido Recibido!'}
          </h1>
          
          <p className="text-zinc-400 text-center mb-6">
            Tu pago se ha procesado correctamente
          </p>

          {/* Monto pagado */}
          <div className="bg-zinc-800 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-500 text-sm">Monto pagado</span>
              <span className="text-orange-500 text-3xl md:text-4xl font-bold">
                {amount}€
              </span>
            </div>
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
          </div>

          {/* CONTENIDO ESPECÍFICO POR TIPO */}
          
          {/* MEMBERSHIP */}
          {paymentData.type === 'membership' && (
            <>
              <div className="bg-zinc-800/50 rounded-xl p-6 mb-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Tu Membresía
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Socio:</span>
                    <span className="text-white font-medium">
                      {paymentData.firstName} {paymentData.lastName}
                    </span>
                  </div>
                  {paymentData.memberNumber && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Número de socio:</span>
                      <span className="text-orange-400 font-bold">#{paymentData.memberNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Email:</span>
                    <span className="text-zinc-300">{paymentData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Estado:</span>
                    <span className="text-green-400 font-bold">✓ ACTIVO</span>
                  </div>
                  {paymentData.licenseType && paymentData.licenseType !== 'none' && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Licencia FEDME:</span>
                      <span className="text-orange-400 font-medium">En tramitación</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Próximos pasos membresía */}
              <NextStepsMembership hasLicense={paymentData.licenseType !== 'none'} />
            </>
          )}

          {/* EVENT */}
          {paymentData.type === 'event' && (
            <>
              <div className="bg-zinc-800/50 rounded-xl p-6 mb-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  Detalles del Evento
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Evento:</span>
                    <span className="text-white font-medium">{paymentData.eventName}</span>
                  </div>
                  {paymentData.eventDate && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Fecha:</span>
                      <span className="text-zinc-300">{new Date(paymentData.eventDate).toLocaleDateString('es-ES', { dateStyle: 'long' })}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Participante:</span>
                    <span className="text-zinc-300">{paymentData.participantName}</span>
                  </div>
                </div>
              </div>

              {/* Próximos pasos evento */}
              <NextStepsEvent eventSlug={paymentData.eventSlug} />
            </>
          )}

          {/* SHOP */}
          {paymentData.type === 'shop' && paymentData.items && (
            <>
              <div className="bg-zinc-800/50 rounded-xl p-6 mb-6">
                <h3 className="text-white font-bold mb-4">Resumen del Pedido</h3>
                <div className="space-y-3">
                  {paymentData.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-zinc-300">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-white font-medium">
                        {(item.price / 100).toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Próximos pasos tienda */}
              <NextStepsShop />
            </>
          )}
        </div>

        {/* Nota informativa si tiene licencia */}
        {paymentData.type === 'membership' && paymentData.licenseType && paymentData.licenseType !== 'none' && (
          <LicenseInfo />
        )}

        {/* Botones de acción */}
        <ActionButtons 
          type={paymentData.type} 
          eventSlug={paymentData.eventSlug}
        />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

// ========================================
// SUB-COMPONENTS
// ========================================

function NextStepsMembership({ hasLicense }: { hasLicense: boolean }) {
  return (
    <div className="bg-zinc-800/30 rounded-xl p-6">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <ArrowRight className="w-5 h-5 text-orange-500" />
        Próximos Pasos
      </h3>
      <ul className="space-y-3">
        <StepItem number={1} icon="✓" color="green">
          Recibirás un <strong>email de confirmación</strong> en los próximos minutos
        </StepItem>
        
        {hasLicense && (
          <StepItem number={2} icon="2" color="orange">
            Tu <strong>licencia federativa</strong> será procesada en 48-72 horas
          </StepItem>
        )}
        
        <StepItem number={hasLicense ? 3 : 2} icon={hasLicense ? "3" : "2"} color="blue">
          Te contactaremos para la <strong>entrega del merchandising</strong> del club
        </StepItem>
        
        <StepItem number={hasLicense ? 4 : 3} icon={hasLicense ? "4" : "3"} color="purple">
          Ya puedes <strong>participar en todas las actividades</strong> del club
        </StepItem>
      </ul>
    </div>
  );
}

function NextStepsEvent({ eventSlug }: { eventSlug?: string }) {
  return (
    <div className="bg-zinc-800/30 rounded-xl p-6">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <ArrowRight className="w-5 h-5 text-orange-500" />
        Próximos Pasos
      </h3>
      <ul className="space-y-3">
        <StepItem number={1} icon="✓" color="green">
          Recibirás un <strong>email de confirmación</strong> con todos los detalles
        </StepItem>
        
        <StepItem number={2} icon="2" color="orange">
          Te enviaremos información sobre <strong>material obligatorio</strong> y recomendaciones
        </StepItem>
        
        <StepItem number={3} icon="3" color="blue">
          Recibirás el <strong>track GPS</strong> y punto de encuentro 48h antes del evento
        </StepItem>
        
        {eventSlug && (
          <StepItem number={4} icon="4" color="purple">
            Puedes descargar tu <strong>descargo de responsabilidad</strong> firmado cuando quieras
          </StepItem>
        )}
      </ul>
    </div>
  );
}

function NextStepsShop() {
  return (
    <div className="bg-zinc-800/30 rounded-xl p-6">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <ArrowRight className="w-5 h-5 text-orange-500" />
        Próximos Pasos
      </h3>
      <ul className="space-y-3">
        <StepItem number={1} icon="✓" color="green">
          Recibirás un <strong>email de confirmación</strong> con los detalles de tu pedido
        </StepItem>
        
        <StepItem number={2} icon="2" color="orange">
          Procesaremos tu pedido en las próximas <strong>24-48 horas</strong>
        </StepItem>
        
        <StepItem number={3} icon="3" color="blue">
          Te notificaremos cuando tu pedido esté <strong>listo para enviar</strong>
        </StepItem>
      </ul>
    </div>
  );
}

function StepItem({ number, icon, color, children }: { 
  number: number; 
  icon: string; 
  color: 'green' | 'orange' | 'blue' | 'purple';
  children: React.ReactNode;
}) {
  const colors = {
    green: 'bg-green-500/20 text-green-500',
    orange: 'bg-orange-500/20 text-orange-500',
    blue: 'bg-blue-500/20 text-blue-500',
    purple: 'bg-purple-500/20 text-purple-500',
  };

  return (
    <li className="flex items-start gap-3 text-sm">
      <div className={`w-6 h-6 ${colors[color]} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
        {icon === '✓' ? (
          <Check className="w-4 h-4" />
        ) : (
          <span className="text-xs font-bold">{icon}</span>
        )}
      </div>
      <div>
        <p className="text-zinc-300">{children}</p>
      </div>
    </li>
  );
}

function LicenseInfo() {
  return (
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
  );
}

function ActionButtons({ type, eventSlug }: { type: string; eventSlug?: string }) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      <button
        onClick={() => router.push('/')}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
      >
        <Mountain className="w-5 h-5" />
        <span>Volver al Inicio</span>
      </button>

      {type === 'event' && eventSlug && (
        <button
          onClick={() => router.push(`/${eventSlug}`)}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          <span>Ver Detalles del Evento</span>
        </button>
      )}

      <button
        onClick={() => window.print()}
        className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-3 rounded-xl transition-colors"
      >
        Imprimir Confirmación
      </button>
    </div>
  );
}

function Footer() {
  return (
    <div className="mt-8 text-center">
      <p className="text-zinc-500 text-sm">
        ¿Tienes alguna pregunta? Contáctanos en{' '}
        <a href="mailto:info@proyecto-cumbre.es" className="text-orange-500 hover:text-orange-400">
          info@proyecto-cumbre.es
        </a>
      </p>
    </div>
  );
}

// ========================================
// MAIN COMPONENT WITH SUSPENSE
// ========================================

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
