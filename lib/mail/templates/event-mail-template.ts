// ========================================
// EVENT EMAIL TEMPLATE - 100% FLEXIBLE & REUSABLE
// Always-black dark theme enforced
// Supports any event type with props-driven content
// lib/mail/templates/event-mail-template.ts
// ========================================

export interface EventMailProps {
  email: string;
  name: string;
  phone: string;
  dni?: string;
  shirtSize?: string;
  amount: number;
  eventName: string;
  eventDate?: Date;
  eventLocation?: string;
  heroColor?: string;

  whatsappLink?: string;
  whatsappMessage?: string;

  eventDetails?: {
    meetingPoint?: string;
    duration?: string;
    difficulty?: string;
    requiredEquipment?: string;
    startTime?: string;
    endTime?: string;
    description?: string;
  };

  customDetails?: Array<{
    label: string;
    value: string;
  }>;

  features?: Array<{
    icon: string;
    title: string;
    description?: string;
  }>;

  importantNote?: {
    icon?: string;
    title: string;
    message: string;
  };

  ctaButtons?: Array<{
    text: string;
    url: string;
    style?: 'primary' | 'secondary';
  }>;
}

export function buildEventMail(props: EventMailProps): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `✅ Plaza confirmada - ${props.eventName}`;

  return {
    subject,
    html: generateEventHTML(props),
    text: generateEventText(props),
  };
}

function generateEventHTML(props: EventMailProps): string {
  const heroColor = props.heroColor || '#f97316';
  const hasWhatsApp = !!props.whatsappLink;

  const calendarLinks = props.eventDate
    ? generateCalendarLinks({
        title: props.eventName,
        date: props.eventDate,
        startTime: props.eventDetails?.startTime,
        endTime: props.eventDetails?.endTime,
        location: props.eventLocation || '',
        description: props.eventDetails?.description || `Inscripción confirmada para ${props.eventName}`
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
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      color-scheme: dark only !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #000000 !important;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #000000 !important;">

  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #000000 !important; padding: 40px 20px;">
    <tr>
      <td align="center">

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #0a0a0a !important;">

          <!-- EVENT NAME -->
          <tr>
            <td style="padding: 48px 40px 32px 40px; text-align: center;">
              <h1 style="color: ${heroColor} !important; font-size: 36px; font-weight: 900; margin: 0; letter-spacing: 2px; text-transform: uppercase;">${props.eventName}</h1>
            </td>
          </tr>

          <!-- PAYMENT STATUS -->
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
              <p style="color: #ffffff !important; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Hola ${props.name},</p>
              <p style="color: #a1a1aa !important; font-size: 15px; margin: 0 0 48px 0; line-height: 1.7;">Tu plaza para ${props.eventName} está confirmada. A continuación tienes la información esencial para el evento.</p>

              ${hasWhatsApp ? `
              <!-- WHATSAPP BLOCK -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 2px solid #27272a; border-radius: 12px; padding: 32px; margin: 0 0 48px 0;">
                <tr>
                  <td>
                    <h3 style="color: #ffffff !important; font-size: 15px; font-weight: 700; margin: 0 0 16px 0; letter-spacing: 0.5px;">Información importante</h3>
                    <p style="color: #e4e4e7 !important; font-size: 14px; line-height: 1.8; margin: 0 0 24px 0;">
                      ${props.whatsappMessage || 'Toda la comunicación logística del evento (coordenadas, avisos y cambios) se realizará exclusivamente a través del grupo de WhatsApp.'}
                    </p>
                    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0 0 28px 0;">
                      Es necesario unirse para poder participar correctamente.
                    </p>
                    <a href="${props.whatsappLink}" style="display: inline-block; background-color: #16a34a !important; color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; letter-spacing: 0.3px;">
                      Unirme al grupo de WhatsApp
                    </a>
                    <p style="color: #71717a !important; font-size: 12px; margin: 12px 0 0 0; line-height: 1.6;">
                      Obligatorio para recibir la información del evento
                    </p>
                  </td>
                </tr>
              </table>
              ` : ''}

              ${props.eventDate || props.eventLocation || props.eventDetails ? `
              <!-- EVENT INFORMATION -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; padding: 32px; margin: 0 0 32px 0;">
                <tr>
                  <td>
                    <h3 style="color: #ffffff !important; font-size: 15px; font-weight: 700; margin: 0 0 24px 0; letter-spacing: 0.5px;">Información del evento</h3>

                    ${props.eventDate ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 20px 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 16px;">
                          <span style="font-size: 18px; opacity: 0.7;">📅</span>
                        </td>
                        <td>
                          <div style="color: #71717a !important; font-size: 12px; margin-bottom: 4px;">Fecha y hora</div>
                          <div style="color: #ffffff !important; font-size: 14px; font-weight: 600; line-height: 1.5;">${formatEventDate(props.eventDate)}</div>
                          <div style="color: #ffffff !important; font-size: 14px; font-weight: 600;">${formatEventTime(props.eventDate)}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}

                    ${props.eventLocation ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 20px 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 16px;">
                          <span style="font-size: 18px; opacity: 0.7;">📍</span>
                        </td>
                        <td>
                          <div style="color: #71717a !important; font-size: 12px; margin-bottom: 4px;">Ubicación</div>
                          <div style="color: #ffffff !important; font-size: 14px; font-weight: 600;">${props.eventLocation}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}

                    ${props.eventDetails?.meetingPoint ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 20px 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 16px;">
                          <span style="font-size: 18px; opacity: 0.7;">🚩</span>
                        </td>
                        <td>
                          <div style="color: #71717a !important; font-size: 12px; margin-bottom: 4px;">Punto de encuentro</div>
                          <div style="color: #ffffff !important; font-size: 14px; font-weight: 600;">${props.eventDetails.meetingPoint}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}

                    ${props.eventDetails?.duration ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 20px 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 16px;">
                          <span style="font-size: 18px; opacity: 0.7;">⏱️</span>
                        </td>
                        <td>
                          <div style="color: #71717a !important; font-size: 12px; margin-bottom: 4px;">Duración</div>
                          <div style="color: #ffffff !important; font-size: 14px; font-weight: 600;">${props.eventDetails.duration}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}

                    ${props.eventDetails?.difficulty ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 20px 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 16px;">
                          <span style="font-size: 18px; opacity: 0.7;">📊</span>
                        </td>
                        <td>
                          <div style="color: #71717a !important; font-size: 12px; margin-bottom: 4px;">Nivel</div>
                          <div style="color: #ffffff !important; font-size: 14px; font-weight: 600;">${props.eventDetails.difficulty}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}

                    ${props.eventDetails?.requiredEquipment ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 16px;">
                          <span style="font-size: 18px; opacity: 0.7;">🎒</span>
                        </td>
                        <td>
                          <div style="color: #71717a !important; font-size: 12px; margin-bottom: 4px;">Material necesario</div>
                          <div style="color: #ffffff !important; font-size: 14px; font-weight: 600;">${props.eventDetails.requiredEquipment}</div>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- YOUR BOOKING -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; padding: 32px; margin: 0 0 32px 0;">
                <tr>
                  <td>
                    <h3 style="color: #ffffff !important; font-size: 15px; font-weight: 700; margin: 0 0 24px 0; letter-spacing: 0.5px;">Tu reserva</h3>
                    ${buildParticipantDetails(props, heroColor)}
                  </td>
                </tr>
              </table>

              ${props.features && props.features.length > 0 ? `
              <!-- WHAT'S INCLUDED -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 32px 0;">
                <tr>
                  <td>
                    <h3 style="color: #ffffff !important; font-size: 15px; font-weight: 700; margin: 0 0 20px 0; letter-spacing: 0.5px;">Qué incluye</h3>
                    ${props.features.map((feature, index) => `
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
              <!-- CALENDAR -->
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

                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px 24px; border-bottom: 1px solid #27272a;">
                          <a href="${calendarLinks.icsUrl}" download="${props.eventName.toLowerCase().replace(/\s+/g, '-')}.ics" style="text-decoration: none;">
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

              ${props.importantNote ? `
              <!-- IMPORTANT NOTE -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border-left: 3px solid ${heroColor}; border-radius: 8px; padding: 24px; margin: 0 0 48px 0;">
                <tr>
                  <td>
                    <h4 style="color: #ffffff !important; font-size: 13px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: 0.5px; text-transform: uppercase;">${props.importantNote.icon ? `${props.importantNote.icon} ` : ''}${props.importantNote.title}</h4>
                    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0;">${props.importantNote.message}</p>
                  </td>
                </tr>
              </table>
              ` : ''}

              ${props.ctaButtons && props.ctaButtons.length > 0 ? `
              <!-- CTA BUTTONS -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 32px 0;">
                <tr>
                  <td style="text-align: center;">
                    ${props.ctaButtons.map(btn => {
                      const isPrimary = btn.style !== 'secondary';
                      return `
                        <a href="${btn.url}" style="display: inline-block; background-color: ${isPrimary ? heroColor : '#27272a'} !important; color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; letter-spacing: 0.3px; margin: 8px;">
                          ${btn.text}
                        </a>
                      `;
                    }).join('')}
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- FOOTER -->
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

function generateEventText(props: EventMailProps): string {
  return `
PLAZA CONFIRMADA - ${props.eventName.toUpperCase()}

Hola ${props.name},

Tu plaza para ${props.eventName} está confirmada.

${props.eventDate ? `FECHA: ${formatEventDate(props.eventDate)} - ${formatEventTime(props.eventDate)}` : ''}
${props.eventLocation ? `UBICACIÓN: ${props.eventLocation}` : ''}
${props.eventDetails?.meetingPoint ? `PUNTO DE ENCUENTRO: ${props.eventDetails.meetingPoint}` : ''}

TU RESERVA:
Nombre: ${props.name}
Email: ${props.email}
Teléfono: ${props.phone}
${props.dni ? `DNI/NIE: ${props.dni}` : ''}
${props.shirtSize ? `Talla: ${props.shirtSize}` : ''}
Importe: ${(props.amount / 100).toFixed(2)}€

${props.whatsappLink ? `\n⚠️ IMPORTANTE: Únete al grupo de WhatsApp para recibir toda la información del evento.\n${props.whatsappLink}\n` : ''}

Nos vemos en la montaña 🏔️

PROYECTO CUMBRE
info@proyecto-cumbre.es
  `.trim();
}

function buildParticipantDetails(props: EventMailProps, heroColor: string): string {
  const details = [
    { label: 'Nombre', value: props.name },
    { label: 'Email', value: props.email },
    { label: 'Teléfono', value: props.phone },
  ];

  if (props.dni) details.push({ label: 'DNI/NIE', value: props.dni });
  if (props.shirtSize) details.push({ label: 'Talla', value: props.shirtSize });
  if (props.customDetails) details.push(...props.customDetails);
  details.push({ label: 'Importe', value: `${(props.amount / 100).toFixed(2)}€` });

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
