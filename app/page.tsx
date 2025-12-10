'use client';

import Image from 'next/image';
import { useState } from 'react';
import Carousel, { CarouselItem } from './components/Carrusel';
import Lightbox from './components/Lightbox';
import EventsSection from './components/Events/EventsSection';
import HeaderSection from './components/Sections/HeaderSection';
import MerchantSection from './components/Sections/MerchantSection';
import Link from 'next/link';
import ContactForm from './components/ContactForm';


export default function Home() {

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
      { id: 1, title: "", subtitle: "", image: "/team/m1.jpg" },
      { id: 2, title: "", subtitle: "", image: "/team/m2.jpg" },
      { id: 3, title: "", subtitle: "", image: "/team/m3.jpg" },
      { id: 4, title: "", subtitle: "", image: "/team/m4.jpg" },
      { id: 5, title: "", subtitle: "", image: "/team/m5.jpg" },
      { id: 6, title: "", subtitle: "", image: "/team/m6.jpg" },
      // { id: 7, title: "Miembro 7", subtitle: "Aventurero", image: "/team/m4.jpg" },
      { id: 8, title: "", subtitle: "", image: "/team/m8.jpg" },
      // { id: 9, title: "Miembro 9", subtitle: "Trekker", image: "/team/m3.jpg" },
      // { id: 10, title: "Miembro 10", subtitle: "Ultra runner", image: "/team/m2.jpg" }
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

  // // Funciones para lightbox de productos
  // const openProductLightbox = (productIndex: number, imageIndex: number) => {
  //   const productImages = products[productIndex].images.map(img => img.url);
  //   setCurrentProductImages(productImages);
  //   setCurrentProductImageIndex(imageIndex);
  //   setProductLightboxOpen(true);
  // };

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

  // Función para generar enlaces de calendario
  const generateCalendarLinks = (event: {
    title: string;
    date: string; // Formato: "2025-11-27"
    startTime?: string; // Formato: "18:00"
    endTime?: string; // Formato: "21:00"
    description?: string;
    location?: string;
  }) => {
    const { title, date, startTime = "09:00", endTime = "18:00", description = "", location = "" } = event;
    
    // Formato ISO para calendarios
    const startDateTime = `${date.replace(/-/g, '')}T${startTime.replace(/:/g, '')}00`;
    const endDateTime = `${date.replace(/-/g, '')}T${endTime.replace(/:/g, '')}00`;
    
    // Google Calendar
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    
    // Apple Calendar (iCal)
    const icsContent = `BEGIN:VCALENDAR
  VERSION:2.0
  BEGIN:VEVENT
  SUMMARY:${title}
  DTSTART:${startDateTime}
  DTEND:${endDateTime}
  DESCRIPTION:${description}
  LOCATION:${location}
  END:VEVENT
  END:VCALENDAR`;
    
    const icsUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
    
    // Outlook
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${date}T${startTime}&enddt=${date}T${endTime}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    
    return { googleUrl, icsUrl, outlookUrl };
  };


  return (
    <div className="bg-zinc-950 text-white min-h-screen">

      {/* Header / Navigation */}
      <HeaderSection />

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
              Somos ese club que nació sudados, hambrientos y doloridos… y que terminó fundándose en un antro cualquiera después de una ruta. Nada épico, nada místico. Solo montaña, cerveza caliente y la brillante idea de crear un club del que ni nosotros mismos nos fiaríamos demasiado.
            </p>
             <p className="text-lg md:text-xl text-zinc-100 leading-relaxed mb-8">
              Si buscas postureo… sí, también hay. Y si buscas éxito deportivo, gloria o disciplina militar, este no es tu sitio. <br></br>Aquí venimos a explorar, a ensuciarnos, a perdernos un poco y a juntarnos con gente que está igual de tocada por la montaña que tú.
            </p>
             <p className="text-lg md:text-xl text-zinc-100 leading-relaxed mb-8">
              Bienvenido a Proyecto Cumbre: un social club de montaña impresentable, pero auténtico.
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
      <section id="quienes-somos" className="py-16 md:py-24 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Quiénes somos</h2>
          <div className="w-20 h-1 bg-orange-500 mb-8 md:mb-12"></div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16 md:items-start">
            {/* Texto */}
            <div className="space-y-6 ">
               <p className="text-base md:text-lg text-zinc-300 leading-relaxed">
                Proyecto Cumbre nació como nacen las mejores (y peores) ideas: reventados, oliendo a cabra y sentados en un bar cutre después de una ruta demasiado larga. Entre sudor, barro y promesas que no deberíamos haber hecho, decidimos montar un club de montaña. No porque el mundo lo pidiera, sino porque nosotros sí.              </p>
              <p className="text-base md:text-lg text-zinc-300 leading-relaxed">
              Somos un grupo que no comparte cordura, pero sí un lugar común: el campo. Y desde aquel día se ha sumado más gente como nosotros: amantes del desnivel y ciudadanos medianamente funcionales de lunes a viernes.              </p>
              <p className="text-base md:text-lg text-zinc-300 leading-relaxed">
              No vendemos un estilo de vida perfecto. Aquí hay postureo, fotos mal hechas, rutas que se nos van de las manos, grupos de WhatsApp imposibles de controlar, y una disciplina bastante cuestionable.              </p>
              <p className="text-base md:text-lg text-zinc-300 leading-relaxed">
                Pero también hay algo serio: la comunidad.
                Una comunidad que sale al monte para respirar, desconectar, buscar terreno nuevo y pasar más horas afuera que frente a una pantalla. Gente que sabe que explorar es mejor que competir y que la montaña enseña más que cualquier documental de la 2.
              </p>
              <p className="text-base md:text-lg text-zinc-300 leading-relaxed">
               No prometemos medallas ni transformaciones mágicas. Prometemos esto:
              </p>
              <ul className="text-base md:text-lg text-zinc-300 leading-relaxed list-disc list-inside mt-2">
                <li>Aventuras reales</li>
                <li>Terreno de verdad</li>
                <li>Gente auténtica</li>
                <li>Muchas decisiones dudosas</li>
                <li>Y una comunidad que, pese a todo… funciona.</li>
              </ul>
              <p className="text-base md:text-lg text-zinc-300 leading-relaxed">
Proyecto Cumbre: el club que no debería existir, pero existe. Y cada día somos más.              </p>
            </div>

            {/* Carrusel reutilizable */}
            <Carousel 
              items={teamMembers}
              autoPlayInterval={3000}
              height="h-[400px] md:h-[650px]"
              showControls={true}
              showDots={true}
              showCounter={true}
            />
          </div>
        </div>
      </section>

      {/* Section - Hazte Socio */}
      <section id="hazte-socio" className="py-16 md:py-24 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
        {/* Efecto de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-orange-500/20 text-orange-400 text-sm font-bold rounded-full border border-orange-500/30">
                🎉 NUEVA TEMPORADA 2026
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Hazte Socio de Proyecto Cumbre
            </h2>
            <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
              Casi un año haciendo <strong className="text-orange-400">los perlas por el monte</strong>. 
              Para 2026 ya podéis apuntaros y federaros en montaña con el club que de verdad os entiende.
            </p>
            <div className="mt-4 space-y-2 flex flex-col items-center text-center">
              <p className="text-zinc-400 text-sm md:text-base">
                <strong className="text-white">Inscripciones abiertas desde diciembre.</strong>
              </p>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>
                </svg>
                <p className="text-orange-400 font-bold text-sm md:text-base">
                  Compra Proyecto Cumbre, compra monte.
                </p>
              </div>
            </div>

          </div>

          {/* Grid de opciones - CON ALTURA IGUAL */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto mb-12">
            
            {/* Plan Socio + Federado */}
            <div className="relative group">
              {/* Badge recomendado */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full shadow-lg">
                  ⭐ MÁS COMPLETO
                </span>
              </div>

              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 border-2 border-orange-500 hover:border-orange-400 transition-all shadow-2xl hover:shadow-orange-500/20 h-full flex flex-col">
                {/* Header del plan */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Socio + Federado FEDME
                  </h3>
                  <p className="text-zinc-400 text-sm mb-6">
                    Pack completo con licencia federativa
                  </p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl md:text-6xl font-bold text-orange-400">50€</span>
                    <span className="text-zinc-400 text-lg">/año</span>
                  </div>
                  <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-sm text-blue-400 font-medium flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          + Licencia FEDME (precio variable según modalidad)
        </p>
      </div>
                </div>

                {/* Beneficios - flex-1 para empujar el botón abajo */}
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Licencia Federativa FEDME</p>
                      <p className="text-zinc-400 text-xs">Seguro de accidentes en montaña + cobertura rescate</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Pack de Bienvenida Premium</p>
                      <p className="text-zinc-400 text-xs">Camiseta técnica + gorra oficial del club</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Prioridad en Eventos</p>
                      <p className="text-zinc-400 text-xs">Inscripción preferente en todas las aventuras</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Descuentos Exclusivos</p>
                      <p className="text-zinc-400 text-xs">10-20% en merchandise y eventos especiales</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Comunidad Exclusiva</p>
                      <p className="text-zinc-400 text-xs">Grupo privado de WhatsApp con planificación anticipada</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Formación Técnica</p>
                      <p className="text-zinc-400 text-xs">Talleres y entrenamientos exclusivos para socios</p>
                    </div>
                  </div>
                </div>

                {/* CTA - Siempre al fondo con mt-auto */}
                <Link
                href="/membership"
                className="w-full block text-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-orange-500/50 hover:scale-105 transform mt-auto"
                >
                  Quiero ser socio + federado
                </Link>
              </div>
            </div>

            {/* Plan Solo Socio - CON RESTRICCIÓN Y ALTURA IGUAL */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 border border-zinc-700 hover:border-zinc-600 transition-all shadow-xl h-full flex flex-col">
                {/* Header del plan */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Solo Socio
                  </h3>
                  <p className="text-zinc-400 text-sm mb-6">
                    Sin licencia federativa
                  </p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl md:text-6xl font-bold text-white">50€</span>
                    <span className="text-zinc-400 text-lg">/año</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">Cuota única anual</p>
                </div>

                {/* ⚠️ ADVERTENCIA IMPORTANTE */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-yellow-400 font-bold text-xs mb-1">⚠️ Restricción importante</p>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        Algunas actividades del club requieren seguro de montaña obligatorio (alta montaña, vivacs, rutas técnicas). 
                        Sin licencia FEDME, deberás contratar tu propio seguro para participar en estas aventuras.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Beneficios - flex-1 para empujar el botón abajo */}
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Pack de Bienvenida</p>
                      <p className="text-zinc-400 text-xs">Camiseta técnica + gorra oficial del club</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Prioridad en Eventos*</p>
                      <p className="text-zinc-400 text-xs">Inscripción preferente (si cumples requisitos de seguro)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Descuentos</p>
                      <p className="text-zinc-400 text-xs">10% en merchandise del club</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Comunidad</p>
                      <p className="text-zinc-400 text-xs">Acceso al grupo privado de WhatsApp</p>
                    </div>
                  </div>

                  {/* NO INCLUYE */}
                  <div className="pt-4 border-t border-zinc-800">
                    <p className="text-zinc-500 text-xs font-semibold mb-3">❌ No incluye:</p>
                    
                    <div className="flex items-start gap-3 opacity-50 mb-2">
                      <div className="flex-shrink-0 w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-zinc-500 font-semibold text-sm">Licencia Federativa</p>
                        <p className="text-zinc-600 text-xs">Deberás gestionarla por tu cuenta</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 opacity-50">
                      <div className="flex-shrink-0 w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-zinc-500 font-semibold text-sm">Seguro FEDME</p>
                        <p className="text-zinc-600 text-xs">Seguro propio obligatorio para actividades técnicas</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA + Nota - Siempre al fondo con mt-auto */}
                <div className="mt-auto">
                   <Link
                      href="/membership"
                      className="block w-full text-center bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-all border border-zinc-700 hover:border-zinc-600 mb-3"
                    >
                      Quiero ser solo socio
                    </Link>
                  <p className="text-xs text-zinc-500 text-center">
                    *Acceso limitado a algunas actividades técnicas sin seguro propio
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info adicional */}
          <div className="max-w-4xl mx-auto">
            {/* Licencia FEDME explicada */}
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-zinc-800 mb-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">¿Qué es la Licencia FEDME?</h4>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                    La <strong className="text-blue-400">Federación Española de Deportes de Montaña y Escalada (FEDME)</strong> te proporciona 
                    un seguro de accidentes deportivos, cobertura de rescate en montaña y acceso a refugios federados con descuentos.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Seguro de accidentes en montaña</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Cobertura de rescate (helicóptero)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Descuentos en refugios federados</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Participación en competiciones oficiales</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                <p className="text-xs text-blue-300">
                  <strong>💡 Modalidades disponibles:</strong> Montañismo, Escalada, Senderismo, Trail Running, Esquí de Montaña. 
                  El precio varía según la modalidad elegida (desde 30€ hasta 60€ aproximadamente).
                </p>
              </div>
            </div>

            {/* CTA final grande */}
            <div className="bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent rounded-xl p-8 border border-orange-500/30 text-center">
              <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">
                ¿Listo para la temporada 2026?
              </h4>
              <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
                Únete a la familia Proyecto Cumbre y vive las mejores aventuras con gente que comparte tu pasión por la montaña.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="https://chat.whatsapp.com/EHmIEAcK7EBFP3UgntDdX9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/50"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Únete al grupo de WhatsApp
                </a>
                <span className="text-zinc-500 text-sm">
                  Ahí contamos todo lo que preparamos para 2026
                </span>
              </div>
            </div>

            {/* Timeline de inscripción */}
            <div className="mt-8 flex items-center justify-center gap-4 flex-wrap text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-zinc-400">
                  <strong className="text-white">Inscripciones abiertas</strong> desde diciembre 2025
                </span>
              </div>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-zinc-400">
                  Temporada 2026 empieza en <strong className="text-white">enero</strong>
                </span>
              </div>
            </div>
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
                        src={`/aventuras/sierra-nevada/${foto}`}
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
                  imageSrc={`/aventuras/sierra-nevada/${sierraGallery[sierraImageIndex]}`}
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
      <EventsSection/>

      {/* Section 5 - Merchant MEJORADA */}
      <MerchantSection />

      {/* Section 6 - Contacto */}
      <section id="contact" className="py-16 md:py-24 bg-zinc-900/50 relative overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Contáctanos</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              ¿Tienes alguna pregunta? ¿Quieres unirte al club? ¿Necesitas más información sobre nuestras aventuras?
              <br/>Escríbenos y te responderemos lo antes posible.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            
            {/* Columna izquierda - Info de contacto */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 border border-zinc-800">
                <h3 className="text-xl font-bold text-white mb-6">Información de contacto</h3>
                
                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-500/30">
                      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-zinc-400 text-sm mb-1">Email</p>
                      <a href="mailto:info@proyecto-cumbre.es" className="text-white hover:text-orange-400 transition font-semibold">
                        info@proyecto-cumbre.es
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                      <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-zinc-400 text-sm mb-1">WhatsApp</p>
                      <a 
                        href="https://chat.whatsapp.com/EHmIEAcK7EBFP3UgntDdX9" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white hover:text-green-400 transition font-semibold"
                      >
                        Únete al grupo
                      </a>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-tr from-yellow-500/20 via-pink-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-pink-500/30">
                      <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-zinc-400 text-sm mb-1">Instagram</p>
                      <a 
                        href="https://www.instagram.com/proyecto.cumbre" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white hover:text-pink-400 transition font-semibold"
                      >
                        @proyecto.cumbre
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horario de respuesta */}
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-orange-400 font-bold text-sm mb-1">Tiempo de respuesta</p>
                    <p className="text-orange-200/80 text-xs">
                      Normalmente respondemos en menos de 24 horas. Si es urgente, contacta por WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Formulario */}
            <ContactForm />
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
      {/* Footer REDISEÑADO */}
<footer className="relative bg-black border-t border-zinc-800 overflow-hidden">
  {/* Efectos de fondo decorativos */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
  </div>

  <div className="container mx-auto px-4 relative z-10">
    {/* Sección principal del footer */}
    <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
      
      {/* Columna 1: Branding + Descripción */}
      <div className="lg:col-span-1">
        <div className="mb-6">
          <h3 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            PROYECTO<br/>CUMBRE
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Club de montaña para los que prefieren el barro antes que el sofá.
          </p>
        </div>

        {/* Ubicación y contacto básico */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-zinc-400">Andalucía, España</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <a href="mailto:info@proyecto-cumbre.es" className="text-zinc-400 hover:text-orange-400 transition">
              info@proyecto-cumbre.es
            </a>
          </div>
        </div>
      </div>

      {/* Columna 2: Enlaces rápidos */}
      <div>
        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
          <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
          Enlaces rápidos
        </h4>
        <ul className="space-y-3">
          <li>
            <a href="#inicio" className="text-zinc-400 hover:text-orange-400 transition flex items-center gap-2 group">
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Inicio
            </a>
          </li>
          <li>
            <a href="#quienes-somos" className="text-zinc-400 hover:text-orange-400 transition flex items-center gap-2 group">
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Quiénes somos
            </a>
          </li>
          <li>
            <a href="#aventuras" className="text-zinc-400 hover:text-orange-400 transition flex items-center gap-2 group">
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Aventuras
            </a>
          </li>
          <li>
            <a href="#events" className="text-zinc-400 hover:text-orange-400 transition flex items-center gap-2 group">
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Eventos
            </a>
          </li>
          <li>
            <a href="#merchant" className="text-zinc-400 hover:text-orange-400 transition flex items-center gap-2 group">
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Merch
            </a>
          </li>
          <li>
            <a href="#contacto" className="text-zinc-400 hover:text-orange-400 transition flex items-center gap-2 group">
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Contacto
            </a>
          </li>
        </ul>
      </div>

      {/* Columna 3: Información */}
      <div>
        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
          <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
          Información
        </h4>
        <ul className="space-y-3">
          <li>
            <a href="/membership" className="text-zinc-400 hover:text-orange-400 transition flex items-center gap-2 group">
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Hazte socio
            </a>
          </li>
          <li>
            <a href="#" className="text-zinc-400 hover:text-orange-400 transition flex items-center gap-2 group">
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Preguntas frecuentes
            </a>
          </li>
          <li>
            <a href="#" className="text-zinc-400 hover:text-orange-400 transition flex items-center gap-2 group">
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Aviso legal
            </a>
          </li>
          <li>
            <a href="#" className="text-zinc-400 hover:text-orange-400 transition flex items-center gap-2 group">
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Política de privacidad
            </a>
          </li>
          <li>
            <a href="#" className="text-zinc-400 hover:text-orange-400 transition flex items-center gap-2 group">
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Política de cookies
            </a>
          </li>
        </ul>
      </div>

      {/* Columna 4: Redes Sociales Mejoradas */}
      <div>
        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
          <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
          Síguenos
        </h4>
        <div className="space-y-3">
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/proyecto.cumbre"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-zinc-900/50 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 border border-zinc-800 hover:border-pink-500/50 rounded-xl transition-all group"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">Instagram</p>
              <p className="text-zinc-500 text-xs truncate">@proyecto.cumbre</p>
            </div>
            <svg className="w-5 h-5 text-zinc-600 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* WhatsApp */}
          <a 
            href="https://chat.whatsapp.com/EHmIEAcK7EBFP3UgntDdX9"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-zinc-900/50 hover:bg-green-600/20 border border-zinc-800 hover:border-green-500/50 rounded-xl transition-all group"
          >
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">WhatsApp</p>
              <p className="text-zinc-500 text-xs truncate">Únete al grupo</p>
            </div>
            <svg className="w-5 h-5 text-zinc-600 group-hover:text-green-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* TikTok */}
          <a 
            href="https://www.tiktok.com/@proyecto.cumbre"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all group"
          >
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" fill="#EE1D52"/>
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" fill="#69C9D0"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">TikTok</p>
              <p className="text-zinc-500 text-xs truncate">@proyecto.cumbre</p>
            </div>
            <svg className="w-5 h-5 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>

    {/* Separador con efecto */}
    <div className="relative py-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="px-4 bg-black text-zinc-600">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>
          </svg>
        </span>
      </div>
    </div>

    {/* Bottom bar mejorado */}
    <div className="pb-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-zinc-500 text-sm text-center md:text-left">
        © 2025 <span className="text-orange-400 font-semibold">Proyecto Cumbre</span>. Todos los derechos reservados.
      </p>
      <div className="flex items-center gap-1">
        <span className="text-zinc-600 text-xs">Hecho con</span>
        <svg className="w-4 h-4 text-orange-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span className="text-zinc-600 text-xs">en Andalucía</span>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}