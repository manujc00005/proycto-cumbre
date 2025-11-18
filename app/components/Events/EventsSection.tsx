import { useState } from 'react';
import EventCard from './EventCard';
import { eventsData } from './EventsData';
import { Event } from '../types';
import { getEventStatus } from './Eventutils';

const EventsSection = () => {
  const events = eventsData.events as Event[];
  
  // Estado para controlar cuántos eventos pasados mostrar
  const [visiblePastEvents, setVisiblePastEvents] = useState(3);
  
  // Filtrar eventos dinámicamente basado en la fecha actual
  const upcomingEvents = events.filter(e => {
    const status = getEventStatus(e);
    return status === 'upcoming' || status === 'cancelled';
  });
  
  const pastEvents = events.filter(e => {
    const status = getEventStatus(e);
    return status === 'completed';
  });
  
  // Eventos pasados a mostrar (limitados por el estado)
  const displayedPastEvents = pastEvents.slice(0, visiblePastEvents);
  const hasMorePastEvents = visiblePastEvents < pastEvents.length;
  
  // Función para cargar más eventos
  const loadMorePastEvents = () => {
    setVisiblePastEvents(prev => prev + 3);
  };

  return (
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
            
            {/* Eventos próximos y suspendidos */}
            {upcomingEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                dropdownId={event.calendar ? `calendar-dropdown-${event.id}` : undefined}
              />
            ))}

            {/* Separador */}
            {pastEvents.length > 0 && (
              <div className="relative pl-20 py-4">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-zinc-600 border-4 border-zinc-900"></div>
                <div className="text-zinc-500 text-sm font-semibold">━━━ Eventos pasados ━━━</div>
              </div>
            )}

            {/* Eventos pasados (limitados) */}
            {displayedPastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}

            {/* Botón para cargar más eventos pasados */}
            {hasMorePastEvents && (
              <div className="relative pl-20 py-6">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-zinc-700 border-4 border-zinc-900 animate-pulse"></div>
                
                <button
                  onClick={loadMorePastEvents}
                  className="group w-full bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 hover:from-zinc-800 hover:to-zinc-900 p-4 rounded-xl border border-zinc-700 hover:border-zinc-600 transition-all shadow-lg hover:shadow-zinc-700/20"
                >
                  <div className="flex items-center justify-center gap-3">
                    <svg 
                      className="w-5 h-5 text-zinc-400 group-hover:text-orange-400 transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="text-zinc-400 group-hover:text-white font-semibold transition-colors">
                      Ver más eventos pasados
                    </span>
                    <span className="px-2 py-1 bg-zinc-700 group-hover:bg-orange-500/20 text-zinc-400 group-hover:text-orange-400 text-xs rounded-full transition-colors">
                      +{pastEvents.length - visiblePastEvents}
                    </span>
                  </div>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
