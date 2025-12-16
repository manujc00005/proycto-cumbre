'use client';

import Link from 'next/link';

export function GdprFooterNote() {
  return (
    <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30">
      <p className="text-zinc-400 text-xs leading-relaxed flex items-start gap-2">
        <svg
          className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          Tus datos serán tratados por Proyecto Cumbre con las finalidades descritas en nuestra{' '}
          <Link href="/politica-privacidad" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
            Política de Privacidad
          </Link>
          . Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad
          escribiendo a{' '}
          <a href="mailto:privacidad@proyecto-cumbre.es" className="text-orange-400 hover:text-orange-300 underline">
            privacidad@proyecto-cumbre.es
          </a>
          .
        </span>
      </p>
    </div>
  );
}
