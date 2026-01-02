// types.ts actualizados

export type EventStatus = 'upcoming' | 'cancelled' | 'completed';
export type EventColor = 'orange' | 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'cyan';
export type IconType = 'runner' | 'mountain' | 'calendar' | 'climbing' | 'bike' | 'volleyball' | 'beer' | 'beach' | 'weights' | 'hyrox' | 'swimming' | 'hiking' | 'yoga' | 'soccer' | 'paddle' | 'crossfit';

export interface EventTag {
  label: string;
  color: EventColor;
}

// ✅ NUEVO: Config para CTA personalizado
export interface EventCTA {
  text: string;           // Texto del botón
  link: string;           // URL destino
  style?: 'primary' | 'ritual' | 'exclusive'; // Estilo visual
  enabled: boolean;       // Feature flag
  disabledText?: string;  // Texto cuando está deshabilitado
}

export interface Event {
  id: number;
  date: string;
  title: string;
  description?: string;
  cancelled?: boolean;
  cancelReason?: string;
  icon?: IconType;
  iconColor?: EventColor;
  tags?: EventTag[];
  // ✅ NUEVO: CTA opcional
  cta?: EventCTA;
}
