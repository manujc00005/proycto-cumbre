'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MISA_FUNNEL } from '@/lib/funnels/configs/misa';
import EventFunnelModal from '../components/EventFunnelModal/EventFunnelModal';

export default function MisaPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isMobile, setIsMobile] = useState(false);
  const [showFunnelModal, setShowFunnelModal] = useState(false);

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.2]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(2026, 0, 23, 19, 0, 0, 0);
      const now = new Date();
      
      const diff = target.getTime() - now.getTime();
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      
      {/* Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ opacity, scale }}
      >
        <Image 
          src="/misa.jpeg"
          alt=""
          fill
          className="object-cover opacity-20 blur-sm"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        
        {/* Hero Section */}
        <motion.div 
          className={`
            flex flex-col justify-center items-center text-center
            ${isMobile 
              ? 'min-h-[100svh] py-6' 
              : 'min-h-screen py-12 md:py-20'
            }
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          
          {/* LOGO */}
          <motion.div
            className={`
              ${isMobile 
                ? 'w-[min(85vw,360px)] mb-6' 
                : 'w-[clamp(600px,60vw,900px)] mb-8'
              }
            `}
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.3, 
              duration: 1,
              ease: [0.6, -0.05, 0.01, 0.99]
            }}
          >
            <img 
              src="/misa3.png" 
              alt="MISA" 
              className="w-full h-auto drop-shadow-2xl"
            />
          </motion.div>

             {/* ========================================
              INFO ESENCIAL - SOLO 3 DATOS
              ======================================== */}
          <motion.div
            className={`inline-flex items-center gap-2.5 bg-zinc-900/40 backdrop-blur-sm border border-white/10 rounded-full mb-8 ${isMobile ? 'px-6 py-2.5 text-sm' : 'px-8 py-3 text-base'}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 150 }}
          >
            <span className="text-orange-500 font-bold">10K</span>
            <span className="text-white/20">·</span>
            <span className="text-white/70">23 ENERO</span>
            <span className="text-white/20">·</span>
            <span className="text-white/70">19:30</span>
          </motion.div>

          {/* ========================================
              COUNTDOWN COMPACTO
              ======================================== */}
          <motion.div
            className={`flex items-center gap-2 mb-14 font-mono ${isMobile ? 'text-xl' : 'text-2xl'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-orange-500 font-black">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="text-white/30 text-sm">d</span>
            <span className="text-white/20 mx-1">·</span>
            <span className="text-orange-500 font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-white/30 text-sm">h</span>
            <span className="text-white/20 mx-1">·</span>
            <motion.span 
              key={timeLeft.minutes}
              initial={{ scale: 1.1, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-orange-500 font-black"
            >
              {String(timeLeft.minutes).padStart(2, '0')}
            </motion.span>
            <span className="text-white/30 text-sm">m</span>
          </motion.div>

           {/* ========================================
              NORMAS DEL RITUAL (Minimalista)
              ======================================== */}
          <motion.div
            className={`bg-zinc-900/30 backdrop-blur-sm border border-white/10 rounded-xl mb-12 ${isMobile ? 'max-w-[85%] p-5' : 'max-w-sm p-7'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            {/* Sección 1: Normas del ritual */}
            <h3 className="text-white/90 font-semibold mb-4 text-sm uppercase tracking-wide">
              Normas del ritual
            </h3>
            <ul className="space-y-2.5 text-left mb-8">
              {[
                'Dress code negro',
                'Coordenadas 2h antes',
                'Track 1h antes',
                'Plazas muy limitadas',
              ].map((rule, i) => (
                <li key={i} className="flex items-start gap-2.5 text-white/60 text-sm">
                  <span className="text-orange-500/50 mt-0.5">–</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            {/* Separador visual */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

            {/* Sección 2: Después del ritual */}
            <h3 className="text-white/90 font-semibold mb-4 text-sm uppercase tracking-wide">
              Después del ritual
            </h3>
            <ul className="space-y-2.5 text-left">
              {[
                'Algo que no se vende',
                'Algo que no se repite'
              ].map((rule, i) => (
                <li key={i} className="flex items-start gap-2.5 text-white/60 text-sm">
                  <span className="text-orange-500/50 mt-0.5">–</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Precio + CTA */}
          <motion.div
            className={`flex flex-col items-center ${isMobile ? 'gap-4 mb-4' : 'gap-4 mb-6'}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
           

            {/* CTA Button */}
             <button
                onClick={() => setShowFunnelModal(true)}
                className={`
                  group relative bg-white hover:bg-white/90 text-black font-bold 
                  tracking-wider uppercase rounded-lg overflow-hidden transition-all 
                  hover:scale-105 hover:shadow-2xl hover:shadow-white/20
                  ${isMobile ? 'px-12 py-4 text-sm' : 'px-16 py-5 text-base'}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Acceder al ritual
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            {/* Precio discreto */}
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span>Acceso al ritual</span>
              <span className="text-white/20">·</span>
              <span className="text-orange-500/70 font-semibold">20€</span>
              <span className="text-white/20">·</span>
              <span>Solo corredores</span>
            </div>

          </motion.div>

          {/* Footer */}
          <motion.div 
            className={`flex flex-col items-center ${isMobile ? 'gap-2' : 'gap-3'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {/* Pago seguro */}
            <p className={`text-green-400/80 flex items-center justify-center gap-1.5 ${isMobile ? 'text-xs' : 'text-xs'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Pago 100% seguro
            </p>

            {/* Urgencia badge */}
            {timeLeft.days < 30 && (
              <motion.p
                className="text-orange-500/40 text-xs font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                🔥 Plazas limitadas
              </motion.p>
            )}
          </motion.div>

        </motion.div>

      </div>

      {/* Modal */}
      <EventFunnelModal
        config={MISA_FUNNEL}
        isOpen={showFunnelModal}
        onClose={() => setShowFunnelModal(false)}
      />

      {/* Bottom Gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-[2]"></div>

    </div>
  );
}
