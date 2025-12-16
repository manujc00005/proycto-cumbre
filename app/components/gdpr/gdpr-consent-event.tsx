'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ConsentCheckbox } from './ConsentCheckbox';
import { WhatsappConsent } from './WhatsappConsent';

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
    <div className="space-y-4">
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

      {/* <ClubCommsDisclosure variant="event" isMember={isMember} /> */}
      <p className="text-xs text-white/60">
        Usaremos tus datos para gestionar la inscripción y enviarte información logística del evento.
      </p>

      <WhatsappConsent
        checked={whatsapp}
        onChange={setWhatsapp}
        required
        context="event"   // IMPORTANTÍSIMO para tu caso (evento)
        compact
/>

      {/* <GdprFooterNote /> */}
    </div>
  );
}
