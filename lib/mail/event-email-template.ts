// ========================================
// EVENT EMAIL TEMPLATE - GMAIL iOS DARK MODE FIX
// 🎯 Modo oscuro forzado para Gmail iOS
// 🎨 Compatible Gmail app iOS
// 📱 Mobile-first optimizado
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
  <meta name="color-scheme" content="dark only">
  <meta name="supported-color-schemes" content="dark">
  <!--[if !mso]><!-->
  <style>
    @media (prefers-color-scheme: dark) {
      .dark-mode { background-color: #09090b !important; }
      .dark-container { background-color: #18181b !important; }
      .dark-card { background-color: #27272a !important; }
    }
  </style>
  <!--<![endif]-->
</head>
<body class="dark-mode" style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090b !important;">
  
  <!-- Wrapper con fondo oscuro forzado -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #09090b; padding: 20px 10px;">
    <tr>
      <td align="center">
        
        <!-- Container principal -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 580px; background-color: #18181b; border-radius: 12px; overflow: hidden; border: 1px solid #27272a;">
          
          <!-- HERO -->
          <tr>
            <td style="background: linear-gradient(135deg, ${heroColor} 0%, ${heroDark} 100%); padding: 30px 24px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">${config.eventName}</h1>
            </td>
          </tr>
          
          <!-- SUCCESS -->
          <tr>
            <td style="background-color: #065f46; padding: 16px 24px; text-align: center; border-bottom: 2px solid #10b981;">
              <p style="font-size: 15px; font-weight: 600; color: #d1fae5; margin: 0;">✓ Tu pago se ha procesado correctamente</p>
            </td>
          </tr>
          
          <!-- CONTENT -->
          <tr>
            <td style="padding: 32px 24px; background-color: #18181b;">
              
              <!-- GREETING -->
              <p style="font-size: 16px; color: #fafafa; margin: 0 0 8px 0; font-weight: 600;">Hola ${participant.name} 👋</p>
              <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 24px 0; line-height: 1.5;">Tu reserva ha sido confirmada. A continuación encontrarás todos los detalles.</p>
              
              ${config.eventDate || config.eventLocation || config.eventDetails ? `
              <!-- EVENT INFO CARD -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 24px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, #27272a 0%, #1f1f23 100%); border: 1px solid #3f3f46; border-radius: 10px; padding: 20px;">
                    
                    <!-- Header -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-bottom: 1px solid #3f3f46; padding-bottom: 12px; margin-bottom: 16px;">
                      <tr>
                        <td>
                          <span style="font-size: 15px; font-weight: 700; color: ${heroColor}; text-transform: uppercase; letter-spacing: 0.5px;">📅 DETALLES DEL EVENTO</span>
                        </td>
                      </tr>
                    </table>
                    
                    ${config.eventDate ? `
                    <!-- Fecha -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 10px 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 12px;">
                          <span style="font-size: 18px;">📅</span>
                        </td>
                        <td>
                          <div style="color: #a1a1aa; font-size: 13px; font-weight: 500; margin-bottom: 2px;">Fecha y hora</div>
                          <div style="color: #fafafa; font-size: 14px; font-weight: 600;">${formatEventDate(config.eventDate)}</div>
                          <div style="color: #fafafa; font-size: 14px; font-weight: 600;">${formatEventTime(config.eventDate)}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${config.eventLocation ? `
                    <!-- Ubicación -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 10px 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 12px;">
                          <span style="font-size: 18px;">📍</span>
                        </td>
                        <td>
                          <div style="color: #a1a1aa; font-size: 13px; font-weight: 500; margin-bottom: 2px;">Ubicación</div>
                          <div style="color: #fafafa; font-size: 14px; font-weight: 600;">${config.eventLocation}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${config.eventDetails?.meetingPoint ? `
                    <!-- Punto de encuentro -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 10px 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 12px;">
                          <span style="font-size: 18px;">🚩</span>
                        </td>
                        <td>
                          <div style="color: #a1a1aa; font-size: 13px; font-weight: 500; margin-bottom: 2px;">Punto de encuentro</div>
                          <div style="color: #fafafa; font-size: 14px; font-weight: 600;">${config.eventDetails.meetingPoint}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${config.eventDetails?.duration ? `
                    <!-- Duración -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 10px 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 12px;">
                          <span style="font-size: 18px;">⏱️</span>
                        </td>
                        <td>
                          <div style="color: #a1a1aa; font-size: 13px; font-weight: 500; margin-bottom: 2px;">Duración estimada</div>
                          <div style="color: #fafafa; font-size: 14px; font-weight: 600;">${config.eventDetails.duration}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${config.eventDetails?.difficulty ? `
                    <!-- Nivel -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 10px 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 12px;">
                          <span style="font-size: 18px;">📊</span>
                        </td>
                        <td>
                          <div style="color: #a1a1aa; font-size: 13px; font-weight: 500; margin-bottom: 2px;">Nivel</div>
                          <div style="color: #fafafa; font-size: 14px; font-weight: 600;">${config.eventDetails.difficulty}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${config.eventDetails?.requiredEquipment ? `
                    <!-- Material -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 10px 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 12px;">
                          <span style="font-size: 18px;">🎒</span>
                        </td>
                        <td>
                          <div style="color: #a1a1aa; font-size: 13px; font-weight: 500; margin-bottom: 2px;">Material obligatorio</div>
                          <div style="color: #fafafa; font-size: 14px; font-weight: 600;">${config.eventDetails.requiredEquipment}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${calendarLinks ? `
                    <!-- CALENDAR CTAs -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 16px;">
                      <tr>
                        <td style="background-color: #27272a; border: 1px solid #3f3f46; border-radius: 8px; overflow: hidden;">
                          
                          <!-- Header -->
                          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #1f1f23; padding: 10px 16px; border-bottom: 1px solid #3f3f46;">
                            <tr>
                              <td>
                                <span style="color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">📅 AÑADIR AL CALENDARIO</span>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Google Calendar -->
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="padding: 12px 16px; border-bottom: 1px solid #3f3f46;">
                                <a href="${calendarLinks.googleUrl}" target="_blank" style="text-decoration: none; display: block;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                      <td width="32" valign="middle">
                                        <span style="display: inline-block; width: 24px; height: 24px; background-color: #4285f4; border-radius: 4px; text-align: center; line-height: 24px; color: #ffffff; font-size: 14px; font-weight: 700;">G</span>
                                      </td>
                                      <td valign="middle" style="padding-left: 12px;">
                                        <span style="color: #fafafa; font-size: 14px; font-weight: 500;">Google Calendar</span>
                                      </td>
                                      <td width="24" valign="middle" align="right">
                                        <span style="color: #71717a; font-size: 18px;">→</span>
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
                              <td style="padding: 12px 16px; border-bottom: 1px solid #3f3f46;">
                                <a href="${calendarLinks.icsUrl}" download="${config.eventName.toLowerCase().replace(/\s+/g, '-')}.ics" style="text-decoration: none; display: block;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                      <td width="32" valign="middle">
                                        <span style="font-size: 22px;">🍎</span>
                                      </td>
                                      <td valign="middle" style="padding-left: 12px;">
                                        <span style="color: #fafafa; font-size: 14px; font-weight: 500;">Apple / iCal</span>
                                      </td>
                                      <td width="24" valign="middle" align="right">
                                        <span style="color: #71717a; font-size: 18px;">↓</span>
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
                              <td style="padding: 12px 16px;">
                                <a href="${calendarLinks.outlookUrl}" target="_blank" style="text-decoration: none; display: block;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                      <td width="32" valign="middle">
                                        <span style="display: inline-block; width: 24px; height: 24px; background-color: #0078d4; border-radius: 4px; text-align: center; line-height: 24px; color: #ffffff; font-size: 14px; font-weight: 700;">O</span>
                                      </td>
                                      <td valign="middle" style="padding-left: 12px;">
                                        <span style="color: #fafafa; font-size: 14px; font-weight: 500;">Outlook</span>
                                      </td>
                                      <td width="24" valign="middle" align="right">
                                        <span style="color: #71717a; font-size: 18px;">→</span>
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
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #27272a; border-radius: 8px; padding: 16px; margin: 20px 0;">
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
                        <td width="28" valign="top">
                          <span style="font-size: 20px;">${feature.icon}</span>
                        </td>
                        <td>
                          <div style="color: #fafafa; font-weight: 600; font-size: 14px; margin-bottom: 2px;">${feature.title}</div>
                          ${feature.description ? `<div style="color: #a1a1aa; font-size: 12px; line-height: 1.4;">${feature.description}</div>` : ''}
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
                  <td style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); border-radius: 10px; padding: 20px; text-align: center;">
                    <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 8px 0; font-weight: 700;">💬 Grupo de WhatsApp</h3>
                    <p style="color: #d1fae5; margin: 0 0 16px 0; font-size: 13px; line-height: 1.5;">${config.whatsappMessage || 'Únete al grupo para recibir actualizaciones.'}</p>
                    <a href="${config.whatsappLink}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">Unirse →</a>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              ${config.importantNote ? `
              <!-- ALERT -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #422006; border: 1px solid #7c2d12; border-left: 3px solid ${heroColor}; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <tr>
                  <td width="28" valign="top">
                    <span style="font-size: 20px;">${config.importantNote.icon || '⚠️'}</span>
                  </td>
                  <td style="padding-left: 12px;">
                    <div style="color: #fbbf24; font-weight: 700; font-size: 14px; margin-bottom: 6px;">${config.importantNote.title}</div>
                    <p style="color: #fcd34d; font-size: 13px; line-height: 1.5; margin: 0;">${config.importantNote.message}</p>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              <!-- CLOSING -->
              <p style="margin: 32px 0 0 0; color: #fafafa; font-size: 14px; text-align: center;">¡Nos vemos pronto! 🏔️</p>
              
            </td>
          </tr>
          
          <!-- FOOTER -->
          <tr>
            <td style="text-align: center; padding: 24px; background-color: #09090b; border-top: 1px solid #27272a;">
              <div style="font-size: 16px; font-weight: 700; color: ${heroColor}; margin-bottom: 12px;">PROYECTO CUMBRE</div>
              <p style="color: #71717a; font-size: 12px; margin: 4px 0; line-height: 1.5;">Email automático · No responder</p>
              <p style="color: #71717a; font-size: 12px; margin: 4px 0; line-height: 1.5;">Contacto: <a href="mailto:info@proyecto-cumbre.es" style="color: ${heroColor}; text-decoration: none;">info@proyecto-cumbre.es</a></p>
              <p style="color: #71717a; font-size: 12px; margin: 12px 0 0 0;">© ${new Date().getFullYear()} Proyecto Cumbre</p>
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

// Helper functions remain the same
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
    const borderStyle = isLast ? 'none' : '1px solid #3f3f46';
    const color = isAmount ? heroColor : '#fafafa';
    const fontSize = isAmount ? '16px' : '13px';

    return `
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding: 8px 0; border-bottom: ${borderStyle};">
        <tr>
          <td style="color: #a1a1aa; font-size: 13px;">${detail.label}</td>
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
