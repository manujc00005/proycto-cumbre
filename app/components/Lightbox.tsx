'use client';

import Image from 'next/image';
import { useEffect } from 'react';

interface LightboxProps {
  isOpen: boolean;
  imageSrc: string;
  imageAlt: string;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex?: number;
  totalImages?: number;
}

export default function Lightbox({
  isOpen,
  imageSrc,
  imageAlt,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  totalImages
}: LightboxProps) {
  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevenir scroll
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Navegar con flechas del teclado
  useEffect(() => {
    const handleArrows = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleArrows);
    }
    return () => window.removeEventListener('keydown', handleArrows);
  }, [isOpen, onNext, onPrev]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-orange-400 transition z-10"
        aria-label="Cerrar"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Contador */}
      {currentIndex !== undefined && totalImages !== undefined && (
        <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm">
          {currentIndex + 1} / {totalImages}
        </div>
      )}

      {/* Botón anterior */}
      {onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-400 transition bg-black/50 hover:bg-black/70 p-3 rounded-full backdrop-blur-sm"
          aria-label="Anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Imagen */}
      <div 
        className="relative max-w-7xl max-h-[90vh] w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-contain"
          quality={95}
          sizes="100vw"
          priority
        />
      </div>

      {/* Botón siguiente */}
      {onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-400 transition bg-black/50 hover:bg-black/70 p-3 rounded-full backdrop-blur-sm"
          aria-label="Siguiente"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Texto descriptivo */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm inline-block">
          {imageAlt}
        </p>
      </div>
    </div>
  );
}