'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CartButton } from '../Cart/CartButton';

export default function HeaderSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-zinc-950/95 backdrop-blur-md z-50 border-b border-zinc-800">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 lg:h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#inicio" className="flex items-center">
              <Image 
                src="/aaa.png"
                alt="Proyecto Cumbre Logo"
                width={140}
                height={45}
                className="h-7 w-auto sm:h-8 lg:h-10 xl:h-12"
                priority
              />
            </a>
          </div>
          
          {/* Desktop Menu - Solo visible en pantallas grandes */}
          <ul className="hidden xl:flex items-center justify-center space-x-6 2xl:space-x-8 text-xs 2xl:text-sm flex-1 mx-4">
            <li><a href="#inicio" className="hover:text-orange-400 transition-colors font-medium whitespace-nowrap">HOME</a></li>
            <li><a href="#quienes-somos" className="hover:text-orange-400 transition-colors font-medium whitespace-nowrap">QUIÉNES SOMOS</a></li>
            <li><a href="#aventuras" className="hover:text-orange-400 transition-colors font-medium whitespace-nowrap">AVENTURAS</a></li>
            <li><a href="#events" className="hover:text-orange-400 transition-colors font-medium whitespace-nowrap">EVENTS</a></li>
            <li><a href="#merchant" className="hover:text-orange-400 transition-colors font-medium whitespace-nowrap">MERCHANT</a></li>
          </ul>

          {/* Social Media Icons & Cart - Desktop */}
          <div className="hidden xl:flex items-center gap-2 2xl:gap-3">
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/proyecto.cumbre"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 2xl:w-10 2xl:h-10 bg-zinc-900 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 group flex-shrink-0"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 2xl:w-5 2xl:h-5 text-zinc-400 group-hover:text-white transition" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a 
              href="https://chat.whatsapp.com/EHmIEAcK7EBFP3UgntDdX9"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 2xl:w-10 2xl:h-10 bg-zinc-900 hover:bg-green-500 rounded-lg flex items-center justify-center transition-all duration-300 group flex-shrink-0"
              aria-label="WhatsApp"
            >
              <svg className="w-4 h-4 2xl:w-5 2xl:h-5 text-zinc-400 group-hover:text-white transition" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a 
              href="https://www.tiktok.com/@proyecto.cumbre"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 2xl:w-10 2xl:h-10 bg-zinc-900 hover:bg-black rounded-lg flex items-center justify-center transition-all duration-300 group flex-shrink-0"
              aria-label="TikTok"
            >
              <svg className="w-4 h-4 2xl:w-5 2xl:h-5 text-zinc-400 group-hover:text-white transition" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" fill="currentColor"/>
              </svg>
            </a>

            {/* ⭐ CART BUTTON - AÑADIDO ⭐ */}
            <CartButton />
          </div>

          {/* Right side - Mobile/Tablet */}
          <div className="xl:hidden flex items-center gap-2">
            {/* Cart Button - Visible en mobile/tablet */}
            <CartButton />

            {/* Mobile Menu Button */}
            <button 
              className="text-white p-2 hover:bg-zinc-900 rounded-lg transition flex-shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-zinc-950/98 backdrop-blur-lg border-t border-zinc-800 animate-fadeIn">
          <div className="container mx-auto px-4 py-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Navigation Links */}
            <ul className="space-y-1">
              <li>
                <a 
                  href="#inicio" 
                  className="block py-3 px-4 text-center text-base font-medium hover:text-orange-400 hover:bg-zinc-900/50 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  HOME
                </a>
              </li>
              <li>
                <a 
                  href="#quienes-somos" 
                  className="block py-3 px-4 text-center text-base font-medium hover:text-orange-400 hover:bg-zinc-900/50 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  QUIÉNES SOMOS
                </a>
              </li>
              <li>
                <a 
                  href="#aventuras" 
                  className="block py-3 px-4 text-center text-base font-medium hover:text-orange-400 hover:bg-zinc-900/50 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  NUESTRAS AVENTURAS
                </a>
              </li>
              <li>
                <a 
                  href="#events" 
                  className="block py-3 px-4 text-center text-base font-medium hover:text-orange-400 hover:bg-zinc-900/50 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  SOCIAL CLUB EVENTS
                </a>
              </li>
              <li>
                <a 
                  href="#merchant" 
                  className="block py-3 px-4 text-center text-base font-medium hover:text-orange-400 hover:bg-zinc-900/50 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  MERCHANT
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <p className="text-zinc-500 text-xs text-center mb-4 font-semibold tracking-wider">SÍGUENOS</p>
              <div className="flex justify-center gap-4">
                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/proyecto.cumbre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                  aria-label="Instagram"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* WhatsApp */}
                <a 
                  href="https://chat.whatsapp.com/EHmIEAcK7EBFP3UgntDdX9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                  aria-label="WhatsApp"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>

                {/* TikTok */}
                <a 
                  href="https://www.tiktok.com/@proyecto.cumbre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                  aria-label="TikTok"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" fill="currentColor"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
