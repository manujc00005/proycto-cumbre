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
}

// Re-exportar tipos para conveniencia
export type { EventColor, IconType, EventStatus };