"use client";

import { Info } from "lucide-react";
import { DisclosureBox } from "./DisclosureBox";

export function ClubCommsDisclosure({
  variant = "club",
  isMember = true,
}: {
  variant?: "club" | "event";
  isMember?: boolean;
}) {
  const title =
    variant === "club"
      ? "Comunicaciones del club"
      : "Comunicaciones sobre eventos";

  const subtitle =
    variant === "club"
      ? "Info por email (interés legítimo)"
      : isMember
        ? "Como socio, recibirás info de eventos"
        : "Info de este evento y futuras actividades";

  return (
    <DisclosureBox
      title={`ℹ️ ${title}`}
      subtitle={subtitle}
      className="bg-blue-500/10 border-blue-500/30 text-blue-200"
    >
      {variant === "club" ? (
        <>
          <p className="text-blue-300/90 text-xs leading-relaxed mb-3">
            Como socio del club, recibirás comunicaciones por email sobre
            eventos, actividades, salidas programadas y novedades del club. Esto
            nos permite mantener a todos los socios informados y facilitar su
            participación activa.
          </p>
          <p className="text-blue-400 text-xs leading-relaxed">
            <strong className="text-blue-300">Base legal:</strong> Interés
            legítimo del club en mantener informados a sus socios. Puedes
            oponerte en cualquier momento escribiendo a{" "}
            <a
              href="mailto:privacidad@proyecto-cumbre.es"
              className="text-orange-400 hover:text-orange-300 underline"
            >
              privacidad@proyecto-cumbre.es
            </a>
            .
          </p>
        </>
      ) : (
        <>
          <p className="text-blue-300/90 text-xs leading-relaxed mb-3">
            Al inscribirte a este evento, podrás recibir comunicaciones
            relacionadas con la actividad (confirmaciones, actualizaciones,
            información logística). También te informaremos sobre eventos
            futuros similares que puedan interesarte.
          </p>
          <p className="text-blue-400 text-xs leading-relaxed mb-2">
            <strong className="text-blue-300">Base legal:</strong> Ejecución del
            contrato (este evento) e interés legítimo del club para informarte
            sobre actividades relacionadas.
          </p>
          <p className="text-blue-400 text-xs leading-relaxed">
            Puedes oponerte a recibir información sobre futuros eventos
            escribiendo a{" "}
            <a
              href="mailto:privacidad@proyecto-cumbre.es"
              className="text-orange-400 hover:text-orange-300 underline"
            >
              privacidad@proyecto-cumbre.es
            </a>
            .
          </p>
        </>
      )}
    </DisclosureBox>
  );
}
