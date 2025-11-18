export interface EventTag {
  label: string;
  color: 'orange' | 'blue' | 'cyan' | 'yellow' | 'red' | 'green' | 'purple' | 'pink';
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
  date: string; // Formato: "DD Mes YYYY" ejemplo: "27 Noviembre 2025"
  title: string;
  description?: string;
  cancelled?: boolean; // Si está cancelado
  cancelReason?: string;
  icon?: 'runner' | 'mountain';
  iconColor?: 'orange' | 'blue' | 'cyan' | 'yellow' | 'red' | 'green' | 'purple' | 'pink';
  tags?: EventTag[];
  calendar?: CalendarEvent;
}

export type EventStatus = 'upcoming' | 'cancelled' | 'completed';