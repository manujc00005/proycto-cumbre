'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

// Componente del Carrusel (añadir antes del export default function Home)
function TeamCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array con la información de los 10 miembros
  const teamMembers = [
    { id: 1, name: "Miembro 1", role: "Trail runner", image: "/team/m1.jpg" },
    { id: 2, name: "Miembro 2", role: "Alpinista", image: "/team/m2.jpg" },
    { id: 3, name: "Miembro 3", role: "Ultra runner", image: "/team/m3.jpg" },
    { id: 4, name: "Miembro 4", role: "Montañero", image: "/team/m4.jpg" },
    { id: 5, name: "Miembro 5", role: "Escalador", image: "/team/m5.jpg" },
    { id: 6, name: "Miembro 6", role: "Trail runner", image: "/team/m6.jpg" },
    { id: 7, name: "Miembro 7", role: "Aventurero", image: "/team/m4.jpg" },
    { id: 8, name: "Miembro 8", role: "Alpinista", image: "/team/m8.jpg" },
    { id: 9, name: "Miembro 9", role: "Trekker", image: "/team/m3.jpg" },
    { id: 10, name: "Miembro 10", role: "Ultra runner", image: "/team/m2.jpg" }
  ];

  // Cambio automático cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === teamMembers.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, [teamMembers.length]);

  // Función para ir a una imagen específica
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Funciones de navegación manual
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? teamMembers.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === teamMembers.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative">
      {/* Carrusel Principal */}
      <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
        {teamMembers.map((member, index) => (
          <div
            key={member.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
              quality={85}
            />
            {/* Overlay con información */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-semibold text-lg md:text-xl text-white mb-1">
                {member.name}
              </p>
              <span className="text-sm md:text-base text-orange-400">
                {member.role}
              </span>
            </div>
          </div>
        ))}

        {/* Botones de Navegación */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
          aria-label="Anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
          aria-label="Siguiente"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indicadores (Dots) */}
      <div className="flex justify-center gap-2 mt-4">
        {teamMembers.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-orange-500 w-8' 
                : 'bg-zinc-600 hover:bg-zinc-500'
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>

      {/* Contador */}
      <div className="text-center mt-2 text-sm text-zinc-400">
        {currentIndex + 1} / {teamMembers.length}
      </div>
    </div>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      {/* Header / Navigation */}
      <header className="fixed top-0 w-full bg-zinc-950/90 backdrop-blur-sm z-50 border-b border-zinc-800">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <a href="#inicio" className="flex items-center">
              <Image 
                src="/pc-logo-largo-removebg-preview.png"
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
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition shadow-lg">
                Únete al club
              </button>
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

            {/* Carrusel de Fotos */}
            <TeamCarousel />
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
         {/* Aventura 1 - Anillo de Picos de Europa - VERSIÓN MEJORADA */}
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
      <div className="relative h-48 md:h-64 bg-zinc-800 rounded-xl overflow-hidden group border border-zinc-700 hover:border-orange-500/50 transition-all">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg className="w-16 h-16 text-orange-500/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="text-zinc-500 text-sm font-semibold">Track GPX del Anillo</span>
          <button className="mt-3 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-xs font-semibold rounded-lg border border-orange-500/30 transition">
            Ver mapa completo →
          </button>
        </div>
      </div>

      {/* Galería de fotos - Mejorada */}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="relative h-24 md:h-32 bg-zinc-800 rounded-lg overflow-hidden group border border-zinc-700 hover:border-orange-500/50 transition-all cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-zinc-600 text-xs">Foto {i}</span>
            </div>
            {/* Icono de zoom al hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

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
         {/* Aventura 2 - Vivac + Trekking Sierra Nevada - VERSIÓN MEJORADA */}
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
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl overflow-hidden group border border-zinc-700 hover:border-orange-500/50 transition-all">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-transparent to-blue-500/20"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg className="w-16 h-16 text-orange-500/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <span className="text-zinc-300 text-sm font-semibold mb-1">Vivac bajo las estrellas</span>
          <span className="text-zinc-500 text-xs">Sierra Nevada</span>
        </div>
      </div>

      {/* Galería de fotos - Grid 2x3 */}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="relative h-24 md:h-32 bg-zinc-800 rounded-lg overflow-hidden group border border-zinc-700 hover:border-orange-500/50 transition-all cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-zinc-600 text-xs">Foto {i}</span>
            </div>
            {/* Icono de zoom al hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

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

          <p className="text-zinc-400 mb-8 md:mb-12">Quedadas, entrenamientos conjuntos y viajes de fin de semana.</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Próximos eventos */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-orange-400">Próximos eventos</h3>
              <div className="space-y-4">
                {[
                  { title: "Salida nocturna + vivac corto", date: "15 Diciembre 2025", desc: "Vivac bajo las estrellas en la Sierra" },
                  { title: "Entrenamiento técnico", date: "22 Diciembre 2025", desc: "Técnicas de progresión en cresta" },
                  { title: "Ruta invernal Gredos", date: "5 Enero 2026", desc: "Travesía de dos días con raquetas" }
                ].map((event, i) => (
                  <div key={i} className="bg-zinc-900 p-4 md:p-6 rounded-lg border border-zinc-800 hover:border-orange-500 transition">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h4 className="font-semibold text-base md:text-lg">{event.title}</h4>
                      <span className="text-xs bg-orange-500 px-2 py-1 rounded whitespace-nowrap">Próximo</span>
                    </div>
                    <p className="text-xs md:text-sm text-orange-400 mb-2">{event.date}</p>
                    <p className="text-xs md:text-sm text-zinc-400">{event.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Eventos pasados */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-zinc-400">Eventos pasados</h3>
              <div className="space-y-4">
                {[
                  { title: "Travesía Picos de Europa", date: "10 Noviembre 2025", desc: "Anillo completado en 4 días" },
                  { title: "Vivac de otoño", date: "28 Octubre 2025", desc: "Primera nevada de la temporada" },
                  { title: "Trail running Guadarrama", date: "15 Octubre 2025", desc: "50km con 3000m+" }
                ].map((event, i) => (
                  <div key={i} className="bg-zinc-900/50 p-4 md:p-6 rounded-lg border border-zinc-800">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h4 className="font-semibold text-base md:text-lg text-zinc-300">{event.title}</h4>
                      <span className="text-xs bg-zinc-700 px-2 py-1 rounded whitespace-nowrap">Completado</span>
                    </div>
                    <p className="text-xs md:text-sm text-zinc-500 mb-2">{event.date}</p>
                    <p className="text-xs md:text-sm text-zinc-500">{event.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 - Merchant */}
      <section id="merchant" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Merchant</h2>
          <div className="w-20 h-1 bg-orange-500 mb-8 md:mb-12"></div>

          <p className="text-zinc-400 mb-8 md:mb-12">Merchandising exclusivo del club para miembros y amigos de Proyecto Cumbre.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: "Camiseta técnica Proyecto Cumbre", desc: "Material transpirable de secado rápido", price: "35" },
              { name: "Sudadera premium", desc: "Algodón orgánico con logo bordado", price: "55" },
              { name: "Gorra outdoor", desc: "Protección UV con diseño minimalista", price: "25" },
              { name: "Buff multifunción", desc: "Perfecto para alta montaña", price: "18" },
              { name: "Botella térmica", desc: "Mantiene 24h frío / 12h caliente", price: "32" },
              { name: "Mochila técnica 20L", desc: "Ligera y resistente para rutas de un día", price: "85" }
            ].map((product, i) => (
              <div key={i} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-orange-500 transition group">
                <div className="h-48 md:h-64 bg-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-600 text-sm">[Imagen producto]</span>
                </div>
                <div className="p-4 md:p-6 space-y-3">
                  <h3 className="font-semibold text-base md:text-lg">{product.name}</h3>
                  <p className="text-xs md:text-sm text-zinc-400">{product.desc}</p>
                  <p className="text-xs text-zinc-500">Tallas: S, M, L, XL</p>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl md:text-2xl font-bold text-orange-400">{product.price} €</span>
                    <button className="text-xs md:text-sm text-zinc-400 hover:text-orange-400 transition">
                      Más info →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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