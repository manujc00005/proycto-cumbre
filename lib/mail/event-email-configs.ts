// ========================================
// EVENT EMAIL CONFIGS - PRO MINIMAL
// 💎 Lenguaje firme pero profesional
// ⚠️ WhatsApp obligatorio pero elegante
// ♻️ Reutilizable para todos los eventos
// lib/email/event-email-configs.ts
// ========================================

import { EventEmailConfig } from './types';

type EventConfigBuilder = (data: {
  shirtSize?: string;
  eventDate?: Date;
  [key: string]: any;
}) => EventEmailConfig;

export const EVENT_EMAIL_CONFIGS: Record<string, EventConfigBuilder> = {
  
  // ========================================
  // MISA - PRO MINIMAL
  // ========================================
  'misa': (data) => ({
    eventName: 'MISA™',
    eventDate: new Date('2026-01-23T19:30:00'),
    eventLocation: 'Ubicación secreta',
    heroColor: '#f97316',
    
    eventDetails: {
      meetingPoint: 'Grupo de WhatsApp',
      duration: 'Trail nocturno',
      difficulty: 'Media',
      requiredEquipment: 'Frontal, hidratación, ropa deportiva negra',
      startTime: '19:30',
      endTime: '23:00',
    },
    
    // ✅ WHATSAPP - FIRME PERO PROFESIONAL
    whatsappLink: process.env.MISA_WHATSAPP_GROUP || 'https://chat.whatsapp.com/grupo-misa',
    whatsappMessage: 'Toda la comunicación logística del evento (coordenadas, avisos y cambios) se realizará exclusivamente a través del grupo de WhatsApp.',
    
    // ✅ FEATURES LIMPIOS
    features: [
      {
        icon: '🔒',
        title: 'Acceso exclusivo',
        description: 'Evento privado con plazas limitadas'
      },
      {
        icon: '👕',
        title: 'Camiseta edición limitada',
        description: data.shirtSize ? `Talla ${data.shirtSize}` : 'Diseño exclusivo'
      },
      {
        icon: '📲',
        title: 'Track en vivo',
        description: 'GPX compartido 1h antes del inicio'
      },
      {
        icon: '🍻',
        title: 'Post privado',
        description: 'Celebración tras completar el ritual'
      }
    ],
    
    // ✅ NOTA IMPORTANTE - SIN MAYÚSCULAS NI AMENAZAS
    importantNote: {
      icon: '⚠️',
      title: 'Importante',
      message: 'Las coordenadas se revelan únicamente en WhatsApp 2h antes del evento (23 enero, 17:00h). Mantén activas las notificaciones del grupo para no perderte ninguna información.'
    }
  }),

  // ========================================
  // TRAIL NOCTURNO
  // ========================================
  'trail-nocturno': (data) => ({
    eventName: 'Trail Running Nocturno',
    eventDate: data.eventDate,
    eventLocation: 'Sierra de las Nieves',
    heroColor: '#10b981',
    
    eventDetails: {
      meetingPoint: 'Parking refugio El Guarda',
      duration: '3-4 horas',
      difficulty: 'Media-Alta',
      requiredEquipment: 'Frontal potente, bastones, hidratación mínima 1L',
      startTime: '21:00',
      endTime: '01:00',
    },
    
    whatsappLink: process.env.TRAIL_WHATSAPP_GROUP,
    whatsappMessage: 'Información sobre track GPX, avituallamientos y avisos de última hora a través del grupo de WhatsApp.',
    
    features: [
      {
        icon: '💡',
        title: 'Frontal LED incluido',
        description: 'Equipamiento técnico de última generación'
      },
      {
        icon: '🥤',
        title: 'Avituallamientos cada 5km',
        description: 'Bebidas isotónicas y geles energéticos'
      },
      {
        icon: '📲',
        title: 'Track GPS descargable',
        description: 'Compatible con todos los dispositivos'
      },
      {
        icon: '📸',
        title: 'Fotografías profesionales',
        description: 'Álbum completo 48h después'
      }
    ],
    
    importantNote: {
      icon: '🌙',
      title: 'Salida nocturna',
      message: 'La carrera comienza a las 21:00h. Llega 30 minutos antes para el briefing obligatorio y recogida de dorsales.'
    }
  }),

  // ========================================
  // BARRANQUISMO
  // ========================================
  'barranquismo-rio-verde': (data) => ({
    eventName: 'Barranquismo Río Verde',
    eventDate: data.eventDate,
    eventLocation: 'Alhama de Granada',
    heroColor: '#06b6d4',
    
    eventDetails: {
      meetingPoint: 'Parking El Ventorro',
      duration: '4-5 horas',
      difficulty: 'Iniciación',
      requiredEquipment: 'Bañador, toalla, escarpines (el resto se proporciona)',
      startTime: '09:00',
      endTime: '14:00',
    },
    
    whatsappLink: process.env.BARRANQUISMO_WHATSAPP_GROUP,
    whatsappMessage: 'Punto exacto de encuentro, previsión meteorológica y avisos a través del grupo de WhatsApp.',
    
    customDetails: [
      {
        label: 'Nivel',
        value: 'Iniciación (apto para todos)'
      },
      {
        label: 'Equipo incluido',
        value: 'Neopreno, casco, arnés, escarpines'
      }
    ],
    
    features: [
      {
        icon: '💦',
        title: 'Descenso completo',
        description: 'Toboganes, saltos y rápeles'
      },
      {
        icon: '👨‍🏫',
        title: 'Guías especializados',
        description: 'Técnicos deportivos con experiencia'
      },
      {
        icon: '📸',
        title: 'GoPro incluida',
        description: 'Vídeo y fotos del descenso'
      },
      {
        icon: '🍽️',
        title: 'Comida incluida',
        description: 'Barbacoa al finalizar'
      }
    ],
    
    importantNote: {
      icon: '🏊',
      title: 'Importante',
      message: 'Es imprescindible saber nadar. Traer bañador, toalla y ropa de cambio. El neopreno se proporciona en el punto de inicio.'
    }
  }),

  // ========================================
  // EVENTO GENÉRICO SIN WHATSAPP
  // ========================================
  'default': (data) => ({
    eventName: data.eventName || 'Evento de Montaña',
    eventDate: data.eventDate,
    heroColor: '#f97316',
    
    // SIN whatsappLink → No aparece bloque WhatsApp
    
    features: [
      {
        icon: '🎒',
        title: 'Material técnico incluido',
        description: 'Todo el equipamiento necesario'
      },
      {
        icon: '👨‍🏫',
        title: 'Guías profesionales',
        description: 'Personal certificado y experimentado'
      },
      {
        icon: '🏔️',
        title: 'Seguro de montaña',
        description: 'Cobertura completa'
      },
      {
        icon: '📸',
        title: 'Fotografías del evento',
        description: 'Recibirás las fotos profesionales'
      }
    ],
    
    importantNote: {
      icon: '📅',
      title: 'Antes del evento',
      message: 'Te enviaremos un email 48h antes con punto de encuentro, horarios y recomendaciones. Revisa tu bandeja de entrada.'
    }
  })
};

/**
 * Obtener configuración de email para un evento
 */
export function getEventEmailConfig(
  eventSlug: string,
  data: {
    shirtSize?: string;
    eventDate?: Date;
    eventName?: string;
    [key: string]: any;
  }
): EventEmailConfig {
  const configBuilder = EVENT_EMAIL_CONFIGS[eventSlug] || EVENT_EMAIL_CONFIGS['default'];
  return configBuilder(data);
}
