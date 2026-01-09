// ========================================
// EVENT EMAIL TEMPLATE - NEUTRAL (LIGHT/DARK SAFE)
// Confirmación de plaza para cualquier tipo de evento
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

// ===================
// HTML
// ===================

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
        description:
          props.eventDetails?.description ||
          `Inscripción confirmada para ${props.eventName}`,
      })
    : null;

  // --- Greeting text ---
  const introMessage = `Tu plaza para ${props.eventName} está confirmada. A continuación tienes la información esencial del evento.`;

  // --- Event info box ---
  let eventDetailsContent = '';

  if (props.eventDate) {
    eventDetailsContent += eventInfoRow(
      '📅 Fecha y hora',
      `${formatEventDate(props.eventDate)}<br />${formatEventTime(
        props.eventDate,
      )}`,
    );
  }

  if (props.eventLocation) {
    eventDetailsContent += eventInfoRow('📍 Ubicación', props.eventLocation);
  }

  if (props.eventDetails?.meetingPoint) {
    eventDetailsContent += eventInfoRow(
      '🚩 Punto de encuentro',
      props.eventDetails.meetingPoint,
    );
  }

  if (props.eventDetails?.duration) {
    eventDetailsContent += eventInfoRow(
      '⏱️ Duración',
      props.eventDetails.duration,
    );
  }

  if (props.eventDetails?.difficulty) {
    eventDetailsContent += eventInfoRow(
      '📊 Nivel',
      props.eventDetails.difficulty,
    );
  }

  if (props.eventDetails?.requiredEquipment) {
    eventDetailsContent += eventInfoRow(
      '🎒 Material necesario',
      props.eventDetails.requiredEquipment,
      true,
    );
  }

  const hasEventInfo = !!eventDetailsContent;
  const eventInfoBox = hasEventInfo
    ? buildBox({
        title: 'Información del evento',
        content: eventDetailsContent,
      })
    : '';

  // --- Booking details box ---
  let bookingDetailsContent = '';
  bookingDetailsContent += bookingRow('Nombre', props.name);
  bookingDetailsContent += bookingRow('Email', props.email);
  bookingDetailsContent += bookingRow('Teléfono', props.phone);

  if (props.dni) {
    bookingDetailsContent += bookingRow('DNI/NIE', props.dni);
  }

  if (props.shirtSize) {
    bookingDetailsContent += bookingRow('Talla', props.shirtSize);
  }

  if (props.customDetails) {
    props.customDetails.forEach((detail) => {
      bookingDetailsContent += bookingRow(detail.label, detail.value);
    });
  }

  bookingDetailsContent += bookingRow(
    'Importe',
    `${(props.amount / 100).toFixed(2)}€`,
    true,
    heroColor,
  );

  const bookingBox = buildBox({
    title: 'Tu reserva',
    content: bookingDetailsContent,
  });

  // --- WhatsApp block ---
  const whatsappSection =
    hasWhatsApp && props.whatsappLink
      ? buildWhatsAppBox(
          props.whatsappLink,
          props.whatsappMessage ||
            'Toda la comunicación logística del evento (coordenadas, avisos y cambios) se realizará exclusivamente a través del grupo de WhatsApp.',
        )
      : '';

  // --- Features section (qué incluye) ---
  let featuresSection = '';
  if (props.features && props.features.length > 0) {
    const items = props.features
      .map((f) => featureRow(f.icon, f.title, f.description))
      .join('');

    featuresSection = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:0 24px 20px 24px;">
      <p style="margin:0 0 10px 0;font-size:13px;font-weight:600;color:#111827;">
        Qué incluye
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px;border:1px solid #e5e7eb;background-color:#f9fafb;">
        ${items}
      </table>
    </td>
  </tr>
</table>
`;
  }

  // --- Calendar section ---
  let calendarSection = '';
  if (calendarLinks) {
    calendarSection = buildCalendarBox(calendarLinks, props.eventName);
  }

  // --- Important note ---
  const importantNoteSection = props.importantNote
    ? buildImportantBox(
        props.importantNote.icon || '⚠️',
        props.importantNote.title,
        props.importantNote.message,
        heroColor,
      )
    : '';

  // --- CTA buttons ---
  let ctaSection = '';
  if (props.ctaButtons && props.ctaButtons.length > 0) {
    const buttons = props.ctaButtons
      .map((btn) =>
        buildButton(
          btn.text,
          btn.url,
          btn.style === 'secondary' ? 'secondary' : 'primary',
          heroColor,
        ),
      )
      .join('');

    ctaSection = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" style="padding:0 24px 24px 24px;">
      ${buttons}
    </td>
  </tr>
</table>
`;
  }

  // --- Full HTML ---
  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Plaza confirmada - ${escapeForHtml(props.eventName)}</title>
    <style>
      html, body {
        margin: 0;
        padding: 0;
      }
      body {
        background-color: #e5e5e5;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
      }
      img {
        border: 0;
        display: block;
        max-width: 100%;
        height: auto;
      }
      a {
        text-decoration: none;
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#e5e5e5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e5e5e5;padding:24px 8px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
            <tr>
              <td style="background-color:#ffffff;border-radius:10px;border:1px solid #e5e5e5;overflow:hidden;">

                <!-- HEADER EVENT NAME -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="padding:24px 24px 8px 24px;">
                      <p style="margin:0 0 4px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#9ca3af;">
                        Plaza confirmada
                      </p>
                      <h1 style="margin:0;font-size:22px;line-height:1.35;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:${heroColor};">
                        ${escapeForHtml(props.eventName)}
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:6px 24px 16px 24px;">
                      <span style="display:inline-block;padding:6px 14px;border-radius:999px;border:1px solid #bbf7d0;background-color:#ecfdf3;font-size:11px;font-weight:600;color:#166534;">
                        ✓ Pago confirmado
                      </span>
                    </td>
                  </tr>
                </table>

                <!-- GREETING -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:0 24px 16px 24px;">
                      <p style="margin:0 0 6px 0;font-size:15px;font-weight:600;color:#111827;">
                        Hola ${escapeForHtml(props.name)},
                      </p>
                      <p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">
                        ${escapeForHtml(introMessage)}
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- WHATSAPP -->
                ${whatsappSection}

                <!-- EVENT INFO -->
                ${eventInfoBox}

                <!-- BOOKING BOX -->
                ${bookingBox}

                <!-- FEATURES -->
                ${featuresSection}

                <!-- CALENDAR -->
                ${calendarSection}

                <!-- IMPORTANT NOTE -->
                ${importantNoteSection}

                <!-- CTA BUTTONS -->
                ${ctaSection}

                <!-- FOOTER -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e5e7eb;">
                  <tr>
                    <td align="center" style="padding:18px 24px 18px 24px;">
                      <p style="margin:0 0 4px 0;font-size:12px;color:#9ca3af;">
                        Nos vemos en la montaña 🏔️
                      </p>
                      <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;letter-spacing:0.08em;color:#f97316;">
                        PROYECTO CUMBRE
                      </p>
                      <p style="margin:0 0 4px 0;font-size:12px;color:#9ca3af;">
                        📧 info@proyecto-cumbre.es
                      </p>
                      <p style="margin:0;font-size:11px;color:#9ca3af;">
                        Email automático ·
                        <a href="mailto:info@proyecto-cumbre.es" style="color:#6b7280;text-decoration:underline;">Contacto</a>
                      </p>
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

// Caja genérica tipo “card” para reservas / información
function buildBox(params: { title: string; content: string }): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:0 24px 20px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:8px;border:1px solid #e5e7eb;">
        <tr>
          <td style="padding:14px 16px 8px 16px;">
            <p style="margin:0 0 8px 0;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">
              ${escapeForHtml(params.title)}
            </p>
          </td>
        </tr>
        ${params.content}
      </table>
    </td>
  </tr>
</table>
`;
}

// Fila de info de evento (icono + label + valor)
function eventInfoRow(label: string, value: string, isLast?: boolean): string {
  return `
<tr>
  <td style="padding:8px 16px ${isLast ? '14px' : '8px'} 16px;border-bottom:${
    isLast ? '0' : '1px solid #e5e7eb'
  };">
    <p style="margin:0 0 2px 0;font-size:13px;font-weight:600;color:#111827;">
      ${label}
    </p>
    <p style="margin:0;font-size:13px;line-height:1.6;color:#4b5563;">
      ${value}
    </p>
  </td>
</tr>
`;
}

// Fila de reserva (label + value)
function bookingRow(
  label: string,
  value: string,
  isLast?: boolean,
  accentColor?: string,
): string {
  return `
<tr>
  <td style="padding:8px 16px ${isLast ? '14px' : '8px'} 16px;border-bottom:${
    isLast ? '0' : '1px solid #e5e7eb'
  };">
    <p style="margin:0 0 2px 0;font-size:12px;color:#6b7280;">
      ${escapeForHtml(label)}
    </p>
    <p style="margin:0;font-size:14px;font-weight:${
      accentColor ? '700' : '500'
    };color:${accentColor || '#111827'};">
      ${escapeForHtml(value)}
    </p>
  </td>
</tr>
`;
}

// Bloque WhatsApp
function buildWhatsAppBox(link: string, message: string): string {
  const safeLink = link;
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:0 24px 20px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px;border:1px solid #bbf7d0;background-color:#ecfdf3;">
        <tr>
          <td style="padding:14px 16px;">
            <p style="margin:0 0 6px 0;font-size:13px;font-weight:600;color:#166534;">
              💬 Grupo de WhatsApp del evento
            </p>
            <p style="margin:0 0 10px 0;font-size:13px;line-height:1.6;color:#166534;">
              ${escapeForHtml(message)}
            </p>
            <a href="${safeLink}" target="_blank" style="display:inline-block;padding:7px 14px;border-radius:999px;background-color:#16a34a;color:#ffffff;font-size:12px;font-weight:600;">
              Unirme al grupo
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
}

// Fila de “qué incluye”
function featureRow(icon: string, title: string, description?: string): string {
  return `
<tr>
  <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td valign="top" width="26" style="padding-right:8px;font-size:18px;">
          ${escapeForHtml(icon)}
        </td>
        <td valign="top">
          <p style="margin:0 0 2px 0;font-size:13px;font-weight:600;color:#111827;">
            ${escapeForHtml(title)}
          </p>
          ${
            description
              ? `<p style="margin:0;font-size:12px;line-height:1.6;color:#4b5563;">${escapeForHtml(
                  description,
                )}</p>`
              : ''
          }
        </td>
      </tr>
    </table>
  </td>
</tr>
`;
}

// Caja de “nota importante”
function buildImportantBox(
  icon: string,
  title: string,
  message: string,
  accentColor: string,
): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:0 24px 20px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fffbeb;border-radius:8px;border:1px solid #fed7aa;">
        <tr>
          <td style="padding:14px 16px;">
            <p style="margin:0 0 4px 0;font-size:13px;font-weight:600;color:${accentColor};">
              ${escapeForHtml(icon)} ${escapeForHtml(title)}
            </p>
            <p style="margin:0;font-size:13px;line-height:1.6;color:#92400e;">
              ${escapeForHtml(message)}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
}

// Botones (primary / secondary)
function buildButton(
  text: string,
  url: string,
  variant: 'primary' | 'secondary',
  accentColor: string,
): string {
  const safeUrl = url;
  const isPrimary = variant === 'primary';

  return `
<a href="${safeUrl}" target="_blank" style="display:inline-block;margin:0 4px 6px 4px;padding:9px 16px;border-radius:999px;border:1px solid ${
    isPrimary ? accentColor : '#d1d5db'
  };background-color:${
    isPrimary ? accentColor : '#ffffff'
  };font-size:13px;font-weight:600;color:${
    isPrimary ? '#ffffff' : '#111827'
  };">
  ${escapeForHtml(text)}
</a>
`;
}

// Caja de “Añadir al calendario”
function buildCalendarBox(
  links: { googleUrl: string; icsUrl: string; outlookUrl: string },
  eventName: string,
): string {
  const fileName = eventName.toLowerCase().replace(/\s+/g, '-');

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:0 24px 20px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">
            <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">
              Añadir al calendario
            </p>
          </td>
        </tr>

        <!-- Google Calendar -->
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;">
            <a href="${links.googleUrl}" target="_blank" style="display:block;">
              <span style="font-size:13px;font-weight:600;color:#111827;">Google Calendar</span>
            </a>
          </td>
        </tr>

        <!-- Apple / iCal (.ics) -->
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;">
            <a href="${links.icsUrl}" download="${fileName}.ics" style="display:block;">
              <span style="font-size:13px;font-weight:600;color:#111827;">Apple / iCal (.ics)</span>
            </a>
          </td>
        </tr>

        <!-- Outlook -->
        <tr>
          <td style="padding:10px 16px;">
            <a href="${links.outlookUrl}" target="_blank" style="display:block;">
              <span style="font-size:13px;font-weight:600;color:#111827;">Outlook</span>
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
}

// ===================
// TEXT
// ===================

function generateEventText(props: EventMailProps): string {
  return `
PLAZA CONFIRMADA - ${props.eventName.toUpperCase()}

Hola ${props.name},

Tu plaza para ${props.eventName} está confirmada.

${
  props.eventDate
    ? `FECHA: ${formatEventDate(props.eventDate)} - ${formatEventTime(props.eventDate)}`
    : ''
}
${props.eventLocation ? `UBICACIÓN: ${props.eventLocation}` : ''}${
    props.eventDetails?.meetingPoint
      ? `\nPUNTO DE ENCUENTRO: ${props.eventDetails.meetingPoint}`
      : ''
  }

TU RESERVA:
Nombre: ${props.name}
Email: ${props.email}
Teléfono: ${props.phone}
${props.dni ? `DNI/NIE: ${props.dni}\n` : ''}${
    props.shirtSize ? `Talla: ${props.shirtSize}\n` : ''
  }Importe: ${(props.amount / 100).toFixed(2)}€

${
  props.whatsappLink
    ? `⚠️ IMPORTANTE: Únete al grupo de WhatsApp para recibir toda la información del evento.\n${props.whatsappLink}\n`
    : ''
}
Nos vemos en la montaña 🏔️

PROYECTO CUMBRE
info@proyecto-cumbre.es
  `.trim();
}

// ===================
// HELPERS
// ===================

function formatEventDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatEventTime(date: Date): string {
  return (
    date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) + 'h'
  );
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
  const defaultStartTime = event.date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const startTime = event.startTime || defaultStartTime;

  const endDate = new Date(event.date);
  endDate.setHours(endDate.getHours() + 4);
  const defaultEndTime = endDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const endTime = event.endTime || defaultEndTime;

  const description = event.description || '';
  const location = event.location || '';
  const startDateTime = `${dateStr.replace(/-/g, '')}T${startTime.replace(
    /:/g,
    '',
  )}00`;
  const endDateTime = `${dateStr.replace(/-/g, '')}T${endTime.replace(
    /:/g,
    '',
  )}00`;

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title,
  )}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(
    description,
  )}&location=${encodeURIComponent(location)}`;

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

  const icsUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(
    icsContent,
  )}`;
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
    event.title,
  )}&startdt=${dateStr}T${startTime}&enddt=${dateStr}T${endTime}&body=${encodeURIComponent(
    description,
  )}&location=${encodeURIComponent(location)}`;

  return { googleUrl, icsUrl, outlookUrl };
}

// Escapar texto básico para HTML
function escapeForHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
