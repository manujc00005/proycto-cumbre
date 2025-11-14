'use client';

import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Quiénes somos', href: '#quienes-somos' },
    { name: 'Nuestras aventuras', href: '#aventuras' },
    { name: 'Social Club Events', href: '#events' },
    { name: 'Merchant', href: '#merchant' }
  ];

  return (
    <header className="fixed top-0 w-full bg-zinc-950/90 backdrop-blur-sm z-50 border-b border-zinc-800">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold tracking-tight">PROYECTO CUMBRE</span>
        </div>
        
        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-sm">
          {menuItems.map((item) => (
            <li key={item.name}>
              <a href={item.href} className="hover:text-orange-400 transition">
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-zinc-950 border-b border-zinc-800 md:hidden">
            <ul className="py-4">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="block px-4 py-3 hover:bg-zinc-900 hover:text-orange-400 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}