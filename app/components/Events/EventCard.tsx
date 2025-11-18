import { AddToCalendar } from './AddToCalendar';
import EventIcon from './EventIcon';
import { Event, EventStatus } from '../types';
import { getEventStatus, shouldShowEventDetails } from './Eventutils';
import EventTag from './EventTag';

interface EventCardProps {
  event: Event;
  dropdownId?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, dropdownId }) => {
  const status = getEventStatus(event);
  const showDetails = shouldShowEventDetails(event);

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

  const config = getStatusConfig(status);
  const isCompleted = status === 'completed';
  const cardBgClass = isCompleted ? 'bg-zinc-900/50' : 'bg-gradient-to-br from-zinc-900 to-zinc-950';

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
            { showDetails &&event.cancelReason && (
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
        
        {/* Tags y/o Botón de Calendario - Solo para eventos futuros */}
        {showDetails && (event.tags || event.calendar) && (
          <div className={`flex ${event.calendar ? 'justify-between' : 'gap-2'} items-center flex-wrap gap-2 mt-4`}>
            {event.tags && (
              <div className="flex gap-2 flex-wrap">
                {event.tags.map((tag, index) => (
                  <EventTag key={index} label={tag.label} color={tag.color} />
                ))}
              </div>
            )}
            
            {event.calendar && dropdownId && (
              <AddToCalendar 
                event={event.calendar}
                dropdownId={dropdownId}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
