import { Event, EventStatus } from '../types';

const monthMap: { [key: string]: number } = {
  'Enero': 0,
  'Febrero': 1,
  'Marzo': 2,
  'Abril': 3,
  'Mayo': 4,
  'Junio': 5,
  'Julio': 6,
  'Agosto': 7,
  'Septiembre': 8,
  'Octubre': 9,
  'Noviembre': 10,
  'Diciembre': 11
};

/**
 * Parsea una fecha en formato "DD Mes YYYY" a objeto Date
 * @param dateString - Fecha en formato "27 Noviembre 2025"
 * @returns Date object
 */
export const parseSpanishDate = (dateString: string): Date => {
  const parts = dateString.split(' ');
  const day = parseInt(parts[0], 10);
  const month = monthMap[parts[1]];
  const year = parseInt(parts[2], 10);
  
  return new Date(year, month, day);
};

/**
 * Calcula el status de un evento basado en su fecha
 * @param event - Evento a evaluar
 * @returns Status del evento
 */
export const getEventStatus = (event: Event): EventStatus => {
  const eventDate = parseSpanishDate(event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
  
  // Si el evento ya pasó, siempre es 'completed', incluso si estaba cancelado
  if (eventDate < today) {
    return 'completed';
  }
  
  // Si el evento es futuro y está cancelado
  if (event.cancelled) {
    return 'cancelled';
  }
  
  // Evento futuro normal
  return 'upcoming';
};

/**
 * Determina si un evento debe mostrar información detallada
 * Los eventos pasados no muestran: icon, iconColor, tags, calendar
 * @param event - Evento a evaluar
 * @returns true si debe mostrar detalles
 */
export const shouldShowEventDetails = (event: Event): boolean => {
  return getEventStatus(event) !== 'completed';
};