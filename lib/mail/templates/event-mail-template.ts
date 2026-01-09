// ========================================
// EVENT EMAIL TEMPLATE - 100% FLEXIBLE & REUSABLE
// Dark theme guaranteed across all clients
// Supports any event type with props-driven content
// lib/mail/templates/event-mail-template.ts
// ========================================

import {
  emailBase,
  contentWrapper,
  greetingSection,
  contentBox,
  detailRow,
  whatsAppBlock,
  eventDetailRow,
  featureItem,
  infoBox,
  primaryButton,
  secondaryButton,
  emailFooter,
  escapeHtml,
} from '../email-components';

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
  
  // Event header
  const eventHeader = `
<tr>
  <td bgcolor="#0a0a0a" style="padding: 48px 40px 24px 40px; text-align: center; background-color: #0a0a0a !important;">
    <h1 style="color: ${heroColor} !important; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;">${props.eventName}</h1>
  </td>
</tr>
  `;
  
  // Payment status badge
  const paymentBadge = `
<tr>
  <td bgcolor="#0a0a0a" style="padding: 0 40px 40px 40px; text-align: center; background-color: #0a0a0a !important;">
    <div style="display: inline-block; background-color: #18181b !important; border: 1px solid #27272a; border-radius: 6px; padding: 10px 22px;">
      <span style="color: #10b981 !important; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; line-height: 1;">✓ PAGO CONFIRMADO</span>
    </div>
  </td>
</tr>
  `;
  
  // Build greeting
  const greeting = greetingSection(
    props.name,
    `Tu plaza para ${props.eventName} está confirmada. A continuación tienes la información esencial para el evento.`
  );
  
  // WhatsApp block
  let whatsappSection = '';
  if (hasWhatsApp) {
    whatsappSection = whatsAppBlock({
      link: props.whatsappLink!,
      message: props.whatsappMessage || 'Toda la comunicación logística del evento (coordenadas, avisos y cambios) se realizará exclusivamente a través del grupo de WhatsApp.',
    });
  }
  
  // Event information
  let eventInfoSection = '';
  if (props.eventDate || props.eventLocation || props.eventDetails) {
    let eventDetailsContent = '';
    
    if (props.eventDate) {
      eventDetailsContent += eventDetailRow(
        '📅',
        'Fecha y hora',
        `${formatEventDate(props.eventDate)}<br/>${formatEventTime(props.eventDate)}`
      );
    }
    
    if (props.eventLocation) {
      eventDetailsContent += eventDetailRow('📍', 'Ubicación', props.eventLocation);
    }
    
    if (props.eventDetails?.meetingPoint) {
      eventDetailsContent += eventDetailRow('🚩', 'Punto de encuentro', props.eventDetails.meetingPoint);
    }
    
    if (props.eventDetails?.duration) {
      eventDetailsContent += eventDetailRow('⏱️', 'Duración', props.eventDetails.duration);
    }
    
    if (props.eventDetails?.difficulty) {
      eventDetailsContent += eventDetailRow('📊', 'Nivel', props.eventDetails.difficulty);
    }
    
    if (props.eventDetails?.requiredEquipment) {
      eventDetailsContent += eventDetailRow(
        '🎒',
        'Material necesario',
        props.eventDetails.requiredEquipment,
        true
      );
    }
    
    if (eventDetailsContent) {
      eventInfoSection = contentBox({
        title: 'Información del evento',
        content: eventDetailsContent,
      });
    }
  }
  
  // Booking details
  let bookingDetailsContent = '';
  bookingDetailsContent += detailRow('Nombre', props.name);
  bookingDetailsContent += detailRow('Email', props.email);
  bookingDetailsContent += detailRow('Teléfono', props.phone);
  
  if (props.dni) {
    bookingDetailsContent += detailRow('DNI/NIE', props.dni);
  }
  
  if (props.shirtSize) {
    bookingDetailsContent += detailRow('Talla', props.shirtSize);
  }
  
  if (props.customDetails) {
    props.customDetails.forEach(detail => {
      bookingDetailsContent += detailRow(detail.label, detail.value);
    });
  }
  
  bookingDetailsContent += detailRow('Importe', `${(props.amount / 100).toFixed(2)}€`, {
    valueColor: heroColor,
    valueFontWeight: '700',
    valueFontSize: '16px',
    isLast: true,
  });
  
  const bookingBox = contentBox({
    title: 'Tu reserva',
    content: bookingDetailsContent,
  });
  
  // Features section
  let featuresSection = '';
  if (props.features && props.features.length > 0) {
    let featuresContent = '<h3 style="color: #ffffff !important; font-size: 14px; font-weight: 700; margin: 0 0 18px 0; letter-spacing: 0.3px; line-height: 1.4;">Qué incluye</h3>';
    
    featuresContent += props.features.map((feature, index) => 
      featureItem(
        feature.icon,
        feature.title,
        feature.description,
        index === props.features!.length - 1
      )
    ).join('');
    
    featuresSection = `
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 32px 0;">
  <tr>
    <td>
      ${featuresContent}
    </td>
  </tr>
</table>
    `;
  }
  
  // Calendar section
  let calendarSection = '';
  if (calendarLinks) {
    calendarSection = `
<table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#18181b" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 8px; overflow: hidden; margin: 0 0 32px 0;">
  <tr>
    <td>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding: 14px 20px; border-bottom: 1px solid #27272a;">
        <tr>
          <td>
            <span style="color: #a1a1aa !important; font-size: 11px; font-weight: 600; letter-spacing: 0.8px; line-height: 1;">AÑADIR AL CALENDARIO</span>
          </td>
        </tr>
      </table>

      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding: 14px 20px; border-bottom: 1px solid #27272a;">
            <a href="${calendarLinks.googleUrl}" target="_blank" style="text-decoration: none; display: block;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="28" valign="middle">
                    <span style="display: inline-block; width: 24px; height: 24px; background-color: #4285f4; border-radius: 5px; text-align: center; line-height: 24px; color: #ffffff !important; font-size: 13px; font-weight: 700;">G</span>
                  </td>
                  <td valign="middle" style="padding-left: 12px;">
                    <span style="color: #e4e4e7 !important; font-size: 13px; font-weight: 600; line-height: 1.4;">Google Calendar</span>
                  </td>
                  <td width="20" valign="middle" align="right">
                    <span style="color: #71717a !important; font-size: 15px; line-height: 1;">→</span>
                  </td>
                </tr>
              </table>
            </a>
          </td>
        </tr>
      </table>

      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding: 14px 20px; border-bottom: 1px solid #27272a;">
            <a href="${calendarLinks.icsUrl}" download="${props.eventName.toLowerCase().replace(/\s+/g, '-')}.ics" style="text-decoration: none; display: block;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="28" valign="middle">
                    <span style="font-size: 20px; line-height: 1;">🍎</span>
                  </td>
                  <td valign="middle" style="padding-left: 12px;">
                    <span style="color: #e4e4e7 !important; font-size: 13px; font-weight: 600; line-height: 1.4;">Apple / iCal</span>
                  </td>
                  <td width="20" valign="middle" align="right">
                    <span style="color: #71717a !important; font-size: 15px; line-height: 1;">↓</span>
                  </td>
                </tr>
              </table>
            </a>
          </td>
        </tr>
      </table>

      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding: 14px 20px;">
            <a href="${calendarLinks.outlookUrl}" target="_blank" style="text-decoration: none; display: block;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="28" valign="middle">
                    <span style="display: inline-block; width: 24px; height: 24px; background-color: #0078d4; border-radius: 5px; text-align: center; line-height: 24px; color: #ffffff !important; font-size: 13px; font-weight: 700;">O</span>
                  </td>
                  <td valign="middle" style="padding-left: 12px;">
                    <span style="color: #e4e4e7 !important; font-size: 13px; font-weight: 600; line-height: 1.4;">Outlook</span>
                  </td>
                  <td width="20" valign="middle" align="right">
                    <span style="color: #71717a !important; font-size: 15px; line-height: 1;">→</span>
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
    `;
  }
  
  // Important note
  let importantNoteSection = '';
  if (props.importantNote) {
    importantNoteSection = infoBox({
      icon: props.importantNote.icon || '⚠️',
      title: props.importantNote.title,
      message: props.importantNote.message,
      accentColor: heroColor,
    });
  }
  
  // CTA buttons
  let ctaSection = '';
  if (props.ctaButtons && props.ctaButtons.length > 0) {
    ctaSection = `
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 32px 0;">
  <tr>
    <td align="center">
      ${props.ctaButtons.map(btn => {
        return btn.style === 'secondary'
          ? secondaryButton(btn.text, btn.url)
          : primaryButton(btn.text, btn.url, heroColor);
      }).join('')}
    </td>
  </tr>
</table>
    `;
  }
  
  // Assemble email
  const content = [
    eventHeader,
    paymentBadge,
    contentWrapper(
      greeting +
      whatsappSection +
      eventInfoSection +
      bookingBox +
      featuresSection +
      calendarSection +
      importantNoteSection +
      ctaSection
    ),
    emailFooter('Nos vemos en la montaña 🏔️', true),
  ].join('');
  
  return emailBase(content);
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
