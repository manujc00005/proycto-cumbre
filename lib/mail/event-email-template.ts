// ========================================
// EVENT EMAIL TEMPLATE - MINIMALISTA
// 🎯 Marketing optimized
// 🎨 Clean & Compact
// 📱 Mobile-first
// lib/email/event-email-template.ts
// ========================================

import { BaseEventEmailData, EventEmailConfig } from './types';

export function buildEventEmail(
  participant: BaseEventEmailData,
  config: EventEmailConfig
): string {
  const heroColor = config.heroColor || '#f97316';
  const heroGradient = `linear-gradient(135deg, ${heroColor} 0%, ${adjustBrightness(heroColor, -20)} 100%)`;

  // Google Calendar link
  const calendarLink = config.eventDate 
    ? generateGoogleCalendarLink({
        title: config.eventName,
        date: config.eventDate,
        location: config.eventLocation || '',
        description: `Inscripción confirmada para ${config.eventName}`
      })
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
      color: #fafafa;
      background-color: #09090b;
      padding: 0;
      margin: 0;
    }
    
    .email-wrapper {
      width: 100%;
      background-color: #09090b;
      padding: 20px 10px;
    }
    .container { 
      max-width: 580px; 
      margin: 0 auto; 
      background-color: #18181b;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #27272a;
    }
    
    /* HERO MINIMALISTA */
    .hero {
      background: ${heroGradient};
      padding: 30px 24px;
      text-align: center;
    }
    .hero h1 {
      color: #ffffff;
      font-size: 28px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.5px;
    }
    
    /* SUCCESS COMPACT */
    .success {
      background: #065f46;
      padding: 16px 24px;
      text-align: center;
      border-bottom: 2px solid #10b981;
    }
    .success-text {
      font-size: 15px;
      font-weight: 600;
      color: #d1fae5;
      margin: 0;
    }
    
    /* CONTENT */
    .content { 
      padding: 32px 24px;
    }
    
    .greeting {
      font-size: 16px;
      color: #fafafa;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    /* EVENT INFO CARD */
    .event-card {
      background: linear-gradient(135deg, #27272a 0%, #1f1f23 100%);
      border: 1px solid #3f3f46;
      border-radius: 10px;
      padding: 20px;
      margin: 24px 0;
    }
    
    .event-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #3f3f46;
    }
    .event-header .icon {
      font-size: 20px;
    }
    .event-header h3 {
      color: ${heroColor};
      font-size: 15px;
      font-weight: 700;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .event-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 0;
    }
    .event-row .icon {
      font-size: 18px;
      flex-shrink: 0;
      width: 24px;
      color: ${heroColor};
    }
    .event-row .content-text {
      flex: 1;
    }
    .event-row .label {
      color: #a1a1aa;
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 2px;
    }
    .event-row .value {
      color: #fafafa;
      font-size: 14px;
      font-weight: 600;
    }
    
    /* CALENDAR CTA */
    .calendar-cta {
      background: #27272a;
      border: 1px dashed #3f3f46;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      margin: 16px 0;
    }
    .calendar-cta a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: ${heroColor};
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: opacity 0.2s;
    }
    .calendar-cta a:hover {
      opacity: 0.8;
    }
    
    /* PARTICIPANT DETAILS - COMPACT */
    .details-compact {
      background: #27272a;
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #3f3f46;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #a1a1aa;
      font-size: 13px;
    }
    .detail-value {
      color: #fafafa;
      font-weight: 600;
      font-size: 13px;
      text-align: right;
    }
    .detail-value.highlight {
      color: ${heroColor};
      font-size: 16px;
    }
    
    /* FEATURES - COMPACT */
    .features {
      margin: 24px 0;
    }
    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 0;
    }
    .feature-icon {
      font-size: 20px;
      flex-shrink: 0;
      width: 28px;
    }
    .feature-text {
      flex: 1;
    }
    .feature-title {
      color: #fafafa;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 2px;
    }
    .feature-description {
      color: #a1a1aa;
      font-size: 12px;
      line-height: 1.4;
    }
    
    /* WHATSAPP - COMPACT */
    .whatsapp {
      background: linear-gradient(135deg, #065f46 0%, #047857 100%);
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      margin: 24px 0;
    }
    .whatsapp h3 {
      color: #ffffff;
      font-size: 16px;
      margin-bottom: 8px;
      font-weight: 700;
    }
    .whatsapp p {
      color: #d1fae5;
      margin-bottom: 16px;
      font-size: 13px;
      line-height: 1.5;
    }
    .whatsapp-button {
      display: inline-block;
      background-color: #25D366;
      color: #ffffff;
      padding: 12px 28px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
    }
    
    /* ALERT - COMPACT */
    .alert {
      background: #422006;
      border: 1px solid #7c2d12;
      border-left: 3px solid ${heroColor};
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
      display: flex;
      gap: 12px;
    }
    .alert-icon {
      font-size: 20px;
      flex-shrink: 0;
    }
    .alert-content {
      flex: 1;
    }
    .alert-title {
      color: #fbbf24;
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 6px;
    }
    .alert-text {
      color: #fcd34d;
      font-size: 13px;
      line-height: 1.5;
      margin: 0;
    }
    
    /* FOOTER - MINIMAL */
    .footer { 
      text-align: center; 
      padding: 24px;
      background-color: #09090b;
      border-top: 1px solid #27272a;
    }
    .footer-logo {
      font-size: 16px;
      font-weight: 700;
      color: ${heroColor};
      margin-bottom: 12px;
    }
    .footer p {
      color: #71717a;
      font-size: 12px;
      margin: 4px 0;
      line-height: 1.5;
    }
    .footer a {
      color: ${heroColor};
      text-decoration: none;
    }
    
    /* RESPONSIVE */
    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 10px 5px; }
      .hero { padding: 24px 16px; }
      .hero h1 { font-size: 24px; }
      .content { padding: 24px 16px; }
      .event-card { padding: 16px; }
      .detail-row { flex-direction: column; gap: 4px; }
      .detail-value { text-align: left; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      
      <!-- HERO LIMPIO -->
      <div class="hero">
        <h1>${config.eventName}</h1>
      </div>
      
      <!-- SUCCESS COMPACT -->
      <div class="success">
        <p class="success-text">✓ Tu pago se ha procesado correctamente</p>
      </div>
      
      <!-- CONTENT -->
      <div class="content">
        
        <!-- GREETING -->
        <p class="greeting">Hola ${participant.name} 👋</p>
        <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px;">
          Tu reserva ha sido confirmada. A continuación encontrarás todos los detalles.
        </p>
        
        ${config.eventDate || config.eventLocation || config.eventDetails ? `
        <!-- EVENT INFO -->
        <div class="event-card">
          <div class="event-header">
            <span class="icon">📅</span>
            <h3>Detalles del Evento</h3>
          </div>
          
          ${config.eventDate ? `
          <div class="event-row">
            <span class="icon">📅</span>
            <div class="content-text">
              <div class="label">Fecha y hora</div>
              <div class="value">${formatEventDate(config.eventDate)}</div>
              <div class="value">${formatEventTime(config.eventDate)}</div>
            </div>
          </div>
          ` : ''}
          
          ${config.eventLocation ? `
          <div class="event-row">
            <span class="icon">📍</span>
            <div class="content-text">
              <div class="label">Ubicación</div>
              <div class="value">${config.eventLocation}</div>
            </div>
          </div>
          ` : ''}
          
          ${config.eventDetails?.meetingPoint ? `
          <div class="event-row">
            <span class="icon">🚩</span>
            <div class="content-text">
              <div class="label">Punto de encuentro</div>
              <div class="value">${config.eventDetails.meetingPoint}</div>
            </div>
          </div>
          ` : ''}
          
          ${config.eventDetails?.duration ? `
          <div class="event-row">
            <span class="icon">⏱️</span>
            <div class="content-text">
              <div class="label">Duración estimada</div>
              <div class="value">${config.eventDetails.duration}</div>
            </div>
          </div>
          ` : ''}
          
          ${config.eventDetails?.difficulty ? `
          <div class="event-row">
            <span class="icon">📊</span>
            <div class="content-text">
              <div class="label">Nivel</div>
              <div class="value">${config.eventDetails.difficulty}</div>
            </div>
          </div>
          ` : ''}
          
          ${config.eventDetails?.requiredEquipment ? `
          <div class="event-row">
            <span class="icon">🎒</span>
            <div class="content-text">
              <div class="label">Material obligatorio</div>
              <div class="value">${config.eventDetails.requiredEquipment}</div>
            </div>
          </div>
          ` : ''}
          
          ${calendarLink ? `
          <!-- CALENDAR CTA -->
          <div class="calendar-cta">
            <a href="${calendarLink}" target="_blank">
              <span>📆</span>
              <span>Añadir a Google Calendar</span>
            </a>
          </div>
          ` : ''}
        </div>
        ` : ''}
        
        <!-- PARTICIPANT DETAILS -->
        <div class="details-compact">
          <div class="detail-row">
            <span class="detail-label">Nombre</span>
            <span class="detail-value">${participant.name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email</span>
            <span class="detail-value">${participant.email}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Teléfono</span>
            <span class="detail-value">${participant.phone}</span>
          </div>
          ${participant.dni ? `
          <div class="detail-row">
            <span class="detail-label">DNI/NIE</span>
            <span class="detail-value">${participant.dni}</span>
          </div>
          ` : ''}
          ${participant.shirtSize ? `
          <div class="detail-row">
            <span class="detail-label">Talla</span>
            <span class="detail-value">${participant.shirtSize}</span>
          </div>
          ` : ''}
          ${config.customDetails ? config.customDetails.map(detail => `
          <div class="detail-row">
            <span class="detail-label">${detail.label}</span>
            <span class="detail-value">${detail.value}</span>
          </div>
          `).join('') : ''}
          <div class="detail-row">
            <span class="detail-label">Importe</span>
            <span class="detail-value highlight">${(participant.amount / 100).toFixed(2)}€</span>
          </div>
        </div>
        
        ${config.features && config.features.length > 0 ? `
        <!-- FEATURES COMPACT -->
        <div class="features">
          ${config.features.map(feature => `
            <div class="feature-item">
              <div class="feature-icon">${feature.icon}</div>
              <div class="feature-text">
                <div class="feature-title">${feature.title}</div>
                ${feature.description ? `<div class="feature-description">${feature.description}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${config.whatsappLink ? `
        <!-- WHATSAPP COMPACT -->
        <div class="whatsapp">
          <h3>💬 Grupo de WhatsApp</h3>
          <p>${config.whatsappMessage || 'Únete al grupo para recibir actualizaciones y conectar con otros participantes.'}</p>
          <a href="${config.whatsappLink}" class="whatsapp-button">Unirse →</a>
        </div>
        ` : ''}
        
        ${config.importantNote ? `
        <!-- ALERT COMPACT -->
        <div class="alert">
          <div class="alert-icon">${config.importantNote.icon || '⚠️'}</div>
          <div class="alert-content">
            <div class="alert-title">${config.importantNote.title}</div>
            <p class="alert-text">${config.importantNote.message}</p>
          </div>
        </div>
        ` : ''}
        
        <!-- CLOSING -->
        <p style="margin-top: 32px; color: #fafafa; font-size: 14px; text-align: center;">
          ¡Nos vemos pronto! 🏔️
        </p>
      </div>
      
      <!-- FOOTER MINIMAL -->
      <div class="footer">
        <div class="footer-logo">PROYECTO CUMBRE</div>
        <p>Email automático · No responder</p>
        <p>Contacto: <a href="mailto:info@proyecto-cumbre.es">info@proyecto-cumbre.es</a></p>
        <p style="margin-top: 12px;">© ${new Date().getFullYear()} Proyecto Cumbre</p>
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

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + percent));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + percent));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function formatEventDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function formatEventTime(date: Date): string {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }) + 'h';
}

function generateGoogleCalendarLink(event: {
  title: string;
  date: Date;
  location: string;
  description: string;
}): string {
  const startDate = event.date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  // Asumimos 4 horas de duración por defecto
  const endDate = new Date(event.date);
  endDate.setHours(endDate.getHours() + 4);
  const endDateStr = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDate}/${endDateStr}`,
    details: event.description,
    location: event.location,
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
