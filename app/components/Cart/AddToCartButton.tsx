'use client';

import { useState } from 'react';
import { useCartStore } from './cartStore';
import { ShoppingBag, Check } from 'lucide-react';
import { useFeatureFlag } from '../featureFlags';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    variant?: string;
    size?: string;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AddToCartButton = ({ 
  product, 
  className = '',
  size = 'md'
}: AddToCartButtonProps) => {
  const { addItem, openCart } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);
  const isCartEnabled = useFeatureFlag('enableCart');

  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg'
  };

  const handleAddToCart = () => {
    addItem(product);
    setIsAdded(true);
    
    // Reset button after animation
    setTimeout(() => {
      setIsAdded(false);
      openCart();
    }, 1000);
  };

  // Si el carrito está desactivado, mostrar botón disabled
  if (!isCartEnabled) {
    return (
      <button
        disabled
        className={`
          relative overflow-hidden
          bg-zinc-400 cursor-not-allowed
          text-white font-bold rounded
          flex items-center justify-center gap-2
          ${sizeClasses[size]}
          ${className}
        `}
      >
        <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
        <span>Temporarily Unavailable</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdded}
      className={`
        relative overflow-hidden
        bg-zinc-900 hover:bg-zinc-800 
        text-white font-bold rounded
        transition-all duration-300
        disabled:bg-green-600 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {isAdded ? (
        <>
          <Check className="w-5 h-5" strokeWidth={2.5} />
          <span>Added to Bag</span>
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
          <span>Add to Bag</span>
        </>
      )}
    </button>
  );
};
