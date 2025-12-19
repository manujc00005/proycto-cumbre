// ========================================
// EVENT EMAIL CONFIGS - REGISTRO CENTRAL
// 🎯 Configuración de emails por slug de evento
// ✅ Un solo lugar para definir todos los eventos
// lib/email/event-email-configs.ts
// ========================================

import { EventEmailConfig } from "./types";

/**
 * Función que genera la config del evento basada en datos dinámicos
 */
type EventConfigBuilder = (data: {
  shirtSize?: string;
  eventDate?: Date;
  [key: string]: any;
}) => EventEmailConfig;

/**
 * REGISTRO DE EVENTOS
 * Añade aquí la configuración de cada nuevo evento usando su slug
 */
export const EVENT_EMAIL_CONFIGS: Record<string, EventConfigBuilder> = {
  // ========================================
  // MISA
  // ========================================
  misa: (data) => ({
    eventName: "MISA™",
    eventDate: new Date("2026-01-23T19:00:00"),
    eventLocation: "Málaga, España",
    heroColor: "#f97316",

    eventDetails: {
      meetingPoint: "Se revelará 2h antes por WhatsApp",
      duration: "1-2 horas (trail nocturno)",
      difficulty: "Media-Alta (trail running)",
      requiredEquipment: "Frontal, ropa deportiva, hidratación",
    },

    whatsappLink:
      process.env.MISA_WHATSAPP_GROUP || "https://chat.whatsapp.com/grupo-misa",
    whatsappMessage:
      "Las coordenadas exactas se compartirán únicamente en el grupo privado. Avisos de última hora y mensajes que solo recibirán quienes estén dentro.",

    features: [
      {
        icon: "👕",
        title: "Camiseta exclusiva",
        description: data.shirtSize
          ? `Talla ${data.shirtSize} · Diseño edición limitada`
          : "Diseño edición limitada",
      },
      {
        icon: "📍",
        title: "Coordenadas secretas",
        description: "Por WhatsApp 2h antes del evento",
      },
      {
        icon: "📲",
        title: "Track GPX en vivo",
        description: "1h antes del inicio",
      },
      {
        icon: "🍻",
        title: "Post clandestino",
        description: "Celebración privada tras el evento",
      },
    ],

    importantNote: {
      icon: "⏰",
      title: "Importante",
      message:
        "Las coordenadas se revelarán ÚNICAMENTE en WhatsApp 2h antes (23 enero, 17:00h). Mantén activas tus notificaciones.",
    },
  }),

  // ========================================
  // TRAIL RUNNING NOCTURNO
  // ========================================
  "trail-nocturno": (data) => ({
    eventName: "Trail Running Nocturno",
    eventDate: data.eventDate,
    eventLocation: "Sierra de las Nieves, Málaga",
    heroColor: "#10b981",

    whatsappLink:
      process.env.TRAIL_WHATSAPP_GROUP ||
      "https://chat.whatsapp.com/trail-nocturno",
    whatsappMessage:
      "Únete al grupo para recibir el track GPX, detalles de avituallamientos y actualizaciones de última hora.",

    features: [
      {
        icon: "💡",
        title: "Frontal LED incluido",
        description: "Equipamiento técnico de última generación",
      },
      {
        icon: "🥤",
        title: "Avituallamientos cada 5km",
        description: "Bebidas isotónicas y geles energéticos",
      },
      {
        icon: "📲",
        title: "Track GPS descargable",
        description: "Compatible con todos los dispositivos",
      },
      {
        icon: "📸",
        title: "Fotografías profesionales",
        description: "Álbum completo 48h después del evento",
      },
      {
        icon: "🏆",
        title: "Clasificación en vivo",
        description: "Sigue tu posición en tiempo real",
      },
    ],

    importantNote: {
      icon: "🌙",
      title: "Salida Nocturna",
      message:
        "La carrera comienza a las 21:00h. Llega 30 minutos antes para el briefing obligatorio y recogida de dorsales.",
    },
  }),

  // ========================================
  // ESCALADA EL CHORRO
  // ========================================
  "escalada-chorro": (data) => ({
    eventName: "Escalada Deportiva - El Chorro",
    eventDate: data.eventDate,
    eventLocation: "El Chorro, Málaga",
    heroColor: "#3b82f6",

    customDetails: [
      {
        label: "Nivel requerido",
        value: "Intermedio (6a-6c)",
      },
      {
        label: "Equipo incluido",
        value: "Arnés, casco, cuerda, asegurador",
      },
    ],

    features: [
      {
        icon: "🧗",
        title: "Vías de diferentes niveles",
        description: "Desde 5c hasta 7a+ según tu experiencia",
      },
      {
        icon: "👨‍🏫",
        title: "Guía UIAGM certificado",
        description: "Profesional con más de 15 años de experiencia",
      },
      {
        icon: "🏔️",
        title: "Seguro RC incluido",
        description: "Cobertura completa durante toda la actividad",
      },
      {
        icon: "📷",
        title: "Reportaje fotográfico",
        description: "Fotos de alta calidad de tus ascensiones",
      },
    ],

    importantNote: {
      icon: "🎒",
      title: "Qué Traer",
      message:
        "Ropa cómoda deportiva, calzado de aproximación, agua (1.5L mínimo), protección solar y snacks energéticos. El material técnico está incluido.",
    },
  }),

  // ========================================
  // CAMINITO DEL REY
  // ========================================
  "caminito-rey": (data) => ({
    eventName: "Caminito del Rey",
    eventDate: data.eventDate,
    eventLocation: "Ardales, Málaga",
    heroColor: "#eab308",

    whatsappLink: process.env.CAMINITO_WHATSAPP_GROUP,
    whatsappMessage:
      "Únete para recibir detalles del punto de encuentro, horarios y recomendaciones.",

    features: [
      {
        icon: "🎫",
        title: "Entradas incluidas",
        description: "Sin colas, acceso directo",
      },
      {
        icon: "👨‍🏫",
        title: "Guía oficial",
        description: "Historia y geología del desfiladero",
      },
      {
        icon: "📸",
        title: "Paradas fotográficas",
        description: "En los mejores miradores",
      },
      {
        icon: "🥪",
        title: "Almuerzo incluido",
        description: "Picnic al finalizar la ruta",
      },
    ],

    importantNote: {
      icon: "⏰",
      title: "Punto de Encuentro",
      message:
        "Nos encontramos a las 9:00h en el parking norte. El acceso cierra a las 9:30h, por favor sé puntual.",
    },
  }),

  // ========================================
  // ALPINISMO MULHACÉN
  // ========================================
  "alpinismo-mulhacen": (data) => ({
    eventName: "Ascensión al Mulhacén",
    eventDate: data.eventDate,
    eventLocation: "Sierra Nevada, Granada",
    heroColor: "#8b5cf6",

    whatsappLink: process.env.MULHACEN_WHATSAPP_GROUP,
    whatsappMessage:
      "Información meteorológica actualizada, horarios y preparación física requerida.",

    customDetails: [
      {
        label: "Nivel físico",
        value: "Alto - 22km / 1.500m desnivel+",
      },
      {
        label: "Duración estimada",
        value: "8-10 horas (ida y vuelta)",
      },
    ],

    features: [
      {
        icon: "🥾",
        title: "Guía de alta montaña",
        description: "Certificado UIAGM/IFMGA",
      },
      {
        icon: "🎒",
        title: "Material colectivo",
        description: "Botiquín, GPS, comunicación por radio",
      },
      {
        icon: "🏔️",
        title: "Seguro de montaña",
        description: "Rescate y evacuación incluidos",
      },
      {
        icon: "📋",
        title: "Briefing técnico",
        description: "Reunión previa el día anterior",
      },
    ],

    importantNote: {
      icon: "⚠️",
      title: "Requisitos Importantes",
      message:
        "Se requiere experiencia en montaña y buena forma física. Enviaremos la lista de material obligatorio 7 días antes. En caso de mal tiempo, la actividad se pospone.",
    },
  }),

  // ========================================
  // BARRANQUISMO
  // ========================================
  "barranquismo-rio-verde": (data) => ({
    eventName: "Barranquismo Río Verde",
    eventDate: data.eventDate,
    eventLocation: "Alhama de Granada",
    heroColor: "#06b6d4",

    whatsappLink: process.env.BARRANQUISMO_WHATSAPP_GROUP,

    customDetails: [
      {
        label: "Nivel",
        value: "Iniciación (apto para todos)",
      },
      {
        label: "Equipo incluido",
        value: "Neopreno, casco, arnés, escarpines",
      },
    ],

    features: [
      {
        icon: "💦",
        title: "Descenso de 4 horas",
        description: "Toboganes, saltos y rápeles",
      },
      {
        icon: "👨‍🏫",
        title: "Guías especializados",
        description: "Técnicos deportivos con experiencia",
      },
      {
        icon: "📸",
        title: "GoPro incluida",
        description: "Vídeo y fotos del descenso",
      },
      {
        icon: "🍽️",
        title: "Comida incluida",
        description: "Barbacoa al finalizar la actividad",
      },
    ],

    importantNote: {
      icon: "🏊",
      title: "Importante",
      message:
        "Es imprescindible saber nadar. Traer bañador, toalla y ropa de cambio. El neopreno se proporciona en el punto de inicio.",
    },
  }),

  // ========================================
  // EVENTO DEFAULT (fallback)
  // ========================================
  default: (data) => ({
    eventName: data.eventName || "Evento de Montaña",
    eventDate: data.eventDate,
    heroColor: "#f97316",

    features: [
      {
        icon: "🎒",
        title: "Material técnico incluido",
        description: "Todo el equipamiento necesario",
      },
      {
        icon: "👨‍🏫",
        title: "Guías profesionales",
        description: "Personal certificado y experimentado",
      },
      {
        icon: "🏔️",
        title: "Seguro de montaña",
        description: "Cobertura completa durante la actividad",
      },
      {
        icon: "📸",
        title: "Fotografías del evento",
        description: "Recibirás las fotos profesionales",
      },
    ],

    importantNote: {
      icon: "📅",
      title: "Antes del Evento",
      message:
        "Te enviaremos un email 48h antes con el punto de encuentro, horarios y recomendaciones. Revisa tu bandeja de entrada.",
    },
  }),
};

/**
 * Obtener configuración de email para un evento por slug
 */
export function getEventEmailConfig(
  eventSlug: string,
  data: {
    shirtSize?: string;
    eventDate?: Date;
    eventName?: string;
    [key: string]: any;
  },
): EventEmailConfig {
  const configBuilder =
    EVENT_EMAIL_CONFIGS[eventSlug] || EVENT_EMAIL_CONFIGS["default"];
  return configBuilder(data);
}
