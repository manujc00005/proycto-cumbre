'use client';

import { useState } from 'react';
import { ProductCard } from '../NewProductCard';
import { productsData } from '../ProductsData';



export default function MerchantSection() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openProductLightbox = (productIndex: number, imageIndex: number) => {
    setSelectedProduct(productIndex);
    setSelectedImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  return (
    <section id="merchant" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Merchant
          </h2>
          <div className="w-20 h-1 bg-orange-500 mb-6"></div>
          <p className="text-zinc-600 max-w-2xl text-lg">
            Merchandising exclusivo del club para miembros y amigos de Proyecto Cumbre. 
            Calidad premium, diseños únicos.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {productsData.map((product, i) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              desc={product.desc}
              price={product.price}
              images={product.images}
              sizes={product.sizes}
              tags={product.tags}
              onImageClick={(imageIndex) => openProductLightbox(i, imageIndex)}
            />
          ))}
        </div>

        {/* Empty State - Opcional si no hay productos */}
        {productsData.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-400 text-lg">
              Nuevos productos próximamente...
            </p>
          </div>
        )}
      </div>

      {/* Lightbox - Implementa tu lightbox existente aquí si lo necesitas */}
      {lightboxOpen && selectedProduct !== null && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-4xl w-full aspect-square">
            <img
              src={productsData[selectedProduct].images[selectedImageIndex]}
              alt={productsData[selectedProduct].name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
