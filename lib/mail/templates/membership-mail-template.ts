// ========================================
// MEMBERSHIP EMAIL TEMPLATE - MODULAR
// Dark theme guaranteed across all clients
// Handles success/failed/pending payment states
// lib/mail/templates/membership-mail-template.ts
// ========================================

import { formatShortLicenseType } from '@/lib/constants';
import {
  emailBase,
  emailHeader,
  statusBadge,
  contentWrapper,
  greetingSection,
  contentBox,
  detailRow,
  infoBox,
  emailFooter,
} from '../email-components';

export type MembershipPaymentStatus = 'success' | 'failed' | 'pending';

export interface MembershipMailProps {
  paymentStatus: MembershipPaymentStatus;
  email: string;
  firstName: string;
  lastName: string;
  memberNumber?: string;
  licenseType?: string;
  amount?: number;
  currency?: string;
  validUntil?: Date;
}

export function buildMembershipMail(props: MembershipMailProps): {
  subject: string;
  html: string;
  text: string;
} {
  const isSuccess = props.paymentStatus === 'success';
  const subject = isSuccess
    ? '¡Bienvenido a Proyecto Cumbre! 🏔️'
    : props.paymentStatus === 'pending'
    ? '⏳ Procesando tu membresía - Proyecto Cumbre'
    : '⚠️ Problema con tu pago - Proyecto Cumbre';

  return {
    subject,
    html: isSuccess ? generateSuccessHTML(props) : generateFailedHTML(props),
    text: isSuccess ? generateSuccessText(props) : generateFailedText(props),
  };
}

function generateSuccessHTML(props: MembershipMailProps): string {
  const hasLicense = props.licenseType && props.licenseType !== 'none';
  
  // Build membership details
  let detailsContent = '';
  
  if (props.memberNumber) {
    detailsContent += detailRow('Número de Socio', props.memberNumber);
  }
  
  detailsContent += detailRow('Nombre', `${props.firstName} ${props.lastName}`);
  detailsContent += detailRow('Estado', 'ACTIVO', {
    valueColor: '#10b981',
    isLast: !hasLicense,
  });
  
  if (hasLicense && props.licenseType) {
    detailsContent += detailRow(
      'Licencia FEDME',
      formatShortLicenseType(props.licenseType),
      { isLast: true }
    );
  }
  
  // Build content sections
  const greeting = greetingSection(
    props.firstName,
    '¡Gracias por unirte a nuestro club de montaña! Estamos encantados de tenerte como socio.'
  );
  
  const membershipBox = contentBox({
    title: 'Detalles de tu membresía',
    content: detailsContent,
  });
  
  let licenseInfoBox = '';
  if (hasLicense) {
    licenseInfoBox = infoBox({
      icon: '📋',
      title: 'Sobre tu licencia federativa',
      message: 'Tu licencia FEDME será procesada en 48-72 horas. Te notificaremos cuando esté activa.',
    });
  }
  
  const closingMessage = '<p style="color: #a1a1aa !important; font-size: 14px; line-height: 1.7; margin: 0 0 32px 0;">Ya puedes participar en todas nuestras actividades. ¡Nos vemos en la montaña!</p>';
  
  // Assemble email
  const content = [
    emailHeader('CLUB DE MONTAÑA'),
    statusBadge({
      icon: '✓',
      title: 'Pago completado',
      subtitle: 'Tu membresía está activa',
      accentColor: '#10b981',
      amount: props.amount ? `${(props.amount / 100).toFixed(2)}€` : undefined,
    }),
    contentWrapper(
      greeting +
      membershipBox +
      licenseInfoBox +
      closingMessage
    ),
    emailFooter('Bienvenido al club', true),
  ].join('');
  
  return emailBase(content);
}

function generateFailedHTML(props: MembershipMailProps): string {
  const greeting = greetingSection(
    props.firstName,
    'Hemos recibido tu solicitud de membresía, pero hay un problema con el procesamiento del pago.'
  );
  
  const errorInfoContent = `
    <p style="color: #fafafa !important; font-size: 13px; font-weight: 600; margin: 0 0 14px 0; line-height: 1.4;">Qué ha ocurrido:</p>
    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0 0 8px 0;">• El pago fue rechazado o cancelado por tu banco</p>
    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0 0 8px 0;">• Tu membresía no ha sido activada</p>
    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0;">• No se te ha realizado ningún cargo</p>
  `;
  
  const solutionsContent = `
    <h3 style="color: #e4e4e7 !important; font-size: 13px; font-weight: 600; margin: 0 0 14px 0; text-transform: uppercase; letter-spacing: 0.8px; line-height: 1.3;">¿Qué puedes hacer?</h3>
    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0 0 8px 0;">• <strong style="color: #fafafa !important;">Reintentar el pago</strong> desde nuestra web usando otra tarjeta</p>
    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0 0 8px 0;">• <strong style="color: #fafafa !important;">Contactarnos</strong> si crees que hay un error: info@proyecto-cumbre.es</p>
    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0;">• <strong style="color: #fafafa !important;">Verificar con tu banco</strong> que la tarjeta permite pagos online internacionales</p>
  `;
  
  const content = [
    emailHeader('CLUB DE MONTAÑA'),
    statusBadge({
      icon: '⚠️',
      title: 'No se pudo completar el pago',
      subtitle: 'Tu membresía no ha sido activada',
      accentColor: '#71717a',
    }),
    contentWrapper(
      greeting +
      contentBox({
        title: 'Información del error',
        content: errorInfoContent,
      }) +
      contentBox({
        title: '',
        content: solutionsContent,
        marginBottom: '0',
      })
    ),
    emailFooter('Estamos aquí para ayudarte', true),
  ].join('');
  
  return emailBase(content);
}

function generateSuccessText(props: MembershipMailProps): string {
  const hasLicense = props.licenseType && props.licenseType !== 'none';

  return `
¡BIENVENIDO A PROYECTO CUMBRE!

Hola ${props.firstName},

¡Gracias por unirte a nuestro club de montaña! Estamos encantados de tenerte como socio.

DETALLES DE TU MEMBRESÍA:
${props.memberNumber ? `Número de Socio: ${props.memberNumber}` : ''}
Nombre: ${props.firstName} ${props.lastName}
Estado: ACTIVO
${hasLicense && props.licenseType ? `Licencia FEDME: ${formatShortLicenseType(props.licenseType)}` : 'Licencia FEDME: Sin licencia'}
${props.amount ? `Importe: ${(props.amount / 100).toFixed(2)}€` : ''}

${hasLicense ? '\n📋 SOBRE TU LICENCIA FEDERATIVA:\nTu licencia FEDME será procesada en 48-72 horas. Te notificaremos cuando esté activa.\n' : ''}

Ya puedes participar en todas nuestras actividades. ¡Nos vemos en la montaña!

Equipo Proyecto Cumbre
info@proyecto-cumbre.es
  `.trim();
}

function generateFailedText(props: MembershipMailProps): string {
  return `
PROBLEMA CON TU PAGO - PROYECTO CUMBRE

Hola ${props.firstName},

Hemos recibido tu solicitud de membresía, pero hay un problema con el procesamiento del pago.

QUÉ HA OCURRIDO:
• El pago fue rechazado o cancelado por tu banco
• Tu membresía no ha sido activada
• No se te ha realizado ningún cargo

¿QUÉ PUEDES HACER?
• Reintentar el pago desde nuestra web usando otra tarjeta
• Contactarnos si crees que hay un error: info@proyecto-cumbre.es
• Verificar con tu banco que la tarjeta permite pagos online internacionales

Estamos aquí para ayudarte.

Equipo Proyecto Cumbre
📧 info@proyecto-cumbre.es
  `.trim();
}
