// ========================================
// PÁGINA GENÉRICA: DESCARGO DE RESPONSABILIDAD
// app/[slug]/descargo/page.tsx
// ========================================
import { getEventBySlug, slugExists } from "@/lib/events/registry";
import { logger } from "@/lib/logger";
import Link from "next/link";
import { notFound } from "next/navigation";


interface PageProps {
  params: Promise<{ slug: string }>;
}

// ========================================
// METADATA
// ========================================

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params; 
  logger.log('Descargo Slug =', slug);
  if (!slugExists(slug)) {
    return { title: "Descargo de responsabilidad" };
  }

  const event = getEventBySlug(slug);
  if (!event) {
    return { title: "Descargo de responsabilidad" };
  }

  return {
    title: `Descargo de responsabilidad | ${event.meta.eventName}`,
    description: `Descargo de responsabilidad y asunción de riesgos del evento ${event.meta.eventName}`,
  };
}

// ========================================
// PAGE
// ========================================

export default async function DescargoPage({ params }: PageProps) {
  const { slug } = await params;

  // Verificar que el slug existe
  if (!slugExists(slug)) {
    return notFound();
  }

  const event = getEventBySlug(slug);
  if (!event) {
    return notFound();
  }

  const { meta, waiver } = event;

  return (
    <main className="relative min-h-screen bg-black">
      {/* Fondo con gradientes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-1/4 w-[520px] h-[520px] bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[520px] h-[520px] bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-zinc-950/60" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-4xl mx-auto">
          
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href={`/${slug}`}
              className="text-sm text-zinc-400 hover:text-orange-400 transition"
            >
              ← Volver al evento
            </Link>

            <span className="text-xs text-zinc-500">
              {meta.eventName} · {waiver.version}
            </span>
          </div>

          {/* Card principal */}
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/70 to-black/40 p-6 md:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            
            {/* Título */}
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {waiver.title}
            </h1>

            <p className="text-sm text-white/60 mb-6">
              Evento:{" "}
              <span className="text-white/80">{meta.eventName}</span>
            </p>

            {/* Header del documento */}
            <div className="mb-6 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-300">
                  Documento legal · {waiver.version}
                </span>
                <span className="text-xs text-zinc-500">
                  Última actualización: {waiver.effectiveFromISO}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-zinc-400 border border-zinc-800 bg-zinc-950/40 px-3 py-1 rounded-full">
                  📅 {meta.eventDateISO}
                </span>
                <span className="text-xs text-zinc-400 border border-zinc-800 bg-zinc-950/40 px-3 py-1 rounded-full">
                  📍 {meta.eventLocation}
                </span>
                <span className="text-xs text-zinc-400 border border-zinc-800 bg-zinc-950/40 px-3 py-1 rounded-full">
                  ⚡ {meta.modalityName}
                </span>
              </div>
            </div>

            {/* Cuerpo del documento */}
            <div className="rounded-xl border border-zinc-800 bg-black/20 p-4 md:p-5">
              <div
                className="
                  whitespace-pre-wrap
                  text-[13px] md:text-sm
                  leading-relaxed
                  text-zinc-200
                  font-normal
                "
              >
                {waiver.text}
              </div>
            </div>
          </div>

          {/* Barra inferior fija */}
          <div className="sticky bottom-4 mt-8">
            <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-800 bg-black/70 backdrop-blur px-4 py-3 flex items-center justify-between gap-3">
              <Link
                href={`/${slug}`}
                className="text-sm text-zinc-300 hover:text-orange-300 transition"
              >
                ← Volver al evento
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  href={`/${slug}/terminos-y-condiciones`}
                  className="text-sm text-orange-300 hover:text-orange-200 underline underline-offset-4"
                >
                  Ver términos del evento
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
