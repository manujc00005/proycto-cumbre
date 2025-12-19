import { Event } from "../types";

export const eventsData: { events: Event[] } = {
  events: [
    {
      id: 1,
      date: "27 Noviembre 2025",
      title: "TRAIL & TRANCA",
      description: "Salida/llega bar la tranca. 8Kms aprox 300+",
      icon: "runner",
      iconColor: "orange",
      tags: [
        { label: "noche", color: "orange" },
        { label: "asfalto", color: "blue" },
      ],
    },
    {
      id: 2,
      date: "15 Noviembre 2025",
      title: "CIRCULAR PICO DEL CIELO",
      description: "Ruta de trail/senderismo por la Sierra de la Almijara",
      cancelled: true,
      cancelReason: "Alerta Naranja por temporal",
      icon: "mountain",
      iconColor: "red",
      tags: [
        { label: "mañana", color: "blue" },
        { label: "trail", color: "cyan" },
        { label: "senderismo", color: "yellow" },
      ],
    },
    {
      id: 3,
      date: "06 Noviembre 2025",
      title: "UP&DOWN SOCIAL RUN",
    },
    {
      id: 4,
      date: "20 Octubre 2025",
      title: "La MILLA (SOCIAL) CHALLENGE",
    },
    {
      id: 5,
      date: "23 Diciembre 2025",
      title: "TRAIL & TRANCA v2",
      description: "Salida/llegada bar la tranca. 10Kms aprox 300+",
      icon: "runner",
      iconColor: "orange",
      tags: [
        { label: "noche", color: "orange" },
        { label: "asfalto", color: "blue" },
      ],
    },
    {
      id: 6,
      date: "11 Diciembre 2025",
      title: "UP&DOWN SOCIAL RUN",
      description: "Salida/llegada Monte tortuga. 45min aprox 300+",
      icon: "mountain",
      iconColor: "orange",
      tags: [
        { label: "noche", color: "orange" },
        { label: "trail", color: "yellow" },
      ],
    },
  ],
};
