// EventCard.tsx - Con CTA genérico y feature flag

import { AddToCalendar } from './AddToCalendar';
import EventIcon from './EventIcon';
import { Event } from '../types';
import { getEventStatus, shouldShowEventDetails } from './Eventutils';
import EventTag from './EventTag';
import { generateCalendarData } from '@/lib/calendar-utils';
import Link from 'next/link';
import { EventStatus } from '@/lib/events-constants';

interface EventCardProps {
  event: Event;
  dropdownId?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, dropdownId }) => {
  const status = getEventStatus(event);
  const showDetails = shouldShowEventDetails(event);
  const calendarData = generateCalendarData(event);

  const getStatusConfig = (status: EventStatus) => {
    switch (status) {
      case 'upcoming':
        return {
          dotColor: 'bg-orange-500',
          dotShadow: 'shadow-orange-500/50',
          borderColor: 'border-orange-500/30 hover:border-orange-500',
          cardShadow: 'hover:shadow-orange-500/20',
          badge: { text: 'PRÓXIMO', bgColor: 'bg-orange-500', textColor: 'text-white' },
          dateColor: 'text-orange-400',
          titleColor: 'text-white',
          opacity: 'opacity-100'
        };
      case 'cancelled':
        return {
          dotColor: 'bg-red-500',
          dotShadow: 'shadow-red-500/50',
          borderColor: 'border-red-500/30 hover:border-red-500',
          cardShadow: 'hover:shadow-red-500/20',
          badge: { text: 'SUSPENDIDO', bgColor: 'bg-red-500', textColor: 'text-white' },
          dateColor: 'text-red-400',
          titleColor: 'text-white',
          opacity: 'opacity-100'
        };
      case 'completed':
        return {
          dotColor: 'bg-zinc-600',
          dotShadow: '',
          borderColor: 'border-zinc-700',
          cardShadow: '',
          badge: { text: 'COMPLETADO', bgColor: 'bg-zinc-700', textColor: 'text-zinc-300' },
          dateColor: 'text-zinc-500',
          titleColor: 'text-zinc-300',
          opacity: 'opacity-60 hover:opacity-100'
        };
    }
  };

  // ========================================
  // ✅ FUNCIÓN PARA ESTILOS DE CTA
  // ========================================
  const getCTAStyles = (style: 'primary' | 'ritual' | 'exclusive' = 'primary', enabled: boolean) => {
    if (!enabled) {
      return {
        bg: 'bg-zinc-700 cursor-not-allowed',
        hover: '',
        text: 'text-zinc-400',
        shadow: ''
      };
    }

    switch (style) {
      case 'ritual':
        return {
          bg: 'bg-white hover:bg-white/90',
          hover: 'hover:scale-105',
          text: 'text-black',
          shadow: 'hover:shadow-2xl hover:shadow-white/20'
        };
      case 'exclusive':
        return {
          bg: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
          hover: 'hover:scale-105',
          text: 'text-white',
          shadow: 'hover:shadow-2xl hover:shadow-purple-500/30'
        };
      case 'primary':
      default:
        return {
          bg: 'bg-orange-500 hover:bg-orange-600',
          hover: 'hover:scale-105',
          text: 'text-white',
          shadow: 'hover:shadow-lg hover:shadow-orange-500/30'
        };
    }
  };

  const config = getStatusConfig(status);
  const isCompleted = status === 'completed';
  const cardBgClass = isCompleted ? 'bg-zinc-900/50' : 'bg-gradient-to-br from-zinc-900 to-zinc-950';

  // ========================================
  // ✅ RENDERIZAR CTA (SI EXISTE)
  // ========================================
  const renderCTA = () => {
    if (!event.cta || !showDetails) return null;

    const ctaStyles = getCTAStyles(event.cta.style, event.cta.enabled);
    const isDisabled = !event.cta.enabled;
    const buttonText = isDisabled ? event.cta.disabledText : event.cta.text;

    // Si está deshabilitado, solo renderizar el texto
    if (isDisabled) {
      return (
        <div className={`flex items-center justify-center gap-2 ${ctaStyles.bg} px-6 py-3 rounded-lg transition-all`}>
          <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className={`${ctaStyles.text} font-bold text-sm tracking-wider uppercase`}>
            {buttonText}
          </span>
        </div>
      );
    }

    // CTA habilitado con link
    return (
      <Link 
        href={event.cta.link}
        className={`group relative ${ctaStyles.bg} ${ctaStyles.hover} ${ctaStyles.shadow} px-6 py-3 rounded-lg transition-all overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
        <span className={`relative z-10 flex items-center justify-center gap-2 ${ctaStyles.text} font-bold text-sm tracking-wider uppercase`}>
          {buttonText}
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </Link>
    );
  };

  return (
    <div className={`relative pl-20 group ${config.opacity} transition-opacity`}>
      <div className={`absolute left-6 top-6 w-5 h-5 rounded-full ${config.dotColor} border-4 border-zinc-900 group-hover:scale-125 transition-transform shadow-lg ${config.dotShadow}`}></div>
      
      <div className={`${cardBgClass} p-6 rounded-xl border ${config.borderColor} transition-all shadow-lg ${config.cardShadow}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className={`px-3 py-1 ${config.badge.bgColor} ${config.badge.textColor} text-xs font-bold rounded-full`}>
                {config.badge.text}
              </span>
              <span className={`${config.dateColor} font-semibold text-sm`}>{event.date}</span>
            </div>
            <h4 className={`${isCompleted ? 'text-lg' : 'text-xl'} font-bold ${config.titleColor} mb-2`}>
              {event.title}
            </h4>
            {showDetails && event.cancelReason && (
              <p className="text-red-400 font-semibold text-sm mb-1">{event.cancelReason}</p>
            )}
            {event.description && (
              <p className="text-zinc-400 text-sm">{event.description}</p>
            )}
          </div>
          {showDetails && event.icon && event.iconColor && (
            <EventIcon type={event.icon} color={event.iconColor} />
          )}
        </div>
        
        {/* ========================================
            ✅ FOOTER CON TAGS, CTA Y CALENDAR
            ======================================== */}
        {showDetails && (event.tags || event.cta || status === 'upcoming') && (
          <div className="flex flex-col gap-4 mt-4">
            {/* Tags */}
            {event.tags && (
              <div className="flex gap-2 flex-wrap">
                {event.tags.map((tag, index) => (
                  <EventTag key={index} label={tag.label} color={tag.color} />
                ))}
              </div>
            )}

            {/* ✅ CTA + Calendar (lado a lado) */}
            <div className="flex items-center justify-between gap-4">
              {/* CTA */}
              {renderCTA()}

              {/* Calendar (solo si NO hay CTA o si CTA está a la izquierda) */}
              {status === 'upcoming' && dropdownId && (
                <AddToCalendar 
                  event={calendarData}
                  dropdownId={dropdownId}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
