// ========================================
// EVENT EMAIL TEMPLATE - MINIMALISTA
// 🎯 Marketing optimized
// 🎨 Clean & Compact
// 📱 Mobile-first
// lib/email/event-email-template.ts
// ========================================

import { BaseEventEmailData, EventEmailConfig } from "./types";

export function buildEventEmail(
  participant: BaseEventEmailData,
  config: EventEmailConfig,
): string {
  const heroColor = config.heroColor || "#f97316";
  const heroDark = adjustBrightness(heroColor, -20);

  // ✅ Calendar links (Google, Apple, Outlook)
  const calendarLinks = config.eventDate
    ? generateCalendarLinks({
        title: config.eventName,
        date: config.eventDate,
        startTime: config.eventDetails?.startTime,
        endTime: config.eventDetails?.endTime,
        location: config.eventLocation || "",
        description: `Inscripción confirmada para ${config.eventName}${config.eventDetails?.description ? "\n\n" + config.eventDetails.description : ""}`,
      })
    : null;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090b;">
  
  <!-- Wrapper -->
  <div style="width: 100%; background-color: #09090b; padding: 20px 10px;">
    
    <!-- Container -->
    <div style="max-width: 580px; margin: 0 auto; background-color: #18181b; border-radius: 12px; overflow: hidden; border: 1px solid #27272a;">
      
      <!-- HERO -->
      <div style="background: linear-gradient(135deg, ${heroColor} 0%, ${heroDark} 100%); padding: 30px 24px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">${config.eventName}</h1>
      </div>
      
      <!-- SUCCESS -->
      <div style="background: #065f46; padding: 16px 24px; text-align: center; border-bottom: 2px solid #10b981;">
        <p style="font-size: 15px; font-weight: 600; color: #d1fae5; margin: 0;">✓ Tu pago se ha procesado correctamente</p>
      </div>
      
      <!-- CONTENT -->
      <div style="padding: 32px 24px;">
        
        <!-- GREETING -->
        <p style="font-size: 16px; color: #fafafa; margin: 0 0 8px 0; font-weight: 600;">Hola ${participant.name} 👋</p>
        <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 24px 0; line-height: 1.5;">Tu reserva ha sido confirmada. A continuación encontrarás todos los detalles.</p>
        
        ${
          config.eventDate || config.eventLocation || config.eventDetails
            ? `
        <!-- EVENT INFO CARD -->
        <div style="background: linear-gradient(135deg, #27272a 0%, #1f1f23 100%); border: 1px solid #3f3f46; border-radius: 10px; padding: 20px; margin: 24px 0;">
          
          <!-- Header -->
          <div style="border-bottom: 1px solid #3f3f46; padding-bottom: 12px; margin-bottom: 16px;">
            <span style="font-size: 15px; font-weight: 700; color: ${heroColor}; text-transform: uppercase; letter-spacing: 0.5px;">📅 DETALLES DEL EVENTO</span>
          </div>
          
          ${
            config.eventDate
              ? `
          <!-- Fecha -->
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 10px 0;">
            <tr>
              <td width="24" valign="top" style="padding-right: 12px;">
                <span style="font-size: 18px; color: ${heroColor};">📅</span>
              </td>
              <td>
                <div style="color: #a1a1aa; font-size: 13px; font-weight: 500; margin-bottom: 2px;">Fecha y hora</div>
                <div style="color: #fafafa; font-size: 14px; font-weight: 600;">${formatEventDate(config.eventDate)}</div>
                <div style="color: #fafafa; font-size: 14px; font-weight: 600;">${formatEventTime(config.eventDate)}</div>
              </td>
            </tr>
          </table>
          `
              : ""
          }
          
          ${
            config.eventLocation
              ? `
          <!-- Ubicación -->
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 10px 0;">
            <tr>
              <td width="24" valign="top" style="padding-right: 12px;">
                <span style="font-size: 18px; color: ${heroColor};">📍</span>
              </td>
              <td>
                <div style="color: #a1a1aa; font-size: 13px; font-weight: 500; margin-bottom: 2px;">Ubicación</div>
                <div style="color: #fafafa; font-size: 14px; font-weight: 600;">${config.eventLocation}</div>
              </td>
            </tr>
          </table>
          `
              : ""
          }
          
          ${
            config.eventDetails?.meetingPoint
              ? `
          <!-- Punto de encuentro -->
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 10px 0;">
            <tr>
              <td width="24" valign="top" style="padding-right: 12px;">
                <span style="font-size: 18px; color: ${heroColor};">🚩</span>
              </td>
              <td>
                <div style="color: #a1a1aa; font-size: 13px; font-weight: 500; margin-bottom: 2px;">Punto de encuentro</div>
                <div style="color: #fafafa; font-size: 14px; font-weight: 600;">${config.eventDetails.meetingPoint}</div>
              </td>
            </tr>
          </table>
          `
              : ""
          }
          
          ${
            config.eventDetails?.duration
              ? `
          <!-- Duración -->
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 10px 0;">
            <tr>
              <td width="24" valign="top" style="padding-right: 12px;">
                <span style="font-size: 18px; color: ${heroColor};">⏱️</span>
              </td>
              <td>
                <div style="color: #a1a1aa; font-size: 13px; font-weight: 500; margin-bottom: 2px;">Duración estimada</div>
                <div style="color: #fafafa; font-size: 14px; font-weight: 600;">${config.eventDetails.duration}</div>
              </td>
            </tr>
          </table>
          `
              : ""
          }
          
          ${
            config.eventDetails?.difficulty
              ? `
          <!-- Nivel -->
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 10px 0;">
            <tr>
              <td width="24" valign="top" style="padding-right: 12px;">
                <span style="font-size: 18px; color: ${heroColor};">📊</span>
              </td>
              <td>
                <div style="color: #a1a1aa; font-size: 13px; font-weight: 500; margin-bottom: 2px;">Nivel</div>
                <div style="color: #fafafa; font-size: 14px; font-weight: 600;">${config.eventDetails.difficulty}</div>
              </td>
            </tr>
          </table>
          `
              : ""
          }
          
          ${
            config.eventDetails?.requiredEquipment
              ? `
          <!-- Material -->
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 10px 0;">
            <tr>
              <td width="24" valign="top" style="padding-right: 12px;">
                <span style="font-size: 18px; color: ${heroColor};">🎒</span>
              </td>
              <td>
                <div style="color: #a1a1aa; font-size: 13px; font-weight: 500; margin-bottom: 2px;">Material obligatorio</div>
                <div style="color: #fafafa; font-size: 14px; font-weight: 600;">${config.eventDetails.requiredEquipment}</div>
              </td>
            </tr>
          </table>
          `
              : ""
          }
          
          ${
            calendarLinks
              ? `
          <!-- CALENDAR CTAs - Dropdown style -->
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 16px;">
            <tr>
              <td>
                <div style="background: #18181b; border: 1px solid #3f3f46; border-radius: 8px; overflow: hidden;">
                  <!-- Header -->
                  <div style="background: #27272a; padding: 10px 16px; border-bottom: 1px solid #3f3f46;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td>
                          <span style="color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">📅 Añadir al calendario</span>
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- Google Calendar -->
                  <a href="${calendarLinks.googleUrl}" target="_blank" style="display: block; padding: 12px 16px; text-decoration: none; border-bottom: 1px solid #3f3f46; transition: background 0.2s;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="24" valign="middle">
                          <div style="width: 20px; height: 20px; background: #4285f4; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #ffffff; font-size: 12px; font-weight: 700;">G</span>
                          </div>
                        </td>
                        <td valign="middle" style="padding-left: 12px;">
                          <span style="color: #fafafa; font-size: 14px; font-weight: 500;">Google Calendar</span>
                        </td>
                        <td width="24" valign="middle" align="right">
                          <span style="color: #71717a; font-size: 16px;">→</span>
                        </td>
                      </tr>
                    </table>
                  </a>
                  
                  <!-- Apple Calendar -->
                  <a href="${calendarLinks.icsUrl}" download="${config.eventName.toLowerCase().replace(/\s+/g, "-")}.ics" style="display: block; padding: 12px 16px; text-decoration: none; border-bottom: 1px solid #3f3f46; transition: background 0.2s;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="24" valign="middle">
                          <span style="font-size: 18px;">🍎</span>
                        </td>
                        <td valign="middle" style="padding-left: 12px;">
                          <span style="color: #fafafa; font-size: 14px; font-weight: 500;">Apple / iCal</span>
                        </td>
                        <td width="24" valign="middle" align="right">
                          <span style="color: #71717a; font-size: 16px;">↓</span>
                        </td>
                      </tr>
                    </table>
                  </a>
                  
                  <!-- Outlook -->
                  <a href="${calendarLinks.outlookUrl}" target="_blank" style="display: block; padding: 12px 16px; text-decoration: none; transition: background 0.2s;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="24" valign="middle">
                          <div style="width: 20px; height: 20px; background: #0078d4; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #ffffff; font-size: 12px; font-weight: 700;">O</span>
                          </div>
                        </td>
                        <td valign="middle" style="padding-left: 12px;">
                          <span style="color: #fafafa; font-size: 14px; font-weight: 500;">Outlook</span>
                        </td>
                        <td width="24" valign="middle" align="right">
                          <span style="color: #71717a; font-size: 16px;">→</span>
                        </td>
                      </tr>
                    </table>
                  </a>
                </div>
              </td>
            </tr>
          </table>
          `
              : ""
          }
        </div>
        `
            : ""
        }
        
        <!-- PARTICIPANT DETAILS -->
        <div style="background: #27272a; border-radius: 8px; padding: 16px; margin: 20px 0;">
          ${buildParticipantDetails(participant, config, heroColor)}
        </div>
        
        ${
          config.features && config.features.length > 0
            ? `
        <!-- FEATURES -->
        <div style="margin: 24px 0;">
          ${config.features
            .map(
              (feature) => `
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 10px 0;">
              <tr>
                <td width="28" valign="top">
                  <span style="font-size: 20px;">${feature.icon}</span>
                </td>
                <td>
                  <div style="color: #fafafa; font-weight: 600; font-size: 14px; margin-bottom: 2px;">${feature.title}</div>
                  ${feature.description ? `<div style="color: #a1a1aa; font-size: 12px; line-height: 1.4;">${feature.description}</div>` : ""}
                </td>
              </tr>
            </table>
          `,
            )
            .join("")}
        </div>
        `
            : ""
        }
        
        ${
          config.whatsappLink
            ? `
        <!-- WHATSAPP -->
        <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
          <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 8px 0; font-weight: 700;">💬 Grupo de WhatsApp</h3>
          <p style="color: #d1fae5; margin: 0 0 16px 0; font-size: 13px; line-height: 1.5;">${config.whatsappMessage || "Únete al grupo para recibir actualizaciones."}</p>
          <a href="${config.whatsappLink}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">Unirse →</a>
        </div>
        `
            : ""
        }
        
        ${
          config.importantNote
            ? `
        <!-- ALERT -->
        <div style="background: #422006; border: 1px solid #7c2d12; border-left: 3px solid ${heroColor}; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="28" valign="top">
                <span style="font-size: 20px;">${config.importantNote.icon || "⚠️"}</span>
              </td>
              <td>
                <div style="color: #fbbf24; font-weight: 700; font-size: 14px; margin-bottom: 6px;">${config.importantNote.title}</div>
                <p style="color: #fcd34d; font-size: 13px; line-height: 1.5; margin: 0;">${config.importantNote.message}</p>
              </td>
            </tr>
          </table>
        </div>
        `
            : ""
        }
        
        <!-- CLOSING -->
        <p style="margin: 32px 0 0 0; color: #fafafa; font-size: 14px; text-align: center;">¡Nos vemos pronto! 🏔️</p>
      </div>
      
      <!-- FOOTER -->
      <div style="text-align: center; padding: 24px; background-color: #09090b; border-top: 1px solid #27272a;">
        <div style="font-size: 16px; font-weight: 700; color: ${heroColor}; margin-bottom: 12px;">PROYECTO CUMBRE</div>
        <p style="color: #71717a; font-size: 12px; margin: 4px 0; line-height: 1.5;">Email automático · No responder</p>
        <p style="color: #71717a; font-size: 12px; margin: 4px 0; line-height: 1.5;">Contacto: <a href="mailto:info@proyecto-cumbre.es" style="color: ${heroColor}; text-decoration: none;">info@proyecto-cumbre.es</a></p>
        <p style="color: #71717a; font-size: 12px; margin: 12px 0 0 0;">© ${new Date().getFullYear()} Proyecto Cumbre</p>
      </div>
      
    </div>
  </div>
  
</body>
</html>
  `;
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function buildParticipantDetails(
  participant: BaseEventEmailData,
  config: EventEmailConfig,
  heroColor: string,
): string {
  const details = [
    { label: "Nombre", value: participant.name },
    { label: "Email", value: participant.email },
    { label: "Teléfono", value: participant.phone },
  ];

  if (participant.dni) {
    details.push({ label: "DNI/NIE", value: participant.dni });
  }

  if (participant.shirtSize) {
    details.push({ label: "Talla", value: participant.shirtSize });
  }

  if (config.customDetails) {
    details.push(...config.customDetails);
  }

  details.push({
    label: "Importe",
    value: `${(participant.amount / 100).toFixed(2)}€`,
  });

  return details
    .map((detail, index) => {
      const isLast = index === details.length - 1;
      const isAmount = detail.label === "Importe";
      const borderStyle = isLast ? "none" : "1px solid #3f3f46";
      const color = isAmount ? heroColor : "#fafafa";
      const fontSize = isAmount ? "16px" : "13px";

      return `
        <div style="padding: 8px 0; border-bottom: ${borderStyle};">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="color: #a1a1aa; font-size: 13px;">${detail.label}</td>
              <td align="right" style="color: ${color}; font-weight: 600; font-size: ${fontSize};">${detail.value}</td>
            </tr>
          </table>
        </div>
      `;
    })
    .join("");
}

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + percent));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + percent));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function formatEventDate(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatEventTime(date: Date): string {
  return (
    date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + "h"
  );
}

/**
 * Genera enlaces para añadir evento a múltiples calendarios
 */
function generateCalendarLinks(event: {
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  description?: string;
  location?: string;
}): { googleUrl: string; icsUrl: string; outlookUrl: string } {
  // Extraer fecha en formato YYYY-MM-DD
  const dateStr = event.date.toISOString().split("T")[0];

  // Obtener horas desde eventDate o usar defaults
  const defaultStartTime = event.date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const startTime = event.startTime || defaultStartTime;

  // End time: +4 horas por defecto
  const endDate = new Date(event.date);
  endDate.setHours(endDate.getHours() + 4);
  const defaultEndTime = endDate.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const endTime = event.endTime || defaultEndTime;

  const description = event.description || "";
  const location = event.location || "";

  // Formato ISO para calendarios (YYYYMMDDTHHMMSS)
  const startDateTime = `${dateStr.replace(/-/g, "")}T${startTime.replace(/:/g, "")}00`;
  const endDateTime = `${dateStr.replace(/-/g, "")}T${endTime.replace(/:/g, "")}00`;

  // Google Calendar
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

  // Apple Calendar (iCal) - archivo .ics
  const icsContent = `BEGIN:VCALENDAR
    VERSION:2.0
    PRODID:-//Proyecto Cumbre//ES
    BEGIN:VEVENT
    SUMMARY:${event.title}
    DTSTART:${startDateTime}
    DTEND:${endDateTime}
    DESCRIPTION:${description.replace(/\n/g, "\\n")}
    LOCATION:${location}
    STATUS:CONFIRMED
    END:VEVENT
    END:VCALENDAR`;

  const icsUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;

  // Outlook
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${dateStr}T${startTime}&enddt=${dateStr}T${endTime}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

  return { googleUrl, icsUrl, outlookUrl };
}
