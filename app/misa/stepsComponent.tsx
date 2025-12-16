'use client';

interface StepPillProps {
  step: 1 | 2 | 3;
}

const STEP_LABELS = {
  1: 'Datos',
  2: 'Descargo',
  3: 'Pago',
} as const;

export default function StepPill({ step }: StepPillProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/60 px-3 py-1 text-xs text-white/70">
      <span className="font-semibold text-white/80">
        Paso {step} de 3
      </span>
      <span className="text-white/30">·</span>
      <span className="uppercase tracking-wider">
        {STEP_LABELS[step]}
      </span>
    </div>
  );
}
