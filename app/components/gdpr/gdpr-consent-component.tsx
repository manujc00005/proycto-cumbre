'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ConsentCheckbox } from './ConsentCheckbox';
import { ClubCommsDisclosure } from './ClubCommsDisclosure';
import { WhatsappConsent } from './WhatsappConsent';
import { GdprFooterNote } from './GdprFooterNote';

export interface ConsentState {
  privacyPolicy: boolean;
  whatsapp: boolean;
}

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
  onConsentChange,
}: GDPRConsentProps) {
  const [consents, setConsents] = useState<ConsentState>({
    privacyPolicy: false,
    whatsapp: false,
  });

  const onConsentChangeRef = useRef(onConsentChange);
  useEffect(() => {
    onConsentChangeRef.current = onConsentChange;
  }, [onConsentChange]);

  useEffect(() => {
    onConsentChangeRef.current?.(consents);
  }, [consents]);

  const setConsent = (key: keyof ConsentState, value: boolean) => {
    setConsents(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <ConsentCheckbox
        id="privacy-policy"
        required={required}
        checked={consents.privacyPolicy}
        onChange={(v) => setConsent('privacyPolicy', v)}
      >
        He leído y acepto la{' '}
        <a href="/politica-privacidad" target="_blank" className="text-orange-500 hover:text-orange-400 underline">
          Política de Privacidad
        </a>{' '}
        y el{' '}
        <a href="/aviso-legal" target="_blank" className="text-orange-500 hover:text-orange-400 underline">
          Aviso Legal
        </a>
        {required && <span className="text-red-500 ml-1">*</span>}
      </ConsentCheckbox>

      <ClubCommsDisclosure variant="club" />

      {includeWhatsApp && (
        <WhatsappConsent
          checked={consents.whatsapp}
          onChange={(v) => setConsent('whatsapp', v)}
          required={whatsappRequired}
          context={whatsappContext}
        />
      )}

      <GdprFooterNote />
    </div>
  );
}
