"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Instagram, MessageCircle, Music } from "lucide-react";
import { CartButton } from "./Cart/CartButton";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/about", label: "QUIÉNES SOMOS" },
    { href: "/adventures", label: "AVENTURAS" },
    { href: "/events", label: "EVENTS" },
    { href: "/merchant", label: "MERCH" },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                PROYECTO CU<span className="text-orange-500">M</span>BRE
              </h1>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white hover:text-orange-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2">
              {/* Social Icons - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-2 mr-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" strokeWidth={1.5} />
                </a>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle
                    className="w-5 h-5 text-white"
                    strokeWidth={1.5}
                  />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
                  aria-label="TikTok"
                >
                  <Music className="w-5 h-5 text-white" strokeWidth={1.5} />
                </a>
              </div>

              {/* Cart Button */}
              <CartButton />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/95 backdrop-blur-sm md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8 pt-20">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-bold text-white hover:text-orange-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Social Icons */}
            <div className="flex items-center gap-4 pt-8">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6 text-white" strokeWidth={1.5} />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-lg transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle
                  className="w-6 h-6 text-white"
                  strokeWidth={1.5}
                />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-lg transition-colors"
                aria-label="TikTok"
              >
                <Music className="w-6 h-6 text-white" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
