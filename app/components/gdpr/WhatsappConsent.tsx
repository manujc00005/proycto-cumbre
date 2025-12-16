'use client';

import React from 'react';
import { ConsentCheckbox } from './ConsentCheckbox';

type WhatsappContext = 'club' | 'event';

const whatsappTexts = {
  club: {
    label:
      'Acepto que mis datos de contacto (nombre y teléfono) sean compartidos en los grupos de WhatsApp del club',
    requiredDescription:
      'Este consentimiento es necesario para formar parte del club, ya que WhatsApp es nuestro canal principal de comunicación para avisos, coordinación de actividades y compartir experiencias.',
    optionalDescription:
      'WhatsApp es el canal principal del club. Sin este consentimiento, no recibirás avisos de actividades, fotos de salidas ni comunicaciones urgentes.',
    descriptionClassRequired: 'text-orange-300',
    descriptionClassOptional: 'text-yellow-300',
    showWarningIcon: true,
  },
  event: {
    label:
      'Acepto que mis datos de contacto (nombre y teléfono) sean compartidos con otros participantes mediante grupos de WhatsApp para coordinación del evento',
    requiredDescription: 'Solo para participantes del mismo evento',
    optionalDescription: 'Solo para participantes del mismo evento',
    descriptionClassRequired: 'text-zinc-500',
    descriptionClassOptional: 'text-zinc-500',
    showWarningIcon: false,
  },
};

export function WhatsappConsent({
  checked,
  onChange,
  required = false,
  context = 'club',
  includeEmailInLabel = false,
  compact = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  context?: WhatsappContext;
  includeEmailInLabel?: boolean;
  compact?: boolean;
}) {
  const t = whatsappTexts[context];

  const compactLabel =
  context === 'event'
    ? 'Acepto el WhatsApp del evento (nombre y teléfono)'
    : includeEmailInLabel
      ? 'Acepto el WhatsApp del club (nombre, email y teléfono)'
      : 'Acepto el WhatsApp del club (nombre y teléfono)';

    const label =
    compact ? compactLabel
    : includeEmailInLabel && context === 'club'
        ? 'Acepto que mis datos de contacto (nombre, email y teléfono) sean compartidos en los grupos de WhatsApp del club'
        : t.label;

    const desc = compact
    ? (context === 'event'
        ? 'Solo para coordinar este evento.'
        : 'Solo para coordinación y avisos.')
    : (required ? t.requiredDescription : t.optionalDescription);

    const descClass = compact
    ? 'text-white/50'
    : (required ? t.descriptionClassRequired : t.descriptionClassOptional);

  return (
    <div className="space-y-2">
      <ConsentCheckbox
        id="whatsapp-consent"
        checked={checked}
        required={required}
        onChange={onChange}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </ConsentCheckbox>

      {desc && (
        <div className={`text-xs ${descClass} pl-7`}>
            {!compact && t.showWarningIcon ? (
            <span className="flex items-start gap-1">
                <span className="mt-0.5">⚠️</span>
                <span>{desc}</span>
            </span>
            ) : (
            <span>{desc}</span>
            )}
        </div>
       )}

    </div>
  );
}
