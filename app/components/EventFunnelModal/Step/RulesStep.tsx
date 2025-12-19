// ========================================
// COMPONENTE: RulesStep
// Muestra reglamento del evento
// components/EventFunnelModal/steps/RulesStep.tsx
// ========================================

"use client";

import { useState } from "react";

interface RulesStepProps {
  url?: string;
  text?: string;
  requireAcceptance: boolean;
  onAccept: () => void;
}

export default function RulesStep({
  url,
  text,
  requireAcceptance,
  onAccept,
}: RulesStepProps) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = (checked: boolean) => {
    setAccepted(checked);
    if (checked) {
      onAccept();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          Reglamento del Evento
        </h3>
        <p className="text-sm text-white/60">
          Es importante que conozcas las normas y condiciones del evento
        </p>
      </div>

      <div className="space-y-6">
        {/* Banner informativo */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-blue-200/90">
                <strong className="text-blue-400">Normativa del evento:</strong>{" "}
                Lee atentamente el reglamento antes de continuar. Contiene
                información importante sobre material obligatorio, horarios y
                normas de seguridad.
              </p>
            </div>
          </div>
        </div>

        {/* Contenido del reglamento */}
        {url ? (
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                📖 Reglamento del evento
              </span>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 rounded-lg transition font-medium text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Abrir reglamento
              </a>
            </div>

            {/* Iframe del PDF */}
            <iframe
              src={`${url}#view=FitH`}
              className="w-full h-[500px] bg-white"
              title="Reglamento del evento"
            />
          </div>
        ) : text ? (
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {text}
              </div>
            </div>
          </div>
        ) : null}

        {/* Checkbox de aceptación (si es requerido) */}
        {requireAcceptance && (
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => handleAccept(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-2 border-zinc-600 bg-zinc-900 checked:bg-orange-500 checked:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer transition"
              />
              <div className="flex-1">
                <span className="text-white text-base group-hover:text-orange-400 transition">
                  He leído y acepto el reglamento del evento
                </span>
                <p className="text-xs text-zinc-500 mt-2">
                  Al marcar esta casilla confirmas que has leído el reglamento
                  completo y te comprometes a cumplir con todas sus normas.
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Info adicional */}
        <div className="text-xs text-zinc-500 text-center">
          El reglamento forma parte de las condiciones de participación en el
          evento
        </div>
      </div>
    </div>
  );
}
