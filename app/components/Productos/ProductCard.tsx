"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImage {
  url: string;
  alt: string;
}

interface ProductCardProps {
  name: string;
  desc: string;
  price: string;
  images: ProductImage[];
  sizes?: string;
  tags?: string[];
  onImageClick?: (imageIndex: number) => void;
}

export default function ProductCard({
  name,
  desc,
  price,
  images,
  sizes = "S, M, L, XL",
  tags = [],
  onImageClick,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(currentImageIndex);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-orange-500 transition-all group shadow-lg hover:shadow-orange-500/20">
      {/* Galería de imágenes */}
      <div className="relative h-64 md:h-80 bg-zinc-800 overflow-hidden">
        {/* Imagen principal */}
        <div
          className="relative h-full cursor-pointer"
          onClick={handleImageClick}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}

          {/* Overlay hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                className="w-12 h-12 text-white drop-shadow-lg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Botones de navegación (solo si hay más de 1 imagen) */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100 z-10"
              aria-label="Imagen anterior"
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
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100 z-10"
              aria-label="Siguiente imagen"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Indicadores/Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-orange-500 w-6"
                    : "bg-white/50 hover:bg-white/70 w-1.5"
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Badge de "Nuevo" o tags */}
        {tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Contador de imágenes */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
            {currentImageIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="p-5 md:p-6 space-y-3">
        <h3 className="font-bold text-lg md:text-xl text-white group-hover:text-orange-400 transition">
          {name}
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>

        {/* Tallas */}
        {sizes && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Tallas:</span>
            <div className="flex gap-1">
              {sizes.split(",").map((size, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded border border-zinc-700 hover:border-orange-500 transition cursor-pointer"
                >
                  {size.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Precio y botón */}
        <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
          <span className="text-2xl md:text-3xl font-bold text-orange-400">
            {price}€
          </span>
          <button className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white text-sm font-semibold rounded-lg border border-orange-500/30 hover:border-orange-500 transition-all">
            Más info →
          </button>
        </div>
      </div>
    </div>
  );
}
