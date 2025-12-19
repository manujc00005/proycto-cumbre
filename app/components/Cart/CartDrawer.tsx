"use client";

import { useCartStore } from "./cartStore";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useEffect, useRef } from "react";
import Image from "next/image";

export const CartDrawer = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotal } =
    useCartStore();
  const total = getTotal();
  const DELIVERY_FEE = 15;
  const previousOverflow = useRef<string>("");

  // Manage body scroll - save and restore previous state
  useEffect(() => {
    if (isOpen) {
      // Save current overflow state
      previousOverflow.current = document.body.style.overflow || "auto";
      // Prevent body scroll when cart is open
      document.body.style.overflow = "hidden";
    } else {
      // Restore previous overflow state
      document.body.style.overflow = previousOverflow.current || "auto";
    }

    // Cleanup: always restore scroll on unmount
    return () => {
      document.body.style.overflow = previousOverflow.current || "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-zinc-50 z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="bg-white border-b border-zinc-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900">Bag</h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 text-zinc-900" strokeWidth={1.5} />
            </button>
          </div>
          <div className="text-sm text-zinc-600 mt-1">
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <ShoppingBag
                className="w-16 h-16 text-zinc-300 mb-4"
                strokeWidth={1.5}
              />
              <p className="text-zinc-900 font-medium text-lg mb-2">
                Your bag is empty
              </p>
              <p className="text-zinc-600 text-sm">Add items to get started</p>
            </div>
          ) : (
            <div className="p-4 md:p-6 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.variant}-${item.size}`}
                  className="bg-white border border-zinc-200 rounded-lg overflow-hidden"
                >
                  <div className="flex gap-4 p-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 bg-zinc-100 rounded flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <h3 className="font-medium text-zinc-900 text-sm truncate">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-400 hover:text-zinc-900 transition-colors flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <X className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>

                      {item.variant && (
                        <p className="text-xs text-zinc-600 mt-1">
                          {item.variant}
                        </p>
                      )}

                      {item.size && (
                        <p className="text-xs text-zinc-600 mt-0.5">
                          One Size:{" "}
                          <span className="font-medium">{item.size}</span>
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-zinc-300 rounded">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1.5 hover:bg-zinc-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus
                              className="w-3 h-3 text-zinc-900"
                              strokeWidth={2}
                            />
                          </button>
                          <span className="px-3 text-sm font-medium text-zinc-900 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1.5 hover:bg-zinc-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus
                              className="w-3 h-3 text-zinc-900"
                              strokeWidth={2}
                            />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="font-bold text-zinc-900">
                          {item.price} EUR
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Checkout Section */}
        {items.length > 0 && (
          <div className="bg-white border-t border-zinc-200 p-4 md:p-6">
            {/* Delivery Info */}
            <div className="bg-zinc-100 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-700">
                  Complete for free delivery
                </span>
                <span className="font-bold text-zinc-900">
                  {total >= 140 ? "0.00" : (140 - total).toFixed(2)} EUR away
                </span>
              </div>
              <div className="mt-2 h-1.5 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${Math.min((total / 140) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-700">Delivery</span>
                <span className="text-zinc-900">
                  {total >= 140 ? "0" : DELIVERY_FEE} EUR
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-700">Subtotal</span>
                <span className="text-zinc-900 font-medium">
                  {total.toFixed(2)} EUR
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-4 pt-3 border-t border-zinc-200">
              <span className="font-bold text-zinc-900">Total</span>
              <span className="font-bold text-zinc-900 text-lg">
                {(total + (total >= 140 ? 0 : DELIVERY_FEE)).toFixed(2)} EUR
              </span>
            </div>

            {/* Tax Info */}
            <p className="text-xs text-zinc-600 mb-4">
              Taxes included. Discounts and shipping calculated at checkout.
            </p>

            {/* Checkout Button */}
            <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 rounded transition-colors">
              Checkout
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
