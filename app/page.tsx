'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Carousel, { CarouselItem } from './components/Carrusel';
import Lightbox from './components/Lightbox';
import ProductCard from './components/ProductCard';



export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Estados para el lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // ✨ NUEVO: Estados para lightbox de Sierra Nevada
  const [sierraLightboxOpen, setSierraLightboxOpen] = useState(false);
  const [sierraImageIndex, setSierraImageIndex] = useState(0);

      // ✨ NUEVO: Estados para lightbox de productos
  const [productLightboxOpen, setProductLightboxOpen] = useState(false);
  const [currentProductImages, setCurrentProductImages] = useState<string[]>([]);
  const [currentProductImageIndex, setCurrentProductImageIndex] = useState(0);

  // Define los datos del carrusel del equipo
  const teamMembers: CarouselItem[] = [
      { id: 1, title: "Miembro 1", subtitle: "Trail runner", image: "/team/m1.jpg" },
      { id: 2, title: "Miembro 2", subtitle: "Alpinista", image: "/team/m2.jpg" },
      { id: 3, title: "Miembro 3", subtitle: "Ultra runner", image: "/team/m3.jpg" },
      { id: 4, title: "Miembro 4", subtitle: "Montañero", image: "/team/m4.jpg" },
      { id: 5, title: "Miembro 5", subtitle: "Escalador", image: "/team/m5.jpg" },
      { id: 6, title: "Miembro 6", subtitle: "Trail runner", image: "/team/m6.jpg" },
      { id: 7, title: "Miembro 7", subtitle: "Aventurero", image: "/team/m4.jpg" },
      { id: 8, title: "Miembro 8", subtitle: "Alpinista", image: "/team/m8.jpg" },
      { id: 9, title: "Miembro 9", subtitle: "Trekker", image: "/team/m3.jpg" },
      { id: 10, title: "Miembro 10", subtitle: "Ultra runner", image: "/team/m2.jpg" }
    ];

  // Array de fotos de Picos
  const picosGallery = [
    'foto-1.jpg',
    'foto-2.jpg',
    'foto-3.jpg',
    'foto-4.jpg',
    'foto-5.jpg',
    'foto-6.jpg'
  ];


  // ✨ NUEVO: Array de fotos de Sierra Nevada (9 fotos)
  const sierraGallery = [
    'fotos-1.jpg',
    'fotos-2.jpg',
    'fotos-3.jpg',
    'fotos-4.jpg',
    'fotos-5.jpg',
    'fotos-6.jpg',
    'fotos-7.jpg',
    'fotos-8.jpg',
    'fotos-9.jpg'
  ];



  // ✨ NUEVO: Datos de productos con múltiples imágenes
  const products = [
    {
      name: "Camiseta técnica Proyecto Cumbre",
      desc: "Material transpirable de secado rápido. Perfecta para trail running y montaña.",
      price: "40",
      sizes: "S, M, L, XL, XXL",
      tags: ["NUEVO"],
      images: [
        { url: "/shop/tecnica.jpeg", alt: "Camiseta Proyecto Cumbre - Vista frontal" },
        { url: "/shop/tecnica1.jpeg", alt: "Camiseta Proyecto Cumbre - Vista trasera" },
        // { url: "/shop/camiseta-3.jpg", alt: "Camiseta Proyecto Cumbre - Detalle logo" }
      ]
    },
    {
      name: "Camiseta Tee Basic",
      desc: "Algodón orgánico con logo. Tallaje oversize",
      price: "20",
      sizes: "S, M, L, XL",
      images: [
        { url: "/shop/basic.jpeg", alt: "Camiseta - Vista frontal" },
        // { url: "/shop/sudadera-2.jpg", alt: "Sudadera - Vista trasera" },
        // { url: "/shop/sudadera-3.jpg", alt: "Sudadera - Detalle bordado" }
      ]
    },
    {
      name: "Sudadera El diablo te llevo",
      desc: "Algodón orgánico, tallaje oversize",
      price: "50",
      sizes: "Única",
      images: [
        { url: "/shop/diablo.jpeg", alt: "Gorra outdoor - Vista frontal" },
        // { url: "/shop/gorra-2.jpg", alt: "Gorra outdoor - Vista lateral" }
      ]
    },
    {
      name: "Camiseta Sierra Nevada",
      desc: "Algodón orgánico, tallaje oversize",
      price: "25",
      sizes: "Única",
      tags: ["BESTSELLER"],
      images: [
        { url: "/shop/s.nevada.jpeg", alt: "Buff - Diseño principal" },
        // { url: "/shop/buff-2.jpg", alt: "Buff - Forma de cuello" },
        // { url: "/shop/buff-3.jpg", alt: "Buff - Forma de gorro" }
      ]
    },
    {
      name: "Camiseta sin mangas",
      desc: "Algodón orgánico destintado",
      price: "25",
      images: [
        { url: "/shop/sin.jpeg", alt: "Botella térmica - Vista completa" },
        // { url: "/shop/botella-2.jpg", alt: "Botella térmica - Detalle logo" }
      ]
    },
    {
      name: "Classic PC Cap",
      desc: "Ligera y resistente para tu día a dia.",
      price: "85",
      images: [
        { url: "/shop/cap.jpeg", alt: "Gorra - Vista frontal" },
        // { url: "/shop/mochila-2.jpg", alt: "Mochila 20L - Vista trasera" },
        // { url: "/shop/mochila-3.jpg", alt: "Mochila 20L - Compartimentos" },
        // { url: "/shop/mochila-4.jpg", alt: "Mochila 20L - En uso" }
      ]
    }
  ];

  // Funciones para lightbox de productos
  const openProductLightbox = (productIndex: number, imageIndex: number) => {
    const productImages = products[productIndex].images.map(img => img.url);
    setCurrentProductImages(productImages);
    setCurrentProductImageIndex(imageIndex);
    setProductLightboxOpen(true);
  };

  const closeProductLightbox = () => {
    setProductLightboxOpen(false);
  };

  const goToProductNext = () => {
    setCurrentProductImageIndex((prev) => 
      prev === currentProductImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToProductPrev = () => {
    setCurrentProductImageIndex((prev) => 
      prev === 0 ? currentProductImages.length - 1 : prev - 1
    );
  };

   // Funciones para el lightbox
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => 
      prev === picosGallery.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrev = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? picosGallery.length - 1 : prev - 1
    );
  };

   const openSierraLightbox = (index: number) => {
    setSierraImageIndex(index);
    setSierraLightboxOpen(true);
  };

  const closeSierraLightbox = () => {
    setSierraLightboxOpen(false);
  };

  const goToSierraNext = () => {
    setSierraImageIndex((prev) => 
      prev === sierraGallery.length - 1 ? 0 : prev + 1
    );
  };

  const goToSierraPrev = () => {
    setSierraImageIndex((prev) => 
      prev === 0 ? sierraGallery.length - 1 : prev - 1
    );
  };


  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      {/* Header / Navigation */}
      <header className="fixed top-0 w-full bg-zinc-950/90 backdrop-blur-sm z-50 border-b border-zinc-800">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <a href="#inicio" className="flex items-center">
              <Image 
                src="/aaa.png"
                alt="Proyecto Cumbre Logo"
                width={180}
                height={60}
                className="h-10 w-auto md:h-12"
                priority
              />
            </a>
          </div>
          
          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 text-sm">
            <li><a href="#inicio" className="hover:text-orange-400 transition">HOME</a></li>
            <li><a href="#quienes-somos" className="hover:text-orange-400 transition">QUIÉNES SOMOS</a></li>
            <li><a href="#aventuras" className="hover:text-orange-400 transition">NUESTRAS AVENTURAS</a></li>
            <li><a href="#events" className="hover:text-orange-400 transition">SOCIAL CLUB EVENTS</a></li>
            <li><a href="#merchant" className="hover:text-orange-400 transition">MERCHANT</a></li>
          </ul>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
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
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-zinc-950 border-b border-zinc-800">
            <ul className="py-4">
              <li>
                <a 
                  href="#inicio" 
                  className="block px-4 py-3 hover:bg-zinc-900 hover:text-orange-400 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inicio
                </a>
              </li>
              <li>
                <a 
                  href="#quienes-somos" 
                  className="block px-4 py-3 hover:bg-zinc-900 hover:text-orange-400 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Quiénes somos
                </a>
              </li>
              <li>
                <a 
                  href="#aventuras" 
                  className="block px-4 py-3 hover:bg-zinc-900 hover:text-orange-400 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Nuestras aventuras
                </a>
              </li>
              <li>
                <a 
                  href="#events" 
                  className="block px-4 py-3 hover:bg-zinc-900 hover:text-orange-400 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Social Club Events
                </a>
              </li>
              <li>
                <a 
                  href="#merchant" 
                  className="block px-4 py-3 hover:bg-zinc-900 hover:text-orange-400 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Merchant
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Section 1 - Hero / Inicio */}
      <section id="inicio" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/quienes-bg.jpg"
            alt="Proyecto Cumbre - Club de montaña"
            fill
            className="object-cover object-[0%_15%]"
            quality={90}
            priority
          />
          {/* Capa oscura semi-transparente para que el texto sea legible */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
         {/* Contenido (texto y botones) */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            {/* <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
              PROYECTO<br />CUMBRE
            </h1> */}
            <p className="text-lg md:text-xl text-zinc-100 leading-relaxed mb-8">
              Club de montaña, vivacs y grandes rutas diseñado para quienes buscan algo más que llegar a la cima.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href=" https://chat.whatsapp.com/EHmIEAcK7EBFP3UgntDdX9"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition shadow-lg inline-flex items-center gap-3"
              >
                {/* Icono de WhatsApp */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Únete al club
              </a>
             
              <a href="#aventuras" className="text-orange-400 hover:text-orange-300 px-8 py-4 font-semibold transition flex items-center justify-center border border-orange-400 hover:border-orange-300 rounded-lg">
                Ver próximas aventuras →
              </a>
            </div>
          </div>
        </div>
        
        {/* <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-zinc-950 opacity-50"></div>
        
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              PROYECTO<br />CUMBRE
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 leading-relaxed">
              Club de montaña, vivacs y grandes rutas diseñado para quienes buscan algo más que llegar a la cima.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition">
                Únete al club
              </button>
              <a href="#aventuras" className="text-orange-400 hover:text-orange-300 px-8 py-4 font-semibold transition flex items-center justify-center">
                Ver próximas aventuras →
              </a>
            </div>
          </div>

          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <span className="text-zinc-600 text-center px-4">[Imagen: Silueta de montañistas]</span>
            </div>
          </div>
        </div> */}
      </section>

      {/* Section 2 - Quiénes somos */}
    {/* Section 2 - Quiénes somos */}
      <section id="quienes-somos" className="py-16 md:py-24 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Quiénes somos</h2>
          <div className="w-20 h-1 bg-orange-500 mb-8 md:mb-12"></div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Texto */}
            <div className="space-y-6">
               <p className="text-base md:text-lg text-zinc-300 leading-relaxed">
                Proyecto Cumbre nace de la unión de seis amigos a los que la montaña y el deporte les cambió la forma de entender la vida. 
                Lo que empezó como una simple excusa para escapar a la naturaleza se convirtió en un social club donde compartimos retos, 
                técnicas, aprendizaje y una misma filosofía: <strong>explorar más, vivir mejor y llegar siempre un poco más lejos</strong>.
              </p>
              <p className="text-base md:text-lg text-zinc-300 leading-relaxed">
                Somos un grupo inquieto y polivalente. Practicamos <strong>trail, gravel, escalada, vivac, trekking, carreras híbridas</strong> 
                y cualquier aventura que nos obligue a salir de la zona de confort. Valoramos la seguridad, la progresión y, sobre todo, 
                el ambiente: la charla en la cima, la ruta que se alarga porque sí y el compañerismo que hace que todo merezca la pena.
              </p>
              <p className="text-base md:text-lg text-zinc-300 leading-relaxed">
                En Proyecto Cumbre no buscamos solo alcanzar picos; buscamos <strong>experiencias reales</strong>. Momentos que empiezan en un sendero 
                y acaban convirtiéndose en historias que recordar.
              </p>
            </div>

            {/* Carrusel reutilizable */}
            <Carousel 
              items={teamMembers}
              autoPlayInterval={3000}
              showControls={true}
              showDots={true}
              showCounter={true}
            />
          </div>
        </div>
      </section>


      {/* Section 3 - Nuestras aventuras */}
      <section id="aventuras" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestras aventuras</h2>
                    <div className="w-20 h-1 bg-orange-500 mb-8 md:mb-12"></div>

          <p className="text-zinc-400 mb-8 md:mb-12">Algunos de los proyectos que organizamos dentro del club.</p>

          {/* Aventura 1 - Anillo de Picos */}
          <div className="mb-12 md:mb-16 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-6 md:p-8 border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 shadow-xl">
                {/* Header de la aventura */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 text-orange-400">
                      Anillo de Picos de Europa
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded-full border border-orange-500/30">
                        4 días
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/30">
                        120 km
                      </span>
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full border border-red-500/30">
                        9.500 m+
                      </span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full border border-purple-500/30">
                        Nivel avanzado
                      </span>
                    </div>
                  </div>
                </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Columna izquierda - Descripción y etapas */}
              <div className="space-y-6">
                {/* Descripción principal */}
                <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
                  <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
                    Completamos el <strong className="text-orange-400">Anillo de Picos de Europa</strong> recorriendo todos los refugios oficiales 
                    en una travesía de <strong className="text-orange-400">4 días</strong> que enlaza los tres macizos y algunos de los paisajes más icónicos del parque.
                    Una ruta exigente, técnica y de gran belleza, perfecta para quienes disfrutan de largas jornadas, fuertes desniveles 
                    y pasos de alta montaña.
                  </p>
                </div>

                {/* Título de etapas */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
                  <h4 className="text-lg font-bold text-zinc-100">Resumen de etapas</h4>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
                </div>

                {/* Etapas - Cards mejoradas */}
                <div className="space-y-3">
                  {/* Etapa 1 */}
                  <div className="group bg-zinc-800/30 hover:bg-zinc-800/60 p-4 rounded-xl border border-zinc-700/50 hover:border-orange-500/50 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center font-bold border border-orange-500/30">
                        1
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h5 className="font-bold text-white text-sm md:text-base">Etapa 1</h5>
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">23 km</span>
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">2.400 m+</span>
                        </div>
                        <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                          Poncebos → Camino del Cares → Canal de Trea → Refugio Vega de Ario → Refugio Vegarredonda
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Etapa 2 */}
                  <div className="group bg-zinc-800/30 hover:bg-zinc-800/60 p-4 rounded-xl border border-zinc-700/50 hover:border-orange-500/50 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center font-bold border border-orange-500/30">
                        2
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h5 className="font-bold text-white text-sm md:text-base">Etapa 2</h5>
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">36 km</span>
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">3.100 m+</span>
                          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">★ Más exigente</span>
                        </div>
                        <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                          Refugio Vegarredonda → Torre de Santa María → Refugio Vegabaño → Posada de Valdeón → Canal de Asotín → Collado Jermoso → Refugio Collado Jermoso
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Etapa 3 */}
                  <div className="group bg-zinc-800/30 hover:bg-zinc-800/60 p-4 rounded-xl border border-zinc-700/50 hover:border-orange-500/50 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center font-bold border border-orange-500/30">
                        3
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h5 className="font-bold text-white text-sm md:text-base">Etapa 3</h5>
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">37 km</span>
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">2.400 m+</span>
                        </div>
                        <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                          Refugio Collado Jermoso → Cabaña Verónica → Casetón de Ándara → Canal de Jidiellu → Sotres → Refugio Terenosa
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Etapa 4 */}
                  <div className="group bg-zinc-800/30 hover:bg-zinc-800/60 p-4 rounded-xl border border-zinc-700/50 hover:border-orange-500/50 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center font-bold border border-orange-500/30">
                        4
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h5 className="font-bold text-white text-sm md:text-base">Etapa 4</h5>
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">24 km</span>
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">1.600 m+</span>
                        </div>
                        <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                          Refugio Terenosa → Refugio Vega de Urriellu → Refugio Jou de los Cabrones → Bulnes → Poncebos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conclusión */}
                {/* <div className="bg-gradient-to-r from-orange-500/10 to-transparent p-4 rounded-lg border-l-4 border-orange-500">
                  <p className="text-sm text-zinc-300 leading-relaxed italic">
                    Una experiencia integral por los Picos de Europa, uniendo collados, canales, refugios históricos y algunos de los 
                    paisajes más salvajes del norte peninsular.
                  </p>
                </div> */}
              </div>

              {/* Columna derecha - Galería */}
              <div className="space-y-4">
                {/* Track GPX - Destacado */}
                <a 
                  href="https://strava.app.link/P8FK7E1XhYb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative h-48 md:h-64 bg-zinc-800 rounded-xl overflow-hidden group border border-zinc-700 hover:border-orange-500 transition-all cursor-pointer block"
                >
                  {/* Imagen del track de fondo */}
                  <Image 
                    src="/track-picos.jpeg"
                    alt="Track Anillo Picos de Europa"
                    fill
                    className="object-cover brightness-75 group-hover:brightness-100 transition-all duration-500"
                    quality={85}
                  />
                  
                  {/* Badge de Strava arriba a la derecha */}
                  <div className="absolute top-3 right-3 bg-orange-500 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
                    </svg>
                    <span className="text-white text-xs font-bold">STRAVA</span>
                  </div>
                  
                  {/* Overlay gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  
                  {/* Info abajo */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1">
                          Anillo de Picos de Europa
                        </h4>
                        <div className="flex gap-3 text-xs text-zinc-300">
                          <span>120 km</span>
                          <span>•</span>
                          <span>9.500 m+</span>
                          <span>•</span>
                          <span>4 días</span>
                        </div>
                      </div>
                      <div className="text-orange-400 group-hover:translate-x-1 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>

                {/* Galería de fotos - Mejorada */}
                  <div className="grid grid-cols-3 gap-2">
                    {picosGallery.map((foto, i) => (
                      <div 
                        key={i} 
                        className="relative h-24 md:h-32 bg-zinc-800 rounded-lg overflow-hidden group border border-zinc-700 hover:border-orange-500/50 transition-all cursor-pointer"
                        onClick={() => openLightbox(i)} // ← Click para abrir
                      >
                        <Image 
                          src={`/aventuras/picos/${foto}`}
                          alt={`Picos de Europa - Foto ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 33vw, 20vw"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Lightbox Component */}
                  <Lightbox 
                    isOpen={lightboxOpen}
                    imageSrc={`/aventuras/picos/${picosGallery[currentImageIndex]}`}
                    imageAlt={`Anillo de Picos de Europa - Foto ${currentImageIndex + 1}`}
                    onClose={closeLightbox}
                    onNext={goToNext}
                    onPrev={goToPrev}
                    currentIndex={currentImageIndex}
                    totalImages={picosGallery.length}
                  />

                {/* Stats adicionales */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50 text-center">
                    <div className="text-2xl font-bold text-orange-400 mb-1">4</div>
                    <div className="text-xs text-zinc-400">Días de travesía</div>
                  </div>
                  <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">8</div>
                    <div className="text-xs text-zinc-400">Refugios visitados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Aventura 2 - Vivac Sierra Nevada */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-6 md:p-8 border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 shadow-xl">
            {/* Header de la aventura */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2 text-orange-400">
                  Vivac + Trekking Sierra Nevada
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded-full border border-orange-500/30">
                    3 días
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/30">
                    31 km
                  </span>
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full border border-red-500/30">
                    1.100 m+ / -1.800 m
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                    ⛺ Vivac incluido
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full border border-purple-500/30">
                    Nivel medio-alto
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Columna izquierda - Descripción y etapas */}
              <div className="space-y-6">
                {/* Descripción principal */}
                <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
                  <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
                    Realizamos una travesía de <strong className="text-orange-400">3 días</strong> por las alturas de Sierra Nevada, 
                    combinando <strong className="text-green-400">vivac bajo las estrellas</strong> y pernocta en refugios según disponibilidad. 
                    Una ruta perfecta para quienes buscan desnivel, ascensiones opcionales y la experiencia de moverse por uno de los 
                    macizos más icónicos de la península.
                  </p>
                </div>

                {/* Título de etapas */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
                  <h4 className="text-lg font-bold text-zinc-100">Resumen de etapas</h4>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
                </div>

                {/* Etapas - Cards mejoradas */}
                <div className="space-y-3">
                  {/* Etapa 1 */}
                  <div className="group bg-zinc-800/30 hover:bg-zinc-800/60 p-4 rounded-xl border border-zinc-700/50 hover:border-orange-500/50 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center font-bold border border-orange-500/30">
                        1
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h5 className="font-bold text-white text-sm md:text-base">Viernes 15</h5>
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">7 km</span>
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">+700 m</span>
                          <span className="px-2 py-0.5 bg-zinc-600/50 text-zinc-300 text-xs rounded">3–4 h</span>
                        </div>
                        <p className="text-xs md:text-sm text-zinc-400 leading-relaxed mb-2">
                          Hoya de la Mora → Refugio de la Carihuela
                        </p>
                        <div className="flex items-center gap-2 mt-2 p-2 bg-green-500/10 rounded border border-green-500/20">
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                          <span className="text-xs text-green-400 font-semibold">
                            Opción: Veleta +2 km / +150 m / +1–1,5 h
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Etapa 2 */}
                  <div className="group bg-zinc-800/30 hover:bg-zinc-800/60 p-4 rounded-xl border border-zinc-700/50 hover:border-orange-500/50 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center font-bold border border-orange-500/30">
                        2
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h5 className="font-bold text-white text-sm md:text-base">Sábado 16</h5>
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">10 km</span>
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">+400 m / -300 m</span>
                          <span className="px-2 py-0.5 bg-zinc-600/50 text-zinc-300 text-xs rounded">4–5 h</span>
                        </div>
                        <p className="text-xs md:text-sm text-zinc-400 leading-relaxed mb-2">
                          Refugio de la Carihuela → Refugio de la Caldera
                        </p>
                        <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          <span className="text-xs text-yellow-400 font-semibold">
                            Opción: Mulhacén ⛰️ +5 km / +500 m / +2–3 h
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Etapa 3 */}
                  <div className="group bg-zinc-800/30 hover:bg-zinc-800/60 p-4 rounded-xl border border-zinc-700/50 hover:border-orange-500/50 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center font-bold border border-orange-500/30">
                        3
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h5 className="font-bold text-white text-sm md:text-base">Domingo 17</h5>
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">14 km</span>
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">-1.200 m</span>
                          <span className="px-2 py-0.5 bg-zinc-600/50 text-zinc-300 text-xs rounded">4–5 h</span>
                        </div>
                        <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                          Refugio de la Caldera → Hoya de la Mora (descenso)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conclusión */}
                <div className="bg-gradient-to-r from-orange-500/10 to-transparent p-4 rounded-lg border-l-4 border-orange-500">
                  <p className="text-sm text-zinc-300 leading-relaxed italic">
                    Una experiencia completa por la alta montaña granadina, con amaneceres inolvidables, cumbres míticas 
                    y la libertad del vivac en altura.
                  </p>
                </div>

                {/* Qué incluye */}
                <div className="bg-zinc-800/30 p-4 rounded-lg border border-zinc-700/50">
                  <h5 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    Altitudes máximas
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-400">Mulhacén (opcional)</span>
                      <span className="font-bold text-yellow-400">3.482 m</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-400">Veleta (opcional)</span>
                      <span className="font-bold text-green-400">3.396 m</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-400">Refugio más alto</span>
                      <span className="font-bold text-blue-400">~2.500 m</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha - Galería y stats */}
              <div className="space-y-4">
                {/* Destacado principal - Vivac */}
               {/* Track Sierra Nevada - Versión con tema nocturno */}
                {/* Track Sierra Nevada - Estilo idéntico a Picos */}
                <a 
                  href="https://strava.app.link/pC1A8RnZhYb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative h-48 md:h-64 bg-zinc-800 rounded-xl overflow-hidden group border border-zinc-700 hover:border-orange-500 transition-all cursor-pointer block"
                >
                  {/* Imagen del track */}
                  <Image 
                    src="/track-sierranevada.jpeg"
                    alt="Track Vivac Sierra Nevada"
                    fill
                    className="object-cover brightness-75 group-hover:brightness-100 transition-all duration-500"
                    quality={85}
                  />
                  
                  {/* Badge de Strava */}
                  <div className="absolute top-3 right-3 bg-orange-500 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
                    </svg>
                    <span className="text-white text-xs font-bold">STRAVA</span>
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  
                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1">
                          Vivac + Trekking Sierra Nevada
                        </h4>
                        <div className="flex gap-3 text-xs text-zinc-300">
                          <span>31 km</span>
                          <span>•</span>
                          <span>1.100 m+</span>
                          <span>•</span>
                          <span>3 días</span>
                        </div>
                      </div>
                      <div className="text-orange-400 group-hover:translate-x-1 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>


                {/* Galería de fotos - Grid 3x3 con imágenes reales */}
                <div className="grid grid-cols-3 gap-2">
                  {sierraGallery.map((foto, i) => (
                    <div 
                      key={i} 
                      className="relative h-24 md:h-32 bg-zinc-800 rounded-lg overflow-hidden group border border-zinc-700 hover:border-orange-500/50 transition-all cursor-pointer"
                      onClick={() => openSierraLightbox(i)}
                    >
                      {/* Imagen */}
                      <Image 
                        src={`/aventuras/s.nevada/${foto}`}
                        alt={`Sierra Nevada - Foto ${i + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 33vw, 20vw"
                      />
                      
                      {/* Overlay oscuro al hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Icono de zoom al hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ✨ NUEVO: Lightbox de Sierra Nevada */}
                <Lightbox 
                  isOpen={sierraLightboxOpen}
                  imageSrc={`/aventuras/s.nevada/${sierraGallery[sierraImageIndex]}`}
                  imageAlt={`Vivac Sierra Nevada - Foto ${sierraImageIndex + 1}`}
                  onClose={closeSierraLightbox}
                  onNext={goToSierraNext}
                  onPrev={goToSierraPrev}
                  currentIndex={sierraImageIndex}
                  totalImages={sierraGallery.length}
                />

                {/* Stats de la aventura */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 text-center">
                    <div className="text-xl font-bold text-orange-400 mb-1">3</div>
                    <div className="text-xs text-zinc-400">Días</div>
                  </div>
                  <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 text-center">
                    <div className="text-xl font-bold text-green-400 mb-1">2</div>
                    <div className="text-xs text-zinc-400">Refugios</div>
                  </div>
                  <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 text-center">
                    <div className="text-xl font-bold text-yellow-400 mb-1">2</div>
                    <div className="text-xs text-zinc-400">Cumbres opcionales</div>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 py-3 rounded-lg border border-orange-500/30 hover:border-orange-500/50 transition font-semibold text-sm">
                  Más información sobre esta ruta →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - Social Club Events */}
      <section id="events" className="py-16 md:py-24 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Social Club Events</h2>
          <div className="w-20 h-1 bg-orange-500 mb-8 md:mb-12"></div>
          <p className="text-zinc-400 mb-12">Quedadas, entrenamientos conjuntos y viajes de fin de semana.</p>

          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Línea vertical */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-zinc-600 to-zinc-700"></div>

            {/* Eventos */}
            <div className="space-y-8">
              
              {/* Evento futuro 1 */}
              <div className="relative pl-20 group">
                {/* Punto en la línea */}
                <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-orange-500 border-4 border-zinc-900 group-hover:scale-125 transition-transform shadow-lg shadow-orange-500/50"></div>
                
                {/* Card */}
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-xl border border-orange-500/30 hover:border-orange-500 transition-all shadow-lg hover:shadow-orange-500/20">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">PRÓXIMO</span>
                        <span className="text-orange-400 font-semibold text-sm">27 Noviembre 2025</span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">TRAIL & TRANCA</h4>
                      <p className="text-zinc-400 text-sm">Salida/llega bar la tranca. 8Kms aprox 300+</p>
                    </div>
                    <div className="flex-shrink-0 ml-4 hidden md:block">
                      <svg className="w-12 h-12 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">noche</span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">asfalto</span>
                  </div>
                </div>
              </div>

              {/* Evento futuro 2 */}
              {/* <div className="relative pl-20 group">
                <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-orange-500 border-4 border-zinc-900 group-hover:scale-125 transition-transform shadow-lg shadow-orange-500/50"></div>
                
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-xl border border-orange-500/30 hover:border-orange-500 transition-all shadow-lg hover:shadow-orange-500/20">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">PRÓXIMO</span>
                        <span className="text-orange-400 font-semibold text-sm">22 Diciembre 2025</span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">Entrenamiento técnico</h4>
                      <p className="text-zinc-400 text-sm">Técnicas de progresión en cresta</p>
                    </div>
                    <div className="flex-shrink-0 ml-4 hidden md:block">
                      <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">Técnico</span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">Formación</span>
                  </div>
                </div>
              </div> */}

              {/* Evento futuro 3 */}
              <div className="relative pl-20 group">
                <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-orange-500 border-4 border-zinc-900 group-hover:scale-125 transition-transform shadow-lg shadow-orange-500/50"></div>
                
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-xl border border-orange-500/30 hover:border-orange-500 transition-all shadow-lg hover:shadow-orange-500/20">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">SUSPENDIDO</span>
                        <span className="text-red-400 font-semibold text-sm">15 Noviembre 2025</span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">CIRCULAR PICO DEL CIELO</h4>
                      <span className="text-red-400 font-semibold text-sm">Alerta Naranja por temporal</span>
                      <p className="text-zinc-400 text-sm">Ruta de trail/senderismo por la Sierra de la Almijara</p>
                    </div>
                    <div className="flex-shrink-0 ml-4 hidden md:block">
                      <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {/* Montañas */}
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 20l5-7 4 4 5-7 4 5v5H3z" />
                        {/* Gotas de lluvia */}
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 4v3M12 2v4M16 4v3M6 8v2M10 6v3M14 7v2M18 8v2" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">mañana</span>
                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded">trail</span>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">senderismo</span>
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className="relative pl-20 py-4">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-zinc-600 border-4 border-zinc-900"></div>
                <div className="text-zinc-500 text-sm font-semibold">━━━ Eventos pasados ━━━</div>
              </div>

              {/* Evento pasado 1 */}
              <div className="relative pl-20 group opacity-60 hover:opacity-100 transition-opacity">
                <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-zinc-600 border-4 border-zinc-900"></div>
                
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="px-3 py-1 bg-zinc-700 text-zinc-300 text-xs font-bold rounded-full">COMPLETADO</span>
                        <span className="text-zinc-500 font-semibold text-sm">06 Noviembre 2025</span>
                      </div>
                      <h4 className="text-lg font-bold text-zinc-300 mb-2">UP&DOWN SOCIAL RUN</h4>
                      {/* <p className="text-zinc-500 text-sm">Anillo completado en 4 días</p> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Evento pasado 2 */}
              <div className="relative pl-20 group opacity-60 hover:opacity-100 transition-opacity">
                <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-zinc-600 border-4 border-zinc-900"></div>
                
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="px-3 py-1 bg-zinc-700 text-zinc-300 text-xs font-bold rounded-full">COMPLETADO</span>
                        <span className="text-zinc-500 font-semibold text-sm">20 Octubre 2025</span>
                      </div>
                      <h4 className="text-lg font-bold text-zinc-300 mb-2">La MILLA (SOCIAL) CHALLENGE</h4>
                      {/* <p className="text-zinc-500 text-sm">Primera nevada de la temporada</p> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Evento pasado 3 */}
              <div className="relative pl-20 group opacity-60 hover:opacity-100 transition-opacity">
                <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-zinc-600 border-4 border-zinc-900"></div>
                
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="px-3 py-1 bg-zinc-700 text-zinc-300 text-xs font-bold rounded-full">COMPLETADO</span>
                        <span className="text-zinc-500 font-semibold text-sm">15 Octubre 2025</span>
                      </div>
                      <h4 className="text-lg font-bold text-zinc-300 mb-2">HYBRID TRAINING</h4>
                      {/* <p className="text-zinc-500 text-sm">50km con 3000m+</p> */}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Section 5 - Merchant MEJORADA */}
      <section id="merchant" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Merchant</h2>
          <div className="w-20 h-1 bg-orange-500 mb-8 md:mb-12"></div>

          <p className="text-zinc-400 mb-12 max-w-2xl">
            Merchandising exclusivo del club para miembros y amigos de Proyecto Cumbre. 
            Calidad premium, diseños únicos.
          </p>

          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, i) => (
              <ProductCard
                key={i}
                name={product.name}
                desc={product.desc}
                price={product.price}
                images={product.images}
                sizes={product.sizes}
                tags={product.tags}
                onImageClick={(imageIndex) => openProductLightbox(i, imageIndex)}
              />
            ))}
          </div>
        </div>
      </section>
       {/* ✨ NUEVO: Lightbox de productos */}
      <Lightbox 
        isOpen={productLightboxOpen}
        imageSrc={currentProductImages[currentProductImageIndex] || ''}
        imageAlt={`Producto - Imagen ${currentProductImageIndex + 1}`}
        onClose={closeProductLightbox}
        onNext={goToProductNext}
        onPrev={goToProductPrev}
        currentIndex={currentProductImageIndex}
        totalImages={currentProductImages.length}
      />

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">PROYECTO CUMBRE</h3>
              <p className="text-zinc-400 text-sm">
                Social club de montaña, vivacs y grandes rutas.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#inicio" className="hover:text-orange-400 transition">Inicio</a></li>
                <li><a href="#quienes-somos" className="hover:text-orange-400 transition">Quiénes somos</a></li>
                <li><a href="#aventuras" className="hover:text-orange-400 transition">Aventuras</a></li>
                <li><a href="#events" className="hover:text-orange-400 transition">Eventos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition">
                  <span className="text-sm">IG</span>
                </a>
                <a href="#" className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition">
                  <span className="text-sm">FB</span>
                </a>
                <a href="#" className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition">
                  <span className="text-sm">YT</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-zinc-500 gap-4">
            <p className="text-center md:text-left">© 2025 Proyecto Cumbre. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-orange-400 transition">Aviso legal</a>
              <a href="#" className="hover:text-orange-400 transition">Política de privacidad</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}