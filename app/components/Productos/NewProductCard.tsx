'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AddToCartButton } from '../Cart/AddToCartButton';

interface ProductCardProps {
  id: string;
  name: string;
  desc: string;
  price: number;
  images: string[];
  sizes?: string[];
  tags?: string[];
  onImageClick?: (imageIndex: number) => void;
}

export const ProductCard = ({
  id,
  name,
  desc,
  price,
  images,
  sizes = ['One Size'],
  tags = [],
  onImageClick
}: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const product = {
    id: `${id}-${selectedSize}`,
    name,
    price,
    image: images[0],
    size: selectedSize,
  };

  return (
    <div className="group">
      {/* Image Container */}
      <div 
        className="relative aspect-[3/4] bg-zinc-100 rounded-lg overflow-hidden mb-4 cursor-pointer"
        onClick={() => onImageClick?.(currentImageIndex)}
      >
        <Image
          src={images[currentImageIndex]}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Image Navigation - Only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-zinc-900" strokeWidth={2} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-zinc-900" strokeWidth={2} />
            </button>

            {/* 🔥 Image Indicators – versión “dedo friendly” */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className="h-6 w-6 flex items-center justify-center rounded-full bg-black/20 active:scale-95 transition-transform"
                  aria-label={`Ir a imagen ${index + 1}`}
                >
                  <span
                    className={`block rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'w-8 h-2 bg-white'
                        : 'w-2 h-2 bg-white/60'
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-zinc-900 text-lg mb-1 line-clamp-1">
            {name}
          </h3>
          <p className="text-zinc-600 text-sm line-clamp-2 mb-2">
            {desc}
          </p>
          <p className="font-bold text-zinc-900">
            {price} EUR
          </p>
        </div>

        {/* Size Selector or One Size Label */}
        <div>
          <p className="text-xs font-medium text-zinc-700 mb-2">Tallas:</p>
          {sizes.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 text-xs font-medium border rounded transition-all ${
                    selectedSize === size
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white text-zinc-900 border-zinc-300 hover:border-zinc-900'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-1.5 text-xs font-medium text-zinc-600 border border-zinc-200 rounded bg-zinc-50 inline-block">
              One Size
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton product={product} size="md" className="w-full" />
      </div>
    </div>
  );
};
