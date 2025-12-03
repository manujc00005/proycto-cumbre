// lib/calendar-utils.ts

import { Event } from '@/app/components/types';
import { MONTH_MAP, TIME_SLOTS } from './events-constants';

/**
 * Genera automáticamente el objeto calendar para un evento
 */
export function generateCalendarData(event: Event) {
  if (event.calendar) {
    return event.calendar;
  }

  const dateStr = event.date;
  const [day, monthStr, year] = dateStr.split(' ');
  
  const month = MONTH_MAP[monthStr];
  const dayPadded = day.padStart(2, '0');

  // 🎯 Determinar hora de inicio según las tags
  let startHour = '09';
  let endHour = '13';
  
  const hasNocheTag = event.tags?.some(tag => tag.label.toLowerCase() === 'noche');
  const hasTardeTag = event.tags?.some(tag => tag.label.toLowerCase() === 'tarde');
  const hasMañanaTag = event.tags?.some(tag => tag.label.toLowerCase() === 'mañana');

  if (hasNocheTag) {
    startHour = TIME_SLOTS.noche.start;
    endHour = TIME_SLOTS.noche.end;
  } else if (hasTardeTag) {
    startHour = TIME_SLOTS.tarde.start;
    endHour = TIME_SLOTS.tarde.end;
  } else if (hasMañanaTag) {
    startHour = TIME_SLOTS.mañana.start;
    endHour = TIME_SLOTS.mañana.end;
  }

  const startDate = `${year}${month}${dayPadded}T${startHour}0000`;
  const endDate = `${year}${month}${dayPadded}T${endHour}0000`;

  const title = `${event.title} - Proyecto Cumbre`;
  const description = event.description || `Evento del club de montaña: ${event.title}`;

  let location = event.location || 'Málaga, España';
  
  if (!event.location && event.description) {
    const lowerDesc = event.description.toLowerCase();
    if (lowerDesc.includes('tranca')) {
      location = 'Bar La Tranca, Málaga';
    } else if (lowerDesc.includes('monte tortuga')) {
      location = 'Monte Tortuga, Málaga';
    } else if (lowerDesc.includes('pico del cielo')) {
      location = 'Pico del Cielo, Sierra de la Almijara';
    } else if (lowerDesc.includes('sierra')) {
      location = 'Sierra de Málaga';
    }
  }

  return {
    title,
    startDate,
    endDate,
    description,
    location
  };
}