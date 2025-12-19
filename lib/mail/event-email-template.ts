// ========================================
// EVENT EMAIL TEMPLATE - DUAL MODE COMPATIBLE
// 🎯 Funciona en light y dark mode
// 🎨 Gmail iOS compatible
// 📱 Colores que funcionan al invertirse
// lib/email/event-email-template.ts
// ========================================

import { BaseEventEmailData, EventEmailConfig } from './types';

export function buildEventEmail(
  participant: BaseEventEmailData,
  config: EventEmailConfig
): string {
  const heroColor = config.heroColor || '#f97316';
  const heroDark = adjustBrightness(heroColor, -20);

  const calendarLinks = config.eventDate 
    ? generateCalendarLinks({
        title: config.eventName,
        date: config.eventDate,
        startTime: config.eventDetails?.startTime,
        endTime: config.eventDetails?.endTime,
        location: config.eventLocation || '',
        description: `Inscripción confirmada para ${config.eventName}${config.eventDetails?.description ? '\n\n' + config.eventDetails.description : ''}`
      })
    : null;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  
  <!-- Wrapper -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 20px 10px;">
    <tr>
      <td align="center">
        
        <!-- Container -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- HERO -->
          <tr>
            <td style="background: linear-gradient(135deg, ${heroColor} 0%, ${heroDark} 100%); padding: 30px 24px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">${config.eventName}</h1>
            </td>
          </tr>
          
          <!-- SUCCESS -->
          <tr>
            <td style="background-color: #10b981; padding: 16px 24px; text-align: center;">
              <p style="font-size: 15px; font-weight: 600; color: #ffffff; margin: 0;">✓ Tu pago se ha procesado correctamente</p>
            </td>
          </tr>
          
          <!-- CONTENT -->
          <tr>
            <td style="padding: 32px 24px; background-color: #ffffff;">
              
              <!-- GREETING -->
              <p style="font-size: 16px; color: #1f2937; margin: 0 0 8px 0; font-weight: 600;">Hola ${participant.name} 👋</p>
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px 0; line-height: 1.5;">Tu reserva ha sido confirmada. A continuación encontrarás todos los detalles.</p>
              
              ${config.eventDate || config.eventLocation || config.eventDetails ? `
              <!-- EVENT INFO CARD -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 24px 0;">
                <tr>
                  <td style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px;">
                    
                    <!-- Header -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 16px;">
                      <tr>
                        <td>
                          <span style="font-size: 15px; font-weight: 700; color: ${heroColor}; text-transform: uppercase; letter-spacing: 0.5px;">📅 DETALLES DEL EVENTO</span>
                        </td>
                      </tr>
                    </table>
                    
                    ${config.eventDate ? `
                    <!-- Fecha -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 12px 0;">
                      <tr>
                        <td width="32" valign="top" style="padding-right: 12px;">
                          <span style="font-size: 20px;">📅</span>
                        </td>
                        <td>
                          <div style="color: #6b7280; font-size: 13px; font-weight: 500; margin-bottom: 4px;">Fecha y hora</div>
                          <div style="color: #1f2937; font-size: 15px; font-weight: 600;">${formatEventDate(config.eventDate)}</div>
                          <div style="color: #1f2937; font-size: 15px; font-weight: 600;">${formatEventTime(config.eventDate)}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${config.eventLocation ? `
                    <!-- Ubicación -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 12px 0;">
                      <tr>
                        <td width="32" valign="top" style="padding-right: 12px;">
                          <span style="font-size: 20px;">📍</span>
                        </td>
                        <td>
                          <div style="color: #6b7280; font-size: 13px; font-weight: 500; margin-bottom: 4px;">Ubicación</div>
                          <div style="color: #1f2937; font-size: 15px; font-weight: 600;">${config.eventLocation}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${config.eventDetails?.meetingPoint ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 12px 0;">
                      <tr>
                        <td width="32" valign="top" style="padding-right: 12px;">
                          <span style="font-size: 20px;">🚩</span>
                        </td>
                        <td>
                          <div style="color: #6b7280; font-size: 13px; font-weight: 500; margin-bottom: 4px;">Punto de encuentro</div>
                          <div style="color: #1f2937; font-size: 15px; font-weight: 600;">${config.eventDetails.meetingPoint}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${config.eventDetails?.duration ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 12px 0;">
                      <tr>
                        <td width="32" valign="top" style="padding-right: 12px;">
                          <span style="font-size: 20px;">⏱️</span>
                        </td>
                        <td>
                          <div style="color: #6b7280; font-size: 13px; font-weight: 500; margin-bottom: 4px;">Duración estimada</div>
                          <div style="color: #1f2937; font-size: 15px; font-weight: 600;">${config.eventDetails.duration}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${config.eventDetails?.difficulty ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 12px 0;">
                      <tr>
                        <td width="32" valign="top" style="padding-right: 12px;">
                          <span style="font-size: 20px;">📊</span>
                        </td>
                        <td>
                          <div style="color: #6b7280; font-size: 13px; font-weight: 500; margin-bottom: 4px;">Nivel</div>
                          <div style="color: #1f2937; font-size: 15px; font-weight: 600;">${config.eventDetails.difficulty}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${config.eventDetails?.requiredEquipment ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 12px 0;">
                      <tr>
                        <td width="32" valign="top" style="padding-right: 12px;">
                          <span style="font-size: 20px;">🎒</span>
                        </td>
                        <td>
                          <div style="color: #6b7280; font-size: 13px; font-weight: 500; margin-bottom: 4px;">Material obligatorio</div>
                          <div style="color: #1f2937; font-size: 15px; font-weight: 600;">${config.eventDetails.requiredEquipment}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${calendarLinks ? `
                    <!-- CALENDAR CTAs -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 20px;">
                      <tr>
                        <td style="background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
                          
                          <!-- Header -->
                          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; padding: 12px 16px; border-bottom: 2px solid #e5e7eb;">
                            <tr>
                              <td>
                                <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">📅 AÑADIR AL CALENDARIO</span>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Google Calendar -->
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb;">
                                <a href="${calendarLinks.googleUrl}" target="_blank" style="text-decoration: none; display: block;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                      <td width="40" valign="middle">
                                        <span style="display: inline-block; width: 32px; height: 32px; background-color: #4285f4; border-radius: 6px; text-align: center; line-height: 32px; color: #ffffff; font-size: 16px; font-weight: 700;">G</span>
                                      </td>
                                      <td valign="middle" style="padding-left: 12px;">
                                        <span style="color: #1f2937; font-size: 15px; font-weight: 600;">Google Calendar</span>
                                      </td>
                                      <td width="24" valign="middle" align="right">
                                        <span style="color: #9ca3af; font-size: 20px;">→</span>
                                      </td>
                                    </tr>
                                  </table>
                                </a>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Apple Calendar -->
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb;">
                                <a href="${calendarLinks.icsUrl}" download="${config.eventName.toLowerCase().replace(/\s+/g, '-')}.ics" style="text-decoration: none; display: block;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                      <td width="40" valign="middle">
                                        <span style="font-size: 26px;">🍎</span>
                                      </td>
                                      <td valign="middle" style="padding-left: 12px;">
                                        <span style="color: #1f2937; font-size: 15px; font-weight: 600;">Apple / iCal</span>
                                      </td>
                                      <td width="24" valign="middle" align="right">
                                        <span style="color: #9ca3af; font-size: 20px;">↓</span>
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
                              <td style="padding: 14px 16px;">
                                <a href="${calendarLinks.outlookUrl}" target="_blank" style="text-decoration: none; display: block;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                      <td width="40" valign="middle">
                                        <span style="display: inline-block; width: 32px; height: 32px; background-color: #0078d4; border-radius: 6px; text-align: center; line-height: 32px; color: #ffffff; font-size: 16px; font-weight: 700;">O</span>
                                      </td>
                                      <td valign="middle" style="padding-left: 12px;">
                                        <span style="color: #1f2937; font-size: 15px; font-weight: 600;">Outlook</span>
                                      </td>
                                      <td width="24" valign="middle" align="right">
                                        <span style="color: #9ca3af; font-size: 20px;">→</span>
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
                    
                  </td>
                </tr>
              </table>
              ` : ''}
              
              <!-- PARTICIPANT DETAILS -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 10px; padding: 16px; margin: 20px 0;">
                <tr>
                  <td>
                    ${buildParticipantDetails(participant, config, heroColor)}
                  </td>
                </tr>
              </table>
              
              ${config.features && config.features.length > 0 ? `
              <!-- FEATURES -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 24px 0;">
                ${config.features.map(feature => `
                <tr>
                  <td style="padding: 10px 0;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="32" valign="top">
                          <span style="font-size: 22px;">${feature.icon}</span>
                        </td>
                        <td style="padding-left: 12px;">
                          <div style="color: #1f2937; font-weight: 600; font-size: 15px; margin-bottom: 2px;">${feature.title}</div>
                          ${feature.description ? `<div style="color: #6b7280; font-size: 13px; line-height: 1.5;">${feature.description}</div>` : ''}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                `).join('')}
              </table>
              ` : ''}
              
              ${config.whatsappLink ? `
              <!-- WHATSAPP -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 24px 0;">
                <tr>
                  <td style="background-color: #10b981; border-radius: 10px; padding: 20px; text-align: center;">
                    <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 8px 0; font-weight: 700;">💬 Grupo de WhatsApp</h3>
                    <p style="color: #d1fae5; margin: 0 0 16px 0; font-size: 13px; line-height: 1.5;">${config.whatsappMessage || 'Únete al grupo para recibir actualizaciones.'}</p>
                    <a href="${config.whatsappLink}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">Unirse →</a>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              ${config.importantNote ? `
              <!-- ALERT -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fef3c7; border: 2px solid #fbbf24; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <tr>
                  <td width="32" valign="top">
                    <span style="font-size: 22px;">${config.importantNote.icon || '⚠️'}</span>
                  </td>
                  <td style="padding-left: 12px;">
                    <div style="color: #92400e; font-weight: 700; font-size: 15px; margin-bottom: 6px;">${config.importantNote.title}</div>
                    <p style="color: #78350f; font-size: 13px; line-height: 1.5; margin: 0;">${config.importantNote.message}</p>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              <!-- CLOSING -->
              <p style="margin: 32px 0 0 0; color: #6b7280; font-size: 14px; text-align: center;">¡Nos vemos pronto! 🏔️</p>
              
            </td>
          </tr>
          
          <!-- FOOTER -->
          <tr>
            <td style="text-align: center; padding: 24px; background-color: #f9fafb; border-top: 2px solid #e5e7eb;">
              <div style="font-size: 16px; font-weight: 700; color: ${heroColor}; margin-bottom: 12px;">PROYECTO CUMBRE</div>
              <p style="color: #6b7280; font-size: 12px; margin: 4px 0; line-height: 1.5;">Email automático · No responder</p>
              <p style="color: #6b7280; font-size: 12px; margin: 4px 0; line-height: 1.5;">Contacto: <a href="mailto:info@proyecto-cumbre.es" style="color: ${heroColor}; text-decoration: none;">info@proyecto-cumbre.es</a></p>
              <p style="color: #9ca3af; font-size: 12px; margin: 12px 0 0 0;">© ${new Date().getFullYear()} Proyecto Cumbre</p>
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

// Helper functions
function buildParticipantDetails(
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
    const borderStyle = isLast ? 'none' : '1px solid #e5e7eb';
    const color = isAmount ? heroColor : '#1f2937';
    const fontSize = isAmount ? '17px' : '14px';

    return `
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding: 10px 0; border-bottom: ${borderStyle};">
        <tr>
          <td style="color: #6b7280; font-size: 13px;">${detail.label}</td>
          <td align="right" style="color: ${color}; font-weight: 600; font-size: ${fontSize};">${detail.value}</td>
        </tr>
      </table>
    `;
  }).join('');
}

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + percent));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + percent));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
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