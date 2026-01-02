'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface MisaPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MisaPromoModal({ isOpen, onClose }: MisaPromoModalProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(2026, 0, 23, 19, 0, 0, 0);
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    if (isOpen) {
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop con blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative bg-gradient-to-br from-zinc-950 via-black to-zinc-950 rounded-2xl max-w-2xl w-full border-2 border-orange-500/30 shadow-2xl shadow-orange-500/20 overflow-hidden">
              
              {/* Botón cerrar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-zinc-900/80 hover:bg-zinc-800 rounded-full border border-zinc-700 hover:border-zinc-600 transition-all group"
              >
                <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Contenido */}
              <div className="p-8 md:p-12 text-center">
                
                {/* Badge "NUEVO EVENTO" */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-xs font-bold border border-orange-500/30 mb-6"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                  NUEVO EVENTO EXCLUSIVO
                </motion.div>

                {/* Logo MISA */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="mb-6"
                >
                  <img 
                    src="/misa3.png" 
                    alt="MISA" 
                    className="w-full max-w-md mx-auto drop-shadow-2xl"
                  />
                </motion.div>

                {/* Tagline misterioso */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/60 italic text-sm md:text-base mb-6 max-w-md mx-auto"
                >
                  Un ritual nocturno.<br/>
                  Solo para los que saben correr en silencio.
                </motion.p>

                {/* Info esencial */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-2.5 bg-zinc-900/40 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2.5 mb-6"
                >
                  <span className="text-orange-500 font-bold text-sm">10K</span>
                  <span className="text-white/20">·</span>
                  <span className="text-white/70 text-sm">23 ENERO</span>
                  <span className="text-white/20">·</span>
                  <span className="text-white/70 text-sm">19:30</span>
                </motion.div>

                {/* Countdown compacto */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-3 mb-8 font-mono text-xl"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-orange-500 font-black">{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className="text-white/30 text-[10px]">DÍAS</span>
                  </div>
                  <span className="text-white/20">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-orange-500 font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-white/30 text-[10px]">HRS</span>
                  </div>
                  <span className="text-white/20">:</span>
                  <div className="flex flex-col items-center">
                    <motion.span 
                      key={timeLeft.minutes}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-orange-500 font-black"
                    >
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </motion.span>
                    <span className="text-white/30 text-[10px]">MIN</span>
                  </div>
                </motion.div>

                {/* CTAs */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-3 justify-center items-center"
                >
                  {/* CTA Principal */}
                  <Link
                    href="/misa"
                    onClick={onClose}
                    className="group relative bg-white hover:bg-white/90 text-black font-bold tracking-wider uppercase rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/20 px-8 py-4 text-sm w-full sm:w-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Acceder al ritual
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>

                  {/* CTA Secundario */}
                  <button
                    onClick={onClose}
                    className="text-zinc-400 hover:text-white text-sm font-semibold transition underline underline-offset-4"
                  >
                    Ver más tarde
                  </button>
                </motion.div>

                {/* Urgencia sutil */}
                {timeLeft.days < 30 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-orange-500/60 text-xs font-mono mt-6"
                  >
                    🔥 Quedan pocas plazas
                  </motion.p>
                )}
              </div>

              {/* Gradiente decorativo abajo */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600"></div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
