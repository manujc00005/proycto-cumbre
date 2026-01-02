// app/components/types.ts

import { EventColor, IconType, EventStatus } from '@/lib/events-constants';

export interface EventTag {
  label: string;
  color: EventColor;
}

export interface CalendarEvent {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}

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
  location?: string;
  icon?: IconType;
  iconColor?: EventColor;
  tags?: EventTag[];
  cancelled?: boolean;
  cancelReason?: string;
  calendar?: CalendarEvent;
  cta?: EventCTA;
}
