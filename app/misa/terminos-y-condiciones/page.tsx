// app/misa/terminos-y-condiciones/page.tsx

import Link from "next/link";

export const metadata = {
  title: "Términos y condiciones | MISA – Ritual Furtivo 2026",
  description:
    "Términos y condiciones del evento MISA – Ritual Furtivo 2026 (Proyecto Cumbre).",
};

const LAST_UPDATED = "13 de diciembre de 2024";

export default function TermsAndConditionsPage() {
  return (
    <main className="relative min-h-screen bg-black">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-[520px] h-[520px] bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[520px] h-[520px] bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-zinc-950/60" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-10 md:py-14">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link
              href="/misa"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-orange-400 transition"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver a MISA
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-zinc-500">Última actualización:</span>
              <span className="text-xs text-zinc-300">{LAST_UPDATED}</span>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6l4 2"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
                  Términos y condiciones del evento
                </h1>
                <p className="mt-2 text-white/70">
                  <span className="font-semibold text-white">
                    MISA – Ritual Furtivo 2026
                  </span>
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300">
                    Documento informativo
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-zinc-800/60 border border-zinc-700 text-zinc-300">
                    Últ. actualización: {LAST_UPDATED}
                  </span>
                </div>
              </div>
            </div>

            {/* Nav rápida */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Link
                href="https://proyecto-cumbre.es/misa-reglamento.pdf"
                target="_blank"
                className="inline-flex items-center justify-between gap-3 rounded-xl bg-zinc-950/40 border border-zinc-800 px-4 py-3 text-sm text-zinc-200 hover:border-orange-500/40 hover:text-white transition"
              >
                Ver reglamento (PDF)
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/misa-2026/descargo"
                className="inline-flex items-center justify-between gap-3 rounded-xl bg-zinc-950/40 border border-zinc-800 px-4 py-3 text-sm text-zinc-200 hover:border-orange-500/40 hover:text-white transition"
              >
                Ver descargo
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/politica-privacidad"
                className="inline-flex items-center justify-between gap-3 rounded-xl bg-zinc-950/40 border border-zinc-800 px-4 py-3 text-sm text-zinc-200 hover:border-orange-500/40 hover:text-white transition"
              >
                Política de privacidad
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Contenido */}
          <div className="mt-8 space-y-5">
            <Section
              n="1"
              title="Identificación del organizador"
              accent="orange"
            >
              <ul className="space-y-2">
                <li>
                  <span className="text-zinc-400">Organizador:</span>{" "}
                  <span className="text-white font-medium">
                    CLUB DEPORTIVO PROYECTO CUMBRE
                  </span>
                </li>
                <li>
                  <span className="text-zinc-400">NIF:</span>{" "}
                  <span className="text-white font-medium">G75790246</span>
                </li>
                <li>
                  <span className="text-zinc-400">Domicilio social:</span>{" "}
                  <span className="text-white/90">
                    PS De los Tilos nº 67, 2º 2ª, 29006 – Málaga (España)
                  </span>
                </li>
                <li>
                  <span className="text-zinc-400">Email de contacto:</span>{" "}
                  <a
                    href="mailto:info@proyecto-cumbre.es"
                    className="text-orange-400 hover:text-orange-300 underline"
                  >
                    info@proyecto-cumbre.es
                  </a>
                </li>
              </ul>
            </Section>

            <Section n="2" title="Objeto" accent="zinc">
              <p>
                Los presentes Términos y Condiciones regulan la{" "}
                <span className="text-white font-medium">
                  inscripción y participación
                </span>{" "}
                en el evento deportivo{" "}
                <span className="text-white font-medium">
                  MISA – Ritual Furtivo 2026
                </span>
                , organizado por el Club Deportivo Proyecto Cumbre.
              </p>
              <p className="mt-3">
                La inscripción otorga al participante el derecho a participar en
                el evento en las condiciones establecidas en estos Términos, en
                el Reglamento del evento y en el Descargo de Responsabilidad.
              </p>
            </Section>

            <Section n="3" title="Inscripción y proceso de compra" accent="zinc">
              <p>
                La inscripción se realiza exclusivamente a través de la
                plataforma oficial habilitada por el organizador.
              </p>
              <div className="mt-4 grid gap-3">
                <Bullet>
                  Facilitar datos veraces y completos.
                </Bullet>
                <Bullet>
                  Aceptar expresamente el Descargo de Responsabilidad y la
                  Política de Privacidad.
                </Bullet>
                <Bullet>
                  Realizar el pago íntegro de la inscripción.
                </Bullet>
              </div>
              <p className="mt-4">
                El organizador se reserva el derecho de rechazar o cancelar
                inscripciones que no cumplan estos requisitos.
              </p>
            </Section>

            <Section n="4" title="Precio y forma de pago" accent="green">
              <div className="grid gap-3">
                <Bullet>El precio de la inscripción se indica claramente durante el proceso de compra.</Bullet>
                <Bullet>
                  El pago se realiza mediante{" "}
                  <span className="text-white font-medium">Stripe</span>, plataforma de pago segura.
                </Bullet>
                <Bullet>El organizador no almacena datos bancarios del participante.</Bullet>
                <Bullet>El precio incluye la participación en el evento y los servicios especificados en la descripción del mismo.</Bullet>
              </div>
            </Section>

            <Section n="5" title="Política de cancelación y devoluciones" accent="orange">
              <p>El participante podrá solicitar la cancelación de su inscripción conforme a las siguientes condiciones:</p>
              <div className="mt-4 grid gap-3">
                <Bullet>
                  Cancelación con más de <span className="text-white font-medium">48 horas</span> de antelación: devolución del{" "}
                  <span className="text-white font-medium">100%</span> del importe.
                </Bullet>
                <Bullet>
                  Cancelación con menos de <span className="text-white font-medium">48 horas</span>: devolución del{" "}
                  <span className="text-white font-medium">50%</span> del importe.
                </Bullet>
                <Bullet>No se realizarán devoluciones por no asistencia al evento.</Bullet>
                <Bullet>No se devolverán gastos asociados como desplazamientos, alojamiento u otros.</Bullet>
              </div>
            </Section>

            <Section n="6" title="Modificación o cancelación del evento" accent="zinc">
              <div className="grid gap-3">
                <Bullet>
                  El organizador podrá modificar fecha, horario, recorrido o ubicación por razones de seguridad,
                  meteorología, fuerza mayor o decisiones administrativas.
                </Bullet>
                <Bullet>
                  En caso de cancelación total del evento, se aplicará la política de devoluciones indicada anteriormente.
                </Bullet>
                <Bullet>
                  Dichas modificaciones no darán derecho a reclamaciones adicionales.
                </Bullet>
              </div>
            </Section>

            <Section n="7" title="Responsabilidad" accent="zinc">
              <div className="grid gap-3">
                <Bullet>
                  La participación en el evento está sujeta a la aceptación expresa del Descargo de Responsabilidad.
                </Bullet>
                <Bullet>
                  El organizador no se hace responsable de los daños derivados de la práctica deportiva, conforme a lo
                  establecido en dicho documento.
                </Bullet>
                <Bullet>El participante asume los riesgos inherentes a la actividad.</Bullet>
              </div>
            </Section>

            <Section n="8" title="Protección de datos" accent="zinc">
              <p>
                El tratamiento de los datos personales se rige por lo establecido en la Política de Privacidad de
                Proyecto Cumbre.
              </p>
              <div className="mt-3">
                <a
                  href="https://proyecto-cumbre.es/politica-privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 underline"
                >
                  Ver política de privacidad
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </Section>

            <Section n="9" title="Legislación y jurisdicción" accent="zinc">
              <p>
                Estos Términos y Condiciones se rigen por la legislación española. Cualquier controversia se someterá a
                los Juzgados y Tribunales de Málaga capital.
              </p>
            </Section>

            <Section n="10" title="Aceptación" accent="orange">
              <p>
                La inscripción en el evento implica la aceptación expresa de estos Términos y Condiciones, del
                Reglamento del evento y del Descargo de Responsabilidad.
              </p>
            </Section>

            {/* CTA final */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 md:p-7 mt-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    ¿Listo para inscribirte?
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    Revisa el reglamento y el descargo antes de completar el pago.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Link
                    href="/misa"
                    className="inline-flex justify-center items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-semibold px-5 py-3 transition"
                  >
                    Ir a la inscripción
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link
                    href="/"
                    className="inline-flex justify-center items-center gap-2 rounded-xl bg-zinc-950/40 border border-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-700 px-5 py-3 transition"
                  >
                    Volver al inicio
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-zinc-600 py-6">
              © 2025 Proyecto Cumbre
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({
  n,
  title,
  children,
  accent = "zinc",
}: {
  n: string;
  title: string;
  children: React.ReactNode;
  accent?: "orange" | "green" | "zinc";
}) {
  const accentClasses =
    accent === "orange"
      ? "border-orange-500/20 bg-orange-500/5"
      : accent === "green"
      ? "border-green-500/20 bg-green-500/5"
      : "border-zinc-800 bg-zinc-900/60";

  const badgeClasses =
    accent === "orange"
      ? "bg-orange-500/15 text-orange-300 border-orange-500/20"
      : accent === "green"
      ? "bg-green-500/15 text-green-300 border-green-500/20"
      : "bg-zinc-800/60 text-zinc-300 border-zinc-700";

  return (
    <section className={`rounded-2xl border ${accentClasses} p-6 md:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-2.5 py-1 rounded-full border ${badgeClasses}`}
            >
              {n}
            </span>
            <h2 className="text-lg md:text-xl font-bold text-white">
              {title}
            </h2>
          </div>
        </div>
      </div>
      <div className="mt-4 text-sm text-zinc-300 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-lg bg-zinc-950/40 border border-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="text-zinc-300">{children}</div>
    </div>
  );
}
