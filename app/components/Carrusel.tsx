"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export interface CarouselItem {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number; // en milisegundos
  showControls?: boolean;
  showDots?: boolean;
  showCounter?: boolean;
  height?: string; // clase de Tailwind
  aspectRatio?: string;
}

export default function Carousel({
  items,
  autoPlayInterval = 3000,
  showControls = true,
  showDots = true,
  showCounter = true,
  height = "h-[400px] md:h-[500px]",
  aspectRatio = "aspect-auto",
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambio automático
  useEffect(() => {
    if (autoPlayInterval <= 0) return; // Si es 0 o negativo, no hay autoplay

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === items.length - 1 ? 0 : prevIndex + 1,
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [items.length, autoPlayInterval]);

  // Navegación
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1,
    );
  };

  if (items.length === 0) {
    return (
      <div
        className={`${height} bg-zinc-800 rounded-2xl flex items-center justify-center`}
      >
        <p className="text-zinc-500">No hay imágenes para mostrar</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Carrusel Principal */}
      <div
        className={`relative ${height} ${aspectRatio} rounded-2xl overflow-hidden`}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              quality={85}
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Overlay con información */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Información del item */}
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-semibold text-lg md:text-xl text-white mb-1">
                {item.title}
              </p>
              {item.subtitle && (
                <span className="text-sm md:text-base text-orange-400">
                  {item.subtitle}
                </span>
              )}
              {item.description && (
                <p className="text-xs md:text-sm text-zinc-300 mt-2">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Botones de Navegación */}
        {showControls && items.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition z-10"
              aria-label="Anterior"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition z-10"
              aria-label="Siguiente"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Indicadores (Dots) */}
      {showDots && items.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-orange-500 w-8"
                  : "bg-zinc-600 hover:bg-zinc-500"
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Contador */}
      {showCounter && items.length > 1 && (
        <div className="text-center mt-2 text-sm text-zinc-400">
          {currentIndex + 1} / {items.length}
        </div>
      )}
    </div>
  );
}
