// components/gdpr/gdpr-consent-event.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface GDPRConsentEventProps {
  isMember?: boolean; // Si el email coincide con un miembro
  onConsentChange?: (consents: {
    privacyPolicy: boolean;
    whatsapp: boolean;
  }) => void;
}

export default function GDPRConsentEvent({
  isMember = false,
  onConsentChange,
}: GDPRConsentEventProps) {
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);


  const [showMarketingInfo, setShowMarketingInfo] = useState(false);

  const emit = (next: Partial<{ privacyPolicy: boolean; whatsapp: boolean }>) => {
    const payload = {
      privacyPolicy: next.privacyPolicy ?? privacyPolicy,
      whatsapp: next.whatsapp ?? whatsapp,
    };
    onConsentChange?.(payload);
  };

  const handlePrivacyChange = (checked: boolean) => {
    setPrivacyPolicy(checked);
    emit({ privacyPolicy: checked });
  };

  const handleWhatsappChange = (checked: boolean) => {
    setWhatsapp(checked);
    emit({ whatsapp: checked });
  };

  return (
    <div className="space-y-4">
      {/* 1️⃣ CHECKBOX PRIVACIDAD - OBLIGATORIO */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={privacyPolicy}
          onChange={(e) => handlePrivacyChange(e.target.checked)}
          required
          className="mt-1 w-4 h-4 rounded border-white/20 bg-black/50 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer"
        />
        <span className="text-sm text-white/80 leading-relaxed">
          He leído y acepto la{' '}
          <Link
            href="/politica-privacidad"
            target="_blank"
            className="text-orange-400 hover:text-orange-300 underline font-semibold"
          >
            Política de Privacidad
          </Link>{' '}
          y el{' '}
          <Link
            href="/aviso-legal"
            target="_blank"
            className="text-orange-400 hover:text-orange-300 underline font-semibold"
          >
            Aviso Legal
          </Link>
          <span className="text-orange-400 ml-1">*</span>
        </span>
      </label>

      {/* 2️⃣ INFO BOX MARKETING - DESPLEGABLE ADAPTADO */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg">
        {/* Header clickeable */}
        <button
          type="button"
          onClick={() => setShowMarketingInfo(!showMarketingInfo)}
          className="w-full p-4 flex items-start gap-3 text-left hover:bg-blue-500/5 transition-colors rounded-lg"
        >
          <svg
            className={`w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 transition-transform ${
              showMarketingInfo ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>

          <div className="flex-1">
            <p className="text-blue-300 font-semibold text-sm mb-1">ℹ️ Comunicaciones sobre eventos</p>
            <p className="text-blue-200/70 text-xs">
              {isMember
                ? 'Como socio, recibirás información sobre este y otros eventos'
                : 'Información sobre este evento y futuras actividades'}
            </p>
          </div>
        </button>

        {/* Contenido expandible */}
        {showMarketingInfo && (
          <div className="px-4 pb-4 pt-2 border-t border-blue-500/20">
            {isMember ? (
              <>
                <p className="text-blue-200/80 text-xs leading-relaxed mb-3">
                  Como socio del club, recibirás comunicaciones por email sobre eventos, actividades, salidas
                  programadas y novedades del club. Esto nos permite mantener a todos los socios informados y
                  facilitar su participación activa.
                </p>
                <p className="text-blue-300/70 text-xs leading-relaxed">
                  <strong className="text-blue-300">Base legal:</strong> Interés legítimo del club en mantener
                  informados a sus socios. Puedes oponerte en cualquier momento escribiendo a{' '}
                  <a
                    href="mailto:privacidad@proyecto-cumbre.es"
                    className="text-orange-400 hover:text-orange-300 underline"
                  >
                    privacidad@proyecto-cumbre.es
                  </a>
                </p>
              </>
            ) : (
              <>
                <p className="text-blue-200/80 text-xs leading-relaxed mb-3">
                  Al inscribirte a este evento, podrás recibir comunicaciones relacionadas con la actividad
                  (confirmaciones, actualizaciones, información logística). También te informaremos sobre eventos
                  futuros similares que puedan interesarte.
                </p>
                <p className="text-blue-300/70 text-xs leading-relaxed mb-2">
                  <strong className="text-blue-300">Base legal:</strong> Ejecución del contrato (este evento) e
                  interés legítimo del club para informarte sobre actividades relacionadas.
                </p>
                <p className="text-blue-300/70 text-xs leading-relaxed">
                  Puedes oponerte a recibir información sobre futuros eventos escribiendo a{' '}
                  <a
                    href="mailto:privacidad@proyecto-cumbre.es"
                    className="text-orange-400 hover:text-orange-300 underline"
                  >
                    privacidad@proyecto-cumbre.es
                  </a>
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* 3️⃣ CHECKBOX WHATSAPP - OBLIGATORIO CON EMAIL */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={whatsapp}
          onChange={(e) => handleWhatsappChange(e.target.checked)}
          required
          className="mt-1 w-4 h-4 rounded border-white/20 bg-black/50 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer"
        />
        <div className="flex-1">
          <span className="text-sm text-white/80 leading-relaxed block">
            Acepto que mis datos de contacto (<strong>nombre, email y teléfono</strong>) sean compartidos en los grupos
            de WhatsApp del club
            <span className="text-orange-400 ml-1">*</span>
          </span>

          <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-300/90 flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>
              WhatsApp es el canal principal del club. Sin este consentimiento, no recibirás avisos de actividades,
              fotos de salidas ni comunicaciones urgentes.
            </span>
          </div>
        </div>
      </label>

      {/* 4️⃣ INFO FOOTER */}
      <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30">
        <p className="text-zinc-400 text-xs leading-relaxed flex items-start gap-2">
          <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Tus datos serán tratados por Proyecto Cumbre con las finalidades descritas en nuestra{' '}
            <Link href="/politica-privacidad" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
              Política de Privacidad
            </Link>
            . Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad
            escribiendo a{' '}
            <a href="mailto:privacidad@proyecto-cumbre.es" className="text-orange-400 hover:text-orange-300 underline">
              privacidad@proyecto-cumbre.es
            </a>
          </span>
        </p>
      </div>
    </div>
  );
}
