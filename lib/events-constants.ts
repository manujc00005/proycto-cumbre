// lib/events-constants.ts

// ============================================
// TIPOS Y CONSTANTES CENTRALIZADAS DE EVENTOS
// ============================================

/**
 * Colores disponibles para iconos y tags
 */
export const EVENT_COLORS = [
  'orange',
  'red',
  'blue',
  'cyan',
  'yellow',
  'green',
  'purple',
  'pink'
] as const;

export type EventColor = typeof EVENT_COLORS[number];

/**
 * Tipos de iconos disponibles
 */
export const ICON_TYPES = [
  'runner',
  'mountain',
  'calendar',
  'climbing',      // 🧗 Escalada
  'bike',          // 🚴 Bicicleta
  'volleyball',    // 🏐 Voley
  'beer',          // 🍺 Birras/Social
  'beach',         // 🏖️ Playa
  'weights',       // 🏋️ Pesas/Gym
  'hyrox',         // 💪 Hyrox/Funcional
  'swimming',      // 🏊 Natación
  'hiking',        // 🥾 Senderismo
  'yoga',          // 🧘 Yoga/Estiramientos
  'soccer',        // ⚽ Fútbol
  'paddle',        // 🎾 Pádel
  'crossfit',      // 🏋️‍♀️ CrossFit
] as const;

export type IconType = typeof ICON_TYPES[number];

/**
 * Estados posibles de un evento
 */
export const EVENT_STATUSES = [
  'upcoming',
  'cancelled',
  'completed'
] as const;

export type EventStatus = typeof EVENT_STATUSES[number];

/**
 * Mapeo de colores para iconos (text-{color}-400)
 */
export const ICON_COLOR_CLASSES: Record<EventColor, string> = {
  orange: 'text-orange-400',
  red: 'text-red-400',
  blue: 'text-blue-400',
  cyan: 'text-cyan-400',
  yellow: 'text-yellow-400',
  green: 'text-green-400',
  purple: 'text-purple-400',
  pink: 'text-pink-400',
};

/**
 * Mapeo de colores para tags (bg-{color}-500/20 text-{color}-400)
 */
export const TAG_COLOR_CLASSES: Record<EventColor, string> = {
  orange: 'bg-orange-500/20 text-orange-400',
  blue: 'bg-blue-500/20 text-blue-400',
  cyan: 'bg-cyan-500/20 text-cyan-400',
  yellow: 'bg-yellow-500/20 text-yellow-400',
  red: 'bg-red-500/20 text-red-400',
  green: 'bg-green-500/20 text-green-400',
  purple: 'bg-purple-500/20 text-purple-400',
  pink: 'bg-pink-500/20 text-pink-400',
};

/**
 * Mapeo de meses en español a números
 */
export const MONTH_MAP: Record<string, string> = {
  'Enero': '01',
  'Febrero': '02',
  'Marzo': '03',
  'Abril': '04',
  'Mayo': '05',
  'Junio': '06',
  'Julio': '07',
  'Agosto': '08',
  'Septiembre': '09',
  'Octubre': '10',
  'Noviembre': '11',
  'Diciembre': '12'
};

/**
 * Configuración de horarios por tipo de tag
 */
export const TIME_SLOTS = {
  noche: { start: '18', end: '21' },
  tarde: { start: '16', end: '19' },
  mañana: { start: '09', end: '13' },
  default: { start: '09', end: '13' }
} as const;