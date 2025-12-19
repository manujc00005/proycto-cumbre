// app/politica-de-cookies/page.tsx
export const metadata = {
  title: "Política de Cookies | Proyecto Cumbre",
};

export default function PoliticaDeCookiesPage() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* Fondo decorativo (igual vibe que tu footer) */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-[-120px] left-1/4 w-[520px] h-[520px] bg-orange-500 rounded-full blur-3xl" />
        <div className="absolute bottom-[-160px] right-1/4 w-[520px] h-[520px] bg-orange-600 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-12 md:py-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-8">
          <p className="text-sm text-zinc-400 mb-2">Información legal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Política de <span className="text-orange-400">Cookies</span>
          </h1>
          <p className="text-zinc-400 leading-relaxed">
            En Proyecto Cumbre utilizamos cookies y tecnologías similares
            únicamente para garantizar el correcto funcionamiento del sitio y
            para gestionar los pagos de forma segura.
          </p>
        </div>

        {/* Card */}
        <div className="max-w-3xl mx-auto bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 md:p-8 backdrop-blur">
          <Section title="¿Qué son las cookies?">
            <p className="text-zinc-300 leading-relaxed">
              Las cookies son pequeños archivos que se almacenan en el
              dispositivo del usuario y que permiten recordar información básica
              para mejorar la experiencia de navegación.
            </p>
          </Section>

          <Section title="Cookies utilizadas en este sitio">
            <p className="text-zinc-300 leading-relaxed mb-4">
              Este sitio web utiliza únicamente{" "}
              <strong className="text-white">
                cookies técnicas y estrictamente necesarias
              </strong>
              , que no requieren el consentimiento del usuario según la
              normativa vigente.
            </p>

            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">Cookies técnicas</p>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Necesarias para el funcionamiento básico del sitio y para
                    mantener el estado de navegación.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">
                    Cookies de pago (Stripe)
                  </p>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Utilizadas para procesar pagos de forma segura. Estas
                    cookies son gestionadas por Stripe y son imprescindibles
                    para completar las transacciones.
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-5 p-4 rounded-xl bg-black/40 border border-zinc-800">
              <p className="text-zinc-300">
                <strong className="text-white">
                  No utilizamos cookies de análisis, publicidad ni seguimiento
                </strong>
                , ni propias ni de terceros.
              </p>
            </div>
          </Section>

          <Section title="Herramientas de rendimiento">
            <p className="text-zinc-300 leading-relaxed">
              Este sitio utiliza{" "}
              <strong className="text-white">Vercel Speed Insights</strong>{" "}
              únicamente para medir el rendimiento técnico de la web. Esta
              herramienta no utiliza cookies ni recoge datos personales
              identificables.
            </p>
          </Section>

          <Section title="¿Cómo desactivar las cookies?">
            <p className="text-zinc-300 leading-relaxed">
              Al tratarse exclusivamente de cookies técnicas, su desactivación
              podría impedir el correcto funcionamiento del sitio y de los
              procesos de pago. El usuario puede configurar su navegador para
              bloquear cookies, aunque esto puede afectar a la experiencia de
              uso.
            </p>
          </Section>

          <Section title="Cambios en la política de cookies">
            <p className="text-zinc-300 leading-relaxed">
              Proyecto Cumbre se reserva el derecho a modificar la presente
              política para adaptarla a cambios legislativos o técnicos.
              Cualquier modificación será publicada en esta página.
            </p>
          </Section>

          <div className="mt-10 pt-6 border-t border-zinc-800 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-zinc-500">
              Última actualización: enero de 2025
            </p>
            <a
              href="/"
              className="text-sm text-orange-400 hover:text-orange-300 transition"
            >
              Volver al inicio →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 last:mb-0">
      <h2 className="text-lg md:text-xl font-bold text-white mb-3 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-orange-500 rounded-full" />
        {title}
      </h2>
      {children}
    </section>
  );
}
