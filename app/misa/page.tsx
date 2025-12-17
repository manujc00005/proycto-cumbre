'use client';

import { useState, useEffect, useRef  } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MISA_2026_FUNNEL } from '@/lib/funnels/configs/misa-2026';
import EventFunnelModal from '../components/EventFunnelModal/EventFunnelModal';

export default function MisaPage() {
  // ========================================
  // 1️⃣ STATES (SIMPLIFICADOS)
  // ========================================
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isMobile, setIsMobile] = useState(false);
  const [showFunnelModal, setShowFunnelModal] = useState(false);

  // ========================================
  // 2️⃣ SCROLL EFFECTS
  // ========================================
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.2]);

  // ========================================
  // 3️⃣ EFFECTS
  // ========================================
  
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

  // ========================================
  // 4️⃣ ANIMATION VARIANTS
  // ========================================
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
    }
  } as const;

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  } as const;

  // ========================================
  // 5️⃣ RENDER
  // ========================================
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      
      {/* Animated Motion Blur Background */}
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
      <div className="relative z-10 container mx-auto px-6 py-12 md:py-20">
        
        {/* Hero Section */}
        <motion.div 
          className="min-h-screen flex flex-col justify-center items-center text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          
          {/* Main Title */}
          <motion.div
            className={`
              mb-8
              ${isMobile 
                ? 'w-[clamp(300px,80vw,500px)]' 
                : 'w-[clamp(500px,50vw,800px)]'
              }
            `}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <img 
              src="/misa3.png" 
              alt="MISA" 
              className="w-full h-auto"
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            className={`font-bold tracking-[0.2em] uppercase text-white/90 mb-20 ${
              isMobile ? 'text-base' : 'text-2xl'
            }`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            23 DE ENERO 2026 · 19:00
          </motion.p>

          {/* Countdown Timer */}
          <motion.div 
            className={`flex mb-16 ${isMobile ? 'gap-3' : 'gap-6'}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-center flex-1">
              <div className={`font-black text-orange-500 mb-1 ${isMobile ? 'text-5xl' : 'text-5xl md:text-6xl'}`}>
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className={`text-white/40 tracking-wider uppercase ${isMobile ? 'text-xs' : 'text-xs'}`}>
                DÍAS
              </div>
            </div>
            
            <div className={`font-black text-white/20 ${isMobile ? 'text-4xl' : 'text-5xl md:text-6xl'}`}>:</div>
            
            <div className="text-center flex-1">
              <div className={`font-black text-orange-500 mb-1 ${isMobile ? 'text-5xl' : 'text-5xl md:text-6xl'}`}>
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className={`text-white/40 tracking-wider uppercase ${isMobile ? 'text-xs' : 'text-xs'}`}>
                HORAS
              </div>
            </div>
            
            <div className={`font-black text-white/20 ${isMobile ? 'text-4xl' : 'text-5xl md:text-6xl'}`}>:</div>
            
            <div className="text-center flex-1">
              <div className={`font-black text-orange-500 mb-1 ${isMobile ? 'text-5xl' : 'text-5xl md:text-6xl'}`}>
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className={`text-white/40 tracking-wider uppercase ${isMobile ? 'text-xs' : 'text-xs'}`}>
                MIN
              </div>
            </div>

            <div className={`font-black text-white/20 ${isMobile ? 'text-4xl' : 'text-5xl md:text-6xl'}`}>:</div>

            <div className="text-center flex-1">
              <motion.div 
                key={timeLeft.seconds}
                initial={{ scale: 1.1, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`font-black text-orange-500 mb-1 ${isMobile ? 'text-5xl' : 'text-5xl md:text-6xl'}`}
              >
                {String(timeLeft.seconds).padStart(2, '0')}
              </motion.div>
              <div className={`text-white/40 tracking-wider uppercase ${isMobile ? 'text-xs' : 'text-xs'}`}>
                SEG
              </div>
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div
            className={`mx-auto mb-10 bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl ${
              isMobile ? 'max-w-sm p-6' : 'max-w-md p-8'
            }`}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <ul className="space-y-3 text-left">
              {[
                { icon: '👕', text: 'Camiseta exclusiva corredores' },
                { icon: '🖤', text: 'Dress code negro'},
                { icon: '📍', text: 'Coordenadas 2h antes' },
                { icon: '📲', text: 'Track 1h antes' },
                { icon: '🔒', text: 'Plazas limitadas' },
                { icon: '🍻', text: 'Post clandestino' },
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  className="flex items-start gap-3 text-white/80 text-sm"
                  variants={fadeInUp}
                >
                  <span className="text-lg w-6 flex-shrink-0">{item.icon}</span>
                  <span className="tracking-wide flex-1">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Price Badge */}
          <motion.div
            className="mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <div className="inline-flex items-baseline gap-2 px-8 py-4 bg-gradient-to-r from-orange-600/30 to-orange-700/30 border-2 border-orange-600/60 rounded-xl backdrop-blur-sm">
              <span className="text-5xl font-black text-orange-500">20€</span>
              <span className="text-sm text-orange-300/80 tracking-wide">por persona</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            onClick={() => setShowFunnelModal(true)}
            className={`group relative bg-orange-500 hover:bg-orange-600 text-white font-bold tracking-wider uppercase rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 ${
              isMobile ? 'px-10 py-4 text-base' : 'px-14 py-5 text-lg'
            }`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            
            <span className="relative z-10 flex items-center justify-center gap-3">
              RESERVA TU PLAZA
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </motion.button>

          {/* Payment Info */}
          <motion.p
            className="mt-4 text-xs text-green-400/80 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Pago 100% seguro
          </motion.p>

          {/* Urgency Footer */}
          <motion.div 
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-orange-500/10 border border-orange-500/30 rounded-full">
              <span className={`font-bold tracking-widest uppercase text-orange-400 ${isMobile ? 'text-sm' : 'text-base'}`}>
                🔥 Plazas limitadas
              </span>
            </div>
          </motion.div>

        </motion.div>

      </div>

      {/* ========================================
          MODAL FUNNEL STEPPER
          ======================================== */}
      <EventFunnelModal
        config={MISA_2026_FUNNEL}
        isOpen={showFunnelModal}
        onClose={() => setShowFunnelModal(false)}
      />

      {/* Bottom Gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-[2]"></div>

    </div>
  );
}
