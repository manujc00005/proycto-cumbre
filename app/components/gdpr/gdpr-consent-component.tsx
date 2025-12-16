'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ConsentCheckbox } from './ConsentCheckbox';
import { WhatsappConsent } from './WhatsappConsent';
import { GdprFooterNote } from './GdprFooterNote';

interface GDPRConsentEventProps {
  isMember?: boolean;
  onConsentChange?: (consents: { privacyPolicy: boolean; whatsapp: boolean }) => void;
}

export default function GDPRConsentEvent({ isMember = false, onConsentChange }: GDPRConsentEventProps) {
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);
  const [showWhatsappDetails, setShowWhatsappDetails] = useState(false);

  useEffect(() => {
    onConsentChange?.({ privacyPolicy, whatsapp });
  }, [privacyPolicy, whatsapp, onConsentChange]);

  return (
    <div className="space-y-3">
      <ConsentCheckbox
        id="privacy-policy"
        required
        checked={privacyPolicy}
        onChange={setPrivacyPolicy}
        className="cursor-pointer"
      >
        He leído y acepto la{' '}
        <Link href="/politica-privacidad" target="_blank" className="text-orange-400 hover:text-orange-300 underline font-semibold">
          Política de Privacidad
        </Link>{' '}
        y el{' '}
        <Link href="/aviso-legal" target="_blank" className="text-orange-400 hover:text-orange-300 underline font-semibold">
          Aviso Legal
        </Link>
        <span className="text-orange-400 ml-1">*</span>
      </ConsentCheckbox>

      <p className="text-xs text-white/60">
        Usaremos tus datos para gestionar tu plaza y enviarte avisos del evento.
      </p>

      <WhatsappConsent
        checked={whatsapp}
        onChange={setWhatsapp}
        required
        context="club"
      />

      <button
        type="button"
        onClick={() => setShowWhatsappDetails((v) => !v)}
        className="text-left text-xs text-white/60 underline underline-offset-2 hover:text-white/80"
      >
        ¿Qué datos se comparten en WhatsApp?
      </button>

      {showWhatsappDetails && (
        <div className="rounded-lg bg-black/30 border border-white/10 p-3 text-xs text-white/70 space-y-2">
          <p>
            Se compartirá tu <span className="text-white/90 font-medium">nombre</span> y{' '}
            <span className="text-white/90 font-medium">teléfono</span> con el resto de participantes del grupo.
          </p>
          <p>
            Finalidad: <span className="text-white/90 font-medium">coordinación logística</span> (coordenadas, track, avisos e incidencias).
          </p>
        </div>
      )}

      <GdprFooterNote />
    </div>
  );
}
