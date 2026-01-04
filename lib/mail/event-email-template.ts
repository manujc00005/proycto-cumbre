// ========================================
// EVENT EMAIL TEMPLATE - PRO MINIMAL
// 🎯 SIEMPRE oscuro (forzado)
// 💎 Elegante y profesional
// 📍 1 solo CTA fuerte (no 3)
// ♻️ Genérico para todos los eventos
// lib/email/event-email-template.ts
// ========================================

import { BaseEventEmailData, EventEmailConfig } from './types';

export function buildEventEmail(
  participant: BaseEventEmailData,
  config: EventEmailConfig
): string {
  const heroColor = config.heroColor || '#f97316';
  const hasWhatsApp = !!config.whatsappLink;

  const calendarLinks = config.eventDate 
    ? generateCalendarLinks({
        title: config.eventName,
        date: config.eventDate,
        startTime: config.eventDetails?.startTime,
        endTime: config.eventDetails?.endTime,
        location: config.eventLocation || '',
        description: `Inscripción confirmada para ${config.eventName}`
      })
    : null;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark only">
  <meta name="supported-color-schemes" content="dark">
  <style>
    @media (prefers-color-scheme: dark) {
      :root { color-scheme: dark only; }
      body { background-color: #000000 !important; }
    }
    * { color-scheme: dark only !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000 !important;">
  
  <!-- WRAPPER -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #000000 !important; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- CONTAINER -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #0a0a0a !important;">
          
          <!-- LOGO / NOMBRE EVENTO -->
          <tr>
            <td style="padding: 48px 40px 32px 40px; text-align: center;">
              <h1 style="color: ${heroColor} !important; font-size: 36px; font-weight: 900; margin: 0; letter-spacing: 2px; text-transform: uppercase;">${config.eventName}</h1>
            </td>
          </tr>
          
          <!-- ESTADO PAGO -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <div style="display: inline-block; background-color: #18181b !important; border: 1px solid #27272a; border-radius: 6px; padding: 12px 24px;">
                <span style="color: #10b981 !important; font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">✓ PAGO CONFIRMADO</span>
              </div>
            </td>
          </tr>
          
          <!-- CONTENT -->
          <tr>
            <td style="padding: 0 40px 48px 40px;">
              
              <!-- GREETING -->
              <p style="color: #ffffff !important; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Hola ${participant.name},</p>
              <p style="color: #a1a1aa !important; font-size: 15px; margin: 0 0 48px 0; line-height: 1.7;">Tu plaza para ${config.eventName} está confirmada. A continuación tienes la información esencial para el evento.</p>
              
              ${hasWhatsApp ? `
              <!-- ========================================
                  💬 BLOQUE WHATSAPP ELEGANTE
                  ======================================== -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 2px solid #27272a; border-radius: 12px; padding: 32px; margin: 0 0 48px 0;">
                <tr>
                  <td>
                    <h3 style="color: #ffffff !important; font-size: 15px; font-weight: 700; margin: 0 0 16px 0; letter-spacing: 0.5px;">Información importante</h3>
                    <p style="color: #e4e4e7 !important; font-size: 14px; line-height: 1.8; margin: 0 0 24px 0;">
                      ${config.whatsappMessage || 'Toda la comunicación logística del evento (coordenadas, avisos y cambios) se realizará exclusivamente a través del grupo de WhatsApp.'}
                    </p>
                    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0 0 28px 0;">
                      Es necesario unirse para poder participar correctamente.
                    </p>
                    <a href="${config.whatsappLink}" style="display: inline-block; background-color: #16a34a !important; color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; letter-spacing: 0.3px;">
                      Unirme al grupo de WhatsApp
                    </a>
                    <p style="color: #71717a !important; font-size: 12px; margin: 12px 0 0 0; line-height: 1.6;">
                      Obligatorio para recibir la información del evento
                    </p>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              ${config.eventDate || config.eventLocation || config.eventDetails ? `
              <!-- INFORMACIÓN DEL EVENTO -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; padding: 32px; margin: 0 0 32px 0;">
                <tr>
                  <td>
                    <h3 style="color: #ffffff !important; font-size: 15px; font-weight: 700; margin: 0 0 24px 0; letter-spacing: 0.5px;">Información del evento</h3>
                    
                    ${config.eventDate ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 20px 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 16px;">
                          <span style="font-size: 18px; opacity: 0.7;">📅</span>
                        </td>
                        <td>
                          <div style="color: #71717a !important; font-size: 12px; margin-bottom: 4px;">Fecha y hora</div>
                          <div style="color: #ffffff !important; font-size: 14px; font-weight: 600; line-height: 1.5;">${formatEventDate(config.eventDate)}</div>
                          <div style="color: #ffffff !important; font-size: 14px; font-weight: 600;">${formatEventTime(config.eventDate)}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${config.eventLocation ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 20px 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 16px;">
                          <span style="font-size: 18px; opacity: 0.7;">📍</span>
                        </td>
                        <td>
                          <div style="color: #71717a !important; font-size: 12px; margin-bottom: 4px;">Ubicación</div>
                          <div style="color: #ffffff !important; font-size: 14px; font-weight: 600;">${config.eventLocation}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${config.eventDetails?.meetingPoint ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 20px 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 16px;">
                          <span style="font-size: 18px; opacity: 0.7;">🚩</span>
                        </td>
                        <td>
                          <div style="color: #71717a !important; font-size: 12px; margin-bottom: 4px;">Punto de encuentro</div>
                          <div style="color: #ffffff !important; font-size: 14px; font-weight: 600;">${config.eventDetails.meetingPoint}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${config.eventDetails?.duration ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 20px 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 16px;">
                          <span style="font-size: 18px; opacity: 0.7;">⏱️</span>
                        </td>
                        <td>
                          <div style="color: #71717a !important; font-size: 12px; margin-bottom: 4px;">Duración</div>
                          <div style="color: #ffffff !important; font-size: 14px; font-weight: 600;">${config.eventDetails.duration}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${config.eventDetails?.difficulty ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 20px 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 16px;">
                          <span style="font-size: 18px; opacity: 0.7;">📊</span>
                        </td>
                        <td>
                          <div style="color: #71717a !important; font-size: 12px; margin-bottom: 4px;">Nivel</div>
                          <div style="color: #ffffff !important; font-size: 14px; font-weight: 600;">${config.eventDetails.difficulty}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${config.eventDetails?.requiredEquipment ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 16px;">
                          <span style="font-size: 18px; opacity: 0.7;">🎒</span>
                        </td>
                        <td>
                          <div style="color: #71717a !important; font-size: 12px; margin-bottom: 4px;">Material necesario</div>
                          <div style="color: #ffffff !important; font-size: 14px; font-weight: 600;">${config.eventDetails.requiredEquipment}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                  </td>
                </tr>
              </table>
              ` : ''}
              
              <!-- TU RESERVA -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; padding: 32px; margin: 0 0 32px 0;">
                <tr>
                  <td>
                    <h3 style="color: #ffffff !important; font-size: 15px; font-weight: 700; margin: 0 0 24px 0; letter-spacing: 0.5px;">Tu reserva</h3>
                    ${buildParticipantDetailsMinimal(participant, config, heroColor)}
                  </td>
                </tr>
              </table>
              
              ${config.features && config.features.length > 0 ? `
              <!-- QUÉ INCLUYE -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 32px 0;">
                <tr>
                  <td>
                    <h3 style="color: #ffffff !important; font-size: 15px; font-weight: 700; margin: 0 0 20px 0; letter-spacing: 0.5px;">Qué incluye</h3>
                    ${config.features.map((feature, index) => `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: ${index === 0 ? '0' : '16px'} 0 0 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 16px;">
                          <span style="font-size: 18px; opacity: 0.7;">${feature.icon}</span>
                        </td>
                        <td>
                          <div style="color: #ffffff !important; font-weight: 600; font-size: 14px; margin-bottom: 2px;">${feature.title}</div>
                          ${feature.description ? `<div style="color: #71717a !important; font-size: 13px; line-height: 1.6;">${feature.description}</div>` : ''}
                        </td>
                      </tr>
                    </table>
                    `).join('')}
                  </td>
                </tr>
              </table>
              ` : ''}
              
              ${calendarLinks ? `
              <!-- CALENDARIO -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; margin: 0 0 32px 0;">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding: 16px 24px; border-bottom: 1px solid #27272a;">
                      <tr>
                        <td>
                          <span style="color: #a1a1aa !important; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">AÑADIR AL CALENDARIO</span>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Google -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px 24px; border-bottom: 1px solid #27272a;">
                          <a href="${calendarLinks.googleUrl}" target="_blank" style="text-decoration: none; display: flex; align-items: center;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td width="32" valign="middle">
                                  <span style="display: inline-block; width: 28px; height: 28px; background-color: #4285f4; border-radius: 6px; text-align: center; line-height: 28px; color: #ffffff !important; font-size: 14px; font-weight: 700;">G</span>
                                </td>
                                <td valign="middle" style="padding-left: 12px;">
                                  <span style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600;">Google Calendar</span>
                                </td>
                                <td width="20" valign="middle" align="right">
                                  <span style="color: #71717a !important; font-size: 16px;">→</span>
                                </td>
                              </tr>
                            </table>
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Apple -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px 24px; border-bottom: 1px solid #27272a;">
                          <a href="${calendarLinks.icsUrl}" download="${config.eventName.toLowerCase().replace(/\s+/g, '-')}.ics" style="text-decoration: none;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td width="32" valign="middle">
                                  <span style="font-size: 22px;">🍎</span>
                                </td>
                                <td valign="middle" style="padding-left: 12px;">
                                  <span style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600;">Apple / iCal</span>
                                </td>
                                <td width="20" valign="middle" align="right">
                                  <span style="color: #71717a !important; font-size: 16px;">↓</span>
                                </td>
                              </tr>
                            </table>
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Outlook -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px 24px;">
                          <a href="${calendarLinks.outlookUrl}" target="_blank" style="text-decoration: none;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td width="32" valign="middle">
                                  <span style="display: inline-block; width: 28px; height: 28px; background-color: #0078d4; border-radius: 6px; text-align: center; line-height: 28px; color: #ffffff !important; font-size: 14px; font-weight: 700;">O</span>
                                </td>
                                <td valign="middle" style="padding-left: 12px;">
                                  <span style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600;">Outlook</span>
                                </td>
                                <td width="20" valign="middle" align="right">
                                  <span style="color: #71717a !important; font-size: 16px;">→</span>
                                </td>
                              </tr>
                            </table>
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              ${config.importantNote ? `
              <!-- NOTA IMPORTANTE -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border-left: 3px solid ${heroColor}; border-radius: 8px; padding: 24px; margin: 0 0 48px 0;">
                <tr>
                  <td>
                    <h4 style="color: #ffffff !important; font-size: 13px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: 0.5px; text-transform: uppercase;">${config.importantNote.title}</h4>
                    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0;">${config.importantNote.message}</p>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              <!-- FOOTER LIMPIO -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding-top: 32px; border-top: 1px solid #27272a;">
                <tr>
                  <td style="text-align: center;">
                    <p style="color: #71717a !important; font-size: 13px; margin: 0 0 8px 0;">Nos vemos en la montaña 🏔️</p>
                    <p style="color: ${heroColor} !important; font-size: 14px; font-weight: 700; margin: 0 0 24px 0; letter-spacing: 0.5px;">PROYECTO CUMBRE</p>
                    <p style="color: #52525b !important; font-size: 11px; margin: 0;">Email automático · <a href="mailto:info@proyecto-cumbre.es" style="color: #71717a !important; text-decoration: none;">Contacto</a></p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `;
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function buildParticipantDetailsMinimal(
  participant: BaseEventEmailData,
  config: EventEmailConfig,
  heroColor: string
): string {
  const details = [
    { label: 'Nombre', value: participant.name },
    { label: 'Email', value: participant.email },
    { label: 'Teléfono', value: participant.phone },
  ];

  if (participant.dni) details.push({ label: 'DNI/NIE', value: participant.dni });
  if (participant.shirtSize) details.push({ label: 'Talla', value: participant.shirtSize });
  if (config.customDetails) details.push(...config.customDetails);
  details.push({ label: 'Importe', value: `${(participant.amount / 100).toFixed(2)}€` });

  return details.map((detail, index) => {
    const isLast = index === details.length - 1;
    const isAmount = detail.label === 'Importe';
    const marginTop = index === 0 ? '0' : '16px';

    return `
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: ${marginTop};">
        <tr>
          <td style="color: #71717a !important; font-size: 12px; padding-bottom: 4px;">${detail.label}</td>
        </tr>
        <tr>
          <td style="color: ${isAmount ? heroColor : '#ffffff'} !important; font-weight: ${isAmount ? '700' : '600'}; font-size: ${isAmount ? '16px' : '14px'}; padding-bottom: ${isLast ? '0' : '16px'}; border-bottom: ${isLast ? 'none' : '1px solid #27272a'};">${detail.value}</td>
        </tr>
      </table>
    `;
  }).join('');
}

function formatEventDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatEventTime(date: Date): string {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }) + 'h';
}

function generateCalendarLinks(event: {
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  description?: string;
  location?: string;
}): { googleUrl: string; icsUrl: string; outlookUrl: string } {
  const dateStr = event.date.toISOString().split('T')[0];
  const defaultStartTime = event.date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
  const startTime = event.startTime || defaultStartTime;
  const endDate = new Date(event.date);
  endDate.setHours(endDate.getHours() + 4);
  const defaultEndTime = endDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
  const endTime = event.endTime || defaultEndTime;
  const description = event.description || '';
  const location = event.location || '';
  const startDateTime = `${dateStr.replace(/-/g, '')}T${startTime.replace(/:/g, '')}00`;
  const endDateTime = `${dateStr.replace(/-/g, '')}T${endTime.replace(/:/g, '')}00`;
  
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
  
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Proyecto Cumbre//ES
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${startDateTime}
DTEND:${endDateTime}
DESCRIPTION:${description.replace(/\n/g, '\\n')}
LOCATION:${location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
  
  const icsUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${dateStr}T${startTime}&enddt=${dateStr}T${endTime}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
  
  return { googleUrl, icsUrl, outlookUrl };
}
