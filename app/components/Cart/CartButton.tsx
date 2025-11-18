'use client';

import { useCartStore } from './cartStore';
import { ShoppingBag } from 'lucide-react';
import { useFeatureFlag } from '../featureFlags';

export const CartButton = () => {
  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const isCartEnabled = useFeatureFlag('enableCart');

  // Si el carrito está desactivado, no mostrar el botón
  if (!isCartEnabled) {
    return null;
  }

  return (
    <button
      onClick={openCart}
      className="relative p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
      aria-label="Shopping cart"
    >
      <ShoppingBag className="w-6 h-6 text-white" strokeWidth={1.5} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
};
