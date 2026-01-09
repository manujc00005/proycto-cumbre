// ========================================
// LICENSE EMAIL TEMPLATE - PROFESSIONAL & MINIMAL
// Always-black dark theme enforced
// Handles license activation notifications
// lib/mail/templates/license-mail-template.ts
// ========================================

import { formatLicenseType, formatShortLicenseType } from '@/lib/constants';

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
  const isActive = ['activated', 'renewed'].includes(props.status);
  const isExpiring = props.status === 'expiring';
  const isExpired = props.status === 'expired';

  const statusConfig = {
    activated: { icon: '✓', color: '#10b981', title: 'Licencia activa', subtitle: 'Tu licencia FEDME está lista para usar' },
    renewed: { icon: '↻', color: '#3b82f6', title: 'Licencia renovada', subtitle: 'Tu licencia FEDME ha sido renovada correctamente' },
    expiring: { icon: '⚠️', color: '#f59e0b', title: 'Licencia próxima a expirar', subtitle: 'Renueva tu licencia antes de que expire' },
    expired: { icon: '×', color: '#ef4444', title: 'Licencia expirada', subtitle: 'Tu licencia FEDME ya no está activa' },
  };

  const config = statusConfig[props.status];

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

          <!-- HEADER -->
          <tr>
            <td style="padding: 48px 40px 32px 40px; text-align: center; background-color: #0a0a0a !important;">
              <h1 style="color: #f97316 !important; font-size: 28px; font-weight: 900; margin: 0 0 8px 0; letter-spacing: 1px;">PROYECTO CUMBRE</h1>
              <p style="color: #52525b !important; font-size: 12px; margin: 0; letter-spacing: 0.5px;">LICENCIA FEDME</p>
            </td>
          </tr>

          <!-- STATUS BADGE -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center; background-color: #0a0a0a !important;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; padding: 24px 32px; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 12px;">${config.icon}</div>
                    <h2 style="color: #fafafa !important; font-size: 18px; font-weight: 700; margin: 0 0 4px 0; letter-spacing: -0.5px;">${config.title}</h2>
                    <p style="color: #a1a1aa !important; font-size: 14px; margin: 0;">${config.subtitle}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding: 0 40px 48px 40px; background-color: #0a0a0a !important;">

              <p style="color: #fafafa !important; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Hola ${props.firstName},</p>
              <p style="color: #a1a1aa !important; font-size: 15px; margin: 0 0 32px 0; line-height: 1.7;">${getStatusMessage(props.status)}</p>

              <!-- LICENSE DETAILS -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <tr>
                  <td>
                    <h3 style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px;">Detalles de tu licencia</h3>

                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #27272a;">
                      <tr>
                        <td style="color: #71717a !important; font-size: 13px;">Número de Socio</td>
                        <td style="color: #fafafa !important; font-size: 14px; font-weight: 600; text-align: right;">${props.memberNumber}</td>
                      </tr>
                    </table>

                    ${props.licenseNumber ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #27272a;">
                      <tr>
                        <td style="color: #71717a !important; font-size: 13px;">Número de Licencia</td>
                        <td style="color: #fafafa !important; font-size: 14px; font-weight: 600; text-align: right; font-family: 'Courier New', monospace;">${props.licenseNumber}</td>
                      </tr>
                    </table>
                    ` : ''}

                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #27272a;">
                      <tr>
                        <td style="color: #71717a !important; font-size: 13px;">Tipo de Licencia</td>
                        <td style="color: #fafafa !important; font-size: 14px; font-weight: 600; text-align: right;">${formatLicenseType(props.licenseType)}</td>
                      </tr>
                    </table>

                    ${props.validFrom ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #27272a;">
                      <tr>
                        <td style="color: #71717a !important; font-size: 13px;">Válida desde</td>
                        <td style="color: #fafafa !important; font-size: 14px; font-weight: 600; text-align: right;">${formatDate(props.validFrom)}</td>
                      </tr>
                    </table>
                    ` : ''}

                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="color: #71717a !important; font-size: 13px;">Válida hasta</td>
                        <td style="color: ${isExpired ? '#ef4444' : isExpiring ? '#f59e0b' : '#10b981'} !important; font-size: 14px; font-weight: 600; text-align: right;">${formatDate(props.validUntil)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${isActive ? `
              <!-- FEDME APP INFO -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border-left: 3px solid #f97316; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
                <tr>
                  <td>
                    <p style="color: #fafafa !important; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">📱 Accede en la app FEDME</p>
                    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0;">Descarga la app oficial de FEDME para tener tu licencia siempre disponible en tu móvil.</p>
                  </td>
                </tr>
              </table>
              ` : ''}

              ${isExpiring ? `
              <!-- RENEWAL WARNING -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border-left: 3px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
                <tr>
                  <td>
                    <p style="color: #fafafa !important; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">⚠️ Acción requerida</p>
                    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0;">Tu licencia expira pronto. Contacta con nosotros para renovarla y seguir disfrutando de todas las actividades del club.</p>
                  </td>
                </tr>
              </table>
              ` : ''}

              ${isExpired ? `
              <!-- EXPIRED INFO -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border-left: 3px solid #ef4444; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
                <tr>
                  <td>
                    <p style="color: #fafafa !important; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">❌ Licencia no válida</p>
                    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0;">Tu licencia FEDME ya no está activa. Contacta con nosotros para renovarla.</p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- FOOTER -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding-top: 32px; border-top: 1px solid #27272a;">
                <tr>
                  <td style="text-align: center;">
                    <p style="color: #71717a !important; font-size: 13px; margin: 0 0 8px 0;">${getFooterMessage(props.status)}</p>
                    <p style="color: #f97316 !important; font-size: 14px; font-weight: 700; margin: 0 0 24px 0; letter-spacing: 0.5px;">EQUIPO PROYECTO CUMBRE</p>
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
