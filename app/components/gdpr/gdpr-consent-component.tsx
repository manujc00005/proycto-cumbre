// components/gdpr/gdpr-consent-component.tsx

import { useEffect, useState, useRef } from 'react';
import { Info } from 'lucide-react';

interface GDPRConsentProps {
  required?: boolean;
  includeWhatsApp?: boolean;
  whatsappRequired?: boolean;
  whatsappContext?: 'club' | 'event';
  onConsentChange?: (consents: ConsentState) => void;
}

export default function GDPRConsent({ 
  required = true,
  includeWhatsApp = false,
  whatsappRequired = false,
  whatsappContext = 'club',
  onConsentChange 
}: GDPRConsentProps) {
  const [consents, setConsents] = useState<ConsentState>({
    privacyPolicy: false,
    whatsapp: false
  });

    const handleConsentChange = (key: keyof ConsentState, value: boolean) => {
    setConsents(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const onConsentChangeRef = useRef(onConsentChange);

  useEffect(() => {
    onConsentChangeRef.current = onConsentChange;
  }, [onConsentChange]);

  useEffect(() => {
    onConsentChangeRef.current?.(consents);
  }, [consents]);

  // Textos según contexto
  const whatsappTexts = {
    club: {
      label: 'Acepto que mis datos de contacto (nombre y teléfono) sean compartidos en los grupos de WhatsApp del club',
      description: whatsappRequired 
        ? 'Este consentimiento es necesario para formar parte del club, ya que WhatsApp es nuestro canal principal de comunicación para avisos, coordinación de actividades y compartir experiencias.'
        : 'WhatsApp es el canal principal del club. Sin este consentimiento, no recibirás avisos de actividades, fotos de salidas ni comunicaciones urgentes.',
      descriptionClass: whatsappRequired ? 'text-orange-300' : 'text-yellow-300'
    },
    event: {
      label: 'Acepto que mis datos de contacto (nombre y teléfono) sean compartidos con otros participantes mediante grupos de WhatsApp para coordinación del evento',
      description: 'Solo para participantes del mismo evento',
      descriptionClass: 'text-zinc-500'
    }
  };

  const whatsappText = whatsappTexts[whatsappContext];

  return (
    <div className="space-y-4">
      
      {/* Consentimiento obligatorio - Política de Privacidad */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="privacy-policy"
          required={required}
          checked={consents.privacyPolicy}
          onChange={(e) => handleConsentChange('privacyPolicy', e.target.checked)}
          className="mt-1 w-4 h-4 text-orange-500 rounded border-zinc-700 focus:ring-orange-500 focus:ring-offset-zinc-900"
        />
        <label htmlFor="privacy-policy" className="text-zinc-300 leading-relaxed text-sm">
          He leído y acepto la{' '}
          <a 
            href="/politica-privacidad" 
            target="_blank"
            className="text-orange-500 hover:text-orange-400 underline"
          >
            Política de Privacidad
          </a>
          {' '}y el{' '}
          <a 
            href="/aviso-legal" 
            target="_blank"
            className="text-orange-500 hover:text-orange-400 underline"
          >
            Aviso Legal
          </a>
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      {/* 🆕 INFORMACIÓN SOBRE COMUNICACIONES (Interés Legítimo) */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-200 font-medium mb-2">
              Comunicaciones del club
            </p>
            <p className="text-blue-300/90 mb-2">
              Como socio del club, recibirás comunicaciones por email sobre eventos, 
              actividades, salidas programadas y novedades del club. Esto nos permite 
              mantener a todos los socios informados y facilitar su participación activa.
            </p>
            <p className="text-blue-400 text-xs">
              Base legal: Interés legítimo del club en mantener informados a sus socios. 
              Puedes oponerte en cualquier momento escribiendo a{' '}
              <a 
                href="mailto:privacidad@proyecto-cumbre.es" 
                className="text-blue-300 hover:text-blue-200 underline"
              >
                privacidad@proyecto-cumbre.es
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Consentimiento WhatsApp - Obligatorio u Opcional */}
      {includeWhatsApp && (
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="whatsapp-consent"
            required={whatsappRequired}
            checked={consents.whatsapp}
            onChange={(e) => handleConsentChange('whatsapp', e.target.checked)}
            className="mt-1 w-4 h-4 text-orange-500 rounded border-zinc-700 focus:ring-orange-500 focus:ring-offset-zinc-900"
          />
          <label htmlFor="whatsapp-consent" className="text-zinc-300 leading-relaxed text-sm">
            {whatsappText.label}
            {whatsappRequired && <span className="text-red-500 ml-1">*</span>}
            <span className={`block text-xs mt-1 ${whatsappText.descriptionClass}`}>
              {whatsappRequired && whatsappContext === 'club' && (
                <span className="flex items-start gap-1">
                  <span className="mt-0.5">⚠️</span>
                  <span>{whatsappText.description}</span>
                </span>
              )}
              {!whatsappRequired && whatsappContext === 'club' && (
                <span className="flex items-start gap-1">
                  <span className="mt-0.5">⚠️</span>
                  <span>{whatsappText.description}</span>
                </span>
              )}
              {whatsappContext === 'event' && (
                <span>{whatsappText.description}</span>
              )}
            </span>
          </label>
        </div>
      )}

      {/* Información adicional */}
      <div className="text-xs text-zinc-500 pt-2 border-t border-zinc-800">
        <p className="flex items-start gap-2">
          <span>ℹ️</span>
          <span>
            Tus datos serán tratados por Proyecto Cumbre con las finalidades descritas en nuestra Política de Privacidad. 
            Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad 
            escribiendo a{' '}
            <a 
              href="mailto:privacidad@proyecto-cumbre.es" 
              className="text-orange-500 hover:text-orange-400"
            >
              privacidad@proyecto-cumbre.es
            </a>
          </span>
        </p>
      </div>
    </div>
  );
}
