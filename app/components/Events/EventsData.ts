import { Event } from '../types';

export const eventsData: { events: Event[] } = {
  events: [
    {
      id: 1,
      date: '27 Noviembre 2025',
      title: 'TRAIL & TRANCA',
      description: 'Salida/llega bar la tranca. 8Kms aprox 300+',
      icon: 'runner',
      iconColor: 'orange',
      tags: [
        { label: 'noche', color: 'orange' },
        { label: 'asfalto', color: 'blue' }
      ],
      calendar: {
        title: 'TRAIL & TRANCA - Proyecto Cumbre',
        startDate: '20251127T180000',
        endDate: '20251127T210000',
        description: 'Salida/llega bar la tranca. 8Kms aprox 300+',
        location: 'Bar La Tranca'
      }
    },
    {
      id: 2,
      date: '15 Noviembre 2025',
      title: 'CIRCULAR PICO DEL CIELO',
      description: 'Ruta de trail/senderismo por la Sierra de la Almijara',
      cancelled: true,
      cancelReason: 'Alerta Naranja por temporal',
      icon: 'mountain',
      iconColor: 'red',
      tags: [
        { label: 'mañana', color: 'blue' },
        { label: 'trail', color: 'cyan' },
        { label: 'senderismo', color: 'yellow' }
      ]
    },
    {
      id: 3,
      date: '06 Noviembre 2025',
      title: 'UP&DOWN SOCIAL RUN'
    },
    {
      id: 4,
      date: '20 Octubre 2025',
      title: 'La MILLA (SOCIAL) CHALLENGE'
    },
  ]
};




