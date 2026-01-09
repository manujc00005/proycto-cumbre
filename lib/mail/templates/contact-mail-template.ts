// ========================================
// CONTACT FORM EMAIL TEMPLATE - MODULAR
// Dark theme guaranteed across all clients
// Admin notification for contact form submissions
// lib/mail/templates/contact-mail-template.ts
// ========================================

import {
  emailBase,
  emailHeader,
  statusBadge,
  contentWrapper,
  contentBox,
  detailRow,
  infoBox,
  emailFooter,
  escapeHtml,
} from '../email-components';

export interface ContactMailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function buildContactMail(props: ContactMailProps): {
  subject: string;
  html: string;
  text: string;
} {
  return {
    subject: `[Contacto Web] ${props.subject}`,
    html: generateContactHTML(props),
    text: generateContactText(props),
  };
}

function generateContactHTML(props: ContactMailProps): string {
  // Sender information
  const senderInfoContent = 
    detailRow('Nombre', props.name) +
    detailRow('Email', `<a href="mailto:${props.email}" style="color: #f97316 !important; text-decoration: none;">${props.email}</a>`) +
    detailRow('Asunto', props.subject, { isLast: true });
  
  // Message box with border accent
  const messageContent = `
    <h3 style="color: #e4e4e7 !important; font-size: 13px; font-weight: 600; margin: 0 0 14px 0; text-transform: uppercase; letter-spacing: 0.8px; line-height: 1.3;">Mensaje</h3>
    <p style="color: #fafafa !important; font-size: 14px; line-height: 1.8; margin: 0; white-space: pre-wrap;">${escapeHtml(props.message)}</p>
  `;
  
  // Build email content
  const content = [
    emailHeader('FORMULARIO DE CONTACTO'),
    statusBadge({
      icon: '📧',
      title: 'Nuevo mensaje de contacto',
      subtitle: 'Recibido desde la web',
    }),
    contentWrapper(
      contentBox({
        title: 'Información del remitente',
        content: senderInfoContent,
      }) +
      contentBox({
        title: '',
        content: messageContent,
        accentColor: '#f97316',
      }) +
      infoBox({
        icon: '💡',
        title: 'Tip',
        message: `Responde directamente a este email para contactar con ${props.name}.`,
        marginBottom: '0',
      })
    ),
    emailFooter('Mensaje recibido desde proyecto-cumbre.es', false),
  ].join('');
  
  return emailBase(content);
}

function generateContactText(props: ContactMailProps): string {
  return `
NUEVO MENSAJE DE CONTACTO

INFORMACIÓN DEL REMITENTE:
Nombre: ${props.name}
Email: ${props.email}
Asunto: ${props.subject}

MENSAJE:
${props.message}

---
Responde directamente a este email para contactar con ${props.name}.

Proyecto Cumbre
proyecto-cumbre.es
  `.trim();
}
