// ========================================
// LICENSE EMAIL TEMPLATE - MODULAR
// Dark theme guaranteed across all clients
// Handles license activation notifications
// lib/mail/templates/license-mail-template.ts
// ========================================

import { formatLicenseType } from '@/lib/constants';
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

export type LicenseStatus = 'activated' | 'renewed' | 'expiring' | 'expired';

export interface LicenseMailProps {
  status: LicenseStatus;
  email: string;
  firstName: string;
  lastName?: string;
  memberNumber: string;
  licenseType: string;
  validFrom?: Date;
  validUntil: Date;
  licenseNumber?: string;
}

interface StatusConfig {
  icon: string;
  title: string;
  subtitle: string;
  accentColor: string;
}

const STATUS_CONFIGS: Record<LicenseStatus, StatusConfig> = {
  activated: {
    icon: '✓',
    title: 'Licencia activa',
    subtitle: 'Tu licencia FEDME está lista para usar',
    accentColor: '#10b981',
  },
  renewed: {
    icon: '↻',
    title: 'Licencia renovada',
    subtitle: 'Tu licencia FEDME ha sido renovada correctamente',
    accentColor: '#3b82f6',
  },
  expiring: {
    icon: '⚠️',
    title: 'Licencia próxima a expirar',
    subtitle: 'Renueva tu licencia antes de que expire',
    accentColor: '#f59e0b',
  },
  expired: {
    icon: '×',
    title: 'Licencia expirada',
    subtitle: 'Tu licencia FEDME ya no está activa',
    accentColor: '#ef4444',
  },
};

export function buildLicenseMail(props: LicenseMailProps): {
  subject: string;
  html: string;
  text: string;
} {
  const subjectMap: Record<LicenseStatus, string> = {
    activated: '✅ Tu licencia FEDME está activa',
    renewed: '✅ Tu licencia FEDME ha sido renovada',
    expiring: '⚠️ Tu licencia FEDME expira pronto',
    expired: '❌ Tu licencia FEDME ha expirado',
  };

  return {
    subject: subjectMap[props.status],
    html: generateLicenseHTML(props),
    text: generateLicenseText(props),
  };
}

function generateLicenseHTML(props: LicenseMailProps): string {
  const config = STATUS_CONFIGS[props.status];
  const isActive = ['activated', 'renewed'].includes(props.status);
  const isExpiring = props.status === 'expiring';
  const isExpired = props.status === 'expired';
  
  // Build license details
  let detailsContent = detailRow('Número de Socio', props.memberNumber);
  
  if (props.licenseNumber) {
    detailsContent += detailRow('Número de Licencia', props.licenseNumber, {
      fontFamily: "'Courier New', monospace",
    });
  }
  
  detailsContent += detailRow('Tipo de Licencia', formatLicenseType(props.licenseType));
  
  if (props.validFrom) {
    detailsContent += detailRow('Válida desde', formatDate(props.validFrom));
  }
  
  const validUntilColor = isExpired ? '#ef4444' : isExpiring ? '#f59e0b' : '#10b981';
  detailsContent += detailRow('Válida hasta', formatDate(props.validUntil), {
    valueColor: validUntilColor,
    isLast: true,
  });
  
  // Build content sections
  const greeting = greetingSection(props.firstName, getStatusMessage(props.status));
  
  const detailsBox = contentBox({
    title: 'Detalles de tu licencia',
    content: detailsContent,
  });
  
  // Conditional info boxes
  let conditionalInfo = '';
  
  if (isActive) {
    conditionalInfo = infoBox({
      icon: '📱',
      title: 'Accede en la app FEDME',
      message: 'Descarga la app oficial de FEDME para tener tu licencia siempre disponible en tu móvil.',
      marginBottom: '0',
    });
  } else if (isExpiring) {
    conditionalInfo = infoBox({
      icon: '⚠️',
      title: 'Acción requerida',
      message: 'Tu licencia expira pronto. Contacta con nosotros para renovarla y seguir disfrutando de todas las actividades del club.',
      accentColor: '#f59e0b',
      marginBottom: '0',
    });
  } else if (isExpired) {
    conditionalInfo = infoBox({
      icon: '❌',
      title: 'Licencia no válida',
      message: 'Tu licencia FEDME ya no está activa. Contacta con nosotros para renovarla.',
      accentColor: '#ef4444',
      marginBottom: '0',
    });
  }
  
  // Assemble email
  const content = [
    emailHeader('LICENCIA FEDME'),
    statusBadge({
      icon: config.icon,
      title: config.title,
      subtitle: config.subtitle,
      accentColor: config.accentColor,
    }),
    contentWrapper(
      greeting +
      detailsBox +
      conditionalInfo
    ),
    emailFooter(getFooterMessage(props.status), true),
  ].join('');
  
  return emailBase(content);
}

function generateLicenseText(props: LicenseMailProps): string {
  return `
${getStatusMessage(props.status).toUpperCase()}

Hola ${props.firstName},

${getStatusMessage(props.status)}

DETALLES DE TU LICENCIA:
Número de Socio: ${props.memberNumber}
${props.licenseNumber ? `Número de Licencia: ${props.licenseNumber}` : ''}
Tipo: ${formatLicenseType(props.licenseType)}
${props.validFrom ? `Válida desde: ${formatDate(props.validFrom)}` : ''}
Válida hasta: ${formatDate(props.validUntil)}

${props.status === 'activated' || props.status === 'renewed' ? '\n📱 ACCEDE EN LA APP FEDME:\nDescarga la app oficial de FEDME para tener tu licencia siempre disponible en tu móvil.\n' : ''}
${props.status === 'expiring' ? '\n⚠️ ACCIÓN REQUERIDA:\nTu licencia expira pronto. Contacta con nosotros para renovarla.\n' : ''}
${props.status === 'expired' ? '\n❌ LICENCIA NO VÁLIDA:\nTu licencia FEDME ya no está activa. Contacta con nosotros para renovarla.\n' : ''}

${getFooterMessage(props.status)}

Equipo Proyecto Cumbre
info@proyecto-cumbre.es
  `.trim();
}

function getStatusMessage(status: LicenseStatus): string {
  const messages: Record<LicenseStatus, string> = {
    activated: 'Tu licencia FEDME ya está activa y lista para usar.',
    renewed: 'Tu licencia FEDME ha sido renovada correctamente y ya está activa.',
    expiring: 'Tu licencia FEDME expirará pronto. Te recomendamos renovarla cuanto antes para seguir disfrutando de todas las actividades.',
    expired: 'Tu licencia FEDME ha expirado. Ya no está activa y necesitas renovarla para participar en actividades federadas.',
  };
  return messages[status];
}

function getFooterMessage(status: LicenseStatus): string {
  const messages: Record<LicenseStatus, string> = {
    activated: 'Nos vemos en la montaña',
    renewed: 'Nos vemos en la montaña',
    expiring: '¿Necesitas ayuda? Contáctanos',
    expired: '¿Necesitas ayuda? Contáctanos',
  };
  return messages[status];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
