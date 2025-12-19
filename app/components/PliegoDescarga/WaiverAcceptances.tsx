// ========================================
// COMPONENTE: WaiverAcceptance
// Gestión de aceptación de descargo de responsabilidad para eventos
// components/WaiverAcceptance.tsx
// ========================================

"use client";

import { useState, useEffect } from "react";
import { DEFAULT_ORGANIZER } from "@/lib/organizer";
import { DEFAULT_WAIVER_UI } from "@/lib/waivers/default-ui";
import {
  WaiverAcceptancePayload,
  WaiverAcceptanceProps,
} from "@/lib/waivers/types";

// ========================================
// HELPER: Calculate SHA-256 hash
// ========================================

async function calculateSHA256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

// ========================================
// COMPONENT
// ========================================

export default function WaiverAcceptance({
  event,
  participant,
  onAccept,
  className = "",
  organizer = DEFAULT_ORGANIZER,
  ui: uiOverrides,
}: WaiverAcceptanceProps) {
  // ========================================
  // STATE
  // ========================================
  const ui = { ...DEFAULT_WAIVER_UI, ...uiOverrides };
  const [accepted, setAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const rulesMissingButRequired = ui.requireRules && !event.rulesUrl;
  // ========================================
  // HANDLERS
  // ========================================

  const handleAccept = async () => {
    if (!accepted) return;

    setIsProcessing(true);

    try {
      // Calcular hash del texto del descargo
      const waiverTextHash = await calculateSHA256(event.waiverText);

      // Crear payload
      const payload: WaiverAcceptancePayload = {
        eventId: event.eventId,
        waiverVersion: event.waiverVersion,
        acceptedAtISO: new Date().toISOString(),
        participantFullName: participant.fullName,
        participantDocumentId: participant.documentId,
        participantBirthDateISO: participant.birthDateISO,
        waiverTextHash,
      };

      // Llamar callback del parent
      await onAccept(payload);
    } catch (error) {
      console.error("Error al procesar aceptación:", error);
      alert("Error al procesar la aceptación. Por favor, inténtalo de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [showModal]);
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showModal) setShowModal(false);
        if (showRulesModal) setShowRulesModal(false);
      }
    };

    if (showModal || showRulesModal) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [showModal, showRulesModal]);

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatEventDate = (isoDate: string) => {
    try {
      return new Date(isoDate).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return isoDate;
    }
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className={`waiver-acceptance ${className}`}>
      {/* ========================================
          RESUMEN DEL EVENTO
          ======================================== */}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Resumen del Evento
        </h2>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            <div>
              <p className="text-zinc-400 text-sm">Evento</p>
              <p className="text-white font-semibold">{event.eventName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="text-zinc-400 text-sm">Fecha</p>
              <p className="text-white font-semibold">
                {formatEventDate(event.eventDateISO)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <p className="text-zinc-400 text-sm">Lugar</p>
              <p className="text-white font-semibold">{event.eventLocation}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <div>
              <p className="text-zinc-400 text-sm">Modalidad</p>
              <p className="text-white font-semibold">{event.modalityName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          DESCARGO DE RESPONSABILIDAD
          ======================================== */}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Descargo de Responsabilidad
        </h2>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-yellow-200/90">
                <strong className="text-yellow-500">
                  Lectura obligatoria:
                </strong>{" "}
                Debes leer y aceptar el descargo de responsabilidad y el
                reglamento antes de continuar con el pago.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Botón ver descargo */}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-lg transition font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Ver descargo de responsabilidad completo
          </button>

          {/* Enlace al reglamento */}
          {ui.showRulesButton && event.rulesUrl ? (
            <button
              type="button"
              onClick={() => setShowRulesModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 rounded-lg transition font-medium"
            >
              <svg
                className="w-5 h-5"
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
              Ver reglamento del evento
            </button>
          ) : null}

          <div className="text-xs text-zinc-500 text-center">
            Versión del descargo:{" "}
            <span className="font-mono text-zinc-400">
              {event.waiverVersion}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================
          CHECKBOX DE ACEPTACIÓN
          ======================================== */}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-2 border-zinc-600 bg-zinc-800 checked:bg-orange-500 checked:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer transition"
          />
          <div className="flex-1">
            <span className="text-white text-base group-hover:text-orange-400 transition">
              He leído y acepto el descargo de responsabilidad y el reglamento
              del evento
            </span>
            <p className="text-xs text-zinc-500 mt-2">
              Al marcar esta casilla, declaras que has leído y comprendido el
              descargo de responsabilidad (versión {event.waiverVersion}) y el
              reglamento del evento, y aceptas sus términos.
            </p>
          </div>
        </label>
      </div>

      {/* ========================================
          BOTÓN CONTINUAR AL PAGO
          ======================================== */}

      <button
        type="button"
        onClick={handleAccept}
        disabled={!accepted || isProcessing || rulesMissingButRequired}
        className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-orange-500/50 disabled:shadow-none"
      >
        {isProcessing ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Procesando...
          </>
        ) : (
          <>
            Continuar al pago
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </>
        )}
      </button>

      {/* Info legal */}
      {organizer && (
        <div className="mt-4 text-center text-xs text-zinc-500">
          <p>
            Organizador:{" "}
            <strong className="text-zinc-400">{organizer.name}</strong>
            {organizer.nif && ` (NIF: ${organizer.nif})`}
          </p>

          {organizer.address && <p className="mt-1">{organizer.address}</p>}

          {(organizer.privacyEmail || organizer.phone) && (
            <p className="mt-1">
              Contacto:{" "}
              {organizer.privacyEmail && (
                <a
                  href={`mailto:${organizer.privacyEmail}`}
                  className="text-orange-400 hover:text-orange-300 underline"
                >
                  {organizer.privacyEmail}
                </a>
              )}
              {organizer.phone && <> · {organizer.phone}</>}
            </p>
          )}
        </div>
      )}

      {/* ========================================
          MODALES CON TEXTO COMPLETO
          ======================================== */}
      {showModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setShowModal(false)}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            role="dialog"
            aria-labelledby="waiver-modal-title"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col my-8">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <h3
                  id="waiver-modal-title"
                  className="text-2xl font-bold text-white"
                >
                  Descargo de Responsabilidad
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-white"
                  aria-label="Cerrar modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-6">
                    <p className="text-sm text-zinc-300 mb-2">
                      <strong>Evento:</strong> {event.eventName}
                    </p>
                    <p className="text-sm text-zinc-300 mb-2">
                      <strong>Fecha:</strong>{" "}
                      {formatEventDate(event.eventDateISO)}
                    </p>
                    <p className="text-sm text-zinc-300 mb-2">
                      <strong>Modalidad:</strong> {event.modalityName}
                    </p>
                    <p className="text-xs text-zinc-500 mt-3">
                      Versión: {event.waiverVersion}
                    </p>
                  </div>

                  <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {event.waiverText}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-zinc-800">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {showRulesModal && event.rulesUrl && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setShowRulesModal(false)}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            role="dialog"
            aria-labelledby="rules-modal-title"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col my-8">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <h3
                  id="rules-modal-title"
                  className="text-2xl font-bold text-white"
                >
                  Reglamento del evento
                </h3>
                <button
                  onClick={() => setShowRulesModal(false)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-white"
                  aria-label="Cerrar modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-3 mb-4 text-sm text-zinc-300">
                  Si no se carga aquí, ábrelo en una pestaña:{" "}
                  <a
                    className="text-purple-300 underline"
                    href={event.rulesUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    abrir reglamento
                  </a>
                </div>

                <iframe
                  src={event.rulesUrl}
                  className="w-full h-[65vh] rounded-xl border border-zinc-700 bg-black"
                />
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-zinc-800">
                <button
                  onClick={() => setShowRulesModal(false)}
                  className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
