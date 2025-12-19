"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { MISA_FUNNEL } from "@/lib/funnels/configs/misa";
import EventFunnelModal from "../components/EventFunnelModal/EventFunnelModal";

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
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
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
      <motion.div className="fixed inset-0 z-0" style={{ opacity, scale }}>
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
            ${isMobile ? "min-h-[100svh] py-6" : "min-h-screen py-12 md:py-20"}
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          {/* ========================================
              LOGO - MÁS GRANDE Y LLAMATIVO
              ======================================== */}
          <motion.div
            className={`
              ${
                isMobile
                  ? "w-[min(85vw,360px)] mb-6"
                  : "w-[clamp(600px,60vw,900px)] mb-8"
              }
            `}
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              delay: 0.3,
              duration: 1,
              ease: [0.6, -0.05, 0.01, 0.99],
            }}
          >
            <img
              src="/misa3.png"
              alt="MISA"
              className="w-full h-auto drop-shadow-2xl"
            />
          </motion.div>

          {/* Fecha */}
          <motion.p
            className={`
              font-bold tracking-[0.2em] uppercase text-white/90
              ${isMobile ? "text-sm mb-8" : "text-2xl mb-20"}
            `}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            23 ENERO 2026 · 19:00
          </motion.p>

          {/* Countdown */}
          <motion.div
            className={`flex ${isMobile ? "gap-2 mb-6" : "gap-6 mb-16"}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-center flex-1">
              <div
                className={`font-black text-orange-500 leading-none ${isMobile ? "text-4xl mb-1" : "text-5xl md:text-6xl mb-1"}`}
              >
                {String(timeLeft.days).padStart(2, "0")}
              </div>
              <div
                className={`text-white/40 tracking-wider uppercase ${isMobile ? "text-[10px]" : "text-xs"}`}
              >
                DÍAS
              </div>
            </div>

            <div
              className={`font-black text-white/20 self-start ${isMobile ? "text-3xl pt-1" : "text-5xl md:text-6xl"}`}
            >
              :
            </div>

            <div className="text-center flex-1">
              <div
                className={`font-black text-orange-500 leading-none ${isMobile ? "text-4xl mb-1" : "text-5xl md:text-6xl mb-1"}`}
              >
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <div
                className={`text-white/40 tracking-wider uppercase ${isMobile ? "text-[10px]" : "text-xs"}`}
              >
                HRS
              </div>
            </div>

            <div
              className={`font-black text-white/20 self-start ${isMobile ? "text-3xl pt-1" : "text-5xl md:text-6xl"}`}
            >
              :
            </div>

            <div className="text-center flex-1">
              <div
                className={`font-black text-orange-500 leading-none ${isMobile ? "text-4xl mb-1" : "text-5xl md:text-6xl mb-1"}`}
              >
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <div
                className={`text-white/40 tracking-wider uppercase ${isMobile ? "text-[10px]" : "text-xs"}`}
              >
                MIN
              </div>
            </div>

            <div
              className={`font-black text-white/20 self-start ${isMobile ? "text-3xl pt-1" : "text-5xl md:text-6xl"}`}
            >
              :
            </div>

            <div className="text-center flex-1">
              <motion.div
                key={timeLeft.seconds}
                initial={{ scale: 1.1, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`font-black text-orange-500 leading-none ${isMobile ? "text-4xl mb-1" : "text-5xl md:text-6xl mb-1"}`}
              >
                {String(timeLeft.seconds).padStart(2, "0")}
              </motion.div>
              <div
                className={`text-white/40 tracking-wider uppercase ${isMobile ? "text-[10px]" : "text-xs"}`}
              >
                SEG
              </div>
            </div>
          </motion.div>

          {/* ========================================
              INFO BOX - CORREGIDO PARA VERSE
              ======================================== */}
          <motion.div
            className={`
              mx-auto bg-zinc-900/70 backdrop-blur-md border border-white/20 rounded-xl
              ${isMobile ? "max-w-[90%] p-4 mb-6" : "max-w-md p-8 mb-10"}
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <ul className="space-y-3 text-left">
              {[
                { icon: "👕", text: "Camiseta exclusiva corredores" },
                { icon: "🖤", text: "Dress code negro" },
                { icon: "📍", text: "Coordenadas 2h antes" },
                { icon: "📲", text: "Track 1h antes" },
                { icon: "🔒", text: "Plazas limitadas" },
                { icon: "🍻", text: "Post clandestino" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-white/90 text-sm"
                >
                  <span className="text-xl w-6 flex-shrink-0">{item.icon}</span>
                  <span className="tracking-wide">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Precio + CTA */}
          <motion.div
            className={`flex flex-col items-center ${isMobile ? "gap-4 mb-4" : "gap-4 mb-6"}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            {/* Precio */}
            <div
              className={`
              inline-flex items-baseline gap-2 bg-gradient-to-r from-orange-600/30 to-orange-700/30 
              border-2 border-orange-600/60 rounded-xl backdrop-blur-sm
              ${isMobile ? "px-6 py-3" : "px-8 py-4"}
            `}
            >
              <span
                className={`font-black text-orange-500 ${isMobile ? "text-5xl" : "text-5xl"}`}
              >
                20€
              </span>
              <span
                className={`text-orange-300/80 tracking-wide ${isMobile ? "text-sm" : "text-sm"}`}
              >
                / persona
              </span>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowFunnelModal(true)}
              className={`
                group relative bg-orange-500 hover:bg-orange-600 text-white font-bold 
                tracking-wider uppercase rounded-xl overflow-hidden transition-all 
                hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50
                ${isMobile ? "px-10 py-4 text-base" : "px-14 py-5 text-lg"}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

              <span className="relative z-10 flex items-center justify-center gap-2">
                RESERVA TU PLAZA
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </motion.div>

          {/* Footer */}
          <motion.div
            className={`flex flex-col items-center ${isMobile ? "gap-2" : "gap-3"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {/* Pago seguro */}
            <p
              className={`text-green-400/80 flex items-center justify-center gap-1.5 ${isMobile ? "text-xs" : "text-xs"}`}
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Pago 100% seguro
            </p>

            {/* Urgencia badge */}
            <div
              className={`
              inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full
              ${isMobile ? "px-5 py-2" : "px-6 py-3"}
            `}
            >
              <span
                className={`font-bold tracking-widest uppercase text-orange-400 ${isMobile ? "text-xs" : "text-base"}`}
              >
                🔥 Plazas limitadas
              </span>
            </div>
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
