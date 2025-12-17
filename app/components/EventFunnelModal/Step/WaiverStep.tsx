// ========================================
// COMPONENTE: WaiverStep
// Wrapper para WaiverAcceptance
// components/EventFunnelModal/steps/WaiverStep.tsx
// ========================================

'use client';

import { WaiverEvent, WaiverAcceptanceProps } from '@/lib/waivers/types';
import WaiverAcceptance from '../../PliegoDescarga/WaiverAcceptances';

interface WaiverStepProps {
  event: WaiverEvent;
  participant: {
    fullName: string;
    documentId: string;
    birthDateISO?: `${number}-${number}-${number}`;
  };
  onAccept: WaiverAcceptanceProps["onAccept"];
}

export default function WaiverStep({ event, participant, onAccept }: WaiverStepProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <WaiverAcceptance
        event={event}
        participant={participant}
        onAccept={onAccept}
        className=""
      />
    </div>
  );
}
